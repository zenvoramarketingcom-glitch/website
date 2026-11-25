export interface Mp4TrackSample {
  offset: number;
  size: number;
  timestampUs: number;
  durationUs: number;
  isKey: boolean;
}

export interface ParsedMp4Video {
  codec: string;
  description: Uint8Array;
  width: number;
  height: number;
  timescale: number;
  samples: Mp4TrackSample[];
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Cleans green screen fringe from RGBA pixel buffer in-place.
 */
export function cleanGreenEdgeRgba(data: Uint8ClampedArray): void {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const m = Math.max(r, b);
    const d = (g - m) / 255;
    if (d > 0) {
      data[i + 3] = Math.round(a * (1 - smoothstep(0.1, 0.38, d)));
      data[i + 1] = Math.min(g, Math.round(m * 0.96));
    }
  }
}

/**
 * Exact Section 2 glide-then-settle curve fraction at time t (seconds in 0..1.8).
 */
export function computeSection2CurveFraction(tSec: number): number {
  if (tSec >= 1.8) return 0;
  if (tSec <= 0) return 1;
  if (tSec < 0.47) {
    return 1 - 1.506 * tSec;
  }
  return 0.293 * Math.exp(-(tSec - 0.47) / 0.232);
}

/**
 * Generates the 55-keyframe Web Animations array for Section 2 enter/exit.
 */
export function buildSection2Keyframes(innerHeight: number, forward: boolean): Keyframe[] {
  const frames: Keyframe[] = [];
  const steps = 55;
  for (let k = 0; k < steps; k++) {
    const offset = k / 54;
    const t = offset * 1.8;
    const f = k === steps - 1 ? 0 : computeSection2CurveFraction(t);
    const frac = forward ? f : 1 - f;
    frames.push({
      offset,
      transform: `translateY(${(frac * innerHeight).toFixed(2)}px)`,
      opacity: 1,
    });
  }
  return frames;
}

function readAscii(bytes: Uint8Array, start: number, len: number): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out += String.fromCharCode(bytes[start + i]);
  }
  return out;
}

interface BoxHeader {
  type: string;
  start: number;
  end: number;
  headerSize: number;
}

function iterBoxes(bytes: Uint8Array, dv: DataView, start: number, end: number): BoxHeader[] {
  const boxes: BoxHeader[] = [];
  let pos = start;
  while (pos + 8 <= end) {
    let size = dv.getUint32(pos);
    const type = readAscii(bytes, pos + 4, 4);
    let headerSize = 8;
    if (size === 1) {
      if (pos + 16 > end) break;
      size = Number(dv.getBigUint64(pos + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - pos;
    }
    if (size < headerSize || pos + size > end) break;
    boxes.push({ type, start: pos, end: pos + size, headerSize });
    pos += size;
  }
  return boxes;
}

function findChild(bytes: Uint8Array, dv: DataView, box: BoxHeader, target: string): BoxHeader | null {
  const children = iterBoxes(bytes, dv, box.start + box.headerSize, box.end);
  return children.find((c) => c.type === target) ?? null;
}

/**
 * Parses a standard H.264/avc1 MP4 ArrayBuffer's moov box into WebCodecs-ready metadata and samples.
 */
export function parseMp4Moov(buffer: ArrayBufferLike): ParsedMp4Video {
  const bytes = new Uint8Array(buffer);
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const top = iterBoxes(bytes, dv, 0, bytes.length);
  const moov = top.find((b) => b.type === 'moov');
  if (!moov) throw new Error('MP4 moov box not found');

  const traks = iterBoxes(bytes, dv, moov.start + moov.headerSize, moov.end).filter(
    (b) => b.type === 'trak',
  );

  for (const trak of traks) {
    const mdia = findChild(bytes, dv, trak, 'mdia');
    if (!mdia) continue;
    const hdlr = findChild(bytes, dv, mdia, 'hdlr');
    if (!hdlr) continue;
    const handlerType = readAscii(bytes, hdlr.start + hdlr.headerSize + 8, 4);
    if (handlerType !== 'vide') continue;

    const mdhd = findChild(bytes, dv, mdia, 'mdhd');
    if (!mdhd) throw new Error('mdhd missing');
    const mdhdData = mdhd.start + mdhd.headerSize;
    const mdhdVer = bytes[mdhdData];
    const timescale =
      mdhdVer === 1 ? dv.getUint32(mdhdData + 20) : dv.getUint32(mdhdData + 12);

    const minf = findChild(bytes, dv, mdia, 'minf');
    if (!minf) throw new Error('minf missing');
    const stbl = findChild(bytes, dv, minf, 'stbl');
    if (!stbl) throw new Error('stbl missing');

    const stsd = findChild(bytes, dv, stbl, 'stsd');
    const stts = findChild(bytes, dv, stbl, 'stts');
    const stsc = findChild(bytes, dv, stbl, 'stsc');
    const stsz = findChild(bytes, dv, stbl, 'stsz');
    const stco = findChild(bytes, dv, stbl, 'stco');
    const co64 = findChild(bytes, dv, stbl, 'co64');
    const stss = findChild(bytes, dv, stbl, 'stss');
    const ctts = findChild(bytes, dv, stbl, 'ctts');

    if (!stsd || !stts || !stsc || !stsz || (!stco && !co64)) {
      throw new Error('Required sample table box missing');
    }

    // Parse stsd -> avc1/avc3 -> avcC
    const entryStart = stsd.start + stsd.headerSize + 8;
    const entrySize = dv.getUint32(entryStart);
    const width = dv.getUint16(entryStart + 32);
    const height = dv.getUint16(entryStart + 34);
    const sampleChildren = iterBoxes(bytes, dv, entryStart + 86, entryStart + entrySize);
    const avcC = sampleChildren.find((c) => c.type === 'avcC');
    if (!avcC) throw new Error('avcC box not found');

    const description = bytes.slice(avcC.start + avcC.headerSize, avcC.end);
    const prof = description[1].toString(16).padStart(2, '0');
    const comp = description[2].toString(16).padStart(2, '0');
    const lvl = description[3].toString(16).padStart(2, '0');
    const codec = `avc1.${prof}${comp}${lvl}`;

    // Parse stsz
    const stszData = stsz.start + stsz.headerSize;
    const defaultSize = dv.getUint32(stszData + 4);
    const sampleCount = dv.getUint32(stszData + 8);
    const sizes = new Uint32Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) {
      sizes[i] = defaultSize !== 0 ? defaultSize : dv.getUint32(stszData + 12 + i * 4);
    }

    // Parse stco / co64
    const chunkOffsets: number[] = [];
    if (stco) {
      const d = stco.start + stco.headerSize;
      const count = dv.getUint32(d + 4);
      for (let i = 0; i < count; i++) {
        chunkOffsets.push(dv.getUint32(d + 8 + i * 4));
      }
    } else if (co64) {
      const d = co64.start + co64.headerSize;
      const count = dv.getUint32(d + 4);
      for (let i = 0; i < count; i++) {
        chunkOffsets.push(Number(dv.getBigUint64(d + 8 + i * 8)));
      }
    }

    // Parse stsc -> sample offsets
    const stscData = stsc.start + stsc.headerSize;
    const stscEntries = dv.getUint32(stscData + 4);
    const stscRuns: Array<{ firstChunk: number; samplesPerChunk: number }> = [];
    for (let i = 0; i < stscEntries; i++) {
      stscRuns.push({
        firstChunk: dv.getUint32(stscData + 8 + i * 12),
        samplesPerChunk: dv.getUint32(stscData + 8 + i * 12 + 4),
      });
    }

    const offsets = new Float64Array(sampleCount);
    let sampleIdx = 0;
    for (let chunkIdx = 0; chunkIdx < chunkOffsets.length && sampleIdx < sampleCount; chunkIdx++) {
      const chunkOneBased = chunkIdx + 1;
      let runIdx = 0;
      while (runIdx + 1 < stscRuns.length && stscRuns[runIdx + 1].firstChunk <= chunkOneBased) {
        runIdx++;
      }
      const spc = stscRuns[runIdx].samplesPerChunk;
      let cursor = chunkOffsets[chunkIdx];
      for (let k = 0; k < spc && sampleIdx < sampleCount; k++) {
        offsets[sampleIdx] = cursor;
        cursor += sizes[sampleIdx];
        sampleIdx++;
      }
    }

    // Parse stts -> dts & duration
    const sttsData = stts.start + stts.headerSize;
    const sttsEntries = dv.getUint32(sttsData + 4);
    const dts = new Float64Array(sampleCount);
    const durations = new Float64Array(sampleCount);
    let s = 0;
    let curDts = 0;
    for (let i = 0; i < sttsEntries && s < sampleCount; i++) {
      const count = dv.getUint32(sttsData + 8 + i * 8);
      const delta = dv.getUint32(sttsData + 8 + i * 8 + 4);
      for (let k = 0; k < count && s < sampleCount; k++) {
        dts[s] = curDts;
        durations[s] = delta;
        curDts += delta;
        s++;
      }
    }

    // Optional ctts -> pts offset
    const ctsOffsets = new Int32Array(sampleCount);
    if (ctts) {
      const cttsData = ctts.start + ctts.headerSize;
      const cttsVer = bytes[cttsData];
      const cttsEntries = dv.getUint32(cttsData + 4);
      let c = 0;
      for (let i = 0; i < cttsEntries && c < sampleCount; i++) {
        const count = dv.getUint32(cttsData + 8 + i * 8);
        const off =
          cttsVer === 1
            ? dv.getInt32(cttsData + 8 + i * 8 + 4)
            : dv.getUint32(cttsData + 8 + i * 8 + 4);
        for (let k = 0; k < count && c < sampleCount; k++) {
          ctsOffsets[c] = off;
          c++;
        }
      }
    }

    // Parse stss keyframes
    const keySet = new Set<number>();
    if (stss) {
      const stssData = stss.start + stss.headerSize;
      const keyCount = dv.getUint32(stssData + 4);
      for (let i = 0; i < keyCount; i++) {
        keySet.add(dv.getUint32(stssData + 8 + i * 4) - 1);
      }
    } else {
      for (let i = 0; i < sampleCount; i++) keySet.add(i);
    }

    const samples: Mp4TrackSample[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const ptsTicks = dts[i] + ctsOffsets[i];
      samples.push({
        offset: offsets[i],
        size: sizes[i],
        timestampUs: Math.round((ptsTicks * 1_000_000) / timescale),
        durationUs: Math.round((durations[i] * 1_000_000) / timescale),
        isKey: keySet.has(i),
      });
    }

    return { codec, description, width, height, timescale, samples };
  }

  throw new Error('No video track found in MP4');
}

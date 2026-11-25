import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSection2Keyframes,
  cleanGreenEdgeRgba,
  computeSection2CurveFraction,
  parseMp4Moov,
  smoothstep,
} from './embersLogic';

test('smoothstep clamps and interpolates cleanly', () => {
  assert.equal(smoothstep(0.1, 0.38, 0.05), 0);
  assert.equal(smoothstep(0.1, 0.38, 0.5), 1);
  const mid = smoothstep(0.1, 0.38, 0.24);
  assert.ok(Math.abs(mid - 0.5) < 1e-6);
});

test('cleanGreenEdgeRgba suppresses green halo and leaves neutral pixels intact', () => {
  const buf = new Uint8ClampedArray([
    100, 220, 100, 255, // strong green fringe
    200, 120, 90, 255,  // copper/warm pixel (no green excess)
  ]);
  cleanGreenEdgeRgba(buf);
  assert.equal(buf[3], 0);
  assert.ok(buf[1] <= 96);
  assert.equal(buf[4], 200);
  assert.equal(buf[5], 120);
  assert.equal(buf[6], 90);
  assert.equal(buf[7], 255);
});

test('buildSection2Keyframes produces 55 frames ending at 0 forward and 1 reverse', () => {
  const fwd = buildSection2Keyframes(810, true);
  assert.equal(fwd.length, 55);
  assert.equal(fwd[0].offset, 0);
  assert.equal(fwd[54].offset, 1);
  assert.equal(fwd[0].transform, 'translateY(810.00px)');
  assert.equal(fwd[54].transform, 'translateY(0.00px)');

  const mid = computeSection2CurveFraction(0.47);
  assert.ok(Math.abs(mid - 0.29218) < 0.002);

  const rev = buildSection2Keyframes(810, false);
  assert.equal(rev[0].transform, 'translateY(0.00px)');
  assert.equal(rev[54].transform, 'translateY(810.00px)');
});

function makeBox(type: string, payload: Uint8Array): Uint8Array {
  const out = new Uint8Array(8 + payload.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, out.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(payload, 8);
  return out;
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((acc, p) => acc + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

test('parseMp4Moov extracts avc1 codec string, description, and samples', () => {
  const hdlrPayload = new Uint8Array(24);
  hdlrPayload.set([0x76, 0x69, 0x64, 0x65], 8); // 'vide'

  const mdhdPayload = new Uint8Array(24);
  new DataView(mdhdPayload.buffer).setUint32(12, 24000);

  const avcC = makeBox('avcC', new Uint8Array([1, 0x4d, 0x60, 0x1f, 0xff, 0xe1, 0, 1, 0x67]));
  const avc1Body = new Uint8Array(78 + avcC.length);
  const avc1Dv = new DataView(avc1Body.buffer);
  avc1Dv.setUint16(24, 1280);
  avc1Dv.setUint16(26, 716);
  avc1Body.set(avcC, 78);
  const avc1Box = makeBox('avc1', avc1Body);
  const stsdHeader = new Uint8Array(8);
  new DataView(stsdHeader.buffer).setUint32(4, 1);
  const stsd = makeBox('stsd', concatBytes(stsdHeader, avc1Box));

  const sttsP = new Uint8Array(16);
  const sttsDv = new DataView(sttsP.buffer);
  sttsDv.setUint32(4, 1);
  sttsDv.setUint32(8, 2);
  sttsDv.setUint32(12, 1000);
  const stts = makeBox('stts', sttsP);

  const stscP = new Uint8Array(20);
  const stscDv = new DataView(stscP.buffer);
  stscDv.setUint32(4, 1);
  stscDv.setUint32(8, 1);
  stscDv.setUint32(12, 2);
  stscDv.setUint32(16, 1);
  const stsc = makeBox('stsc', stscP);

  const stszP = new Uint8Array(20);
  const stszDv = new DataView(stszP.buffer);
  stszDv.setUint32(4, 0);
  stszDv.setUint32(8, 2);
  stszDv.setUint32(12, 500);
  stszDv.setUint32(16, 300);
  const stsz = makeBox('stsz', stszP);

  const stcoP = new Uint8Array(12);
  const stcoDv = new DataView(stcoP.buffer);
  stcoDv.setUint32(4, 1);
  stcoDv.setUint32(8, 2000);
  const stco = makeBox('stco', stcoP);

  const stssP = new Uint8Array(12);
  const stssDv = new DataView(stssP.buffer);
  stssDv.setUint32(4, 1);
  stssDv.setUint32(8, 1);
  const stss = makeBox('stss', stssP);

  const stbl = makeBox('stbl', concatBytes(stsd, stts, stsc, stsz, stco, stss));
  const minf = makeBox('minf', stbl);
  const mdia = makeBox('mdia', concatBytes(mdhdBox(mdhdPayload), makeBox('hdlr', hdlrPayload), minf));
  const trak = makeBox('trak', mdia);
  const moov = makeBox('moov', trak);

  const parsed = parseMp4Moov(moov.buffer);
  assert.equal(parsed.codec, 'avc1.4d601f');
  assert.equal(parsed.width, 1280);
  assert.equal(parsed.height, 716);
  assert.equal(parsed.samples.length, 2);
  assert.equal(parsed.samples[0].offset, 2000);
  assert.equal(parsed.samples[0].isKey, true);
  assert.equal(parsed.samples[1].offset, 2500);
  assert.equal(parsed.samples[1].isKey, false);
});

function mdhdBox(payload: Uint8Array): Uint8Array {
  return makeBox('mdhd', payload);
}

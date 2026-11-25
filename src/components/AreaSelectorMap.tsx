import { useMemo, useState } from 'react';
import { Globe, MapPin, Navigation } from 'lucide-react';
import { MAP_REGIONS, type MapRegion } from '../data/agencyData';
import { estimateTargetReach } from '../utils/agencyLogic';

export interface SelectedAreaValue {
  cityName: string;
  stateName: string;
  radiusKm: number;
  coverageMode: 'radius' | 'pan-india' | 'global';
  lat: number;
  lng: number;
  summary: string;
  estimatedAudience: string;
}

interface AreaSelectorMapProps {
  value: SelectedAreaValue;
  onChange: (next: SelectedAreaValue) => void;
  compact?: boolean;
}

const RADIUS_PRESETS = [5, 10, 25, 50, 100];

export function createDefaultAreaValue(): SelectedAreaValue {
  const defaultRegion = MAP_REGIONS[0];
  const est = estimateTargetReach(25, 'radius', defaultRegion.baseDensityPerKm2);
  return {
    cityName: defaultRegion.name,
    stateName: defaultRegion.state,
    radiusKm: 25,
    coverageMode: 'radius',
    lat: defaultRegion.lat,
    lng: defaultRegion.lng,
    summary: `${defaultRegion.name} · ${est.areaLabel}`,
    estimatedAudience: est.estimatedAudience,
  };
}

export function AreaSelectorMap({ value, onChange, compact = false }: AreaSelectorMapProps) {
  const [customPin, setCustomPin] = useState<{ x: number; y: number } | null>(null);

  const selectedRegion: MapRegion = useMemo(() => {
    return MAP_REGIONS.find((r) => r.name === value.cityName) ?? MAP_REGIONS[0];
  }, [value.cityName]);

  const pinPosition = customPin ?? { x: selectedRegion.xPercent, y: selectedRegion.yPercent };

  const updateSelection = (
    region: MapRegion,
    radiusKm: number,
    coverageMode: 'radius' | 'pan-india' | 'global',
    pinCoords?: { x: number; y: number; lat: number; lng: number },
  ) => {
    const est = estimateTargetReach(radiusKm, coverageMode, region.baseDensityPerKm2);
    const summary =
      coverageMode === 'pan-india'
        ? 'Pan-India (All Major Cities & States)'
        : coverageMode === 'global'
          ? 'Global / International Targeting'
          : `${pinCoords ? `Custom Zone near ${region.name}` : region.name} · ${radiusKm} km radius`;

    onChange({
      cityName: region.name,
      stateName: region.state,
      radiusKm,
      coverageMode,
      lat: pinCoords ? pinCoords.lat : region.lat,
      lng: pinCoords ? pinCoords.lng : region.lng,
      summary,
      estimatedAudience: est.estimatedAudience,
    });
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));

    // Find nearest region hub to calibrate coordinates & density
    let nearest = MAP_REGIONS[0];
    let bestDist = Infinity;
    for (const r of MAP_REGIONS) {
      const dist = Math.hypot(r.xPercent - xPercent, r.yPercent - yPercent);
      if (dist < bestDist) {
        bestDist = dist;
        nearest = r;
      }
    }

    const lat = Number((35 - (yPercent / 100) * 27).toFixed(4));
    const lng = Number((68 + (xPercent / 100) * 26).toFixed(4));

    setCustomPin({ x: xPercent, y: yPercent });
    updateSelection(nearest, value.radiusKm, 'radius', { x: xPercent, y: yPercent, lat, lng });
  };

  const circleSizePx = Math.min(180, Math.max(36, value.radiusKm * 1.75));

  return (
    <div
      data-testid="area-selector-map"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Target Area &amp; Radius Selector</h4>
          <p className="text-xs text-slate-500">
            Click anywhere on the map or choose a city to set coverage area
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => updateSelection(selectedRegion, value.radiusKm, 'radius')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              value.coverageMode === 'radius'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            City Radius
          </button>
          <button
            type="button"
            onClick={() => updateSelection(selectedRegion, value.radiusKm, 'pan-india')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              value.coverageMode === 'pan-india'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pan-India
          </button>
          <button
            type="button"
            onClick={() => updateSelection(selectedRegion, value.radiusKm, 'global')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              value.coverageMode === 'global'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global
          </button>
        </div>
      </div>

      {/* Interactive Cartographic Canvas */}
      <div
        role="region"
        aria-label="Interactive regional coverage map. Click to set target pin."
        onClick={handleMapClick}
        className={`relative mt-3 w-full overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50 cursor-crosshair select-none ${
          compact ? 'h-56' : 'h-64'
        }`}
      >
        {/* Subtle Cartographic Grid & Stylized India Silhouette Contours */}
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <pattern id="map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.6"
                strokeOpacity="0.55"
              />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#map-grid)" />
          {/* Stylized Peninsula & Highway Corridors */}
          <path
            d="M 168 32 L 210 42 L 238 78 L 285 95 L 330 112 L 315 148 L 268 165 L 235 206 L 195 268 L 166 262 L 136 205 L 105 162 L 82 135 L 116 105 L 138 68 Z"
            fill="#ffffff"
            fillOpacity="0.72"
            stroke="#94a3b8"
            strokeWidth="1.2"
          />
          <path
            d="M 192 84 L 112 174 M 192 84 L 176 231 M 112 174 L 196 192 L 312 141"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>

        {/* City Hub Pins */}
        {MAP_REGIONS.map((region) => {
          const isSelected = region.name === value.cityName && !customPin && value.coverageMode === 'radius';
          return (
            <button
              key={region.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCustomPin(null);
                updateSelection(region, value.radiusKm, 'radius');
              }}
              style={{ left: `${region.xPercent}%`, top: `${region.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 focus-visible:outline-none"
              aria-label={`Select ${region.name}`}
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full border transition-transform ${
                  isSelected
                    ? 'bg-blue-700 border-white scale-125 shadow-sm'
                    : 'bg-slate-400 border-white group-hover:bg-blue-600 group-hover:scale-125'
                }`}
              />
              <span
                className={`mt-0.5 block rounded px-1 py-0.5 text-[10px] font-medium whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white/85 text-slate-700 group-hover:text-slate-900'
                }`}
              >
                {region.name}
              </span>
            </button>
          );
        })}

        {/* Active Target Radius Circle */}
        {value.coverageMode === 'radius' && (
          <div
            style={{
              left: `${pinPosition.x}%`,
              top: `${pinPosition.y}%`,
              width: `${circleSizePx}px`,
              height: `${circleSizePx}px`,
            }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-600/70 bg-blue-500/15 transition-all duration-200 z-0"
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-700">
              <MapPin className="h-4 w-4 fill-blue-600 text-white" />
            </span>
          </div>
        )}

        {value.coverageMode !== 'radius' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-blue-600/10">
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-blue-900 shadow-xs">
              <Globe className="h-3.5 w-3.5 text-blue-700" />
              <span>
                {value.coverageMode === 'pan-india'
                  ? 'Nationwide India Campaign Targeting Active'
                  : 'International Multi-Country Targeting Active'}
              </span>
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[11px] font-mono-num text-slate-600 border border-slate-200/80">
          {value.lat.toFixed(2)}°N, {value.lng.toFixed(2)}°E
        </div>
      </div>

      {/* Radius & Quick City Controls */}
      <div className="mt-3 space-y-3">
        {value.coverageMode === 'radius' && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="radius-slider" className="font-medium text-slate-700">
                Area Radius Coverage
              </label>
              <span className="font-mono-num font-semibold text-blue-700">{value.radiusKm} km</span>
            </div>
            <input
              id="radius-slider"
              type="range"
              min={3}
              max={100}
              value={value.radiusKm}
              onChange={(e) =>
                updateSelection(selectedRegion, Number(e.target.value), 'radius')
              }
              className="w-full accent-blue-700 cursor-pointer"
            />
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {RADIUS_PRESETS.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => updateSelection(selectedRegion, km, 'radius')}
                  className={`px-2 py-1 text-[11px] font-mono-num rounded border transition-colors whitespace-nowrap shrink-0 ${
                    value.radiusKm === km
                      ? 'border-blue-700 bg-blue-50 text-blue-800 font-medium'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 border border-slate-200/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
            <Navigation className="h-3.5 w-3.5 text-blue-700 shrink-0" />
            <span>{value.summary}</span>
          </div>
          <span className="font-mono-num text-slate-600">
            Est. reach: {value.estimatedAudience}
          </span>
        </div>
      </div>
    </div>
  );
}

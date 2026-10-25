import React, { useMemo } from 'react';
import {
  Region,
  RegionId,
  Polity,
  TradeOrMigrationRoute,
} from '../types/history';
import { formatYear } from '../utils/timeLayout';
import { Globe, Compass, Navigation, Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface WorldMapPanelProps {
  regions: Region[];
  visibleRegionIds: RegionId[];
  polities: Polity[];
  routes: TradeOrMigrationRoute[];
  activeYear: number;
  selectedPolityId: string | null;
  onSelectPolity: (id: string) => void;
  onFocusRegion: (regionId: RegionId) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
}

export const WorldMapPanel: React.FC<WorldMapPanelProps> = ({
  regions,
  visibleRegionIds,
  polities,
  routes,
  activeYear,
  selectedPolityId,
  onSelectPolity,
  onFocusRegion,
  expanded,
  onToggleExpand,
  onClose,
}) => {
  const regionById = useMemo(
    () => Object.fromEntries(regions.map((r) => [r.id, r])) as Record<RegionId, Region>,
    [regions]
  );

  // Active polities in each region at activeYear
  const activeSpansByRegion = useMemo(() => {
    const map: Record<string, Array<{ polity: Polity; weight: number }>> = {};
    for (const p of polities) {
      for (const s of p.spans) {
        if (activeYear >= s.startYear && activeYear <= s.endYear) {
          if (!map[s.regionId]) map[s.regionId] = [];
          map[s.regionId].push({ polity: p, weight: s.weight });
        }
      }
    }
    // Sort by weight descending so dominant empire is primary
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => b.weight - a.weight);
    }
    return map;
  }, [polities, activeYear]);

  // Active trans-regional empires (occupying 2+ regions at activeYear)
  const transRegionalBridges = useMemo(() => {
    const bridges: Array<{
      polity: Polity;
      fromCenter: [number, number];
      toCenter: [number, number];
    }> = [];

    for (const p of polities) {
      const activeRegions = p.spans
        .filter((s) => activeYear >= s.startYear && activeYear <= s.endYear)
        .map((s) => regionById[s.regionId])
        .filter(Boolean);

      if (activeRegions.length >= 2) {
        for (let i = 0; i < activeRegions.length - 1; i++) {
          bridges.push({
            polity: p,
            fromCenter: activeRegions[i].mapCenter,
            toCenter: activeRegions[i + 1].mapCenter,
          });
        }
      }
    }
    return bridges;
  }, [polities, activeYear, regionById]);

  const activeRoutes = useMemo(
    () => routes.filter((r) => activeYear >= r.startYear && activeYear <= r.endYear),
    [routes, activeYear]
  );

  return (
    <aside
      className={`world-map-panel ${expanded ? 'is-expanded' : ''}`}
      aria-label="Synchronized Historical World Map"
    >
      <div className="map-panel-header">
        <div className="map-panel-title">
          <Globe size={16} className="accent-icon" />
          <span>Geopolitical Atlas @ {formatYear(activeYear)}</span>
        </div>
        <div className="map-panel-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleExpand}
            title={expanded ? 'Compact Map Size' : 'Expand Map View'}
          >
            {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            title="Hide Map Panel"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="map-svg-container">
        <svg
          viewBox="80 65 860 390"
          className="historical-world-svg"
          role="img"
          aria-label={`World map showing active civilizations in ${formatYear(activeYear)}`}
        >
          <defs>
            <radialGradient id="mapOceanGrad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="var(--map-ocean-inner)" />
              <stop offset="100%" stopColor="var(--map-ocean-outer)" />
            </radialGradient>
            <filter id="empireGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Graticule gridlines */}
          <rect x="80" y="65" width="860" height="390" fill="url(#mapOceanGrad)" rx="8" />
          {[140, 215, 290, 365].map((y) => (
            <line
              key={`lat-${y}`}
              x1="80"
              y1={y}
              x2="940"
              y2={y}
              stroke="var(--grid-line)"
              strokeDasharray="3 5"
              strokeWidth="0.8"
            />
          ))}
          {[200, 350, 500, 650, 800].map((x) => (
            <line
              key={`lon-${x}`}
              x1={x}
              y1="65"
              x2={x}
              y2="455"
              stroke="var(--grid-line)"
              strokeDasharray="3 5"
              strokeWidth="0.8"
            />
          ))}

          {/* Equator Line */}
          <line
            x1="80"
            y1="275"
            x2="940"
            y2="275"
            stroke="var(--border-subtle)"
            strokeWidth="1"
            strokeDasharray="6 4"
          />

          {/* Simplified Stylized Continental Landmasses */}
          <g className="map-continents" fill="var(--map-land)" stroke="var(--map-coast)" strokeWidth="1.2">
            {/* North & Central America */}
            <path d="M110,95 L295,90 L305,155 L255,215 L245,268 L215,272 L175,235 L135,175 Z" />
            {/* South America */}
            <path d="M235,272 L345,305 L335,385 L278,442 L250,430 L238,340 Z" />
            {/* Europe */}
            <path d="M435,88 L615,85 L615,175 L525,180 L445,175 Z" />
            {/* Africa */}
            <path d="M442,188 L592,188 L618,265 L575,415 L515,415 L490,305 L438,265 Z" />
            {/* Asia */}
            <path d="M595,88 L905,95 L895,245 L825,295 L745,285 L700,288 L665,235 L595,235 Z" />
            {/* Japan, Philippines, Indonesia & Australia hint */}
            <path d="M862,155 L888,162 L882,202 L856,195 Z" />
            <path d="M795,275 L905,285 L915,335 L805,325 Z" />
            <path d="M825,355 L920,355 L918,430 L820,425 Z" />
          </g>

          {/* Active Trade & Migration Routes */}
          {activeRoutes.map((route) => {
            const pts = route.waypoints
              .map((wp) => regionById[wp.regionId]?.mapCenter)
              .filter(Boolean);
            if (pts.length < 2) return null;
            const d = pts
              .map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt[0]},${pt[1]}`)
              .join(' ');
            return (
              <g key={route.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={route.color}
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animated-route-line"
                  opacity="0.85"
                />
              </g>
            );
          })}

          {/* Trans-regional Empire Bridges */}
          {transRegionalBridges.map((b, i) => (
            <line
              key={`${b.polity.id}-bridge-${i}`}
              x1={b.fromCenter[0]}
              y1={b.fromCenter[1]}
              x2={b.toCenter[0]}
              y2={b.toCenter[1]}
              stroke={b.polity.color}
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.65"
            />
          ))}

          {/* Regional Polygons & Active Empire Territories */}
          {regions.map((region) => {
            const activeInRegion = activeSpansByRegion[region.id] || [];
            const dominant = activeInRegion[0];
            const isVisibleColumn = visibleRegionIds.includes(region.id);
            const isSelected =
              dominant && dominant.polity.id === selectedPolityId;

            const fillColor = dominant ? dominant.polity.color : 'transparent';
            const radius = dominant ? 14 + dominant.weight * 16 : 7;

            return (
              <g
                key={region.id}
                className="map-region-group"
                onClick={() => {
                  if (dominant) {
                    onSelectPolity(dominant.polity.id);
                  }
                  onFocusRegion(region.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={region.mapPolygon}
                  fill={fillColor}
                  fillOpacity={dominant ? (isVisibleColumn ? 0.52 : 0.22) : 0.06}
                  stroke={dominant ? dominant.polity.color : region.color}
                  strokeWidth={isSelected ? 2.8 : 1.3}
                  strokeDasharray={isVisibleColumn ? undefined : '2 2'}
                />

                {/* Pulsing Empire Hub Circle */}
                <circle
                  cx={region.mapCenter[0]}
                  cy={region.mapCenter[1]}
                  r={radius}
                  fill={dominant ? dominant.polity.color : 'var(--surface-elevated)'}
                  fillOpacity={dominant ? 0.78 : 0.45}
                  stroke={isSelected ? '#ffffff' : 'var(--text-primary)'}
                  strokeWidth={isSelected ? 2.5 : 1}
                  filter={isSelected ? 'url(#empireGlow)' : undefined}
                />

                {/* Region & Active Polity Label */}
                <text
                  x={region.mapCenter[0]}
                  y={region.mapCenter[1] - radius - 5}
                  textAnchor="middle"
                  className="map-region-label"
                >
                  {region.shortName}
                </text>
                {dominant && (
                  <text
                    x={region.mapCenter[0]}
                    y={region.mapCenter[1] + 3}
                    textAnchor="middle"
                    className="map-polity-label"
                  >
                    {dominant.polity.name.split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="map-panel-footer">
        <div className="map-active-routes">
          {activeRoutes.length > 0 ? (
            activeRoutes.map((r) => (
              <span
                key={r.id}
                className="route-chip"
                style={{ borderColor: r.color }}
              >
                <Compass size={11} style={{ color: r.color }} />
                {r.name}
              </span>
            ))
          ) : (
            <span className="map-hint">
              <Navigation size={11} /> Click any territory on the map to inspect its empire & scroll timeline
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

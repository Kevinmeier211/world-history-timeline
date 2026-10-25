import React, { useMemo } from 'react';
import {
  Region,
  RegionId,
  Polity,
  HistoricalEra,
  CrossCuttingBand,
} from '../types/history';
import { PALEOCLIMATE_CURVE } from '../data';
import { formatYear, MIN_YEAR, MAX_YEAR } from '../utils/timeLayout';
import {
  Play,
  Pause,
  Thermometer,
  ChevronUp,
  ChevronDown,
  Zap,
  Clock,
} from 'lucide-react';

interface YearSnapshotBarProps {
  activeYear: number;
  onChangeYear: (year: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  visibleRegions: Region[];
  polities: Polity[];
  eras: HistoricalEra[];
  bands: CrossCuttingBand[];
  selectedPolityId: string | null;
  onSelectPolity: (id: string) => void;
  onJumpToYearAndRegion: (year: number, regionId?: RegionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const YearSnapshotBar: React.FC<YearSnapshotBarProps> = ({
  activeYear,
  onChangeYear,
  isPlaying,
  onTogglePlay,
  visibleRegions,
  polities,
  eras,
  bands,
  selectedPolityId,
  onSelectPolity,
  onJumpToYearAndRegion,
  collapsed,
  onToggleCollapse,
}) => {
  const currentEra = useMemo(
    () =>
      eras.find((e) => activeYear >= e.startYear && activeYear <= e.endYear) ||
      eras[eras.length - 1],
    [eras, activeYear]
  );

  const activeBands = useMemo(
    () =>
      bands.filter((b) => activeYear >= b.startYear && activeYear <= b.endYear),
    [bands, activeYear]
  );

  // Interpolate paleoclimate delta for activeYear
  const climateStatus = useMemo(() => {
    for (let i = 0; i < PALEOCLIMATE_CURVE.length - 1; i++) {
      const a = PALEOCLIMATE_CURVE[i];
      const b = PALEOCLIMATE_CURVE[i + 1];
      if (!a || !b) continue;
      if (activeYear >= a.year && activeYear <= b.year) {
        const t = (activeYear - a.year) / Math.max(1, b.year - a.year);
        const val = a.tempDeltaC + t * (b.tempDeltaC - a.tempDeltaC);
        const nearLabel = Math.abs(activeYear - a.year) < 140 ? a.label : b.label;
        return { delta: val, label: nearLabel };
      }
    }
    return { delta: 0, label: undefined };
  }, [activeYear]);

  // Active polities per visible region at activeYear
  const regionSnapshots = useMemo(() => {
    return visibleRegions.map((reg) => {
      const matches: Polity[] = [];
      for (const p of polities) {
        const hasSpan = p.spans.some(
          (s) =>
            s.regionId === reg.id &&
            activeYear >= s.startYear &&
            activeYear <= s.endYear
        );
        if (hasSpan) matches.push(p);
      }
      return { region: reg, activePolities: matches };
    });
  }, [visibleRegions, polities, activeYear]);

  const totalActiveCount = regionSnapshots.reduce(
    (acc, r) => acc + r.activePolities.length,
    0
  );

  return (
    <section
      className={`year-snapshot-bar ${collapsed ? 'is-collapsed' : ''}`}
      aria-label="Synchronized World Year Snapshot"
    >
      <div className="snapshot-control-row">
        <div className="snapshot-year-cluster">
          <button
            type="button"
            className={`play-timelapse-btn ${isPlaying ? 'is-playing' : ''}`}
            onClick={onTogglePlay}
            title={
              isPlaying
                ? 'Pause Historical Time-Lapse'
                : 'Play 5,300-Year Historical Time-Lapse'
            }
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Time-Lapse'}</span>
          </button>

          <div className="snapshot-year-readout">
            <Clock size={14} className="accent-icon" />
            <strong>{formatYear(activeYear)}</strong>
            {currentEra && (
              <span
                className="era-badge-mini"
                style={{ backgroundColor: currentEra.color }}
              >
                {currentEra.shortName}
              </span>
            )}
          </div>
        </div>

        <div className="snapshot-slider-wrap">
          <span className="slider-bound-label">3300 BCE</span>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={activeYear}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            className="year-scrubber-input"
            aria-label="Scrub through historical years from 3300 BCE to 2025 CE"
          />
          <span className="slider-bound-label">2025 CE</span>
        </div>

        <div className="snapshot-climate-cluster">
          <span
            className={`climate-pill ${
              climateStatus.delta >= 0 ? 'is-warm' : 'is-cool'
            }`}
            title={
              climateStatus.label ||
              'Holocene relative temperature anomaly (°C vs 1900 baseline)'
            }
          >
            <Thermometer size={13} />
            <span>
              {climateStatus.delta >= 0 ? '+' : ''}
              {climateStatus.delta.toFixed(2)}°C
            </span>
            {climateStatus.label && (
              <small className="climate-note">{climateStatus.label}</small>
            )}
          </span>

          {activeBands[0] && (
            <span
              className="active-band-alert"
              style={{ borderColor: activeBands[0].color }}
            >
              <Zap size={12} style={{ color: activeBands[0].color }} />
              {activeBands[0].title}
            </span>
          )}

          <button
            type="button"
            className="snapshot-collapse-btn"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand Synchronism Cards' : 'Minimize Cards'}
          >
            <span>Synchronism ({totalActiveCount})</span>
            {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="snapshot-cards-strip">
          {regionSnapshots.map(({ region, activePolities }) => (
            <div key={region.id} className="snapshot-region-card">
              <div
                className="snapshot-region-header"
                style={{ borderBottomColor: region.color }}
              >
                <span
                  className="region-dot"
                  style={{ backgroundColor: region.color }}
                />
                <span className="snapshot-region-name">{region.shortName}</span>
              </div>
              <div className="snapshot-polities-list">
                {activePolities.length > 0 ? (
                  activePolities.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`snapshot-polity-pill ${
                        selectedPolityId === p.id ? 'is-selected' : ''
                      }`}
                      style={{
                        borderLeft: `3px solid ${p.color}`,
                      }}
                      onClick={() => {
                        onSelectPolity(p.id);
                        onJumpToYearAndRegion(activeYear, region.id);
                      }}
                    >
                      <span className="polity-pill-name">{p.name}</span>
                    </button>
                  ))
                ) : (
                  <span className="snapshot-empty">
                    Pre-state / Local Chiefdoms
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

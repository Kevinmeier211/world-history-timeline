import { splitDateLine } from './geometry';
import { asset } from './data';
import { formatYear } from '../lib/years';
import type { Subject, Relation } from './model';
import { useEffect, useRef, useState } from 'react';
import { clusterPoints } from './map-clusters';
import { fitMapView, worldMapView, worldXY as xy, type MapView } from './map-view';
export function AtlasMap({
  subjects,
  selected,
  year,
  onSelect,
  relation,
  nearbyIds = [],
  compact = false,
  onOpen = onSelect,
}: {
  subjects: Subject[];
  selected: string | null;
  year: number;
  onSelect: (s: Subject) => void;
  relation?: Relation;
  nearbyIds?: string[];
  compact?: boolean;
  onOpen?: (s: Subject) => void;
}) {
  const [box, setBox] = useState<MapView>(worldMapView);
  const [focusedId, setFocusedId] = useState(selected);
  const focused = subjects.find((s) => s.id === (compact ? selected : focusedId));
  const canvas = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry!.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const groups = clusterPoints(
    subjects
      .map((s) => {
        const [x, y] = xy(s.coordinates);
        return {
          x: ((x - box[0]) / box[2]) * 100,
          y: ((y - box[1]) / box[3]) * 100,
          item: s,
        };
      })
      .filter((p) => p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100),
    width,
    width / 2,
  );
  const zoom = (factor: number) => {
    const width = Math.min(720, Math.max(90, box[2] * factor));
    const center = focused;
    const [cx, cy] = center
      ? xy(center.coordinates)
      : [box[0] + box[2] / 2, box[1] + box[3] / 2];
    setBox([
      Math.max(0, Math.min(720 - width, cx - width / 2)),
      Math.max(0, Math.min(360 - width / 2, cy - width / 4)),
      width,
      width / 2,
    ]);
  };
  const pan = (dx: number, dy: number) =>
    setBox([
      Math.max(0, Math.min(720 - box[2], box[0] + (dx * box[2]) / 4)),
      Math.max(0, Math.min(360 - box[3], box[1] + (dy * box[3]) / 4)),
      box[2],
      box[3],
    ]);
  return (
    <section
      className={`map-panel ${compact ? 'compact-map' : ''}`}
      aria-label={`Geographic overview around ${formatYear(year)}`}
    >
      <div className="map-caption">
        <h2>Places across the world</h2>
        <strong>{formatYear(year)}</strong>
      </div>
      <details className="map-navigation" open={compact ? undefined : true}>
        <summary>Map controls &amp; place finder</summary>
        <div className="map-controls" aria-label="Map navigation">
          <button onClick={() => zoom(0.5)} disabled={box[2] <= 90}>
            Zoom in
          </button>
          <button onClick={() => zoom(2)} disabled={box[2] >= 720}>
            Zoom out
          </button>
          <button
            onClick={() => {
              setBox(
                fitMapView([
                  ...subjects.map((s) => s.coordinates),
                  ...(relation?.route ?? []),
                ]),
              );
              setChoiceIds([]);
            }}
          >
            Fit shown places
          </button>
          <button
            onClick={() => {
              setBox(worldMapView);
              setChoiceIds([]);
            }}
          >
            Whole world
          </button>
          <button
            aria-label="Move map west"
            onClick={() => pan(-1, 0)}
            disabled={box[0] === 0}
          >
            ←
          </button>
          <button
            aria-label="Move map east"
            onClick={() => pan(1, 0)}
            disabled={box[0] + box[2] >= 720}
          >
            →
          </button>
          <button
            aria-label="Move map north"
            onClick={() => pan(0, -1)}
            disabled={box[1] === 0}
          >
            ↑
          </button>
          <button
            aria-label="Move map south"
            onClick={() => pan(0, 1)}
            disabled={box[1] + box[3] >= 360}
          >
            ↓
          </button>
        </div>
        <div className="map-place-picker">
          <label htmlFor="map-place-picker">Locate a place</label>
          <select
            id="map-place-picker"
            value={focused?.id ?? ''}
            onChange={(event) => {
              const subject = subjects.find((s) => s.id === event.target.value);
              if (subject) {
                setFocusedId(subject.id);
                if (compact) onSelect(subject);
                setBox(fitMapView([subject.coordinates]));
                setChoiceIds([]);
              }
            }}
          >
            <option value="" disabled>
              Choose a named place
            </option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.place} · {s.interval.label}
              </option>
            ))}
          </select>
        </div>
      </details>
      <div className="map-canvas" ref={canvas}>
        <svg
          role="img"
          aria-label="Coastline for orientation. Select a labelled marker or use the equivalent place list below."
          viewBox={box.join(' ')}
        >
          <rect width="720" height="360" fill="var(--sea)" />
          <image href={asset('/atlas/land.svg')} width="720" height="360" />
          {[60, 120, 180, 240, 300].map((y) => (
            <line key={y} x1="0" x2="720" y1={y} y2={y} className="graticule" />
          ))}
          {relation?.route &&
            splitDateLine(relation.route).map((segment, i) => (
              <polyline
                key={i}
                points={segment.map((p) => xy(p).join(',')).join(' ')}
                className="route-line"
              />
            ))}
          {[
            [145, 195, 'Pacific Ocean'],
            [320, 168, 'Atlantic Ocean'],
            [520, 225, 'Indian Ocean'],
          ].map(([x, y, label]) => (
            <text
              key={String(label)}
              x={Number(x)}
              y={Number(y)}
              className="ocean-label"
            >
              {label}
            </text>
          ))}
        </svg>
        {groups.map((group) => {
          const s = group.points[0]!.item;
          const left = Math.max(2200 / width, Math.min(100 - 2200 / width, group.x));
          const top = Math.max(4400 / width, Math.min(100 - 4400 / width, group.y));
          if (group.points.length > 1)
            return (
              <button
                key={group.points.map((p) => p.item.id).join('-')}
                className="map-hit map-cluster"
                data-cluster="true"
                style={{ left: `${left}%`, top: `${top}%` }}
                aria-label={`${group.points.length} places: ${group.points.map((p) => p.item.name).join(', ')}. Choose a place.`}
                aria-controls={choiceIds.length ? 'map-cluster-choices' : undefined}
                aria-expanded={group.points.every((p) => choiceIds.includes(p.item.id))}
                onClick={() => setChoiceIds(group.points.map((p) => p.item.id))}
              >
                {group.points.length}
              </button>
            );
          const nearby = nearbyIds.includes(s.id);
          return (
            <button
              key={s.id}
              className={`map-hit ${s.id === focused?.id ? 'selected' : ''} ${nearby ? 'nearby' : ''}`}
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => onSelect(s)}
              aria-label={`${s.name} · ${s.interval.label}${nearby ? ' · nearby context, different date' : ''}`}
              aria-current={s.id === selected ? 'true' : undefined}
            >
              <span className="map-dot" />
              <span
                className={`map-label ${top < 40 ? 'below' : ''} ${left < 25 ? 'label-east' : left > 75 ? 'label-west' : ''}`}
              >
                {s.name}
              </span>
            </button>
          );
        })}
      </div>
      {focused && !compact && (
        <section className="map-focus" aria-live="polite">
          <h3>{focused.place}</h3>
          <p>{focused.geographicPrecision}</p>
          <p>
            {focused.interval.label}
            {nearbyIds.includes(focused.id) ? ' · Reading from a different date' : ''}
          </p>
          <button onClick={() => onOpen(focused)}>Read {focused.name} →</button>
        </section>
      )}
      {choiceIds.length > 0 && (
        <section
          id="map-cluster-choices"
          className="map-cluster-choices"
          aria-live="polite"
        >
          <h3>Choose one of these neighboring places</h3>
          <p>They overlap at this scale. Each keeps its own dates.</p>
          {subjects
            .filter((s) => choiceIds.includes(s.id))
            .map((s) => (
              <button key={s.id} onClick={() => onSelect(s)}>
                {s.name}
                <small>
                  {s.interval.label}
                  {nearbyIds.includes(s.id) ? ' · different date' : ''}
                </small>
              </button>
            ))}
        </section>
      )}
      <details className="map-conventions" open={compact ? undefined : true}>
        <summary>Map conventions &amp; all named places</summary>
        {compact && focused && (
          <p className="map-note">
            {focused.place}. {focused.geographicPrecision}
          </p>
        )}
        <p className="map-note">
          Coastline for orientation. Points mark cities or broad regional anchors, not
          borders or exact object findspots. Filled markers include this year; outlined
          markers are nearby reading suggestions. Zoom in to separate neighbouring
          places; every marker also has a button below. Numbered markers open a choice
          of places that overlap at this scale.
          {relation &&
            ` Dashed line: schematic network with intermediaries. Connection context: ${relation.date}.`}
        </p>
        <div className="locator-list">
          {subjects.map((s) => (
            <button
              key={s.id}
              aria-current={s.id === selected ? 'true' : undefined}
              onClick={() => onSelect(s)}
            >
              {s.name}
              <span>
                {s.place} · {s.interval.label}
                {nearbyIds.includes(s.id) ? ' · different date' : ''}
              </span>
            </button>
          ))}
        </div>
      </details>
    </section>
  );
}

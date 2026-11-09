import { useEffect, useRef, useState } from 'react';
import type { PlaceStudy, Source } from './model';
import { Citations } from './Evidence';
import { asset } from './data';
import { clusterPoints } from './map-clusters';
import { placeProjection } from './place-projection';

export function PlaceMap({ study, sources }: { study: PlaceStudy; sources: Source[] }) {
  const [selected, setSelected] = useState(study.points[0]?.id);
  const canvas = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [overlap, setOverlap] = useState<string[]>([]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry!.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const point = study.points.find((p) => p.id === selected) ?? study.points[0];
  const { xy, land } = placeProjection(study.bounds, study.crossesAntimeridian);
  const groups = clusterPoints(
    study.points.map((p, i) => {
      const [x, y] = xy(p.coordinates);
      return {
        x: (x! / 720) * 100,
        y: (y! / 420) * 100,
        item: { ...p, number: i + 1 },
      };
    }),
    width,
    (width * 420) / 720,
  );
  return (
    <section className="place-study" aria-label={study.title}>
      <h2>{study.title}</h2>
      <p>{study.description}</p>
      <div className="place-map-canvas" ref={canvas} data-layout-width={width}>
        <svg
          role="img"
          aria-label={`${study.title}. Approximate geographic locators, with an equivalent place list below.`}
          viewBox="0 0 720 420"
        >
          <rect width="720" height="420" className="place-map-ground" />
          {study.background === 'coastline' && (
            <>
              <rect width="720" height="420" fill="var(--sea)" />
              <image
                href={asset('/atlas/land.svg')}
                {...land}
                preserveAspectRatio="none"
              />
              {study.crossesAntimeridian && (
                <image
                  href={asset('/atlas/land.svg')}
                  {...land}
                  x={land.x + land.width}
                  preserveAspectRatio="none"
                />
              )}
            </>
          )}
          {[100, 200, 300].map((y) => (
            <line key={y} x1="20" x2="700" y1={y} y2={y} className="graticule" />
          ))}
          <text x="680" y="32" className="map-north">
            N ↑
          </text>
          {study.features.map((feature) => (
            <g key={feature.label}>
              <polyline
                className={`place-feature ${feature.kind}`}
                points={feature.points.map((p) => xy(p).join(',')).join(' ')}
              >
                <title>
                  {feature.label}: {feature.note}
                </title>
              </polyline>
            </g>
          ))}
        </svg>
        {groups.map((group) => {
          const p = group.points[0]!.item;
          const numbers = group.points.map((p) => p.item.number).join(' + ');
          if (group.points.length > 1)
            return (
              <button
                key={numbers}
                className="place-point place-cluster"
                style={{ left: `${group.x}%`, top: `${group.y}%` }}
                onClick={() => setOverlap(group.points.map((p) => p.item.id))}
                aria-label={`${numbers}: neighboring places. Choose a named place below.`}
              >
                {numbers}
              </button>
            );
          return (
            <button
              key={p.id}
              className={`place-point ${p.id === point?.id ? 'selected' : ''}`}
              style={{ left: `${group.x}%`, top: `${group.y}%` }}
              onClick={() => setSelected(p.id)}
              aria-label={`${p.number}. Examine ${p.label}`}
              aria-pressed={p.id === point?.id}
            >
              {p.number}
            </button>
          );
        })}
      </div>
      {overlap.length > 0 && (
        <div className="place-overlap-choices" aria-live="polite">
          <p>These places overlap at this scale. Select one to read its context.</p>
          {study.points
            .filter((p) => overlap.includes(p.id))
            .map((p) => (
              <button key={p.id} onClick={() => setSelected(p.id)}>
                Examine {p.label}
              </button>
            ))}
        </div>
      )}
      <div className="place-index" aria-label="Places on the map">
        {study.points.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            aria-pressed={p.id === point?.id}
          >
            {i + 1}. {p.label}
          </button>
        ))}
      </div>
      {point && (
        <article className="place-explanation" aria-live="polite">
          <h3>{point.label}</h3>
          <p>{point.text}</p>
          <Citations citations={point.citations} sources={sources} />
        </article>
      )}
      <details>
        <summary>How to read this map</summary>
        <p>
          Locators are approximate. Shapes simplify geography for orientation; they are
          not surveyed boundaries, reconstructed political territory or a map of
          individual journeys. North is up. The local projection keeps a consistent
          scale in each direction at the central latitude; it does not preserve
          distances everywhere.
        </p>
        {study.features.map((feature) => (
          <div key={feature.label}>
            <p>
              <strong>{feature.label}.</strong> {feature.note}
            </p>
            <Citations citations={feature.citations} sources={sources} />
          </div>
        ))}
      </details>
    </section>
  );
}

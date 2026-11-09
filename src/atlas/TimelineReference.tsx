import { useEffect, useRef, useState } from 'react';
import type { RuntimeCorpus, RuntimePack as Pack, Subject } from './model';
import { regions } from './model';
import { formatYear, toT } from '../lib/years';
import type { Location } from './navigation';
import { asset } from './data';
import { projectInterval } from './geometry';
import { ChronologyOverview } from './ChronologyOverview';
import { ChapterRegionalReading } from './RegionalReading';
const regionColors: Record<string, string> = {
  Americas: 'var(--atlas-c-ecd6c5)',
  Africa: 'var(--atlas-c-eadfb5)',
  Europe: 'var(--atlas-c-dbe3d6)',
  'West/Central Asia': 'var(--atlas-c-e7d6ca)',
  'South Asia': 'var(--atlas-c-ddddbc)',
  'East Asia': 'var(--atlas-c-d1e1e6)',
  'Southeast Asia/Oceania': 'var(--atlas-c-e0d9e9)',
};
export function TimelineReference({
  corpus,
  location,
  pack,
  openSubject,
  openPack,
}: {
  corpus: RuntimeCorpus;
  location: Location;
  pack: Pack;
  openSubject: (s: Subject) => void;
  openPack: (p: Pack) => void;
}) {
  const chart = useRef<HTMLDivElement>(null);
  const [showChart, setShowChart] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  useEffect(() => {
    const container = chart.current;
    const target = container?.querySelector<HTMLElement>('.readable-track.selected');
    if (container && target)
      container.scrollLeft =
        target.offsetLeft -
        container.offsetLeft -
        container.clientWidth / 2 +
        target.clientWidth / 2;
  }, [location.subject, location.scale, location.pack, location.region]);
  if (location.scale === 'world')
    return (
      <section className="world-timeline" aria-label="World history overview">
        <ChronologyOverview
          corpus={corpus}
          region={location.region}
          openSubject={openSubject}
        />
        <div className="world-rows">
          {corpus.packs.map((p, i) => {
            const subjects = corpus.subjects.filter(
              (s) =>
                s.packs.includes(p.id) &&
                (location.region === 'all' || s.region === location.region),
            );
            return (
              <article
                key={p.id}
                className={`era-row ${p.id === location.pack ? 'active' : ''}`}
              >
                <div className="era-ruler">
                  <span>{formatYear(p.start)}</span>
                  <span className="ruler-dot" />
                  <span>{formatYear(p.end)}</span>
                </div>
                <div className="era-story">
                  <span className="eyebrow">Chapter {i + 1}</span>
                  <h2>
                    <button onClick={() => openPack(p)}>
                      {p.title} <span aria-hidden="true">↗</span>
                    </button>
                  </h2>
                  <p>{p.question}</p>
                  <button className="text-link" onClick={() => openPack(p)}>
                    Explore this chapter
                  </button>
                </div>
                <div className="era-anchors">
                  {(p.featuredSubjects ?? [])
                    .map((id) => subjects.find((s) => s.id === id))
                    .filter((s): s is Subject => !!s)
                    .map((s, anchorIndex) => {
                      const object = corpus.media.find((m) =>
                        s.objectIds.includes(m.id),
                      );
                      return (
                        <button key={s.id} onClick={() => openSubject(s)}>
                          {object && (
                            <img
                              src={asset(object.thumbnail)}
                              alt=""
                              width="88"
                              height="88"
                              loading={i === 0 && anchorIndex === 0 ? 'eager' : 'lazy'}
                              fetchPriority={
                                i === 0 && anchorIndex === 0 ? 'high' : 'auto'
                              }
                            />
                          )}
                          <span>
                            {s.name}
                            <small>{s.region}</small>
                          </span>
                        </button>
                      );
                    })}
                  <p className="scope-count">
                    {subjects.length} subjects · Open chapter for all regional coverage
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  const visible = corpus.subjects.filter(
    (s) =>
      s.packs.includes(pack.id) &&
      (location.region === 'all' ||
        s.region === location.region ||
        s.id === location.subject),
  );
  const lanes = regions.filter(
    (r) =>
      location.region === 'all' ||
      location.region === r ||
      visible.some((s) => s.id === location.subject && s.region === r),
  );
  const window = pack.displayWindow ?? { start: pack.start, end: pack.end };
  const years = [
    window.start,
    ...[0.25, 0.5, 0.75].map((x) => {
      const t = Math.round(
        toT(window.start) + (toT(window.end) - toT(window.start)) * x,
      );
      return t <= 0 ? t - 1 : t;
    }),
    window.end,
  ];
  return (
    <section className="era-timeline">
      <div className="chapter-intro">
        <p className="eyebrow">
          {formatYear(pack.start)} — {formatYear(pack.end)}
        </p>
        <h2>{pack.title}</h2>
        <button
          className="phone-background-toggle"
          aria-expanded={showBackground}
          aria-controls="chapter-background"
          onClick={() => setShowBackground((visible) => !visible)}
        >
          {showBackground ? 'Hide chapter setting' : 'Chapter setting and scope'}
        </button>
        <div
          id="chapter-background"
          className={`chapter-background ${showBackground ? 'expanded' : ''}`}
        >
          <p className="lead">{pack.orientation}</p>
          <p>{pack.geography}</p>
        </div>
      </div>
      <ChapterRegionalReading
        key={`${pack.id}:${location.region}`}
        corpus={corpus}
        chapter={pack.id}
        selectedRegion={location.region}
        openSubject={openSubject}
      />
      <button
        className="phone-chart-toggle"
        aria-expanded={showChart}
        aria-controls="chapter-time-chart"
        onClick={() => setShowChart((visible) => !visible)}
      >
        {showChart
          ? 'Hide proportional chapter timeline'
          : 'Show proportional chapter timeline'}
      </button>
      <div
        id="chapter-time-chart"
        className={`proportional-chart ${showChart ? 'expanded' : ''}`}
      >
        <p className="scale-note">
          Linear time within this chapter
          {pack.displayWindow
            ? `, including context from ${formatYear(window.start)}`
            : ''}
          . Ranges describe each subject’s defined scope. Color groups geography; track
          width measures no population or territory.
        </p>
        <div
          ref={chart}
          className="era-chart-scroll"
          role="region"
          aria-label="Regional timeline; horizontal scroll reveals the time axis"
        >
          <div className="readable-chart">
            <div className="horizontal-axis">
              <strong>Time →</strong>
              <div>
                {years.map((y, i) => (
                  <span key={i} style={{ left: `${i * 25}%` }}>
                    {formatYear(y)}
                  </span>
                ))}
              </div>
            </div>
            {lanes.map((r) => (
              <section
                className="readable-lane"
                key={r}
                style={{ borderColor: regionColors[r] }}
              >
                <h2>{r}</h2>
                {visible
                  .filter((s) => s.region === r)
                  .map((s) => {
                    const bar = projectInterval(
                      s.interval.start,
                      s.interval.end,
                      window,
                    );
                    return (
                      <button
                        key={s.id}
                        className={`readable-track ${s.id === location.subject ? 'selected' : ''}`}
                        onClick={() => openSubject(s)}
                        aria-current={s.id === location.subject ? 'true' : undefined}
                      >
                        <span className="track-label">
                          <strong>{s.name}</strong>
                          <small>{s.interval.label}</small>
                        </span>
                        <span className="track-space" aria-hidden="true">
                          {toT(location.year) >= toT(window.start) &&
                            toT(location.year) <= toT(window.end) && (
                              <span
                                className="current-year-line"
                                style={{
                                  left: `${(100 * (toT(location.year) - toT(window.start))) / (toT(window.end) - toT(window.start))}%`,
                                }}
                              />
                            )}
                          {bar ? (
                            <span
                              className="duration-bar"
                              style={{
                                left: `${bar.left}%`,
                                width: `max(7px, ${bar.width}%)`,
                                background: regionColors[r],
                              }}
                            >
                              {bar.clippedStart ? '‹' : ''}
                              {bar.clippedEnd ? '›' : ''}
                            </span>
                          ) : (
                            <span className="context-outside">
                              Context outside this chapter
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                {!visible.some((s) => s.region === r) && (
                  <p className="coverage-gap">{pack.coverage[r].reason}</p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
      <section className="subject-directory">
        <h2>Read the chapter</h2>
        <p>
          Every released subject is available here, including short intervals that need
          more space than a timeline mark.
        </p>
        <div className="subject-grid">
          {visible.map((s) => {
            const o = corpus.media.find((m) => s.objectIds.includes(m.id));
            return (
              <button
                className="subject-card"
                key={s.id}
                onClick={() => openSubject(s)}
              >
                {o && (
                  <img
                    src={asset(o.thumbnail)}
                    alt=""
                    width="220"
                    height="180"
                    loading="lazy"
                  />
                )}
                <span className="eyebrow">
                  {s.region} · {s.kind}
                </span>
                <strong>{s.name}</strong>
                <span>{s.question}</span>
                <small>{s.interval.label}</small>
              </button>
            );
          })}
        </div>
      </section>
      <details className="coverage-panel">
        <summary>Coverage and limits of this chapter</summary>
        <p>{pack.limits}</p>
        {regions.map((r) => (
          <p key={r}>
            <strong>
              {r}: {pack.coverage[r].status}.
            </strong>{' '}
            {pack.coverage[r].reason}
          </p>
        ))}
      </details>
    </section>
  );
}

/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- The named horizontal scroll region needs keyboard focus for arrow-key scrolling. */
import { useRef, useState } from 'react';
import type { RuntimeCorpus, Subject } from './model';
import { regions } from './model';
import { formatYear, toT } from '../lib/years';
import { projectInterval } from './geometry';
import { Citations } from './Evidence';
import { overviewAnchors, overviewNames } from './overview-data';

export function ChronologyOverview({
  corpus,
  region,
  openSubject,
}: {
  corpus: RuntimeCorpus;
  region: string;
  openSubject: (s: Subject) => void;
}) {
  const [selected, setSelected] = useState('roman-world');
  const [showChart, setShowChart] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const available = overviewAnchors
    .map((id) => corpus.subjects.find((s) => s.id === id))
    .filter((s): s is Subject => !!s && (region === 'all' || s.region === region));
  const active = available.find((s) => s.id === selected) ?? available[0];
  const contextFor = (s: Subject) =>
    (corpus.contexts ?? []).find((c) => s.contextIds?.includes(c.id));
  const activeContext = active && contextFor(active);
  const window = { start: -3300, end: 2000 };
  const position = (year: number) =>
    ((toT(year) - toT(window.start)) / (toT(window.end) - toT(window.start))) * 100;
  return (
    <section className="chronology-overview" aria-labelledby="chronology-title">
      <div className="chronology-heading">
        <h2 id="chronology-title">See histories alongside one another</h2>
        <p>
          Choose a label to see its dates and open the story. Broad context and case
          dates are shown separately.
        </p>
      </div>
      <button
        className="phone-chart-toggle"
        aria-expanded={showChart}
        aria-controls="overview-time-chart"
        onClick={() => setShowChart((visible) => !visible)}
      >
        {showChart
          ? 'Hide proportional world timeline'
          : 'Show proportional world timeline'}
      </button>
      <div
        id="overview-time-chart"
        className={`proportional-chart ${showChart ? 'expanded' : ''}`}
      >
        <div className="actions chronology-jumps" aria-label="Move along the overview">
          {[
            [-3000, 'caral'],
            [200, 'roman-world'],
            [1200, 'angkor'],
            [1950, 'partition-1947'],
          ].map(([year, id]) => (
            <button
              key={id}
              onClick={() => {
                setSelected(String(id));
                const element = scroll.current;
                if (element)
                  element.scrollTo({
                    left: Math.max(
                      0,
                      160 +
                        (position(Number(year)) / 100) * (element.scrollWidth - 280) -
                        (element.clientWidth + 160) / 2,
                    ),
                    behavior: 'auto',
                  });
              }}
            >
              Around {formatYear(Number(year))}
            </button>
          ))}
        </div>
        <div
          ref={scroll}
          className="chronology-scroll"
          role="region"
          aria-label="World chronology, scroll horizontally for later dates"
          tabIndex={0}
        >
          <div className="chronology-grid">
            <div className="chronology-axis">
              <strong>Region / time →</strong>
              <div>
                {[-3000, -2000, -1000, 1, 1000, 2000].map((year) => (
                  <span key={year} style={{ left: `${position(year)}%` }}>
                    {formatYear(year)}
                  </span>
                ))}
              </div>
            </div>
            {regions
              .filter((r) => region === 'all' || region === r)
              .map((r) => (
                <div className="chronology-lane" key={r}>
                  <h3>{r}</h3>
                  <div className="chronology-space">
                    {available
                      .filter((s) => s.region === r)
                      .map((s, index) => {
                        const context = contextFor(s);
                        const interval = context?.interval ?? s.interval;
                        const bar = projectInterval(
                          interval.start,
                          interval.ongoing ? window.end : interval.end,
                          window,
                        );
                        if (!bar) return null;
                        return (
                          <div
                            key={s.id}
                            className={`chronology-item ${context ? 'reference' : 'case'}`}
                            style={{
                              top: `${(index % 2) * 48 + 8}px`,
                              left: `${bar.left}%`,
                              width: `max(2px, ${bar.width}%)`,
                            }}
                          >
                            <span className="chronology-span" aria-hidden="true" />
                            <button
                              className="chronology-marker"
                              aria-pressed={active?.id === s.id}
                              onClick={() => setSelected(s.id)}
                              aria-label={`${overviewNames[s.id] ?? s.name.split(':')[0]}. ${s.name}: ${interval.label}. ${context ? 'Reference context' : 'Case-study dates'}`}
                            >
                              <span>{overviewNames[s.id] ?? s.name.split(':')[0]}</span>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <p className="scope-note">
          The axis is proportional to time. Strong lines show researched reference
          frames; fine lines show the selected case’s dates. Short events remain
          markers. These are selected histories, not a complete list of societies or
          evidence of contact.
        </p>
        {active && (
          <article className="chronology-preview" aria-live="polite">
            <div>
              <p className="eyebrow">
                {active.region} · {activeContext ? 'Reference context' : 'Case study'}
              </p>
              <h3>{activeContext?.title ?? active.name}</h3>
              <p>{activeContext?.interval.label ?? active.interval.label}</p>
              <p>{activeContext?.summary ?? active.summary}</p>
              <p className="scope-note">
                {activeContext?.interval.note ?? active.interval.note}
              </p>
              {activeContext && (
                <Citations
                  citations={activeContext.citations}
                  sources={corpus.sources}
                />
              )}
            </div>
            <button onClick={() => openSubject(active)}>Read {active.name} →</button>
          </article>
        )}
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';
import type { Corpus } from './model';
import { formatYear } from '../lib/years';
import {
  posterRows,
  posterTicks,
  posterPosition,
  posterRange,
  posterWidth,
  posterLabelWidth,
  posterSources,
  posterSourceGroups,
  posterNoteGroups,
} from './poster-layout';

export function WorldPoster({ c, footer }: { c: Corpus; footer: ReactNode }) {
  const rows = posterRows(c);
  return (
    <article className="print-page world-poster">
      <header>
        <p>CHRONOS · SELECTED HISTORIES, 3300 BCE TO 2000 CE</p>
        <h1>Different places. Shared time.</h1>
        <p>
          Follow a date down the page to see selected histories alongside one another.
          Numbers lead to the regional reading companion and its sources.
        </p>
      </header>
      <div className="poster-legend">
        <span>
          <i className="poster-reference-key" /> Reference frame
        </span>
        <span>
          <i className="poster-case-key" /> Case dates
        </span>
        <span>
          <i className="poster-marker-key" /> Short interval or single year
        </span>
        <span>c. = approximate; full date qualifications are in the companion.</span>
      </div>
      <div className="poster-axis">
        <strong>Region / time</strong>
        <div>
          {posterTicks.map((year) => (
            <span
              key={year}
              className={
                year === -3300 ? 'first-tick' : year === 2000 ? 'last-tick' : ''
              }
              style={{ left: `${posterPosition(year) * 100}%` }}
            >
              {formatYear(year)}
            </span>
          ))}
        </div>
      </div>
      <div className="poster-rows">
        {rows.map((row) => (
          <section className="poster-row" key={row.region}>
            <h2>{row.region}</h2>
            <ol className="poster-events">
              {posterTicks.map((year) => (
                <li
                  key={`tick-${year}`}
                  className="poster-gridline"
                  aria-hidden="true"
                  style={{ left: `${posterPosition(year) * 100}%` }}
                />
              ))}
              {row.entries.map((entry) => {
                const middle = entry.projection.left + entry.projection.width / 2;
                const labelMiddle =
                  ((entry.labelLeft + posterLabelWidth / 2) / posterWidth) * 100;
                return (
                  <li
                    key={entry.subject.id}
                    value={entry.key}
                    className={`poster-event ${entry.context ? 'poster-reference' : 'poster-case'}`}
                    data-subject={entry.subject.id}
                    data-start={entry.interval.start}
                    data-end={entry.interval.end}
                    data-reference={entry.context?.id ?? ''}
                    style={{ top: `${entry.track * 13}mm` }}
                  >
                    <span
                      className={`poster-time-bar ${entry.marker ? 'short-interval' : ''}`}
                      aria-hidden="true"
                      style={{
                        left: `${entry.marker ? middle : entry.projection.left}%`,
                        width: `${entry.projection.width}%`,
                      }}
                    />
                    <svg
                      className="poster-leader"
                      aria-hidden="true"
                      viewBox="0 0 1000 12"
                      preserveAspectRatio="none"
                    >
                      <path d={`M${middle * 10},0 L${labelMiddle * 10},12`} />
                    </svg>
                    <div
                      className="poster-label"
                      style={{ left: `${(entry.labelLeft / posterWidth) * 100}%` }}
                    >
                      <strong>
                        {entry.key}. {entry.name}
                      </strong>
                      <span>{posterRange(entry)}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
      <div className="poster-reading-guide">
        <section>
          <h2>Read the lines, then ask</h2>
          <p>
            The time axis is proportional, with no year zero. The lines carry the dates;
            labels move aside to stay readable. Find a year where two lines overlap.
            What different kinds of evidence might explain those histories?
          </p>
        </section>
        <section>
          <h2>Selection has limits</h2>
          <p>
            These 25 anchors are not a complete list of societies. A case can cover an
            object or event; a reference frame supplies a wider, defined context.
            Overlap proves no contact. Regional rows locate examples, not political
            borders or routes. Read the companion before making a historical claim.
          </p>
        </section>
      </div>
      {footer}
    </article>
  );
}

export function PosterNotes({ c, footer }: { c: Corpus; footer: ReactNode }) {
  const sources = posterSources(c);
  const groups = posterSourceGroups(sources);
  const regionalSheets = posterRows(c).flatMap((row) => {
    const sheets = posterNoteGroups(row.entries, sources);
    return sheets.map((entries, i) => ({
      region: row.region,
      part: i + 1,
      parts: sheets.length,
      entries,
    }));
  });
  return (
    <>
      {regionalSheets.map((row) => (
        <article
          className="print-page poster-note-page"
          key={`${row.region}-${row.part}`}
        >
          <header>
            <p>
              WORLD POSTER · REGIONAL READING COMPANION · {row.part} OF {row.parts}
            </p>
            <h1>{row.region}</h1>
            <p>
              Read in chronological order. Numbers match the poster. Reference dates and
              the narrower case are kept separate; these selections do not form a route
              or a complete regional history.
            </p>
          </header>
          <div className="poster-note-grid">
            {row.entries.map((entry) => (
              <section
                className="poster-note-card"
                key={entry.subject.id}
                data-subject={entry.subject.id}
              >
                <p className="poster-note-kind">
                  {entry.context ? 'Reference frame' : 'Case dates'} · {entry.key}
                </p>
                <h2>{entry.context?.title ?? entry.subject.name}</h2>
                <p>
                  <strong>{entry.interval.label}</strong>
                </p>
                <p>{entry.context?.summary ?? entry.subject.summary}</p>
                <p className="poster-date-note">{entry.interval.note}</p>
                {entry.context && (
                  <p className="poster-case-note">
                    <strong>The case: {entry.subject.name}.</strong>{' '}
                    {entry.subject.interval.label}. {entry.subject.interval.note}
                  </p>
                )}
                <p>
                  <strong>Place:</strong> {entry.subject.place}
                </p>
                <p className="poster-source-keys">
                  <strong>Sources:</strong>{' '}
                  {sources
                    .filter((s) => s.uses.some((use) => use.key === entry.key))
                    .map((s, i) => (
                      <span key={s.id}>
                        {i > 0 ? ', ' : ''}[{s.number}]
                      </span>
                    ))}
                  . Titles, locators and consultation limits follow.
                </p>
              </section>
            ))}
          </div>
          <section className="poster-note-reflection">
            <h2>Carry a question back</h2>
            <p>
              Choose one example. Which dates describe a broad frame, and which describe
              a particular object, event or institution? Write one claim the evidence
              supports and one question these selections cannot answer.
            </p>
          </section>
          {footer}
        </article>
      ))}
      {groups.map((group, i) => (
        <article className="print-page poster-source-page" key={i}>
          <header>
            <p>
              WORLD POSTER · SOURCE NOTES {i + 1} OF {groups.length}
            </p>
            <h1>Follow the evidence</h1>
            <p>
              Bracketed numbers match the regional sheets. Source consultation scopes
              are retained from the atlas; this print redesign is not a new historical
              verification or independent review.
            </p>
          </header>
          {group.map((source) => (
            <section className="poster-source" key={source.id}>
              <h2>
                [{source.number}] {source.title}
              </h2>
              <p>
                {source.author ? `${source.author}. ` : ''}
                {source.institution}. Consulted {source.accessed}.
              </p>
              <p>
                {source.uses
                  .map((use) => `Poster ${use.key}: ${use.locators.join('; ')}`)
                  .join(' · ')}
              </p>
              <p>{source.scope}</p>
              <p className="poster-source-url">
                <a href={source.url}>{source.url}</a>
              </p>
            </section>
          ))}
          {footer}
        </article>
      ))}
    </>
  );
}

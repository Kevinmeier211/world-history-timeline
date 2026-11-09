import { useId, useState } from 'react';
import { formatYear, fromT, parseYearQuery, toT } from '../lib/years';
import { coverageGap, nearbyDateLabel, worldAtTime } from './chronology';
import { adjacentMoments, timeMoments } from './time-navigation';
import { regions, type RuntimeCorpus, type Subject } from './model';

export function TimeNavigator({
  corpus,
  year,
  region,
  goYear,
  range = { start: -3300, end: 2000 },
  onPreview,
}: {
  corpus: RuntimeCorpus;
  year: number;
  region: string;
  goYear: (year: number) => void;
  range?: { start: number; end: number };
  onPreview?: (year: number) => void;
}) {
  const [draft, setDraft] = useState(Math.max(-3300, Math.min(2000, year)));
  const [text, setText] = useState(formatYear(year));
  const [error, setError] = useState('');
  const id = useId();
  const { earlier, later } = adjacentMoments(timeMoments(corpus, region), year);
  const bounds =
    year >= range.start && year <= range.end ? range : { start: -3300, end: 2000 };
  return (
    <section className="time-navigator compact-time" aria-label="Explore time">
      <form
        className="time-scrubber"
        onSubmit={(event) => {
          event.preventDefault();
          goYear(draft);
        }}
      >
        <label htmlFor={id}>
          <span>{draft === year ? 'Around' : 'Previewing'}</span>
          <output htmlFor={id}>{formatYear(draft)}</output>
        </label>
        <div className="time-slider-track">
          <input
            id={id}
            type="range"
            min={toT(bounds.start)}
            max={toT(bounds.end)}
            step={1}
            value={toT(draft)}
            aria-label="Move through time"
            aria-valuetext={formatYear(draft)}
            onChange={(event) => {
              const next = fromT(Number(event.target.value));
              setDraft(next);
              setText(formatYear(next));
              setError('');
              onPreview?.(next);
            }}
          />
          <div className="time-range-ends">
            <span>{formatYear(bounds.start)}</span>
            <span>{formatYear(bounds.end)}</span>
          </div>
        </div>
        <button disabled={draft === year}>Explore {formatYear(draft)}</button>
      </form>
      {draft !== year && (
        <p className="scope-note" role="status">
          Previewing {formatYear(draft)}. Choose Explore to save this moment in your
          navigation history.
        </p>
      )}
      <details className="date-more">
        <summary>More date controls</summary>
        <form
          className="date-jump"
          onSubmit={(event) => {
            event.preventDefault();
            const next = parseYearQuery(text);
            if (next === null || next < -3300 || next > 2000) {
              setError('Enter a year from 3300 BCE to 2000 CE. There is no year zero.');
              return;
            }
            setError('');
            goYear(next);
          }}
        >
          <label htmlFor={`${id}-year`}>Go to year</label>
          <input
            id={`${id}-year`}
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={error ? true : undefined}
          />
          <button>Go</button>
        </form>
        {error && (
          <p id={`${id}-error`} role="alert">
            {error}
          </p>
        )}
        <div className="moment-steps">
          <button
            disabled={earlier === undefined}
            onClick={() => earlier !== undefined && goYear(earlier)}
          >
            ← Earlier context
            <small>
              {earlier === undefined ? 'Start of atlas' : formatYear(earlier)}
            </small>
          </button>
          <button
            disabled={later === undefined}
            onClick={() => later !== undefined && goYear(later)}
          >
            Later context →
            <small>{later === undefined ? 'End of atlas' : formatYear(later)}</small>
          </button>
        </div>
        <div className="actions time-anchors" aria-label="Time shortcuts">
          {[200, 1200, 1950].map((y) => (
            <button key={y} aria-pressed={y === year} onClick={() => goYear(y)}>
              {formatYear(y)}
            </button>
          ))}
          <button disabled={year <= -3300} onClick={() => goYear(fromT(toT(year) - 1))}>
            Previous year
          </button>
          <button disabled={year >= 2000} onClick={() => goYear(fromT(toT(year) + 1))}>
            Next year
          </button>
        </div>
        <p className="scope-note">
          Earlier/later context steps through chapter anchors and dated phases already
          described in the atlas. The slider chooses any year; nearby readings keep
          their own dates.
        </p>
      </details>
    </section>
  );
}

/** A readable alternative to sideways timeline scrolling on small screens. */
export function TimeSlice({
  corpus,
  year,
  region,
  openSubject,
}: {
  corpus: RuntimeCorpus;
  year: number;
  region: string;
  openSubject: (s: Subject) => void;
}) {
  const snapshot = worldAtTime(corpus, year, region);
  return (
    <section
      className="compact-timeslice"
      aria-label={`Regional reading at ${formatYear(year)}`}
    >
      <h2>At {formatYear(year)}</h2>
      <p>
        Reference frames and case studies have different scopes. Compare their dates
        before opening a reading.
      </p>
      {regions
        .filter((r) => region === 'all' || region === r)
        .map((r) => {
          const contexts = snapshot.contexts.filter((c) => c.region === r);
          const covered = new Set(contexts.flatMap((c) => c.subjectIds));
          const cases = snapshot.current.filter(
            (s) => s.region === r && !covered.has(s.id),
          );
          const nearby = snapshot.nearby.find((s) => s.region === r);
          return (
            <section key={r} className="time-slice-region">
              <h3>{r}</h3>
              {contexts.map((c) => (
                <article key={c.id}>
                  <p className="eyebrow">Reference frame · {c.interval.label}</p>
                  <h4>{c.title}</h4>
                  <p>{c.summary}</p>
                  {c.subjectIds.map((id) => {
                    const subject = corpus.subjects.find((s) => s.id === id);
                    return (
                      subject && (
                        <button key={id} onClick={() => openSubject(subject)}>
                          Read {subject.name}
                          <small>Case dates: {subject.interval.label}</small>
                        </button>
                      )
                    );
                  })}
                </article>
              ))}
              {cases.length > 0 && (
                <div className="time-slice-cases">
                  {cases.map((s) => (
                    <button key={s.id} onClick={() => openSubject(s)}>
                      {s.name}
                      <small>Includes this year · {s.interval.label}</small>
                    </button>
                  ))}
                </div>
              )}
              {!contexts.length && !cases.length && !nearby && (
                <p className="scope-note coverage-gap">{coverageGap}</p>
              )}
              {nearby && !covered.has(nearby.id) && (
                <button
                  className="time-slice-nearby"
                  onClick={() => openSubject(nearby)}
                >
                  Nearby reading: {nearby.name}
                  <small>
                    {nearbyDateLabel(nearby.interval, year)} · {nearby.interval.label}
                  </small>
                </button>
              )}
            </section>
          );
        })}
    </section>
  );
}

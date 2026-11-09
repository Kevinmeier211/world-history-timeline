import { useEffect, useId, useState } from 'react';
import type { RegionalOrientation, RuntimeCorpus, Subject } from './model';
import { loadRegionalOrientations } from './data';
import { Citations } from './Evidence';

export function RegionalOrientationReading({
  reading,
  corpus,
  openSubject,
}: {
  reading: RegionalOrientation;
  corpus: RuntimeCorpus;
  openSubject: (s: Subject) => void;
}) {
  return (
    <article className="regional-reading">
      <h3>{reading.title}</h3>
      <a
        href={`?print=regional&pack=${encodeURIComponent(reading.chapter)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Print these regional settings
      </a>
      <p className="lead">{reading.question}</p>
      <p>{reading.summary.text}</p>
      <Citations citations={reading.summary.citations} sources={corpus.sources} />
      {reading.sections.map((section) => (
        <section key={section.title}>
          <h4>{section.title}</h4>
          <p>{section.text}</p>
          <Citations citations={section.citations} sources={corpus.sources} />
        </section>
      ))}
      <p>
        <strong>Whose experience can we recover?</strong> {reading.perspectives}
      </p>
      <p className="scope-note">{reading.scope}</p>
      <section className="regional-evidence-question">
        <h4>Try the evidence question</h4>
        <p>{reading.activity.prompt}</p>
        <details>
          <summary>Compare your reasoning</summary>
          <p>{reading.activity.response}</p>
        </details>
      </section>
      <div className="regional-next-reading">
        {reading.subjectIds.map((id) => {
          const subject = corpus.subjects.find((s) => s.id === id);
          return subject ? (
            <button key={id} onClick={() => openSubject(subject)}>
              Read {subject.name}
            </button>
          ) : null;
        })}
      </div>
    </article>
  );
}

export function ChapterRegionalReading({
  corpus,
  chapter,
  selectedRegion = 'all',
  openSubject,
}: {
  corpus: RuntimeCorpus;
  chapter: string;
  selectedRegion?: string;
  openSubject: (s: Subject) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState(selectedRegion);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    chapter: string;
    rows: RegionalOrientation[];
    failed: boolean;
  } | null>(null);
  const supplied = corpus.orientations?.filter((o) => o.chapter === chapter);
  const available = !!supplied?.length || corpus.orientationChapters?.includes(chapter);
  const current = result?.chapter === chapter ? result : null;
  const rows = supplied?.length ? supplied : (current?.rows ?? []);
  useEffect(() => {
    if (!open || !available || supplied?.length) return;
    let active = true;
    loadRegionalOrientations(chapter)
      .then((loaded) => {
        if (active) setResult({ chapter, rows: loaded, failed: false });
      })
      .catch(() => {
        if (active) setResult({ chapter, rows: [], failed: true });
      });
    return () => {
      active = false;
    };
  }, [chapter, open, attempt, available, supplied?.length]);
  if (!available) return null;
  const selected =
    rows.find((o) => o.region === region) ??
    rows.find((o) => o.region === selectedRegion) ??
    rows[0];
  return (
    <details
      className="chapter-regional-reading"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>Read the regional settings</summary>
      {open && !rows.length && !current?.failed && (
        <p role="status">Loading regional reading…</p>
      )}
      {open && current?.failed && (
        <p role="status">
          Regional reading could not load.{' '}
          <button
            onClick={() => {
              setResult(null);
              setAttempt((n) => n + 1);
            }}
          >
            Try again
          </button>
        </p>
      )}
      {open && selected && (
        <>
          <label htmlFor={id}>Choose a regional setting</label>
          <select
            id={id}
            value={selected.region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {rows.map((o) => (
              <option key={o.id} value={o.region}>
                {o.region}
              </option>
            ))}
          </select>
          <RegionalOrientationReading
            reading={selected}
            corpus={corpus}
            openSubject={openSubject}
          />
        </>
      )}
    </details>
  );
}

import { useEffect, useMemo, useState } from 'react';
import type { RuntimeCorpus, HistoricalContext, Subject } from './model';
import { formatYear } from '../lib/years';
import { Citations } from './Evidence';
import { loadReferenceContexts } from './data';

type ReferenceReading = {
  key: string;
  status: 'loading' | 'ready' | 'failed';
  contexts: HistoricalContext[];
};

export function ReferenceTimeline({
  subject,
  corpus,
}: {
  subject: Subject;
  corpus: RuntimeCorpus;
}) {
  const contexts = useMemo(
    () =>
      (corpus.contexts ?? []).filter((context) =>
        subject.contextIds?.includes(context.id),
      ),
    [corpus.contexts, subject.contextIds],
  );
  const key = `${subject.id}:${contexts.map((context) => context.id).join('|')}`;
  const deferred = corpus.contextDetailsDeferred === true;
  const [reading, setReading] = useState<ReferenceReading | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!deferred || !contexts.length) return;
    let active = true;
    loadReferenceContexts(contexts.map((context) => context.id))
      .then((details) => {
        if (active) setReading({ key, status: 'ready', contexts: details });
      })
      .catch(() => {
        if (active) setReading({ key, status: 'failed', contexts: [] });
      });
    return () => {
      active = false;
    };
  }, [attempt, contexts, deferred, key]);
  if (!contexts.length) return null;
  const current = reading?.key === key ? reading : null;
  const ready = !deferred || current?.status === 'ready';
  return (
    <section className="reference-timeline">
      <h2>Place this story in time</h2>
      {!ready && current?.status !== 'failed' && (
        <p role="status">Loading reference reading…</p>
      )}
      {deferred && current?.status === 'failed' && (
        <p role="status">
          Reference reading could not load. The summaries and source links remain
          available.{' '}
          <button
            type="button"
            onClick={() => {
              setReading({ key, status: 'loading', contexts: [] });
              setAttempt((value) => value + 1);
            }}
          >
            Retry reference reading
          </button>
        </p>
      )}
      {contexts.map((context) => (
        <article key={context.id}>
          <h3>{context.title}</h3>
          <p>{context.summary}</p>
          <p className="scope-note">
            {context.interval.label}. {context.interval.note}
          </p>
          <Citations citations={context.citations} sources={corpus.sources} />
          {ready && (
            <ol>
              {(
                (deferred
                  ? current?.contexts.find((details) => details.id === context.id)
                  : context
                )?.phases ?? []
              ).map((phase) => (
                <li key={`${phase.year}-${phase.title}`}>
                  <span className="phase-date">
                    {phase.label ?? formatYear(phase.year)}
                  </span>
                  <div>
                    <h4>{phase.title}</h4>
                    <p>{phase.text}</p>
                    <Citations citations={phase.citations} sources={corpus.sources} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </article>
      ))}
    </section>
  );
}

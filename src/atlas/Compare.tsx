import { useLayoutEffect, useRef } from 'react';
import type { RuntimeCorpus, Subject } from './model';
import { useSubject } from './Dossier';
import { ObjectImage } from './MediaFigure';
import { Citations } from './Evidence';
import authoredNotes from './comparison-reading-notes.json';
import {
  comparisonDefinition,
  comparisonPartnerGroups,
  dimensionLabels,
  sharedDimensions,
} from './comparisons';
const readingNotes: Record<string, { text: string; sections: string[] }> =
  authoredNotes;
export function Compare({
  corpus,
  left,
  right,
  setRight,
  close,
  save,
  onReady,
}: {
  corpus: RuntimeCorpus;
  left: string;
  right: string;
  setRight: (id: string) => void;
  close: () => void;
  save: () => void;
  onReady?: () => void;
}) {
  const readingTitle = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    onReady?.();
  }, [onReady]);
  const a = useSubject(left, corpus),
    b = useSubject(right, corpus);
  const subjects = [a.subject, b.subject].filter(Boolean) as Subject[];
  const dimensions = [...new Set(subjects.flatMap((s) => Object.keys(s.dimensions)))];
  const common = dimensions.filter((d) => subjects.every((s) => s.dimensions[d]));
  const definition = comparisonDefinition(corpus, left, right);
  const note = definition && readingNotes[definition.id];
  const noteCitations =
    note && definition
      ? definition.subjects.flatMap((id, index) => {
          const subject = subjects.find((row) => row.id === id);
          const section = subject?.sections.find(
            (row) => row.title === note.sections[index],
          );
          return section?.citations ?? [];
        })
      : [];
  const partnerGroups = comparisonPartnerGroups(corpus, left);
  return (
    <section className="comparison">
      <div className="actions">
        <button onClick={close}>← Return to subject</button>
        <button onClick={save}>Save comparison</button>
      </div>
      <p className="eyebrow">Two subjects · one question at a time</p>
      <h1 data-reading-title tabIndex={-1} ref={readingTitle}>
        Compare without ranking
      </h1>
      {!note && (
        <p>
          Look for a specific similarity, a meaningful difference and a limit in the
          evidence. A comparison establishes no historical contact.
        </p>
      )}
      <p className="question">
        {definition?.question ??
          'What can these sources support about a shared question?'}
      </p>
      <label>
        Compare with{' '}
        <select value={right} onChange={(e) => setRight(e.target.value)}>
          {partnerGroups.map(({ label, cases }) => (
            <optgroup key={label} label={label}>
              {cases.map((s) => {
                const topics = a.subject ? sharedDimensions(a.subject, s).length : 0;
                return (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {topics > 0
                      ? ` · ${topics} shared ${topics === 1 ? 'topic' : 'topics'}`
                      : ''}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="compare-pair">
        {subjects.map((s) => {
          const object = corpus.media.find((m) => s.objectIds.includes(m.id));
          return (
            <article key={s.id}>
              {object && <ObjectImage object={object} thumb />}
              <p className="eyebrow">{s.region}</p>
              <h2>{s.name}</h2>
              <p>{s.interval.label}</p>
              <p>{s.place}</p>
              <p>{s.summary}</p>
            </article>
          );
        })}
      </div>
      {note && (
        <section className="revisit" aria-label="Reading the two sources together">
          <p>{note.text}</p>
          {!a.loading && !b.loading && noteCitations.length > 0 && (
            <Citations citations={noteCitations} sources={corpus.sources} />
          )}
        </section>
      )}
      {(a.loading || b.loading) && (
        <p role="status">Loading supported comparison dimensions…</p>
      )}
      {[a, b].map((reading, index) =>
        reading.error ? (
          <div role="alert" key={index}>
            <p>
              {reading.subject?.name ?? (index === 0 ? left : right)}. {reading.error}
            </p>
            <button
              onClick={() => {
                readingTitle.current?.focus({ preventScroll: true });
                reading.retry();
              }}
            >
              Retry {reading.subject?.name ?? (index === 0 ? left : right)} reading
            </button>
          </div>
        ) : null,
      )}
      {common.map((d) => (
        <section className="comparison-dimension" key={d}>
          <h2>{dimensionLabels[d] ?? d}</h2>
          <div className="compare-pair">
            {subjects.map((s) => (
              <article key={s.id}>
                <h3>{s.name}</h3>
                <p>{s.dimensions[d]!.text}</p>
                <Citations
                  citations={s.dimensions[d]!.citations}
                  sources={corpus.sources}
                />
              </article>
            ))}
          </div>
        </section>
      ))}
      {!a.loading && !b.loading && !a.error && !b.error && common.length === 0 && (
        <p className="scope-note">
          The current dossiers do not support the same comparison dimension. Compare
          their defined dates, places and surviving evidence above; a matched account of
          institutions or daily life would require further research.
        </p>
      )}
      {!a.loading &&
        !b.loading &&
        !a.error &&
        !b.error &&
        dimensions.some((d) => !common.includes(d)) && (
          <p className="scope-note">
            Some dimensions are documented for only one subject:{' '}
            {dimensions
              .filter((d) => !common.includes(d))
              .map((d) => dimensionLabels[d] ?? d)
              .join(', ')}
            . Those gaps are not filled by analogy.
          </p>
        )}
      <section className="revisit">
        <h2>What would strengthen your comparison?</h2>
        <p>
          Name one observation from each subject and one question that the surviving
          evidence cannot yet answer.
        </p>
      </section>
    </section>
  );
}

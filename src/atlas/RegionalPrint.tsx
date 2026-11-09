import type { Corpus, RegionalOrientation, Citation } from './model';
import { formatYear } from '../lib/years';

/** Flowing Letter pages retain the same prose and locators as the screen reading. */
export function RegionalPrint({
  corpus,
  chapter,
}: {
  corpus: Corpus;
  chapter: string | null;
}) {
  const rows = (corpus.orientations ?? []).filter(
    (r) => !chapter || r.chapter === chapter,
  );
  if (!rows.length)
    return (
      <article className="reader-print">
        <h1>No regional companion is available for this chapter</h1>
      </article>
    );
  return (
    <>
      {rows.map((reading) => (
        <RegionalPrintReading key={reading.id} reading={reading} corpus={corpus} />
      ))}
    </>
  );
}
function RegionalPrintReading({
  reading,
  corpus,
}: {
  reading: RegionalOrientation;
  corpus: Corpus;
}) {
  const citations = [
    ...[reading.summary, ...reading.sections].flatMap((s) => s.citations),
    ...reading.snapshots.flatMap((s) => s.citations),
  ];
  const ids = [...new Set(citations.map((c) => c.source))];
  const refs = (rows: Citation[]) => (
    <p className="reader-refs">
      {rows.map((c, i) => (
        <span key={`${c.source}-${i}`}>
          [{ids.indexOf(c.source) + 1}] {c.locator}
          {i < rows.length - 1 ? '; ' : ''}
        </span>
      ))}
    </p>
  );
  return (
    <article className="reader-print regional-print" data-orientation={reading.id}>
      <header>
        <p>
          CHRONOS · {reading.chapter} · {reading.region}
        </p>
        <h1>{reading.title}</h1>
        <h2>{reading.question}</h2>
        <p className="reader-refs">
          Local editorial review candidate. Independent historical and physical-print
          review remain open.
        </p>
      </header>
      {[reading.summary, ...reading.sections].map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          <p>{s.text}</p>
          {refs(s.citations)}
        </section>
      ))}
      <h2>Whose experience can we recover?</h2>
      <p>{reading.perspectives}</p>
      <h2>Scope of this reading</h2>
      <p>{reading.scope}</p>
      {reading.snapshots.map((s) => (
        <section key={s.year}>
          <h2>Around {formatYear(s.year)}</h2>
          <p>{s.text}</p>
          {refs(s.citations)}
        </section>
      ))}
      <section>
        <h2>Try the evidence question</h2>
        <p>{reading.activity.prompt}</p>
        <h3>Compare your reasoning</h3>
        <p>{reading.activity.response}</p>
      </section>
      <h2>Continue reading</h2>
      <ul>
        {reading.subjectIds.map((id) => (
          <li key={id}>{corpus.subjects.find((s) => s.id === id)?.name}</li>
        ))}
      </ul>
      <section className="regional-print-sources">
        <h2>Sources and consultation limits</h2>
        {ids.map((id, i) => {
          const source = corpus.sources.find((s) => s.id === id)!;
          return (
            <p key={id}>
              [{i + 1}] <strong>{source.title}</strong> · {source.institution}.{' '}
              {source.scope} Consulted {source.accessed}.{' '}
              <a href={source.url}>{source.url}</a>
            </p>
          );
        })}
      </section>
    </article>
  );
}

import { Citations } from './Evidence';
import type { HistoricalContext, RuntimeCorpus, Subject } from './model';

export function ReferenceFrame({
  frame,
  corpus,
  openSubject,
}: {
  frame: HistoricalContext;
  corpus: RuntimeCorpus;
  openSubject: (subject: Subject) => void;
}) {
  return (
    <article>
      <p className="eyebrow">Reference context · {frame.interval.label}</p>
      <h3>{frame.title}</h3>
      <p>{frame.summary}</p>
      <p className="scope-note">{frame.interval.note}</p>
      <Citations citations={frame.citations} sources={corpus.sources} />
      {frame.subjectIds.map((id) => {
        const subject = corpus.subjects.find((item) => item.id === id);
        return (
          subject && (
            <button key={id} onClick={() => openSubject(subject)}>
              Explore {subject.name}
            </button>
          )
        );
      })}
    </article>
  );
}

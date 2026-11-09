import { useState } from 'react';
import type { Citation, EvidenceQuestion, Source } from './model';
import { loadSourceScopes } from './data';
export function Citations({
  citations,
  sources,
}: {
  citations: Citation[];
  sources: Source[];
}) {
  const [scopes, setScopes] = useState<Record<string, string> | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  function openScopes() {
    if (
      scopes ||
      status === 'loading' ||
      !citations.some((c) => sources.some((s) => s.id === c.source && !s.scope))
    )
      return;
    setStatus('loading');
    loadSourceScopes()
      .then((details) => {
        setScopes(details);
        setStatus('idle');
      })
      .catch(() => setStatus('failed'));
  }
  return (
    <details
      className="citations"
      onToggle={(event) => {
        if (event.currentTarget.open) openScopes();
      }}
    >
      <summary>Evidence and source notes</summary>
      {status === 'loading' && (
        <p role="status">Opening source consultation details…</p>
      )}
      {status === 'failed' && (
        <p role="status">
          Source consultation details could not load.
          {citations.every((citation) =>
            sources.some((source) => source.id === citation.source && source.url),
          )
            ? ' Original records remain linked.'
            : null}{' '}
          <button onClick={openScopes}>Retry source details</button>
        </p>
      )}
      {citations.map((c, i) => {
        const s = sources.find((x) => x.id === c.source);
        const scope = scopes?.[c.source] ?? s?.scope;
        const label = s?.title || c.source;
        return (
          <p key={`${c.source}-${i}`}>
            {s?.url ? (
              <a href={s.url} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            ) : (
              <span>{label}</span>
            )}
            <br />
            <span>
              {[s?.author ?? s?.institution, c.locator].filter(Boolean).join(' · ')}
            </span>
            {s?.accessed && s.type ? (
              <small>
                Consulted {s.accessed}; {s.type}.
              </small>
            ) : null}
            {scope && <span className="source-scope">Scope and access: {scope}</span>}
          </p>
        );
      })}
    </details>
  );
}
export function EvidenceExercise({
  question,
  sources,
}: {
  question: EvidenceQuestion;
  sources: Source[];
}) {
  const [choice, setChoice] = useState<number | null>(null);
  return (
    <section className="evidence-exercise">
      <p className="eyebrow">Make a supported claim</p>
      <h2>{question.prompt}</h2>
      <div className="answer-options">
        {question.options.map((o, i) => (
          <button
            key={i}
            className={choice === i ? 'chosen' : ''}
            aria-pressed={choice === i}
            onClick={() => setChoice(i)}
          >
            {o.text}
          </button>
        ))}
      </div>
      {choice !== null && (
        <div role="status" className="feedback">
          <strong>
            {question.options[choice]?.supported
              ? 'A defensible claim'
              : 'Look again at the evidence'}
          </strong>
          <p>{question.options[choice]?.feedback}</p>
        </div>
      )}
      <Citations citations={question.citations} sources={sources} />
    </section>
  );
}

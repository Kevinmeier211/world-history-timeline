import { useEffect, useRef, useState } from 'react';

import type { DossierModel } from './dossier.ts';
import { loadWikiExtract } from './wiki.ts';

function WikiBlurb({ title }: { title: string }) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle');
  const [extract, setExtract] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const onLoad = () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase('loading');
    loadWikiExtract(title, globalThis.fetch.bind(globalThis), controller.signal).then(
      (result) => {
        if (controller.signal.aborted) return;
        setExtract(result.extract);
        setPhase('ready');
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setPhase('error');
      },
    );
  };

  return (
    <section aria-label="From Wikipedia">
      {phase === 'ready' ? <h3>From Wikipedia</h3> : null}
      {phase === 'idle' ? (
        <button type="button" onClick={onLoad}>
          From Wikipedia
        </button>
      ) : null}
      {phase === 'loading' ? <p>Loading the Wikipedia extract.</p> : null}
      {phase === 'error' ? <p>Wikipedia did not respond.</p> : null}
      {phase === 'ready' ? <p>{extract}</p> : null}
    </section>
  );
}

export function Dossier({
  model,
  onClose,
}: {
  model: DossierModel;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <aside className="dossier" role="dialog" aria-label="Dossier" aria-modal="false">
      <div className="dossier-head">
        <h2>{model.name}</h2>
        <button type="button" onClick={onClose}>
          Close dossier
        </button>
      </div>
      <p className="dossier-dates">
        {model.dates}
        <span className="dossier-chip">{model.confidence}</span>
        <span className="dossier-chip">{model.verification}</span>
      </p>
      <p>{model.summary}</p>
      <figure className="dossier-figure">
        <figcaption>{model.mediaNote}</figcaption>
      </figure>
      {model.keyFacts.length > 0 ? (
        <section>
          <h3>Key facts</h3>
          <ul>
            {model.keyFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {model.rulers.length > 0 ? (
        <section>
          <h3>Rulers</h3>
          <ul>
            {model.rulers.map((ruler) => (
              <li key={`${ruler.name}:${ruler.reign}`}>
                {ruler.title
                  ? `${ruler.name}, ${ruler.title}, ${ruler.reign}`
                  : `${ruler.name}, ${ruler.reign}`}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {model.lineage.length > 0 ? (
        <section>
          <h3>Lineage</h3>
          <ul className="dossier-chips">
            {model.lineage.map((chip) => (
              <li key={chip.id} className="dossier-chip">
                {chip.label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {model.callouts.length > 0 ? (
        <section>
          <h3>Notes</h3>
          <ul>
            {model.callouts.map((chip) => (
              <li key={chip.id}>{chip.label}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {model.sources.length > 0 ? (
        <section>
          <h3>Sources</h3>
          <ul>
            {model.sources.map((source) => (
              <li key={source.id}>
                {source.url ? <a href={source.url}>{source.title}</a> : source.title}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {model.wikipediaTitle ? <WikiBlurb title={model.wikipediaTitle} /> : null}
    </aside>
  );
}

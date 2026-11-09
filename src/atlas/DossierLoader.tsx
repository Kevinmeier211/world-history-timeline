import { useEffect, useLayoutEffect, useState, type ComponentProps } from 'react';
import type { Dossier } from './Dossier';

/** Reading controls load on selection; the selected case is identified immediately. */
export function DossierLoader(props: ComponentProps<typeof Dossier>) {
  const [Reader, setReader] = useState<typeof Dossier | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    import('./Dossier').then(
      (module) => {
        if (active) setReader(() => module.Dossier);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  const { onReady } = props;
  useLayoutEffect(() => {
    if (failed) onReady();
  }, [failed, onReady]);
  if (Reader) return <Reader {...props} />;
  const subject = props.corpus.subjects.find(
    (item) => item.id === props.location.subject,
  );
  return (
    <aside className="dossier" data-reading-ready={failed} aria-busy={!failed}>
      <button onClick={props.close}>Back to atlas</button>
      <h1 data-reading-title tabIndex={-1}>
        {subject?.name ?? 'Subject unavailable'}
      </h1>
      <p role={failed ? 'alert' : 'status'}>
        {failed
          ? 'The reading controls could not load. Return to the atlas or reload to try again.'
          : 'Opening the researched dossier…'}
      </p>
      {failed && <button onClick={() => window.location.reload()}>Reload atlas</button>}
    </aside>
  );
}

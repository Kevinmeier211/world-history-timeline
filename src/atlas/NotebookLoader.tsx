import { useEffect, useLayoutEffect, useState, type ComponentProps } from 'react';
import type { NotebookView } from './Notebook';

/** Notebook data and drafts remain in Atlas while the editing controls load. */
export function NotebookLoader({
  onReady,
  ...props
}: ComponentProps<typeof NotebookView> & {
  onReady: (editing: boolean) => void;
}) {
  const [View, setView] = useState<typeof NotebookView | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    import('./Notebook').then(
      (module) => {
        if (active) setView(() => module.NotebookView);
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);
  const draft = props.session.draft;
  const editing =
    !!draft && !!(props.book.notes.find((n) => n.id === draft.id) ?? draft.base);
  useLayoutEffect(() => {
    // The view restores its editor focus after mounting. Cancel pending heading
    // focus first, so a later animation frame cannot take focus from that draft.
    if (View || failed) onReady(!!View && editing);
  }, [View, failed, editing, onReady]);
  if (View) return <View {...props} />;
  return (
    <section
      className="page-reading notebook-view"
      data-reading-ready={failed}
      aria-busy={!failed}
    >
      <h1 data-reading-title tabIndex={-1}>
        {failed ? 'The notebook controls could not open' : 'Opening your notebook…'}
      </h1>
      <p role={failed ? 'alert' : 'status'}>
        {failed
          ? 'Your entries and drafts remain available in this visit. Other atlas views are still available. Copy any unsaved work below before reloading to try again.'
          : 'Loading notebook controls. Your entries and drafts stay in place.'}
      </p>
      {failed && (
        <details>
          <summary>Copy notebook and drafts before reloading</summary>
          <p>
            Reloading can lose work that browser storage could not save. Copy the
            notebook JSON to a text file for later import. Keep the draft and undo
            history separately; that text is a recovery reference, not a notebook import
            file.
          </p>
          <label>
            Notebook JSON for import
            <textarea readOnly value={JSON.stringify(props.book, null, 2)} />
          </label>
          <label>
            Draft and undo history JSON
            <textarea readOnly value={JSON.stringify(props.session, null, 2)} />
          </label>
        </details>
      )}
      {failed && <button onClick={() => window.location.reload()}>Reload atlas</button>}
    </section>
  );
}

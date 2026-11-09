import { useEffect, useRef, useState } from 'react';
import type { Location } from './navigation';
import { readLocation } from './navigation';
import {
  editNote,
  reviseNote,
  parseNotebook,
  type Note,
  type NoteDraft,
  type RemovedNote,
  type Notebook,
  mergeNotebooks,
} from './notebook-data';
import { NotebookRecovery } from './NotebookRecovery';
export { parseNotebook, readNotebook, writeNotebook } from './notebook-data';
export type { Note, Notebook } from './notebook-data';
export interface NotebookSession {
  draft: NoteDraft | null;
  removed: RemovedNote[];
}
export function NotebookView({
  book,
  onChange,
  navigate,
  session,
  onSessionChange,
  onImport,
  persisted,
  onRecovered,
}: {
  book: Notebook;
  onChange: (b: Notebook) => Promise<boolean>;
  navigate: (l: Location) => void;
  session: NotebookSession;
  onSessionChange: (s: NotebookSession) => void;
  onImport: (incoming: Notebook) => Promise<boolean>;
  onRecovered: (book: Notebook) => void;
  persisted: boolean;
}) {
  const [message, setMessage] = useState('');
  const [revealed, setRevealed] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const [incoming, setIncoming] = useState<Notebook | null>(null);
  const preview = incoming ? mergeNotebooks(book, incoming) : null;
  const editor = useRef<HTMLElement>(null);
  const draft = session.draft;
  const currentEntry = book.notes.find((n) => n.id === draft?.id);
  const editing = currentEntry ?? draft?.base;
  const editingId = draft?.id,
    editingMode = draft?.mode;
  useEffect(() => {
    if (editingId)
      editor.current?.querySelector<HTMLElement>('input, textarea')?.focus();
  }, [editingId, editingMode]);
  const collections = [...new Set(book.notes.map((n) => n.collection || 'Household'))];
  const activeFilter = collections.includes(filter) ? filter : '';
  const visible = book.notes.filter(
    (n) => !activeFilter || (n.collection || 'Household') === activeFilter,
  );
  function download() {
    const blob = new Blob([JSON.stringify(book, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chronos-household-notebook.json';
    a.click();
    URL.revokeObjectURL(url);
    setMessage(
      'Notebook exported, including saved revisions and context. Keep the file to restore it on another device.',
    );
  }
  function begin(note: Note, mode: NoteDraft['mode']) {
    if (draft) {
      setMessage('Save or cancel the open edit before starting another.');
      editor.current?.scrollIntoView({ block: 'center' });
      return;
    }
    onSessionChange({
      ...session,
      draft: {
        id: note.id,
        base: note,
        mode,
        title: note.title,
        question: note.question,
        collection: note.collection || 'Household',
        answer: '',
        reflection: '',
        evidence: '',
      },
    });
    setMessage('');
  }
  function change(
    field: keyof Pick<
      NoteDraft,
      'title' | 'question' | 'collection' | 'answer' | 'reflection' | 'evidence'
    >,
    value: string,
  ) {
    if (draft) onSessionChange({ ...session, draft: { ...draft, [field]: value } });
  }
  function revisit() {
    const n = [...visible].sort(
      (a, b) => Date.parse(a.updated ?? a.saved) - Date.parse(b.updated ?? b.saved),
    )[0];
    if (!n) return;
    setRevealed((ids) => ids.filter((id) => id !== n.id));
    requestAnimationFrame(() => {
      const heading = document.getElementById('note-' + n.id);
      heading?.scrollIntoView({ block: 'center' });
      heading?.focus({ preventScroll: true });
    });
    setMessage(
      'Try answering this question again before revealing your saved thinking.',
    );
  }
  async function remove(note: Note) {
    onSessionChange({
      ...session,
      removed: [
        ...session.removed,
        { note, position: book.notes.findIndex((n) => n.id === note.id) },
      ].slice(-20),
    });
    const saved = await onChange({
      ...book,
      notes: book.notes.filter((n) => n.id !== note.id),
    });
    setMessage(
      saved
        ? 'Entry removed. Undo is available during this visit.'
        : 'Removal is only available during this visit. Export your notebook.',
    );
  }
  async function undo() {
    const entry = session.removed.at(-1);
    if (!entry) return;
    let restored: Notebook;
    if (book.notes.some((n) => n.id === entry.note.id))
      restored = mergeForUndo(book, entry.note);
    else {
      const notes = [...book.notes];
      notes.splice(Math.min(entry.position, notes.length), 0, entry.note);
      restored = { ...book, notes };
    }
    const saved = await onChange(restored);
    onSessionChange({ ...session, removed: session.removed.slice(0, -1) });
    setMessage(
      saved
        ? 'Removed entry restored.'
        : 'Entry restored for this visit; export to keep it.',
    );
  }
  return (
    <section className="page-reading notebook-view">
      <p className="eyebrow">
        {persisted ? 'Saved on this device' : 'Available for this visit'}
      </p>
      <h1 tabIndex={-1}>Your notebook</h1>
      <p>
        Keep a first answer, return to the evidence, and record how your thinking
        changes. No account is required.
      </p>
      {!persisted && (
        <p role="status">
          Browser storage could not save your latest changes. Export the notebook to
          keep them.
        </p>
      )}
      <NotebookRecovery book={book} recovered={onRecovered} />
      <div className="actions">
        <button onClick={download}>Export notebook</button>
        <label className="file-button">
          Import notebook
          <input
            type="file"
            accept="application/json,.json"
            onChange={async (e) => {
              const input = e.currentTarget;
              const f = input.files?.[0];
              if (!f) return;
              try {
                if (f.size > 2_000_000)
                  throw Error('Choose a notebook smaller than 2 MB.');
                const incoming = parseNotebook(await f.text());
                setIncoming(incoming);
                setMessage('Review the import below before adding entries.');
              } catch (error) {
                setMessage(
                  (error instanceof Error ? error.message : 'Import failed.') +
                    ' Your existing notebook is unchanged.',
                );
              }
              input.value = '';
            }}
          />
        </label>
        {session.removed.length > 0 && (
          <button onClick={undo}>Undo last removal</button>
        )}
      </div>
      <p role="status">{message}</p>
      {incoming && preview && (
        <section className="notebook-editor" aria-label="Import preview">
          <h2>Review notebook import</h2>
          <p>
            {preview.added} new entries, {preview.alternatives} differing copies, and{' '}
            {preview.duplicates} duplicates. Your existing entries will be preserved.
          </p>
          <div className="actions">
            <button
              onClick={async () => {
                const saved = await onImport(incoming);
                setIncoming(null);
                setMessage(
                  saved
                    ? 'Import saved. Differing copies remain separate entries.'
                    : 'Import available for this visit. Export the notebook to keep these entries.',
                );
              }}
            >
              Add imported entries
            </button>
            <button
              onClick={() => {
                setIncoming(null);
                setMessage('Import cancelled.');
              }}
            >
              Cancel import
            </button>
          </div>
        </section>
      )}
      {draft && editing && (
        <section
          ref={editor}
          className="notebook-editor"
          aria-labelledby="notebook-editor-title"
        >
          <h2 id="notebook-editor-title">
            {draft.mode === 'details' ? 'Edit details' : 'Revise your thinking'}:{' '}
            {editing.title}
          </h2>
          <p>
            {draft.mode === 'thinking'
              ? 'Your first answer stays in the history. Record what you think now and, if useful, what changed.'
              : 'The creation date, first answer and revision history stay with this entry.'}
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const next =
                  draft.mode === 'details'
                    ? editNote(draft.base ?? editing, {
                        title: draft.title,
                        question: draft.question,
                        collection: draft.collection || 'Household',
                      })
                    : reviseNote(draft.base ?? editing, {
                        id: crypto.randomUUID(),
                        saved: new Date().toISOString(),
                        answer: draft.answer,
                        reflection: draft.reflection,
                        evidence: draft.evidence,
                      });
                const changedElsewhere =
                  draft.base &&
                  JSON.stringify(draft.base) !== JSON.stringify(currentEntry);
                const updated = changedElsewhere
                  ? mergeNotebooks(book, {
                      version: 1,
                      notes: [
                        currentEntry
                          ? next
                          : { ...next, id: crypto.randomUUID(), importedFrom: next.id },
                      ],
                    }).book
                  : {
                      ...book,
                      notes: book.notes.map((n) => (n.id === next.id ? next : n)),
                    };
                const saved = await onChange(updated);
                onSessionChange({ ...session, draft: null });
                setRevealed((ids) => [...ids.filter((id) => id !== next.id), next.id]);
                setMessage(
                  !saved
                    ? 'Changes available for this visit. Export to keep them.'
                    : changedElsewhere
                      ? 'Another edit was preserved alongside your version.'
                      : draft.mode === 'details'
                        ? 'Details saved.'
                        : 'Revision saved; your earlier thinking is preserved.',
                );
              } catch (error) {
                setMessage(
                  error instanceof Error
                    ? error.message
                    : 'The change could not be saved.',
                );
              }
            }}
          >
            {draft.mode === 'details' ? (
              <>
                <label>
                  Title
                  <input
                    value={draft.title}
                    onChange={(e) => change('title', e.target.value)}
                    maxLength={10000}
                    required
                  />
                </label>
                <label>
                  Question
                  <textarea
                    value={draft.question}
                    onChange={(e) => change('question', e.target.value)}
                    maxLength={10000}
                    required
                  />
                </label>
                <label>
                  Collection
                  <input
                    value={draft.collection}
                    onChange={(e) => change('collection', e.target.value)}
                    maxLength={100}
                  />
                </label>
              </>
            ) : (
              <>
                <label>
                  Your thinking now
                  <textarea
                    value={draft.answer}
                    onChange={(e) => change('answer', e.target.value)}
                    maxLength={10000}
                    required
                  />
                </label>
                <label>
                  What changed in your thinking? (optional)
                  <textarea
                    value={draft.reflection}
                    onChange={(e) => change('reflection', e.target.value)}
                    maxLength={10000}
                  />
                </label>
                <label>
                  What evidence helped? (optional)
                  <textarea
                    value={draft.evidence}
                    onChange={(e) => change('evidence', e.target.value)}
                    maxLength={10000}
                  />
                </label>
              </>
            )}
            <div className="actions">
              <button
                aria-label={draft.mode === 'details' ? 'Save details' : 'Save revision'}
              >
                {draft.mode === 'details' ? 'Save details' : 'Save revision'}
              </button>
              <button
                type="button"
                onClick={() => onSessionChange({ ...session, draft: null })}
              >
                Cancel edit
              </button>
              <button
                type="button"
                onClick={() => navigate(readLocation(editing.location))}
              >
                Return to evidence; keep draft
              </button>
            </div>
          </form>
        </section>
      )}
      <div className="notebook-filters">
        <label>
          Collection{' '}
          <select value={activeFilter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All collections</option>
            {collections.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <button disabled={!visible.length} onClick={revisit}>
          Revisit an earlier question
        </button>
      </div>
      {visible.length > 0 && (
        <p className="scope-note">
          Revisit chooses the oldest saved update in this collection. Reveal earlier
          thinking when you are ready.
        </p>
      )}
      {!book.notes.length && (
        <div className="empty-note">
          <h2>Start with a question</h2>
          <p>
            Open a subject and save something to think about again. Journeys and
            comparisons can be saved too.
          </p>
        </div>
      )}
      {book.notes.length > 0 && !visible.length && (
        <p>No entries in this collection. Choose All collections to see the rest.</p>
      )}
      <div className="notebook-list">
        {visible.map((n) => (
          <article key={n.id}>
            <p className="eyebrow">
              {n.kind} · {n.collection || 'Household'} · Created{' '}
              {new Date(n.saved).toLocaleDateString()}
              {n.updated && <> · Updated {new Date(n.updated).toLocaleDateString()}</>}
              {n.importedFrom && ' · Imported alternative'}
            </p>
            <h2 id={'note-' + n.id} tabIndex={-1}>
              {n.title}
            </h2>
            <p className="question">{n.question}</p>
            {Boolean(n.answer || n.revisions?.length) && (
              <>
                <button
                  onClick={() =>
                    setRevealed((ids) =>
                      ids.includes(n.id)
                        ? ids.filter((id) => id !== n.id)
                        : [...ids, n.id],
                    )
                  }
                >
                  {revealed.includes(n.id)
                    ? 'Hide my thinking'
                    : 'Reveal my earlier thinking'}
                </button>
                {revealed.includes(n.id) && (
                  <div className="thinking-history">
                    <section>
                      <h3>First answer · {new Date(n.saved).toLocaleDateString()}</h3>
                      <p className="prior-answer">
                        {n.answer || 'No first answer recorded.'}
                      </p>
                    </section>
                    {n.revisions?.map((revision, i) => (
                      <section key={revision.id}>
                        <h3>
                          Revision {i + 1} ·{' '}
                          {new Date(revision.saved).toLocaleDateString()}
                        </h3>
                        <p className="prior-answer">{revision.answer}</p>
                        {revision.reflection && (
                          <p>
                            <strong>What changed:</strong> {revision.reflection}
                          </p>
                        )}
                        {revision.evidence && (
                          <p>
                            <strong>Evidence:</strong> {revision.evidence}
                          </p>
                        )}
                      </section>
                    ))}
                  </div>
                )}
              </>
            )}
            {n.context && (
              <details className="saved-context">
                <summary>Saved sources and context</summary>
                <p>{n.context.label}</p>
                <p className="scope-note">
                  Sources cited in the saved moment; this list does not mean every
                  source was read.
                </p>
                {n.context.sources.some((source) => !source.url) && (
                  <p className="scope-note">
                    Some source record details were unavailable when this question was
                    saved. Their identifiers and source locations are kept below. Return
                    to this moment to load the current records.
                  </p>
                )}
                {n.context.sources.map((source) => (
                  <p key={source.id}>
                    {source.url ? (
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title || source.id} ↗
                      </a>
                    ) : (
                      <span>{source.title || source.id}</span>
                    )}
                    <br />
                    {source.locator}
                    {source.consulted ? (
                      <small>Consultation recorded {source.consulted}.</small>
                    ) : null}
                  </p>
                ))}
              </details>
            )}
            <div className="actions">
              <button onClick={() => navigate(readLocation(n.location))}>
                Return to this moment
              </button>
              <button onClick={() => begin(n, 'thinking')}>Revise thinking</button>
              <button onClick={() => begin(n, 'details')}>Edit details</button>
              <button
                className="quiet"
                disabled={draft?.id === n.id}
                onClick={() => remove(n)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function mergeForUndo(book: Notebook, note: Note): Notebook {
  return mergeNotebooks(book, { version: 1, notes: [note] }).book;
}

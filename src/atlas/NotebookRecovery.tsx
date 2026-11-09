import { useState } from 'react';
import {
  parseNotebook,
  mergeNotebooks,
  inspectNotebookStorage,
  type Notebook,
} from './notebook-data';
import { notebookKey } from './notebook-persistence';

export { inspectNotebookStorage } from './notebook-data';

export function NotebookRecovery({
  book,
  recovered,
}: {
  book: Notebook;
  recovered: (book: Notebook) => void;
}) {
  const problem = inspectNotebookStorage();
  const [message, setMessage] = useState('');
  if (!problem) return null;
  function exportRaw() {
    try {
      const raw = localStorage.getItem(notebookKey);
      if (raw === null) throw Error('No saved data could be accessed.');
      const url = URL.createObjectURL(new Blob([raw], { type: 'text/plain' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chronos-notebook-recovery.txt';
      a.click();
      URL.revokeObjectURL(url);
      setMessage(
        'Original saved data exported unchanged. Keep this file for recovery.',
      );
    } catch {
      setMessage(
        'This browser is denying access to saved data. You can still export entries from this visit.',
      );
    }
  }
  async function restore() {
    try {
      if (!navigator.locks)
        throw Error('Safe recovery requires browser storage locks.');
      const next = await navigator.locks.request('chronos-notebook-write', async () => {
        const raw = localStorage.getItem(notebookKey);
        const backup = localStorage.getItem('chronos.household.backup');
        if (!backup)
          throw Error(
            'No previous backup is available. Export the original data for recovery.',
          );
        // A backup may be older than this session. Merge, never replace session work.
        let source = parseNotebook(backup);
        try {
          if (raw !== null) source = mergeNotebooks(source, parseNotebook(raw)).book;
        } catch {
          /* Preserve malformed bytes below. */
        }
        const merged = mergeNotebooks(source, book).book;
        // Preserve the exact damaged bytes before any replacement. If this fails,
        // recovery stops without changing the original.
        if (raw !== null)
          localStorage.setItem('chronos.household.recovery.' + Date.now(), raw);
        localStorage.setItem(notebookKey, JSON.stringify(merged));
        return merged;
      });
      recovered(next);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Recovery was unavailable.');
    }
  }
  return (
    <section className="notebook-editor" aria-label="Notebook recovery">
      <h2>Recover saved work</h2>
      <p>{problem} New entries remain available for export during this visit.</p>
      <p>
        The previous backup may omit the most recent save. Restoring it also preserves
        your current entries and archives the unreadable data.
      </p>
      <div className="actions">
        <button onClick={exportRaw}>Export original saved data</button>
        <button onClick={restore}>Restore previous backup</button>
      </div>
      <p role="status">{message}</p>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  readNotebook,
  parseNotebook,
  inspectNotebookStorage,
  type Notebook,
} from './notebook-data';
import { notebookKey, persistNotebook } from './notebook-persistence';

/** Owns optimistic state, serialized writes, cross-tab refresh and recovery.
 * A false result keeps the session copy available and never claims persistence.
 */
export function useNotebook(onMessage: (message: string) => void) {
  const [book, setBook] = useState<Notebook>(readNotebook);
  const bookRef = useRef(book);
  const bookVersion = useRef(0);
  const pendingWrites = useRef(0);
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());
  const unsavedBase = useRef<Notebook | null>(null);
  const [notebookPersisted, setNotebookPersisted] = useState(
    () => !inspectNotebookStorage(),
  );
  useEffect(() => {
    const refresh = (event: StorageEvent) => {
      if (event.key !== notebookKey || pendingWrites.current || unsavedBase.current)
        return;
      try {
        const next = parseNotebook(event.newValue ?? '{"version":1,"notes":[]}');
        bookRef.current = next;
        setBook(next);
      } catch {
        onMessage(
          'Saved notebook data could not be read. Existing storage has been preserved.',
        );
      }
    };
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [onMessage]);
  async function updateBook(n: Notebook) {
    const base = bookRef.current;
    const version = ++bookVersion.current;
    pendingWrites.current++;
    bookRef.current = n;
    setBook(n);
    try {
      const operation = writeQueue.current.then(async () => {
        try {
          const result = await persistNotebook(unsavedBase.current ?? base, n);
          unsavedBase.current = null;
          return result;
        } catch (error) {
          unsavedBase.current ??= base;
          throw error;
        }
      });
      writeQueue.current = operation.catch(() => undefined);
      const persisted = await operation;
      if (version === bookVersion.current) {
        bookRef.current = persisted;
        setBook(persisted);
        setNotebookPersisted(true);
      }
      return true;
    } catch {
      setNotebookPersisted(false);
      onMessage(
        'These entries are available for this visit, but browser storage could not save them safely. Export the notebook now to preserve them. Existing saved data has not been replaced.',
      );
      return false;
    } finally {
      pendingWrites.current--;
    }
  }
  function recoverBook(next: Notebook) {
    bookRef.current = next;
    unsavedBase.current = null;
    setBook(next);
    setNotebookPersisted(true);
  }
  return {
    book,
    getLatestBook: () => bookRef.current,
    notebookPersisted,
    updateBook,
    recoverBook,
  };
}

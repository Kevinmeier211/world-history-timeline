import { mergeNotebooks, parseNotebook, type Notebook } from './notebook-data';

export const notebookKey = 'chronos.household.v1';
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Apply only this editor's changes to the latest persisted version. */
export function reconcileNotebook(
  base: Notebook,
  intended: Notebook,
  latest: Notebook,
): Notebook {
  let result: Notebook = { version: 1, notes: [...latest.notes] };
  for (const original of base.notes) {
    const next = intended.notes.find((n) => n.id === original.id);
    const remote = result.notes.find((n) => n.id === original.id);
    if (!next) {
      // A deletion only removes the version the editor actually saw.
      if (equal(remote, original))
        result.notes = result.notes.filter((n) => n.id !== original.id);
      continue;
    }
    if (equal(next, original)) continue;
    if (equal(remote, original)) {
      result.notes = result.notes.map((n) => (n.id === original.id ? next : n));
    } else if (remote) {
      result = mergeNotebooks(result, { version: 1, notes: [next] }).book;
    } else {
      // Another tab deleted this version. Retain the competing edit explicitly.
      result.notes.push({ ...next, id: crypto.randomUUID(), importedFrom: next.id });
    }
  }
  const added = intended.notes.filter((n) => !base.notes.some((b) => b.id === n.id));
  result = mergeNotebooks(result, { version: 1, notes: added }).book;
  // Preserve this editor's visible ordering (including newest-first saves and undo
  // placement); append unseen remote notes and conflict alternatives afterward.
  const ordered = intended.notes.flatMap((note) =>
    result.notes.filter((n) => n.id === note.id),
  );
  result.notes = [
    ...ordered,
    ...result.notes.filter((note) => !ordered.some((n) => n.id === note.id)),
  ];
  return parseNotebook(JSON.stringify(result));
}

export async function persistNotebook(
  base: Notebook,
  intended: Notebook,
): Promise<Notebook> {
  if (!navigator.locks)
    throw Error('Safe notebook storage is unavailable in this browser.');
  return navigator.locks.request('chronos-notebook-write', async () => {
    // A malformed saved notebook is never overwritten by an empty fallback.
    const raw = localStorage.getItem(notebookKey);
    const latest = parseNotebook(raw ?? '{"version":1,"notes":[]}');
    const result = reconcileNotebook(base, intended, latest);
    if (raw !== null) localStorage.setItem('chronos.household.backup', raw);
    localStorage.setItem(notebookKey, JSON.stringify(result));
    return result;
  });
}

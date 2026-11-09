import type { RuntimeCorpus, Subject, Citation } from './model';
import type { Location } from './navigation';
import { loadSubject } from './data';
import { formatYear } from '../lib/years';
export type NoteSource = {
  id: string;
  locator: string;
} & (
  | { title: string; url: string; consulted: string }
  | { title?: never; url?: never; consulted?: never }
);
export interface NoteContext {
  label: string;
  subject: string | null;
  compare: string | null;
  object: string | null;
  year: number;
  journey: string | null;
  step: number;
  sources: NoteSource[];
}
export interface Revision {
  id: string;
  saved: string;
  answer: string;
  reflection: string;
  evidence: string;
}
export interface Note {
  id: string;
  title: string;
  question: string;
  answer: string;
  collection: string;
  saved: string;
  location: string;
  kind: 'question' | 'subject' | 'comparison' | 'journey';
  updated?: string;
  context?: NoteContext;
  revisions?: Revision[];
  importedFrom?: string;
}
export interface Notebook {
  version: 1;
  notes: Note[];
}
export interface NoteDraft {
  base?: Note;
  id: string;
  mode: 'details' | 'thinking';
  title: string;
  question: string;
  collection: string;
  answer: string;
  reflection: string;
  evidence: string;
}
export interface RemovedNote {
  note: Note;
  position: number;
}
const key = 'chronos.household.v1';
export function inspectNotebookStorage() {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) parseNotebook(raw);
    return '';
  } catch {
    return 'Your saved notebook could not be read. Its original data has been preserved.';
  }
}
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown) => typeof value === 'string' && value.length <= 20000;
const date = (value: unknown) =>
  text(value) && Number.isFinite(Date.parse(value as string));
const safeUrl = (value: unknown) => {
  if (!text(value)) return false;
  try {
    return ['https:', 'http:'].includes(new URL(value as string).protocol);
  } catch {
    return false;
  }
};
export function parseNotebook(raw: string): Notebook {
  const n: unknown = JSON.parse(raw);
  if (!record(n) || n.version !== 1 || !Array.isArray(n.notes) || n.notes.length > 2000)
    throw Error('Use a version 1 Chronos notebook with at most 2,000 entries.');
  const ids = new Set<string>();
  for (const item of n.notes) {
    if (
      !record(item) ||
      ![
        'id',
        'title',
        'question',
        'answer',
        'collection',
        'saved',
        'location',
        'kind',
      ].every((f) => text(item[f])) ||
      !['question', 'subject', 'comparison', 'journey'].includes(item.kind as string) ||
      !(item.id as string).trim() ||
      !(item.title as string).trim() ||
      !date(item.saved) ||
      !(item.location as string).startsWith('?') ||
      ids.has(item.id as string)
    )
      throw Error('This notebook has an invalid entry.');
    ids.add(item.id as string);
    if (item.updated !== undefined && !date(item.updated))
      throw Error('This notebook has an invalid update date.');
    if (item.importedFrom !== undefined && !text(item.importedFrom))
      throw Error('This notebook has an invalid import reference.');
    if (item.revisions !== undefined) {
      if (!Array.isArray(item.revisions) || item.revisions.length > 100)
        throw Error('An entry can contain at most 100 saved revisions.');
      const revIds = new Set<string>();
      for (const r of item.revisions) {
        if (
          !record(r) ||
          !['id', 'saved', 'answer', 'reflection', 'evidence'].every((f) =>
            text(r[f]),
          ) ||
          !(r.id as string).trim() ||
          !(r.answer as string).trim() ||
          !date(r.saved) ||
          revIds.has(r.id as string)
        )
          throw Error('This notebook has an invalid revision.');
        revIds.add(r.id as string);
      }
    }
    if (item.context !== undefined) {
      const c = item.context;
      if (
        !record(c) ||
        !text(c.label) ||
        !['subject', 'compare', 'object', 'journey'].every(
          (f) => c[f] === null || text(c[f]),
        ) ||
        !Number.isInteger(c.year) ||
        c.year === 0 ||
        (c.year as number) < -3300 ||
        (c.year as number) > 2000 ||
        !Number.isInteger(c.step) ||
        (c.step as number) < 0 ||
        !Array.isArray(c.sources) ||
        c.sources.length > 128
      )
        throw Error('This notebook has an invalid saved context.');
      for (const s of c.sources) {
        if (!record(s) || !['id', 'locator'].every((f) => text(s[f])))
          throw Error('This notebook has an invalid source reference.');
        // A deferred bibliography only supplies the id and locator. Earlier
        // builds saved that same shape, so accept it without inventing fields
        // or discarding other notes. Partially filled or unsafe records still fail.
        const metadata = ['title', 'url', 'consulted'];
        const unavailable = metadata.every((field) => s[field] === undefined);
        const complete = metadata.every((field) => text(s[field])) && safeUrl(s.url);
        if (!unavailable && !complete)
          throw Error('This notebook has an invalid source reference.');
      }
    }
  }
  return n as unknown as Notebook;
}
export function readNotebook(): Notebook {
  try {
    return parseNotebook(localStorage.getItem(key) ?? '{"version":1,"notes":[]}');
  } catch {
    return { version: 1, notes: [] };
  }
}
export function writeNotebook(book: Notebook) {
  const raw = JSON.stringify(book);
  parseNotebook(raw);
  localStorage.setItem(key, raw);
}
export function editNote(
  note: Note,
  details: Pick<Note, 'title' | 'question' | 'collection'>,
  now = new Date().toISOString(),
): Note {
  const next = { ...note, ...details, updated: now };
  parseNotebook(JSON.stringify({ version: 1, notes: [next] }));
  return next;
}
export function reviseNote(note: Note, revision: Revision): Note {
  const next = {
    ...note,
    updated: revision.saved,
    revisions: [...(note.revisions ?? []), revision],
  };
  parseNotebook(JSON.stringify({ version: 1, notes: [next] }));
  return next;
}
const canonical = (value: unknown): string => {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (record(value))
    return (
      '{' +
      Object.keys(value)
        .filter((k) => value[k] !== undefined)
        .sort()
        .map((k) => JSON.stringify(k) + ':' + canonical(value[k]))
        .join(',') +
      '}'
    );
  return JSON.stringify(value) ?? 'null';
};
function content(note: Note) {
  const { id: _id, importedFrom: _origin, ...rest } = note;
  return canonical(rest);
}
function fingerprint(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++)
    hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}
export interface MergeResult {
  book: Notebook;
  added: number;
  alternatives: number;
  duplicates: number;
}
export function mergeNotebooks(existing: Notebook, incoming: Notebook): MergeResult {
  const notes = [...existing.notes];
  let added = 0,
    alternatives = 0,
    duplicates = 0;
  for (const note of incoming.notes) {
    const same = notes.find((n) => n.id === note.id);
    const identity = content(note);
    if (same && content(same) === identity) {
      duplicates++;
      continue;
    }
    if (
      notes.some(
        (n) =>
          n.importedFrom === (note.importedFrom ?? note.id) && content(n) === identity,
      )
    ) {
      duplicates++;
      continue;
    }
    if (!same) {
      notes.push(note);
      added++;
      continue;
    }
    const base = note.id.slice(0, 100) + '-import-' + fingerprint(identity);
    let id = base;
    let suffix = 1;
    while (notes.some((n) => n.id === id)) id = base + '-' + suffix++;
    notes.push({ ...note, id, importedFrom: note.importedFrom ?? note.id });
    alternatives++;
  }
  const book = parseNotebook(JSON.stringify({ version: 1, notes }));
  return { book, added, alternatives, duplicates };
}
export async function captureNoteContext(
  corpus: RuntimeCorpus,
  location: Location,
): Promise<NoteContext> {
  const ids = [location.subject, location.compare].filter((id): id is string => !!id);
  const subjects = await Promise.all(
    ids.map(async (id) => {
      try {
        return await loadSubject(id);
      } catch {
        return corpus.subjects.find((s) => s.id === id);
      }
    }),
  );
  const refs: Citation[] = [];
  const gather = (s: Subject) => {
    for (const section of [
      ...s.sections,
      ...(s.deeperReading ?? []),
      ...(s.evidenceReading?.items ?? []),
      ...(s.placeStudy?.points ?? []),
      ...(s.placeStudy?.features ?? []),
    ])
      refs.push(...section.citations);
    for (const claim of s.claims) refs.push(...claim.citations);
    for (const context of corpus.contexts ?? [])
      if (s.contextIds?.includes(context.id)) refs.push(...context.citations);
  };
  for (const s of subjects) if (s) gather(s);
  // Match the dossier's case-local fallback. A stale/foreign object query must
  // not attach another case's accession to the image the reader actually sees.
  const objects = corpus.media.filter((m) => subjects[0]?.objectIds.includes(m.id));
  const object = objects.find((m) => m.id === location.object) ?? objects[0];
  const objectId = object?.id ?? null;
  if (object) refs.push({ source: object.source, locator: object.accession });
  const journey = corpus.journeys.find((j) => j.id === location.journey);
  if (journey) refs.push(...journey.evidence.citations);
  const sources: NoteSource[] = [...new Set(refs.map((r) => r.source))].map((id) => {
    const s = corpus.sources.find((s) => s.id === id);
    const reference = {
      id,
      locator: [
        ...new Set(refs.filter((r) => r.source === id).map((r) => r.locator)),
      ].join('; '),
    };
    return s && [s.title, s.url, s.accessed].every(text) && safeUrl(s.url)
      ? { ...reference, title: s.title, url: s.url, consulted: s.accessed }
      : reference;
  });
  return {
    label: [
      subjects
        .filter(Boolean)
        .map((s) => s!.name)
        .join(' / '),
      formatYear(location.year),
      object?.title,
    ]
      .filter(Boolean)
      .join(' · '),
    subject: location.subject,
    compare: location.compare,
    object: objectId,
    year: location.year,
    journey: location.journey,
    step: location.step,
    sources,
  };
}

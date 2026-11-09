import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  parseNotebook,
  editNote,
  reviseNote,
  mergeNotebooks,
  captureNoteContext,
  readNotebook,
  writeNotebook,
  type Note,
  type Notebook,
} from './notebook-data';
import { initialLocation } from './navigation';
import type { Corpus, RuntimeCorpus } from './model';
const note: Note = {
  id: 'first',
  title: 'A question',
  question: 'How did the gate work?',
  answer: 'My first idea',
  collection: 'Household',
  saved: '2026-10-27T10:00:00Z',
  location: '?subject=tang-city&year=700&object=tang-access-diagram',
  kind: 'question',
};
const book: Notebook = { version: 1, notes: [note] };
const revision = {
  id: 'r1',
  saved: '2026-10-28T10:00:00Z',
  answer: 'A rule does not prove practice.',
  reflection: 'I separated the plan from use.',
  evidence: 'The source notes qualify the reconstruction.',
};
afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});
describe('Notebook keeps initial thinking, revisions and imported alternatives', () => {
  it('round trips an unchanged legacy version-1 notebook', () =>
    expect(parseNotebook(JSON.stringify(book))).toEqual(book));
  it('edits details while preserving creation, context and first answer', () => {
    const next = editNote(
      note,
      {
        title: 'A clearer title',
        question: 'What would test access?',
        collection: 'Cities',
      },
      revision.saved,
    );
    expect(next).toMatchObject({
      saved: note.saved,
      answer: note.answer,
      location: note.location,
      updated: revision.saved,
    });
    expect(note.title).toBe('A question');
  });
  it('appends dated thinking and reflection without replacing the initial answer', () => {
    const next = reviseNote(note, revision);
    expect(next.answer).toBe(note.answer);
    expect(next.revisions).toEqual([revision]);
    expect(
      parseNotebook(JSON.stringify({ version: 1, notes: [next] })).notes[0],
    ).toEqual(next);
  });
  it('rejects malformed or duplicate history without mutating the valid book', () => {
    for (const revisions of [
      [{ ...revision, answer: '' }],
      [revision, revision],
      [{ ...revision, saved: 'not a date' }],
    ])
      expect(() =>
        parseNotebook(JSON.stringify({ version: 1, notes: [{ ...note, revisions }] })),
      ).toThrow();
    expect(book.notes).toEqual([note]);
  });
  it('keeps a conflicting imported entry as an idempotent alternative', () => {
    const incoming: Notebook = { version: 1, notes: [reviseNote(note, revision)] };
    const first = mergeNotebooks(book, incoming);
    expect(first.alternatives).toBe(1);
    expect(first.book.notes[0]).toEqual(note);
    expect(first.book.notes[1]!.revisions).toEqual([revision]);
    expect(first.book.notes[1]!.importedFrom).toBe('first');
    const again = mergeNotebooks(first.book, incoming);
    expect(again.book).toEqual(first.book);
    expect(again.duplicates).toBe(1);
    expect(book.notes).toEqual([note]);
  });
  it('recognizes identical imports despite JSON property order', () => {
    const reordered = Object.fromEntries(
      Object.entries(note).reverse(),
    ) as unknown as Note;
    expect(mergeNotebooks(book, { version: 1, notes: [reordered] })).toMatchObject({
      added: 0,
      alternatives: 0,
      duplicates: 1,
    });
  });
  it('captures precise public context and source locators', async () => {
    const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
    const subject = corpus.subjects.find((s) => s.id === 'tang-city')!;
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, json: async () => subject })),
    );
    const context = await captureNoteContext(corpus, {
      ...initialLocation,
      subject: subject.id,
      pack: 'C5',
      year: 700,
      object: 'tang-access-diagram',
    });
    expect(context).toMatchObject({
      subject: 'tang-city',
      year: 700,
      object: 'tang-access-diagram',
    });
    expect(context.sources.some((s) => s.id === 'tang-wards' && s.locator)).toBe(true);
    const archived = { ...note, context };
    expect(
      parseNotebook(JSON.stringify({ version: 1, notes: [archived] })).notes[0]!
        .context,
    ).toEqual(context);
    expect(() =>
      parseNotebook(
        JSON.stringify({
          version: 1,
          notes: [
            {
              ...archived,
              context: {
                ...context,
                sources: [{ ...context.sources[0], url: 'javascript:alert(1)' }],
              },
            },
          ],
        }),
      ),
    ).toThrow();
  });
  it('retains a default object and available context when full reading is unavailable', async () => {
    const index: RuntimeCorpus = JSON.parse(
      readFileSync('public/atlas/index.json', 'utf8'),
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw Error('offline');
      }),
    );
    const context = await captureNoteContext(index, {
      ...initialLocation,
      subject: 'nalanda',
      year: 680,
      pack: 'C5',
    });
    expect(context.object).toBe('nalanda-brick-photo');
    expect(context.sources.some((s) => s.id === 'nalanda-photo')).toBe(true);
    expect(
      parseNotebook(JSON.stringify({ version: 1, notes: [{ ...note, context }] }))
        .notes[0]?.context,
    ).toEqual(context);
  });
  it.each(['foreign', 'missing'])(
    'saves the displayed case-local image for a %s object query',
    async (invalid) => {
      const index: RuntimeCorpus = JSON.parse(
        readFileSync('public/atlas/index.json', 'utf8'),
      );
      const subject = index.subjects.find((s) => s.id === 'tang-city')!;
      const visible = index.media.find((m) => subject.objectIds.includes(m.id))!;
      const foreign = index.media.find((m) => !subject.objectIds.includes(m.id))!;
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => {
          throw Error('offline');
        }),
      );
      const context = await captureNoteContext(index, {
        ...initialLocation,
        subject: subject.id,
        year: 700,
        object: invalid === 'foreign' ? foreign.id : 'missing-object',
      });
      expect(context.object).toBe(visible.id);
      expect(context.label).toContain(visible.title);
      expect(context.sources.find((s) => s.id === visible.source)?.locator).toContain(
        visible.accession,
      );
      expect(context.object).not.toBe(foreign.id);
    },
  );
});

describe('Notebook source records during a bibliography outage', () => {
  const key = 'chronos.household.v1';
  const source = {
    id: 'tang-wards',
    locator: 'Ward gates and household access',
    title: 'Tang ward study',
    url: 'https://example.test/tang-wards',
    consulted: '2026-10-28',
  };
  const context = {
    label: 'Chang’an · 700 CE',
    subject: 'tang-city',
    compare: null,
    object: 'tang-access-diagram',
    year: 700,
    journey: null,
    step: 0,
    sources: [source],
  };
  const existing = { ...note, context, revisions: [revision] };
  const unavailable = { id: 'tang-changan', locator: 'Successive capitals' };
  const savedDuringFailure = {
    ...note,
    id: 'during-failure',
    context: { ...context, sources: [unavailable] },
  };

  it('recovers the exact incomplete shape saved by older builds without losing earlier notes', () => {
    const raw = JSON.stringify({ version: 1, notes: [savedDuringFailure, existing] });
    localStorage.setItem(key, raw);
    const recovered = readNotebook();
    expect(recovered.notes).toEqual([savedDuringFailure, existing]);
    expect(recovered.notes[0]?.context?.sources).toEqual([unavailable]);
    expect(localStorage.getItem(key)).toBe(raw);
    writeNotebook(recovered);
    expect(readNotebook()).toEqual(recovered);
  });

  it('round trips unavailable references through export/import, another save and reload', () => {
    const exported = JSON.stringify({
      version: 1,
      notes: [savedDuringFailure, existing],
    });
    const imported = parseNotebook(exported);
    const merged = mergeNotebooks({ version: 1, notes: [] }, imported);
    expect(mergeNotebooks(merged.book, imported).duplicates).toBe(2);
    const next = { ...note, id: 'after-recovery', context };
    writeNotebook({ version: 1, notes: [next, ...merged.book.notes] });
    expect(readNotebook().notes).toEqual([next, savedDuringFailure, existing]);
    expect(readNotebook().notes[1]?.context?.sources[0]).not.toHaveProperty('url');
    expect(readNotebook().notes[1]?.context?.sources[0]).not.toHaveProperty('title');
    expect(readNotebook().notes[1]?.context?.sources[0]).not.toHaveProperty(
      'consulted',
    );
  });

  it.each([
    ['only a title', { ...unavailable, title: source.title }],
    ['only a url', { ...unavailable, url: source.url }],
    ['only a consultation date', { ...unavailable, consulted: source.consulted }],
    ['a missing title', { ...source, title: undefined }],
    ['a missing url', { ...source, url: undefined }],
    ['a missing consultation date', { ...source, consulted: undefined }],
    ['a null metadata field', { ...unavailable, title: null }],
    ['an unsafe url', { ...source, url: 'javascript:alert(1)' }],
    ['a missing locator', { id: unavailable.id }],
    ['a missing id', { locator: unavailable.locator }],
  ])('still rejects %s instead of treating it as unavailable', (_label, invalid) => {
    expect(() =>
      parseNotebook(
        JSON.stringify({
          version: 1,
          notes: [{ ...note, context: { ...context, sources: [invalid] } }],
        }),
      ),
    ).toThrow('invalid source reference');
  });

  it('validates before writing so a bad reference cannot replace the stored notebook', () => {
    writeNotebook({ version: 1, notes: [existing] });
    const before = localStorage.getItem(key);
    const invalid: Notebook = {
      version: 1,
      notes: [
        {
          ...note,
          context: { ...context, sources: [{ ...source, url: 'javascript:alert(1)' }] },
        },
      ],
    };
    expect(() => writeNotebook(invalid)).toThrow('invalid source reference');
    expect(localStorage.getItem(key)).toBe(before);
  });
});

import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { readLocation, locationQuery, initialLocation } from './navigation';
import { parseNotebook } from './Notebook';
import { projectInterval, splitDateLine } from './geometry';
import { readBrowserLocation } from './navigation';
import { validateCorpus } from './validate';
import type { Corpus } from './model';
const corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
describe('released historical contract', () => {
  it('rejects scaffold, missing evidence and generated relations', () => {
    expect(validateCorpus(corpus)).toEqual([]);
    const bad = structuredClone(corpus);
    bad.subjects[0]!.summary = 'Appendix B checklist';
    bad.subjects[0]!.claims[0]!.citations = [];
    bad.relations[0]!.id = 'overlap_generated';
    const issues = validateCorpus(bad);
    expect(issues.some((s) => s.includes('scaffold'))).toBe(true);
    expect(issues.some((s) => s.includes('missing evidence'))).toBe(true);
    expect(issues.some((s) => s.includes('unsupported relationship'))).toBe(true);
  });
  it('keeps display clipping from becoming historical facts', () => {
    const bad = structuredClone(corpus);
    bad.subjects[0]!.interval = {
      ...bad.subjects[0]!.interval,
      ongoing: true,
      end: 2000,
    };
    expect(validateCorpus(bad).some((s) => s.includes('manufactured end'))).toBe(true);
    bad.subjects[0]!.interval.start = 0;
    expect(validateCorpus(bad).some((s) => s.includes('year zero'))).toBe(true);
  });
  it('requires the defined coverage program before full acceptance', () => {
    const incomplete = structuredClone(corpus);
    incomplete.packs = incomplete.packs.filter((p) => p.id !== 'C1');
    expect(validateCorpus(incomplete, true)).toContain(
      'Missing required coverage pack C1',
    );
  });
  it('preserves all reconstructible reading context in a URL', () => {
    const location = {
      ...initialLocation,
      year: -1200,
      scale: 'local' as const,
      pack: 'C2',
      region: 'Africa',
      subject: 'test-id',
      object: 'object-id',
      compare: 'other-id',
      evidence: true,
      journey: 'journey-id',
      step: 3,
      returnTo: '?page=explore&view=world&year=200%20CE',
    };
    expect(readLocation(locationQuery(location))).toEqual(location);
  });
  it('recovers malformed navigation safely and never displays year zero', () => {
    const l = readLocation('?year=0&step=-5&pack=bad&page=bad');
    expect(l.year).toBe(200);
    expect(l.step).toBe(0);
    expect(l.pack).toBe('C4');
    expect(readLocation('?step=1.5&region=invalid').step).toBe(1);
    expect(readLocation('?step=Infinity&region=invalid').region).toBe('all');
    expect(readLocation('?step=Infinity').step).toBe(0);
  });
  it('validates imported household notes before replacing local data', () => {
    const n = {
      version: 1,
      notes: [
        {
          id: 'n',
          title: 'A tower',
          question: 'What can it show?',
          answer: 'An idea',
          collection: 'Household',
          saved: '2026-10-26',
          location: '?subject=eastern-han',
          kind: 'question',
        },
      ],
    };
    expect(parseNotebook(JSON.stringify(n))).toEqual(n);
    expect(() => parseNotebook(JSON.stringify({ ...n, version: 2 }))).toThrow();
    expect(() =>
      parseNotebook(JSON.stringify({ ...n, notes: [...n.notes, ...n.notes] })),
    ).toThrow();
    expect(() =>
      parseNotebook(
        JSON.stringify({
          ...n,
          notes: [{ ...n.notes[0], location: 'javascript:alert(1)' }],
        }),
      ),
    ).toThrow();
  });
});

describe('regressions for inherited identity and display failures', () => {
  it('retains full historical dates across chapter clipping', () => {
    const manila = corpus.subjects.find((s) => s.id === 'manila-network')!;
    expect(manila.interval.end).toBe(1815);
    expect(corpus.packs.find((p) => p.id === 'C7')!.end).toBe(1800);
    expect(corpus.subjects.find((s) => s.id === 'byzantium')!.interval.end).toBe(1453);
    expect(corpus.subjects.find((s) => s.id === 'moche')!.interval.end).toBe(800);
  });
  it('accounts for every inherited record without publishing generated edges', () => {
    const ledger = JSON.parse(
      readFileSync('public/atlas/legacy-disposition.json', 'utf8'),
    ) as { type: string; id: string; reason: string; disposition: string }[];
    expect(ledger).toHaveLength(1274);
    expect(new Set(ledger.map((x) => `${x.type}:${x.id}`)).size).toBe(1274);
    expect(ledger.every((x) => x.reason && x.disposition)).toBe(true);
    expect(
      ledger
        .filter((x) => x.type === 'relations' && x.id.startsWith('overlap_'))
        .every((x) => x.disposition === 'excluded'),
    ).toBe(true);
    expect(corpus.relations.every((r) => !r.id.startsWith('overlap_'))).toBe(true);
  });
  it('has a complete editorial assessment for every chapter and region', () => {
    expect(validateCorpus(corpus, true)).toEqual([]);
    expect(corpus.packs).toHaveLength(8);
    for (const p of corpus.packs) {
      expect(Object.keys(p.coverage)).toHaveLength(7);
      expect(
        corpus.journeys.find((j) => j.id === p.journey)?.stops.length,
      ).toBeGreaterThan(2);
    }
  });
});

describe('projection and old-link navigation', () => {
  it('clips an ongoing or crossing interval without altering facts', () => {
    const original = { start: 1565, end: 1815 };
    expect(
      projectInterval(original.start, original.end, { start: 1500, end: 1800 }),
    ).toMatchObject({ clippedEnd: true });
    expect(original.end).toBe(1815);
    expect(projectInterval(-3300, -3000, { start: 1, end: 500 })).toBeNull();
  });
  it('splits a Pacific route at the date line', () => {
    const segments = splitDateLine([
      [120, 10],
      [170, 20],
      [-150, 22],
      [-100, 18],
    ]);
    expect(segments).toHaveLength(2);
    for (const segment of segments)
      for (let i = 1; i < segment.length; i++)
        expect(Math.abs(segment[i]![0] - segment[i - 1]![0])).toBeLessThanOrEqual(180);
  });
  it('explains legacy identity replacements and parses signed BCE years', () => {
    expect(readLocation('?year=-1200').year).toBe(-1200);
    const l = readBrowserLocation('', '#y=476&sel=eastern_roman_empire&z=2');
    expect(l.subject).toBe('byzantium');
    expect(l.legacy).toBe('eastern_roman_empire');
    expect(l.year).toBe(476);
    expect(readLocation(locationQuery(l))).toEqual(l);
  });
});

describe('uncertain temporal coverage', () => {
  it('uses an unknown endpoint as a dated marker rather than a manufactured span', () => {
    const projection = projectInterval(1491, null, { start: 1450, end: 1800 });
    expect(projection?.width).toBe(0);
    expect(projection?.unknownEnd).toBe(true);
  });
});

describe('media publication chronology', () => {
  it('rejects API-style reversed dates and generated adjacent-date edges', () => {
    const bad = structuredClone(corpus);
    bad.media[0]!.date.start = 300;
    bad.media[0]!.date.end = 200;
    bad.relations[0]!.id = 'abut_invented';
    expect(validateCorpus(bad)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('reversed media interval'),
        expect.stringContaining('unsupported relationship'),
      ]),
    );
  });
});

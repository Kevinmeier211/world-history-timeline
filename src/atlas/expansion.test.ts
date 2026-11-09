import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';
import { projectInterval } from './geometry';
const c = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
describe('researched North America and West/Central Asia expansion', () => {
  it('releases the defined inquiries with complete evidence and authentic material', () => {
    for (const id of [
      'poverty-point',
      'hopewell-earthworks',
      'chaco-communities',
      'cahokia-city',
      'ottoman-workshops',
      'isfahan-silk',
      'bukhara-books',
      'zand-iran',
    ]) {
      const s = c.subjects.find((s) => s.id === id)!;
      expect(s, id).toBeDefined();

      expect(s.objectIds.length).toBeGreaterThan(0);
      expect(
        s.claims.every(
          (cl) => cl.checkedOn === '2026-10-27' && cl.citations.length > 0,
        ),
      ).toBe(true);
    }
    expect(validateCorpus(c, true)).toEqual([]);
  });
  it('uses catalogue production dates instead of wider API search envelopes', () => {
    for (const [id, start, end] of [
      ['met-451490', 1575, 1590],
      ['met-449533', 1555, 1560],
      ['met-452671', 1525, 1535],
    ] as const) {
      expect(c.media.find((m) => m.id === id)?.date).toMatchObject({ start, end });
    }
    expect(c.media.find((m) => m.id === 'met-681122')?.date.start).toBe(1789);
    expect(c.subjects.find((s) => s.id === 'zand-iran')?.interval.end).toBe(1794);
  });
  it('distinguishes modern documentation from represented ancient contexts', () => {
    const photo = c.media.find((m) => m.id === 'hopewell-restored-mound')!;
    expect(photo.date.start).toBe(2013);
    expect(photo.depiction).toBe('later depiction');
    expect(photo.representedDate).toContain('1–400');
    const chaco = c.media.find((m) => m.id === 'chaco-corner-door')!;
    expect(chaco.date.start).toBeNull();
    expect(chaco.date.precision).toBe('unknown');
    expect(chaco.date.note).toContain('No photographic date');
  });
  it('gives each journey a printable entry while preserving independent subject dates', () => {
    const refs = c.packs.flatMap((p) => [
      p.journey,
      ...(p.investigations ?? []).map((i) => i.journey),
    ]);
    expect(new Set(refs)).toEqual(new Set(c.journeys.map((j) => j.id)));
    const inquiry = c.packs
      .find((p) => p.id === 'C6')!
      .investigations!.find((i) => i.journey === 'north-american-communities')!;
    expect(inquiry.start).toBe(-1700);
    const chaco = c.subjects.find((s) => s.id === 'chaco-communities')!;
    projectInterval(chaco.interval.start, chaco.interval.end, {
      start: 1000,
      end: 1500,
    });
    expect(chaco.interval.start).toBe(850);
    expect(chaco.interval.end).toBe(1250);
    expect(
      c.packs.find((p) => p.id === 'C7')?.coverage['West/Central Asia'].subjects,
    ).toEqual(['ottoman-workshops', 'isfahan-silk', 'bukhara-books', 'zand-iran']);
  });
  it('rejects companion journeys or comparison references missing from the release', () => {
    const bad = structuredClone(c);
    bad.packs.find((p) => p.id === 'C6')!.investigations![0]!.journey = 'missing';
    bad.packs.find((p) => p.id === 'C7')!.investigations![0]!.comparison[0] = 'missing';
    expect(validateCorpus(bad, true)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('missing companion journey'),
        expect.stringContaining('missing companion comparison'),
        expect.stringContaining('no chapter or printable investigation entry'),
      ]),
    );
  });
});

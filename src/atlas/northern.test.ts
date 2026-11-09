import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import type { Corpus } from './model';
import { validateCorpus } from './validate';
import { projectInterval } from './geometry';
const c = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
describe('Arctic, Northwest Coast and Plains publication contract', () => {
  it('includes the sourced northern investigation in both teaching and printable entry data', () => {
    expect(validateCorpus(c, true)).toEqual([]);
    const j = c.journeys.find((j) => j.id === 'northern-knowledge')!;
    expect(j.stops.map((s) => s.subject)).toEqual([
      'bering-sea-carvers',
      'ozette-makah',
      'blackfoot-bison',
      'hidatsa-villages',
      'inuinnait-sewing',
      'kwakwakawakw-potlatch',
    ]);
    const p = c.packs.find((p) => p.id === 'C8')!;
    const inquiry = p.investigations!.find((i) => i.journey === j.id)!;
    expect(inquiry.comparison).toEqual(['ozette-makah', 'hidatsa-villages']);
    expect(inquiry.start).toBe(300);
    expect(inquiry.end).toBe(1980);
    expect(j.printBreakAfter).toEqual([3]);
  });
  it('keeps competing Ozette burial estimates distinct from village occupation', () => {
    const s = c.subjects.find((s) => s.id === 'ozette-makah')!;
    expect(s.interval).toMatchObject({ start: 1560, end: 1700, precision: 'disputed' });
    expect(s.interval.alternatives).toHaveLength(2);
    expect(
      s.interval.alternatives!.flatMap((a) => a.citations).map((c) => c.source),
    ).toEqual(
      expect.arrayContaining(['ozette-architecture', 'ozette-museum', 'ozette-wsu']),
    );
    expect(s.interval.note).toMatch(/not the village/);
  });
  it('preserves object, observation, publication and legislative dates independently', () => {
    expect(c.media.find((m) => m.id === 'met-717577')!.date).toMatchObject({
      start: 300,
      end: 500,
    });
    expect(c.subjects.find((s) => s.id === 'inuinnait-sewing')!.interval).toMatchObject(
      { start: 1913, end: 1916 },
    );
    expect(c.media.find((m) => m.id === 'inuinnait-plate-1922')!.date).toMatchObject({
      start: 1922,
      end: 1922,
    });
    const k = c.subjects.find((s) => s.id === 'kwakwakawakw-potlatch')!;
    expect(k.sections[1]!.citations.map((c) => c.source)).toContain('umista-ban');
    expect(k.sections[1]!.text).toContain('1 January 1885');
    expect(c.media.find((m) => m.id === 'hunt-title-1921')!.date.start).toBe(1921);
  });
  it('does not pass off reconstructions or explanatory illustrations as excavated objects', () => {
    for (const id of ['knife-earthlodge', 'knife-garden-tools']) {
      const m = c.media.find((m) => m.id === id)!;
      expect(m.depiction).toBe('later depiction');
      expect(m.date.start).toBeNull();
      expect(m.date.precision).toBe('unknown');
    }
    expect(c.media.find((m) => m.id === 'knife-garden-tools')!.caption).toMatch(
      /illustrates tools rather than/,
    );
    const h = c.subjects.find((s) => s.id === 'hidatsa-villages')!;
    projectInterval(h.interval.start, h.interval.end, { start: 1500, end: 1800 });
    expect(h.interval.end).toBe(1845);
  });
  it('rejects source links corrupted by prose formatting', () => {
    const bad = structuredClone(c);
    bad.sources[0]!.url = 'https://archive.org/details/lifeofcoppereski 00jenn';
    expect(validateCorpus(bad, true)).toContain(
      `${bad.sources[0]!.id}: invalid source URL`,
    );
  });
  it('rejects print breaks that duplicate, skip beyond or precede the investigation', () => {
    for (const breaks of [[0], [6], [3, 3], [4, 2]]) {
      const bad = structuredClone(c);
      bad.journeys.find((j) => j.id === 'northern-knowledge')!.printBreakAfter = breaks;
      expect(validateCorpus(bad, true)).toContain(
        'northern-knowledge: invalid print stop break',
      );
    }
  });
  it('keeps every new dossier reachable in its intended chapter and rejects orphan records', () => {
    for (const [id, pack] of [
      ['bering-sea-carvers', 'C4'],
      ['ozette-makah', 'C7'],
      ['blackfoot-bison', 'C7'],
      ['hidatsa-villages', 'C7'],
      ['inuinnait-sewing', 'C8'],
      ['kwakwakawakw-potlatch', 'C8'],
    ])
      expect(c.subjects.find((s) => s.id === id)!.packs).toContain(pack);
    const bad = structuredClone(c);
    bad.subjects[0]!.packs = [];
    expect(validateCorpus(bad, true)).toContain(
      `${bad.subjects[0]!.id}: no chapter membership`,
    );
    bad.subjects[0]!.packs = ['C 8'];
    expect(validateCorpus(bad, true)).toContain(
      `${bad.subjects[0]!.id}: missing pack C 8`,
    );
  });
});

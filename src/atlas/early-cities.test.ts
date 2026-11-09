import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, SearchEntry } from './model';
import { worldAtTime } from './chronology';
import { searchSubjects } from './search-index';
import { sharedDimensions } from './comparisons';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const search: SearchEntry[] = JSON.parse(
  readFileSync('public/atlas/search.json', 'utf8'),
);
const find = (id: string) => corpus.subjects.find((s) => s.id === id)!;

describe('early cities preserve distinct units of time and evidence', () => {
  it('does not stretch the Uruk tablet to fill the reference chronology', () => {
    expect(find('uruk-accounts').interval).toMatchObject({ start: -3100, end: -2900 });
    const world = worldAtTime(corpus, -2400, 'West/Central Asia');
    expect(world.current.map((s) => s.id)).not.toContain('uruk-accounts');
    expect(world.contexts.map((c) => c.id)).toContain('uruk-urban-context');
    expect(find('dholavira').interval).toMatchObject({ start: -3000, end: -1500 });
    expect(find('liangzhu').interval).toMatchObject({ start: -3300, end: -2300 });
  });
  it('keeps modern diagrams separate from ancient object dates and preserves uncertainty', () => {
    for (const id of [
      'uruk-accounting-diagram',
      'dholavira-water-diagram',
      'liangzhu-water-diagram',
    ]) {
      const m = corpus.media.find((m) => m.id === id)!;
      expect(m.depiction).toBe('explanatory diagram');
      expect(m.date.start).toBe(2026);
      expect(m.representedDate).toBeTruthy();
    }
    expect(
      find('dholavira').evidenceReading!.items.some((item) =>
        /excavation/.test(item.text + item.interpretation),
      ),
    ).toBe(true);
    expect(corpus.sources.find((s) => s.id === 'liangzhu-correction')!.scope).toContain(
      '14.98 and 50.72',
    );
    expect(
      find('liangzhu').claims.find((c) => c.id === 'liangzhu-capacity-correction')!
        .citations[0]!.source,
    ).toBe('liangzhu-correction');
  });
  it('connects concepts in search and comparison without inventing a historical relation', () => {
    for (const [query, id] of [
      ['rations', 'uruk-accounts'],
      ['radar', 'dholavira'],
      ['14.98', 'liangzhu'],
    ]) {
      expect(
        searchSubjects(corpus.subjects, search, query!).map((s) => s.id),
      ).toContain(id);
    }
    expect(sharedDimensions(find('dholavira'), find('liangzhu'))).toContain(
      'coordination',
    );
    const journey = corpus.journeys.find((j) => j.id === 'cities-work-water')!;
    expect(journey.stops.map((stop) => stop.subject)).toEqual([
      'uruk-accounts',
      'dholavira',
      'liangzhu',
    ]);
    expect(journey.stops.every((stop) => !stop.relation)).toBe(true);
    expect(journey.introduction).toContain('thematic order');
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, SearchEntry } from './model';
import { worldAtTime } from './chronology';
import { searchSubjects } from './search-index';
import { sharedDimensions } from './comparisons';
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const search: SearchEntry[] = JSON.parse(
  readFileSync('public/atlas/search.json', 'utf8'),
);
const find = (id: string) => c.subjects.find((s) => s.id === id)!;
describe('C4 keeps people, object dates and connections specific', () => {
  it('retains the bounded case windows independently of new reference phases', () => {
    expect(find('palmyra').interval).toMatchObject({ start: 100, end: 299 });
    expect(find('kushan-contexts').interval).toMatchObject({ start: 1, end: 300 });
    expect(find('aksum').interval).toMatchObject({ start: 1, end: 800 });
    expect(worldAtTime(c, 600, 'Africa').contexts.map((x) => x.id)).toContain(
      'aksum-red-sea-context',
    );
    expect(worldAtTime(c, 750, 'Africa').contexts.map((x) => x.id)).not.toContain(
      'aksum-red-sea-context',
    );
    expect(worldAtTime(c, 750, 'Africa').current.map((x) => x.id)).toContain('aksum');
  });
  it('separates the selected people and coin from comparative specimens', () => {
    expect(find('palmyra').deeperReading![0]!.text).toContain('Berlin 27/65');
    expect(find('palmyra').deeperReading![0]!.text).toContain('not a biography');
    expect(find('kushan-contexts').evidenceReading!.items[0]!.interpretation).toContain(
      'should not be transferred',
    );
    expect(find('kushan-contexts').evidenceReading!.items[1]!.interpretation).toContain(
      'lower bound',
    );
  });
  it('keeps the modern excavation figure and older comparison bottle separate', () => {
    const media = c.media.find((m) => m.id === 'beta-samati-coins')!;
    expect(media.date).toMatchObject({ start: 2019, end: 2019 });
    expect(media.representedDate).toContain('fourth–seventh');
    expect(media.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
    expect(find('aksum').objectIds).toEqual(['beta-samati-coins', 'met-256732']);
    expect(c.media.find((m) => m.id === 'met-256732')!.place).toContain(
      'not identified as excavated at Aksum',
    );
    expect(find('aksum').evidenceReading!.items[2]!.interpretation).toContain(
      'not one issue of 200',
    );
  });
  it('adds searchable maintenance, stratigraphy and civic questions without a new inferred relation', () => {
    for (const [q, id] of [
      ['Nukunzuk', 'kushan-contexts'],
      ['Zoskales', 'aksum'],
      ['tariff', 'palmyra'],
    ])
      expect(searchSubjects(c.subjects, search, q!).map((s) => s.id)).toContain(id);
    expect(sharedDimensions(find('kushan-contexts'), find('aksum'))).toContain(
      'coordination',
    );
    expect(c.relations).toHaveLength(2);
    const j = c.journeys.find((j) => j.id === 'objects-work-exchange')!;
    expect(j.stops.map((s) => s.year)).toEqual([200, 159, 600]);
    expect(j.stops.every((s) => !s.relation)).toBe(true);
    expect(j.introduction).toContain('not one traveller');
    expect(find('palmyra').placeStudy!.features[0]!.note).toContain(
      'not an exact ancient road',
    );
    expect(find('kushan-contexts').placeStudy!.description).toContain(
      'not exact coordinates',
    );
    expect(find('aksum').terms).toContain('stratigraphy');
  });
});

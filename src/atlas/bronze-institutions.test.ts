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

describe('C2 separates institutions, shipment and ritual evidence', () => {
  it('keeps the original case windows distinct from wider reference phases', () => {
    expect(find('hattusha-change').interval).toMatchObject({
      start: -1300,
      end: -1200,
    });
    expect(find('uluburun').interval).toMatchObject({ start: -1335, end: -1305 });
    expect(find('shang-ritual').interval).toMatchObject({ start: -1600, end: -1046 });
    const world = worldAtTime(corpus, -1197, 'all');
    expect(world.current.map((s) => s.id)).not.toContain('hattusha-change');
    expect(world.current.map((s) => s.id)).not.toContain('uluburun');
    expect(world.current.map((s) => s.id)).toContain('shang-ritual');
    expect(world.contexts.map((c) => c.id)).toContain('hattusha-capital-context');
    expect(worldAtTime(corpus, -1100, 'all').current.map((s) => s.id)).toContain(
      'shang-ritual',
    );
  });
  it('retains source disagreement, proxy location and qualified object provenance', () => {
    const evidence = find('uluburun').evidenceReading!.items;
    const sources = evidence.flatMap((i) => i.citations.map((c) => c.source));
    expect(sources).toEqual(
      expect.arrayContaining([
        'uluburun-tin-2022',
        'uluburun-tin-2023',
        'uluburun-tin-2025',
      ]),
    );
    expect(find('hattusha-change').evidenceReading!.items[0]!.text).toContain(
      'Gordion',
    );
    expect(corpus.sources.find((s) => s.id === 'hittite-drought')!.author).toContain(
      'Cindy Kocik',
    );
    expect(find('shang-ritual').evidenceReading!.items[1]!.interpretation).toContain(
      'not the writing on this Met bone',
    );
    const gong = corpus.media.find((m) => m.id === 'met-44781')!;
    expect(gong.place).toContain('possibly Anyang');
    expect(gong.date).toMatchObject({ start: -1300, end: -1001 });
    expect(gong.date.note).toContain('search envelope');
    expect(gong.licenseUrl).toBe('https://creativecommons.org/publicdomain/zero/1.0/');
  });
  it('identifies diagrams as modern explanations without ancient production dates', () => {
    for (const id of [
      'hattusha-evidence-diagram',
      'uluburun-evidence-diagram',
      'shang-practices-diagram',
    ]) {
      const m = corpus.media.find((m) => m.id === id)!;
      expect(m.depiction).toBe('explanatory diagram');
      expect(m.date.start).toBe(2026);
      expect(m.representedDate).toBeTruthy();
      expect(m.rights).toContain('no source figure reproduced');
    }
  });
  it('supports a thematic inquiry and search without adding a historical connection', () => {
    for (const [query, id] of [
      ['Gordion', 'hattusha-change'],
      ['remelting', 'uluburun'],
      ['core', 'shang-ritual'],
    ]) {
      expect(
        searchSubjects(corpus.subjects, search, query!).map((s) => s.id),
      ).toContain(id);
    }
    expect(sharedDimensions(find('uluburun'), find('shang-ritual'))).toContain(
      'coordination',
    );
    const journey = corpus.journeys.find(
      (j) => j.id === 'institutions-shipment-ritual',
    )!;
    expect(journey.stops.map((s) => s.subject)).toEqual([
      'uluburun',
      'hattusha-change',
      'shang-ritual',
    ]);
    expect(journey.stops.every((s) => !s.relation)).toBe(true);
    expect(journey.introduction).toContain('thematic order');
  });
});

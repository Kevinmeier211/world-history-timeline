import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, SearchEntry } from './model';
import { worldAtTime } from './chronology';
import { sharedDimensions, comparisonDefinition } from './comparisons';
import { searchSubjects } from './search-index';
import { validateCorpus } from './validate';
const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const find = (id: string) => c.subjects.find((s) => s.id === id)!;
describe('C6 work, obligation and historical voices', () => {
  it('preserves case frames while distinguishing later and broader reference sources', () => {
    expect(find('song-art').interval).toMatchObject({ start: 960, end: 1279 });
    expect(find('mali-networks').interval).toMatchObject({ start: 1230, end: 1600 });
    expect(find('inca-weaving').interval).toMatchObject({ start: 1450, end: 1550 });
    expect(worldAtTime(c, 1615, 'Americas').contexts.map((x) => x.id)).toContain(
      'inka-labor-context',
    );
    expect(worldAtTime(c, 1615, 'Americas').current.map((x) => x.id)).not.toContain(
      'inca-weaving',
    );
    expect(worldAtTime(c, 1280, 'East Asia').contexts.map((x) => x.id)).not.toContain(
      'song-institutions-context',
    );
    expect(
      c
        .contexts!.find((x) => x.id === 'song-institutions-context')!
        .phases.find((p) => p.year === 1127)!.text,
    ).toContain('not the Mongol');
  });
  it('keeps historic depictions and modern diagrams on separate creation clocks', () => {
    const image = c.media.find((m) => m.id === 'catalan-musa-detail')!;
    expect(image.depiction).toBe('later depiction');
    expect(image.date).toMatchObject({ start: 1375, precision: 'approximate' });
    expect(image.licenseUrl).toBe('https://creativecommons.org/publicdomain/mark/1.0/');
    expect(image.rights).toContain('jurisdiction');
    for (const id of ['song-loan-diagram', 'inka-work-diagram']) {
      const diagram = c.media.find((m) => m.id === id)!;
      expect(diagram.date).toMatchObject({ start: 2026, end: 2026 });
      expect(diagram.depiction).toBe('explanatory diagram');
      expect(diagram.representedDate).toBeTruthy();
    }
  });
  it('keeps supplementary archaeology separate from a garment provenance', () => {
    const place = find('inca-weaving').placeStudy!;
    expect(place.features).toHaveLength(0);
    expect(place.description).toContain('not the selected tunic’s findspot');
    expect(place.points.find((p) => p.id === 'yanawilka')!.text).toContain(
      'no connection',
    );
    const scope = c.sources.find((s) => s.id === 'yanawilka-food')!.scope;
    expect(scope).toContain('53 stone tools');
    expect(scope).toContain('nine extra independent');
    expect(scope).toContain('contamination');
  });
  it('offers authored comparisons without creating a relationship from the inquiry', () => {
    for (const other of ['song-art', 'mali-networks']) {
      expect(sharedDimensions(find(other), find('inca-weaving'))).toContain(
        'obligation',
      );
      expect(comparisonDefinition(c, other, 'inca-weaving')?.question).toBeTruthy();
    }
    const journey = c.journeys.find((j) => j.id === 'work-obligation-voices')!;
    expect(journey.stops.map((s) => s.subject)).toEqual([
      'song-art',
      'mali-networks',
      'inca-weaving',
    ]);
    expect(journey.introduction).toContain('not a route');
    expect(journey.evidence!.options.filter((o) => o.supported)).toHaveLength(1);
    expect(c.relations).toHaveLength(2);
  });
  it('indexes explanatory text and validates the resulting corpus', () => {
    const search: SearchEntry[] = JSON.parse(
      readFileSync('public/atlas/search.json', 'utf8'),
    );
    expect(searchSubjects(c.subjects, search, 'seasonal').map((s) => s.id)).toContain(
      'song-art',
    );
    expect(searchSubjects(c.subjects, search, 'Yanawilka').map((s) => s.id)).toContain(
      'inca-weaving',
    );
    for (const id of ['song-art', 'mali-networks', 'inca-weaving']) {
      expect(find(id).deeperReading!.length).toBeGreaterThanOrEqual(3);
      expect(find(id).familyActivity!.steps.length).toBeGreaterThanOrEqual(3);
      expect(find(id).review!.consultedOn).toBe('2026-10-28');
    }
    expect(validateCorpus(c)).toEqual([]);
  });
});

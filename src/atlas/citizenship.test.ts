import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, SearchEntry } from './model';
import { worldAtTime } from './chronology';
import { comparisonPartners, sharedDimensions } from './comparisons';
import { searchSubjects } from './search-index';
import { placeProjection } from './place-projection';
import { clusterPoints } from './map-clusters';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const search: SearchEntry[] = JSON.parse(
  readFileSync('public/atlas/search.json', 'utf8'),
);
const find = (id: string) => corpus.subjects.find((s) => s.id === id)!;

describe('independence and citizenship chronology', () => {
  it('keeps a later reference phase distinct from the original case interval', () => {
    expect(find('south-africa-rights').interval).toMatchObject({
      start: 1994,
      end: 1997,
    });
    expect(find('partition-1947').interval).toMatchObject({ start: 1947, end: 1947 });
    const at1950 = worldAtTime(corpus, 1950, 'all');
    expect(at1950.current.map((s) => s.id)).toEqual(
      expect.arrayContaining(['indonesia-independence', 'ghana-independence']),
    );
    expect(at1950.current.map((s) => s.id)).not.toContain('south-africa-rights');
    expect(at1950.contexts.map((s) => s.id)).toContain(
      'south-africa-democracy-context',
    );
    const at1964 = worldAtTime(corpus, 1964, 'Africa');
    expect(at1964.contexts.map((s) => s.id)).toContain('ghana-independence-context');
    expect(at1964.current.map((s) => s.id)).not.toContain('ghana-independence');
  });
  it('does not lose separate constitutional milestones within 1996', () => {
    const phases = corpus.contexts!.find(
      (c) => c.id === 'south-africa-democracy-context',
    )!.phases;
    expect(phases.filter((p) => p.year === 1996).map((p) => p.label)).toEqual([
      '8 May 1996',
      'October 1996',
      '10 December 1996',
    ]);
    expect(phases.at(-1)?.label).toBe('4 February 1997');
    expect(corpus.media.find((m) => m.id === 'mandela-voting')!.date.start).toBe(1994);
  });
  it('offers supported comparison questions without inventing historical contact', () => {
    const indonesia = find('indonesia-independence');
    expect(comparisonPartners(corpus, indonesia)[0]?.id).toBe('ghana-independence');
    expect(
      sharedDimensions(indonesia, find('ghana-independence')).length,
    ).toBeGreaterThanOrEqual(2);
    expect(corpus.relations.some((r) => [r.from, r.to].includes(indonesia.id))).toBe(
      false,
    );
    const route = corpus.journeys.find((j) => j.id === 'independence-citizenship')!;
    expect(route.stops.map((s) => s.year)).toEqual([1945, 1947, 1957, 1996]);
    expect(route.stops.some((s) => !!s.relation)).toBe(false);
  });
  it('finds the new material through explanatory concepts, not just titles', () => {
    expect(
      searchSubjects(corpus.subjects, search, 'market women').map((s) => s.id),
    ).toContain('ghana-independence');
    expect(
      searchSubjects(corpus.subjects, search, 'Yogyakarta').map((s) => s.id),
    ).toContain('indonesia-independence');
    expect(
      searchSubjects(corpus.subjects, search, 'certification').map((s) => s.id),
    ).toContain('south-africa-rights');
  });
});

describe('local geography at changing viewport sizes', () => {
  it('fits bounds while retaining a consistent local distance scale', () => {
    const { xy } = placeProjection([-4, 4.5, 1.5, 11.3]);
    const northwest = xy([-4, 11.3]);
    const southeast = xy([1.5, 4.5]);
    expect(northwest[0]).toBeGreaterThanOrEqual(40);
    expect(northwest[1]).toBeGreaterThanOrEqual(30);
    expect(southeast[0]).toBeLessThanOrEqual(680);
    expect(southeast[1]).toBeLessThanOrEqual(390);
    const centerLatitude = (4.5 + 11.3) / 2;
    const eastDistance = xy([1, centerLatitude])[0] - xy([0, centerLatitude])[0];
    const northDistance = xy([0, centerLatitude])[1] - xy([0, centerLatitude + 1])[1];
    expect(eastDistance / northDistance).toBeCloseTo(
      Math.cos((centerLatitude * Math.PI) / 180),
      6,
    );
  });
  it('keeps nearby coastal places available when their touch targets overlap', () => {
    const study = find('ghana-independence').placeStudy!;
    const { xy } = placeProjection(study.bounds);
    const markers = study.points.map((p) => {
      const [x, y] = xy(p.coordinates);
      return { x: (x / 720) * 100, y: (y / 420) * 100, item: p.id };
    });
    const groups = clusterPoints(markers, 280, (280 * 420) / 720);
    expect(groups.flatMap((g) => g.points.map((p) => p.item)).sort()).toEqual([
      'accra',
      'kumasi',
      'tema',
    ]);
    expect(groups.some((g) => g.points.length > 1)).toBe(true);
  });
});

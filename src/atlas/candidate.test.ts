import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, RuntimeCorpus, SearchEntry } from './model';
import {
  fullHistory,
  initialLocation,
  locationQuery,
  readLocation,
  worldContext,
} from './navigation';
import { comparisonPartners, sharedDimensions } from './comparisons';
import { searchSubjects } from './search-index';
import { distanceFromInterval, includesYear, worldAtTime } from './chronology';
import { validateCorpus } from './validate';
import { clusterPoints } from './map-clusters';
import { timeMoments } from './time-navigation';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const index: RuntimeCorpus = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
);
const search: SearchEntry[] = JSON.parse(
  readFileSync('public/atlas/search.json', 'utf8'),
);

describe('deferred reference reading', () => {
  it('keeps every context date and navigation choice in the bootstrap', () => {
    expect(index.contextDetailsDeferred).toBe(true);
    expect(corpus.contextDetailsDeferred).not.toBe(true);
    expect(timeMoments(index, 'all')).toEqual(timeMoments(corpus, 'all'));
    for (const region of new Set(corpus.subjects.map((subject) => subject.region)))
      expect(timeMoments(index, region)).toEqual(timeMoments(corpus, region));
    expect(
      index.contexts
        ?.flatMap((context) => context.phases)
        .every((phase) => phase.label === undefined),
    ).toBe(true);
    expect(index.contexts).toEqual(
      corpus.contexts?.map((context) => ({
        ...context,
        phases: context.phases.map((phase) => ({
          ...phase,
          label: undefined,
          title: '',
          text: '',
          citations: [],
        })),
      })),
    );
  });
  it('delivers every complete reference passage separately without altering print', () => {
    const contexts = JSON.parse(readFileSync('public/atlas/contexts.json', 'utf8'));
    expect(contexts).toEqual(corpus.contexts);
    for (const context of corpus.contexts ?? [])
      for (const phase of context.phases)
        expect(phase.text.trim().length).toBeGreaterThan(0);
  });
});

describe('navigation and substantive discovery', () => {
  it('Full history escapes map, regional, comparison and journey state', () => {
    const old = {
      ...initialLocation,
      subject: 'angkor',
      region: 'South Asia',
      view: 'world' as const,
      scale: 'local' as const,
      evidence: true,
      compare: 'cahokia-city',
      journey: 'route',
      object: 'image',
      returnTo: '?subject=old',
      step: 4,
      year: 1200,
    };
    const next = fullHistory(old);
    expect(next).toEqual({
      ...initialLocation,
      view: 'timeline',
      scale: 'world',
      year: 1200,
    });
    expect(readLocation(locationQuery(next))).toEqual(next);
    expect(worldContext(old)).toMatchObject({
      subject: 'angkor',
      region: 'all',
      compare: null,
      evidence: false,
      view: 'world',
    });
  });
  it('every dossier offers a supported partner before and after lazy loading', () => {
    for (const s of corpus.subjects) {
      const partner = comparisonPartners(corpus, s)[0]!;
      expect(partner, s.id).toBeDefined();
      expect(sharedDimensions(s, partner).length, s.id).toBeGreaterThan(0);
      expect(
        comparisonPartners(
          index,
          index.subjects.find((item) => item.id === s.id)!,
        )[0]?.id,
      ).toBe(partner.id);
    }
    const rome = corpus.subjects.find((s) => s.id === 'roman-world')!;
    expect(comparisonPartners(corpus, rome)[0]?.id).toBe('eastern-han');
    expect(
      sharedDimensions(
        rome,
        corpus.subjects.find((s) => s.id === 'eastern-han')!,
      ),
    ).toHaveLength(4);
  });
  it('searches body, concepts and all matching records without an invisible cap', () => {
    expect(
      searchSubjects(index.subjects, search, 'Buddhism').map((s) => s.id),
    ).toContain('borobudur');
    expect(
      searchSubjects(index.subjects, search, 'frontier monopolies').map((s) => s.id),
    ).toContain('eastern-han');
    expect(searchSubjects(index.subjects, search, 'lidar').map((s) => s.id)).toContain(
      'angkor',
    );
    expect(searchSubjects(index.subjects, search, 'Islam').length).toBeGreaterThan(0);
    expect(searchSubjects(index.subjects, search, 'the').length).toBeGreaterThan(16);
    expect(searchSubjects(index.subjects, search, 'zzunrepresentedzz')).toEqual([]);
    expect(searchSubjects(index.subjects, search, '   ')).toEqual([]);
    expect(searchSubjects(index.subjects, search, 'ROME')[0]?.id).toBe('roman-world');
    for (const entries of [[], search]) {
      expect(searchSubjects(index.subjects, entries, 'Han')[0]?.id).toBe('eastern-han');
      expect(searchSubjects(index.subjects, entries, 'Shang')[0]?.id).toBe(
        'shang-ritual',
      );
      expect(searchSubjects(index.subjects, entries, '!!!')).toEqual([]);
    }
  });
});

describe('context does not manufacture historical dates', () => {
  it('groups overlapping phone targets without discarding their individual places', () => {
    const places = [
      { x: 80, y: 30, item: 'Han' },
      { x: 81, y: 35, item: 'Dong Son' },
      { x: 30, y: 50, item: 'Rome' },
    ];
    const phone = clusterPoints(places, 350, 175);
    expect(phone).toHaveLength(2);
    expect(phone.flatMap((g) => g.points.map((p) => p.item)).sort()).toEqual([
      'Dong Son',
      'Han',
      'Rome',
    ]);
    expect(clusterPoints(places, 4000, 2000)).toHaveLength(3);
  });
  it('keeps the 1947 event distinct while explaining its aftermath in 1950', () => {
    const world = worldAtTime(corpus, 1950, 'all');
    expect(world.current.some((s) => s.id === 'partition-1947')).toBe(false);
    expect(world.contexts.some((c) => c.id === 'partition-transition')).toBe(true);
    expect(world.nearby.find((s) => s.region === 'South Asia')?.interval.end).toBe(
      1947,
    );
    expect(new Set([...world.current, ...world.nearby].map((s) => s.region)).size).toBe(
      7,
    );
    expect(worldAtTime(corpus, 200, 'all').current).toHaveLength(10);
    expect(
      worldAtTime(corpus, 200, 'East Asia').current.every(
        (s) => s.region === 'East Asia',
      ),
    ).toBe(true);
    expect(worldAtTime(corpus, 1990, 'all').current.map((s) => s.id)).toEqual([
      'kongo-translation',
    ]);
  });
  it('treats unknown endpoints honestly and counts BCE/CE without year zero', () => {
    const d = { ...corpus.subjects[0]!.interval, start: -1, end: -1 };
    expect(distanceFromInterval(d, 1)).toBe(1);
    expect(includesYear({ ...d, end: null }, 20)).toBe(true);
    expect(includesYear({ ...d, end: null, ongoing: true }, 20)).toBe(true);
    expect(distanceFromInterval({ ...d, start: null, end: null }, 20)).toBe(Infinity);
  });
  it('validates the evidence in new layers and rejects invalid geography and context', () => {
    expect(validateCorpus(corpus, true)).toEqual([]);
    const bad = structuredClone(corpus);
    const angkor = bad.subjects.find((s) => s.id === 'angkor')!;
    angkor.deeperReading![0]!.citations = [{ source: 'invented', locator: 'Nothing' }];
    angkor.contextIds = ['missing'];
    angkor.placeStudy!.points[0]!.coordinates = [181, 91];
    bad.contexts![0]!.phases[0]!.year = 0;
    bad.comparisons![0]!.subjects[1] = 'missing';
    const errors = validateCorpus(bad);
    expect(errors.some((s) => s.includes('unresolved citation invented'))).toBe(true);
    expect(errors.some((s) => s.includes('missing historical context'))).toBe(true);
    expect(errors.some((s) => s.includes('outside bounds'))).toBe(true);
    expect(errors.some((s) => s.includes('invalid phase chronology'))).toBe(true);
    expect(errors.some((s) => s.includes('unsupported comparison'))).toBe(true);
  });
});

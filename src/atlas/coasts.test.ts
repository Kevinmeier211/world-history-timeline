import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus } from './model';
import { placeProjection } from './place-projection';
import { chapterComparisonDimensions, chapterSourceRows } from './chapter-sources';

const c: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const originals = {
  olmec: {
    start: -1200,
    end: -400,
    label: 'c. 1200–400 BCE',
    note: 'Cultural and artistic flourishing frame in Doyle’s essay; not one kingdom’s precise lifespan.',
    precision: 'approximate',
  },
  lapita: {
    start: -1500,
    end: -500,
    label: 'c. 1500–500 BCE',
    note: 'Broad pottery-style frame in the museum essay; regional settlement and later histories have different dates.',
    precision: 'approximate',
  },
  'poverty-point': {
    start: -1700,
    end: -1100,
    label: 'Main earthwork complex, c. 1700–1100 BCE',
    note: 'Main-site construction/use frame from NPS and Louisiana. The wider Poverty Point archaeological tradition has broader dates; these are not the lifespan of an Indigenous people.',
    precision: 'approximate',
  },
};

describe('clay, work and local histories', () => {
  it('preserves full original case conventions while references carry their own dates', () => {
    for (const [id, interval] of Object.entries(originals))
      expect(c.subjects.find((s) => s.id === id)!.interval).toEqual(interval);
    expect(
      c.contexts!.find((x) => x.id === 'olmec-centres-context')!.interval.start,
    ).toBe(-1800);
    expect(
      c.contexts!.find((x) => x.id === 'lapita-islands-context')!.interval.end,
    ).toBe(-400);
    expect(
      c.contexts!.find((x) => x.id === 'poverty-earthworks-context')!.interval.end,
    ).toBe(-1100);
  });

  it('does not turn the plaster cast, acquisition credit or terrain publication into ancient manufacture dates', () => {
    const cast = c.media.find((m) => m.id === 'met-314215-cast')!;
    expect(cast.date.start).toBeNull();
    expect(cast.date.end).toBeNull();
    expect(cast.date.label).toContain('Mid-20th');
    expect(cast.material).toContain('Plaster');
    expect(cast.source).toBe('met-314215-cast');
    expect(cast.licenseUrl).toBe('https://creativecommons.org/publicdomain/zero/1.0/');
    const terrain = c.media.find((m) => m.id === 'poverty-terrain-model')!;
    expect(terrain.depiction).toBe('modern terrain model');
    expect(terrain.date.start).toBe(2023);
    expect(terrain.date.note).toContain('not the LiDAR acquisition');
    expect(terrain.licenseUrl).toBe('https://creativecommons.org/licenses/by/4.0/');
    expect(c.media.find((m) => m.id === 'met-314609')!.date.start).toBe(-1200);
    expect(c.media.find((m) => m.id === 'met-314609')!.date.end).toBe(-900);
  });

  it('projects the actual island references eastward across180° without a connecting route', () => {
    const s = c.subjects.find((s) => s.id === 'lapita')!;
    const study = s.placeStudy!;
    expect(study.crossesAntimeridian).toBe(true);
    expect(study.points.map((p) => p.coordinates)).toEqual([
      [151, -5],
      [168.4, -17.7],
      [-175, -20],
    ]);
    const { xy } = placeProjection(study.bounds, study.crossesAntimeridian);
    const points = study.points.map((p) => xy(p.coordinates));
    expect(points[0]![0]).toBeLessThan(points[1]![0]);
    expect(points[1]![0]).toBeLessThan(points[2]![0]);
    for (const [x, y] of points) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(720);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(420);
    }
    expect(study.features).toEqual([]);
    expect(c.relations).toHaveLength(2);
  });

  it('prints material-work comparison sources and keeps the correct test separate from other useful methods', () => {
    const j = c.journeys.find((j) => j.id === 'clay-work-local-histories')!;
    expect(j.evidence.options.map((o) => o.supported)).toEqual([
      false,
      true,
      false,
      false,
    ]);
    const pair = ['olmec', 'poverty-point'].map((id) =>
      c.subjects.find((s) => s.id === id)!,
    );
    expect(chapterComparisonDimensions(pair)[0]).toBe('material-work');
    expect(chapterSourceRows(c, j, pair).map((row) => row.source.id)).toEqual(
      expect.arrayContaining([
        'olmec-sampling-2020',
        'pp-chronology-2023',
        'pp-gibson',
        'lapita-rove-temper',
        'lapita-nukuleka-uth',
        'lapita-teouma-diet',
        'met-314215-cast',
      ]),
    );
  });

  it('supplies its own making guide and open task without changing the two historical relationships', () => {
    const j = c.journeys.find((j) => j.id === 'clay-work-local-histories')!;
    expect(j.familyEvidence!.object).toBe('lapita-stamp-guide');
    expect(j.stops.some((s) => s.object === j.leadObject)).toBe(true);
    expect(j.familyEvidence!.claimPrompt).not.toBe(j.evidence.prompt);
    const participating = j.stops.map((s) => s.subject);
    expect(
      c.relations.filter(
        (r) => participating.includes(r.from) && participating.includes(r.to),
      ),
    ).toEqual([]);
  });
});

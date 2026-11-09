import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Corpus, PlaceStudy } from './model';
import { placeProjection } from './place-projection';
import { validateCorpus } from './validate';

const corpus: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const crossingBounds: PlaceStudy['bounds'] = [145, -25, -170, 0];

function crossingFixture() {
  const c = structuredClone(corpus);
  const subject = c.subjects.find((s) => s.id === 'lapita')!;
  const citations = [{ source: c.sources[0]!.id, locator: 'Synthetic test only' }];
  const place: PlaceStudy = {
    title: 'Dateline validation fixture',
    description: 'Synthetic coordinates test projection and bounds, not a route.',
    bounds: [...crossingBounds],
    crossesAntimeridian: true,
    points: [
      [151, -5],
      [168.4, -17.7],
      [-175, -20],
    ].map((coordinates, i) => ({
      id: `point-${i}`,
      label: `Test point ${i}`,
      coordinates: coordinates as [number, number],
      text: 'Synthetic geographic validation point.',
      citations,
    })),
    features: [
      {
        label: 'Synthetic feature crossing the dateline',
        kind: 'water',
        points: [
          [179, -10],
          [-179, -10],
        ],
        note: 'Tests coordinate inclusion, not an asserted historical feature.',
        citations,
      },
    ],
  };
  subject.placeStudy = place;
  return { c, place };
}

describe('explicit antimeridian place projection', () => {
  it('keeps dateline neighbours close and all regional points in view', () => {
    const { xy } = placeProjection(crossingBounds, true);
    const westOfLine = xy([179, -12.5]);
    const eastOfLine = xy([-179, -12.5]);
    expect(eastOfLine[0] - westOfLine[0]).toBeGreaterThan(0);
    expect(eastOfLine[0] - westOfLine[0]).toBeLessThan(35);
    expect(eastOfLine[1]).toBe(westOfLine[1]);
    const points: [number, number][] = [
      [151, -5],
      [168.4, -17.7],
      [-175, -20],
    ];
    const projected = points.map(xy);
    for (const [x, y] of projected) {
      expect(x).toBeGreaterThanOrEqual(40);
      expect(x).toBeLessThanOrEqual(680);
      expect(y).toBeGreaterThanOrEqual(30);
      expect(y).toBeLessThanOrEqual(390);
    }
    expect(projected[0]![0]).toBeLessThan(projected[1]![0]);
    expect(projected[1]![0]).toBeLessThan(projected[2]![0]);
  });

  it('retains central-latitude proportions and aligns repeated world images', () => {
    const { xy, land } = placeProjection(crossingBounds, true);
    const latitude = -12.5;
    const eastDistance = xy([-179, latitude])[0] - xy([179, latitude])[0];
    const northDistance = xy([179, latitude])[1] - xy([179, latitude + 2])[1];
    expect(eastDistance / northDistance).toBeCloseTo(
      Math.cos((latitude * Math.PI) / 180),
      12,
    );
    expect(xy([180, latitude])).toEqual(xy([-180, latitude]));
    expect(land.x + land.width).toBeCloseTo(xy([180, latitude])[0], 10);
    expect(Object.keys(land)).toEqual(['x', 'y', 'width', 'height']);
  });

  it('preserves the existing normal projection with an omitted or false flag', () => {
    const bounds: PlaceStudy['bounds'] = [-4, 4.5, 1.5, 11.3];
    for (const flag of [undefined, false]) {
      const { xy, land } = placeProjection(bounds, flag);
      expect(xy([-4, 4.5])).toEqual([215.79347520501094, 390]);
      expect(xy([-1.5, 7])).toEqual([346.89031592772824, 257.64705882352945]);
      expect(xy([1.5, 11.3])).toEqual([504.20652479498904, 30]);
      expect(land).toEqual({
        x: -9013.424111674289,
        y: -4136.470588235294,
        width: 18877.945064071297,
        height: 9529.411764705881,
      });
    }
  });

  it('uses the explicitly selected span rather than choosing a shortest arc', () => {
    const { xy } = placeProjection([10, -10, -10, 10], true);
    expect(xy([10, 0])[0]).toBeCloseTo(40, 10);
    expect(xy([-10, 0])[0]).toBeCloseTo(680, 10);
    expect(xy([180, 0])[0]).toBeCloseTo(360, 10);
  });
});

describe('canonical antimeridian place-study validation', () => {
  it('accepts the compiled baseline and an explicit crossing fixture', () => {
    expect(validateCorpus(corpus)).toEqual([]);
    const { c } = crossingFixture();
    expect(validateCorpus(c)).toEqual([]);
  });

  it.each([false, undefined])('rejects crossing bounds with flag %s', (flag) => {
    const { c, place } = crossingFixture();
    place.crossesAntimeridian = flag;
    expect(validateCorpus(c)).toContain('lapita: invalid place-study bounds');
  });

  it.each(['true', 1, null])('rejects a malformed crossing flag %s', (flag) => {
    const { c, place } = crossingFixture();
    Object.assign(place, { crossesAntimeridian: flag });
    expect(validateCorpus(c)).toContain('lapita: invalid place-study bounds');
  });

  it.each([
    [145, -25, 170, 0],
    [180, -25, -180, 0],
    [181, -25, -170, 0],
    [145, -25, -181, 0],
    [145, 0, -170, -25],
    [145, -91, -170, 0],
    [145, -25, -170, 91],
    [145, -25, -170, Number.NaN],
  ])('rejects malformed crossing bounds %j', (...bounds) => {
    const { c, place } = crossingFixture();
    place.bounds = bounds as PlaceStudy['bounds'];
    expect(validateCorpus(c)).toContain('lapita: invalid place-study bounds');
  });

  it.each([0, 181, -181, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects outside/noncanonical longitude %s in both points and features',
    (longitude) => {
      const { c, place } = crossingFixture();
      place.points[0]!.coordinates = [longitude, -10];
      place.features[0]!.points[0] = [longitude, -10];
      const errors = validateCorpus(c);
      expect(errors).toContain('lapita: place point outside bounds');
      expect(errors).toContain('lapita: invalid place feature');
    },
  );

  it.each([-26, 1, Number.NaN])('rejects outside/nonfinite latitude %s', (latitude) => {
    const { c, place } = crossingFixture();
    place.points[0]!.coordinates = [179, latitude];
    place.features[0]!.points[0] = [179, latitude];
    const errors = validateCorpus(c);
    expect(errors).toContain('lapita: place point outside bounds');
    expect(errors).toContain('lapita: invalid place feature');
  });

  it('accepts canonical boundaries and treats both dateline representations equally', () => {
    const { c, place } = crossingFixture();
    place.points[0]!.coordinates = [145, -25];
    place.points[1]!.coordinates = [-170, 0];
    place.points[2]!.coordinates = [-180, -10];
    place.features[0]!.points = [
      [180, -10],
      [-180, -10],
    ];
    expect(validateCorpus(c)).toEqual([]);
  });

  it('still rejects longitudes outside a normal view', () => {
    const { c, place } = crossingFixture();
    place.bounds = [145, -25, 175, 0];
    place.crossesAntimeridian = false;
    place.points[2]!.coordinates = [-175, -20];
    expect(validateCorpus(c)).toContain('lapita: place point outside bounds');
  });

  it('rejects incomplete or extra bounds and coordinate entries', () => {
    const incomplete = [145, -25, -170, 0];
    delete incomplete[2];
    for (const bounds of [incomplete, [145, -25, -170, 0, 1]]) {
      const { c, place } = crossingFixture();
      place.bounds = bounds as PlaceStudy['bounds'];
      expect(validateCorpus(c)).toContain('lapita: invalid place-study bounds');
    }
    const { c, place } = crossingFixture();
    place.points[0]!.coordinates = [151, -5, 1] as unknown as [number, number];
    place.features[0]!.points[0] = [179] as unknown as [number, number];
    expect(validateCorpus(c)).toEqual(
      expect.arrayContaining([
        'lapita: place point outside bounds',
        'lapita: invalid place feature',
      ]),
    );
  });
});

import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { LEFT_GUTTER, MIN_GAP, PLOT_WIDTH } from './constants.ts';
import { packSplitSeeds } from './lineageSeed.ts';
import { solveLanes, type LaneSliceInput, type SolvedLane } from './laneSolver.ts';

interface Fixture {
  relations: { type: string; year: number; from: string[]; to: string[] }[];
  slices: LaneSliceInput[];
}

function load(name: string): Fixture {
  return JSON.parse(
    readFileSync(`src/layout/__fixtures__/${name}.json`, 'utf8'),
  ) as Fixture;
}

function lane(
  slice: { lanes: readonly SolvedLane[] } | undefined,
  id: string,
): SolvedLane {
  const found = slice?.lanes.find((item) => item.id === id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
}

function assertPacked(lanes: readonly SolvedLane[]): void {
  for (const item of lanes) {
    const half = item.width / 2;
    expect(item.x).toBeGreaterThanOrEqual(LEFT_GUTTER + half - 1e-6);
    expect(item.x).toBeLessThanOrEqual(LEFT_GUTTER + PLOT_WIDTH - half + 1e-6);
  }
  for (let index = 0; index < lanes.length - 1; index += 1) {
    const left = lanes[index];
    const right = lanes[index + 1];
    if (!left || !right) continue;
    const need = (left.width + right.width) / 2 + MIN_GAP;
    expect(right.x - left.x).toBeGreaterThanOrEqual(need - 0.5 - 1e-6);
  }
}

describe('split and merge seeding', () => {
  it('packs split children on the parent, left to right by desired x', () => {
    const seeds = packSplitSeeds(500, [
      {
        id: 'east',
        familyId: 'latin_west',
        weight: 0.2,
        importance: 3,
        desiredX: 640,
      },
      {
        id: 'west',
        familyId: 'latin_west',
        weight: 0.2,
        importance: 3,
        desiredX: 430,
      },
    ]);
    const west = seeds.get('west');
    const east = seeds.get('east');
    expect(west).toBeDefined();
    expect(east).toBeDefined();
    if (west === undefined || east === undefined) return;
    expect(west).toBeLessThan(east);
    expect((west + east) / 2).toBeCloseTo(500);
    expect(east - west).toBeCloseTo(28 + MIN_GAP);
  });

  it('keeps the western Roman ribbon left of the eastern one', () => {
    const fixture = load('split-rome');
    const solved = solveLanes(fixture.slices, fixture.relations);
    const empire = lane(solved[1], 'empire');
    const west = lane(solved[2], 'west');
    const east = lane(solved[2], 'east');
    expect(west.x).toBeLessThan(east.x);
    expect(solved[2]?.lanes.map((item) => item.id)).toEqual(['west', 'east']);
    assertPacked(solved[2]?.lanes ?? []);
    expect(empire.x).toBeCloseTo(510, 0);
  });

  it('pulls Castile and Aragon together without crossing, and seats Spain between them', () => {
    const fixture = load('merge-spain');
    const merged = solveLanes(fixture.slices, fixture.relations);
    const apart = solveLanes(fixture.slices, []);
    const castile = lane(merged[0], 'castile');
    const aragon = lane(merged[0], 'aragon');
    const spain = lane(merged[1], 'spain');
    const openGap = lane(apart[0], 'aragon').x - lane(apart[0], 'castile').x;
    expect(castile.x).toBeLessThan(aragon.x);
    expect(aragon.x - castile.x).toBeLessThan(openGap - 20);
    expect(spain.x).toBeGreaterThan(castile.x);
    expect(spain.x).toBeLessThan(aragon.x);
    assertPacked(merged[0]?.lanes ?? []);
  });
});

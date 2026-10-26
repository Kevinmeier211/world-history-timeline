import { describe, expect, it } from 'vitest';

import {
  LEFT_GUTTER,
  MAX_RIBBON_W,
  MIN_GAP,
  MIN_RIBBON_W,
  PLOT_WIDTH,
  laneMass,
  ribbonWidth,
} from './constants.ts';
import { solveLanes, type LaneRibbon, type SolvedSlice } from './laneSolver.ts';

function ribbon(
  id: string,
  desiredX: number,
  weight = 0.2,
  importance = 2,
  familyId = 'f',
): LaneRibbon {
  return { id, familyId, weight, importance, desiredX };
}

function assertPacked(slice: SolvedSlice): void {
  for (const lane of slice.lanes) {
    expect(Number.isFinite(lane.x)).toBe(true);
    const half = lane.width / 2;
    expect(lane.x).toBeGreaterThanOrEqual(LEFT_GUTTER + half - 1e-6);
    expect(lane.x).toBeLessThanOrEqual(LEFT_GUTTER + PLOT_WIDTH - half + 1e-6);
  }
  for (let index = 0; index < slice.lanes.length - 1; index += 1) {
    const left = slice.lanes[index];
    const right = slice.lanes[index + 1];
    if (!left || !right) continue;
    const need = (left.width + right.width) / 2 + MIN_GAP;
    expect(right.x - left.x).toBeGreaterThanOrEqual(need - 0.5 - 1e-6);
  }
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

describe('lane solver', () => {
  it('uses the Appendix G width and mass formulas', () => {
    expect(MIN_RIBBON_W).toBe(12);
    expect(MAX_RIBBON_W).toBe(92);
    expect(MIN_GAP).toBe(6);
    expect(ribbonWidth(0)).toBe(16);
    expect(ribbonWidth(1)).toBe(92);
    expect(ribbonWidth(0.5)).toBe(52);
    expect(laneMass(0.2, 3)).toBeCloseTo(1.45);
  });

  it('orders a first slice by desired x, then family, then id', () => {
    const solved = solveLanes([
      {
        start: 1,
        end: 50,
        ribbons: [
          ribbon('b', 400, 0.2, 2, 'm'),
          ribbon('a', 400, 0.2, 2, 'm'),
          ribbon('c', 400, 0.2, 2, 'a'),
          ribbon('d', 200),
        ],
      },
    ]);
    expect(solved[0]?.lanes.map((lane) => lane.id)).toEqual(['d', 'c', 'a', 'b']);
    if (solved[0]) assertPacked(solved[0]);
  });

  it('keeps a continuing order and inserts a newcomer by desired x', () => {
    const solved = solveLanes([
      {
        start: 1,
        end: 50,
        ribbons: [ribbon('a', 300), ribbon('b', 800)],
      },
      {
        start: 50,
        end: 100,
        ribbons: [ribbon('a', 900), ribbon('b', 200), ribbon('c', 500)],
      },
    ]);
    expect(solved[1]?.lanes.map((lane) => lane.id)).toEqual(['c', 'a', 'b']);
    if (solved[1]) assertPacked(solved[1]);
  });

  it('moves a heavier ribbon less than a lighter one', () => {
    const solved = solveLanes([
      {
        start: 1,
        end: 20,
        ribbons: [ribbon('heavy', 700, 1, 5), ribbon('light', 700, 0.05, 1)],
      },
    ]);
    const lanes = solved[0]?.lanes ?? [];
    const heavy = lanes.find((lane) => lane.id === 'heavy');
    const light = lanes.find((lane) => lane.id === 'light');
    expect(heavy).toBeDefined();
    expect(light).toBeDefined();
    if (!heavy || !light) return;
    expect(Math.abs(heavy.x - 700)).toBeLessThan(Math.abs(light.x - 700));
  });

  it('clamps a center into the plot', () => {
    const solved = solveLanes([
      {
        start: 1,
        end: 10,
        ribbons: [ribbon('left', -5000), ribbon('right', 9000)],
      },
    ]);
    if (solved[0]) assertPacked(solved[0]);
    expect(solved[0]?.lanes[0]?.id).toBe('left');
    expect(solved[0]?.lanes[1]?.id).toBe('right');
  });

  it('is deterministic and packs seeded slices without overlap', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const random = mulberry32(seed);
      const count = 1 + Math.floor(random() * 8);
      const ribbons: LaneRibbon[] = [];
      for (let index = 0; index < count; index += 1) {
        const weight = 0.05 + random() * 0.3;
        const width = ribbonWidth(weight);
        const min = LEFT_GUTTER + width / 2;
        const max = LEFT_GUTTER + PLOT_WIDTH - width / 2;
        ribbons.push({
          id: `r${index}`,
          familyId: `f${Math.floor(random() * 4)}`,
          weight,
          importance: 1 + Math.floor(random() * 5),
          desiredX: min + random() * (max - min),
        });
      }
      const input = [{ start: -100, end: -50, ribbons }];
      const once = solveLanes(input);
      const twice = solveLanes(input);
      expect(twice).toEqual(once);
      const slice = once[0];
      expect(slice).toBeDefined();
      if (slice) assertPacked(slice);
    }
  });
});

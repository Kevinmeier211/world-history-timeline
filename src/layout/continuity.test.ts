import { describe, expect, it } from 'vitest';

import { LEFT_GUTTER, MIN_GAP, PLOT_WIDTH } from './constants.ts';
import { easeCenterlines, type CenterSample } from './continuity.ts';

function sample(id: string, y: number, x: number, width = 40): CenterSample {
  return { id, y, x, width };
}

function minEdgeGap(row: readonly CenterSample[]): number {
  const ordered = [...row].sort(
    (left, right) => left.x - right.x || left.id.localeCompare(right.id),
  );
  let min = Number.POSITIVE_INFINITY;
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const left = ordered[index];
    const right = ordered[index + 1];
    if (!left || !right) continue;
    const gap = right.x - right.width / 2 - (left.x + left.width / 2);
    if (gap < min) min = gap;
  }
  return min;
}

describe('eased centerlines', () => {
  it('keeps a ribbon when four neighbors leave on the next year', () => {
    const width = 50;
    const y0 = 1965.74;
    const y1 = 1966.36;
    const samples: CenterSample[] = [];
    for (let index = 0; index < 28; index += 1) {
      const id = `p${String(index).padStart(2, '0')}`;
      samples.push(sample(id, y0, 200 + index * 5, width));
      if (index >= 16 && index <= 19) continue;
      samples.push(sample(id, y1, 200 + index * 5, width));
    }
    easeCenterlines(samples);
    const before = samples.find((item) => item.id === 'p20' && item.y === y0);
    const after = samples.find((item) => item.id === 'p20' && item.y === y1);
    expect(before).toBeDefined();
    expect(after).toBeDefined();
    if (!before || !after) return;
    expect(Math.abs(after.x - before.x)).toBeLessThan(1);
    expect(minEdgeGap(samples.filter((item) => item.y === y0))).toBeGreaterThanOrEqual(
      MIN_GAP - 0.05,
    );
    expect(minEdgeGap(samples.filter((item) => item.y === y1))).toBeGreaterThanOrEqual(
      MIN_GAP - 0.05,
    );
    expect(after.x).toBeGreaterThan(LEFT_GUTTER);
    expect(after.x).toBeLessThan(LEFT_GUTTER + PLOT_WIDTH);
  });

  it('seats a wide newcomer beside a pair that cannot hold it', () => {
    const samples = [
      sample('left', 0, 300, 40),
      sample('right', 0, 420, 40),
      sample('left', 10, 300, 40),
      sample('right', 10, 420, 40),
      sample('mid', 10, 360, 80),
    ];
    easeCenterlines(samples);
    const mid = samples.find((item) => item.id === 'mid');
    const left = samples.find((item) => item.id === 'left' && item.y === 10);
    const right = samples.find((item) => item.id === 'right' && item.y === 10);
    expect(mid).toBeDefined();
    expect(left).toBeDefined();
    expect(right).toBeDefined();
    if (!mid || !left || !right) return;
    expect(Math.abs(left.x - 300)).toBeLessThan(1);
    expect(Math.abs(right.x - 420)).toBeLessThan(1);
    expect(minEdgeGap(samples.filter((item) => item.y === 10))).toBeGreaterThanOrEqual(
      MIN_GAP - 0.05,
    );
    expect(Math.abs(mid.x - left.x)).toBeGreaterThan(1);
    expect(Math.abs(mid.x - right.x)).toBeGreaterThan(1);
  });

  it('keeps a crowded fan-out wide enough for a 10px name', () => {
    const parents = 8;
    const children = 39;
    const y0 = 3219.38;
    const y1 = 3281.38;
    const samples: CenterSample[] = [];
    for (let index = 0; index < parents; index += 1) {
      const id = `p${index}`;
      const x = 124 + index * 140;
      samples.push(sample(id, y0, x, 32));
      samples.push(sample(id, y1, x, 32));
    }
    for (let index = 0; index < children; index += 1) {
      samples.push(sample(`c${index}`, y1, 98 + index * 34, 28));
    }
    easeCenterlines(samples);
    const row = samples.filter((item) => item.y === y1);
    expect(minEdgeGap(row)).toBeGreaterThanOrEqual(MIN_GAP - 0.05);
    expect(Math.min(...row.map((item) => item.width))).toBeGreaterThanOrEqual(
      10 / 0.62,
    );
    const parent = samples.find((item) => item.id === 'p4' && item.y === y1);
    const prior = samples.find((item) => item.id === 'p4' && item.y === y0);
    expect(parent).toBeDefined();
    expect(prior).toBeDefined();
    if (!parent || !prior) return;
    expect(Math.abs(parent.x - prior.x)).toBeLessThanOrEqual(0.35 * (y1 - y0) + 0.05);
  });

  it('moves a new ribbon off a continuing one', () => {
    const samples = [
      sample('old', 0, 400, 40),
      sample('old', 10, 400, 40),
      sample('new', 10, 405, 40),
    ];
    easeCenterlines(samples);
    const kept = samples.find((item) => item.id === 'old' && item.y === 10);
    const added = samples.find((item) => item.id === 'new');
    expect(kept).toBeDefined();
    expect(added).toBeDefined();
    if (!kept || !added) return;
    expect(Math.abs(kept.x - 400)).toBeLessThan(1);
    expect(Math.abs(added.x - kept.x)).toBeGreaterThanOrEqual(40 + MIN_GAP - 0.1);
  });
});

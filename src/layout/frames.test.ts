import { describe, expect, it } from 'vitest';

import { MIN_GAP } from './constants.ts';
import { separateRuns, type DatedPoint } from './frames.ts';

function point(y: number, x: number, width = 40): DatedPoint {
  return { y, x, width, year: -100 };
}

describe('drawn separation', () => {
  it('opens a gap when drift stacks two ribbons', () => {
    const left = [point(0, 200), point(100, 200)];
    const right = [point(0, 400), point(100, 210)];
    separateRuns(
      new Map([
        ['a', [left]],
        ['b', [right]],
      ]),
    );
    const a = left.at(-1);
    const b = right.at(-1);
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    if (!a || !b) return;
    expect(b.x - a.x).toBeGreaterThanOrEqual(40 + MIN_GAP - 1e-6);
  });

  it('keeps the gap at a year that only one ribbon sampled', () => {
    const left = [point(0, 200), point(100, 200)];
    const right = [point(50, 210)];
    separateRuns(
      new Map([
        ['a', [left]],
        ['b', [right]],
      ]),
    );
    const mid = left.find((sample) => sample.y === 50);
    expect(mid).toBeDefined();
    expect((right[0]?.x ?? 0) - (mid?.x ?? 0)).toBeGreaterThanOrEqual(
      40 + MIN_GAP - 1e-6,
    );
  });
});

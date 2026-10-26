import { describe, expect, it } from 'vitest';

import {
  gateFailures,
  labelFitByImportance,
  maxRibbonDrift,
  relationRouting,
  ribbonOverlap,
} from './metrics.ts';
import type { LayoutLabel, LayoutRibbon } from './types.ts';

function ribbon(
  id: string,
  frames: { y: number; x: number; width: number; breakBefore?: boolean }[],
): LayoutRibbon {
  return { polityId: id, familyId: 'f', d: 'M 0 0', keyframes: frames };
}

describe('layout metrics', () => {
  it('counts a drawn overlap and ignores a break', () => {
    const clear = ribbonOverlap([
      ribbon('a', [
        { y: 0, x: 100, width: 20 },
        { y: 100, x: 100, width: 20 },
      ]),
      ribbon('b', [
        { y: 0, x: 130, width: 20 },
        { y: 100, x: 130, width: 20 },
      ]),
    ]);
    expect(clear.overlaps).toBe(0);
    expect(clear.minGap).toBeCloseTo(10);

    const crossed = ribbonOverlap([
      ribbon('a', [
        { y: 0, x: 100, width: 40 },
        { y: 50, x: 100, width: 40, breakBefore: true },
        { y: 100, x: 100, width: 40 },
      ]),
      ribbon('b', [
        { y: 0, x: 110, width: 40 },
        { y: 100, x: 110, width: 40 },
      ]),
    ]);
    expect(crossed.overlaps).toBe(1);
    expect(crossed.minGap).toBeLessThan(0);
  });

  it('rates fitted labels by importance and skips an unknown id', () => {
    const labels = [
      { polityId: 'a', fitted: true },
      { polityId: 'b', fitted: false },
      { polityId: 'missing', fitted: true },
    ] as LayoutLabel[];
    const tiers = labelFitByImportance(
      labels,
      new Map([
        ['a', 3],
        ['b', 3],
      ]),
    );
    expect(tiers.get(3)).toEqual({ fitted: 1, total: 2, rate: 0.5 });
  });

  it('calls a culled endpoint omitted and an empty curve unroutable', () => {
    const ribbons = [ribbon('a', []), ribbon('b', [])];
    const counts = relationRouting(
      [
        { id: 'kept', from: ['a'], to: ['b'] },
        { id: 'blank', from: ['a'], to: ['b'] },
        { id: 'gone', from: ['a'], to: ['c'] },
      ],
      ribbons,
      [
        { relationId: 'kept', type: 'succession', d: 'M 0 0', sideAttach: false },
        { relationId: 'blank', type: 'succession', d: '', sideAttach: false },
      ],
    );
    expect(counts).toEqual({ unroutable: 1, omitted: 1 });
  });

  it('reads the steepest slant and skips a break', () => {
    const drift = maxRibbonDrift([
      ribbon('a', [
        { y: 0, x: 0, width: 10 },
        { y: 10, x: 4, width: 10 },
        { y: 10, x: 100, width: 10, breakBefore: true },
        { y: 20, x: 100, width: 10 },
      ]),
    ]);
    expect(drift).toBeCloseTo(0.4);
  });

  it('fails a gate only on the §6.4 bars', () => {
    expect(
      gateFailures({ overlaps: 0, unroutable: 0, importance3Fit: 0.9, warmMs: 149 }),
    ).toEqual([]);
    expect(
      gateFailures({ overlaps: 2, unroutable: 1, importance3Fit: 0.5, warmMs: 150 }),
    ).toEqual(['overlaps', 'unroutable', 'importance3Fit', 'runtimeMs']);
  });
});

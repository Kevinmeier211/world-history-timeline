import { describe, expect, it } from 'vitest';

import { FOLD_MS, foldDuration, interpolateRibbons } from './interpolate.ts';
import type { LayoutRibbon } from './types.ts';

function ribbon(
  id: string,
  x0: number,
  x1: number,
  opacity?: number,
  y1 = 40,
): LayoutRibbon {
  return {
    polityId: id,
    familyId: 'f',
    d: `M ${x0} 0`,
    keyframes: [
      { y: 10, x: x0, width: 8 },
      { y: y1, x: x1, width: 12 },
    ],
    opacity,
  };
}

describe('fold interpolation', () => {
  it('holds the endpoints and lerps the centerline halfway', () => {
    const from = [ribbon('a', 0, 20)];
    const to = [ribbon('a', 100, 80)];
    expect(foldDuration(true)).toBe(0);
    expect(foldDuration(false)).toBe(FOLD_MS);
    expect(FOLD_MS).toBeLessThanOrEqual(300);
    expect(interpolateRibbons(from, to, 0)).toBe(from);
    expect(interpolateRibbons(from, to, Number.NaN)).toBe(from);
    expect(interpolateRibbons(from, to, -1)).toBe(from);
    expect(interpolateRibbons(from, to, 1)).toBe(to);
    expect(interpolateRibbons(from, to, 2)).toBe(to);
    const mid = interpolateRibbons(from, to, 0.5);
    expect(mid[0]?.keyframes[0]).toEqual({ y: 10, x: 50, width: 8 });
    expect(mid[0]?.keyframes[1]).toEqual({ y: 40, x: 50, width: 12 });
    const wide = interpolateRibbons(
      [
        {
          polityId: 'w',
          familyId: 'f',
          d: 'M 0 0',
          keyframes: [
            { y: 0, x: 0, width: 4 },
            { y: 20, x: 0, width: 4 },
          ],
        },
      ],
      [
        {
          polityId: 'w',
          familyId: 'f',
          d: 'M 0 0',
          keyframes: [
            { y: 0, x: 10, width: 12 },
            { y: 20, x: 10, width: 12 },
          ],
        },
      ],
      0.5,
    );
    expect(wide[0]?.keyframes[0]).toEqual({ y: 0, x: 5, width: 8 });
    expect(mid[0]?.d.startsWith('M ')).toBe(true);
    expect(mid[0]?.d).not.toBe(from[0]?.d);
  });

  it('fades ribbons that enter or leave and holds a sample the other side lacks', () => {
    const staying = ribbon('stay', 0, 10);
    const leaving = ribbon('leave', 4, 6, 0.5);
    const entering = ribbon('enter', 8, 9);
    const mid = interpolateRibbons([staying, leaving], [staying, entering], 0.5);
    expect(mid.map((item) => item.polityId)).toEqual(['stay', 'enter', 'leave']);
    expect(mid.find((item) => item.polityId === 'leave')?.opacity).toBeCloseTo(0.25);
    expect(mid.find((item) => item.polityId === 'enter')?.opacity).toBeCloseTo(0.5);
    const short = interpolateRibbons(
      [ribbon('a', 0, 30, undefined, 80)],
      [ribbon('a', 10, 40, undefined, 20)],
      0.5,
    );
    expect(short[0]?.keyframes.at(-1)?.x).toBe(30);
    const stuck: LayoutRibbon = {
      polityId: 'one',
      familyId: 'f',
      d: 'M 0 0',
      keyframes: [{ y: 10, x: 5, width: 8 }],
    };
    expect(interpolateRibbons([stuck], [stuck], 0.5)).toEqual([]);
    const flat: LayoutRibbon = {
      polityId: 'flat',
      familyId: 'f',
      d: 'M 0 0',
      keyframes: [
        { y: 10, x: 1, width: 4 },
        { y: 10, x: 3, width: 6 },
      ],
    };
    const sampled = interpolateRibbons([flat], [ribbon('flat', 5, 7)], 0.5);
    expect(sampled[0]?.keyframes[0]?.x).toBeCloseTo(3);
    const stepped = interpolateRibbons(
      [
        {
          polityId: 's',
          familyId: 'f',
          d: 'M 0 0',
          keyframes: [
            { y: 0, x: 0, width: 4 },
            { y: 10, x: 0, width: 4 },
            { y: 20, x: 0, width: 4 },
          ],
        },
      ],
      [
        {
          polityId: 's',
          familyId: 'f',
          d: 'M 0 0',
          keyframes: [
            { y: 0, x: 8, width: 4 },
            { y: 15, x: 8, width: 4 },
            { y: 20, x: 8, width: 4 },
          ],
        },
      ],
      0.5,
    );
    expect(stepped[0]?.keyframes.find((point) => point.y === 15)?.x).toBe(4);
    const blank: LayoutRibbon = {
      polityId: 'e',
      familyId: 'f',
      d: '',
      keyframes: [],
    };
    const entered = interpolateRibbons([blank], [ribbon('e', 1, 2)], 0.5);
    expect(entered[0]?.opacity).toBeUndefined();
    expect(entered[0]?.d.startsWith('M ')).toBe(true);
  });
});

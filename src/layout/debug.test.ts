import { describe, expect, it } from 'vitest';

import { MAX_DRIFT } from './constants.ts';
import { layoutDebug } from './debug.ts';
import type { LayoutRibbon } from './types.ts';

function ribbon(id: string, x: number): LayoutRibbon {
  return {
    polityId: id,
    familyId: 'f',
    d: 'M 0 0',
    keyframes: [
      { y: 0, x, width: 40 },
      { y: 100, x, width: 40 },
    ],
  };
}

describe('layout debug payload', () => {
  it('boxes the ribbon and records an overlap, a drop, and an unfit label', () => {
    const debug = layoutDebug({
      lanes: [{ polityId: 'a', x: 100, y0: 0, y1: 100 }],
      ribbons: [ribbon('a', 100), ribbon('b', 110)],
      labels: [
        {
          polityId: 'a',
          text: 'A',
          x: 90,
          y: 10,
          width: 20,
          height: 12,
          fontSize: 12,
          orientation: 'horizontal',
          fitted: false,
        },
      ],
      callouts: [
        {
          calloutId: 'note',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          placed: false,
          marker: false,
        },
      ],
      plates: [],
      relations: [{ id: 'blank', from: ['a'], to: ['b'] }],
      connectors: [
        { relationId: 'blank', type: 'succession', d: '', sideAttach: false },
      ],
      importance: new Map([['a', 3]]),
    });
    expect(debug.lanes).toHaveLength(1);
    expect(debug.boxes.map((item) => item.id)).toEqual([
      'ribbon:a',
      'ribbon:b',
      'label:a',
    ]);
    expect(debug.violations.map((item) => item.code)).toEqual([
      'overlap',
      'unroutable',
      'unfit',
      'dropped',
    ]);
    expect(debug.violations[0]?.ids).toEqual(['a', 'b']);
  });

  it('records a slant steeper than the cap', () => {
    const debug = layoutDebug({
      lanes: [],
      ribbons: [
        {
          polityId: 'a',
          familyId: 'f',
          d: 'M',
          keyframes: [
            { y: 0, x: 0, width: 10 },
            { y: 10, x: 10, width: 10 },
          ],
        },
      ],
      labels: [],
      callouts: [],
      plates: [],
      relations: [],
      connectors: [],
      importance: new Map(),
    });
    expect(1).toBeGreaterThan(MAX_DRIFT);
    expect(debug.violations.map((item) => item.code)).toEqual(['drift']);
    expect(debug.violations[0]?.ids).toEqual(['a']);
  });
});

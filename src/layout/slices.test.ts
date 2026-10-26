import { describe, expect, it } from 'vitest';

import { buildSlices, eventYears } from './slices.ts';

describe('time slices', () => {
  it('splits on starts, ends, relation years, and width years', () => {
    const polities = [
      {
        id: 'rome',
        start: -27,
        end: 395,
        widthProfile: [{ year: 100, w: 0.4 }],
      },
      { id: 'west', start: 395, end: 476 },
    ];
    const relations = [{ year: 395 }, { year: 200 }];
    expect(eventYears(polities, relations)).toEqual([-27, 100, 200, 395, 476]);
    expect(buildSlices(polities, relations)).toEqual([
      { start: -27, end: 100, span: 126, activeIds: ['rome'] },
      { start: 100, end: 200, span: 100, activeIds: ['rome'] },
      { start: 200, end: 395, span: 195, activeIds: ['rome'] },
      { start: 395, end: 476, span: 81, activeIds: ['west'] },
    ]);
  });

  it('keeps a polity active only while it covers the whole slice', () => {
    const polities = [
      { id: 'a', start: -1000, end: -200 },
      { id: 'b', start: -500, end: -200 },
    ];
    expect(buildSlices(polities)).toEqual([
      { start: -1000, end: -500, span: 500, activeIds: ['a'] },
      { start: -500, end: -200, span: 300, activeIds: ['a', 'b'] },
    ]);
  });

  it('orders event years across the missing year 0', () => {
    const polities = [{ id: 'cross', start: -5, end: 5 }];
    const slices = buildSlices(polities, [{ year: -1 }, { year: 1 }]);
    expect(slices.map((slice) => [slice.start, slice.end, slice.span])).toEqual([
      [-5, -1, 4],
      [-1, 1, 1],
      [1, 5, 4],
    ]);
    expect(slices.every((slice) => slice.activeIds[0] === 'cross')).toBe(true);
  });

  it('drops a zero-length slice when a life or a repeated year has no duration', () => {
    expect(buildSlices([{ id: 'point', start: -400, end: -400 }])).toEqual([]);
    const slices = buildSlices(
      [
        { id: 'point', start: -500, end: -500 },
        {
          id: 'real',
          start: -500,
          end: -400,
          widthProfile: [{ year: -500, w: 1 }],
        },
      ],
      [{ year: -500 }, { year: -500 }],
    );
    expect(slices).toEqual([
      { start: -500, end: -400, span: 100, activeIds: ['real'] },
    ]);
    expect(slices.some((slice) => slice.span <= 0)).toBe(false);
  });
});

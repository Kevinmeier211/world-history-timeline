import { describe, expect, it } from 'vitest';

import { crossfade, importanceThreshold, selectLod, type LodPolity } from './lod.ts';

const dynasties: LodPolity[] = [
  { id: 'han', group: 'imperial_china', importance: 3, start: -206, end: 220 },
  { id: 'tang', group: 'imperial_china', importance: 3, start: 618, end: 907 },
  { id: 'qin', importance: 5, start: -221, end: -206 },
];

describe('level of detail', () => {
  it('raises the importance floor as the zoom falls', () => {
    expect(importanceThreshold(1.6)).toBe(1);
    expect(importanceThreshold(1)).toBe(2);
    expect(importanceThreshold(0.8)).toBe(2);
    expect(importanceThreshold(0.45)).toBe(3);
    expect(importanceThreshold(0.25)).toBe(4);
    expect(importanceThreshold(0.2)).toBe(5);
    expect(importanceThreshold(0)).toBe(5);
    expect(importanceThreshold(Number.NaN)).toBe(5);
  });

  it('crossfades across the collapse zoom', () => {
    expect(crossfade(0.4)).toMatchObject({
      expand: 0,
      collapsedOpacity: 1,
      expandedOpacity: 0,
    });
    expect(crossfade(0.85).expand).toBeCloseTo(0.5);
    expect(crossfade(0.85).collapsedOpacity).toBeCloseTo(0.5);
    expect(crossfade(2)).toMatchObject({
      expand: 1,
      collapsedOpacity: 0,
      expandedOpacity: 1,
    });
  });

  it('collapses a group at overview and keeps a high-importance neighbor', () => {
    const overview = selectLod(dynasties, 0.4);
    expect(overview.map((item) => item.id)).toEqual(['group:imperial_china', 'qin']);
    const group = overview[0];
    expect(group).toMatchObject({
      collapsed: true,
      start: -206,
      end: 907,
      importance: 3,
      opacity: 1,
      memberIds: ['han', 'tang'],
    });
    expect(overview.find((item) => item.id === 'han')).toBeUndefined();
  });

  it('expands the group when zoomed in and fades both at the boundary', () => {
    const close = selectLod(dynasties, 2);
    expect(close.map((item) => item.id)).toEqual(['han', 'qin', 'tang']);
    expect(close.every((item) => !item.collapsed && item.opacity === 1)).toBe(true);

    const mid = selectLod(dynasties, 0.85);
    const faded = mid.find((item) => item.id === 'group:imperial_china');
    const han = mid.find((item) => item.id === 'han');
    expect(faded?.opacity).toBeCloseTo(0.5);
    expect(han?.opacity).toBeCloseTo(0.5);
    expect(mid.find((item) => item.id === 'qin')?.opacity).toBe(1);
  });

  it('hides an ungrouped polity below the threshold', () => {
    const hidden = selectLod(
      [{ id: 'village', importance: 2, start: 1, end: 50 }],
      0.4,
    );
    expect(hidden).toEqual([]);
  });
});

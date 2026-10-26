import { describe, expect, it } from 'vitest';

import { familyColumns } from '../layout/columns.ts';
import { paintFrame } from './foldPaint.ts';
import { posterFor } from './posterModel.ts';

describe('folded poster', () => {
  it('drops a folded family, keeps a pinned one, and moves a neighbor', () => {
    const full = posterFor([], []);
    const folded = posterFor(['chinese'], []);
    expect(full.ribbons.some((ribbon) => ribbon.familyId === 'chinese')).toBe(true);
    expect(folded.ribbons.some((ribbon) => ribbon.familyId === 'chinese')).toBe(false);
    expect(folded.ribbons.map((ribbon) => ribbon.id)).not.toEqual(
      full.ribbons.map((ribbon) => ribbon.id),
    );
    const pinned = posterFor(['east_asia'], ['chinese']);
    expect(pinned.ribbons.length).toBeGreaterThan(0);
    expect(pinned.ribbons.every((ribbon) => ribbon.familyId === 'chinese')).toBe(true);
    const americas = posterFor([], ['americas']);
    expect(
      americas.ribbons.every((ribbon) =>
        ['andean', 'mesoamerican', 'north_american'].includes(ribbon.familyId),
      ),
    ).toBe(true);
    expect(americas.ribbons.length).toBeGreaterThan(0);
    const moved = full.ribbons.some((ribbon) => {
      const next = folded.ribbons.find((item) => item.id === ribbon.id);
      const before = ribbon.d;
      return next !== undefined && next.d !== before;
    });
    expect(moved).toBe(true);
    const none = posterFor(
      familyColumns().map((column) => column.id),
      [],
    );
    expect(none.ribbons).toHaveLength(0);
  });

  it('fades a departing ribbon and restores labels only at the end', () => {
    const full = posterFor([], []);
    const folded = posterFor(['chinese'], []);
    expect(paintFrame(full, folded, 0)).toBe(full);
    expect(paintFrame(full, folded, 1)).toBe(folded);
    const mid = paintFrame(full, folded, 0.5);
    expect(mid.labels).toHaveLength(0);
    expect(mid.connectors).toHaveLength(0);
    expect(mid.bands).toBe(folded.bands);
    const fading = mid.ribbons.filter((ribbon) => ribbon.familyId === 'chinese');
    expect(fading.length).toBeGreaterThan(0);
    expect(fading.every((ribbon) => ribbon.opacity === 0.5)).toBe(true);
    expect(fading.every((ribbon) => ribbon.dashPath === '')).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';

import {
  CALLOUT_H,
  CALLOUT_W,
  THUMB,
  calloutScore,
  placeCallouts,
  type CalloutAnchor,
  type PlacedCallout,
} from './calloutPlacer.ts';

function gap(a: PlacedCallout, b: PlacedCallout): number {
  const sepX = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width));
  const sepY = Math.max(b.y - (a.y + a.height), a.y - (b.y + b.height));
  if (sepX < 0 && sepY < 0) return Math.max(sepX, sepY);
  if (sepX < 0) return sepY;
  if (sepY < 0) return sepX;
  return Math.hypot(sepX, sepY);
}

describe('callout placer', () => {
  it('scores with the Appendix G weights', () => {
    expect(
      calloutScore({
        importance: 5,
        dy: 24,
        dist: 10,
        collisions: 0,
        labelOverlaps: 0,
        leaderCrosses: 0,
      }),
    ).toBeCloseTo(50 - 4.8 - 0.5);
    expect(
      calloutScore({
        importance: 1,
        dy: 0,
        dist: 0,
        collisions: 1,
        labelOverlaps: 1,
        leaderCrosses: 1,
      }),
    ).toBeCloseTo(10 - 1000 - 500 - 100);
  });

  it('packs a cluster with no collisions and prefers the right side', () => {
    const anchors: CalloutAnchor[] = Array.from({ length: 6 }, (_, index) => ({
      id: `c${index}`,
      importance: 3,
      x: 400,
      y: 800,
    }));
    const placed = placeCallouts(anchors);
    expect(placed.every((card) => card.placed && !card.marker)).toBe(true);
    expect(placed[0]?.x).toBeGreaterThan(400);
    expect(placed[0]?.y).toBeCloseTo(800 - CALLOUT_H / 2);
    for (let left = 0; left < placed.length; left += 1) {
      for (let right = left + 1; right < placed.length; right += 1) {
        const a = placed[left];
        const b = placed[right];
        if (!a || !b) continue;
        expect(gap(a, b)).toBeGreaterThanOrEqual(4 - 1e-6);
      }
    }
  });

  it('is deterministic when the input order changes', () => {
    const anchors: CalloutAnchor[] = [
      { id: 'b', importance: 2, x: 400, y: 800 },
      { id: 'a', importance: 5, x: 400, y: 800 },
      { id: 'c', importance: 3, x: 400, y: 800 },
    ];
    expect(placeCallouts(anchors)).toEqual(placeCallouts([...anchors].reverse()));
    expect(placeCallouts(anchors).map((card) => card.calloutId)).toEqual([
      'a',
      'c',
      'b',
    ]);
  });

  it('steps aside from a ribbon label and from a crossing leader', () => {
    const blocked = placeCallouts(
      [{ id: 'note', importance: 3, x: 400, y: 800 }],
      [
        {
          id: 'label',
          x: 404,
          y: 800 - CALLOUT_H / 2,
          width: CALLOUT_W,
          height: CALLOUT_H,
        },
      ],
    );
    expect(blocked[0]?.x).toBeLessThan(400);
    expect(blocked[0]?.placed).toBe(true);

    const crossed = placeCallouts(
      [{ id: 'note', importance: 3, x: 300, y: 400 }],
      [],
      [{ x1: 350, y1: 0, x2: 350, y2: 2000 }],
    );
    expect(crossed[0]?.x).toBeLessThan(300);
  });

  it('drops a crowded low-importance card and marks an important one', () => {
    const seven = (importance: number, id: string): CalloutAnchor[] => [
      ...Array.from({ length: 6 }, (_, index) => ({
        id: `c${index}`,
        importance,
        x: 400,
        y: 800,
      })),
      { id, importance, x: 400, y: 800 },
    ];
    const dropped = placeCallouts(seven(2, 'extra'));
    expect(dropped.filter((card) => card.placed)).toHaveLength(6);
    expect(dropped.find((card) => card.calloutId === 'extra')).toMatchObject({
      placed: false,
      marker: false,
    });

    const marked = placeCallouts(seven(4, 'hero'));
    expect(marked.filter((card) => card.placed)).toHaveLength(6);
    expect(marked.find((card) => card.calloutId === 'hero')).toMatchObject({
      placed: false,
      marker: true,
    });
  });

  it('reserves a thumbnail on the outer side of the card', () => {
    const placed = placeCallouts([
      { id: 'seal', importance: 5, x: 400, y: 800, mediaId: 'seal' },
    ]);
    const card = placed[0];
    expect(card?.plate).toMatchObject({
      mediaId: 'seal',
      width: THUMB,
      height: THUMB,
    });
    expect(card?.plate?.x).toBeCloseTo((card?.x ?? 0) + CALLOUT_W);
  });
});

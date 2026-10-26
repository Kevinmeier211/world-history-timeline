import { describe, expect, it } from 'vitest';

import { indexOverrides, nudgeCallout } from './overrides.ts';

describe('layout overrides', () => {
  it('indexes a pin, a label force, and a callout nudge', () => {
    const indexed = indexOverrides({
      ribbons: [
        {
          polityId: 'rome',
          x: [
            { year: -509, x: 0.2 },
            { year: 476, x: 0.4 },
          ],
          label: 'outside',
          reason: 'pin the column',
        },
        { polityId: 'han', label: 'along', reason: 'follow the ribbon' },
      ],
      callouts: [{ calloutId: 'note', dx: 12, dy: -8, reason: 'clear the label' }],
    });
    expect(indexed.pins.get('rome')).toEqual([
      { year: -509, x: 0.2 },
      { year: 476, x: 0.4 },
    ]);
    expect(indexed.pins.has('han')).toBe(false);
    expect(indexed.labels.get('han')).toBe('along');
    expect(indexed.nudges.get('note')).toEqual({ dx: 12, dy: -8 });
  });

  it('nudges a placed card and its plate, and leaves a drop', () => {
    const nudged = nudgeCallout(
      {
        calloutId: 'note',
        x: 10,
        y: 20,
        width: 132,
        height: 48,
        placed: true,
        marker: false,
        leader: { x1: 4, y1: 30, x2: 10, y2: 44 },
        plate: { mediaId: 'seal', x: 142, y: 16, width: 56, height: 56 },
      },
      { dx: 5, dy: -3 },
    );
    expect(nudged.x).toBe(15);
    expect(nudged.y).toBe(17);
    expect(nudged.leader).toEqual({ x1: 4, y1: 30, x2: 15, y2: 41 });
    expect(nudged.plate).toMatchObject({ x: 147, y: 13 });
    const dropped = nudgeCallout(
      {
        calloutId: 'gone',
        x: 1,
        y: 2,
        width: 0,
        height: 0,
        placed: false,
        marker: false,
      },
      { dx: 9, dy: 9 },
    );
    expect(dropped.x).toBe(1);
    expect(dropped.y).toBe(2);
  });
});

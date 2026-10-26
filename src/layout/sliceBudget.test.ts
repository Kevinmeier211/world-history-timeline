import { describe, expect, it } from 'vitest';

import { LEFT_GUTTER, MIN_GAP, PLOT_WIDTH } from './constants.ts';
import {
  fanLayout,
  seatFanout,
  type FanSpec,
  type SeatExtra,
  type SeatLane,
} from './sliceBudget.ts';

function lane(id: string, x: number, width: number, minWidth: number): SeatLane {
  return { id, x, width, minWidth };
}

function extra(id: string, desiredX: number, width = 16.2, importance = 2): SeatExtra {
  return { id, desiredX, width, importance };
}

function gapsOk(rows: readonly { x: number; width: number }[]): boolean {
  const ordered = [...rows].sort((left, right) => left.x - right.x);
  for (const row of ordered) {
    if (row.x - row.width / 2 < LEFT_GUTTER - 0.05) return false;
    if (row.x + row.width / 2 > LEFT_GUTTER + PLOT_WIDTH + 0.05) return false;
  }
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const left = ordered[index];
    const right = ordered[index + 1];
    if (!left || !right) continue;
    const gap = right.x - right.width / 2 - (left.x + left.width / 2);
    if (gap < MIN_GAP - 0.05) return false;
  }
  return true;
}

describe('modern fan-out seating', () => {
  it('returns the same centers when nothing is waiting', () => {
    const rows = [lane('a', 200, 40, 16), lane('b', 280, 40, 16)];
    expect(seatFanout(rows, [])).toEqual([
      { id: 'a', x: 200, width: 40 },
      { id: 'b', x: 280, width: 40 },
    ]);
  });

  it('puts a new ribbon in the gap and leaves the old centers', () => {
    const rows = [lane('left', 200, 80, 16), lane('right', 360, 80, 16)];
    const seated = seatFanout(rows, [extra('india', 280)]);
    const india = seated.find((row) => row.id === 'india');
    expect(india).toBeDefined();
    expect(seated.find((row) => row.id === 'left')).toMatchObject({ x: 200 });
    expect(seated.find((row) => row.id === 'right')).toMatchObject({ x: 360 });
    expect(gapsOk(seated)).toBe(true);
    expect(india && Math.abs(india.x - 280)).toBeLessThan(40);
  });

  it('spends spare width when the row already fills the plot', () => {
    const width = 663;
    const rows = [
      lane('left', LEFT_GUTTER + width / 2, width, 640),
      lane('right', LEFT_GUTTER + PLOT_WIDTH - width / 2, width, 640),
    ];
    const seated = seatFanout(rows, [extra('india', 750, 16)]);
    expect(seated.map((row) => row.id)).toContain('india');
    expect(seated.find((row) => row.id === 'left')?.x).toBe(rows[0]?.x);
    expect(seated.find((row) => row.id === 'right')?.x).toBe(rows[1]?.x);
    expect(seated.find((row) => row.id === 'left')?.width).toBeLessThan(width);
    expect(gapsOk(seated)).toBe(true);
  });

  it('does not shrink a lane that has no spare width', () => {
    const rows = [lane('wide', 400, 90, 90), lane('thin', 520, 40, 16)];
    const seated = seatFanout(rows, [extra('india', 470, 16)]);
    expect(seated.find((row) => row.id === 'wide')?.width).toBe(90);
  });

  it('seats the higher-importance extra when only one gap opens', () => {
    const width = 663;
    const rows = [
      lane('left', LEFT_GUTTER + width / 2, width, 640),
      lane('right', LEFT_GUTTER + PLOT_WIDTH - width / 2, width, 640),
    ];
    const seated = seatFanout(rows, [
      extra('late', 750, 16, 2),
      extra('early', 750, 16, 3),
    ]);
    const ids = seated.map((row) => row.id);
    expect(ids).toContain('early');
    expect(ids).not.toContain('late');
    expect(gapsOk(seated)).toBe(true);
  });

  it('spends at most half an importance-3 lane to seat another state', () => {
    const width = 663;
    const leftX = LEFT_GUTTER + width / 2;
    const rightX = LEFT_GUTTER + PLOT_WIDTH - width / 2;
    const spec: FanSpec = {
      waiting: [extra('denmark', 750, 16, 2)],
      floor: new Map([
        ['left', 16],
        ['right', 16],
      ]),
      importance: new Map([
        ['left', 3],
        ['right', 3],
      ]),
    };
    const rows = fanLayout([
      {
        lanes: [
          { id: 'left', x: leftX, width },
          { id: 'right', x: rightX, width },
        ],
        spec,
      },
    ]);
    const seated = rows[0] ?? [];
    expect(seated.map((row) => row.id)).toContain('denmark');
    expect(seated.find((row) => row.id === 'left')).toMatchObject({ x: leftX });
    expect(seated.find((row) => row.id === 'right')?.x).toBe(rightX);
    expect(seated.find((row) => row.id === 'left')?.width).toBeGreaterThanOrEqual(
      width / 2,
    );
    expect(seated.find((row) => row.id === 'left')?.width).toBeLessThan(width);
    expect(gapsOk(seated)).toBe(true);
  });

  it('shrinks a packed slice even when a busier slice needs no shrink', () => {
    const width = 663;
    const leftX = LEFT_GUTTER + width / 2;
    const rightX = LEFT_GUTTER + PLOT_WIDTH - width / 2;
    const crowd = Array.from({ length: 6 }, (_, index) =>
      extra(`extra-${index}`, 300, 16, 2),
    );
    const open: FanSpec = {
      waiting: crowd,
      floor: new Map([
        ['a', 16],
        ['b', 16],
      ]),
      importance: new Map([
        ['a', 2],
        ['b', 2],
      ]),
    };
    const packed: FanSpec = {
      waiting: [extra('pakistan', 750, 16, 12)],
      floor: new Map([
        ['left', 640],
        ['right', 640],
      ]),
      importance: new Map([
        ['left', 2],
        ['right', 2],
      ]),
    };
    const rows = fanLayout([
      {
        lanes: [
          { id: 'a', x: 240, width: 40 },
          { id: 'b', x: 900, width: 40 },
        ],
        spec: open,
      },
      {
        lanes: [
          { id: 'left', x: leftX, width },
          { id: 'right', x: rightX, width },
        ],
        spec: packed,
      },
    ]);
    expect(rows[1]?.map((row) => row.id)).toContain('pakistan');
    expect(rows[1]?.find((row) => row.id === 'left')?.x).toBe(leftX);
    expect(rows[1]?.find((row) => row.id === 'right')?.x).toBe(rightX);
    expect(rows[0]?.map((row) => row.id)).toEqual(
      expect.arrayContaining(['a', 'b', 'extra-0']),
    );
  });
});

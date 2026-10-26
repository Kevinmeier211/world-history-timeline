import { describe, expect, it } from 'vitest';

import type { TextMeasurer } from './labelFit.ts';
import {
  glyphInk,
  labelHitPairs,
  labelObstacleBoxes,
  parkRotatedLabels,
  seatGlyphs,
  type TrackPoint,
} from './labelTrack.ts';

function fakeMeasure(): TextMeasurer {
  return {
    measure(text, fontSize) {
      return text.length * fontSize * 0.5;
    },
  };
}

function straight(x: number, height = 400): TrackPoint[] {
  return [
    { y: 0, x, width: 40 },
    { y: height, x, width: 40 },
  ];
}

describe('seatGlyphs', () => {
  const measure = fakeMeasure();

  it('centers a rotated name on the ribbon', () => {
    const glyphs = seatGlyphs(straight(100), 40, 20, 'Rome', 10, measure);
    expect(glyphs?.map((glyph) => glyph.char).join('')).toBe('Rome');
    for (const glyph of glyphs ?? []) {
      expect(glyph.x).toBeCloseTo(100);
      expect(glyph.y).toBeGreaterThanOrEqual(40);
      expect(glyph.y).toBeLessThanOrEqual(60);
    }
  });

  it('pins every letter to one column on the centerline', () => {
    const glyphs = seatGlyphs(
      [
        { y: 0, x: 100, width: 40 },
        { y: 200, x: 220, width: 40 },
      ],
      150,
      10,
      'Ab',
      10,
      measure,
    );
    const xs = glyphs?.map((glyph) => glyph.x) ?? [];
    expect(new Set(xs).size).toBe(1);
    expect(xs[0]).toBeCloseTo(193);
  });

  it('keeps a combining mark on its base character', () => {
    const glyphs = seatGlyphs(straight(100), 0, 10, 'N\u0303', 10, measure);
    expect(glyphs).toHaveLength(1);
    expect(glyphs?.[0]?.char).toBe('N\u0303');
  });

  it('returns undefined when the name crosses a cull break', () => {
    expect(
      seatGlyphs(
        [
          { y: 0, x: 100, width: 40 },
          { y: 30, x: 100, width: 40 },
          { y: 80, x: 140, width: 40, breakBefore: true },
          { y: 200, x: 140, width: 40 },
        ],
        0,
        100,
        'Rome',
        10,
        measure,
      ),
    ).toBeUndefined();
  });

  it('returns undefined for an empty name or a zero font', () => {
    expect(seatGlyphs(straight(100), 0, 20, '', 10, measure)).toBeUndefined();
    expect(seatGlyphs(straight(100), 0, 20, 'Rome', 0, measure)).toBeUndefined();
    expect(seatGlyphs([], 0, 20, 'Rome', 10, measure)).toBeUndefined();
  });
});

describe('parkRotatedLabels', () => {
  const measure = fakeMeasure();

  it('slides a crossing name along its ribbon and keeps the full text', () => {
    const tracks = new Map<string, TrackPoint[]>([
      [
        'east',
        [
          { y: 0, x: 200, width: 40 },
          { y: 200, x: 80, width: 40 },
        ],
      ],
      [
        'west',
        [
          { y: 0, x: 80, width: 40 },
          { y: 200, x: 200, width: 40 },
        ],
      ],
    ]);
    const labels = [
      {
        polityId: 'west',
        text: 'West',
        x: 75,
        y: 90,
        width: 10,
        height: 20,
        fontSize: 10,
        orientation: 'rotated' as const,
        fitted: true,
      },
      {
        polityId: 'east',
        text: 'East',
        x: 195,
        y: 90,
        width: 10,
        height: 20,
        fontSize: 10,
        orientation: 'rotated' as const,
        fitted: true,
      },
    ];
    const seated = labels.map((label) => ({
      ...label,
      glyphs: seatGlyphs(
        tracks.get(label.polityId) ?? [],
        label.y,
        label.height,
        label.text,
        label.fontSize,
        measure,
      ),
    }));
    expect(labelHitPairs(seated).length).toBeGreaterThan(0);
    const parked = parkRotatedLabels(labels, tracks);
    expect(parked.map((label) => label.text)).toEqual(['West', 'East']);
    expect(labelHitPairs(parked)).toEqual([]);
    expect(parked.some((label, index) => label.y !== labels[index]?.y)).toBe(true);
    expect(parked.every((label) => label.glyphs === undefined)).toBe(true);
  });

  it('pins a drifting name to the centerline and keeps one straight column', () => {
    const parked = parkRotatedLabels(
      [
        {
          polityId: 'drift',
          text: 'Name',
          x: 95,
          y: 40,
          width: 10,
          height: 20,
          fontSize: 10,
          orientation: 'rotated' as const,
          fitted: true,
        },
      ],
      new Map([
        [
          'drift',
          [
            { y: 0, x: 100, width: 40 },
            { y: 200, x: 180, width: 40 },
          ],
        ],
      ]),
    );
    expect(parked[0]?.text).toBe('Name');
    expect(parked[0]?.glyphs).toBeUndefined();
    expect(parked[0]?.y).toBe(40);
    expect(parked[0]?.x).toBeCloseTo(115);
  });

  it('moves a rotated name off an outside label without shortening either', () => {
    const tracks = new Map<string, TrackPoint[]>([['long', straight(100, 300)]]);
    const labels = [
      {
        polityId: 'long',
        text: 'Longname',
        x: 95,
        y: 40,
        width: 10,
        height: 40,
        fontSize: 10,
        orientation: 'rotated' as const,
        fitted: true,
      },
      {
        polityId: 'short',
        text: 'Short label',
        x: 90,
        y: 50,
        width: 40,
        height: 10,
        fontSize: 10,
        orientation: 'outside' as const,
        fitted: true,
      },
    ];
    const parked = parkRotatedLabels(labels, tracks);
    expect(parked.map((label) => label.text)).toEqual(['Longname', 'Short label']);
    expect(parked[1]?.glyphs).toBeUndefined();
    expect(labelHitPairs(parked)).toEqual([]);
    expect(parked[0]?.y).not.toBe(40);
  });

  it('slides a horizontal name along its ribbon without changing the text', () => {
    const tracks = new Map<string, TrackPoint[]>([
      ['tall', straight(100, 200)],
      ['wide', straight(100, 80)],
    ]);
    const labels = [
      {
        polityId: 'wide',
        text: 'Aztec Empire',
        x: 80,
        y: 30,
        width: 40,
        height: 10,
        fontSize: 10,
        orientation: 'horizontal' as const,
        fitted: true,
      },
      {
        polityId: 'tall',
        text: 'Haudenosaunee',
        x: 95,
        y: 20,
        width: 10,
        height: 40,
        fontSize: 10,
        orientation: 'rotated' as const,
        fitted: true,
      },
    ];
    const parked = parkRotatedLabels(labels, tracks);
    expect(parked.map((label) => label.text)).toEqual([
      'Aztec Empire',
      'Haudenosaunee',
    ]);
    expect(labelHitPairs(parked)).toEqual([]);
  });

  it('leaves parallel ribbons clear and does not move a name that already fits', () => {
    const tracks = new Map<string, TrackPoint[]>([
      ['left', straight(100)],
      ['right', straight(146)],
    ]);
    const labels = ['left', 'right'].map((id) => ({
      polityId: id,
      text: 'Name',
      x: (id === 'left' ? 100 : 146) - 5,
      y: 100,
      width: 10,
      height: 20,
      fontSize: 10,
      orientation: 'rotated' as const,
      fitted: true,
    }));
    const parked = parkRotatedLabels(labels, tracks);
    expect(labelHitPairs(parked)).toEqual([]);
    expect(parked.map((label) => label.y)).toEqual([100, 100]);
  });

  it('keeps the column when no run can hold the name', () => {
    const parked = parkRotatedLabels(
      [
        {
          polityId: 'short',
          text: 'Longname',
          x: 5,
          y: 0,
          width: 10,
          height: 40,
          fontSize: 10,
          orientation: 'rotated' as const,
          fitted: true,
        },
      ],
      new Map([['short', straight(10, 10)]]),
    );
    expect(parked[0]?.glyphs).toBeUndefined();
    expect(parked[0]?.text).toBe('Longname');
    expect(parked[0]?.y).toBe(0);
  });

  it('does not seat a hover-only label', () => {
    const parked = parkRotatedLabels(
      [
        {
          polityId: 'hidden',
          text: 'Hidden',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          fontSize: 10,
          orientation: 'rotated' as const,
          fitted: false,
        },
      ],
      new Map([['hidden', straight(10)]]),
    );
    expect(parked[0]?.glyphs).toBeUndefined();
    expect(parked[0]?.fitted).toBe(false);
  });
});

describe('label obstacles', () => {
  it('uses one box per glyph and ignores a zero advance', () => {
    const boxes = labelObstacleBoxes([
      {
        polityId: 'rome',
        text: 'Ro',
        x: 90,
        y: 0,
        width: 10,
        height: 10,
        fontSize: 10,
        orientation: 'rotated',
        fitted: true,
        glyphs: [
          { char: 'R', x: 100, y: 5, advance: 10 },
          { char: 'o', x: 100, y: 15, advance: 0 },
        ],
      },
    ]);
    expect(boxes).toEqual([{ id: 'rome#0', x: 95, y: 0, width: 10, height: 10 }]);
    expect(glyphInk([{ char: 'R', x: 100, y: 5, advance: 10 }], 0)).toEqual([]);
  });
});

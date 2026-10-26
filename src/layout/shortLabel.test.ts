import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { LEFT_GUTTER, MIN_GAP, PLOT_WIDTH } from './constants.ts';
import { type TextMeasurer } from './labelFit.ts';
import { placeRibbonLabel, placeRibbonLabels, type ShortRibbon } from './shortLabel.ts';

function fakeMeasure(): TextMeasurer {
  return {
    measure(text, fontSize) {
      return text.length * fontSize * 0.5;
    },
  };
}

function load(): { name: string; ribbons: ShortRibbon[] } {
  return JSON.parse(
    readFileSync('src/layout/__fixtures__/short-labels.json', 'utf8'),
  ) as { name: string; ribbons: ShortRibbon[] };
}

describe('short ribbon labels', () => {
  const measure = fakeMeasure();

  it('fixture H puts an ellipsized diacritic label outside a short ribbon', () => {
    const fixture = load();
    const ribbon = fixture.ribbons[0];
    expect(fixture.name).toBe('H');
    expect(ribbon).toBeDefined();
    if (!ribbon) return;
    const placed = placeRibbonLabel(ribbon, measure);
    expect(placed.orientation).toBe('outside');
    expect(placed.fitted).toBe(true);
    expect(placed.text).toBe('Nāṣer the…');
    expect(placed.text).toContain('ā');
    expect(placed.fontSize).toBe(10);
    expect(placed.leader).toBeDefined();
    expect(placed.leader?.x1).toBeCloseTo(ribbon.x + ribbon.width / 2);
    expect(placed.leader?.y1).toBeCloseTo(ribbon.y + ribbon.height / 2);
    expect(placed.x).toBeCloseTo((placed.leader?.x1 ?? 0) + MIN_GAP);
    expect(placed.y).toBeCloseTo((placed.leader?.y1 ?? 0) - placed.height / 2);
  });

  it('keeps a tall ribbon label inside and rotated', () => {
    const ribbon = load().ribbons[1];
    expect(ribbon).toBeDefined();
    if (!ribbon) return;
    const placed = placeRibbonLabel(ribbon, measure);
    expect(placed.orientation).toBe('rotated');
    expect(placed.text).toBe('Roman Empire');
    expect(placed.fitted).toBe(true);
    expect(placed.leader).toBeUndefined();
    expect(placed.x).toBeGreaterThanOrEqual(ribbon.x - ribbon.width / 2 - 1e-6);
    expect(placed.x + placed.width).toBeLessThanOrEqual(
      ribbon.x + ribbon.width / 2 + 1e-6,
    );
  });

  it('moves the outside label left when the right edge has no room', () => {
    const placed = placeRibbonLabel(
      {
        id: 'qin',
        name: 'Qin',
        x: 1400,
        y: 100,
        width: 20,
        height: 20,
      },
      measure,
      LEFT_GUTTER + PLOT_WIDTH,
    );
    expect(placed.orientation).toBe('outside');
    expect(placed.x + placed.width).toBeLessThanOrEqual(1400 - 10 - MIN_GAP + 1e-6);
    expect(placed.leader?.x2).toBeCloseTo(placed.x + placed.width);
  });

  it('keeps a name that cannot be drawn as a hover-only label', () => {
    const placed = placeRibbonLabel(
      {
        id: 'long',
        name: 'Antidisestablishmentarianism',
        x: 400,
        y: 100,
        width: 20,
        height: 20,
      },
      measure,
    );
    expect(placed.fitted).toBe(false);
    expect(placed.orientation).toBe('outside');
    expect(placed.text).toBe('Antidisestablishmentarianism');
    expect(placed.leader).toBeUndefined();
  });

  it('paints the full western name when the ribbon is too narrow to hold it', () => {
    const placed = placeRibbonLabel(
      {
        id: 'western_roman_empire',
        name: 'Western Roman Empire',
        x: 418,
        y: 2410,
        width: 56,
        height: 50,
      },
      measure,
    );
    expect(placed.fitted).toBe(true);
    expect(placed.text).toBe('Western Roman Empire');
    expect(placed.orientation).toBe('outside');
    expect(placed.leader).toBeDefined();
  });

  it('anchors a broken ribbon on the longer piece', () => {
    const placed = placeRibbonLabels(
      [{ id: 'ghana_republic', name: 'Ghana' }],
      new Map([
        [
          'ghana_republic',
          [
            { x: 131, y: 3374, width: 12 },
            { x: 131, y: 3376, width: 12 },
            { x: 129, y: 3399, width: 12, breakBefore: true },
            { x: 130, y: 3405, width: 12 },
          ],
        ],
      ]),
      measure,
    );
    const label = placed[0];
    expect(label?.text).toBe('Ghana');
    expect(label?.fitted).toBe(true);
    expect(label?.orientation).toBe('outside');
    expect(label && label.y + label.height / 2).toBeCloseTo(3402);
  });

  it('keeps one run centered on the whole ribbon', () => {
    const placed = placeRibbonLabels(
      [{ id: 'western_roman_empire', name: 'Western Roman Empire' }],
      new Map([
        [
          'western_roman_empire',
          [
            { x: 418, y: 2410, width: 56 },
            { x: 418, y: 2460, width: 56 },
          ],
        ],
      ]),
      measure,
    );
    const label = placed[0];
    expect(label?.text).toBe('Western Roman Empire');
    expect(label && label.y + label.height / 2).toBeCloseTo(2435);
  });

  it('forces a tall ribbon outside or along when an override says so', () => {
    const ribbon: ShortRibbon = {
      id: 'rome',
      name: 'Rome',
      x: 200,
      y: 100,
      width: 40,
      height: 200,
    };
    const outside = placeRibbonLabel(ribbon, measure, undefined, 'outside');
    expect(outside.orientation).toBe('outside');
    expect(outside.leader).toBeDefined();
    const along = placeRibbonLabel(ribbon, measure, undefined, 'along');
    expect(along.orientation).toBe('rotated');
    expect(along.leader).toBeUndefined();
  });
});

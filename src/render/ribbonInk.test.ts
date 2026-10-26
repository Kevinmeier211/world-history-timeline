import { describe, expect, it } from 'vitest';

import { bundledDataset, bundledGeography } from '../data/catalog.ts';
import type { Polity } from '../data/schema/index.ts';
import { clearLayoutCache, layout } from '../layout/index.ts';
import type { LayoutInput } from '../layout/types.ts';
import {
  LABEL_INK,
  LABEL_PAPER,
  capRadius,
  darkenHex,
  labelFill,
  posterPaint,
  ribbonAria,
} from './ribbonInk.ts';

function polity(extra: Partial<Polity> = {}): Polity {
  return {
    id: 'rome',
    name: 'Roman Empire',
    family: 'latin_west',
    start: -27,
    end: 476,
    confidence: 'secure',
    importance: 4,
    weight: 0.6,
    kind: 'empire',
    anchor: [{ year: -27, geo: [12, 42] }],
    summary: 'A synthetic empire used to paint one ribbon.',
    keyFacts: ['Synthetic.'],
    sourceIds: ['note'],
    verification: 'unverified',
    startUncertainty: 40,
    ...extra,
  };
}

function input(rows: Polity[]): LayoutInput {
  return {
    polities: rows,
    relations: [],
    callouts: [],
    bands: [],
    geography: bundledGeography(),
    overrides: { ribbons: [], callouts: [] },
    viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
    visibleFamilies: [],
    visibleMacroRegions: [],
  };
}

describe('ribbon ink', () => {
  it('darkens the edge, caps the radius, and names the polity', () => {
    expect(darkenHex('#ffffff')).toBe('#d1d1d1');
    expect(darkenHex('#000000')).toBe('#000000');
    expect(darkenHex('nope')).toBe('nope');
    expect(capRadius(40)).toBe(10);
    expect(capRadius(8)).toBe(4);
    expect(ribbonAria('Roman Empire', -27, 476, 'secure', 'Latin West')).toBe(
      'Roman Empire, 27 BCE – 476 CE, Latin West',
    );
    expect(ribbonAria('Uruk', -3300, -3000, 'approximate', 'Mesopotamian')).toBe(
      'Uruk, c. 3300–3000 BCE, Mesopotamian',
    );
  });

  it('picks the label color that contrasts with the ribbon', () => {
    expect(labelFill('#000000', LABEL_INK, LABEL_PAPER)).toBe(LABEL_PAPER);
    expect(labelFill('#ffffff', LABEL_INK, LABEL_PAPER)).toBe(LABEL_INK);
    expect(labelFill('nope', LABEL_INK, LABEL_PAPER)).toBe(LABEL_INK);
  });

  it('paints a faded start and a contrasting label from the layout', () => {
    clearLayoutCache();
    const row = polity();
    const dataset = { ...bundledDataset(), polities: [row] };
    const paint = posterPaint(dataset, layout(input([row])));
    expect(paint.ribbons).toHaveLength(1);
    const ribbon = paint.ribbons[0];
    expect(ribbon?.id).toBe('rome');
    expect(ribbon?.d.startsWith('M')).toBe(true);
    expect(ribbon?.edge).not.toBe(ribbon?.fill);
    expect(ribbon?.fadePx).toBeGreaterThan(0);
    expect(ribbon?.dashPath.length).toBeGreaterThan(0);
    expect(ribbon?.ariaLabel).toContain('Roman Empire');
    expect(ribbon && ribbon.y1).toBeGreaterThan(ribbon?.y0 ?? 0);
    expect(paint.labels[0]?.text.length).toBeGreaterThan(0);
    expect(paint.labels[0]?.fill).toBe(LABEL_PAPER);
    expect(paint.labels.every((label) => label.fitted)).toBe(true);
  });
});

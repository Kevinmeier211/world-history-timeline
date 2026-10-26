import { describe, expect, it } from 'vitest';

import { bundledDataset, bundledGeography } from '../data/catalog.ts';
import type { Band } from '../data/schema/index.ts';
import type { MacroRegion } from '../data/schema/primitives.ts';
import { LEFT_GUTTER, PLOT_WIDTH } from '../layout/constants.ts';
import { bandBox, bandHatch, bandPaints, fitBandTitle } from './bandInk.ts';

function band(extra: Partial<Band> = {}): Band {
  return {
    id: 'band_axial_age',
    title: 'THE AXIAL AGE',
    start: -650,
    end: -250,
    scope: ['europe', 'africa'],
    type: 'golden_age',
    importance: 3,
    description: 'A synthetic band for the painter.',
    sourceIds: ['note'],
    verification: 'unverified',
    ...extra,
  };
}

describe('band ink', () => {
  it('spans the plot for a global band and the zones for a region', () => {
    const geography = bundledGeography();
    expect(bandBox('global', geography)).toEqual({ x: LEFT_GUTTER, width: PLOT_WIDTH });
    const europe = bandBox(['europe'], geography);
    expect(europe.x).toBeGreaterThan(LEFT_GUTTER);
    expect(europe.x + europe.width).toBeLessThan(LEFT_GUTTER + PLOT_WIDTH);
    expect(bandBox(['missing' as MacroRegion], geography).width).toBe(PLOT_WIDTH);
  });

  it('hatches climate, pandemic, collapse, and war, and fits the margin title', () => {
    expect(bandHatch('climate')).toBe('horizontal');
    expect(bandHatch('pandemic')).toBe('dots');
    expect(bandHatch('collapse')).toBe('collapse');
    expect(bandHatch('war')).toBe('war');
    expect(bandHatch('epoch')).toBe('none');
    expect(bandHatch('golden_age')).toBe('none');
    expect(fitBandTitle('THE AXIAL AGE', 80).rotated).toBe(true);
    expect(fitBandTitle('THE AXIAL AGE', 80).text).toBe('THE AXIAL AGE');
    const short = fitBandTitle('LATE BRONZE AGE COLLAPSE', 30);
    expect(short.rotated).toBe(false);
    expect(short.text?.endsWith('…')).toBe(true);
    expect(fitBandTitle('AGE', 8)).toEqual({ text: 'AGE', rotated: false });
    expect(fitBandTitle('THE BLACK DEATH', 6)).toEqual({
      text: 'THE BLACK DEATH',
      rotated: false,
    });
  });

  it('paints data bands and skips era rows', () => {
    const dataset = bundledDataset();
    dataset.bands.push(band(), band({ id: 'era_skip', type: 'era', title: 'SKIP' }));
    const paints = bandPaints(
      dataset,
      [
        { bandId: 'band_axial_age', y0: 100, y1: 200 },
        { bandId: 'era_skip', y0: 0, y1: 10 },
      ],
      bundledGeography(),
    );
    expect(paints).toHaveLength(1);
    expect(paints[0]?.hatch).toBe('none');
    expect(paints[0]?.height).toBe(100);
    expect(paints[0]?.label).toBe('THE AXIAL AGE');
  });
});

import { describe, expect, it } from 'vitest';

import { posterWorld } from '../camera/camera.ts';
import { DESIGN_WIDTH } from '../layout/constants.ts';
import {
  PRINT_PRIMARY_PT,
  PRINT_SHEETS,
  PRINT_TERTIARY_PT,
  PRINT_TITLE_IN,
  fitPrint,
  forcePrintFont,
  posterTypeBoost,
  readPrintRequest,
} from './sheet.ts';

describe('print sheets', () => {
  const world = posterWorld();

  it('reads ?print=1 as the 24×36 sheet', () => {
    expect(readPrintRequest('')).toBeNull();
    expect(readPrintRequest('?debug=layout')).toBeNull();
    expect(readPrintRequest('?print=0')).toBeNull();
    expect(readPrintRequest('?print=1')?.sheet).toEqual(PRINT_SHEETS.poster);
    expect(readPrintRequest('?print=1&size=letter')?.sheet.id).toBe('letter');
    expect(readPrintRequest('?print=1&size=tabloid')?.sheet.id).toBe('tabloid');
    expect(readPrintRequest('?print=1&size=poster')?.sheet.id).toBe('poster');
    expect(readPrintRequest('?print=1&size=a0')?.sheet.id).toBe('poster');
    expect(PRINT_SHEETS.letter).toMatchObject({ widthIn: 8.5, heightIn: 11 });
    expect(PRINT_SHEETS.tabloid).toMatchObject({ widthIn: 11, heightIn: 17 });
    expect(PRINT_SHEETS.poster).toMatchObject({ widthIn: 24, heightIn: 36 });
  });

  it('keeps 10 design px at or above 6 pt on the poster', () => {
    expect(world.width).toBe(DESIGN_WIDTH);
    const poster = fitPrint(PRINT_SHEETS.poster, world.width, world.height);
    expect(poster.boost).toBe(1);
    expect(poster.primaryFloorPx).toBeLessThan(10);
    expect(poster.primaryFloorPx * poster.pointsPerPx).toBeCloseTo(PRINT_PRIMARY_PT);
    expect(poster.tertiaryFloorPx * poster.pointsPerPx).toBeCloseTo(PRINT_TERTIARY_PT);
    expect(10 * poster.pointsPerPx).toBeGreaterThanOrEqual(PRINT_PRIMARY_PT);
    expect(11 * poster.pointsPerPx).toBeGreaterThanOrEqual(PRINT_PRIMARY_PT);
    expect(12 * poster.pointsPerPx).toBeGreaterThanOrEqual(PRINT_PRIMARY_PT);
    expect(poster.chartWidthIn).toBeLessThanOrEqual(24 - 1);
    expect(poster.chartHeightIn).toBeCloseTo(36 - 1 - PRINT_TITLE_IN);
    expect(forcePrintFont(10, poster.primaryFloorPx)).toBe(10);
    expect(forcePrintFont(15, poster.primaryFloorPx)).toBe(15);
    expect(posterTypeBoost(world.width, world.height)).toBe(1);
    expect(posterTypeBoost(1500, 20000)).toBeGreaterThan(1);
  });

  it('raises the screen floor on letter and tabloid until it is 6 pt', () => {
    const letter = fitPrint(PRINT_SHEETS.letter, world.width, world.height);
    const tabloid = fitPrint(PRINT_SHEETS.tabloid, world.width, world.height);
    expect(10 * letter.pointsPerPx).toBeLessThan(PRINT_PRIMARY_PT);
    expect(10 * tabloid.pointsPerPx).toBeLessThan(PRINT_PRIMARY_PT);
    expect(letter.boost).toBeGreaterThan(1);
    expect(tabloid.boost).toBeGreaterThan(1);
    expect(10 * letter.boost * letter.pointsPerPx).toBeCloseTo(PRINT_PRIMARY_PT);
    expect(10 * tabloid.boost * tabloid.pointsPerPx).toBeCloseTo(PRINT_PRIMARY_PT);
    expect(12 * letter.boost * letter.pointsPerPx).toBeGreaterThan(PRINT_PRIMARY_PT);
    expect(forcePrintFont(15, letter.primaryFloorPx)).toBe(letter.primaryFloorPx);
    expect(forcePrintFont(12, letter.tertiaryFloorPx)).toBeGreaterThanOrEqual(
      letter.tertiaryFloorPx,
    );
    expect(forcePrintFont(0, 6)).toBe(0);
  });
});

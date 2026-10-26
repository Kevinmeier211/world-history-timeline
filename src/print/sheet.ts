/**
 * Fixed print sheets for `?print=1`. Sizes match T7.02.
 * The 6 pt floor is §4.5 at 24×36. The screen label floor stays 10 design px.
 */

export const PRINT_MARGIN_IN = 0.5;
/** Room kept above the chart for the title band, inside the safe margin. */
export const PRINT_TITLE_IN = 1.2;
export const PRINT_PRIMARY_PT = 6;
export const PRINT_TERTIARY_PT = 5;
/** Screen ribbon floor in `labelFit`. Print multiplies up from this; it does not lower it. */
export const PRINT_SCREEN_MIN_PX = 10;

export type PrintSheetId = 'letter' | 'tabloid' | 'poster';

export interface PrintSheet {
  id: PrintSheetId;
  widthIn: number;
  heightIn: number;
}

export const PRINT_SHEETS: Record<PrintSheetId, PrintSheet> = {
  letter: { id: 'letter', widthIn: 8.5, heightIn: 11 },
  tabloid: { id: 'tabloid', widthIn: 11, heightIn: 17 },
  poster: { id: 'poster', widthIn: 24, heightIn: 36 },
};

export interface PrintRequest {
  sheet: PrintSheet;
}

export interface PrintFit {
  contentWidthIn: number;
  contentHeightIn: number;
  chartWidthIn: number;
  chartHeightIn: number;
  /** Inches of paper per design px. Uniform meet-fit. */
  inchesPerPx: number;
  /** Points of paper per design px. */
  pointsPerPx: number;
  /** Design px that equal 6 pt on this sheet. */
  primaryFloorPx: number;
  /** Design px that equal 5 pt on this sheet. */
  tertiaryFloorPx: number;
  /**
   * Multiplier that would make 10 design px equal 6 pt on this sheet.
   * The renderer applies `posterTypeBoost`, which uses the 24×36 sheet only.
   */
  boost: number;
}

const SHEET_IDS: readonly PrintSheetId[] = ['letter', 'tabloid', 'poster'];

function isSheetId(value: string | null): value is PrintSheetId {
  return value !== null && SHEET_IDS.includes(value as PrintSheetId);
}

/** `?print=1` selects 24×36. `size` may be letter, tabloid, or poster. */
export function readPrintRequest(search: string): PrintRequest | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  if (params.get('print') !== '1') return null;
  const size = params.get('size');
  const sheet = isSheetId(size) ? PRINT_SHEETS[size] : PRINT_SHEETS.poster;
  return { sheet };
}

/** Fit the design chart on the sheet, inside the margin and under the title. */
export function fitPrint(
  sheet: PrintSheet,
  designWidth: number,
  designHeight: number,
): PrintFit {
  if (!(designWidth > 0) || !(designHeight > 0)) {
    throw new Error('design size must be positive');
  }
  const contentWidthIn = sheet.widthIn - 2 * PRINT_MARGIN_IN;
  const contentHeightIn = sheet.heightIn - 2 * PRINT_MARGIN_IN - PRINT_TITLE_IN;
  if (!(contentWidthIn > 0) || !(contentHeightIn > 0)) {
    throw new Error('sheet is smaller than the margin and title');
  }
  const inchesPerPx = Math.min(
    contentWidthIn / designWidth,
    contentHeightIn / designHeight,
  );
  const pointsPerPx = inchesPerPx * 72;
  const primaryFloorPx = PRINT_PRIMARY_PT / pointsPerPx;
  const tertiaryFloorPx = PRINT_TERTIARY_PT / pointsPerPx;
  const boost =
    primaryFloorPx > PRINT_SCREEN_MIN_PX ? primaryFloorPx / PRINT_SCREEN_MIN_PX : 1;
  return {
    contentWidthIn,
    contentHeightIn,
    chartWidthIn: designWidth * inchesPerPx,
    chartHeightIn: designHeight * inchesPerPx,
    inchesPerPx,
    pointsPerPx,
    primaryFloorPx,
    tertiaryFloorPx,
    boost,
  };
}

/** Raise a design-px font to the print floor. A larger screen size stays. */
export function forcePrintFont(fontPx: number, floorPx: number): number {
  if (!(fontPx > 0) || !(floorPx > 0)) return fontPx;
  return Math.max(fontPx, floorPx);
}

/**
 * Type multiplier for every print sheet.
 * §4.5 states the 6 pt floor at 24×36. Smaller sheets keep this type.
 */
export function posterTypeBoost(designWidth: number, designHeight: number): number {
  const poster = fitPrint(PRINT_SHEETS.poster, designWidth, designHeight);
  if (!(poster.primaryFloorPx > PRINT_SCREEN_MIN_PX)) return 1;
  return poster.primaryFloorPx / PRINT_SCREEN_MIN_PX;
}

import { TimeScaleMode, RegionId, Polity } from '../types/history';

export const MIN_YEAR = -3300;
export const MAX_YEAR = 2025;
export const TOP_PADDING = 48;
export const BOTTOM_PADDING = 80;

interface PiecewiseSegment {
  startYear: number;
  endYear: number;
  pxPerYear: number;
}

const POSTER_SEGMENTS: PiecewiseSegment[] = [
  { startYear: -3300, endYear: -1200, pxPerYear: 0.42 }, // Early & Late Bronze Age (2100 yrs -> 882px)
  { startYear: -1200, endYear: -600, pxPerYear: 0.56 },  // Iron Age (600 yrs -> 336px)
  { startYear: -600, endYear: 500, pxPerYear: 0.68 },    // Classical Antiquity (1100 yrs -> 748px)
  { startYear: 500, endYear: 1500, pxPerYear: 0.80 },    // Middle Ages (1000 yrs -> 800px)
  { startYear: 1500, endYear: 2025, pxPerYear: 1.45 },   // Modern Period (525 yrs -> 761px)
];

const LINEAR_PX_PER_YEAR = 0.66;

export function yearToY(year: number, mode: TimeScaleMode, zoom = 1): number {
  const clamped = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));

  if (mode === 'LINEAR') {
    return TOP_PADDING + (clamped - MIN_YEAR) * LINEAR_PX_PER_YEAR * zoom;
  }

  let accY = TOP_PADDING;
  for (const seg of POSTER_SEGMENTS) {
    if (clamped <= seg.startYear) {
      break;
    }
    const effectiveEnd = Math.min(clamped, seg.endYear);
    const span = effectiveEnd - seg.startYear;
    accY += span * seg.pxPerYear * zoom;
    if (clamped <= seg.endYear) {
      break;
    }
  }
  return accY;
}

export function yToYear(y: number, mode: TimeScaleMode, zoom = 1): number {
  const relY = Math.max(0, y - TOP_PADDING);

  if (mode === 'LINEAR') {
    const rawYear = MIN_YEAR + relY / (LINEAR_PX_PER_YEAR * zoom);
    return Math.round(Math.max(MIN_YEAR, Math.min(MAX_YEAR, rawYear)));
  }

  let remainingPx = relY;
  for (const seg of POSTER_SEGMENTS) {
    const segSpanYears = seg.endYear - seg.startYear;
    const segPx = segSpanYears * seg.pxPerYear * zoom;
    if (remainingPx <= segPx) {
      const yearInSeg = seg.startYear + remainingPx / (seg.pxPerYear * zoom);
      return Math.round(Math.max(MIN_YEAR, Math.min(MAX_YEAR, yearInSeg)));
    }
    remainingPx -= segPx;
  }
  return MAX_YEAR;
}

export function getTotalCanvasHeight(mode: TimeScaleMode, zoom = 1): number {
  return yearToY(MAX_YEAR, mode, zoom) + BOTTOM_PADDING;
}

export function formatYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(Math.round(year))} BCE`;
  }
  if (year === 0) {
    return '1 CE';
  }
  return `${Math.round(year)} CE`;
}

export function formatYearShort(year: number): string {
  if (year < 0) {
    return `${Math.abs(Math.round(year))} BCE`;
  }
  return `${Math.round(year)} CE`;
}

export function generateTimeTicks(mode: TimeScaleMode, zoom: number): number[] {
  const ticks: number[] = [];
  // At higher zoom, show finer ticks
  const ancientStep = zoom >= 1.7 ? 50 : 100;
  const modernStep = zoom >= 1.4 ? 25 : 50;

  for (let y = -3300; y < 1500; y += ancientStep) {
    ticks.push(y);
  }
  for (let y = 1500; y <= 2025; y += modernStep) {
    ticks.push(y);
  }
  return ticks;
}

export interface ComputedSpanRect {
  polity: Polity;
  regionId: RegionId;
  colIndex: number;
  xCenter: number;
  width: number;
  xLeft: number;
  xRight: number;
  yStart: number;
  yEnd: number;
  height: number;
}

/**
 * Generates a tapered or rounded vertical stream SVG path for a polity span within a column.
 */
export function buildVerticalRibbonPath(
  xCenter: number,
  width: number,
  yStart: number,
  yEnd: number,
  hasUncertaintyTop = false
): string {
  const halfW = width / 2;
  const h = Math.max(8, yEnd - yStart);
  const taper = Math.min(12, h * 0.14);
  const topWidth = hasUncertaintyTop ? halfW * 0.45 : halfW * 0.78;
  const botWidth = halfW * 0.82;

  const y1 = yStart;
  const y2 = yStart + taper;
  const y3 = yEnd - taper;
  const y4 = yEnd;

  return [
    `M ${xCenter - topWidth} ${y1}`,
    `Q ${xCenter} ${y1 - 3} ${xCenter + topWidth} ${y1}`,
    `C ${xCenter + halfW} ${y1 + taper * 0.5}, ${xCenter + halfW} ${y2}, ${xCenter + halfW} ${y2}`,
    `L ${xCenter + halfW} ${y3}`,
    `C ${xCenter + halfW} ${y3}, ${xCenter + halfW} ${y4 - taper * 0.5}, ${xCenter + botWidth} ${y4}`,
    `Q ${xCenter} ${y4 + 3} ${xCenter - botWidth} ${y4}`,
    `C ${xCenter - halfW} ${y4 - taper * 0.5}, ${xCenter - halfW} ${y3}, ${xCenter - halfW} ${y3}`,
    `L ${xCenter - halfW} ${y2}`,
    `C ${xCenter - halfW} ${y2}, ${xCenter - halfW} ${y1 + taper * 0.5}, ${xCenter - topWidth} ${y1}`,
    'Z',
  ].join(' ');
}

/**
 * Generates a smooth Sankey S-curve transition ribbon connecting a parent span's bottom
 * to a child span's top (even across different columns).
 */
export function buildSankeyTransitionPath(
  x1: number,
  w1: number,
  y1: number,
  x2: number,
  w2: number,
  y2: number
): string {
  const hw1 = Math.min(w1 * 0.36, 26);
  const hw2 = Math.min(w2 * 0.36, 26);
  const midY = (y1 + y2) / 2;

  return [
    `M ${x1 - hw1} ${y1}`,
    `L ${x1 + hw1} ${y1}`,
    `C ${x1 + hw1} ${midY}, ${x2 + hw2} ${midY}, ${x2 + hw2} ${y2}`,
    `L ${x2 - hw2} ${y2}`,
    `C ${x2 - hw2} ${midY}, ${x1 - hw1} ${midY}, ${x1 - hw1} ${y1}`,
    'Z',
  ].join(' ');
}

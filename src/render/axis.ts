import { AXIS_END, AXIS_START, GRID_MAJOR, GRID_MINOR } from '../layout/constants.ts';

/** Finest tick, in years, once the sheet is large on screen. */
const FINE_TICK = 50;

export interface AxisDensity {
  tick: number;
  label: number;
}

/** Wider sheets label every century. A small sheet labels every 500 years. */
export function axisDensity(scale: number): AxisDensity {
  if (scale >= 1.2) return { tick: FINE_TICK, label: GRID_MINOR };
  if (scale >= 0.55) return { tick: GRID_MINOR, label: GRID_MAJOR };
  return { tick: GRID_MAJOR, label: GRID_MAJOR };
}

/** Calendar years on a step. Year 0 is skipped; there is no such year. */
export function tickYears(start: number, end: number, step: number): number[] {
  if (step <= 0 || end < start) return [];
  const years: number[] = [];
  const first = Math.ceil(start / step) * step;
  for (let year = first; year <= end; year += step) {
    if (year !== 0) years.push(year);
  }
  return years;
}

function withEnds(years: readonly number[], start: number, end: number): number[] {
  const set = new Set(years);
  if (start !== 0) set.add(start);
  if (end !== 0) set.add(end);
  return [...set].sort((a, b) => a - b);
}

export function axisMarks(
  scale: number,
  start = AXIS_START,
  end = AXIS_END,
): { ticks: number[]; labels: number[] } {
  const density = axisDensity(scale);
  return {
    ticks: withEnds(tickYears(start, end, density.tick), start, end),
    labels: withEnds(tickYears(start, end, density.label), start, end),
  };
}

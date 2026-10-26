import { toT } from '../lib/years.ts';

/** A polity the slicer needs. Extra fields on a full polity are ignored. */
export interface SlicePolity {
  id: string;
  start: number;
  end: number;
  widthProfile?: readonly { year: number; w?: number }[];
}

/** A relation year is an event even when no polity starts or ends there. */
export interface SliceRelation {
  year: number;
}

/** One interval where the set of living polities does not change. */
export interface TimeSlice {
  /** First event year. Inclusive. */
  start: number;
  /** Next event year. Inclusive as the slice's end boundary. */
  end: number;
  /** Continuous years from `start` to `end`. Year 0 is not counted. */
  span: number;
  /** Polity ids that cover the whole slice, sorted. */
  activeIds: readonly string[];
}

/** Unique event years in continuous-time order. */
export function eventYears(
  polities: readonly SlicePolity[],
  relations: readonly SliceRelation[] = [],
): number[] {
  const years = new Set<number>();
  for (const polity of polities) {
    years.add(polity.start);
    years.add(polity.end);
    for (const key of polity.widthProfile ?? []) years.add(key.year);
  }
  for (const relation of relations) years.add(relation.year);
  return [...years].sort((left, right) => toT(left) - toT(right));
}

/**
 * Slices between consecutive event years. A repeated year, or a polity whose
 * start and end are the same year, has no duration and is not a slice.
 */
export function buildSlices(
  polities: readonly SlicePolity[],
  relations: readonly SliceRelation[] = [],
): TimeSlice[] {
  const years = eventYears(polities, relations);
  const slices: TimeSlice[] = [];
  for (let index = 0; index < years.length - 1; index += 1) {
    const start = years[index];
    const end = years[index + 1];
    if (start === undefined || end === undefined) continue;
    const span = toT(end) - toT(start);
    if (span <= 0) continue;
    const activeIds = polities
      .filter((polity) => polity.start <= start && polity.end >= end)
      .map((polity) => polity.id)
      .sort();
    slices.push({ start, end, span, activeIds });
  }
  return slices;
}

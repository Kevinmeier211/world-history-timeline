import { toT } from '../lib/years.ts';
import type { EraBand } from './frame.ts';

export interface EraPolity {
  id: string;
  name: string;
  start: number;
  end: number;
  family: string;
}

export interface EraCard {
  id: string;
  name: string;
  start: number;
  end: number;
  familyName: string;
}

/** The poster era that contains `year`. The last era includes its end year. */
export function eraAt(year: number, eras: readonly EraBand[]): EraBand | null {
  const hit = eras.find((era) => year >= era.start && year < era.end);
  if (hit) return hit;
  const last = eras.at(-1);
  if (last && year === last.end) return last;
  return null;
}

/** Polities whose span meets the era, earliest first. */
export function politiesInEra(
  polities: readonly EraPolity[],
  families: readonly { id: string; name: string }[],
  era: EraBand | null,
): EraCard[] {
  if (!era) return [];
  const names = new Map(families.map((family) => [family.id, family.name]));
  return polities
    .filter((polity) => polity.start < era.end && polity.end > era.start)
    .map((polity) => ({
      id: polity.id,
      name: polity.name,
      start: polity.start,
      end: polity.end,
      familyName: names.get(polity.family) ?? polity.family,
    }))
    .sort((left, right) => {
      const byYear = toT(left.start) - toT(right.start);
      if (byYear !== 0) return byYear;
      return left.name.localeCompare(right.name);
    });
}

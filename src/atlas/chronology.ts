import { toT } from '../lib/years';
import { intervalKind } from './interval-kind';
import type { RuntimeCorpus, HistoricalInterval, Subject } from './model';

export const nearbyYearLimit = 150;
export const coverageGap = 'Not yet covered in this atlas.';

export function includesYear(interval: HistoricalInterval, year: number): boolean {
  const { start, end } = interval;
  const kind = intervalKind(interval);
  if (kind === 'undated') return false;
  if (kind === 'rival-dates' || start === null) return start === year || end === year;
  if (end === null) return toT(start) <= toT(year);
  return toT(start) <= toT(year) && toT(year) <= toT(end);
}
export function distanceFromInterval(interval: HistoricalInterval, year: number) {
  if (includesYear(interval, year)) return 0;
  return Math.abs(nearestBoundaryOffset(interval, year));
}

function nearestBoundaryOffset({ start, end }: HistoricalInterval, year: number) {
  if (start === null && end === null) return Infinity;
  const time = toT(year);
  const a = start === null ? Infinity : toT(start) - time;
  const b = end === null ? Infinity : toT(end) - time;
  return Math.abs(a) <= Math.abs(b) ? a : b;
}

export function nearbyDateLabel(interval: HistoricalInterval, year: number) {
  if (includesYear(interval, year)) return null;
  const offset = nearestBoundaryOffset(interval, year);
  const years = Math.abs(offset);
  if (years > nearbyYearLimit) return null;
  const distance = `${years} ${years === 1 ? 'year' : 'years'} ${offset < 0 ? 'earlier' : 'later'}`;
  if (intervalKind(interval) === 'rival-dates') return `nearest estimate ${distance}`;
  return `${offset < 0 ? 'ended' : 'begins'} ${distance}`;
}
export function nearestSubject(subjects: Subject[], year: number, maxDistance: number) {
  let nearest: Subject | undefined;
  let shortest = Infinity;
  for (const subject of subjects) {
    const distance = distanceFromInterval(subject.interval, year);
    if (distance <= maxDistance && distance < shortest) {
      nearest = subject;
      shortest = distance;
    }
  }
  return nearest;
}

export function worldAtTime(
  corpus: RuntimeCorpus,
  year: number,
  region: string,
  maxDistance = nearbyYearLimit,
) {
  const available = corpus.subjects.filter(
    (s) => region === 'all' || s.region === region,
  );
  const current = available.filter((s) => includesYear(s.interval, year));
  const contexts = (corpus.contexts ?? []).filter(
    (c) => (region === 'all' || c.region === region) && includesYear(c.interval, year),
  );
  const nearby: Subject[] = [];
  for (const r of new Set(available.map((s) => s.region))) {
    if (current.some((s) => s.region === r)) continue;
    const candidates = available
      .filter((s) => s.region === r)
      .sort((a, b) => a.name.localeCompare(b.name));
    const nearest = nearestSubject(candidates, year, maxDistance);
    if (nearest) nearby.push(nearest);
  }
  return { current, nearby, contexts };
}

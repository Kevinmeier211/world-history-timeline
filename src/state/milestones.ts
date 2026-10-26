import { AXIS_END, AXIS_START } from '../layout/constants.ts';
import { toT } from '../lib/years.ts';

export const MILESTONE_STORAGE_KEY = 'chronos-milestones';
export const MILESTONE_LIMIT = 12;

export interface Milestone {
  id: string;
  year: number;
  label: string;
}

export interface PlacedMilestone extends Milestone {
  stack: number;
}

function markId(year: number, label: string): string {
  let hash = 0;
  for (const char of label) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  const sign = year < 0 ? `n${-year}` : `p${year}`;
  return `m_${sign}_${hash.toString(36)}`;
}

function cleanLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const label = value.trim().replace(/\s+/g, ' ').slice(0, 48);
  return label.length > 0 ? label : null;
}

function inRange(year: number): boolean {
  return Number.isInteger(year) && year !== 0 && year >= AXIS_START && year <= AXIS_END;
}

function clean(value: unknown): Milestone | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as { year?: unknown; label?: unknown };
  const label = cleanLabel(row.label);
  if (!label || typeof row.year !== 'number' || !inRange(row.year)) return null;
  return { id: markId(row.year, label), year: row.year, label };
}

function byTime(left: Milestone, right: Milestone): number {
  const year = toT(left.year) - toT(right.year);
  if (year !== 0) return year;
  return left.label.localeCompare(right.label);
}

function dedupe(rows: readonly Milestone[]): Milestone[] {
  const seen = new Set<string>();
  const next: Milestone[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    next.push(row);
  }
  return next.sort(byTime).slice(0, MILESTONE_LIMIT);
}

/** Read saved marks. Bad JSON, a blocked store, or no store yields an empty list. */
export function readMilestones(storage: Storage | null): Milestone[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(MILESTONE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return dedupe(
      parsed.flatMap((row) => {
        const mark = clean(row);
        return mark ? [mark] : [];
      }),
    );
  } catch {
    return [];
  }
}

/** Persist marks. A blocked store keeps the list in memory and does not throw. */
export function writeMilestones(
  storage: Storage | null,
  rows: readonly Milestone[],
): Milestone[] {
  const next = dedupe(rows);
  if (!storage) return next;
  try {
    storage.setItem(MILESTONE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    return next;
  }
  return next;
}

/** Add one mark. Year 0, a blank label, and a full list leave the marks unchanged. */
export function addMilestone(
  rows: readonly Milestone[],
  year: number,
  label: string,
): Milestone[] {
  const mark = clean({ year, label });
  if (!mark) return [...rows];
  const without = rows.filter((row) => row.id !== mark.id);
  if (without.length >= MILESTONE_LIMIT) return [...rows];
  return dedupe([...without, mark]);
}

export function removeMilestone(rows: readonly Milestone[], id: string): Milestone[] {
  return rows.filter((row) => row.id !== id);
}

/** Stack marks that share a year. Earlier years come first. */
export function placeMilestones(rows: readonly Milestone[]): PlacedMilestone[] {
  let previous = Number.NaN;
  let stack = 0;
  return dedupe(rows).map((row) => {
    stack = row.year === previous ? stack + 1 : 0;
    previous = row.year;
    return { ...row, stack };
  });
}

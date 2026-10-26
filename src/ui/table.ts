import { visibleFamilyIds, type FamilyColumn } from '../layout/columns.ts';
import { toT } from '../lib/years.ts';

export const TABLE_ROW_PX = 36;
export const TABLE_FALLBACK_ROWS = 24;

export type TableSortKey = 'name' | 'start' | 'end' | 'family' | 'importance';
export type TableSortDir = 'asc' | 'desc';

export interface TableFamily {
  id: string;
  name: string;
  macroRegion: string;
}

export interface TableRow {
  id: string;
  kind: 'polity' | 'callout';
  name: string;
  start: number;
  end: number;
  familyId: string;
  familyName: string;
  importance: number;
  attachTo?: string;
}

interface PolityInput {
  id: string;
  name: string;
  start: number;
  end: number;
  family: string;
  importance: number;
}

interface CalloutInput {
  id: string;
  title: string;
  year: number;
  endYear?: number;
  attachTo?: string;
  importance: number;
}

export function buildTableRows(
  polities: readonly PolityInput[],
  callouts: readonly CalloutInput[],
  families: readonly TableFamily[],
  fold: readonly string[],
  pin: readonly string[],
): TableRow[] {
  const columns: FamilyColumn[] = families.map((family) => ({
    id: family.id,
    macroRegion: family.macroRegion,
  }));
  const visible = new Set(visibleFamilyIds(columns, fold, pin));
  const names = new Map(families.map((family) => [family.id, family.name]));
  const polityFamily = new Map(polities.map((polity) => [polity.id, polity.family]));
  const showUnattached = families.length > 0 && visible.size === families.length;
  const rows: TableRow[] = [];
  for (const polity of polities) {
    if (!visible.has(polity.family)) continue;
    rows.push({
      id: polity.id,
      kind: 'polity',
      name: polity.name,
      start: polity.start,
      end: polity.end,
      familyId: polity.family,
      familyName: names.get(polity.family) ?? polity.family,
      importance: polity.importance,
    });
  }
  for (const callout of callouts) {
    const familyId = callout.attachTo ? polityFamily.get(callout.attachTo) : undefined;
    if (familyId) {
      if (!visible.has(familyId)) continue;
    } else if (!showUnattached) continue;
    rows.push({
      id: callout.id,
      kind: 'callout',
      name: callout.title,
      start: callout.year,
      end: callout.endYear ?? callout.year,
      familyId: familyId ?? '',
      familyName: familyId ? (names.get(familyId) ?? familyId) : '',
      importance: callout.importance,
      attachTo: callout.attachTo,
    });
  }
  return rows;
}

export function filterTable(rows: readonly TableRow[], query: string): TableRow[] {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0);
  if (tokens.length === 0) return [...rows];
  return rows.filter((row) => {
    const hay = `${row.name} ${row.familyName} ${row.kind}`.toLowerCase();
    return tokens.every((token) => hay.includes(token));
  });
}

export function sortTable(
  rows: readonly TableRow[],
  key: TableSortKey,
  dir: TableSortDir,
): TableRow[] {
  const sign = dir === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => {
    let compared = 0;
    if (key === 'name') compared = left.name.localeCompare(right.name);
    else if (key === 'family')
      compared = left.familyName.localeCompare(right.familyName);
    else if (key === 'start') compared = toT(left.start) - toT(right.start);
    else if (key === 'end') compared = toT(left.end) - toT(right.end);
    else compared = left.importance - right.importance;
    if (compared === 0) compared = left.name.localeCompare(right.name);
    return compared * sign;
  });
}

/** Rows to paint. A zero viewport paints the fallback prefix so the first screen is not blank. */
export function rowWindow(
  count: number,
  scrollTop: number,
  viewport: number,
  rowPx = TABLE_ROW_PX,
  overscan = 6,
): { start: number; end: number } {
  if (count <= 0 || rowPx <= 0) return { start: 0, end: 0 };
  if (!(viewport > 0)) return { start: 0, end: Math.min(count, TABLE_FALLBACK_ROWS) };
  const start = Math.max(0, Math.floor(Math.max(0, scrollTop) / rowPx) - overscan);
  const end = Math.min(
    count,
    Math.ceil((Math.max(0, scrollTop) + viewport) / rowPx) + overscan,
  );
  return { start, end: Math.max(start, end) };
}

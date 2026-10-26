import { formatRange, formatYear, parseYearQuery, toT } from '../lib/years.ts';

export type SearchKind = 'polity' | 'callout' | 'band' | 'person';

export interface SearchRecord {
  kind: SearchKind;
  id: string;
  label: string;
  terms: readonly string[];
  /** Fly target for a name match. A year query replaces this with the asked year. */
  year: number;
  end?: number;
  importance: number;
  polityId?: string;
}

export interface SearchHit {
  kind: SearchKind;
  id: string;
  label: string;
  detail: string;
  year: number;
  polityId?: string;
}

interface SearchSource {
  polities: readonly {
    id: string;
    name: string;
    shortName?: string;
    altNames?: readonly string[];
    start: number;
    end: number;
    importance: number;
    rulers?: readonly { name: string; title?: string }[];
  }[];
  callouts: readonly {
    id: string;
    title: string;
    year: number;
    endYear?: number;
    importance: number;
    attachTo?: string;
    blurb?: string;
  }[];
  bands: readonly {
    id: string;
    title: string;
    start: number;
    end: number;
    importance: number;
  }[];
}

const LIMIT = 8;
const RECENT_LIMIT = 8;
const CALLOUT_WINDOW = 50;

export function foldText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function recordsFromDataset(dataset: SearchSource): SearchRecord[] {
  const records: SearchRecord[] = [];
  for (const polity of dataset.polities) {
    records.push({
      kind: 'polity',
      id: polity.id,
      label: polity.name,
      terms: termsOf(polity.name, polity.shortName, polity.id, polity.altNames),
      year: polity.start,
      end: polity.end,
      importance: polity.importance,
      polityId: polity.id,
    });
    polity.rulers?.forEach((ruler, index) => {
      records.push({
        kind: 'person',
        id: `${polity.id}:${index}`,
        label: ruler.name,
        terms: termsOf(ruler.name, ruler.title),
        year: polity.start,
        end: polity.end,
        importance: polity.importance,
        polityId: polity.id,
      });
    });
  }
  for (const callout of dataset.callouts) {
    records.push({
      kind: 'callout',
      id: callout.id,
      label: callout.title,
      terms: termsOf(callout.title, callout.blurb),
      year: callout.year,
      end: callout.endYear,
      importance: callout.importance,
      polityId: callout.attachTo,
    });
  }
  for (const band of dataset.bands) {
    records.push({
      kind: 'band',
      id: band.id,
      label: band.title,
      terms: termsOf(band.title, band.id),
      year: band.start,
      end: band.end,
      importance: band.importance,
    });
  }
  return records;
}

export function searchRecords(
  records: readonly SearchRecord[],
  query: string,
  limit = LIMIT,
): SearchHit[] {
  const asked = parseYearQuery(query);
  if (asked !== null) return yearHits(records, asked, limit);
  const folded = foldText(query.trim());
  if (!folded) return [];
  const ranked: { hit: SearchHit; rank: number }[] = [];
  for (const record of records) {
    const score = bestScore(record.terms, folded);
    if (score <= 0) continue;
    ranked.push({
      hit: toHit(record, record.year),
      rank: score * 10 + record.importance,
    });
  }
  return take(ranked, limit);
}

export function pushRecent(
  recents: readonly string[],
  query: string,
  limit = RECENT_LIMIT,
): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [...recents];
  const folded = foldText(trimmed);
  const next = [trimmed, ...recents.filter((item) => foldText(item) !== folded)];
  return next.slice(0, limit);
}

function termsOf(...parts: (string | readonly string[] | undefined)[]): string[] {
  const terms: string[] = [];
  for (const part of parts) {
    if (!part) continue;
    const list = typeof part === 'string' ? [part] : part;
    for (const item of list) {
      terms.push(item);
      if (item.includes('_')) terms.push(item.replaceAll('_', ' '));
    }
  }
  return terms;
}

function yearHits(
  records: readonly SearchRecord[],
  year: number,
  limit: number,
): SearchHit[] {
  const asked = toT(year);
  const ranked: { hit: SearchHit; rank: number }[] = [];
  for (const record of records) {
    if (record.kind === 'person') continue;
    const distance = distanceTo(asked, record);
    if (distance === null) continue;
    if (record.kind === 'callout' && distance > CALLOUT_WINDOW) continue;
    if (record.kind !== 'callout' && distance !== 0) continue;
    ranked.push({
      hit: toHit(record, year),
      rank: record.importance * 100 - distance,
    });
  }
  return take(ranked, limit);
}

function distanceTo(asked: number, record: SearchRecord): number | null {
  const start = toT(record.year);
  const end = record.end === undefined ? start : toT(record.end);
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  if (asked >= lo && asked <= hi) return 0;
  return asked < lo ? lo - asked : asked - hi;
}

function toHit(record: SearchRecord, year: number): SearchHit {
  const detail =
    record.end !== undefined && record.end !== record.year
      ? formatRange(record.year, record.end, 'secure')
      : formatYear(record.year);
  return {
    kind: record.kind,
    id: record.id,
    label: record.label,
    detail,
    year,
    polityId: record.polityId,
  };
}

function bestScore(terms: readonly string[], query: string): number {
  let best = 0;
  for (const term of terms) {
    const score = scoreTerm(foldText(term), query);
    if (score > best) best = score;
  }
  return best;
}

function scoreTerm(text: string, query: string): number {
  if (!text || !query) return 0;
  if (text === query) return 100;
  if (text.startsWith(query)) return 82;
  const words = text.split(/[^a-z0-9]+/).filter(Boolean);
  if (words.some((word) => word.startsWith(query))) return 74;
  if (text.includes(query)) return 56;
  let cursor = 0;
  let gaps = 0;
  for (const char of query) {
    const at = text.indexOf(char, cursor);
    if (at < 0) return 0;
    gaps += at - cursor;
    cursor = at + 1;
  }
  if (gaps > query.length) return 0;
  return 28 - Math.min(18, gaps);
}

function take(ranked: { hit: SearchHit; rank: number }[], limit: number): SearchHit[] {
  ranked.sort(
    (a, b) =>
      b.rank - a.rank ||
      a.hit.label.localeCompare(b.hit.label) ||
      a.hit.id.localeCompare(b.hit.id),
  );
  return ranked.slice(0, limit).map((item) => item.hit);
}

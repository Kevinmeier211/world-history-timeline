import type { Confidence } from '../data/schema/primitives.ts';

/** Continuous year index. Year -1 maps to 0 and year 1 maps to 1, so there is no zero year. */
export function toT(year: number): number {
  if (year === 0) throw new Error('no year 0');
  return year < 0 ? year + 1 : year;
}

export function fromT(t: number): number {
  if (!Number.isInteger(t)) throw new Error('continuous time must be an integer');
  return t <= 0 ? t - 1 : t;
}

export function formatYear(year: number): string {
  if (year === 0) throw new Error('no year 0');
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function sameEra(start: number, end: number): boolean {
  return (start < 0 && end < 0) || (start > 0 && end > 0);
}

export function formatRange(
  start: number,
  end: number,
  confidence: Confidence,
): string {
  const prefix = confidence === 'secure' ? '' : 'c. ';
  if (sameEra(start, end)) {
    const era = start < 0 ? 'BCE' : 'CE';
    return `${prefix}${Math.abs(start)}–${Math.abs(end)} ${era}`;
  }
  return `${prefix}${formatYear(start)} – ${formatYear(end)}`;
}

/** Parse a search box year. Returns null when the text is not a single year. */
export function parseYearQuery(query: string): number | null {
  const trimmed = query.trim().replace(/^c\.?\s*/i, '');
  const bce = trimmed.match(/^(\d{1,5})\s*(BCE|BC)$/i);
  if (bce?.[1]) {
    const year = -Number(bce[1]);
    return year === 0 ? null : year;
  }
  const ce = trimmed.match(/^(?:(?:AD|CE)\s+)?(\d{1,5})(?:\s*(?:CE|AD))?$/i);
  const text = ce?.[1];
  if (!text) return null;
  if (!/^\d/.test(trimmed) && !/^(?:AD|CE)\b/i.test(trimmed)) return null;
  const year = Number(text);
  return year === 0 ? null : year;
}

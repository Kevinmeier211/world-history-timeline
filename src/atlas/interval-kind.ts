import { parseYearQuery } from '../lib/years';
import type { HistoricalInterval } from './model';

export function intervalKind({ start, end, precision, label }: HistoricalInterval) {
  if (start === null && end === null) return 'undated';
  if (end === null) return 'open-ended';
  if (start === null || precision !== 'disputed') return 'span';

  const rivals = label.match(
    /^(?:[^:\d]+:\s*)?((?:c\.\s*)?\d{1,5}(?:\s*(?:BCE|CE))?)\s+or\s+((?:c\.\s*)?\d{1,5}(?:\s*(?:BCE|CE))?)(?:;\s*disputed)?$/i,
  );
  if (!rivals) return 'span';
  const [, first, second] = rivals as [string, string, string];
  const sharedBce = /BCE$/i.test(second) && /\d$/.test(first);
  const a = parseYearQuery(sharedBce ? `${first} BCE` : first);
  const b = parseYearQuery(second);
  return (a === start && b === end) || (a === end && b === start)
    ? 'rival-dates'
    : 'span';
}

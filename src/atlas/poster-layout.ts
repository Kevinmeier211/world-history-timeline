import type { Corpus, HistoricalContext, Subject } from './model';
import { regions } from './model';
import { overviewAnchors, overviewNames } from './overview-data';
import { projectInterval } from './geometry';
import { formatYear, toT } from '../lib/years';

export const posterWindow = { start: -3300, end: 2000 };
export const posterWidth = 360;
export const posterLabelWidth = 44;
/** Balance a growing bibliography so a final sheet does not hold just one source. */
export function posterSourceGroups<T>(sources: T[]): T[][] {
  const count = Math.ceil(sources.length / 3);
  if (!count) return [];
  const small = Math.floor(sources.length / count);
  const extra = sources.length % count;
  let offset = 0;
  return Array.from({ length: count }, (_, i) => {
    const size = small + (i < extra ? 1 : 0);
    const group = sources.slice(offset, offset + size);
    offset += size;
    return group;
  });
}
export const posterTicks = [-3300, -2000, -1000, 1, 1000, 2000];
export function posterPosition(year: number) {
  return (
    (toT(year) - toT(posterWindow.start)) /
    (toT(posterWindow.end) - toT(posterWindow.start))
  );
}
export function posterEntries(corpus: Corpus) {
  return overviewAnchors.flatMap((id, i) => {
    const subject = corpus.subjects.find((s) => s.id === id);
    if (!subject) return [];
    const context = corpus.contexts?.find((c) => subject.contextIds?.includes(c.id));
    const interval = context?.interval ?? subject.interval;
    const projection = projectInterval(
      interval.start,
      interval.ongoing ? posterWindow.end : interval.end,
      posterWindow,
    );
    if (!projection) return [];
    return [{ key: i + 1, subject, context, interval, projection }];
  });
}
export type PosterEntry = ReturnType<typeof posterEntries>[number];

type PosterSourceKey = Pick<
  ReturnType<typeof posterSources>[number],
  'number' | 'uses'
>;

/**
 * Print measurements at the existing Letter/12mm layout leave about 635px for
 * the regional cards. Keep a small reserve and at most two cards per sheet.
 * The conservative wrapping budgets include each separate paragraph and the
 * longer reference/case date explanations. Browser/PDF bounds remain the final
 * check; an oversized single entry is preserved for that check, never cut.
 */
export const posterNotePageBudget = 630;
const posterNoteCardGap = 19;

function wrappedLines(text: string, columns: number) {
  let lines = 1;
  let used = 0;
  for (const word of text.trim().split(/\s+/)) {
    if (used && used + 1 + word.length > columns) {
      lines++;
      used = 0;
    }
    const extra = Math.max(0, Math.ceil(word.length / columns) - 1);
    lines += extra;
    used = (used ? used + 1 : 0) + word.length - extra * columns;
  }
  return lines;
}

export function posterNoteHeight(
  entry: PosterEntry,
  sources: readonly PosterSourceKey[],
) {
  const { subject, context, interval } = entry;
  const sourceNumbers = sources
    .filter((source) => source.uses.some((use) => use.key === entry.key))
    .map((source) => `[${source.number}]`)
    .join(', ');
  // Rounded-up line heights/margins at 725px content width, with deliberately
  // shorter line capacities than the measured Source Sans 3 print paragraphs.
  const blocks: { text: string; columns: number; lineHeight: number; gap?: number }[] =
    [
      {
        text: `${context ? 'Reference frame' : 'Case dates'} · ${entry.key}`,
        columns: 100,
        lineHeight: 18,
      },
      { text: context?.title ?? subject.name, columns: 70, lineHeight: 23, gap: 12 },
      { text: interval.label, columns: 100, lineHeight: 21 },
      { text: context?.summary ?? subject.summary, columns: 100, lineHeight: 21 },
      { text: interval.note, columns: 112, lineHeight: 19 },
    ];
  if (context) {
    blocks.push({
      text: `The case: ${subject.name}. ${subject.interval.label}. ${subject.interval.note}`,
      columns: 112,
      lineHeight: 19,
    });
  }
  blocks.push(
    { text: `Place: ${subject.place}`, columns: 100, lineHeight: 21 },
    {
      text: `Sources: ${sourceNumbers}. Titles, locators and consultation limits follow.`,
      columns: 112,
      lineHeight: 19,
    },
  );
  return blocks.reduce(
    (height, block, i) =>
      height +
      wrappedLines(block.text, block.columns) * block.lineHeight +
      (i < blocks.length - 1 ? (block.gap ?? 8) : 0),
    13, // Existing 3mm top padding and border, rounded up.
  );
}

export function posterNoteGroups<T extends PosterEntry>(
  entries: readonly T[],
  sources: readonly PosterSourceKey[],
): T[][] {
  const groups: T[][] = [];
  let height = 0;
  for (const entry of entries) {
    const entryHeight = posterNoteHeight(entry, sources);
    const group = groups.at(-1);
    if (
      !group ||
      group.length === 2 ||
      height + posterNoteCardGap + entryHeight > posterNotePageBudget
    ) {
      groups.push([entry]);
      height = entryHeight;
    } else {
      group.push(entry);
      height += posterNoteCardGap + entryHeight;
    }
  }
  return groups;
}

export function posterRows(corpus: Corpus) {
  const entries = posterEntries(corpus);
  return regions.map((region) => {
    const selected = entries
      .filter((e) => e.subject.region === region)
      .sort(
        (a, b) =>
          toT(a.interval.start ?? a.interval.end!) -
          toT(b.interval.start ?? b.interval.end!),
      );
    const labels = new Map<string, number>();
    for (let track = 0; track < 2; track++) {
      let right = posterWidth;
      const group = selected.filter((_, i) => i % 2 === track);
      for (const entry of group.reverse()) {
        const wanted = (entry.projection.left / 100) * posterWidth;
        const left = Math.max(0, Math.min(wanted, right - posterLabelWidth));
        labels.set(entry.subject.id, left);
        right = left - 3;
      }
    }
    return {
      region,
      entries: selected.map((e, i) => ({
        ...e,
        track: i % 2,
        labelLeft: labels.get(e.subject.id)!,
        name: overviewNames[e.subject.id] ?? e.subject.name.split(':')[0]!,
        marker: (e.projection.width / 100) * posterWidth < 1,
      })),
    };
  });
}
export function posterRange(entry: PosterEntry) {
  const { start, end, precision } = entry.interval;
  if (start === null || end === null) return entry.interval.label;
  const prefix =
    precision === 'approximate' || /\bc\.|approximately/i.test(entry.interval.label)
      ? 'c. '
      : '';
  const suffix = precision === 'disputed' ? ' ?' : '';
  if (start === end) return prefix + formatYear(start) + suffix;
  if (Math.sign(start) === Math.sign(end))
    return `${prefix}${Math.abs(start)}-${Math.abs(end)} ${start < 0 ? 'BCE' : 'CE'}${suffix}`;
  return `${prefix}${formatYear(start)}-${formatYear(end)}${suffix}`;
}
export function posterCitations(subject: Subject, context?: HistoricalContext) {
  return context?.citations ?? subject.claims.flatMap((claim) => claim.citations);
}
export function posterSources(corpus: Corpus) {
  const entries = posterEntries(corpus);
  return corpus.sources
    .filter((source) =>
      entries.some((entry) =>
        posterCitations(entry.subject, entry.context).some(
          (citation) => citation.source === source.id,
        ),
      ),
    )
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((source, i) => ({
      ...source,
      number: i + 1,
      uses: entries.flatMap((entry) => {
        const locators = [
          ...new Set(
            posterCitations(entry.subject, entry.context)
              .filter((c) => c.source === source.id)
              .map((c) => c.locator),
          ),
        ];
        return locators.length ? [{ key: entry.key, locators }] : [];
      }),
    }));
}

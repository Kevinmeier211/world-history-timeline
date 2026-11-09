import type { Citation, Corpus, Journey, Source, Subject } from './model';
import { familyMedia } from './family-media';
export interface ChapterSourceRow {
  source: Source;
  locators: string[];
}
export function chapterComparisonDimensions(pair: Subject[]): string[] {
  if (pair.length < 2) return [];
  return Object.keys(pair[0]!.dimensions)
    .filter((d) => pair[1]!.dimensions[d])
    .slice(0, 2);
}
/** Include the evidence behind each stop, rather than only the quiz/comparison pair. */
export function chapterSourceRows(
  c: Corpus,
  j: Journey,
  pair: Subject[],
): ChapterSourceRow[] {
  const citations: Citation[] = [
    ...j.evidence.citations,
    ...(j.familyEvidence?.citations ?? []),
  ];
  const subjects = [
    ...new Set([...j.stops.map((s) => s.subject), ...pair.map((s) => s.id)]),
  ].map((id) => c.subjects.find((s) => s.id === id)!);
  for (const s of subjects) {
    citations.push(
      ...s.sections.flatMap((s) => s.citations),
      ...s.claims.flatMap((cl) => cl.citations),
    );
    for (const ctx of c.contexts ?? [])
      if (s.contextIds?.includes(ctx.id))
        citations.push(...ctx.citations, ...ctx.phases.flatMap((p) => p.citations));
  }
  for (const dimension of chapterComparisonDimensions(pair))
    for (const s of pair) citations.push(...s.dimensions[dimension]!.citations);
  for (const id of [
    ...j.stops.map((s) => s.object),
    j.leadObject,
    j.familyEvidence?.object,
    familyMedia(c, j)?.id,
  ]) {
    const m = c.media.find((m) => m.id === id);
    if (m) {
      citations.push({
        source: m.source,
        locator: `Object record and supplied image: ${m.accession}`,
      });
      citations.push(...(m.annotations?.items ?? []).flatMap((note) => note.citations));
    }
  }
  return [...new Set(citations.map((ref) => ref.source))].map((id) => ({
    source: c.sources.find((s) => s.id === id)!,
    locators: [
      ...new Set(
        citations.filter((ref) => ref.source === id).map((ref) => ref.locator),
      ),
    ],
  }));
}
/** Keep full source notes; create additional pages when metadata is lengthy. */
export function chapterSourceGroups(
  rows: ChapterSourceRow[],
  maxCount = 3,
): ChapterSourceRow[][] {
  const groups: ChapterSourceRow[][] = [];
  let group: ChapterSourceRow[] = [],
    characters = 0;
  for (const row of rows) {
    const weight = [
      row.source.title,
      row.source.author ?? '',
      row.source.institution,
      row.source.url,
      row.source.scope,
      row.source.accessed,
      row.source.published ?? '',
      ...row.locators,
    ].join(' ').length;
    // Every reference sheet also prints a return question. Keep complete
    // records together while allowing more sheets for substantial source notes.
    if (group.length && (group.length >= maxCount || characters + weight > 3200)) {
      groups.push(group);
      group = [];
      characters = 0;
    }
    group.push(row);
    characters += weight;
  }
  if (group.length) groups.push(group);
  return groups;
}

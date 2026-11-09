import type { Corpus } from './model';

/** Latest recorded author consultation, without redating older claims. */
export function latestConsultationDate(c: Corpus): string | undefined {
  return [
    ...c.sources.map((source) => source.accessed),
    ...c.subjects.flatMap((subject) => [
      ...(subject.review ? [subject.review.consultedOn] : []),
      ...subject.claims.map((claim) => claim.checkedOn),
    ]),
  ]
    .filter(Boolean)
    .sort()
    .at(-1);
}

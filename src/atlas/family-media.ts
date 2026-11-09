import type { Corpus, Journey, Media } from './model';

/** A family illustration must come from this inquiry, regardless of pack overlap. */
export function familyMedia(c: Corpus, j: Journey): Media | undefined {
  if (j.familyEvidence?.object === null) return undefined;
  const participating = new Set(
    j.stops.flatMap(
      (stop) => c.subjects.find((s) => s.id === stop.subject)?.objectIds ?? [],
    ),
  );
  const candidates = [
    j.familyEvidence?.object,
    j.leadObject,
    ...j.stops.map((s) => s.object),
    ...participating,
  ];
  for (const id of candidates) {
    if (id && participating.has(id)) {
      const media = c.media.find((m) => m.id === id);
      if (media) return media;
    }
  }
}

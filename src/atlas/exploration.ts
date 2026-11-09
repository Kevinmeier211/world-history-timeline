import { fromT, toT } from '../lib/years';
import { includesYear, nearbyYearLimit, nearestSubject } from './chronology';
import { regions, type MediaSummary, type RuntimeCorpus, type Subject } from './model';
import { storyObject } from './story-selection';

export function explorationObject(subject: Subject, media: MediaSummary[]) {
  return (
    storyObject(subject, media) ??
    media.find((object) => subject.objectIds.includes(object.id))
  );
}

/** Reading suggestions only: never widen a case's dates to fill a region. */
export function regionalStartingPoints(
  subjects: Subject[],
  year: number,
  maxDistance = nearbyYearLimit,
) {
  return regions.flatMap((region) => {
    const candidates = subjects.filter((subject) => subject.region === region);
    const nearest = nearestSubject(candidates, year, maxDistance);
    return nearest ? [nearest] : [];
  });
}

export function explorationSelection(
  corpus: RuntimeCorpus,
  subjects: Subject[],
  year: number,
  requested: string | null,
) {
  return (
    subjects.find((subject) => subject.id === requested) ??
    subjects.find(
      (subject) =>
        includesYear(subject.interval, year) &&
        explorationObject(subject, corpus.media),
    ) ??
    regionalStartingPoints(subjects, year)[0]
  );
}

export function timeTicks(window: { start: number; end: number }) {
  for (const step of [10, 25, 50, 100, 250, 500, 1000]) {
    const first = Math.ceil(window.start / step);
    const last = Math.floor(window.end / step);
    const count = last - first + 1 - (first <= 0 && last >= 0 ? 1 : 0);
    if (count > 7 && step < 1000) continue;
    if (count < 2) break;
    return Array.from(
      { length: last - first + 1 },
      (_, i) => (first + i) * step,
    ).filter((year) => year !== 0);
  }
  // Very narrow windows may contain no calendar multiple at all.
  return [...new Set([toT(window.start), toT(window.end)])].map(fromT);
}

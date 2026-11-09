import { useCallback, useEffect, useState } from 'react';
import type { Media, MediaSummary, RuntimeCorpus } from './model';
import { loadMediaDetails } from './data';
import { isCompleteMedia } from './media-details';

export type MediaFailure =
  | { status: 'failed'; recovery: 'retry'; retry: () => void }
  | { status: 'failed'; recovery: 'reload'; reload: () => void };

export type SubjectMediaState =
  | { status: 'loading'; retry: () => void }
  | MediaFailure
  | { status: 'ready'; media: Media[]; retry: () => void };

type LoadedState =
  | { key: string; status: 'loading' | 'failed' }
  | { key: string; status: 'ready'; media: Media[] };

/** The caller supplies stable bootstrap records, independently of dossier prose. */
export function useSubjectMedia(
  corpus: RuntimeCorpus,
  subjectId: string | null,
  summaries: MediaSummary[],
): SubjectMediaState {
  const deferred = corpus.mediaDetailsDeferred === true;
  const revision = corpus.mediaRevision;
  const key = JSON.stringify([subjectId, revision, summaries.map((m) => m.id)]);
  const [loaded, setLoaded] = useState<LoadedState | null>(null);
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => window.location.reload(), []);
  const retry = useCallback(() => {
    setLoaded({ key, status: 'loading' });
    setAttempt((value) => value + 1);
  }, [key]);

  useEffect(() => {
    if (
      !deferred ||
      !subjectId ||
      !summaries.length ||
      typeof revision !== 'string' ||
      !revision.trim()
    )
      return;
    let active = true;
    loadMediaDetails(subjectId, revision, summaries)
      .then((media) => {
        if (active) setLoaded({ key, status: 'ready', media });
      })
      .catch(() => {
        if (active) setLoaded({ key, status: 'failed' });
      });
    return () => {
      active = false;
    };
  }, [deferred, subjectId, revision, summaries, key, attempt]);

  if (!subjectId || !summaries.length) return { status: 'ready', media: [], retry };
  if (!deferred)
    return summaries.every(isCompleteMedia)
      ? { status: 'ready', media: summaries, retry }
      : { status: 'failed', recovery: 'reload', reload };
  if (typeof revision !== 'string' || !revision.trim())
    return { status: 'failed', recovery: 'reload', reload };
  if (loaded?.key !== key) return { status: 'loading', retry };
  if (loaded.status === 'ready') return { status: 'ready', media: loaded.media, retry };
  return loaded.status === 'failed'
    ? { status: 'failed', recovery: 'retry', retry }
    : { status: 'loading', retry };
}

import { useCallback, useEffect, useState } from 'react';
import { loadJourneyDetails } from './data';
import { assertJourneyRequest, isCompleteJourney } from './journey-details';
import type { Journey, JourneySummary } from './model';

export type JourneyReadingState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; journey: Journey }
  | { status: 'failed'; recovery: 'retry' | 'reload' };

type Snapshot = {
  summary: JourneySummary;
  attempt: number;
  state: JourneyReadingState;
};

/** A subject/step may change while this request is pending; never reuse old prose. */
export function useJourneyDetails(
  summary: JourneySummary | undefined,
  deferred: boolean,
): JourneyReadingState & { retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [snapshot, setSnapshot] = useState<Snapshot>();
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  let validRequest = false;
  if (summary && deferred) {
    try {
      assertJourneyRequest(summary, summary.detailsRevision ?? '');
      validRequest = true;
    } catch {
      // A malformed index cannot be repaired by fetching the same sidecar again.
    }
  }
  useEffect(() => {
    if (!summary || !deferred || !validRequest) return;
    let current = true;
    loadJourneyDetails(summary).then(
      (journey) => {
        if (current)
          setSnapshot({ summary, attempt, state: { status: 'ready', journey } });
      },
      () => {
        if (current)
          setSnapshot({
            summary,
            attempt,
            state: { status: 'failed', recovery: 'retry' },
          });
      },
    );
    return () => {
      current = false;
    };
  }, [summary, deferred, validRequest, attempt]);

  let state: JourneyReadingState;
  if (!summary) state = { status: 'idle' };
  else if (!deferred)
    state = isCompleteJourney(summary)
      ? { status: 'ready', journey: summary }
      : { status: 'failed', recovery: 'reload' };
  else if (!validRequest) state = { status: 'failed', recovery: 'reload' };
  else
    state =
      snapshot?.summary === summary && snapshot.attempt === attempt
        ? snapshot.state
        : { status: 'loading' };
  return { ...state, retry };
}

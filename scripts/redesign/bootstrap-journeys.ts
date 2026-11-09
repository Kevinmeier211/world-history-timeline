import { createHash } from 'node:crypto';
import type { Corpus, JourneySummary } from '../../src/atlas/model';
import {
  isCompleteJourney,
  mergeJourneyDetails,
  parseJourneyDetails,
} from '../../src/atlas/journey-details';

/** Delivery projection only: canonical journeys and all print fields stay intact. */
export function buildJourneyBootstrap(corpus: Corpus) {
  const journeys: JourneySummary[] = [];
  const ids = new Set<string>();
  const records = corpus.journeys.map((journey) => {
    if (!isCompleteJourney(journey) || ids.has(journey.id))
      throw Error(`Incomplete canonical journey: ${journey.id}`);
    ids.add(journey.id);
    const summary: JourneySummary = {
      id: journey.id,
      hasFamilyActivity: !!journey.familyEvidence,
      title: journey.title,
      question: journey.question,
      duration: journey.duration,
      introduction: journey.introduction,
      returnPrompt: journey.returnPrompt,
      stops: journey.stops.map((stop) => ({
        subject: stop.subject,
        year: stop.year,
        title: stop.title,
        ...(stop.object !== undefined ? { object: stop.object } : {}),
        ...(stop.compare !== undefined ? { compare: stop.compare } : {}),
        ...(stop.relation !== undefined ? { relation: stop.relation } : {}),
      })),
      evidence: {
        citations: journey.evidence.citations.map((citation) => ({ ...citation })),
      },
    };
    const reading = {
      stops: journey.stops.map((stop, index) => ({ index, narrative: stop.narrative })),
      conclusion: journey.conclusion,
      evidence: {
        prompt: journey.evidence.prompt,
        options: journey.evidence.options.map((option) => ({ ...option })),
      },
    };
    // Retained membership/order and all web reading contribute to this journey's
    // identity. Print-only changes do not invalidate unrelated web requests.
    const revision = createHash('sha256')
      .update(JSON.stringify({ summary, reading }))
      .digest('hex');
    summary.detailsRevision = revision;
    const record = { journey: journey.id, revision, ...reading };
    mergeJourneyDetails(parseJourneyDetails(record, journey.id, revision), summary);
    journeys.push(summary);
    return record;
  });
  return { journeys, records };
}

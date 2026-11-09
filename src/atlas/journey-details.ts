import type {
  Citation,
  Journey,
  JourneyDetails,
  JourneySummary,
  StopSummary,
} from './model';

const incomplete = () =>
  Error('Journey reading is incomplete or belongs to another release.');
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const nonblank = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const validRevision = (value: unknown): value is string =>
  typeof value === 'string' && value.length === 64 && /^[a-f0-9]{64}$/.test(value);
const onlyKeys = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).every((key) => keys.includes(key));
function text(value: unknown): string {
  if (!nonblank(value)) throw incomplete();
  return value;
}
function citations(value: unknown): Citation[] {
  if (!Array.isArray(value) || !value.length) throw incomplete();
  return Array.from(value, (item) => {
    if (!record(item) || !onlyKeys(item, ['source', 'locator'])) throw incomplete();
    return { source: text(item.source), locator: text(item.locator) };
  });
}

/** Validate retained navigation/save data independently from reading readiness. */
function readSummary(value: unknown): JourneySummary {
  if (!record(value) || !Array.isArray(value.stops) || !value.stops.length)
    throw incomplete();
  if (!record(value.evidence)) throw incomplete();
  const summary: JourneySummary = {
    id: text(value.id),
    title: text(value.title),
    question: text(value.question),
    duration: text(value.duration),
    introduction: text(value.introduction),
    returnPrompt: text(value.returnPrompt),
    stops: Array.from(value.stops, (item): StopSummary => {
      if (!record(item) || !Number.isInteger(item.year) || item.year === 0)
        throw incomplete();
      const stop: StopSummary = {
        subject: text(item.subject),
        year: item.year as number,
        title: text(item.title),
      };
      if (item.object !== undefined) stop.object = text(item.object);
      if (item.compare !== undefined) stop.compare = text(item.compare);
      if (item.relation !== undefined) stop.relation = text(item.relation);
      return stop;
    }),
    evidence: { citations: citations(value.evidence.citations) },
  };
  if (value.detailsRevision !== undefined) {
    if (!validRevision(value.detailsRevision)) throw incomplete();
    summary.detailsRevision = value.detailsRevision;
  }
  return summary;
}

function readDetails(value: unknown): JourneyDetails {
  if (
    !record(value) ||
    !onlyKeys(value, ['id', 'stops', 'conclusion', 'evidence']) ||
    !Array.isArray(value.stops) ||
    !value.stops.length ||
    !record(value.evidence) ||
    !onlyKeys(value.evidence, ['prompt', 'options']) ||
    !Array.isArray(value.evidence.options) ||
    value.evidence.options.length < 2
  )
    throw incomplete();
  const count = value.stops.length;
  const seen = new Set<number>();
  const stops = Array.from(value.stops, (item) => {
    if (
      !record(item) ||
      !onlyKeys(item, ['index', 'narrative']) ||
      !Number.isInteger(item.index) ||
      (item.index as number) < 0 ||
      (item.index as number) >= count ||
      seen.has(item.index as number)
    )
      throw incomplete();
    const index = item.index as number;
    seen.add(index);
    return { index, narrative: text(item.narrative) };
  });
  const options = Array.from(value.evidence.options, (option) => {
    if (
      !record(option) ||
      !onlyKeys(option, ['text', 'feedback', 'supported']) ||
      typeof option.supported !== 'boolean'
    )
      throw incomplete();
    return {
      text: text(option.text),
      feedback: text(option.feedback),
      supported: option.supported,
    };
  });
  if (
    !options.some((option) => option.supported) ||
    !options.some((option) => !option.supported)
  )
    throw incomplete();
  return {
    id: text(value.id),
    stops,
    conclusion: text(value.conclusion),
    evidence: { prompt: text(value.evidence.prompt), options },
  };
}

/** Reject malformed bootstrap identity before starting a network request. */
export function assertJourneyRequest(summary: JourneySummary, revision: string): void {
  const retained = readSummary(summary);
  if (!validRevision(revision) || retained.detailsRevision !== revision)
    throw incomplete();
}

/** The sidecar contains reading fields only: identity/navigation cannot be replaced. */
export function parseJourneyDetails(
  value: unknown,
  id: string,
  revision: string,
): JourneyDetails {
  if (
    !record(value) ||
    !onlyKeys(value, ['journey', 'revision', 'stops', 'conclusion', 'evidence']) ||
    !nonblank(id) ||
    !validRevision(revision) ||
    value.journey !== id ||
    value.revision !== revision
  )
    throw incomplete();
  return readDetails({
    id,
    stops: value.stops,
    conclusion: value.conclusion,
    evidence: value.evidence,
  });
}

/** Merge fresh caller summaries, never cached identity, dates, citations or titles. */
export function mergeJourneyDetails(
  details: JourneyDetails,
  summary: JourneySummary,
): Journey {
  const retained = readSummary(summary);
  const reading = readDetails(details);
  if (reading.id !== retained.id || reading.stops.length !== retained.stops.length)
    throw incomplete();
  const byIndex = new Map(reading.stops.map((stop) => [stop.index, stop.narrative]));
  return {
    id: retained.id,
    title: retained.title,
    question: retained.question,
    duration: retained.duration,
    introduction: retained.introduction,
    returnPrompt: retained.returnPrompt,
    stops: retained.stops.map((stop, index) => ({
      ...stop,
      narrative: byIndex.get(index)!,
    })),
    conclusion: reading.conclusion,
    evidence: { ...reading.evidence, citations: retained.evidence.citations },
  };
}

/** An unmarked incomplete record cannot silently render as full-corpus reading. */
export function isCompleteJourney(value: JourneySummary): value is Journey {
  try {
    readSummary(value);
    const full = value as Journey;
    readDetails({
      id: full.id,
      stops: Array.from(full.stops, (stop, index) => ({
        index,
        narrative: stop.narrative,
      })),
      conclusion: full.conclusion,
      evidence: {
        prompt: full.evidence.prompt,
        options: full.evidence.options,
      },
    });
    return true;
  } catch {
    return false;
  }
}

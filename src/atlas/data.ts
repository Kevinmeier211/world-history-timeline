import type {
  Corpus,
  HistoricalContext,
  Subject,
  SearchEntry,
  Source,
  Media,
  MediaDetails,
  MediaSummary,
  RuntimeCorpus,
  Journey,
  JourneyDetails,
  JourneySummary,
  RegionalOrientation,
  RegionalSnapshotReading,
} from './model';
import {
  assertMediaRequest,
  mergeMediaDetails,
  parseMediaDetails,
} from './media-details';
import {
  assertJourneyRequest,
  mergeJourneyDetails,
  parseJourneyDetails,
} from './journey-details';
export { isCompleteMedia } from './media-details';
const cache = new Map<string, Promise<Subject>>();
const mediaDetails = new Map<string, Promise<MediaDetails[]>>();
const journeyDetails = new Map<string, Promise<JourneyDetails>>();
const root = import.meta.env.BASE_URL;
export function loadCorpus(full: true): Promise<Corpus>;
export function loadCorpus(full?: false): Promise<RuntimeCorpus>;
export function loadCorpus(full: boolean): Promise<Corpus | RuntimeCorpus>;
export async function loadCorpus(full = false): Promise<Corpus | RuntimeCorpus> {
  const r = await fetch(`${root}atlas/${full ? 'corpus' : 'index'}.json`);
  if (!r.ok) throw Error('The local atlas content could not be loaded.');
  return r.json();
}
export function loadSubject(id: string): Promise<Subject> {
  if (!cache.has(id))
    cache.set(
      id,
      fetch(`${root}atlas/subjects/${encodeURIComponent(id)}.json`)
        .then((r) => {
          if (!r.ok) throw Error('This subject is not in the local release.');
          return r.json().then((subject: Subject) => {
            if (subject?.id !== id)
              throw Error('The researched dossier could not load.');
            return subject;
          });
        })
        .catch((e) => {
          cache.delete(id);
          throw e;
        }),
    );
  return cache.get(id)!;
}
export const asset = (url: string) => `${root}${url.replace(/^\//, '')}`;
let snapshotReadings: Promise<RegionalSnapshotReading[]> | undefined;
export function loadRegionalSnapshots(): Promise<RegionalSnapshotReading[]> {
  snapshotReadings ??= fetch(asset('/atlas/regional-snapshots.json')).then(
    async (r) => {
      if (!r.ok) throw Error('Snapshot reading could not be loaded.');
      const rows = await r.json();
      if (
        !Array.isArray(rows) ||
        rows.some(
          (row) =>
            !row ||
            typeof row.orientation !== 'string' ||
            typeof row.region !== 'string' ||
            !Number.isInteger(row.year) ||
            row.year === 0 ||
            typeof row.text !== 'string' ||
            !row.text ||
            !Array.isArray(row.citations) ||
            !row.citations.length ||
            row.citations.some(
              (c: { source?: unknown; locator?: unknown }) =>
                !c || typeof c.source !== 'string' || typeof c.locator !== 'string',
            ),
        )
      )
        throw Error('Snapshot reading is incomplete.');
      return rows as RegionalSnapshotReading[];
    },
  );
  const request = snapshotReadings;
  return request.catch((error) => {
    if (snapshotReadings === request) snapshotReadings = undefined;
    throw error;
  });
}
let regionalOrientations: Promise<RegionalOrientation[]> | undefined;
export function loadRegionalOrientations(
  chapter: string,
): Promise<RegionalOrientation[]> {
  if (!regionalOrientations)
    regionalOrientations = fetch(asset('/atlas/orientations.json')).then(async (r) => {
      if (!r.ok) throw Error('Regional reading could not be loaded.');
      const rows = (await r.json()) as RegionalOrientation[];
      if (
        !Array.isArray(rows) ||
        rows.some(
          (o) =>
            !o ||
            typeof o.id !== 'string' ||
            typeof o.chapter !== 'string' ||
            !o.summary?.text ||
            !Array.isArray(o.sections) ||
            !o.sections.length ||
            !o.activity?.prompt ||
            !o.activity.response ||
            !Array.isArray(o.subjectIds) ||
            !Array.isArray(o.snapshots) ||
            [o.summary, ...o.sections].some(
              (s) => !s.text || !Array.isArray(s.citations) || !s.citations.length,
            ),
        )
      )
        throw Error('Regional reading is incomplete.');
      return rows;
    });
  const request = regionalOrientations;
  return request
    .then((rows) => {
      const selected = rows.filter((o) => o.chapter === chapter);
      if (!selected.length) throw Error('This chapter has no regional reading.');
      return selected;
    })
    .catch((error) => {
      if (regionalOrientations === request) regionalOrientations = undefined;
      throw error;
    });
}
/** Load only the selected journey; cache validated deltas, never caller metadata. */
export async function loadJourneyDetails(summary: JourneySummary): Promise<Journey> {
  const revision = summary.detailsRevision ?? '';
  assertJourneyRequest(summary, revision);
  const key = JSON.stringify([summary.id, revision]);
  let request = journeyDetails.get(key);
  if (!request) {
    request = fetch(
      `${asset(`/atlas/journey-records/${encodeURIComponent(summary.id)}.json`)}?revision=${encodeURIComponent(revision)}`,
    ).then(async (response) => {
      if (!response.ok) throw Error('Journey reading could not be loaded.');
      return parseJourneyDetails(await response.json(), summary.id, revision);
    });
    journeyDetails.set(key, request);
  }
  try {
    return mergeJourneyDetails(await request, summary);
  } catch (error) {
    if (journeyDetails.get(key) === request) journeyDetails.delete(key);
    throw error;
  }
}
/** Per-subject rich deltas load alongside reading, never during the overview. */
export async function loadMediaDetails(
  subjectId: string,
  revision: string,
  summaries: MediaSummary[],
): Promise<Media[]> {
  assertMediaRequest(subjectId, revision, summaries);
  if (!summaries.length) return [];
  const key = JSON.stringify([subjectId, revision]);
  let request = mediaDetails.get(key);
  if (!request) {
    request = fetch(
      `${asset(`/atlas/media-records/${encodeURIComponent(subjectId)}.json`)}?revision=${encodeURIComponent(revision)}`,
    ).then(async (response) => {
      if (!response.ok) throw Error('Image information could not be loaded.');
      return parseMediaDetails(await response.json(), subjectId, revision);
    });
    mediaDetails.set(key, request);
  }
  try {
    return mergeMediaDetails(await request, summaries);
  } catch (error) {
    // An older rejected caller must not evict a newer retry for this key.
    if (mediaDetails.get(key) === request) mediaDetails.delete(key);
    throw error;
  }
}
let referenceContexts: Promise<HistoricalContext[]> | undefined;
export function loadReferenceContexts(
  requiredIds: string[] = [],
): Promise<HistoricalContext[]> {
  if (!referenceContexts)
    referenceContexts = fetch(asset('/atlas/contexts.json')).then(async (response) => {
      if (!response.ok) throw Error('Reference reading could not be loaded.');
      const contexts = (await response.json()) as HistoricalContext[];
      if (
        !Array.isArray(contexts) ||
        contexts.some(
          (context) =>
            !context ||
            typeof context.id !== 'string' ||
            !Array.isArray(context.phases) ||
            !context.phases.length ||
            context.phases.some(
              (phase) =>
                !phase ||
                !Number.isInteger(phase.year) ||
                phase.year === 0 ||
                typeof phase.title !== 'string' ||
                !phase.title.trim() ||
                typeof phase.text !== 'string' ||
                !phase.text.trim() ||
                !Array.isArray(phase.citations) ||
                !phase.citations.length,
            ),
        )
      )
        throw Error('Reference reading is incomplete.');
      return contexts;
    });
  const request = referenceContexts;
  return request
    .then((contexts) => {
      if (requiredIds.some((id) => !contexts.some((context) => context.id === id)))
        throw Error('Reference reading is incomplete.');
      return contexts;
    })
    .catch((error) => {
      if (referenceContexts === request) referenceContexts = undefined;
      throw error;
    });
}
const sourceTypes = new Set<Source['type']>([
  'catalogue',
  'scholarship',
  'archive',
  'archaeology',
  'primary',
]);
const sourceRecordError = () => Error('Source records could not be loaded.');
function httpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || !value || /\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
/** Accept only a complete bibliography. Empty scope is intentional; optional fields stay absent. */
export function parseSourceRecords(
  value: unknown,
  requiredIds: readonly string[] = [],
): Source[] {
  if (!Array.isArray(value)) throw sourceRecordError();
  const records: Source[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item))
      throw sourceRecordError();
    const row = item as Record<string, unknown>;
    if (typeof row.id !== 'string' || !row.id.trim() || seen.has(row.id))
      throw sourceRecordError();
    if (
      typeof row.title !== 'string' ||
      !row.title.trim() ||
      typeof row.institution !== 'string' ||
      !row.institution.trim() ||
      typeof row.accessed !== 'string' ||
      !row.accessed.trim() ||
      typeof row.scope !== 'string' ||
      typeof row.type !== 'string' ||
      !sourceTypes.has(row.type as Source['type']) ||
      !httpUrl(row.url)
    )
      throw sourceRecordError();
    const record: Source = {
      id: row.id,
      title: row.title,
      institution: row.institution,
      url: row.url,
      type: row.type as Source['type'],
      accessed: row.accessed,
      scope: row.scope,
    };
    if ('author' in row) {
      if (typeof row.author !== 'string') throw sourceRecordError();
      record.author = row.author;
    }
    if ('published' in row) {
      if (typeof row.published !== 'string') throw sourceRecordError();
      record.published = row.published;
    }
    seen.add(row.id);
    records.push(record);
  }
  if (requiredIds.length) {
    const required = new Set(requiredIds);
    if (
      required.size !== requiredIds.length ||
      required.size !== seen.size ||
      [...required].some((id) => !seen.has(id))
    )
      throw sourceRecordError();
  }
  return records;
}
let sourceRecords: { key: string; request: Promise<Source[]> } | undefined;
/** Bibliography fields for the bootstrap. Not part of the first-paint file. */
export function loadSourceRecords(
  requiredIds: readonly string[] = [],
): Promise<Source[]> {
  if (new Set(requiredIds).size !== requiredIds.length)
    return Promise.reject(sourceRecordError());
  const key = JSON.stringify([...requiredIds].sort());
  if (sourceRecords?.key !== key) {
    const request = fetch(asset('/atlas/source-records.json')).then(
      async (response) => {
        if (!response.ok) throw sourceRecordError();
        let value: unknown;
        try {
          value = await response.json();
        } catch {
          throw sourceRecordError();
        }
        return parseSourceRecords(value, requiredIds);
      },
    );
    sourceRecords = { key, request };
  }
  const current = sourceRecords;
  return current.request.catch((error: unknown) => {
    if (sourceRecords === current) sourceRecords = undefined;
    throw error;
  });
}
let sourceScopes: Promise<Record<string, string>> | undefined;
export function loadSourceScopes(): Promise<Record<string, string>> {
  if (!sourceScopes)
    sourceScopes = fetch(asset('/atlas/source-scopes.json'))
      .then((r) => {
        if (!r.ok) throw Error('Source consultation details could not be loaded.');
        return r.json() as Promise<Record<string, string>>;
      })
      .catch((e) => {
        sourceScopes = undefined;
        throw e;
      });
  return sourceScopes;
}
export async function loadSearchIndex(): Promise<SearchEntry[]> {
  const response = await fetch(asset('/atlas/search.json'));
  if (!response.ok)
    throw Error('Full-text search is unavailable. Names and summaries still work.');
  return response.json();
}

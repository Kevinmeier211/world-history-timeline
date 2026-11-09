import type { Media, MediaAnnotations, MediaDetails, MediaSummary } from './model';

/** Shared canonical field order for compiled reading deltas and their revision. */
export const mediaDetailKeys = [
  'caption',
  'notice',
  'creator',
  'place',
  'material',
  'representedDate',
  'relevance',
  'datingNote',
  'additionalImages',
  'additionalImageAlts',
  'printWidthMm',
  'annotations',
] as const;
const detailKeys = new Set<string>(['id', ...mediaDetailKeys]);
const envelopeKeys = new Set(['subject', 'revision', 'media']);
const precisions = new Set(['exact', 'approximate', 'range', 'unknown', 'disputed']);
const depictions = new Set<Media['depiction']>([
  'object photograph',
  'contemporary document',
  'later depiction',
  'explanatory diagram',
  'modern terrain model',
  'archive reference card',
  'annotated excavation photograph',
  'satellite image',
]);
const incomplete = () =>
  Error('Image information is incomplete or belongs to another release.');
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
const nonblank = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const positive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

function text(value: unknown): string {
  if (!nonblank(value)) throw incomplete();
  return value;
}
function strings(value: unknown): string[] {
  if (!Array.isArray(value)) throw incomplete();
  for (const member of value) if (!nonblank(member)) throw incomplete();
  return [...value];
}
/** Optional authored alternate descriptions align exactly with their own paths. */
export function validAdditionalImageAlts(input: object): boolean {
  const value = input as Record<string, unknown>;
  if (value.additionalImageAlts === undefined) return true;
  return (
    Array.isArray(value.additionalImages) &&
    Array.isArray(value.additionalImageAlts) &&
    value.additionalImages.length === value.additionalImageAlts.length &&
    value.additionalImages.every(nonblank) &&
    value.additionalImageAlts.every(nonblank)
  );
}
function annotations(input: unknown): MediaAnnotations {
  const keys = new Set(['createdOn', 'credit', 'rights', 'licenseUrl', 'items']);
  if (!record(input) || Object.keys(input).some((key) => !keys.has(key)))
    throw incomplete();
  const createdOn = text(input.createdOn);
  const createdTime = Date.parse(createdOn);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(createdOn) ||
    !Number.isFinite(createdTime) ||
    new Date(createdTime).toISOString().slice(0, 10) !== createdOn
  )
    throw incomplete();
  const licenseUrl = text(input.licenseUrl);
  if (!/^https?:\/\//.test(licenseUrl)) throw incomplete();
  if (!Array.isArray(input.items) || !input.items.length) throw incomplete();
  const ids = new Set<string>(),
    labels = new Set<string>();
  const itemKeys = new Set(['id', 'label', 'x', 'y', 'text', 'citations']);
  const items = Array.from(input.items, (item) => {
    if (!record(item) || Object.keys(item).some((key) => !itemKeys.has(key)))
      throw incomplete();
    const id = text(item.id),
      label = text(item.label);
    if (ids.has(id) || labels.has(label)) throw incomplete();
    ids.add(id);
    labels.add(label);
    const { x, y } = item;
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      x < 0 ||
      x > 1 ||
      y < 0 ||
      y > 1
    )
      throw incomplete();
    if (!Array.isArray(item.citations) || !item.citations.length) throw incomplete();
    const citations = Array.from(item.citations, (cite) => {
      if (
        !record(cite) ||
        Object.keys(cite).some((key) => !['source', 'locator'].includes(key))
      )
        throw incomplete();
      return { source: text(cite.source), locator: text(cite.locator) };
    });
    return { id, label, x, y, text: text(item.text), citations };
  });
  return {
    createdOn,
    credit: text(input.credit),
    rights: text(input.rights),
    licenseUrl,
    items,
  };
}
function readDetails(input: object): MediaDetails {
  const value = input as Record<string, unknown>;
  const notice = strings(value.notice);
  if (!notice.length) throw incomplete();
  const details: MediaDetails = {
    id: text(value.id),
    caption: text(value.caption),
    notice,
    creator: text(value.creator),
    place: text(value.place),
    material: text(value.material),
    relevance: text(value.relevance),
  };
  if (value.representedDate !== undefined)
    details.representedDate = text(value.representedDate);
  if (value.datingNote !== undefined) details.datingNote = text(value.datingNote);
  if (value.additionalImages !== undefined)
    details.additionalImages = strings(value.additionalImages);
  if (value.additionalImageAlts !== undefined) {
    if (!validAdditionalImageAlts(value)) throw incomplete();
    details.additionalImageAlts = strings(value.additionalImageAlts);
  }
  if (value.printWidthMm !== undefined) {
    if (!positive(value.printWidthMm)) throw incomplete();
    details.printWidthMm = value.printWidthMm;
  }
  if (value.annotations !== undefined)
    details.annotations = annotations(value.annotations);
  return details;
}
function completeSummary(value: MediaSummary): boolean {
  if (!record(value)) return false;
  const required = [
    'id',
    'title',
    'subject',
    'source',
    'accession',
    'image',
    'thumbnail',
    'alt',
    'rights',
    'credit',
    'sourceImage',
  ] as const;
  if (required.some((key) => !nonblank(value[key]))) return false;
  if (!positive(value.width) || !positive(value.height)) return false;
  if (!depictions.has(value.depiction)) return false;
  if (value.hasAnnotations !== undefined && value.hasAnnotations !== true) return false;
  if (value.licenseUrl !== undefined && !nonblank(value.licenseUrl)) return false;
  const date = value.date;
  if (!record(date) || !nonblank(date.label) || !nonblank(date.note)) return false;
  if (!precisions.has(date.precision)) return false;
  for (const year of [date.start, date.end])
    if (year !== null && (!Number.isInteger(year) || year === 0)) return false;
  if (date.start !== null && date.end !== null && date.start > date.end) return false;
  if (date.ongoing !== undefined && typeof date.ongoing !== 'boolean') return false;
  if (date.alternatives !== undefined) {
    if (!Array.isArray(date.alternatives)) return false;
    for (const alternative of date.alternatives) {
      if (
        !record(alternative) ||
        !nonblank(alternative.label) ||
        !Array.isArray(alternative.citations)
      )
        return false;
      for (const citation of alternative.citations)
        if (
          !record(citation) ||
          !nonblank(citation.source) ||
          !nonblank(citation.locator)
        )
          return false;
    }
  }
  return true;
}

/** Reject invalid caller identity/coverage before starting a request. */
export function assertMediaRequest(
  subjectId: string,
  revision: string,
  summaries: MediaSummary[],
): void {
  if (!nonblank(subjectId) || !nonblank(revision) || !Array.isArray(summaries))
    throw incomplete();
  const ids = new Set<string>();
  for (const summary of summaries) {
    if (!completeSummary(summary) || ids.has(summary.id)) throw incomplete();
    ids.add(summary.id);
  }
}

/** Validate only the delta contract; never cache a first caller's merged records. */
export function parseMediaDetails(
  value: unknown,
  subjectId: string,
  revision: string,
): MediaDetails[] {
  if (
    !record(value) ||
    Object.keys(value).some((key) => !envelopeKeys.has(key)) ||
    value.subject !== subjectId ||
    value.revision !== revision ||
    !nonblank(subjectId) ||
    !nonblank(revision) ||
    !Array.isArray(value.media)
  )
    throw incomplete();
  const ids = new Set<string>();
  const details: MediaDetails[] = [];
  for (const row of value.media) {
    if (!record(row) || Object.keys(row).some((key) => !detailKeys.has(key)))
      throw incomplete();
    const parsed = readDetails(row);
    if (ids.has(parsed.id)) throw incomplete();
    ids.add(parsed.id);
    details.push(parsed);
  }
  return details;
}

/** Exact coverage and original summary order; retained metadata is never replaced. */
export function mergeMediaDetails(
  details: MediaDetails[],
  summaries: MediaSummary[],
): Media[] {
  const ids = new Set<string>();
  for (const summary of summaries) {
    if (!completeSummary(summary) || ids.has(summary.id)) throw incomplete();
    ids.add(summary.id);
  }
  const byId = new Map<string, MediaDetails>();
  for (const detail of details) {
    if (!ids.has(detail.id) || byId.has(detail.id)) throw incomplete();
    byId.set(detail.id, detail);
  }
  if (byId.size !== ids.size) throw incomplete();
  return summaries.map((summary) => {
    const detail = byId.get(summary.id)!;
    // Project the whitelist again: no raw sidecar identity/rights fields are spread.
    const resolved = { ...summary, ...readDetails(detail) };
    if (!!summary.hasAnnotations !== !!resolved.annotations) throw incomplete();
    return resolved;
  });
}

/** Full-corpus input must prove completeness, not merely omit a bootstrap flag. */
export function isCompleteMedia(value: MediaSummary): value is Media {
  const candidate: unknown = value;
  if (!record(candidate) || !completeSummary(value)) return false;
  try {
    const details = readDetails(candidate);
    if (!!value.hasAnnotations !== !!details.annotations) return false;
    if (
      candidate.printCaption !== undefined &&
      typeof candidate.printCaption !== 'string'
    )
      return false;
    if (
      candidate.printCredit !== undefined &&
      typeof candidate.printCredit !== 'string'
    )
      return false;
    return true;
  } catch {
    return false;
  }
}

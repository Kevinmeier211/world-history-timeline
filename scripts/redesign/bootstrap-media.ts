import { createHash } from 'node:crypto';
import type { Corpus, MediaSummary } from '../../src/atlas/model';
import {
  mediaDetailKeys,
  mergeMediaDetails,
  parseMediaDetails,
} from '../../src/atlas/media-details';

/** Split delivery data, including optional per-view descriptions; full print stays complete. */
export function buildMediaBootstrap(corpus: Corpus) {
  const deferred = new Set<string>([...mediaDetailKeys, 'printCaption', 'printCredit']);
  const media = corpus.media.map(
    (record) =>
      Object.fromEntries(
        Object.entries(record).filter(([key]) => !deferred.has(key)),
      ) as MediaSummary,
  );
  const details = corpus.media.map((record) => ({
    id: record.id,
    ...Object.fromEntries(mediaDetailKeys.map((key) => [key, record[key]])),
  }));
  // Include membership: reusing an existing image in another dossier must also
  // invalidate a cached per-subject response, even if its prose is unchanged.
  const revision = createHash('sha256')
    .update(
      JSON.stringify({
        subjects: corpus.subjects.map(({ id, objectIds }) => ({ id, objectIds })),
        media: details,
      }),
    )
    .digest('hex');
  const records = corpus.subjects
    .filter((subject) => subject.objectIds.length)
    .map((subject) => ({
      subject: subject.id,
      revision,
      media: details.filter((record) => subject.objectIds.includes(record.id)),
    }));
  // Fail during authoring if a generated record would be rejected by the reader.
  for (const record of records) {
    const ids = new Set(record.media.map((item) => item.id));
    mergeMediaDetails(
      parseMediaDetails(record, record.subject, revision),
      media.filter((summary) => ids.has(summary.id)),
    );
  }
  return { media, revision, records };
}

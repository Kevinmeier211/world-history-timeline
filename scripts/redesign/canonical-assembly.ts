import type { Corpus } from '../../src/atlas/model';

export interface ContentManifest {
  version: number;
  order: Record<string, string[]>;
  owners: Record<string, string>;
}

const collections = [
  'subjects',
  'sources',
  'media',
  'relations',
  'packs',
  'journeys',
  'glossary',
  'contexts',
  'comparisons',
  'orientations',
];
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const nonblank = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/** Join explicitly owned records in the stable delivery order, with fresh objects. */
export function assembleCanonicalCorpus(
  partitions: Record<string, unknown>,
  manifest: ContentManifest,
): Corpus {
  if (manifest.version !== 1 || !object(manifest.order) || !object(manifest.owners))
    throw Error('Invalid canonical content manifest.');
  const orderedCollections = Object.keys(manifest.order);
  if (
    orderedCollections.length !== collections.length ||
    collections.some((collection) => !Object.hasOwn(manifest.order, collection))
  )
    throw Error('Canonical manifest must enumerate every corpus collection.');

  const expected = new Set<string>();
  for (const [collection, ids] of Object.entries(manifest.order)) {
    if (!Array.isArray(ids)) throw Error('Invalid record order for ' + collection);
    for (const id of ids) {
      const key = collection + '/' + id;
      if (!nonblank(id) || expected.has(key))
        throw Error('Invalid or duplicate ordered record ' + key);
      const owner = manifest.owners[key];
      if (!nonblank(owner) || !Object.hasOwn(partitions, owner))
        throw Error('Missing canonical owner for ' + key);
      expected.add(key);
    }
  }
  for (const key of Object.keys(manifest.owners))
    if (!expected.has(key)) throw Error('Owner without an ordered record ' + key);

  const records = new Map<string, Record<string, unknown>>();
  for (const [owner, partition] of Object.entries(partitions)) {
    if (!object(partition)) throw Error('Invalid canonical partition ' + owner);
    for (const [collection, rows] of Object.entries(partition)) {
      if (!collections.includes(collection) || !Array.isArray(rows))
        throw Error('Invalid canonical collection ' + owner + '/' + collection);
      for (const row of rows) {
        if (!object(row) || !nonblank(row.id))
          throw Error('Canonical record needs an ID in ' + owner + '/' + collection);
        const key = collection + '/' + row.id;
        if (records.has(key)) throw Error('Duplicate canonical record ' + key);
        if (!expected.has(key)) throw Error('Unowned canonical record ' + key);
        if (manifest.owners[key] !== owner)
          throw Error('Wrong canonical owner for ' + key);
        records.set(key, row);
      }
    }
  }

  const result: Record<string, unknown[]> = {};
  for (const [collection, ids] of Object.entries(manifest.order))
    result[collection] = ids.map((id) => {
      const key = collection + '/' + id;
      const row = records.get(key);
      if (!row) throw Error('Missing canonical record ' + key);
      return row;
    });
  return structuredClone(result) as unknown as Corpus;
}

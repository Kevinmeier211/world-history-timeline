/** One-time migration comparator. A new destination is required; authored files are never overwritten. */
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { format, resolveConfig } from 'prettier';
import { createBaseCorpus } from '../redesign/content-base';
import { applyContentStages } from '../redesign/content-pipeline';
import {
  assembleCanonicalCorpus,
  type ContentManifest,
} from '../redesign/canonical-assembly';
import type { Corpus } from '../../src/atlas/model';

const destination = process.argv[2] ?? '';
const reportDirectory = process.argv[3] ?? '';
if (!destination || !reportDirectory)
  throw Error('Provide a new canonical destination and a migration report directory.');
const baselinePath = process.env.ATLAS_BASELINE_CORPUS ?? 'public/atlas/corpus.json';
const baseline = await fs.readFile(baselinePath, 'utf8');
const corpus = createBaseCorpus();
applyContentStages(corpus);
assert.equal(
  JSON.stringify(corpus),
  baseline,
  'Historical assembly must match the frozen migration corpus.',
);
await fs.mkdir(destination, { recursive: false });
await fs.mkdir(reportDirectory, { recursive: true });
const formatting = await resolveConfig('scripts/redesign/content-canonical/C1.json');
const subjectOwners = new Map(
  corpus.subjects.map((subject) => [subject.id, subject.packs[0]!]),
);
const soleOwner = (ids: string[]) => {
  const owners = [...new Set(ids.map((id) => subjectOwners.get(id)).filter(Boolean))];
  return owners.length === 1 ? owners[0]! : 'shared';
};
type Row = { id: string; [field: string]: unknown };
function owner(collection: string, row: Row): string {
  switch (collection) {
    case 'subjects':
      return subjectOwners.get(row.id)!;
    case 'sources':
      return 'sources';
    case 'media':
      return subjectOwners.get(row.subject as string)!;
    case 'packs':
      return row.id;
    case 'orientations':
      return row.chapter as string;
    case 'contexts':
      return soleOwner(row.subjectIds as string[]);
    case 'comparisons':
      return soleOwner(row.subjects as string[]);
    case 'journeys':
      return soleOwner(
        (row.stops as { subject: string }[]).map((stop) => stop.subject),
      );
    case 'relations':
      return soleOwner([row.from as string, row.to as string]);
    default:
      return 'shared';
  }
}
const partitions: Record<string, Record<string, Row[]>> = Object.fromEntries(
  [...corpus.packs.map((pack) => pack.id), 'sources', 'shared'].map((name) => [
    name,
    {},
  ]),
);
const manifest: ContentManifest = { version: 1, order: {}, owners: {} };
for (const [collection, rows] of Object.entries(corpus) as [string, Row[]][]) {
  manifest.order[collection] = rows.map((row) => row.id);
  for (const row of rows) {
    const name = owner(collection, row);
    assert.ok(
      partitions[name],
      'Every record needs a known owner: ' + collection + '/' + row.id,
    );
    (partitions[name]![collection] ??= []).push(row);
    manifest.owners[collection + '/' + row.id] = name;
  }
}
async function write(name: string, value: unknown) {
  await fs.writeFile(
    path.join(destination, name + '.json'),
    await format(JSON.stringify(value), { ...formatting, parser: 'json' }),
  );
}
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
// The first migrated chapter is read from its actual canonical file.
await write('C1', partitions.C1);
const c1 = JSON.parse(await fs.readFile(path.join(destination, 'C1.json'), 'utf8'));
const pilot = structuredClone(corpus);
for (const [collection, rows] of Object.entries(c1) as [keyof Corpus, Row[]][]) {
  const replacement = new Map(rows.map((row) => [row.id, row]));
  const existing = pilot[collection] as unknown as Row[];
  (pilot as unknown as Record<string, unknown>)[collection] = existing.map(
    (row) => replacement.get(row.id) ?? row,
  );
}
assert.equal(
  JSON.stringify(pilot),
  baseline,
  'C1 pilot must preserve complete corpus bytes.',
);
await fs.writeFile(
  path.join(reportDirectory, 'c1-pilot.json'),
  JSON.stringify(
    {
      result: 'pass',
      baselinePath,
      corpusSHA256: digest(baseline),
      exactWholeCorpusBytes: true,
      canonicalFile: path.join(destination, 'C1.json'),
      collections: Object.fromEntries(
        Object.entries(c1).map(([key, rows]) => [key, (rows as unknown[]).length]),
      ),
    },
    null,
    2,
  ) + '\n',
);

for (const [name, value] of Object.entries(partitions))
  if (name !== 'C1') await write(name, value);
await write('manifest', manifest);
const reloaded = Object.fromEntries(
  await Promise.all(
    Object.keys(partitions).map(async (name) => [
      name,
      JSON.parse(await fs.readFile(path.join(destination, name + '.json'), 'utf8')),
    ]),
  ),
);
const first = assembleCanonicalCorpus(reloaded, manifest);
const second = assembleCanonicalCorpus(reloaded, manifest);
assert.equal(JSON.stringify(first), baseline);
assert.equal(JSON.stringify(second), baseline);
first.subjects[0]!.name = 'Mutation-isolation probe';
assert.equal(JSON.stringify(second), baseline);
assert.equal(JSON.stringify(assembleCanonicalCorpus(reloaded, manifest)), baseline);
await fs.writeFile(
  path.join(reportDirectory, 'all-chapters.json'),
  JSON.stringify(
    {
      result: 'pass',
      baselinePath,
      corpusSHA256: digest(baseline),
      exactWholeCorpusBytes: true,
      freshIndependentAssembly: true,
      mutationIsolation: true,
      collections: Object.fromEntries(
        Object.entries(manifest.order).map(([key, ids]) => [key, ids.length]),
      ),
      partitions: Object.fromEntries(
        Object.entries(partitions).map(([name, value]) => [
          name,
          Object.fromEntries(
            Object.entries(value).map(([key, rows]) => [key, rows.length]),
          ),
        ]),
      ),
    },
    null,
    2,
  ) + '\n',
);
console.log('C1 pilot and every canonical chapter preserve the frozen corpus bytes.');

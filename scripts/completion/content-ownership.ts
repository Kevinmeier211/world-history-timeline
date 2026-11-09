import fs from 'node:fs/promises';
import process from 'node:process';
import { createHash } from 'node:crypto';
import { createCanonicalCorpus } from '../redesign/canonical-content';
import manifest from '../redesign/content-canonical/manifest.json';
import history from '../../docs/redesign/CONTENT-HISTORY-2026-11-05.json';

const corpus = createCanonicalCorpus();
const bytes = JSON.stringify(corpus);
const repeated = createCanonicalCorpus();
if (JSON.stringify(repeated) !== bytes)
  throw Error('Canonical assembly is not repeatable.');
corpus.subjects[0]!.name = 'Isolation check';
if (
  JSON.stringify(repeated) !== bytes ||
  JSON.stringify(createCanonicalCorpus()) !== bytes
)
  throw Error('Canonical assembly shares mutable authored records.');

const baselinePath = process.env.ATLAS_BASELINE_CORPUS;
if (baselinePath && bytes !== (await fs.readFile(baselinePath, 'utf8')))
  throw Error(
    'Canonical content differs from the explicitly supplied parity baseline.',
  );

const owners: Record<string, string> = manifest.owners;
const ownership = Object.fromEntries(
  Object.entries(owners).map(([id, owner]) => [
    id,
    {
      file: 'scripts/redesign/content-canonical/' + owner + '.json',
      record: id.split('/')[1],
    },
  ]),
);
const result = {
  generated: new Date().toISOString(),
  scope:
    'Canonical authoring locations. Historical field writers are preserved in the frozen migration history.',
  corpusSHA256: createHash('sha256').update(bytes).digest('hex'),
  baselinePath: baselinePath ?? null,
  identicalCorpusBytes: baselinePath ? true : null,
  freshIndependentAssembly: true,
  mutationIsolation: true,
  manifest: 'scripts/redesign/content-canonical/manifest.json',
  historicalProvenance: {
    file: 'docs/redesign/CONTENT-HISTORY-2026-11-05.json',
    corpusSHA256: history.corpusSHA256,
    stageCount: history.stages.length,
    base: 'scripts/redesign/content-base.ts',
    pipeline: 'scripts/redesign/content-pipeline.ts',
  },
  chapterChecks: repeated.packs.map((pack) => ({
    chapter: pack.id,
    authoringFile: 'scripts/redesign/content-canonical/' + pack.id + '.json',
    ownedSubjectIds: repeated.subjects
      .filter((subject) => owners['subjects/' + subject.id] === pack.id)
      .map((subject) => subject.id),
    visibleSubjectIds: repeated.subjects
      .filter((subject) => subject.packs.includes(pack.id))
      .map((subject) => subject.id),
  })),
  ownership,
};
await fs.writeFile(
  'docs/redesign/CONTENT-OWNERSHIP.json',
  JSON.stringify(result, null, 2) + '\n',
);
console.log(
  JSON.stringify({
    result: 'pass',
    corpusSHA256: result.corpusSHA256,
    records: Object.keys(ownership).length,
  }),
);

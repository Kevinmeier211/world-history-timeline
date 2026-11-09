/** Compare migration stages against frozen delivery bytes in isolated output trees. */
import fs from 'node:fs/promises';
import type { Buffer } from 'node:buffer';
import path from 'node:path';
import process from 'node:process';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { compile } from '../redesign/compile';
import { createCanonicalCorpus } from '../redesign/canonical-content';
import { createBaseCorpus } from '../redesign/content-base';
import { applyContentStages } from '../redesign/content-pipeline';

const reportDirectory = process.argv[2];
if (!reportDirectory)
  throw Error('Provide the migration report directory containing baseline/.');
const baseline: { path: string; sha256: string; bytes: number }[] = JSON.parse(
  await fs.readFile(path.join(reportDirectory, 'baseline-files.json'), 'utf8'),
);
const pilot = createBaseCorpus();
applyContentStages(pilot);
const c1: Record<string, { id: string }[]> = JSON.parse(
  await fs.readFile('scripts/redesign/content-canonical/C1.json', 'utf8'),
);
for (const [collection, rows] of Object.entries(c1)) {
  const replacements = new Map(rows.map((row) => [row.id, row]));
  const data = pilot as unknown as Record<string, { id: string }[]>;
  data[collection] = data[collection]!.map((row) => replacements.get(row.id) ?? row);
}
for (const [name, corpus] of [
  ['c1-pilot', pilot],
  ['all-chapters', createCanonicalCorpus()],
] as const) {
  const candidate = path.resolve(reportDirectory, name + '-candidate');
  const directory = path.join(candidate, 'public/atlas');
  const manifestDirectory = path.join(candidate, 'output/redesign/manifests');
  await compile({ corpus, directory, manifestDirectory });
  // Run the existing legacy projection against the new corpus in the isolated tree.
  for (const group of [
    'polities',
    'relations',
    'callouts',
    'bands',
    'routes',
    'tours',
  ]) {
    const target = path.join(candidate, 'src/data', group);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.cp(path.resolve('src/data', group), target, { recursive: true });
  }
  await fs.mkdir(path.join(candidate, 'src/atlas'), { recursive: true });
  execFileSync('python3', [path.resolve('scripts/redesign/legacy-ledger.py')], {
    cwd: candidate,
    stdio: 'inherit',
  });
  const files = [];
  for (const expected of baseline) {
    const bytes = await fs.readFile(path.join(directory, expected.path));
    const original: Buffer = await fs.readFile(
      path.join(reportDirectory, 'baseline', expected.path),
    );
    assert.ok(bytes.equals(original), 'Delivery changed: ' + expected.path);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    assert.equal(sha256, expected.sha256, 'Frozen baseline changed: ' + expected.path);
    files.push({ path: expected.path, sha256, bytes: bytes.length });
  }
  const actual = [];
  for (const prefix of ['', 'subjects', 'media-records', 'journey-records']) {
    for (const entry of await fs.readdir(path.join(directory, prefix))) {
      if (entry.endsWith('.json')) actual.push(path.join(prefix, entry));
    }
  }
  assert.deepEqual(
    actual.sort(),
    baseline.map((row) => row.path).sort(),
    'Delivery membership changed.',
  );
  if (name === 'all-chapters') {
    const before = JSON.stringify(createCanonicalCorpus());
    await compile({ directory, manifestDirectory });
    assert.equal(JSON.stringify(createCanonicalCorpus()), before);
    for (const expected of files) {
      const current = await fs.readFile(path.join(directory, expected.path));
      assert.equal(
        createHash('sha256').update(current).digest('hex'),
        expected.sha256,
        'Repeated compilation changed: ' + expected.path,
      );
    }
  }
  await fs.writeFile(
    path.join(reportDirectory, name + '-delivery-parity.json'),
    JSON.stringify(
      {
        result: 'pass',
        directory,
        exactDeliveryJSONFiles: files.length,
        freshCompilationRepeat: name === 'all-chapters',
        fullCorpusSHA256: files.find((row) => row.path === 'corpus.json')!.sha256,
        files,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    name + ': canonical delivery parity passed for ' + files.length + ' JSON files.',
  );
}

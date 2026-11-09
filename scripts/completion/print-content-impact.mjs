import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { createHash } from 'node:crypto';
const origin = process.env.ATLAS_URL;
if (!origin) throw Error('ATLAS_URL required');
const prior = await fs.readFile(
  process.env.ATLAS_BASELINE_CORPUS ??
    'output/completion-2026-11-04/corpus-before-glossary.json',
  'utf8',
);
const current = await fs.readFile('public/atlas/corpus.json', 'utf8');
const corpus = JSON.parse(current);
const jobs = [
  ...[...new Set(corpus.orientations?.map((r) => r.chapter) ?? [])].map((chapter) => [
    `regional-${chapter}`,
    `regional&pack=${chapter}`,
  ]),
  ...corpus.subjects.map((s) => [`reader-${s.id}`, `reader&subject=${s.id}`]),
  ...corpus.packs.map((p) => [`chapter-${p.id}`, `chapter&pack=${p.id}`]),
  ...corpus.journeys.map((j) => [`family-${j.id}`, `family&journey=${j.id}`]),
  ['world-overview', 'overview'],
  ['world-overview-notes', 'overview-notes'],
  ['chapter-spreads', 'chapter'],
  ['family-explorations', 'family'],
];
const out = process.env.ATLAS_REPORT_DIR ?? 'output/completion-2026-11-04/print-impact';
await fs.mkdir(out, { recursive: true });
const sha = (s) => createHash('sha256').update(s).digest('hex');
const browser = await chromium.launch();
const results = [];
// The current renderer resolves both corpora through the current print-media index.
// Track new derivative paths explicitly when a picture changed at the same reader URL.
const changedImages = (process.env.ATLAS_CHANGED_PRINT_IMAGES ?? '')
  .split(',')
  .filter(Boolean);
try {
  const page = await browser.newPage();
  let input = prior;
  await page.route('**/atlas/corpus.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: input }),
  );
  for (const [id, query] of jobs) {
    if (process.env.ATLAS_REBUILD_READERS === '1' && id.startsWith('reader-')) {
      results.push({
        id,
        changed: true,
        reason:
          'The reader print template now includes named claims, their locators and any uncertainty.',
      });
      continue;
    }
    const views = [];
    for (const bytes of [prior, current]) {
      input = bytes;
      await page.goto(`${origin}/?print=${query}`);
      await page.locator('.print-document').waitFor();
      await page.locator('main h1').first().waitFor();
      views.push(await page.locator('.print-document').innerHTML());
    }
    const changedAssets = changedImages.filter((path) => views[1].includes(path));
    const changed = views[0] !== views[1] || changedAssets.length > 0;
    if (changed) {
      await fs.writeFile(`${out}/${id}-before.html`, views[0]);
      await fs.writeFile(`${out}/${id}-after.html`, views[1]);
    }
    results.push({
      id,
      changed,
      changedAssets,
      before: sha(views[0]),
      after: sha(views[1]),
    });
  }
  const changed = results.filter((r) => r.changed).map((r) => r.id);
  await fs.writeFile(
    `${out}/receipt.json`,
    JSON.stringify(
      {
        scope:
          'Compares every catalogued browser print view against both corpus revisions with the same current renderer.',
        priorCorpusSHA256: sha(prior),
        currentCorpusSHA256: sha(current),
        jobs: results,
        regenerate: changed,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(JSON.stringify({ checked: results.length, regenerate: changed }));
} finally {
  await browser.close();
}

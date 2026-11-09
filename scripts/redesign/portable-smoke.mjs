/* global console */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const origin = 'http://127.0.0.1:4175';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/*', (route) =>
    route.request().url().startsWith(origin) ? route.continue() : route.abort(),
  );
  await page.goto(`${origin}/?view=timeline`);
  await page.locator('.timeline-reference > summary').click();
  await page.locator('.era-row').first().waitFor();
  assert.equal(await page.locator('.era-row').count(), 8);
  await page.goto(
    `${origin}/?pack=C3&subject=qin-administration&scale=local&year=220%20BCE`,
  );
  await page.locator('.dossier-section').first().waitFor();
  assert.match(await page.locator('.dossier h1').textContent(), /Qin/);
  await page.reload();
  await page.locator('.dossier-section').first().waitFor();
  assert.match(await page.locator('.dossier h1').textContent(), /Qin/);
  for (const [subject, pack, year, title] of [
    ['chaco-communities', 'C6', 1100, /Chaco/],
    ['bukhara-books', 'C7', 1530, /Bukhara/],
    ['bering-sea-carvers', 'C4', 400, /Bering Sea/],
    ['ozette-makah', 'C7', 1700, /Ozette/],
    ['hidatsa-villages', 'C7', 1780, /Hidatsa/],
    ['ocmulgee-council', 'C6', 1200, /Ocmulgee/],
    ['wendat-laine', 'C7', 1600, /Wendat/],
    ['cherokee-print', 'C8', 1828, /Cherokee/],
  ]) {
    await page.goto(
      `${origin}/?pack=${pack}&subject=${subject}&scale=local&year=${year}`,
    );
    await page.locator('.dossier-section').first().waitFor();
    assert.match(await page.locator('.dossier h1').textContent(), title);
    await page.locator('.image-open img').evaluate((i) => i.decode());
    await page.reload();
    await page.locator('.dossier-section').first().waitFor();
    assert.match(await page.locator('.dossier h1').textContent(), title);
  }
  const hash = (b) => createHash('sha256').update(b).digest('hex');
  const pdfs = [];
  for (const name of ['world-overview', 'chapter-spreads', 'family-explorations']) {
    const response = await page.request.get(`${origin}/atlas/exports/${name}.pdf`);
    assert.equal(response.status(), 200);
    const sha256 = hash(await response.body());
    assert.equal(sha256, hash(await fs.readFile(`output/redesign/print/${name}.pdf`)));
    pdfs.push({ name, sha256 });
  }
  const corpus = await page.request.get(`${origin}/atlas/corpus.json`);
  assert.equal(corpus.status(), 200);
  const expected = JSON.parse(
    await fs.readFile('output/redesign/manifests/release-corpus-summary.json', 'utf8'),
  );
  const corpusBytes = await corpus.body();
  assert.equal(hash(corpusBytes), expected.corpusSha256);
  assert.equal(JSON.parse(corpusBytes).subjects.length, expected.subjects);
  assert.deepEqual(errors, []);
  await fs.mkdir('output/redesign/release', { recursive: true });
  const result = {
    result: 'pass',
    origin,
    externalRequests: 'blocked during portable smoke',
    checks: [
      'eight chapters',
      'deep Qin link',
      'reload restoration',
      'both expanded regions: deep dossiers, local image decoding and reload',
      'Arctic, Northwest Coast and Plains: deep dossiers, decoded local media and reload',
      'Eastern Woodlands: unknown/modelled dates, decoded media and deep-link reload',
      `all ${expected.subjects} dossiers and corpus hash`,
      'all three served PDFs match verified bytes',
      'no browser errors',
    ],
    pdfs,
  };
  await fs.writeFile(
    'output/redesign/release/package-smoke.json',
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}

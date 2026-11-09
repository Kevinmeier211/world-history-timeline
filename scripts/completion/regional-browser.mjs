/* global document, innerWidth */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { createHash } from 'node:crypto';
const origin = process.env.ATLAS_URL;
const build = process.env.ATLAS_BUILD_ROOT;
if (!origin || !build) throw Error('ATLAS_URL and ATLAS_BUILD_ROOT required');
const bytes = await fs.readFile(`${build}/atlas/corpus.json`);
const corpus = JSON.parse(bytes);
const out =
  process.env.ATLAS_REPORT_DIR ?? 'output/completion-2026-11-04/regional-browser';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
const snapshotChecks = [];
let context;
try {
  context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: width === 390 ? 'dark' : 'light' });
    for (const chapter of [...new Set(corpus.orientations.map((r) => r.chapter))]) {
      let requests = 0;
      const count = (request) => {
        if (request.url().includes('/atlas/orientations.json')) requests++;
      };
      page.on('request', count);
      const rows = corpus.orientations.filter((r) => r.chapter === chapter);
      await page.goto(
        `${origin}/?view=timeline&scale=era&pack=${chapter}&year=${rows[0].snapshots[0].year}`,
      );
      await page.locator('.living-timeline').waitFor();
      assert.equal(requests, 0, 'Regional prose loaded before expansion');
      await page.locator('.timeline-reference > summary').click();
      await page.locator('.chapter-regional-reading > summary').click();
      await expect(page.getByLabel('Choose a regional setting')).toBeVisible();
      for (const reading of rows) {
        await page.getByLabel('Choose a regional setting').selectOption(reading.region);
        await expect(page.locator('.regional-reading h3')).toHaveText(reading.title);
        await expect(page.locator('.regional-reading')).toContainText(
          reading.summary.text,
        );
        await page.locator('.regional-evidence-question summary').click();
        await expect(
          page.locator('.regional-evidence-question details p'),
        ).toBeVisible();
        await expect(page.locator('.regional-evidence-question')).toContainText(
          reading.activity.response,
        );
        // The same details element retains its open state when changing readings.
        await page.locator('.regional-evidence-question summary').click();
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
          false,
        );
        const audit = await new AxeBuilder({ page })
          .include('.chapter-regional-reading')
          .analyze();
        assert.deepEqual(
          audit.violations.map((v) => v.id),
          [],
          `${reading.id}/${width}`,
        );
        results.push({
          id: reading.id,
          width,
          prose: 'pass',
          response: 'pass',
          overflow: 'pass',
          axe: 'pass',
        });
      }
      assert.equal(requests, 1, 'Expected one deduplicated prose request');
      if (chapter === 'C1')
        await page
          .locator('.chapter-regional-reading')
          .screenshot({ path: `${out}/chapter-${width}.png` });
      page.off('request', count);
    }
  }
  for (const reading of corpus.orientations) {
    for (const snap of reading.snapshots) {
      await page.goto(
        `${origin}/?view=world&scale=era&pack=${reading.chapter}&year=${snap.year}&region=${encodeURIComponent(reading.region)}`,
      );
      await expect(page.locator('.curated-snapshot-reading').first()).toContainText(
        snap.text,
      );
      snapshotChecks.push({ id: reading.id, region: reading.region, year: snap.year });
    }
  }
  let failSnapshot = true;
  await page.route('**/atlas/regional-snapshots.json', (route) =>
    failSnapshot ? route.abort() : route.continue(),
  );
  await page.goto(`${origin}/?view=world&scale=era&pack=C1&year=-2400&region=Europe`);
  await expect(
    page.getByRole('button', { name: 'Retry snapshot reading' }),
  ).toBeVisible();
  await expect(page.locator('.snapshot-orientation')).not.toContainText(
    'no researched regional frame',
  );
  failSnapshot = false;
  await page.getByRole('button', { name: 'Retry snapshot reading' }).click();
  await expect(page.locator('.curated-snapshot-reading')).toContainText('Orkney');
  await page.unroute('**/atlas/regional-snapshots.json');
  // Fresh document must display a retry affordance after a failed lazy request.
  let fail = true;
  await page.route('**/atlas/orientations.json', (route) =>
    fail ? route.abort() : route.continue(),
  );
  await page.goto(`${origin}/?view=timeline&scale=era&pack=C1&year=-2400`);
  await page.locator('.timeline-reference > summary').click();
  await page.locator('.chapter-regional-reading > summary').click();
  await expect(
    page.getByRole('button', { name: 'Try again', exact: true }),
  ).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.getByLabel('Choose a regional setting')).toBeVisible();
  await page.getByLabel('Choose a regional setting').focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByLabel('Choose a regional setting')).toBeFocused();
  await page.unroute('**/atlas/orientations.json');
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${out}/receipt.json`,
    JSON.stringify(
      {
        status: 'pass',
        corpusSHA256: createHash('sha256').update(bytes).digest('hex'),
        engine: await browser.version(),
        applicationAssets: await Promise.all(
          (await fs.readdir(`${build}/assets`))
            .filter((name) => /\.(js|css)$/.test(name))
            .map(async (name) => ({
              name,
              sha256: createHash('sha256')
                .update(await fs.readFile(`${build}/assets/${name}`))
                .digest('hex'),
            })),
        ),
        snapshotRetry: 'pass',
        results,
        snapshotChecks,
        snapshots: snapshotChecks.length,
        lazyRetry: 'pass',
        keyboardSelect: 'pass',
        runtimeErrors: errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `Regional browser: ${results.length} reading/viewport audits, ${snapshotChecks.length} snapshots, lazy loading/retry and keyboard passed.`,
  );
} finally {
  try {
    await context?.close();
  } finally {
    await browser.close();
  }
}

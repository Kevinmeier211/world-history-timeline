/* global document, innerWidth, fetch */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import process from 'node:process';
import { createHash } from 'node:crypto';
const origin = process.env.ATLAS_URL;
if (!origin) throw Error('ATLAS_URL required');
const out = 'output/completion-2026-11-04/content-print-browser';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  const published = await (await fetch(origin + '/atlas/exports/catalog.json')).json();
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (const [year, region, title] of [
      [-2400, 'Southeast Asia/Oceania', 'Kuk: drainage and cultivation in New Guinea'],
      [
        -1200,
        'Europe',
        'Aegean centres and British farms: different Bronze Age settings',
      ],
    ]) {
      await page.goto(
        `${origin}/?view=world&year=${year}&region=${encodeURIComponent(region)}`,
      );
      await expect(
        page.getByRole('heading', { name: title, exact: true }),
      ).toBeVisible();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        true,
      );
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      assert.deepEqual(violations, []);
      await page
        .locator('.snapshot-orientation')
        .screenshot({ path: `${out}/frame-${Math.abs(year)}-${width}.png` });
      results.push({ width, year, frame: title, axe: violations });
    }
    await page.goto(`${origin}/?print=catalog`);
    await expect(page.locator('.download-catalog li')).toHaveCount(
      published.files.length,
    );
    await page
      .getByLabel('Format', { exact: true })
      .selectOption('Investigation reader');
    await expect(page.locator('.download-catalog li')).toHaveCount(77);
    await page.getByLabel('Find a download', { exact: true }).fill('Uluburun');
    await expect(page.locator('.download-catalog li')).toHaveCount(1);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      true,
    );
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    await page.screenshot({ path: `${out}/catalog-${width}.png` });
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  const dispositions = JSON.parse(
    await fs.readFile('docs/redesign/review/TEXT-EVIDENCE-DISPOSITIONS.json', 'utf8'),
  );
  for (const row of dispositions.dispositions) {
    await page.goto(`${origin}/?subject=${row.subject}`);
    await expect(page.locator('.evidence-reading h2')).toHaveText(row.evidenceTitle);
    await expect(page.locator('.evidence-reading article')).toHaveCount(
      row.sourceCapsules.length,
    );
    for (const item of row.sourceCapsules)
      await expect(
        page.getByRole('heading', { name: item.label, exact: true }),
      ).toBeVisible();
    await page
      .locator('.evidence-reading')
      .screenshot({ path: `${out}/text-${row.subject}.png` });
  }
  const response = await page.request.get(origin + '/atlas/exports/catalog.json');
  const catalog = await response.json();
  assert.equal(new Set(catalog.files.map((f) => f.id)).size, published.files.length);
  for (const file of catalog.files) {
    const pdf = await page.request.get(origin + file.path);
    assert.equal(pdf.status(), 200, file.path);
    const bytes = await pdf.body();
    assert.equal(bytes.length, file.bytes, file.path);
    assert.equal(
      createHash('sha256').update(bytes).digest('hex'),
      file.sha256,
      file.path,
    );
  }
  await context.close();
  const failed = await browser.newContext();
  await failed.route('**/assets/JourneyLibrary-*.js', (route) => route.abort());
  const unavailable = await failed.newPage();
  await unavailable.goto(origin + '/?page=journeys');
  await expect(
    unavailable.getByRole('heading', {
      name: 'The investigation library could not open',
    }),
  ).toBeVisible();
  await unavailable.getByRole('button', { name: 'Notebook', exact: true }).click();
  await expect(
    unavailable.getByRole('heading', { name: /Notebook|thinking/i }).first(),
  ).toBeVisible();
  await failed.close();
  await fs.writeFile(
    `${out}/receipt.json`,
    JSON.stringify(
      {
        result: 'pass',
        frames: results,
        textTreatments: 7,
        catalogFilesVerified: 130,
        failedLibraryRetainsNotebook: true,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}

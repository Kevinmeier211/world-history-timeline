/* global localStorage */
import { chromium, firefox, webkit } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';
import { createHash } from 'node:crypto';
import console from 'node:console';
const root = process.env.ATLAS_URL;
if (!root) throw Error('ATLAS_URL required');
const engine = process.env.ATLAS_ENGINE ?? 'chromium';
if (!['chromium', 'firefox', 'webkit'].includes(engine))
  throw Error('Unknown managed engine');
const contracts = JSON.parse(
  await fs.readFile('src/atlas/chapter-learning.json', 'utf8'),
);
const fixtures = JSON.parse(
  await fs.readFile('docs/redesign/search-acceptance.json', 'utf8'),
);
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const out = process.env.ATLAS_OUTPUT_DIR ?? 'output/completion-2026-11-04';
await fs.mkdir(out, { recursive: true });
const browser = await { chromium, firefox, webkit }[engine].launch();
let context;
try {
  context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const [index, contract] of contracts.entries()) {
    await page.goto(root + '/?page=journeys');
    await page
      .getByRole('button', { name: 'Show all 8 short activities', exact: true })
      .click();
    await page
      .getByRole('button', { name: 'Open short activity', exact: true })
      .nth(index)
      .click();
    await expect(page.locator('.short-activity')).toBeVisible();
    await expect(page.locator('.short-activity')).toContainText(contract.shortOutcome);
    assert.equal(new URL(page.url()).searchParams.get('subject'), contract.subject);
    await page
      .getByRole('button', { name: 'Save my activity response', exact: true })
      .click();
    await page
      .locator('textarea[name=answer]')
      .fill(`Fictional ${contract.chapter} evidence response`);
    await page
      .getByRole('button', { name: 'Save on this device', exact: true })
      .click();
    await expect(page.locator('.save-dialog')).not.toBeVisible();
  }
  const notebook = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('chronos.household.v1')),
  );
  assert.equal(notebook.notes.length, 8);
  for (const contract of contracts)
    assert.ok(
      notebook.notes.some(
        (note) =>
          note.context.subject === contract.subject &&
          note.answer.includes(contract.chapter),
      ),
    );
  await page.goto(root + '/?page=journeys');
  await page
    .getByRole('searchbox', { name: 'Find an investigation' })
    .fill('zzunrepresentedzz');
  await expect(
    page.getByRole('status').filter({ hasText: '0 investigations match' }),
  ).toBeVisible();
  await expect(page.locator('.journey-grid').last().locator('article')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(page.locator('.journey-grid').last().locator('article')).toHaveCount(33);
  await page
    .getByRole('button', { name: 'Show all 8 short activities', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Follow the chapter route', exact: true })
    .nth(3)
    .click();
  await page.getByRole('button', { name: 'Next stop →', exact: true }).click();
  const expected = new URL(page.url()).searchParams;
  await page.goto(root + '/');
  await page
    .getByRole('button', { name: 'Continue previous reading', exact: true })
    .click();
  const resumed = new URL(page.url()).searchParams;
  for (const field of ['subject', 'journey', 'step', 'year'])
    assert.equal(resumed.get(field), expected.get(field));
  await page.getByRole('button', { name: 'Search the atlas', exact: true }).click();
  for (const fixture of fixtures) {
    await page.locator('#atlas-search').fill(fixture.query);
    if (fixture.subject) {
      const subject = corpus.subjects.find((s) => s.id === fixture.subject);
      // Relevant results beyond the first page remain discoverable.
      while (await page.getByRole('button', { name: /Show more subjects/ }).count())
        await page.getByRole('button', { name: /Show more subjects/ }).click();
      await expect(
        page
          .locator('.search-results button')
          .filter({ hasText: subject.name })
          .first(),
      ).toBeVisible();
    } else if (fixture.category === 'deliberate_coverage_gap') {
      await expect(page.locator('.search-results button')).toHaveCount(0);
      await expect(page.locator('.search-dialog')).toContainText(
        'No match in the current selection',
      );
    } else if (fixture.year === null)
      await expect(page.locator('.year-hit')).toHaveCount(0);
    else await expect(page.locator('.year-hit')).toBeVisible();
  }
  await page.getByRole('button', { name: 'Close search', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Search the atlas', exact: true }),
  ).toBeFocused();
  const downloads = JSON.parse(
    await fs.readFile('src/atlas/short-print-index.json', 'utf8'),
  );
  for (const file of downloads) {
    const response = await page.request.get(root + file.path);
    assert.equal(response.status(), 200);
    const bytes = await response.body();
    assert.equal(bytes.length, file.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
  }
  await fs.writeFile(
    `${out}/learning-browser-${engine}.json`,
    JSON.stringify(
      {
        result: 'pass',
        engine,
        version: browser.version(),
        activities: 8,
        activityPDFsVerified: 8,
        savedResponses: 8,
        searchQueries: fixtures.length,
        journeyResume: true,
        filters: true,
        searchFocusReturn: true,
      },
      null,
      2,
    ),
  );
  console.log(engine + ': activities, save, resume, filters and 40 searches passed');
} finally {
  try {
    await context?.close();
  } finally {
    await browser.close();
  }
}

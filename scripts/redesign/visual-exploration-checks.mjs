/* global document, window, console */
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';

const root = process.env.ATLAS_URL;
if (!root) throw Error('Set ATLAS_URL to the local preview.');
const out = `${process.env.ATLAS_REPORT_DIR}/visual-exploration`;
await fs.mkdir(out, { recursive: true });
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const browser = await chromium.launch();
const results = [];
const loadingOnly = process.argv.includes('--loading-only');
try {
  for (const width of loadingOnly ? [] : [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const external = [],
      errors = [];
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === new URL(root).origin)
        return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    async function check(name) {
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth + 1,
          ),
        )
        .toBe(true);
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      await fs.writeFile(
        `${out}/axe-${width}-${name}.json`,
        JSON.stringify(violations, null, 2),
      );
      assert.deepEqual(
        violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        [],
        `${width}/${name}`,
      );
    }
    await page.goto(`${root}/?view=stories`);
    await expect(page.locator('.story-gallery')).toBeVisible();
    await expect(page.locator('.chronology-overview')).toHaveCount(0);
    await page.locator('.story-feature img').evaluate((image) => image.decode());
    await page.evaluate(() => document.fonts.ready);
    const image = await page.locator('.story-feature img').boundingBox();
    assert.ok(
      image.y < 850,
      `${width}: real historical image is visible on the first screen`,
    );
    await check('entrance');
    await page.screenshot({ path: `${out}/entrance-${width}.png`, fullPage: false });
    await page.locator('.story-shelf').scrollIntoViewIfNeeded();
    await page
      .locator('.story-card img')
      .evaluateAll((images) =>
        Promise.all(images.slice(0, 3).map((image) => image.decode())),
      );
    await page.screenshot({ path: `${out}/objects-${width}.png` });
    await page.locator('.story-feature .story-image-credit > summary').click();
    await expect(page.locator('.story-feature .story-image-credit')).toContainText(
      'The Metropolitan Museum of Art',
    );
    await page.getByRole('button', { name: 'Read this story →', exact: true }).click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await expect(page.locator('.dossier h1')).toBeFocused();
    assert.equal(new URL(page.url()).searchParams.get('object'), 'met-317600');
    await expect(page.locator('.dossier-opening .object-figure')).toBeVisible();
    await check('story');
    await page.screenshot({ path: `${out}/story-${width}.png` });
    await page.locator('.dossier .image-open').click();
    await expect(page.locator('.inspection[open]')).toBeVisible();
    await expect(page.locator('.inspection')).toContainText('Temple Model');
    await page.keyboard.press('Escape');
    await expect(page.locator('.dossier .image-open')).toBeFocused();
    await page.getByRole('button', { name: '← Back to atlas', exact: true }).click();
    await expect(page.locator('.story-directory > summary')).toContainText('77');
    await page.getByRole('button', { name: 'Read this story →', exact: true }).click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await page
      .getByRole('button', { name: 'Show in world context', exact: true })
      .click();
    await expect(page.locator('[data-context-title]')).toBeFocused();
    const contextPanel = page.locator('.atlas-layout > .dossier + .dossier-context');
    await expect(contextPanel).toHaveJSProperty('open', true);
    await expect(
      contextPanel.locator(':scope > .atlas-context .meanwhile-view'),
    ).toBeVisible();
    await check('context');
    await page.screenshot({ path: `${out}/context-${width}.png` });
    await page.goto(`${root}/?view=stories&pack=C2&scale=era&year=-1320`);
    await expect(page.locator('.story-gallery')).toBeVisible();
    await page.locator('.story-directory > summary').click();
    assert.equal(
      await page.locator('.story-directory button').count(),
      corpus.subjects.filter((s) => s.packs.includes('C2')).length,
    );
    await page
      .locator('.story-directory button')
      .filter({ hasText: 'Uluburun' })
      .click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    const positions = await page.locator('.dossier').evaluate((dossier) => {
      const lead = dossier.querySelector('.lead');
      const section = dossier.querySelector('.dossier-section > p');
      const diagram = dossier.querySelector('.object-figure');
      return {
        lead: lead.getBoundingClientRect().top,
        section: section.getBoundingClientRect().top,
        diagram: diagram.getBoundingClientRect().top,
      };
    });
    assert.ok(
      positions.lead < positions.diagram && positions.section < positions.diagram,
      'The actual account comes before the diagram.',
    );
    const diagramHeight = await page
      .locator('.object-figure .image-open img')
      .evaluate((image) => image.getBoundingClientRect().height);
    assert.ok(
      diagramHeight <= 341,
      'Diagram preview remains bounded; full image opens in inspection.',
    );
    await check('diagram-story');
    await page.screenshot({ path: `${out}/uluburun-${width}.png` });
    await page.getByRole('button', { name: 'Living timeline', exact: true }).click();
    await page.locator('.explore-refine > summary').click();
    await page.getByRole('button', { name: 'Full history', exact: true }).click();
    await page.locator('.timeline-reference > summary').click();
    await expect(page.locator('.era-row')).toHaveCount(8);
    await page.getByRole('button', { name: 'Stories & objects', exact: true }).click();
    await expect(page.locator('.story-gallery')).toBeVisible();
    await page.locator('.explore-refine > summary').click();
    await page.getByLabel('Region', { exact: true }).selectOption('Africa');
    await expect(page.locator('.story-gallery-intro')).toContainText('Africa');
    await page.locator('.story-directory > summary').click();
    const names = await page
      .locator('.story-directory button strong')
      .allTextContents();
    assert.deepEqual(
      names,
      corpus.subjects.filter((s) => s.region === 'Africa').map((s) => s.name),
    );
    await page.goto(`${root}/?view=stories&pack=C8&scale=era`);
    await page.locator('.story-gallery').waitFor();
    await page
      .getByRole('button', { name: 'Use dark appearance', exact: true })
      .click();
    await check('dark');
    await page.screenshot({ path: `${out}/dark-${width}.png` });
    assert.deepEqual(external, []);
    assert.deepEqual(errors, []);
    results.push({
      width,
      result: 'pass',
      firstImageY: image.y,
      directoryAndNavigation: true,
      sourcesAndInspection: true,
      keyboardFocus: true,
      diagramAfterReading: true,
      accessibilityViolations: 0,
      externalRequests: external,
      runtimeErrors: errors,
    });
    await context.close();
  }
  // A failed thumbnail must leave the story reachable and the underlying reading intact.
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.route('**/317600-thumb.webp', (route) =>
    route.fulfill({ status: 503, body: 'unavailable' }),
  );
  await page.goto(`${root}/?view=stories`);
  await expect(page.locator('.story-feature .image-error')).toBeVisible();
  await page.getByRole('button', { name: 'Read this story →', exact: true }).click();
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await expect(page.locator('.dossier h1')).toHaveText('Colima architectural models');
  results.push({
    scenario: 'thumbnail failure',
    result: 'pass',
    storyStillReachable: true,
  });
  await context.close();
  const delayed = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const delayedPage = await delayed.newPage();
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await delayedPage.route('**/atlas/subjects/uluburun.json', async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await delayedPage.goto(`${root}/?subject=uluburun&pack=C2&scale=local&year=-1320`);
    await expect(delayedPage.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'false',
    );
    await expect(delayedPage.locator('.object-figure')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    await delayedPage.locator('.image-open').click();
    await expect(delayedPage.locator('.inspection[open]')).toBeVisible();
    release();
    await expect(delayedPage.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'true',
    );
    await expect(delayedPage.locator('.inspection[open]')).toBeVisible();
    await delayedPage.keyboard.press('Escape');
    await expect(delayedPage.locator('.image-open')).toBeFocused();
    results.push({
      scenario: 'delayed diagram reading',
      result: 'pass',
      inspectionSurvivesReadingArrival: true,
    });
  } finally {
    release();
    await delayed.close();
  }
  await fs.writeFile(
    `${out}/${loadingOnly ? 'loading-results' : 'results'}.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}

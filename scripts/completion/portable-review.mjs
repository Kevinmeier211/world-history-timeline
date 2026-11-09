/* global localStorage */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';
import { createHash } from 'node:crypto';
const [origin, folder] = process.argv.slice(2);
if (!origin || !folder) throw Error('Pass extracted origin and directory');
const state = JSON.parse(await fs.readFile(folder + '/SOURCE_STATE.json', 'utf8'));
const browser = await chromium.launch();
let context;
try {
  context = await browser.newContext();
  const external = [];
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === origin) return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(origin + '/?subject=eastern-han&pack=C4&year=200');
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await page.getByRole('button', { name: 'Save a question', exact: true }).click();
  await page.locator('textarea[name=answer]').fill('Offline package response');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.locator('.save-dialog')).not.toBeVisible();
  await page.reload();
  assert.equal(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('chronos.household.v1')).notes[0].answer,
    ),
    'Offline package response',
  );
  for (const subject of [
    'uluburun',
    'nalanda',
    'mali-networks',
    'portuguese-voyage',
    'haitian-revolution',
    'tomioka',
  ]) {
    await page.goto(origin + '/?subject=' + subject);
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  }
  await page.getByRole('button', { name: 'Search the atlas', exact: true }).click();
  await page.getByRole('searchbox').fill('Qin');
  await page.locator('.search-results button').first().click();
  await expect(page.locator('.dossier h1')).toContainText('Qin');
  await page.goto(origin + '/?view=world&year=-2400&region=Southeast%20Asia%2FOceania');
  await expect(
    page.getByRole('heading', {
      name: 'Kuk: drainage and cultivation in New Guinea',
      exact: true,
    }),
  ).toBeVisible();
  await page.goto(origin + '/?page=journeys');
  await expect(
    page.getByRole('button', { name: 'Open short activity', exact: true }),
  ).toHaveCount(3);
  const themeGuides = JSON.parse(
    await fs.readFile('src/atlas/learning-themes.json', 'utf8'),
  );
  const dossierIndex = new Map(
    JSON.parse(
      await fs.readFile(folder + '/site/atlas/corpus.json', 'utf8'),
    ).subjects.map((s) => [s.id, s]),
  );
  for (const theme of themeGuides) {
    await page.getByRole('combobox', { name: /^Theme\b/ }).selectOption(theme.id);
    const guide = page.getByRole('region', { name: 'Three-stop theme reading' });
    await expect(guide.getByRole('link')).toHaveCount(3);
    for (const stop of theme.stops) {
      const dossier = dossierIndex.get(stop.subject);
      assert.ok(
        dossier.sections.some(
          (section) =>
            section.title === stop.section &&
            section.citations.some((c) => c.source === stop.source),
        ),
      );
      const href = await guide
        .getByRole('link', { name: dossier.name, exact: true })
        .getAttribute('href');
      const destination = new URL(href, origin);
      assert.equal(destination.origin, origin);
      assert.equal(destination.searchParams.get('subject'), stop.subject);
      assert.equal(destination.searchParams.get('jtheme'), theme.id);
      const returnTo = new URL(destination.searchParams.get('return'), origin);
      assert.equal(returnTo.origin, origin);
      assert.equal(returnTo.searchParams.get('page'), 'journeys');
      assert.equal(returnTo.searchParams.get('jtheme'), theme.id);
      await expect(guide).toContainText(stop.prompt);
    }
  }
  const lastStop = themeGuides.at(-1).stops.at(-1);
  await page
    .getByRole('region', { name: 'Three-stop theme reading' })
    .getByRole('link')
    .last()
    .click();
  await expect(page.locator('.dossier h1')).toHaveText(
    dossierIndex.get(lastStop.subject).name,
  );
  await page.goto(
    origin + '/?view=world&scale=era&pack=C8&year=2000&region=South%20Asia',
  );
  await expect(page.locator('.curated-snapshot-reading')).toContainText('Jharkhand');
  await page.goto(origin + '/?print=catalog');
  await expect(page.locator('.download-catalog li')).toHaveCount(
    Object.keys(state.siteFiles).filter(
      (path) => path.startsWith('atlas/exports/') && path.endsWith('.pdf'),
    ).length,
  );
  for (const [path, digest] of Object.entries(state.siteFiles).filter(
    ([path]) => path.endsWith('.pdf') || path.startsWith('atlas/subjects/'),
  )) {
    const response = await page.request.get(origin + '/' + path);
    assert.equal(response.status(), 200, path);
    assert.equal(
      createHash('sha256')
        .update(await response.body())
        .digest('hex'),
      digest,
      path,
    );
  }
  assert.deepEqual(external, []);
  assert.deepEqual(errors, []);
  await fs.writeFile(
    'output/completion-2026-11-04/portable/browser.json',
    JSON.stringify(
      {
        result: 'pass',
        externalRequests: external,
        pageErrors: errors,
        notebookReload: true,
        themeGuideStops: themeGuides.flatMap((t) => t.stops).length,
        offlineSearchAndRegionalExploration: true,
        lazyJourneyLibraryAndDownloadCatalog: true,
        allDossierAndPDFBytesVerified: true,
      },
      null,
      2,
    ),
  );
} finally {
  try {
    await context?.close();
  } finally {
    await browser.close();
  }
}

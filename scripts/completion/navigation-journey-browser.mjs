/* global document, localStorage, innerWidth */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { expect } from '@playwright/test';

const origin = process.env.ATLAS_URL;
assert(origin && new URL(origin).hostname === '127.0.0.1', 'Local ATLAS_URL required');
const engine = process.env.ATLAS_ENGINE ?? 'chromium';
const out =
  process.env.ATLAS_OUTPUT_DIR ??
  'output/navigation-accessibility-2026-11-05/journeys-time';
await fs.mkdir(out, { recursive: true });
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const browser = await { chromium, firefox, webkit }[engine].launch();
const checks = [];
let context;
try {
  context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  for (const view of ['timeline', 'world']) {
    await page.goto(origin + '/?view=' + view + '&scale=era&pack=C4&year=200+CE');
    const slider = page.getByRole('slider', { name: 'Move through time' });
    await expect(slider).toHaveValue('200');
    const committed = page.url();
    await slider.focus();
    await slider.press('ArrowRight');
    await expect(slider).toHaveValue('201');
    await expect(
      page.getByRole('button', { name: 'Explore 201 CE', exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByRole('status').filter({ hasText: 'Previewing 201 CE' }),
    ).toBeVisible();
    assert.equal(page.url(), committed);
    if (view === 'world') {
      await expect(
        page.getByRole('heading', { name: 'Meanwhile, around 201 CE…', exact: true }),
      ).toBeVisible();
    }
    await page.getByRole('button', { name: 'Explore 201 CE', exact: true }).click();
    await expect(page).toHaveURL(/year=201\+CE/);
    await page.goBack();
    await expect(slider).toHaveValue('200');
    await page.goForward();
    await expect(slider).toHaveValue('201');
    await page.getByText('More date controls', { exact: true }).click();
    const year = page.getByRole('textbox', { name: 'Go to year', exact: true });
    await year.fill('0');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('There is no year zero');
    await expect(page).toHaveURL(/year=201\+CE/);
    await year.fill('1 BCE');
    await page.getByRole('button', { name: 'Go', exact: true }).click();
    await expect(page).toHaveURL(/year=1\+BCE/);
    await page.getByText('More date controls', { exact: true }).click();
    await page.getByRole('button', { name: 'Next year', exact: true }).click();
    await expect(page).toHaveURL(/year=1\+CE/);
    await page.getByText('More date controls', { exact: true }).click();
    await page.getByRole('button', { name: 'Previous year', exact: true }).click();
    await expect(page).toHaveURL(/year=1\+BCE/);
    await expect(
      page.getByRole('button', { name: 'Full history', exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Full history', exact: true }).click();
    await expect(page).toHaveURL(/scale=world/);
    await expect(page.getByRole('slider')).toHaveAttribute('min', '-3299');
    await expect(page.getByRole('slider')).toHaveAttribute('max', '2000');
    checks.push(
      view +
        ': preview, explicit commit, Back/Forward, direct year, year-zero rejection, BCE/CE and full history',
    );
  }

  await page.goto(origin + '/?page=journeys');
  await expect(
    page.getByRole('button', { name: 'Open short activity', exact: true }),
  ).toHaveCount(3);
  const cards = page.locator('.journeys-page .journey-grid').last().locator('article');
  await expect(cards).toHaveCount(33);
  await page
    .getByRole('combobox', { name: 'Reading track', exact: true })
    .selectOption('family');
  await expect(page).toHaveURL(/jtrack=family/);
  await expect(cards).toHaveCount(33);
  await expect(
    page.getByRole('link', { name: 'Family source activity PDF', exact: true }),
  ).toHaveCount(33);
  await page
    .getByRole('combobox', { name: 'Period / chapter', exact: true })
    .selectOption('C1');
  await expect(page).toHaveURL(/jchapter=C1/);
  await page
    .getByRole('combobox', { name: 'Suggested full-route time', exact: true })
    .selectOption('40');
  await page
    .getByRole('combobox', { name: 'Region at any stop', exact: true })
    .selectOption('South Asia');
  const search = page.getByRole('searchbox', {
    name: 'Find an investigation',
    exact: true,
  });
  await search.fill('work');
  await expect(search).toBeFocused();
  const chosen = page.url();
  await page.reload();
  await expect(search).toHaveValue('work');
  await expect(page.getByRole('combobox', { name: 'Reading track' })).toHaveValue(
    'family',
  );
  await expect(page.getByRole('combobox', { name: 'Period / chapter' })).toHaveValue(
    'C1',
  );
  await expect(
    page.getByRole('combobox', { name: 'Suggested full-route time' }),
  ).toHaveValue('40');
  await expect(page.getByRole('combobox', { name: 'Region at any stop' })).toHaveValue(
    'South Asia',
  );
  const expected = corpus.journeys.filter((journey) => {
    const stops = journey.stops.map((stop) =>
      corpus.subjects.find((s) => s.id === stop.subject),
    );
    return (
      (journey.title + ' ' + journey.question + ' ' + journey.introduction)
        .toLowerCase()
        .includes('work') &&
      stops.some((s) => s.packs.includes('C1')) &&
      stops.some((s) => s.region === 'South Asia') &&
      Math.max(...journey.duration.match(/\d+/g).map(Number)) <= 40 &&
      journey.familyEvidence
    );
  });
  assert.ok(expected.length > 0);
  await expect(cards).toHaveCount(expected.length);
  await expect(cards.locator('h2')).toHaveText(expected.map((j) => j.title));
  await cards
    .first()
    .getByRole('button', { name: 'Begin investigation →', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Next stop →', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Next stop →', exact: true }).click();
  const saved = new URL(page.url()).searchParams;
  await page.getByRole('button', { name: 'Journeys', exact: true }).click();
  await expect(search).toHaveValue('work');
  await expect(page.getByRole('combobox', { name: 'Reading track' })).toHaveValue(
    'family',
  );
  await page.getByRole('button', { name: /Continue at stop 2 of/ }).click();
  for (const key of ['journey', 'step', 'subject', 'year']) {
    assert.equal(new URL(page.url()).searchParams.get(key), saved.get(key));
  }
  await page.getByRole('button', { name: 'Journeys', exact: true }).click();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(cards).toHaveCount(33);
  await page.goBack();
  await expect(search).toHaveValue('work');
  await page.goForward();
  await expect(search).toHaveValue('');
  await page
    .getByRole('combobox', { name: 'Theme', exact: true })
    .selectOption('THEME01');
  await expect(cards).toHaveCount(3);
  const themeLink = page
    .getByRole('region', { name: 'Three-stop theme reading' })
    .getByRole('link')
    .first();
  await themeLink.click();
  await expect(page).toHaveURL(/jtheme=THEME01/);
  await page.goBack();
  await expect(page.getByRole('combobox', { name: 'Theme', exact: true })).toHaveValue(
    'THEME01',
  );
  await page
    .getByRole('button', { name: 'Reset reading position', exact: true })
    .click();
  assert.equal(await page.evaluate(() => localStorage.getItem('chronos.resume')), null);
  await expect(
    page.getByRole('button', { name: 'Continue previous reading', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await search.fill('zzunrepresentedzz');
  await expect(cards).toHaveCount(0);
  await expect(page.getByText(/No investigation matches these choices/)).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(cards).toHaveCount(33);
  await page
    .locator('.journey-filters')
    .screenshot({ path: out + '/library-phone.png' });
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
    false,
  );
  checks.push(
    'library: three starters, actual combined filters, both tracks, reload, route entry, saved stop, Back/Forward, theme link, reset and empty-result recovery',
  );
  assert.deepEqual(failures, []);
  await fs.writeFile(
    out + '/result.json',
    JSON.stringify(
      {
        result: 'pass',
        date: '2026-11-05',
        engine: 'Playwright-managed ' + engine,
        version: browser.version(),
        viewport: { width: 390, height: 844 },
        checks,
        selectedFilterURL: chosen,
      },
      null,
      2,
    ) + '\n',
  );
  console.log('U02/L04 browser flows passed.');
} finally {
  await context?.close();
  await browser.close();
}

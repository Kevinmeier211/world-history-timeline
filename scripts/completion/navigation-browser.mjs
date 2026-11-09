/* global window */
import { chromium, firefox, webkit } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
const origin = process.env.ATLAS_URL;
assert.ok(origin);
const engine = process.env.ATLAS_ENGINE ?? 'chromium';
assert(['chromium', 'firefox', 'webkit'].includes(engine));
const out =
  process.env.ATLAS_OUTPUT_DIR ??
  'output/navigation-accessibility-2026-11-05/navigation';
await fs.mkdir(out, { recursive: true });
const startedAt = new Date().toISOString();
const startedMs = Date.now();
const eventLimit = 500;
const errorLimit = 50;
const results = [];
const errors = [];
const pageErrorDetails = [];
const events = [];
const cleanupErrors = [];
const counts = {
  jsonRequests: 0,
  jsonResponses: 0,
  failedJsonRequests: 0,
  navigations: 0,
  pageErrors: 0,
};
const requestIds = new WeakMap();
let droppedEvents = 0;
let checkpoint = 'launch browser';
let browser;
let version = null;
let context;
let page;
let failure = null;
const baseOrigin = new URL(origin).origin;
const short = (value, limit = 4000) => String(value ?? '').slice(0, limit);
const location = () => (page ? short(page.url(), 2000) : null);
function event(type, detail = {}) {
  const entry = {
    type,
    elapsedMs: Date.now() - startedMs,
    checkpoint,
    pageURL: location(),
    ...detail,
  };
  if (events.length < eventLimit) events.push(entry);
  else droppedEvents++;
  return entry;
}
function errorDetail(error) {
  return {
    name: short(error?.name ?? 'Error', 100),
    message: short(error?.message ?? error),
    stack: short(error?.stack, 8000),
  };
}
function jsonRequest(request) {
  const url = new URL(request.url());
  return url.origin === baseOrigin && url.pathname.endsWith('.json');
}
function requestId(request) {
  if (!requestIds.has(request)) requestIds.set(request, counts.jsonRequests + 1);
  return requestIds.get(request);
}
function complete(label) {
  results.push(label);
  event('checkpoint-complete', { label });
}
try {
  browser = await { chromium, firefox, webkit }[engine].launch();
  version = browser.version();
  context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  page = await context.newPage();
  page.on('pageerror', (error) => {
    counts.pageErrors++;
    const detail = event('pageerror', errorDetail(error));
    if (errors.length < errorLimit) {
      errors.push(short(error.message));
      pageErrorDetails.push(detail);
    }
  });
  page.on('framenavigated', (frame) => {
    if (frame !== page.mainFrame()) return;
    counts.navigations++;
    event('navigation', { url: short(frame.url(), 2000) });
  });
  page.on('request', (request) => {
    if (!jsonRequest(request)) return;
    const id = requestId(request);
    counts.jsonRequests++;
    event('json-request', {
      requestId: id,
      url: short(request.url(), 2000),
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const request = response.request();
    if (!jsonRequest(request)) return;
    counts.jsonResponses++;
    const headers = response.headers();
    event('json-response', {
      requestId: requestId(request),
      url: short(response.url(), 2000),
      status: response.status(),
      headers: Object.fromEntries(
        [
          'content-type',
          'content-length',
          'content-encoding',
          'access-control-allow-origin',
          'vary',
          'cache-control',
        ]
          .filter((name) => name in headers)
          .map((name) => [name, short(headers[name], 1000)]),
      ),
    });
  });
  page.on('requestfailed', (request) => {
    if (!jsonRequest(request)) return;
    counts.failedJsonRequests++;
    event('json-requestfailed', {
      requestId: requestId(request),
      url: short(request.url(), 2000),
      error: short(request.failure()?.errorText, 1500),
    });
  });
  checkpoint = 'initial subject and comparison return';
  await page.goto(origin + '/?subject=eastern-han&pack=C4&year=200');
  await expect(page.locator('.dossier')).toHaveAttribute('data-reading-ready', 'true');
  await expect(page.locator('[data-reading-title]')).toBeFocused();
  await expect(page).toHaveTitle('Eastern Han · Chronos Atlas');
  const compare = page.getByRole('button', {
    name: 'Compare two subjects',
    exact: true,
  });
  await compare.focus();
  const before = await page.evaluate(() => window.scrollY);
  await compare.click();
  await expect(page.locator('.comparison h1')).toBeFocused();
  await expect(page).toHaveTitle(/Eastern Han and .+ · Comparison · Chronos Atlas/);
  await page.getByRole('button', { name: '← Return to subject', exact: true }).click();
  await expect(compare).toBeFocused();
  await expect(page).toHaveTitle('Eastern Han · Chronos Atlas');
  assert.ok(Math.abs((await page.evaluate(() => window.scrollY)) - before) < 3);
  complete('comparison returns to keyboard origin and scroll');
  checkpoint = 'repeated history-entry positions';
  await page.evaluate(() => window.scrollTo(0, 900));
  const secondVisit = await page.evaluate(() => window.scrollY);
  await compare.evaluate((button) => button.click());
  await expect(page.locator('.comparison h1')).toBeFocused();
  await page.goBack();
  await expect(compare).toBeFocused();
  assert.ok(Math.abs((await page.evaluate(() => window.scrollY)) - secondVisit) < 3);
  await page.goBack();
  await expect(
    page.getByRole('button', { name: '← Return to subject', exact: true }),
  ).toBeFocused();
  await page.goBack();
  await expect(compare).toBeFocused();
  assert.ok(Math.abs((await page.evaluate(() => window.scrollY)) - before) < 3);
  complete('repeated URLs retain separate history entry positions');

  checkpoint = 'source reading Back and Forward';
  const source = page.locator('.dossier-top button').filter({ hasText: 'Sources' });
  await source.click();
  await expect(page.locator('[data-evidence-title]')).toBeFocused();
  await expect(page).toHaveTitle('Eastern Han · Sources · Chronos Atlas');
  const copy = page.url();
  await page.goBack();
  await expect(source).toBeFocused();
  await page.goForward();
  await expect(page.locator('[data-evidence-title]')).toBeFocused();
  complete('Back and Forward restore distinct reading entries');
  checkpoint = 'copied evidence URL';
  await page.goto(copy);
  await expect(page.locator('[data-evidence-title]')).toBeFocused();
  complete('copied evidence URL retains date and reading destination');

  checkpoint = 'history disclosure and keyboard origin';
  await page.locator('.family-start > summary').click();
  const save = page.getByRole('button', {
    name: 'Save my activity response',
    exact: true,
  });
  await save.focus();
  await compare.evaluate((button) => button.click());
  await expect(page.locator('.comparison h1')).toBeFocused();
  await page.goBack();
  await expect(save).toBeFocused();
  await expect(page.locator('.family-start')).toHaveAttribute('open', '');
  complete('history reopens a disclosure containing the saved keyboard origin');

  checkpoint = 'glossary dismissal';
  const definition = page.locator('.glossary-trigger').first();
  if (await definition.count()) {
    await definition.click();
    await page.keyboard.press('Escape');
    await expect(definition).toBeFocused();
    complete('glossary closes to its text trigger');
  }
  checkpoint = 'search selection focus';
  await page.getByRole('button', { name: 'Search the atlas', exact: true }).click();
  await page.getByRole('searchbox').fill('Qin');
  await page.locator('.search-results button').first().click();
  await expect(page.locator('[data-reading-title]')).toBeFocused();
  await expect(page.locator('[data-reading-title]')).toContainText('Qin');
  complete('search transfers focus from dialog to selected reading');

  checkpoint = 'missing subject recovery';
  await page.goto(origin + '/?subject=removed-case&year=200');
  await expect(
    page.getByRole('heading', { name: 'This saved subject has changed' }),
  ).toBeFocused();
  complete('missing subject has an explained recovery destination');
  checkpoint = 'missing image explanation';
  await page.goto(origin + '/?subject=eastern-han&object=removed-photo&year=200');
  await expect(
    page.getByRole('status').filter({ hasText: 'image in this saved link' }),
  ).toBeVisible();
  complete('missing image identifier is explained');
  checkpoint = 'missing investigation recovery';
  await page.goto(origin + '/?journey=removed-journey&year=200');
  await expect(
    page.getByRole('heading', { name: 'This saved investigation is unavailable' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open investigations', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Follow a good question.' }),
  ).toBeFocused();
  complete('missing investigation offers keyboard recovery');
  checkpoint = 'legacy link replacement';
  const legacyTargets = JSON.parse(
    await fs.readFile('src/atlas/legacy-targets.json', 'utf8'),
  );
  const [legacyId, replacement] = Object.entries(legacyTargets)[0];
  await page.goto(origin + '/#sel=' + legacyId + '&y=200');
  await expect(page.locator('.dossier')).toHaveAttribute('data-reading-ready', 'true');
  assert.equal(new URL(page.url()).searchParams.get('subject'), replacement.target);
  await expect(page.locator('[data-reading-title]')).toBeFocused();
  complete('legacy hash link resolves through its documented replacement');

  checkpoint = 'question draft during browser history';
  await page.goto(origin + '/?subject=eastern-han&year=200');
  await expect(page.locator('.dossier')).toHaveAttribute('data-reading-ready', 'true');
  await page.locator('.dossier-top button').filter({ hasText: 'Sources' }).click();
  await page
    .getByRole('button', { name: 'Save a question', exact: true })
    .first()
    .click();
  await expect(page.locator('dialog[open]')).toBeVisible();
  const textarea = page.locator('dialog[open] textarea').first();
  await textarea.fill('A question retained during browser navigation.');
  await page.goBack();
  await expect(textarea).toHaveValue('A question retained during browser navigation.');
  await expect(page.locator('dialog[open]')).toBeVisible();
  complete('browser history retains an open question draft');
  assert.deepEqual(errors, []);
} catch (error) {
  failure = event('failure', errorDetail(error));
} finally {
  checkpoint = 'owned browser cleanup';
  try {
    try {
      await context?.close();
    } catch (error) {
      cleanupErrors.push(event('context-close-failure', errorDetail(error)));
    }
  } finally {
    try {
      await browser?.close();
    } catch (error) {
      cleanupErrors.push(event('browser-close-failure', errorDetail(error)));
    } finally {
      const passed = !failure && !cleanupErrors.length && counts.pageErrors === 0;
      await fs.writeFile(
        out + '/' + engine + '.json',
        JSON.stringify(
          {
            engine,
            version,
            result: passed ? 'pass' : 'fail',
            checks: results,
            pageErrors: errors,
            pageErrorDetails,
            failure,
            cleanupErrors,
            startedAt,
            finishedAt: new Date().toISOString(),
            counts,
            events,
            eventLimit,
            droppedEvents,
            droppedPageErrorDetails: Math.max(0, counts.pageErrors - errorLimit),
            diagnosticScope:
              'Bounded timing, checkpoint, URL, response-header and error metadata only; no response bodies, browser storage or notebook contents are read.',
          },
          null,
          2,
        ) + '\n',
      );
      if (passed) console.log(engine, results.length, 'navigation checks passed');
      else {
        process.exitCode = 1;
        console.error(
          engine,
          'navigation checks failed; receipt preserved at',
          out + '/' + engine + '.json',
        );
      }
    }
  }
}

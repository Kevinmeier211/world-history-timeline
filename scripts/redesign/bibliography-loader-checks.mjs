/* global window, localStorage */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
expect.configure({ timeout: 20000 });
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report)
  throw Error('Use an isolated candidate preview and report directory.');
const out = `${report}/bibliography-loader`;
await fs.mkdir(out, { recursive: true });
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const records = JSON.parse(
  await fs.readFile('public/atlas/source-records.json', 'utf8'),
);
const tang = corpus.subjects.find((subject) => subject.id === 'tang-city');
const tangSource = corpus.sources.find(
  (source) => source.id === tang.sections[0].citations[0].source,
);
const browser = await chromium.launch();
const results = [];

function citedSource(subjectId) {
  const subject = corpus.subjects.find((item) => item.id === subjectId);
  const sourceId = subject.sections.find((section) => section.citations.length)
    .citations[0].source;
  return corpus.sources.find((source) => source.id === sourceId);
}
function fulfill(route, body, status = 200) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: payload,
  });
}

async function openPage(width) {
  const context = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 900 },
  });
  const page = await context.newPage();
  const errors = [];
  await page.addInitScript(() => {
    window.__unhandled = [];
    window.addEventListener('unhandledrejection', (event) => {
      window.__unhandled.push(String(event.reason?.message || event.reason));
    });
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.setDefaultTimeout(15000);
  return { context, page, errors };
}
async function settle(page, errors) {
  assert.deepEqual(errors, []);
  assert.deepEqual(await page.evaluate(() => window.__unhandled), []);
  const text = await page.locator('#root').innerText();
  assert.ok(text.length > 80, 'The atlas rendered an empty screen.');
  assert.equal(text.includes('Consulted undefined'), false);
  await expect(page.locator('.app-header')).toBeVisible();
}

async function healthy(width) {
  const { context, page, errors } = await openPage(width);
  let requests = 0;
  await page.route('**/atlas/source-records.json', (route) => {
    requests += 1;
    return route.continue();
  });
  await page.goto(`${root}/?view=stories`);
  await expect(page.locator('.story-gallery')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search the atlas' })).toBeEnabled();
  const link = page
    .locator('.story-image-credit a', { hasText: 'original record' })
    .first();
  await expect(link).toHaveAttribute('href', /^https:\/\//);
  assert.equal(requests, 1);
  await expect(page.locator('.bibliography-status')).toHaveCount(0);
  const subjectId = await page.locator('.story-feature').getAttribute('data-subject');
  const source = citedSource(subjectId);
  await page.getByRole('button', { name: 'Read this story →' }).click();
  await expect(page.locator('.dossier[data-reading-ready=true] h1')).toBeVisible();
  const notes = page.locator('.dossier .citations').first();
  await notes.locator('summary').click();
  await expect(notes.locator(`a[href="${source.url}"]`)).toContainText(source.title);
  await expect(notes).toContainText(`Consulted ${source.accessed}`);
  await expect(notes).not.toContainText('Original records remain linked');
  await settle(page, errors);
  results.push({ width, scenario: 'healthy', requests, source: source.id });
  await context.close();
}

async function delayed(width) {
  const { context, page, errors } = await openPage(width);
  let requests = 0;
  let release;
  const held = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('**/atlas/source-records.json', async (route) => {
    requests += 1;
    await held;
    return route.continue();
  });
  await page.goto(`${root}/?view=stories`);
  await expect(page.locator('.story-gallery')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search the atlas' })).toBeEnabled();
  const status = page.locator('.bibliography-status');
  await expect(status).toContainText(
    'Loading source titles and record links. Reading and pictures stay available.',
  );
  assert.equal(requests, 1);
  await page.getByRole('button', { name: 'Living timeline', exact: true }).click();
  await expect(page.locator('.living-timeline')).toBeVisible();
  assert.equal(requests, 1);
  await page.getByRole('button', { name: 'Stories & objects', exact: true }).click();
  release();
  await expect(
    page.locator('.story-image-credit a', { hasText: 'original record' }).first(),
  ).toHaveAttribute('href', /^https:\/\//);
  assert.equal(requests, 1);
  await expect(status).toHaveCount(0);
  await settle(page, errors);
  results.push({ width, scenario: 'delayed', requests });
  await context.close();
}

async function fault(width, name, body, options = {}) {
  const { context, page, errors } = await openPage(width);
  let requests = 0;
  let failed = true;
  let release = () => {};
  await page.route('**/atlas/source-records.json', async (route) => {
    requests += 1;
    if (failed) {
      if (options.status)
        return route.fulfill({ status: options.status, body: 'unavailable' });
      return fulfill(route, body);
    }
    if (options.holdRetry)
      await new Promise((resolve) => {
        release = resolve;
      });
    return route.continue();
  });
  await page.goto(`${root}/?view=stories`);
  await expect(page.locator('.story-gallery')).toBeVisible();
  const status = page.locator('.bibliography-status');
  await expect(status).toContainText(
    'Source titles and record links could not load. Reading and pictures stay available.',
  );
  assert.equal(requests, 1);
  const heading = page.locator('.story-gallery h1');
  await heading.focus();
  await expect(heading).toBeFocused();
  await page.locator('.story-image-credit summary').first().click();
  await expect(
    page
      .locator('.story-image-credit')
      .first()
      .getByRole('link', { name: /original record/ }),
  ).toHaveCount(0);
  const credit = await page.locator('.story-image-credit').first().innerText();
  assert.ok(credit.length > 40);
  await expect(page.locator('body')).not.toContainText(
    'Original records remain linked',
  );
  if (options.switchViews) {
    await page.getByRole('button', { name: 'Living timeline', exact: true }).click();
    await expect(page.locator('.living-timeline')).toBeVisible();
    await page.getByRole('button', { name: 'Stories & objects', exact: true }).click();
    await expect(page.locator('.story-gallery')).toBeVisible();
    await page.waitForTimeout(1600);
    assert.equal(requests, 1);
  }
  failed = false;
  const retry = page.getByRole('button', { name: 'Retry source records' });
  if (options.holdRetry) {
    await retry.focus();
    await page.keyboard.press('Enter');
    await expect(status).toContainText('Loading source titles');
    await expect(status).toBeFocused();
    assert.equal(requests, 2);
    release();
  } else {
    await retry.click();
  }
  await expect(
    page.locator('.story-image-credit a', { hasText: 'original record' }).first(),
  ).toHaveAttribute('href', /^https:\/\//);
  assert.equal(requests, 2);
  await expect(status).toHaveCount(0);
  if (options.holdRetry)
    await expect(page.locator('.story-gallery [data-context-title]')).toBeFocused();
  const subjectId = await page.locator('.story-feature').getAttribute('data-subject');
  const source = citedSource(subjectId);
  await page.getByRole('button', { name: 'Read this story →' }).click();
  const notes = page.locator('.dossier .citations').first();
  await notes.locator('summary').click();
  await expect(notes.locator(`a[href="${source.url}"]`)).toContainText(source.title);
  await expect(notes).toContainText(`Consulted ${source.accessed}`);
  await expect(notes).not.toContainText('Original records remain linked');
  const hrefs = await notes
    .locator('a')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  assert.ok(hrefs.every((href) => /^https?:\/\//.test(href)));
  await settle(page, errors);
  results.push({ width, scenario: name, requests, source: source.id, errors });
  await context.close();
}

async function dossierRecovery(width) {
  const { context, page, errors } = await openPage(width);
  let requests = 0;
  let failed = true;
  await page.route('**/atlas/source-records.json', async (route) => {
    requests += 1;
    if (failed) return route.fulfill({ status: 503, body: 'unavailable' });
    return route.continue();
  });
  await page.goto(`${root}/?pack=C5&subject=tang-city&year=700&scale=local`);
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  const notes = page.locator('.dossier .citations').first();
  await notes.locator('summary').click();
  await expect(page.locator('.bibliography-status')).toContainText('could not load');
  await expect(notes).toContainText(tangSource.id);
  await expect(notes.locator('a')).toHaveCount(0);
  await expect(notes).not.toContainText(`Consulted ${tangSource.accessed}`);
  await expect(notes).not.toContainText('Original records remain linked');
  assert.equal(requests, 1);
  await page.waitForTimeout(1600);
  assert.equal(requests, 1, 'Opening the citation and waiting must not retry.');
  const title = page.locator('[data-reading-title]');
  await title.focus();
  await expect(title).toBeFocused();
  failed = false;
  await page.getByRole('button', { name: 'Retry source records' }).click();
  await expect(notes.locator(`a[href="${tangSource.url}"]`)).toContainText(
    tangSource.title,
  );
  await expect(notes).toContainText(`Consulted ${tangSource.accessed}`);
  await expect(title).toBeFocused();
  assert.equal(requests, 2);
  await settle(page, errors);
  results.push({
    width,
    scenario: 'dossier-503',
    requests,
    title: tangSource.title,
    url: tangSource.url,
  });
  await context.close();
}

async function printBibliography() {
  const { context, page, errors } = await openPage(1440);
  page.setDefaultTimeout(45000);
  let recordRequests = 0;
  await page.route('**/atlas/source-records.json', (route) => {
    recordRequests += 1;
    return route.fulfill({ status: 503, body: 'unavailable' });
  });
  await page.goto(`${root}/?print=reader&subject=tang-city`);
  const bibliography = page.locator('.reader-bibliography');
  await expect(bibliography.locator(`a[href="${tangSource.url}"]`)).toContainText(
    tangSource.title,
  );
  await expect(bibliography).toContainText(`Consulted ${tangSource.accessed}`);
  await page.goto(`${root}/?print=chapter&pack=C5`);
  await expect(page.locator('a.chapter-source-url').first()).toHaveAttribute(
    'href',
    /^https:\/\//,
  );
  await expect(
    page.getByRole('heading', { name: 'Preparing the print composition…' }),
  ).toHaveCount(0);
  assert.equal(recordRequests, 0);
  assert.deepEqual(errors, []);
  assert.deepEqual(await page.evaluate(() => window.__unhandled), []);
  results.push({
    scenario: 'print-corpus-bibliography',
    sourceRecordRequests: recordRequests,
    title: tangSource.title,
  });
  await context.close();
}

async function notebookRecovery(width, scenario) {
  const { context, page, errors } = await openPage(width);
  const key = 'chronos.household.v1';
  const earlier = {
    id: 'earlier-valid-note',
    title: 'An earlier question',
    question: 'What would test this account?',
    answer: 'Keep my original thinking.',
    collection: 'Household',
    saved: '2026-10-29T10:00:00Z',
    location: '?pack=C5&subject=tang-city&year=700&scale=local',
    kind: 'question',
    context: {
      label: 'Chang’an · 700 CE',
      subject: 'tang-city',
      compare: null,
      object: null,
      year: 700,
      journey: null,
      step: 0,
      sources: [
        {
          id: tangSource.id,
          title: tangSource.title,
          url: tangSource.url,
          consulted: tangSource.accessed,
          locator: tang.sections[0].citations[0].locator,
        },
      ],
    },
  };
  await page.addInitScript(
    ({ key, earlier }) => {
      if (localStorage.getItem(key) === null)
        localStorage.setItem(key, JSON.stringify({ version: 1, notes: [earlier] }));
    },
    { key, earlier },
  );
  let requests = 0;
  let failed = true;
  let release;
  const held = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('**/atlas/source-records.json', async (route) => {
    requests++;
    if (scenario === 'loading') {
      await held;
      return route.continue();
    }
    return failed
      ? route.fulfill({ status: 503, body: 'unavailable' })
      : route.continue();
  });
  const stored = () =>
    page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
  const save = async (question) => {
    await page.getByRole('button', { name: 'Save a question', exact: true }).click();
    await page.locator('.save-dialog textarea[name=question]').fill(question);
    await page
      .getByRole('button', { name: 'Save on this device', exact: true })
      .click();
    await expect(page.locator('.save-dialog')).not.toBeVisible();
  };
  try {
    await page.goto(`${root}/${earlier.location}`);
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    const status = page.locator('.bibliography-status');
    await expect(status).toContainText(
      scenario === 'loading' ? 'Loading source titles' : 'could not load',
    );
    await save(`Saved during bibliography ${scenario}`);
    const saved = await stored();
    assert.equal(saved.notes.length, 2);
    assert.deepEqual(saved.notes[1], earlier);
    assert.ok(saved.notes[0].context.sources.length > 0);
    assert.ok(
      saved.notes[0].context.sources.every(
        (source) =>
          Object.keys(source).sort().join(',') === 'id,locator' &&
          source.id &&
          source.locator,
      ),
    );
    assert.equal(requests, 1, 'Saving must not retry the bibliography.');
    const message = page.locator('.app-message:not(.bibliography-status)');
    await expect(message).toContainText('Saved on this device');
    const bibliographyBounds = await status.boundingBox();
    const savedBounds = await message.boundingBox();
    assert.ok(
      bibliographyBounds.y + bibliographyBounds.height <= savedBounds.y,
      'Status notices must not overlap.',
    );
    assert.ok(
      bibliographyBounds.y >= 0 &&
        savedBounds.y + savedBounds.height <= page.viewportSize().height,
    );
    await page
      .getByRole('button', { name: 'Dismiss', exact: true })
      .click({ trial: true });
    await page.screenshot({ path: `${out}/notebook-${scenario}-${width}.png` });
    failed = false;
    if (scenario === 'loading') release();
    else await page.getByRole('button', { name: 'Retry source records' }).click();
    await expect(status).toHaveCount(0);
    assert.equal(requests, scenario === 'loading' ? 1 : 2);
    await page.getByRole('button', { name: 'Dismiss', exact: true }).click();
    assert.deepEqual(
      await stored(),
      saved,
      'Recovery must not invent details in the saved snapshot.',
    );
    await page.getByRole('button', { name: 'Notebook', exact: true }).click();
    const entries = page.locator('.notebook-list > article');
    await expect(entries).toHaveCount(2);
    await entries.first().locator('.saved-context > summary').click();
    await expect(entries.first()).toContainText(
      'details were unavailable when this question was saved',
    );
    await expect(entries.first().locator('.saved-context a')).toHaveCount(0);
    await page.reload();
    await expect(entries).toHaveCount(2);
    const downloading = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export notebook', exact: true }).click();
    const exportedPath = `${out}/notebook-${scenario}-${width}.json`;
    await (await downloading).saveAs(exportedPath);
    const exported = await fs.readFile(exportedPath);
    assert.deepEqual(JSON.parse(exported), saved);
    await page.locator('input[type=file]').setInputFiles({
      name: 'saved-notebook.json',
      mimeType: 'application/json',
      buffer: exported,
    });
    await expect(page.locator('.notebook-view > [role=status]').last()).toContainText(
      'Review the import below',
    );
    await page
      .getByRole('button', { name: 'Add imported entries', exact: true })
      .click();
    await expect(entries).toHaveCount(2);
    await entries
      .first()
      .getByRole('button', { name: 'Return to this moment' })
      .click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await page
      .locator(`.dossier .citations a[href="${tangSource.url}"]`)
      .first()
      .waitFor({ state: 'attached' });
    await save('Saved after bibliography recovery');
    const after = await stored();
    assert.equal(after.notes.length, 3);
    assert.deepEqual(after.notes.slice(1), saved.notes);
    assert.ok(
      after.notes[0].context.sources.every(
        (source) => source.title && /^https?:\/\//.test(source.url) && source.consulted,
      ),
    );
    await page.getByRole('button', { name: 'Notebook', exact: true }).click();
    await page.reload();
    await expect(entries).toHaveCount(3);
    assert.deepEqual(await stored(), after);
    await settle(page, errors);
    results.push({
      width,
      scenario: `notebook-${scenario}`,
      requests,
      notesAfterReload: 3,
      exportImport: true,
      priorNotePreserved: true,
      noticesOverlap: false,
      mouseRetry: scenario === 'loading' ? 'not needed' : true,
    });
  } finally {
    release();
    await context.close();
  }
}

const brokenRecord = { ...records[0], title: '' };
const duplicate = [records[0], ...records];
const missingId = records.slice(1);
try {
  for (const width of [390, 1440]) {
    await healthy(width);
    await delayed(width);
    await fault(width, 'service-unavailable', null, {
      status: 503,
      switchViews: true,
      holdRetry: true,
    });
    await dossierRecovery(width);
    await fault(width, 'malformed-json', 'not json');
    await fault(width, 'wrong-shape', {});
    await fault(
      width,
      'missing-title',
      records.map((row, index) => (index === 0 ? brokenRecord : row)),
    );
    await fault(width, 'duplicate-id', duplicate);
    await fault(width, 'missing-required-id', missingId);
  }
  for (const width of [320, 390, 768, 1440]) {
    await notebookRecovery(width, 'loading');
    await notebookRecovery(width, '503');
  }
  await printBibliography();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    `Bibliography loader: healthy, delayed, failed, malformed, and recovered states passed. Notebook save/retry/reload/export/import and stacked notices passed at four widths. Print kept the corpus bibliography.`,
  );
} finally {
  await browser.close();
}

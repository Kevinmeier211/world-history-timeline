/* global document, localStorage, sessionStorage, innerWidth, Node, requestAnimationFrame */
import { chromium, firefox, webkit } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';
const origin = process.env.ATLAS_URL;
assert(origin && new URL(origin).hostname === '127.0.0.1');
const engine = process.env.ATLAS_ENGINE ?? 'chromium';
const moduleFailure = process.env.ATLAS_MODULE_FAILURE ?? 'http503';
assert(['http503', 'abort'].includes(moduleFailure));
async function failModule(route) {
  if (moduleFailure === 'abort') return route.abort('failed');
  return route.fulfill({
    status: 503,
    contentType: 'text/javascript',
    headers: { 'Cache-Control': 'no-store' },
    body: 'Temporarily unavailable',
  });
}
assert(['chromium', 'firefox', 'webkit'].includes(engine));
const out =
  process.env.ATLAS_OUTPUT_DIR ?? 'output/accessibility-2026-11-05/world-loading';
await fs.mkdir(out, { recursive: true });
const browser = await { chromium, firefox, webkit }[engine].launch();
let context;
let releaseWorld;
const result = {
  engine,
  version: browser.version(),
  checks: [],
  failures: [],
  moduleNetwork: [],
  injectedModuleFailure:
    moduleFailure === 'abort'
      ? 'Inspector-aborted request'
      : 'HTTP 503 with Cache-Control: no-store',
};
async function activate(page, element) {
  for (let i = 0; i < 160; i++) {
    if (await element.evaluate((el) => el === document.activeElement)) {
      await page.keyboard.press('Enter');
      return;
    }
    const previous = await element.evaluate(
      (el) =>
        document.activeElement !== document.body &&
        !!(
          el.compareDocumentPosition(document.activeElement) &
          Node.DOCUMENT_POSITION_FOLLOWING
        ),
    );
    await page.keyboard.press(
      (engine === 'webkit' ? 'Alt+' : '') + (previous ? 'Shift+' : '') + 'Tab',
    );
  }
  throw Error('World recovery control is unavailable by keyboard');
}
try {
  context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const chunkRequests = [];
  page.on('requestfailed', (request) => {
    if (request.url().includes('/assets/'))
      result.moduleNetwork.push({
        event: 'failed',
        url: request.url(),
        error: request.failure(),
      });
  });
  page.on('response', (response) => {
    if (/\/WorldContext-[^/]+\.js/.test(response.url()))
      result.moduleNetwork.push({
        event: 'response',
        url: response.url(),
        status: response.status(),
      });
  });
  page.on('request', (r) => {
    if (/\/WorldContext-[^/]+\.js(?:\?|$)/.test(r.url())) chunkRequests.push(r.url());
  });
  await page.goto(origin + '/?subject=nalanda&pack=C5&year=680');
  await expect(page.locator('.dossier')).toHaveAttribute('data-reading-ready', 'true');
  await page.getByRole('button', { name: 'Save a question', exact: true }).click();
  await page
    .locator('.save-dialog textarea[name=answer]')
    .fill('World loader recovery keeps this answer');
  await page.getByRole('button', { name: 'Save on this device' }).click();
  await expect(page.locator('.save-dialog')).not.toBeVisible();
  const saved = await page.evaluate(() => localStorage.getItem('chronos.household.v1'));
  assert(saved?.includes('World loader recovery keeps this answer'));
  await page.goto(origin + '/');
  await expect(page.locator('.living-timeline')).toBeVisible();
  assert.equal(chunkRequests.length, 0, 'World module loaded before world entry');
  result.checks.push({ flow: 'deferred-world-code', requestsBeforeEntry: 0 });
  const gate = new Promise((resolve) => {
    releaseWorld = resolve;
  });
  let fail = true;
  await context.route('**/assets/WorldContext-*.js', async (route) => {
    await gate;
    if (fail) await failModule(route);
    else await route.continue();
  });
  await activate(
    page,
    page.getByRole('button', { name: 'Meanwhile elsewhere', exact: true }),
  );
  const loading = page.getByRole('heading', {
    name: 'Opening the world view…',
    exact: true,
  });
  await expect(loading).toBeVisible();
  await expect(loading.locator('..')).toHaveAttribute('data-reading-ready', 'false');
  releaseWorld();
  const failure = page.getByRole('heading', {
    name: 'The world view could not open',
    exact: true,
  });
  await expect(failure).toBeVisible();
  await expect(failure).toBeFocused();
  assert.equal(
    await page.evaluate(() => localStorage.getItem('chronos.household.v1')),
    saved,
  );
  await page.screenshot({ path: `${out}/world-failure-${engine}.png` });
  await activate(
    page,
    page.getByRole('button', { name: '← Living timeline', exact: true }),
  );
  await expect(page.locator('.living-timeline')).toBeVisible();
  await activate(
    page,
    page.getByRole('button', { name: 'Meanwhile elsewhere', exact: true }),
  );
  await expect(failure).toBeVisible();
  fail = false;
  await activate(page, page.getByRole('button', { name: 'Reload atlas', exact: true }));
  const world = page.locator('.world-context [data-context-title]');
  await expect(world).toContainText('Meanwhile, around');
  await expect(world).toBeVisible();
  const reloadFocus = await page.evaluate(() => ({
    tag: document.activeElement.tagName,
    nativeDocumentFocus:
      document.activeElement === document.body ||
      document.activeElement === document.documentElement ||
      document.activeElement === document.querySelector('main'),
    connected: document.activeElement.isConnected,
  }));
  assert(reloadFocus.nativeDocumentFocus && reloadFocus.connected);
  await activate(
    page,
    page.getByRole('button', { name: 'Living timeline', exact: true }),
  );
  await expect(page.locator('.living-timeline')).toBeVisible();
  await activate(
    page,
    page.getByRole('button', { name: 'Meanwhile elsewhere', exact: true }),
  );
  await expect(world).toContainText('Meanwhile, around');
  await expect(world).toBeFocused();
  assert.equal(
    await page.evaluate(() => localStorage.getItem('chronos.household.v1')),
    saved,
  );
  const bounds = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert(bounds.scrollWidth <= bounds.width + 1);
  await page.screenshot({ path: `${out}/world-recovered-${engine}.png` });
  result.checks.push({
    flow: 'world-loading-recovery',
    loading: true,
    failureHeadingFocus: true,
    timelineFallback: true,
    reloadRecovered: true,
    reloadFocus,
    inAppReturnHeadingFocus: true,
    notebookBytesPreserved: true,
    chunkRequests: chunkRequests.length,
    bounds,
    title: await page.title(),
  });
  for (const route of [
    { name: 'timeline', url: '/', image: '.living-preview img' },
    { name: 'stories', url: '/?view=stories', image: '.story-gallery img' },
  ]) {
    await page.goto(origin + route.url);
    const image = page.locator(route.image).first();
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);
    await image.evaluate((el) => el.decode());
    await page.evaluate(() => document.fonts.ready);
    await expect(image).toHaveAttribute('fetchpriority', 'high');
    await expect(image).toHaveAttribute('alt', /.+/);
    await page.screenshot({ path: `${out}/initial-image-${route.name}-${engine}.png` });
    result.checks.push({
      flow: 'initial-image',
      route: route.name,
      loaded: true,
      fetchPriority: await image.getAttribute('fetchpriority'),
      source: await image.getAttribute('src'),
    });
  }
  // Dossier code is absent from an untouched entrance, then has its own recovery.
  const readingContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  let releaseReader;
  try {
    const readingPage = await readingContext.newPage();
    const readerRequests = [];
    readingPage.on('request', (request) => {
      if (/\/Dossier-[^/]+\.js(?:\?|$)/.test(request.url()))
        readerRequests.push(request.url());
    });
    await readingPage.goto(origin + '/');
    await expect(readingPage.locator('.living-timeline')).toBeVisible();
    await readingPage.evaluate(
      (value) => localStorage.setItem('chronos.household.v1', value),
      saved,
    );
    assert.equal(
      readerRequests.length,
      0,
      'Dossier module loaded before selecting a case',
    );
    const readerGate = new Promise((resolve) => {
      releaseReader = resolve;
    });
    let failReader = true;
    await readingContext.route('**/assets/Dossier-*.js', async (route) => {
      await readerGate;
      if (failReader) await failModule(route);
      else await route.continue();
    });
    await readingPage.goto(origin + '/?subject=nalanda&pack=C5&year=680', {
      waitUntil: 'domcontentloaded',
    });
    await expect(readingPage.locator('.dossier h1')).toBeVisible();
    const selectedTitle = await readingPage.locator('.dossier h1').innerText();
    await expect(readingPage.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'false',
    );
    await expect(
      readingPage
        .getByRole('status')
        .filter({ hasText: 'Opening the researched dossier' }),
    ).toBeVisible();
    releaseReader();
    await expect(readingPage.getByRole('alert')).toContainText(
      'reading controls could not load',
    );
    await expect(readingPage.locator('.dossier h1')).toBeFocused();
    assert.equal(
      await readingPage.evaluate(() => localStorage.getItem('chronos.household.v1')),
      saved,
    );
    failReader = false;
    await activate(
      readingPage,
      readingPage.getByRole('button', { name: 'Reload atlas', exact: true }),
    );
    await expect(readingPage.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'true',
    );
    await expect(readingPage.locator('.dossier h1')).toHaveText(selectedTitle);
    await expect(
      readingPage.locator('.dossier #main-explanation + .dossier-section'),
    ).toBeVisible();
    assert.equal(
      await readingPage.evaluate(() => localStorage.getItem('chronos.household.v1')),
      saved,
    );
    result.checks.push({
      flow: 'deferred-dossier-code',
      requestsBeforeSelection: 0,
      loadingIdentifiesCase: true,
      failureHeadingFocused: true,
      reloadRestoresFullReading: true,
      notebookBytesPreserved: true,
      requests: readerRequests.length,
    });
  } finally {
    releaseReader?.();
    await readingContext.close();
  }
  // Notebook data remains eager, but the editing controls load only on entry.
  const notebookContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  let releaseNotebook;
  try {
    const notebookPage = await notebookContext.newPage();
    const notebookRequests = [];
    notebookPage.on('request', (request) => {
      if (/\/Notebook-[^/]+\.js(?:\?|$)/.test(request.url()))
        notebookRequests.push(request.url());
    });
    await notebookPage.goto(origin + '/');
    await expect(notebookPage.locator('.living-timeline')).toBeVisible();
    const savedNote = JSON.parse(saved).notes[0];
    const editDraft = JSON.stringify({
      id: savedNote.id,
      base: savedNote,
      mode: 'thinking',
      title: savedNote.title,
      question: savedNote.question,
      collection: savedNote.collection,
      answer: 'Unsaved notebook revision survives a failed controls download',
      reflection: 'Keep this draft separate from the saved first answer',
      evidence: '',
    });
    // Seed once, then hydrate Atlas. Reload must not reseed or mask lost data.
    await notebookPage.evaluate(
      ({ savedBook, draft }) => {
        localStorage.setItem('chronos.household.v1', savedBook);
        sessionStorage.setItem('chronos.edit-draft', draft);
      },
      { savedBook: saved, draft: editDraft },
    );
    await notebookPage.reload();
    await expect(notebookPage.locator('.living-timeline')).toBeVisible();
    assert.equal(notebookRequests.length, 0, 'Notebook controls loaded before entry');
    const notebookGate = new Promise((resolve) => {
      releaseNotebook = resolve;
    });
    let failNotebook = true;
    await notebookContext.route('**/assets/Notebook-*.js', async (route) => {
      await notebookGate;
      if (failNotebook) await failModule(route);
      else await route.continue();
    });
    await activate(
      notebookPage,
      notebookPage.getByRole('button', { name: 'Notebook', exact: true }),
    );
    const notebookLoading = notebookPage.getByRole('heading', {
      name: 'Opening your notebook…',
      exact: true,
    });
    await expect(notebookLoading).toBeVisible();
    await expect(notebookLoading.locator('..')).toHaveAttribute(
      'data-reading-ready',
      'false',
    );
    await expect(notebookLoading).not.toBeFocused();
    releaseNotebook();
    const notebookFailure = notebookPage.getByRole('heading', {
      name: 'The notebook controls could not open',
      exact: true,
    });
    await expect(notebookFailure).toBeFocused();
    await expect(notebookPage.getByRole('alert')).toContainText(
      'entries and drafts remain available',
    );
    await activate(
      notebookPage,
      notebookPage.getByText('Copy notebook and drafts before reloading', {
        exact: true,
      }),
    );
    await expect(
      notebookPage.getByRole('textbox', { name: 'Notebook JSON for import' }),
    ).toHaveValue(JSON.stringify(JSON.parse(saved), null, 2));
    await expect(
      notebookPage.getByRole('textbox', { name: 'Draft and undo history JSON' }),
    ).toHaveValue(
      JSON.stringify({ draft: JSON.parse(editDraft), removed: [] }, null, 2),
    );
    const storedNotebook = () =>
      notebookPage.evaluate(() => ({
        book: localStorage.getItem('chronos.household.v1'),
        draft: sessionStorage.getItem('chronos.edit-draft'),
      }));
    assert.deepEqual(await storedNotebook(), { book: saved, draft: editDraft });
    await notebookPage.screenshot({ path: `${out}/notebook-failure-${engine}.png` });
    failNotebook = false;
    await activate(
      notebookPage,
      notebookPage.getByRole('button', { name: 'Reload atlas', exact: true }),
    );
    const revision = notebookPage.getByRole('textbox', {
      name: 'Your thinking now',
      exact: true,
    });
    await expect(revision).toHaveValue(JSON.parse(editDraft).answer);
    await expect(revision).toBeFocused();
    await notebookPage.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });
    await expect(revision).toBeFocused();
    assert.deepEqual(await storedNotebook(), { book: saved, draft: editDraft });
    await activate(
      notebookPage,
      notebookPage.getByRole('button', { name: 'Explore', exact: true }),
    );
    await expect(notebookPage.locator('.living-timeline')).toBeVisible();
    await activate(
      notebookPage,
      notebookPage.getByRole('button', { name: 'Notebook', exact: true }),
    );
    await expect(revision).toHaveValue(JSON.parse(editDraft).answer);
    await expect(revision).toBeFocused();
    assert.deepEqual(await storedNotebook(), { book: saved, draft: editDraft });
    await notebookPage.screenshot({ path: `${out}/notebook-recovered-${engine}.png` });
    result.checks.push({
      flow: 'deferred-notebook-code-and-draft-recovery',
      requestsBeforeEntry: 0,
      delayedControls: true,
      failureHeadingFocused: true,
      exactRecoveryTextAvailable: true,
      reloadRestoresDraftEditorFocus: true,
      inAppReturnRestoresDraftEditorFocus: true,
      savedNotebookBytesPreserved: true,
      unsavedDraftBytesPreserved: true,
      requests: notebookRequests.length,
    });
  } finally {
    releaseNotebook?.();
    await notebookContext.close();
  }
} catch (error) {
  result.failures.push(String(error).slice(0, 1400));
} finally {
  releaseWorld?.();
  try {
    await context?.close();
  } finally {
    await browser.close();
    await fs.writeFile(
      `${out}/world-loading-${engine}.json`,
      JSON.stringify(result, null, 2) + '\n',
    );
  }
}
assert.equal(result.failures.length, 0, JSON.stringify(result.failures));

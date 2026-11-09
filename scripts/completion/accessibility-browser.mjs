/* global document, localStorage, window, innerWidth, getComputedStyle, Node */
import { chromium, firefox, webkit } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import { URL } from 'node:url';

const origin = process.env.ATLAS_URL;
assert(origin && new URL(origin).hostname === '127.0.0.1', 'Local ATLAS_URL required');
const engine = process.env.ATLAS_ENGINE ?? 'chromium';
assert(['chromium', 'firefox', 'webkit'].includes(engine));
const out = process.env.ATLAS_OUTPUT_DIR ?? 'output/accessibility-2026-11-05';
await fs.mkdir(out, { recursive: true });
const result = {
  engine,
  version: null,
  keyboardTraversal: engine === 'webkit' ? 'Option+Tab (WebKit on macOS)' : 'Tab',
  cases: [],
  failures: [],
};
const browser = await { chromium, firefox, webkit }[engine].launch();
result.version = browser.version();
async function tabTo(page, element) {
  for (let i = 0; i < 160; i++) {
    if (await element.evaluate((el) => el === document.activeElement)) return;
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
  throw Error('Target is unavailable through keyboard Tab');
}
async function activate(page, element) {
  await tabTo(page, element);
  await page.keyboard.press('Enter');
}
async function reflow(page, label) {
  const bounds = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  assert(
    bounds.document <= bounds.viewport + 1,
    label + ' horizontal overflow ' + JSON.stringify(bounds),
  );
  return bounds;
}
async function axe(page) {
  const report = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return report.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
  }));
}
const smoke = process.argv.includes('--smoke');
try {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    if (smoke && viewport.width !== Number(process.env.ATLAS_SMOKE_WIDTH ?? 390))
      continue;
    for (const theme of smoke ? ['light'] : ['light', 'dark'])
      for (const reducedMotion of smoke ? ['reduce'] : ['no-preference', 'reduce']) {
        const context = await browser.newContext({ viewport, reducedMotion });
        const row = { viewport, theme, reducedMotion, checks: [], violations: [] };
        try {
          await context.addInitScript(
            (theme) => localStorage.setItem('chronos.theme', theme),
            theme,
          );
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', (e) => errors.push(String(e)));
          await page.goto(origin + '/?page=journeys');
          await expect(page.locator('.journey-filters select').first()).toBeVisible();
          row.checks.push({
            flow: 'investigation-filters',
            bounds: await reflow(page, 'investigation filters'),
          });
          await page.goto(origin + '/?subject=nalanda&pack=C5&year=680');
          await expect(page.locator('.dossier')).toHaveAttribute(
            'data-reading-ready',
            'true',
          );
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          assert(
            await page.evaluate(
              (value) =>
                window.matchMedia('(prefers-reduced-motion: reduce)').matches ===
                (value === 'reduce'),
              reducedMotion,
            ),
          );
          if (reducedMotion === 'reduce') {
            const motions = await page.evaluate(() =>
              Array.from(document.querySelectorAll('*'))
                .filter((el) => {
                  const s = getComputedStyle(el);
                  return (
                    s.animationName !== 'none' ||
                    s.transitionDuration.split(',').some((v) => parseFloat(v) > 0)
                  );
                })
                .map((el) => el.tagName + '.' + el.className),
            );
            assert.deepEqual(motions, []);
          }
          await expect(page.locator('.object-figure')).toHaveAttribute(
            'data-media-status',
            'ready',
          );
          await expect
            .poll(() =>
              page
                .locator('.image-open img')
                .evaluate((el) => el.complete && el.naturalWidth > 0),
            )
            .toBe(true);
          row.checks.push({ flow: 'reading', bounds: await reflow(page, 'reading') });
          await page.locator('.image-open img').evaluate((el) => el.decode());
          await page.evaluate(() => document.fonts.ready);
          if (reducedMotion === 'reduce') {
            row.screenshot = `reader-${engine}-${viewport.width}-${theme}.png`;
            await page.screenshot({ path: `${out}/${row.screenshot}` });
          }
          row.violations.push(...(await axe(page)));
          const word = page.locator('.dossier .inline-term').first();
          await activate(page, word);
          const definition = page.locator('.glossary-dialog[open]');
          await expect(definition).toBeVisible();
          await expect(
            definition.getByRole('button', { name: 'Back to reading' }),
          ).toBeFocused();
          await page
            .locator('.dossier button')
            .first()
            .evaluate((el) => el.focus());
          await expect(
            definition.getByRole('button', { name: 'Back to reading' }),
          ).toBeFocused();
          await page.keyboard.press('Tab');
          assert(
            await definition.evaluate(
              (el) =>
                el.contains(document.activeElement) ||
                document.activeElement === document.body,
            ),
          );
          await page.keyboard.press('Escape');
          await expect(definition).not.toBeVisible();
          await expect(word).toBeFocused();
          row.checks.push({ flow: 'glossary', keyboard: true, focusReturned: true });
          const figure = page.locator('.object-figure');
          await expect(figure).toHaveAttribute('data-media-status', 'ready');
          const opener = figure.locator('.image-open');
          await activate(page, opener);
          const inspection = page.locator('.inspection[open]');
          await expect(inspection).toBeVisible();
          await expect
            .poll(() =>
              inspection
                .locator('.inspection-scroll img')
                .evaluate((el) => el.complete && el.naturalWidth > 0),
            )
            .toBe(true);
          await inspection
            .locator('.inspection-scroll img')
            .evaluate((el) => el.decode());
          await expect(inspection.locator('.inspection-scroll img')).toHaveAttribute(
            'alt',
            /.+/,
          );
          await activate(
            page,
            inspection.getByRole('button', { name: 'Zoom in', exact: true }),
          );
          await expect(inspection.locator('output')).toHaveText('150%');
          await page.keyboard.press('Escape');
          await expect(inspection).not.toBeVisible();
          await expect(opener).toBeFocused();
          row.checks.push({
            flow: 'image-inspection',
            keyboard: true,
            focusReturned: true,
            bounds: await reflow(page, 'inspection closed'),
          });
          const citation = page.locator('.dossier-section details.citations').first();
          await activate(page, citation.locator('summary'));
          await expect(citation).toHaveAttribute('open', '');
          await expect(citation.locator('a').first()).toHaveAttribute(
            'href',
            /^https:\/\//,
          );
          row.checks.push({ flow: 'source', keyboard: true, linked: true });
          const searchTrigger = page.getByRole('button', { name: 'Search the atlas' });
          await activate(page, searchTrigger);
          const search = page.locator('.search-dialog[open]');
          const input = search.getByRole('searchbox');
          await expect(input).toBeFocused();
          await input.fill('zzunrepresentedzz');
          await expect(search.locator('.search-count')).toContainText('0 subjects');
          await expect(search).toContainText('No match in the current selection');
          if (viewport.width === 390 && theme === 'light' && reducedMotion === 'reduce')
            row.violations.push(...(await axe(page)));
          await page.keyboard.press('Escape');
          if (await search.count()) await page.keyboard.press('Escape');
          await expect(search).not.toBeVisible();
          await expect(searchTrigger).toBeFocused();
          row.checks.push({
            flow: 'search',
            keyboard: true,
            emptyState: true,
            focusReturned: true,
          });
          const save = page.getByRole('button', {
            name: 'Save a question',
            exact: true,
          });
          await activate(page, save);
          const dialog = page.locator('.save-dialog[open]');
          await expect(dialog).toBeVisible();
          await dialog
            .locator('textarea[name=answer]')
            .fill(
              'A02 ' +
                engine +
                ' ' +
                viewport.width +
                ' ' +
                theme +
                ' ' +
                reducedMotion,
            );
          if (viewport.width === 390 && theme === 'light' && reducedMotion === 'reduce')
            row.violations.push(...(await axe(page)));
          await activate(
            page,
            dialog.getByRole('button', { name: 'Save on this device', exact: true }),
          );
          await expect(dialog).not.toBeVisible();
          await activate(
            page,
            page.getByRole('button', { name: 'Notebook', exact: true }),
          );
          await expect(
            page.getByRole('heading', { name: 'Your notebook', exact: true }),
          ).toBeVisible();
          await activate(
            page,
            page.getByRole('button', {
              name: 'Reveal my earlier thinking',
              exact: true,
            }),
          );
          await expect(page.locator('main')).toContainText(
            'A02 ' + engine + ' ' + viewport.width + ' ' + theme + ' ' + reducedMotion,
          );
          row.checks.push({
            flow: 'notebook',
            keyboardSave: true,
            bounds: await reflow(page, 'notebook'),
          });
          await page.reload();
          await activate(
            page,
            page.getByRole('button', {
              name: 'Reveal my earlier thinking',
              exact: true,
            }),
          );
          await expect(page.locator('main')).toContainText(
            'A02 ' + engine + ' ' + viewport.width + ' ' + theme + ' ' + reducedMotion,
          );
          row.checks.push({ flow: 'storage', persisted: true });
          await page.addStyleTag({
            content:
              '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }',
          });
          row.checks.push({
            flow: 'text-spacing',
            bounds: await reflow(page, 'text spacing'),
          });
          await page.goto(
            origin +
              '/?page=explore&view=world&subject=ming-workshops&pack=C7&year=1600',
          );
          const connection = page.getByRole('region', {
            name: 'Evidence for the mapped connection',
          });
          await expect(connection).toBeVisible();
          await activate(page, connection.locator('summary'));
          await expect(connection.locator('a[href]')).toHaveCount(2);
          await expect(connection).toContainText('not an exact journey or a boundary');
          row.violations.push(...(await axe(page)));
          row.checks.push({
            flow: 'mapped-connection-evidence',
            keyboardSources: true,
            bounds: await reflow(page, 'mapped connection'),
          });
          assert.deepEqual(errors, []);
          assert.deepEqual(row.violations, []);
        } catch (error) {
          row.error = String(error).slice(0, 1200);
          result.failures.push(row);
        } finally {
          await context.close();
          result.cases.push(row);
          await fs.writeFile(
            `${out}/matrix-${engine}.json`,
            JSON.stringify(result, null, 2) + '\n',
          );
        }
      }
  }
  const failuresContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  try {
    const page = await failuresContext.newPage();
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    let failDossier = true;
    await failuresContext.route('**/atlas/subjects/nalanda.json', async (route) => {
      await gate;
      if (failDossier) await route.abort('failed');
      else await route.continue();
    });
    await page.goto(origin + '/?subject=nalanda&pack=C5&year=680');
    await expect(
      page.getByRole('status').filter({ hasText: 'Loading the researched dossier' }),
    ).toBeVisible();
    release();
    await expect(page.locator('.dossier').getByRole('alert')).toBeVisible();
    const failureMessage = await page
      .locator('.dossier')
      .getByRole('alert')
      .innerText();
    failDossier = false;
    await activate(
      page,
      page.getByRole('button', { name: 'Retry dossier reading', exact: true }),
    );
    await expect(page.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'true',
    );
    await expect(page.locator('.dossier').getByRole('alert')).toHaveCount(0);
    await expect(page.locator('[data-reading-title]')).toBeFocused();
    let mediaRequests = 0;
    await failuresContext.route(
      '**/atlas/media-records/nalanda.json?*',
      async (route) => {
        mediaRequests++;
        if (mediaRequests === 1) await route.abort('failed');
        else await route.continue();
      },
    );
    await page.reload();
    const figure = page.locator('.object-figure');
    await expect(figure).toHaveAttribute('data-media-status', 'failed');
    await activate(
      page,
      figure.getByRole('button', { name: 'Retry image information' }),
    );
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    assert.equal(mediaRequests, 2);
    result.recovery = {
      dossierLoadingAnnounced: true,
      dossierFailureAnnounced: failureMessage,
      dossierKeyboardRetry: true,
      dossierHeadingFocusPreserved: true,
      mediaRequests,
      mediaKeyboardRetry: true,
    };
  } catch (error) {
    result.failures.push({
      flow: 'loading-and-recovery',
      error: String(error).slice(0, 1000),
    });
  } finally {
    await failuresContext.close();
    await fs.writeFile(
      `${out}/matrix-${engine}.json`,
      JSON.stringify(result, null, 2) + '\n',
    );
  }
} finally {
  await browser.close();
}
assert.equal(result.failures.length, 0, JSON.stringify(result.failures));

/* global chrome, devicePixelRatio, innerWidth, innerHeight, outerWidth, visualViewport, document, localStorage */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';
import { URL } from 'node:url';
import { Buffer } from 'node:buffer';
const origin = process.env.ATLAS_URL;
assert(origin && new URL(origin).hostname === '127.0.0.1');
const out = process.env.ATLAS_OUTPUT_DIR ?? 'output/accessibility-2026-11-05';
await fs.mkdir(out, { recursive: true });
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'chronos-browser-zoom-'));
const extension = path.join(temporary, 'extension');
await fs.mkdir(extension);
await fs.writeFile(
  path.join(extension, 'manifest.json'),
  JSON.stringify({
    manifest_version: 3,
    name: 'Chronos isolated zoom verification',
    version: '1.0',
    host_permissions: ['http://127.0.0.1/*'],
    background: { service_worker: 'background.js' },
  }),
);
await fs.writeFile(
  path.join(extension, 'background.js'),
  'chrome.runtime.onInstalled.addListener(() => {});',
);
const context = await chromium.launchPersistentContext(
  path.join(temporary, 'profile'),
  {
    headless: true,
    channel: 'chromium',
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`],
  },
);
const result = {
  engine: 'chromium',
  version: context.browser().version(),
  method:
    'chrome.tabs.setZoom and getZoom in a task-owned persistent managed Chromium profile; fixed 1280 × 900 outer viewport, no pinch or viewport-scale emulation.',
  sourceDocumentation: [
    'https://playwright.dev/docs/chrome-extensions',
    'https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom',
  ],
  captureMethod:
    'CDP Page.captureScreenshot without a CSS clip; verified at native zoom and nonzero scroll against layout metrics.',
  checks: [],
  failures: [],
};
try {
  const worker =
    context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
  const page = context.pages()[0] ?? (await context.newPage());
  const cdp = await context.newCDPSession(page);
  // Native browser zoom needs a compositor capture: Playwright's CSS clip
  // produces a blank image at nonzero page scroll with 400% browser zoom.
  async function capture(name) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    await fs.writeFile(`${out}/${name}`, Buffer.from(data, 'base64'));
  }
  for (const theme of ['light', 'dark']) {
    await page.goto(origin);
    await page.evaluate((value) => localStorage.setItem('chronos.theme', value), theme);
    for (const zoom of [1, 2, 4]) {
      const setting = await worker.evaluate(
        async ({ zoom, origin }) => {
          const [tab] = await chrome.tabs.query({ url: origin + '/*' });
          await chrome.tabs.setZoom(tab.id, zoom);
          return chrome.tabs.getZoom(tab.id);
        },
        { zoom, origin },
      );
      assert(Math.abs(setting - zoom) < 0.001);
      await expect.poll(() => page.evaluate(() => innerWidth)).toBe(1280 / zoom);
      for (const route of [
        { name: 'home', url: '/' },
        { name: 'investigations', url: '/?page=journeys' },
        { name: 'reading', url: '/?subject=nalanda&pack=C5&year=680' },
        { name: 'notebook', url: '/?page=notebook' },
      ]) {
        try {
          await page.goto(origin + route.url);
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          if (route.name === 'reading')
            await expect(page.locator('.dossier')).toHaveAttribute(
              'data-reading-ready',
              'true',
            );
          else await expect(page.locator('main h1')).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          if (route.name === 'reading') {
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
          }
          const measured = await page.evaluate(() => ({
            innerWidth,
            innerHeight,
            outerWidth,
            dpr: devicePixelRatio,
            visualScale: visualViewport.scale,
            scrollWidth: document.documentElement.scrollWidth,
          }));
          assert.equal(measured.innerWidth, 1280 / zoom);
          assert.equal(measured.outerWidth, 1280);
          assert.equal(measured.dpr, zoom);
          assert.equal(measured.visualScale, 1);
          assert(measured.scrollWidth <= measured.innerWidth + 1);
          await capture(`zoom-${route.name}-${theme}-${zoom}x.png`);
          result.checks.push({
            route: route.name,
            theme,
            requestedZoom: zoom,
            reportedZoom: setting,
            ...measured,
          });
          if (route.name === 'reading') {
            const dialogBounds = [];
            async function fits(dialog, name) {
              const box = await dialog.boundingBox();
              assert(
                box &&
                  box.x >= -1 &&
                  box.y >= -1 &&
                  box.x + box.width <= measured.innerWidth + 1 &&
                  box.y + box.height <= measured.innerHeight + 1,
                `${name} exceeds zoomed viewport: ${JSON.stringify(box)}`,
              );
              dialogBounds.push({ name, ...box });
            }
            await page.locator('.inline-term').first().click();
            const definition = page.locator('.glossary-dialog[open]');
            await expect(definition).toBeVisible();
            await fits(definition, 'glossary');
            await page.keyboard.press('Escape');
            await expect(definition).not.toBeVisible();
            await page.locator('.image-open').click();
            await expect(page.locator('.inspection[open]')).toBeVisible();
            await fits(page.locator('.inspection[open]'), 'image inspection');
            await expect
              .poll(() =>
                page
                  .locator('.inspection-scroll img')
                  .evaluate((el) => el.complete && el.naturalWidth > 0),
              )
              .toBe(true);
            await page.locator('.inspection-scroll img').evaluate((el) => el.decode());
            await page.keyboard.press('Escape');
            const opener = page.getByRole('button', { name: 'Search the atlas' });
            await opener.click();
            const search = page.locator('.search-dialog[open]');
            await search.getByRole('searchbox').fill('0 CE');
            await expect(search.locator('.search-count')).toHaveText(
              'There is no year zero. Try 1 BCE or 1 CE.',
            );
            const bounds = await search.boundingBox();
            assert(
              bounds.x >= -1 && bounds.x + bounds.width <= measured.innerWidth + 1,
            );
            await fits(search, 'search');
            await expect(
              search.getByText(
                'Opening full-text search… Names and summaries are ready.',
                { exact: true },
              ),
            ).toHaveCount(0);
            await capture(`zoom-search-${theme}-${zoom}x.png`);
            await search.locator('.search-count').scrollIntoViewIfNeeded();
            await capture(`zoom-search-feedback-${theme}-${zoom}x.png`);
            await search.getByRole('button', { name: 'Close search' }).click();
            await expect(opener).toBeFocused();
            await page
              .getByRole('button', { name: 'Save a question', exact: true })
              .click();
            const save = page.locator('.save-dialog[open]');
            await expect(save).toBeVisible();
            await fits(save, 'save question');
            await save.locator('textarea[name=answer]').fill('Zoom reading response');
            await save.getByRole('button', { name: 'Save on this device' }).click();
            await expect(save).not.toBeVisible();
            result.checks.push({
              route: 'reading-dialogs',
              theme,
              requestedZoom: zoom,
              glossary: true,
              imageInspection: true,
              search: true,
              notebookSave: true,
              dialogBounds,
            });
          }
        } catch (error) {
          result.failures.push({
            route: route.name,
            theme,
            zoom,
            error: String(error).slice(0, 1100),
          });
        }
      }
    }
  }
} finally {
  try {
    await context.close();
  } finally {
    await fs.writeFile(
      `${out}/browser-zoom.json`,
      JSON.stringify(result, null, 2) + '\n',
    );
    await fs.rm(temporary, { recursive: true, force: true });
  }
}
assert.equal(result.failures.length, 0, JSON.stringify(result.failures));

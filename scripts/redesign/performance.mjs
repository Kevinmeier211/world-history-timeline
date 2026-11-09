import process from 'node:process';
import assert from 'node:assert/strict';
/* global document, performance, PerformanceObserver, MutationObserver, console, window */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const root = process.env.ATLAS_URL ?? 'http://127.0.0.1:4174';
const out = process.env.ATLAS_REPORT_DIR
  ? `${process.env.ATLAS_REPORT_DIR}/performance`
  : 'output/redesign/final';
const requestedEncoding = process.env.ATLAS_ENCODING;
if (requestedEncoding) assert(['gzip', 'br'].includes(requestedEncoding));
const browser = await chromium.launch();
try {
  const results = [];
  for (const presentation of ['stories', 'timeline'])
    for (const mobile of [false, true])
      for (let trial = 1; trial <= 3; trial++) {
        const context = await browser.newContext({
          viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
          extraHTTPHeaders: requestedEncoding
            ? { 'Accept-Encoding': requestedEncoding }
            : {},
          hasTouch: mobile,
          isMobile: mobile,
        });
        try {
          const page = await context.newPage();
          const encodingProof = [];
          page.on('response', (response) => {
            if (
              response.url().startsWith(root) &&
              response.status() === 200 &&
              ['document', 'script', 'stylesheet', 'fetch'].includes(
                response.request().resourceType(),
              )
            )
              encodingProof.push({
                url: response.url(),
                encoding: response.headers()['content-encoding'] ?? 'identity',
              });
          });
          const cdp = await context.newCDPSession(page);
          await cdp.send('Network.enable');
          await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
          if (mobile) {
            await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
            await cdp.send('Network.emulateNetworkConditions', {
              offline: false,
              latency: 150,
              downloadThroughput: 200000,
              uploadThroughput: 93750,
              connectionType: 'cellular4g',
            });
          }
          await page.addInitScript(() => {
            window.__metrics = {
              cls: 0,
              lcp: 0,
              longTasks: [],
              longTaskEntries: [],
              searchClickAt: null,
              searchDialogOpenAt: null,
            };
            document.addEventListener(
              'click',
              (event) => {
                if (event.target.closest?.('.search-trigger'))
                  window.__metrics.searchClickAt = performance.now();
              },
              { capture: true },
            );
            new MutationObserver((records) => {
              for (const record of records)
                if (record.target.matches?.('.search-dialog[open]'))
                  window.__metrics.searchDialogOpenAt = performance.now();
            }).observe(document, {
              subtree: true,
              attributes: true,
              attributeFilter: ['open'],
            });
            new PerformanceObserver((list) => {
              for (const e of list.getEntries())
                if (!e.hadRecentInput) window.__metrics.cls += e.value;
            }).observe({ type: 'layout-shift', buffered: true });
            new PerformanceObserver((list) => {
              window.__metrics.lcp = list.getEntries().at(-1)?.startTime ?? 0;
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver((list) => {
              window.__metrics.longTasks.push(
                ...list.getEntries().map((e) => e.duration),
              );
              window.__metrics.longTaskEntries.push(
                ...list
                  .getEntries()
                  .map((e) => ({ startTime: e.startTime, duration: e.duration })),
              );
            }).observe({ type: 'longtask', buffered: true });
          });
          await page.goto(
            presentation === 'stories' ? `${root}/?view=stories` : `${root}/`,
            { waitUntil: 'domcontentloaded' },
          );
          await page
            .locator(presentation === 'stories' ? '.story-gallery' : '.living-timeline')
            .first()
            .waitFor();
          const textUseful = await page.evaluate(() => performance.now());
          // Measure the default living timeline and the explicit gallery entrance.
          const imageSelector =
            presentation === 'stories' ? '.story-gallery img' : '.living-preview img';
          await page.locator(imageSelector).first().scrollIntoViewIfNeeded();
          await page.waitForFunction((selector) => {
            const image = document.querySelector(selector);
            return image?.complete && image.naturalWidth > 0;
          }, imageSelector);
          await page
            .locator(imageSelector)
            .first()
            .evaluate((i) => i.decode());
          await page.evaluate(() => document.fonts.ready);
          const illustratedUseful = await page.evaluate(() => performance.now());
          const start = Date.now();
          await page
            .getByRole('button', { name: 'Search', exact: false })
            .first()
            .click();
          await page.getByRole('searchbox').waitFor();
          const searchMs = Date.now() - start;
          await page
            .getByText('Opening full-text search… Names and summaries are ready.', {
              exact: true,
            })
            .waitFor({ state: 'hidden' });
          const searchIndexReadyMs = Date.now() - start;
          await page.getByRole('searchbox').pressSequentially('Han');
          const selectStart = Date.now();
          await page.locator('.search-results button').first().click();
          await page.locator('.dossier h1').waitFor();
          const selectionMs = Date.now() - selectStart;
          await page
            .locator(
              '.dossier[data-reading-ready=true] #main-explanation + .dossier-section',
            )
            .waitFor();
          const dossierReadyMs = Date.now() - selectStart;
          const metrics = await page.evaluate(() => ({
            ...window.__metrics,
            sourceMetadataResponseEnd:
              performance
                .getEntriesByType('resource')
                .find((entry) => entry.name.endsWith('/atlas/source-records.json'))
                ?.responseEnd ?? null,
            transferredBytes: performance
              .getEntriesByType('resource')
              .reduce((a, e) => a + (e.transferSize || 0), 0),
          }));
          results.push({
            presentation,
            profile: mobile
              ? 'phone 390×844,4×CPU,1.6Mbps down,750Kbps up,150ms latency,cold cache'
              : 'desktop1440×900,unthrottled,cold cache',
            trial,
            requestedEncoding: requestedEncoding ?? 'browser default',
            encodingProof,
            textUsefulMs: Math.round(textUseful),
            illustratedUsefulMs: Math.round(illustratedUseful),
            illustrationPath:
              presentation === 'stories'
                ? 'default navigation, first historical image'
                : 'default living timeline with first historical image',
            searchMs,
            searchIndexReadyMs,
            selectionMs,
            dossierReadyMs,
            ...metrics,
          });
          if (requestedEncoding) {
            assert(encodingProof.length > 0, 'No compression evidence captured');
            assert(
              encodingProof.every((row) => row.encoding === requestedEncoding),
              JSON.stringify(encodingProof),
            );
          }
        } finally {
          await context.close();
        }
      }
  await fs.mkdir(out, { recursive: true });
  await fs.writeFile(`${out}/performance.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));

  if (
    results.some(
      (r) =>
        r.textUsefulMs > 2500 ||
        r.illustratedUsefulMs > 2500 ||
        r.searchMs > 200 ||
        r.selectionMs > 200 ||
        r.searchIndexReadyMs > 2500 ||
        r.dossierReadyMs > 2500,
    )
  ) {
    console.error(
      'An established 2500ms useful-view / 200ms interaction target was exceeded. See all recorded trials.',
    );
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}

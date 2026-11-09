/* global document, innerWidth, localStorage */
import assert from 'node:assert/strict';
import console from 'node:console';
import { URL, URLSearchParams } from 'node:url';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import process from 'node:process';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

const origin = process.env.ATLAS_URL;
assert(origin && new URL(origin).hostname === '127.0.0.1', 'Local ATLAS_URL required');
const buildDir = process.env.ATLAS_BUILD_DIR ?? 'dist';
const raw = await fs.readFile(resolve(buildDir, 'atlas/corpus.json'));
const corpus = JSON.parse(raw);
const tracker = JSON.parse(
  await fs.readFile('docs/redesign/COMPLETION-TRACKER-2026-11-04.json'),
);
const exemplars = new Set(tracker.inspection_exemplars.map((e) => e.media));
const cards = new Set(['partition-telegram', 'partition-punjab-map']);
const sources = new Map(corpus.sources.map((s) => [s.id, s]));
const out = 'output/completion-2026-11-04/media-display';
await fs.mkdir(out, { recursive: true });
const receipt = {
  corpusSHA256: createHash('sha256').update(raw).digest('hex'),
  checks: [],
  failures: [],
  archiveLinks: [],
};
const filename = out + '/browser.json';
const save = () => fs.writeFile(filename, JSON.stringify(receipt, null, 2) + '\n');
const browser = await chromium.launch();
try {
  for (const [width, theme] of [
    [390, 'light'],
    [390, 'dark'],
    [1440, 'light'],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    try {
      await context.addInitScript(
        (value) => localStorage.setItem('chronos.theme', value),
        theme,
      );
      const page = await context.newPage();
      const apiResult = await context.request.get(origin + '/atlas/corpus.json');
      assert.deepEqual(await apiResult.body(), raw, 'Serving the built corpus');
      for (const record of corpus.media) {
        try {
          const subject = corpus.subjects.find((s) => s.id === record.subject);
          const query = new URLSearchParams({
            subject: subject.id,
            object: record.id,
            pack: subject.packs[0],
            year: String(record.date.start ?? subject.interval.start),
          });
          await page.goto(origin + '/?' + query, { waitUntil: 'domcontentloaded' });
          const figure = page.locator('.object-figure');
          await expect(figure).toHaveAttribute('data-media-id', record.id);
          await expect(figure).toHaveAttribute('data-media-status', 'ready');
          await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
          await expect(figure.locator('figcaption')).toContainText(record.caption);
          const button = figure.locator('.image-open');
          await button.click();
          const dialog = page.locator('.inspection[open]');
          await expect(dialog).toBeVisible();
          const im = dialog.locator('.inspection-scroll img');
          await im.evaluate((el) => el.decode());
          const detail = await im.evaluate((el) => ({
            alt: el.alt,
            width: el.naturalWidth,
            height: el.naturalHeight,
          }));
          assert.deepEqual(detail, {
            alt: record.alt,
            width: record.width,
            height: record.height,
          });
          const fitted = await im.boundingBox();
          const region = await dialog.locator('.inspection-scroll').boundingBox();
          assert(
            fitted?.width > 0 &&
              fitted.width <= region.width + 1 &&
              fitted.height <= region.height + 1,
          );
          assert(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          );
          const source = sources.get(record.source);
          const institution = dialog.getByRole('link', {
            name: 'Read original institutional record',
          });
          if (source?.url)
            await expect(institution).toHaveAttribute('href', source.url);
          const sourceImage = dialog.getByRole('link', { name: 'Open source image' });
          assert.equal(
            new URL(await sourceImage.getAttribute('href'), origin).href,
            new URL(record.sourceImage, origin).href,
          );
          if (record.licenseUrl)
            await expect(
              dialog.getByRole('link', { name: 'Image licence' }),
            ).toHaveAttribute('href', record.licenseUrl);
          let screenshot;
          if (exemplars.has(record.id) || cards.has(record.id)) {
            screenshot = record.id + '-' + width + '-' + theme + '.png';
            await dialog.screenshot({ path: out + '/' + screenshot });
          }
          const annotations = record.annotations?.items ?? [];
          for (const note of annotations) {
            const pin = dialog.locator('[data-annotation-id="' + note.id + '"]');
            assert(await pin.isVisible());
            const equivalent = dialog.locator(
              '[data-annotation-note="' + note.id + '"]',
            );
            await expect(equivalent).toContainText(note.text);
            assert(note.citations.length > 0);
            assert.equal(await equivalent.locator('details.citations').count(), 1);
          }
          await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
          await expect(dialog.locator('output')).toHaveText('150%');
          await expect
            .poll(async () =>
              Math.abs((await im.boundingBox()).width / fitted.width - 1.5),
            )
            .toBeLessThan(0.02);
          const zoomRatio = (await im.boundingBox()).width / fitted.width;
          await dialog.getByRole('button', { name: 'Zoom out', exact: true }).click();
          await expect(dialog.locator('output')).toHaveText('100%');
          const altViews = record.additionalImages ?? [];
          for (const [idx, path] of altViews.entries()) {
            await dialog.getByRole('combobox').selectOption(String(idx + 1));
            await expect(im).toHaveAttribute('src', new URL(path, origin).pathname);
            await im.evaluate((el) => el.decode());
            assert(record.additionalImageAlts?.[idx]?.trim());
            await expect(im).toHaveAttribute('alt', record.additionalImageAlts[idx]);
            assert.equal(await dialog.locator('[data-annotation-id]').count(), 0);
          }
          // Exercise the two external source affordances exactly once per replacement card.
          if (cards.has(record.id) && theme === 'light' && width === 390) {
            for (const [name, link] of [
              ['image', sourceImage],
              ['record', institution],
            ]) {
              const expected = new URL(await link.getAttribute('href'), origin).href;
              const popupPromise = page.waitForEvent('popup', { timeout: 25000 });
              await link.click();
              const popup = await popupPromise;
              try {
                const response = await context.request.get(expected, {
                  timeout: 18000,
                  failOnStatusCode: false,
                });
                await popup
                  .waitForLoadState('domcontentloaded', { timeout: 18000 })
                  .catch(() => {});
                receipt.archiveLinks.push({
                  id: record.id,
                  name,
                  expected,
                  popupURL: popup.url(),
                  httpStatus: response.status(),
                  contentType: response.headers()['content-type'],
                });
              } catch (err) {
                receipt.archiveLinks.push({
                  id: record.id,
                  name,
                  expected,
                  popupURL: popup.url(),
                  error: String(err).slice(0, 375),
                });
              } finally {
                await popup.close();
              }
            }
          }
          await dialog.getByRole('button', { name: 'Close inspection' }).click();
          await expect(button).toBeFocused();
          const readings = [];
          if (exemplars.has(record.id)) {
            for (const [idx, item] of subject.evidenceReading.items.entries()) {
              const article = page.locator('.evidence-reading article').nth(idx);
              await expect(article.locator('blockquote')).toHaveText(item.text);
              await expect(article).toContainText(item.interpretation);
              await article.locator('summary').click();
              const links = await article
                .locator('a')
                .evaluateAll((elements) => elements.map((element) => element.href));
              for (const citation of item.citations) {
                const url = sources.get(citation.source)?.url;
                assert(url && links.includes(new URL(url, origin).href), item.label);
              }
              readings.push({ label: item.label, citations: item.citations });
            }
          }
          receipt.checks.push({
            id: record.id,
            width,
            theme,
            decoded: detail,
            fit: [fitted.width, fitted.height],
            zoomRatio,
            focusReturned: true,
            additionalViews: altViews.length,
            annotationNotes: annotations.length,
            readings,
            screenshot,
          });
        } catch (err) {
          const problem = {
            id: record.id,
            width,
            theme,
            message: String(err).slice(0, 950),
          };
          console.error(problem);
          receipt.failures.push(problem);
          if (receipt.failures.length >= 5)
            throw Error('Five failures; check the receipt before continuing');
        }
        if ((receipt.checks.length + receipt.failures.length) % 25 === 0) {
          await save();
          console.log(
            'Media display checks',
            receipt.checks.length,
            'failures',
            receipt.failures.length,
          );
        }
      }
    } finally {
      await context.close();
    }
  }
  assert.equal(receipt.archiveLinks.length, cards.size * 2);
  for (const link of receipt.archiveLinks) {
    assert.equal(link.popupURL, link.expected);
    assert.equal(link.httpStatus, 200);
    assert(link.contentType.startsWith(link.name === 'image' ? 'image/' : 'text/html'));
  }
  assert.equal(receipt.failures.length, 0);
  assert.equal(receipt.checks.length, corpus.media.length * 3);
} finally {
  try {
    await browser.close();
  } finally {
    await save();
  }
}

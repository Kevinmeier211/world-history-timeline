import process from 'node:process';
/* global document, console, Storage */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const root = process.env.ATLAS_URL ?? 'http://127.0.0.1:4174';
const out = process.env.ATLAS_REPORT_DIR
  ? `${process.env.ATLAS_REPORT_DIR}/reading`
  : 'output/redesign/followup';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  const results = [];
  for (const width of [390, 768, 1440, 1720]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`${root}/?view=timeline&scale=world`);
    await page.locator('.timeline-reference > summary').click();
    await page.locator('.era-row').last().scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Search the atlas' }).click();
    await page.getByRole('searchbox').fill('Qin');
    await page.locator('.search-results button').first().click();
    const title = page.locator('.dossier h1');
    await expect(title).toContainText('Qin');
    await expect(title).toBeFocused();
    await expect(title).toBeInViewport({ ratio: 1 });
    const sources = page.locator('.dossier-top button').filter({ hasText: 'Sources' });
    await sources.click();
    const evidence = page.locator('[data-evidence-title]');
    await expect(evidence).toBeFocused();
    await expect(evidence).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.claims article').first()).toBeVisible();
    const axe = (await new AxeBuilder({ page }).analyze()).violations;
    assert.deepEqual(axe, []);
    if (width === 390) {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${out}/phone-evidence.png` });
    }
    const copied = page.url();
    await page.goBack();
    await expect(sources).toBeFocused();
    await page.goForward();
    await expect(evidence).toBeFocused();
    await expect(evidence).toBeInViewport({ ratio: 1 });
    await page.goto(copied);
    await expect(evidence).toBeFocused();
    await expect(evidence).toBeInViewport({ ratio: 1 });
    await page.getByRole('button', { name: 'Fold claim notes' }).click();
    await expect(evidence).toBeFocused();
    await expect(evidence).toBeInViewport({ ratio: 1 });
    await page.getByRole('button', { name: 'Show in world context' }).click();
    await expect(page.locator('details.dossier-context')).toHaveJSProperty(
      'open',
      true,
    );
    await expect(page.locator('[data-context-title]')).toBeFocused();
    await expect(page.locator('[data-context-title]')).toBeInViewport({ ratio: 1 });
    await page.goto(`${root}/?subject=eastern-han&pack=C4&scale=local&year=200`);
    await page.locator('.object-choices button').nth(1).click();
    await expect(page.locator('.dossier .image-open')).toBeFocused();
    await expect(page.locator('.dossier .image-open')).toBeInViewport({ ratio: 1 });
    await page.goto(`${root}/?page=journeys`);
    await page
      .getByRole('button', { name: 'Begin investigation →', exact: true })
      .first()
      .click();
    await expect(page.locator('[data-journey-title]')).toBeFocused();
    await expect(page.locator('[data-journey-title]')).toBeInViewport({ ratio: 1 });
    await page.getByRole('button', { name: 'Next stop →', exact: true }).click();
    await expect(page.locator('[data-journey-title]')).toBeFocused();
    await expect(page.locator('[data-journey-title]')).toBeInViewport({ ratio: 1 });
    // The same action must remain useful when world context is already selected.
    await page.getByRole('button', { name: 'Show in world context' }).click();
    await expect(page.locator('details.dossier-context')).toHaveJSProperty(
      'open',
      true,
    );
    await expect(page.locator('[data-context-title]')).toBeFocused();
    await expect(page.locator('[data-context-title]')).toBeInViewport({ ratio: 1 });
    assert.deepEqual(errors, []);
    results.push({
      width,
      result: 'pass',
      axe,
      checks: [
        'search focus from deep overview',
        'sources focus and visibility',
        'Back/Forward and copied evidence URL',
        'fold preserves reading position',
        'world context including repeated activation',
        'object and journey reading targets',
      ],
    });
    await context.close();
  }
  for (const blocked of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      acceptDownloads: true,
    });
    if (blocked)
      await context.addInitScript(() => {
        const write = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (key === 'chronos.household.v1')
            throw new Error('Storage unavailable in this test');
          return write.call(this, key, value);
        };
      });
    const page = await context.newPage();
    await page.goto(`${root}/?subject=hine-labor&pack=C8&scale=local&year=1908`);
    await page.getByRole('button', { name: 'Save a question', exact: true }).click();
    await page
      .locator('textarea[name=answer]')
      .fill('The photograph and caption make different kinds of claims.');
    await page.locator('input[name=collection]').fill('Material evidence');
    await page
      .getByRole('button', { name: 'Save on this device', exact: true })
      .click();
    await expect(page.locator('.save-dialog')).not.toBeVisible();
    if (blocked)
      await expect(page.locator('.app-message')).toContainText(
        'Export the notebook now',
      );
    await page.getByRole('button', { name: 'Search the atlas' }).click();
    await page.getByRole('searchbox').fill('Qin');
    await page.locator('.search-results button').first().click();
    await page.getByRole('button', { name: 'Save a question', exact: true }).click();
    await expect(page.locator('textarea[name=answer]')).toHaveValue('');
    await expect(page.locator('input[name=collection]')).toHaveValue('Household');
    await page
      .locator('textarea[name=answer]')
      .fill('This should be discarded when I cancel.');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('button', { name: 'Save a question', exact: true }).click();
    await expect(page.locator('textarea[name=answer]')).toHaveValue('');
    await page
      .getByRole('button', { name: 'Save on this device', exact: true })
      .click();
    await page.getByRole('button', { name: 'Notebook', exact: true }).click();
    await expect(page.locator('.notebook-list article')).toHaveCount(2);
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export notebook' }).click();
    const path = `${out}/notebook-${blocked ? 'blocked' : 'normal'}.json`;
    await (await download).saveAs(path);
    const notebook = JSON.parse(await fs.readFile(path, 'utf8'));
    assert.equal(notebook.notes.length, 2);
    assert.equal(notebook.notes.find((n) => n.title.includes('Qin')).answer, '');
    assert.match(
      notebook.notes.find((n) => n.title.includes('cotton')).answer,
      /photograph and caption/,
    );
    results.push({
      storage: blocked ? 'blocked' : 'normal',
      result: 'pass',
      checks: [
        'new and cancelled drafts reset',
        'answers stay with their subject',
        'session notes remain exportable when persistence fails',
      ],
    });
    await context.close();
  }
  await fs.writeFile(`${out}/reading-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}

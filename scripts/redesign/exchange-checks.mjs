/* global document */
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { assertReaderMap } from './assert-reader-map.mjs';
const root = process.env.ATLAS_URL;
if (!root) throw Error('Use the isolated candidate browser runner.');
const out = process.env.ATLAS_REPORT_DIR + '/exchange';
await fs.mkdir(out, { recursive: true });
const cases = [
  ['palmyra', 'met-322375', 200],
  ['kushan-contexts', 'met-39385', 159],
  ['aksum', 'beta-samati-coins', 600],
];
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const external = [],
      errors = [];
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === new URL(root).origin)
        return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    for (const [id, object, year] of cases) {
      await page.goto(
        `${root}/?pack=C4&subject=${id}&object=${object}&scale=local&year=${year}`,
      );
      await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
      await expect(page.locator('.dossier h1')).toBeFocused();
      await page.locator('.family-start > summary').click();
      await expect(page.locator('.family-start > ol')).toBeVisible();
      await page
        .locator('.deeper-reading details')
        .first()
        .locator(':scope > summary')
        .click();
      await expect(page.locator('.reference-timeline')).toBeVisible();
      await page.locator('.image-open img').evaluate((i) => i.decode());
      const expected =
        object === 'beta-samati-coins'
          ? /beta-samati-coins\.webp$/
          : new RegExp(object.replace('met-', '') + '-0\\.webp$');
      await expect(page.locator('.image-open img')).toHaveAttribute('src', expected);
      const controls = page.locator('.place-index button');
      for (let i = 0; i < (await controls.count()); i++) {
        await controls.nth(i).press('Enter');
        await expect(controls.nth(i)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.place-explanation h3')).toHaveText(
          (await controls.nth(i).innerText()).replace(/^\d+\.\s*/, ''),
        );
      }
      assert.ok(
        await page
          .locator('.place-point')
          .evaluateAll((nodes) =>
            nodes.every(
              (n) =>
                n.getBoundingClientRect().width >= 44 &&
                n.getBoundingClientRect().height >= 44,
            ),
          ),
      );
      await page
        .locator('.place-study')
        .screenshot({ path: `${out}/${id}-map-${width}.png` });
      await page.reload();
      await expect(page.locator('.image-open img')).toHaveAttribute('src', expected);
      await page.getByText('Object record and credit', { exact: true }).click();
      await expect(
        page.getByRole('link', { name: 'Read the image licence ↗' }),
      ).toHaveAttribute(
        'href',
        object === 'beta-samati-coins'
          ? 'https://creativecommons.org/licenses/by/4.0/'
          : 'https://creativecommons.org/publicdomain/zero/1.0/',
      );
      if (id === 'aksum') {
        await expect(page.locator('.object-figure')).toContainText('2019');
        await expect(page.locator('.object-figure')).toContainText('fourth–seventh');
        await expect(page.locator('.object-figure')).toContainText('Dumitru');
      }
      await page.locator('.image-open').click();
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(page.locator('.inspection output')).toHaveText('150%');
      if (id === 'kushan-contexts') {
        await page.locator('.inspection').locator('select').selectOption('1');
        await page.locator('.inspection img').evaluate((i) => i.decode());
        await expect(page.locator('.inspection img')).toHaveAttribute(
          'src',
          /39385-1\.webp$/,
        );
      }
      await page.keyboard.press('Escape');
      await expect(page.locator('.inspection[open]')).toHaveCount(0);
      assert.deepEqual(
        (await new AxeBuilder({ page }).analyze()).violations,
        [],
        `${width}/${id}`,
      );
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
      );
      await page.screenshot({ path: `${out}/${id}-${width}.png` });
      results.push({
        id,
        width,
        reading: true,
        places: true,
        deepLink: true,
        inspection: true,
        axe: [],
      });
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await context.close();
  }
  const page = await browser.newPage();
  for (const [id] of cases) {
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-print').waitFor();
    if (id === 'aksum')
      await expect(page.locator('.reader-image img').first()).toHaveAttribute(
        'src',
        /beta-samati-coins\.webp$/,
      );
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => i.decode()));
    });
    await assertReaderMap(page);
    await page.pdf({
      path: `${out}/${id}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
  }
  await page.goto(
    `${root}/?pack=C4&subject=aksum&compare=kushan-contexts&scale=local&year=600`,
  );
  await expect(page.locator('.comparison')).toContainText('Work and coordination');
  await page.goto(`${root}/?view=world&pack=C5&year=600&scale=era`);
  await expect(page.locator('.reference-contexts')).toContainText(
    'Aksum, Adulis and inland work',
  );
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'C4 reading, geographic controls, object provenance/rights, two coin views, comparison and later Aksum context passed at four widths; three readers exported.',
  );
} finally {
  await browser.close();
}

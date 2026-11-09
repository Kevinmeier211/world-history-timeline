/* global document */
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { assertReaderMap } from './assert-reader-map.mjs';
import fs from 'node:fs/promises';
import process from 'node:process';
const root = process.env.ATLAS_URL;
if (!root) throw Error('Use the isolated candidate browser runner.');
const out = process.env.ATLAS_REPORT_DIR + '/early-cities';
await fs.mkdir(out, { recursive: true });
const cases = [
  ['uruk-accounts', 'uruk-accounting-diagram', 'An account selects information'],
  [
    'dholavira',
    'dholavira-water-diagram',
    'Dholavira: water components and a research question',
  ],
  ['liangzhu', 'liangzhu-water-diagram', 'Liangzhu: materials, water and production'],
];
const browser = await chromium.launch();
const results = [];
let page;
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
    page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    for (const [id, diagram, title] of cases) {
      await page.goto(`${root}/?pack=C1&subject=${id}&scale=local`);
      await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
      await expect(page.locator('.dossier h1')).toBeFocused();
      await page.locator('.family-start > summary').click();
      await expect(page.locator('.family-start > ol')).toBeVisible();
      await page
        .locator('.deeper-reading details')
        .first()
        .locator(':scope > summary')
        .click();
      await expect(
        page.locator('.deeper-reading details').first().locator('p').first(),
      ).toBeVisible();
      await expect(page.locator('.reference-timeline')).toBeVisible();
      await page
        .locator('.object-choices')
        .getByRole('button', {
          name: new RegExp('^' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        })
        .click();
      await page.locator('.image-open img').evaluate((img) => img.decode());
      await expect(page.locator('.image-open img')).toHaveAttribute(
        'src',
        new RegExp(diagram + '\\.svg$'),
      );
      const clear = await page.locator('.image-open').evaluate((button) => {
        const image = button.querySelector('img').getBoundingClientRect();
        const label = button.querySelector('span').getBoundingClientRect();
        return label.top >= image.bottom;
      });
      assert.ok(clear, 'Inspection control does not cover diagram content');
      await page.reload();
      await expect(page.locator('.image-open img')).toHaveAttribute(
        'src',
        new RegExp(diagram + '\\.svg$'),
      );
      await page.getByText('Object record and credit', { exact: true }).click();
      await expect(page.locator('.object-figure figcaption')).toContainText(
        'explanatory diagram',
      );
      await expect(
        page.getByRole('link', { name: 'Read the image licence ↗' }),
      ).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
      await page.locator('.image-open').click();
      await expect(page.locator('dialog[open]')).toBeVisible();
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(page.locator('dialog output')).toHaveText('150%');
      await page.keyboard.press('Escape');
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      assert.deepEqual(violations, [], `${id}/${width}: accessibility`);
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `${id}/${width}: overflow`,
      );
      await page
        .locator('.object-figure')
        .screenshot({ path: `${out}/${id}-diagram-${width}.png` });
      await page.locator('.dossier h1').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/${id}-${width}.png` });
      results.push({
        id,
        width,
        reading: true,
        diagram: true,
        deepLink: true,
        inspection: true,
        axe: violations,
      });
    }
    await page.goto(`${root}/?pack=C1&subject=dholavira&compare=liangzhu&scale=local`);
    await expect(page.locator('.comparison-dimension')).toHaveCount(3);
    await page.goto(`${root}/?view=world&pack=C1&year=-2400&scale=era`);
    await expect(page.locator('.reference-contexts')).toContainText(
      'Uruk: urban growth',
    );
    assert.deepEqual(external, [], 'No external requests');
    assert.deepEqual(errors, [], 'No runtime errors');
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  page = await context.newPage();
  for (const [id] of cases) {
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-bibliography').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode()));
    });
    await assertReaderMap(page);
    await expect(
      page.locator('.reader-image[data-depiction="explanatory diagram"]'),
    ).toHaveCount(1);
    const fits = await page
      .locator('.reader-image[data-depiction="explanatory diagram"]')
      .evaluate((figure) => {
        const styles = document.defaultView.getComputedStyle(figure);
        const height =
          figure.getBoundingClientRect().height +
          parseFloat(styles.marginTop) +
          parseFloat(styles.marginBottom);
        return height <= 1056 - (28 / 25.4) * 96;
      });
    assert.ok(fits, 'Diagram and full caption fit within one printable Letter page');
    await page.pdf({
      path: `${out}/${id}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
  }
  await context.close();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  process.stdout.write(
    'C1 reading layers, diagrams, deep links, inspection and accessibility passed at four widths; three readers exported.\n',
  );
} catch (error) {
  if (page && !page.isClosed())
    await page.screenshot({ path: `${out}/failure.png`, fullPage: true });
  throw error;
} finally {
  await browser.close();
}

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
const out = process.env.ATLAS_REPORT_DIR + '/bronze-institutions';
await fs.mkdir(out, { recursive: true });
const cases = [
  ['hattusha-change', 'hattusha-evidence-diagram', -1200],
  ['uluburun', 'uluburun-evidence-diagram', -1320],
  ['shang-ritual', 'shang-practices-diagram', -1200],
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
    for (const [id, diagram, year] of cases) {
      await page.goto(
        `${root}/?pack=C2&subject=${id}&object=${diagram}&scale=local&year=${year}`,
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
      await expect(
        page.locator('.deeper-reading details').first().locator('p').first(),
      ).toBeVisible();
      await expect(page.locator('.reference-timeline')).toBeVisible();
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
    await page.goto(
      `${root}/?pack=C2&subject=uluburun&compare=shang-ritual&scale=local`,
    );
    await expect(page.locator('.comparison-dimension')).toHaveCount(3);
    await page.goto(`${root}/?view=world&pack=C2&year=-1197&scale=era`);
    await expect(page.locator('.reference-contexts')).toContainText(
      'Hattusha: settlement, capital and transformation',
    );
    assert.deepEqual(external, [], 'No external requests');
    assert.deepEqual(errors, [], 'No runtime errors');
    await page.goto(
      `${root}/?pack=C2&subject=shang-ritual&object=met-44781&scale=local&year=-1200`,
    );
    await page.locator('.image-open img').evaluate((img) => img.decode());
    await expect(page.locator('.image-open img')).toHaveAttribute(
      'src',
      /44781-0\.webp$/,
    );
    await page.getByText('Object record and credit', { exact: true }).click();
    await expect(page.locator('.object-figure figcaption')).toContainText(
      'possibly Anyang',
    );
    await expect(
      page.getByRole('link', { name: 'Read the image licence ↗' }),
    ).toHaveAttribute('href', 'https://creativecommons.org/publicdomain/zero/1.0/');
    await page
      .locator('.object-figure')
      .screenshot({ path: `${out}/gong-${width}.png` });
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
  for (const [, diagram] of cases) {
    await page.goto(`${root}/atlas/media/${diagram}.svg`);
    const labelsFit = await page.evaluate(() => {
      const boxes = [...document.querySelectorAll('rect')].map((r) => r.getBBox());
      return [...document.querySelectorAll('text.head')].every((label) => {
        const t = label.getBBox();
        return boxes
          .slice(1)
          .some(
            (b) =>
              t.x >= b.x + 8 &&
              t.y >= b.y + 8 &&
              t.x + t.width <= b.x + b.width - 8 &&
              t.y + t.height <= b.y + b.height - 8,
          );
      });
    });
    assert.ok(labelsFit, `${diagram}: labels stay within their panels with padding`);
  }
  await context.close();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  process.stdout.write(
    'C2 reading layers, diagrams, deep links, inspection and accessibility passed at four widths; three readers exported.\n',
  );
} catch (error) {
  if (page && !page.isClosed())
    await page.screenshot({ path: `${out}/failure.png`, fullPage: true });
  throw error;
} finally {
  await browser.close();
}

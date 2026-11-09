/* global document */
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL;
if (!root) throw Error('Use npm run test:browser with an isolated current build.');
const out = process.env.ATLAS_REPORT_DIR + '/citizenship';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const rows = [];
const ids = ['indonesia-independence', 'ghana-independence', 'south-africa-rights'];
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
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(root);
    await page.locator('.app-footer').waitFor();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Skip to atlas', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    for (const id of ids) {
      await page.goto(root + '/?pack=C8&subject=' + id + '&scale=local');
      await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
      await expect(page.locator('.dossier h1')).toBeFocused();
      await page.locator('.image-open img').evaluate((image) => image.decode());
      const rendered = await page.locator('.image-open img').evaluate((image) => ({
        width: image.getBoundingClientRect().width,
        native: image.naturalWidth,
      }));
      assert.ok(
        rendered.width <= rendered.native + 1,
        'Do not enlarge a small source image in the reading view',
      );
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
      const buttons = page.locator('.place-index button');
      await buttons.last().press('Enter');
      await expect(buttons.last()).toHaveAttribute('aria-pressed', 'true');
      const lastName = (await buttons.last().innerText()).replace(/^\d+\.\s*/, '');
      await expect(page.locator('.place-explanation h3')).toHaveText(lastName);
      const targets = await page.locator('.place-point').evaluateAll((elements) =>
        elements.map((e) => {
          const b = e.getBoundingClientRect();
          return [b.width, b.height];
        }),
      );
      assert.ok(
        targets.every(([w, h]) => w >= 44 && h >= 44),
        'Map touch targets stay at least 44 pixels',
      );
      if (id === 'ghana-independence') {
        await expect(page.locator('.place-cluster')).toBeVisible();
        await page.locator('.place-cluster').press('Enter');
        await expect(page.locator('.place-overlap-choices')).toContainText('Tema');
      }
      if (id === 'south-africa-rights') {
        await expect(page.locator('.reference-timeline')).toContainText('8 May 1996');
        await expect(page.locator('.reference-timeline')).toContainText(
          '10 December 1996',
        );
        await expect(page.locator('.reference-timeline')).toContainText(
          '4 February 1997',
        );
        await page.getByText('Object record and credit', { exact: true }).click();
        await expect(
          page.getByRole('link', { name: 'Read the image licence ↗' }),
        ).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/3.0/');
      }
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      await fs.writeFile(
        out + '/axe-' + id + '-' + width + '.json',
        JSON.stringify(violations, null, 2),
      );
      assert.deepEqual(violations, [], id + '/' + width + ' accessibility');
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        id + '/' + width + ' page overflow',
      );
      await page
        .locator('.place-study')
        .screenshot({ path: out + '/' + id + '-map-' + width + '.png' });
      await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: out + '/' + id + '-' + width + '.png' });
      rows.push({
        id,
        width,
        result: 'pass',
        checks: [
          'reading layers',
          'source image sizing',
          'keyboard place selection',
          'grouped targets',
          '44px map targets',
          'axe',
          'page bounds',
        ],
      });
    }
    await page.goto(
      root +
        '/?pack=C8&subject=indonesia-independence&compare=ghana-independence&scale=local',
    );
    await expect(
      page.getByRole('heading', { name: 'Compare without ranking' }),
    ).toBeVisible();
    await expect(page.locator('.comparison-dimension')).toHaveCount(3);
    await page.reload();
    await expect(page.locator('.comparison-dimension')).toHaveCount(3);
    await page.goto(root + '/?view=world&pack=C8&year=1950&scale=era');
    await expect(page.locator('.reference-contexts')).toContainText(
      'Indonesia: revolution',
    );
    await expect(page.locator('.reference-contexts')).toContainText(
      'Ghana: organizing',
    );
    await expect(
      page.locator('.nearby-context').filter({ hasText: '1947' }),
    ).toHaveCount(1);
    if (width === 390) {
      await page.goto(root + '/?pack=C8&subject=ghana-independence&scale=local');
      await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
      await page
        .getByRole('button', { name: 'Use dark appearance', exact: true })
        .click();
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      assert.deepEqual(violations, []);
      await fs.writeFile(out + '/axe-dark-390.json', JSON.stringify(violations));
      await page.screenshot({ path: out + '/ghana-dark-390.png' });
    }
    assert.deepEqual(external, [], 'Atlas loads without external requests');
    assert.deepEqual(errors, [], 'No runtime errors');
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  page = await context.newPage();
  for (const id of ids) {
    await page.goto(root + '/?print=reader&subject=' + id);
    await page.locator('.reader-bibliography').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    await assertReaderMap(page);
    await page.pdf({
      path: out + '/' + id + '.pdf',
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
  }
  await context.close();
  await fs.writeFile(out + '/checks.json', JSON.stringify(rows, null, 2));
  process.stdout.write(
    'Citizenship readings, map controls, comparison, 1950 context and accessibility passed at four widths.\n',
  );
} catch (error) {
  if (page && !page.isClosed())
    await page.screenshot({ path: out + '/failure.png', fullPage: true });
  throw error;
} finally {
  await browser.close();
}

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
if (!root) throw Error('Use an isolated candidate preview.');
const out = process.env.ATLAS_REPORT_DIR + '/obligations';
await fs.mkdir(out, { recursive: true });
const cases = [
  ['song-art', 'song-loan-diagram', 1069],
  ['mali-networks', 'catalan-musa-detail', 1375],
  ['inca-weaving', 'met-313152', 1500],
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
        `${root}/?pack=C6&subject=${id}&object=${object}&scale=local&year=${year}`,
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
      const expected = object.startsWith('met-')
        ? /313152-0\.webp$/
        : new RegExp(
            object + '\\.' + (object.includes('diagram') ? 'svg' : 'webp') + '$',
          );
      await page.locator('.image-open img').evaluate((i) => i.decode());
      await expect(page.locator('.image-open img')).toHaveAttribute('src', expected);
      const controls = page.locator('.place-index button');
      for (let i = 0; i < (await controls.count()); i++) {
        await controls.nth(i).press('Enter');
        await expect(controls.nth(i)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.place-explanation h3')).toHaveText(
          (await controls.nth(i).innerText()).replace(/^\d+\.\s*/, ''),
        );
      }
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
        id === 'mali-networks'
          ? 'https://creativecommons.org/publicdomain/mark/1.0/'
          : object.startsWith('met-')
            ? 'https://creativecommons.org/publicdomain/zero/1.0/'
            : 'https://creativecommons.org/licenses/by/4.0/',
      );
      await page.locator('.image-open').click();
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(page.locator('.inspection output')).toHaveText('150%');
      await page.keyboard.press('Escape');
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
  for (const id of ['song-loan-diagram', 'inka-work-diagram']) {
    await page.goto(`${root}/atlas/media/${id}.svg`);
    const bounds = await page.locator('svg text').evaluateAll((nodes) =>
      nodes.map((n) => {
        const b = n.getBBox();
        return {
          text: n.textContent,
          fontSize: parseFloat(document.defaultView.getComputedStyle(n).fontSize),
          x: b.x,
          y: b.y,
          right: b.x + b.width,
          bottom: b.y + b.height,
        };
      }),
    );
    assert.ok(
      bounds.every(
        (b) =>
          b.x >= 0 &&
          b.y >= 0 &&
          b.right <= 600 &&
          b.bottom <= (id === 'song-loan-diagram' ? 300 : 650),
      ),
      JSON.stringify(bounds),
    );
    if (id === 'song-loan-diagram') {
      const before = bounds.find((b) => b.text === 'BEFORE HARVEST');
      assert.ok(
        before && before.x >= 38 && before.right <= 272,
        'Label must retain padding inside its box',
      );
      assert.ok(
        bounds.every((b) => b.fontSize >= 24),
        'Family guide retains its 24 px minimum intrinsic label size',
      );
    }
  }
  await page.goto(
    `${root}/?pack=C6&subject=song-art&compare=inca-weaving&scale=local&year=1069`,
  );
  await expect(page.locator('.comparison')).toContainText(
    'Work, obligation and benefit',
  );
  await page.goto(`${root}/?view=world&pack=C6&year=1250&scale=era`);
  await expect(page.locator('.reference-contexts')).toContainText('Song institutions');
  await expect(page.locator('.reference-contexts')).toContainText(
    'Mali and West African',
  );
  await page.goto(`${root}/?print=family&pack=C6`);
  await page.emulateMedia({ media: 'print' });
  const family = page.locator('.family-sheet').filter({
    has: page.getByRole('heading', {
      name: 'Who supplied the work, and who gets to describe its benefits?',
      exact: true,
    }),
  });
  await expect(family.locator('img')).toHaveAttribute('src', /song-loan-diagram\.svg$/);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode()));
  });
  const smallestPoints = await family.locator('img').evaluate((img) => {
    const style = document.defaultView.getComputedStyle(img);
    const width =
      img.getBoundingClientRect().width -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);
    const height =
      img.getBoundingClientRect().height -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);
    return (24 * Math.min(width / 600, height / 300) * 72) / 96;
  });
  assert.ok(
    smallestPoints >= 9.5,
    `Family diagram smallest label is ${smallestPoints} pt`,
  );
  await family.screenshot({ path: `${out}/family-c6.png` });
  results.push({ familyDiagramSmallestPoints: smallestPoints });
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'C6 reading, maps, attribution, diagram bounds and comparison passed at four widths; three readers exported.',
  );
} finally {
  await browser.close();
}

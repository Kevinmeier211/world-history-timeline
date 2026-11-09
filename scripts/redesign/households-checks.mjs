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
const out = process.env.ATLAS_REPORT_DIR + '/households';
await fs.mkdir(out, { recursive: true });
const cases = [
  ['old-kingdom', 'giza-provisioning-diagram', -2450],
  ['caral', 'caral-renewal-diagram', -2400],
  ['skara-brae', 'skara-household-guide', -2800],
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
        `${root}/?pack=C1&subject=${id}&object=${object}&scale=local&year=${year}`,
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
      await expect(page.locator('.image-open img')).toHaveAttribute(
        'src',
        new RegExp(object + '\\.svg$'),
      );
      const controls = page.locator('.place-index button');
      assert.ok((await controls.count()) >= 2);
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
      await expect(page.locator('.image-open img')).toHaveAttribute(
        'src',
        new RegExp(object + '\\.svg$'),
      );
      await page.getByText('Object record and credit', { exact: true }).click();
      await expect(
        page.getByRole('link', { name: 'Read the image licence ↗' }),
      ).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
      await page.locator('.image-open').click();
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(page.locator('.inspection output')).toHaveText('150%');
      await page.keyboard.press('Escape');
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      assert.deepEqual(
        violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        [],
        `${id}/${width}`,
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
    assert.deepEqual(external, []);
    assert.deepEqual(errors, []);
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1000, height: 1200 } });
  const page = await context.newPage();
  const smallestFonts = {};
  for (const [id, object] of cases) {
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
    await page.goto(`${root}/atlas/media/${object}.svg`);
    const labels = await page.locator('svg text').evaluateAll((nodes) =>
      nodes.map((e) => {
        const b = e.getBBox(),
          v = e.ownerSVGElement.viewBox.baseVal;
        return {
          text: e.textContent,
          x: b.x,
          y: b.y,
          right: b.x + b.width,
          bottom: b.y + b.height,
          width: v.width,
          height: v.height,
          font: parseFloat(document.defaultView.getComputedStyle(e).fontSize),
        };
      }),
    );
    assert.ok(labels.length >= 4);
    assert.deepEqual(
      labels.filter(
        (b) =>
          b.x < -0.1 ||
          b.y < -0.1 ||
          b.right > b.width + 0.1 ||
          b.bottom > b.height + 0.1,
      ),
      [],
    );
    smallestFonts[object] = Math.min(...labels.map((l) => l.font));
    results.push({
      id,
      diagramLabelBounds: labels,
      minimumSVGFontPx: smallestFonts[object],
    });
    if (id === 'skara-brae') {
      await expect(page.locator('svg text').filter({ hasText: /^Slab$/ })).toHaveCount(
        4,
      );
      await expect(page.locator('svg text').filter({ hasText: /^Wider$/ })).toHaveCount(
        1,
      );
    }
  }
  await page.goto(`${root}/?print=family&pack=C1`);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode()));
  });
  const family = page.locator('.family-sheet[data-journey="homes-provision-renewal"]');
  await expect(family).toHaveCount(1);
  await expect(family.locator('img')).toHaveAttribute(
    'src',
    /skara-household-guide\.svg$/,
  );
  await expect(family.locator('.family-claim')).toContainText(
    'Explain one task the guide helps you imagine.',
  );
  await expect(family.locator('.family-source-summary')).toContainText(
    'Nineteenth-century rebuilding omitted recorded cells',
  );
  const scale = await family.locator('img').evaluate((img) => {
    const s = document.defaultView.getComputedStyle(img),
      b = img.getBoundingClientRect();
    return Math.min(
      (b.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)) /
        img.naturalWidth,
      (b.height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom)) /
        img.naturalHeight,
    );
  });
  const smallestPoints = (smallestFonts['skara-household-guide'] * scale * 72) / 96;
  assert.ok(smallestPoints >= 10, `Family guide smallest label${smallestPoints}pt`);
  await family.screenshot({ path: `${out}/family-c1-households.png` });
  results.push({ familyGuideSmallestPoints: smallestPoints });
  await fs.writeFile(
    `${out}/print-geometry.json`,
    JSON.stringify(
      { smallestFonts, familyGuideSmallestPoints: smallestPoints },
      null,
      2,
    ),
  );
  await page.goto(`${root}/?pack=C1&subject=caral&compare=skara-brae&year=-2700`);
  await expect(page.locator('.comparison')).toBeVisible();
  await expect(page.locator('.comparison')).toContainText(
    'Maintaining places and work',
  );
  await page.goto(`${root}/?view=world&pack=C1&year=-2700&scale=era`);
  await expect(page.locator('.reference-contexts')).toContainText('Caral-Supe');
  await expect(page.locator('.reference-contexts')).toContainText('Skara Brae');
  await context.close();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'C1 household readings, source/date distinctions, geographic controls, three diagram bounds, comparison and family label size passed at four widths; three readers exported.',
  );
} finally {
  await browser.close();
}

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
const out = process.env.ATLAS_REPORT_DIR + '/learning';
await fs.mkdir(out, { recursive: true });
const cases = [
  ['tang-city', 'tang-access-diagram', 700],
  ['abbasid-craft', 'met-452833', 950],
  ['nalanda', 'nalanda-brick-photo', 680],
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
        `${root}/?pack=C5&subject=${id}&object=${object}&scale=local&year=${year}`,
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
      const expected =
        object === 'met-452833'
          ? /452833-0\.webp$/
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
        object.startsWith('met-')
          ? 'https://creativecommons.org/publicdomain/zero/1.0/'
          : id === 'nalanda'
            ? 'https://creativecommons.org/licenses/by-sa/4.0/'
            : 'https://creativecommons.org/licenses/by/4.0/',
      );
      if (id === 'nalanda') {
        await expect(page.locator('.object-figure')).toContainText('2023');
        await expect(page.locator('.object-figure')).toContainText('Sumit Surai');
        await expect(page.locator('.object-figure')).toContainText('conservation');
      }
      await page.locator('.image-open').click();
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(page.locator('.inspection output')).toHaveText('150%');
      if (id === 'abbasid-craft') {
        await page.locator('.inspection select').selectOption('1');
        await page.locator('.inspection img').evaluate((i) => i.decode());
        await expect(page.locator('.inspection img')).toHaveAttribute(
          'src',
          /452833-1\.webp$/,
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
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => i.decode()));
    });
    await assertReaderMap(page);
    const fits = await page
      .locator('.reader-image[data-depiction="explanatory diagram"]')
      .evaluateAll((nodes) =>
        nodes.every((n) => {
          const st = document.defaultView.getComputedStyle(n);
          return (
            n.getBoundingClientRect().height +
              parseFloat(st.marginTop) +
              parseFloat(st.marginBottom) <=
            1056 - (28 / 25.4) * 96
          );
        }),
      );
    assert.ok(fits, 'Diagram and complete caption fit one printable Letter page');
    await page.pdf({
      path: `${out}/${id}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
  }
  await page.goto(`${root}/?print=family&pack=C5`);
  const family = page.locator('.family-sheet').filter({
    has: page.getByRole('heading', {
      name: 'How do institutions organize access and everyday work?',
      exact: true,
    }),
  });
  await expect(family.locator('img')).toHaveAttribute(
    'src',
    /tang-access-diagram\.svg$/,
  );
  await expect(family).toContainText('gate closed');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode()));
  });
  await family.screenshot({ path: `${out}/family-c5.png` });
  for (const id of ['tang-access-diagram', 'abbasid-work-diagram']) {
    await page.goto(`${root}/atlas/media/${id}.svg`);
    const bounds = await page.locator('svg text').evaluateAll((nodes) =>
      nodes.map((n) => {
        const b = n.getBBox();
        return {
          text: n.textContent,
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
          b.bottom <= (id === 'tang-access-diagram' ? 400 : 780),
      ),
      JSON.stringify(bounds),
    );
  }
  await page.goto(
    `${root}/?pack=C5&subject=tang-city&object=met-44800&scale=local&year=700`,
  );
  await expect(page.locator('.image-open img')).toHaveAttribute(
    'src',
    /44800-0\.webp$/,
  );
  await page.goto(
    `${root}/?pack=C5&subject=abbasid-craft&compare=nalanda&scale=local&year=950`,
  );
  await expect(page.locator('.comparison')).toContainText('Work and coordination');
  await page.goto(`${root}/?view=world&pack=C5&year=900&scale=era`);
  await expect(page.locator('.reference-contexts')).toContainText('Chang’an before');
  await expect(page.locator('.reference-contexts')).toContainText('Abbasid-era Iraq');
  await expect(page.locator('.reference-contexts')).toContainText(
    'Nalanda: institutional',
  );
  const retryContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  let unavailable = true;
  await retryContext.route('**/atlas/source-scopes.json', (route) =>
    unavailable ? route.abort() : route.continue(),
  );
  const retryPage = await retryContext.newPage();
  await retryPage.goto(`${root}/?pack=C5&subject=tang-city&year=700&scale=local`);
  await expect(retryPage.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  const notes = retryPage.locator('.dossier-section .citations').first();
  await notes.locator(':scope > summary').click();
  await expect(notes).toContainText('Original records remain linked');
  await expect(notes.locator('a').first()).toHaveAttribute('href', /^https:\/\//);
  unavailable = false;
  await notes.getByRole('button', { name: 'Retry source details' }).click();
  await expect(notes.locator('.source-scope').first()).toContainText(
    'Full university essay',
  );
  await retryContext.close();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'C5 reading, three geographic studies, source-date/rights distinctions, two bowl views and diagram bounds passed at four widths; three readers exported.',
  );
} finally {
  await browser.close();
}

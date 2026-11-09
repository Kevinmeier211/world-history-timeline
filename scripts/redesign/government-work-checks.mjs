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
const out = process.env.ATLAS_REPORT_DIR + '/government-work';
await fs.mkdir(out, { recursive: true });
const cases = [
  ['qin-administration', 'qin-records-diagram', -216],
  ['ashoka-messages', 'ashoka-messages-diagram', -250],
  ['athens-water', 'met-247244', -430],
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
    for (const [id, object, year] of cases) {
      const isDiagram = object !== 'met-247244';
      const expected = isDiagram ? new RegExp(object + '\\.svg$') : /247244-0\.webp$/;
      await page.goto(
        `${root}/?pack=C3&subject=${id}&object=${object}&scale=local&year=${year}`,
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
      await page.locator('.image-open img').evaluate((i) => i.decode());
      await expect(page.locator('.image-open img')).toHaveAttribute('src', expected);
      if (isDiagram) {
        const clear = await page
          .locator('.image-open')
          .evaluate(
            (b) =>
              b.querySelector('span').getBoundingClientRect().top >=
              b.querySelector('img').getBoundingClientRect().bottom,
          );
        assert.ok(clear, 'Diagram control leaves its content unobscured');
      }
      const places = page.locator('.place-index button');
      for (let i = 0; i < (await places.count()); i++) {
        await places.nth(i).press('Enter');
        await expect(places.nth(i)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.place-explanation h3')).toHaveText(
          (await places.nth(i).innerText()).replace(/^\d+\.\s*/, ''),
        );
      }
      const touch = await page
        .locator('.place-point')
        .evaluateAll((nodes) =>
          nodes.every(
            (n) =>
              n.getBoundingClientRect().width >= 44 &&
              n.getBoundingClientRect().height >= 44,
          ),
        );
      assert.ok(touch, 'Map controls stay at least 44px');
      await page
        .locator('.place-study')
        .screenshot({ path: `${out}/${id}-map-${width}.png` });
      await page.reload();
      await expect(page.locator('.image-open img')).toHaveAttribute('src', expected);
      await page.getByText('Object record and credit', { exact: true }).click();
      await expect(page.locator('.object-figure figcaption')).toContainText(
        isDiagram ? 'explanatory diagram' : 'object photograph',
      );
      await expect(
        page.getByRole('link', { name: 'Read the image licence ↗' }),
      ).toHaveAttribute(
        'href',
        isDiagram
          ? 'https://creativecommons.org/licenses/by/4.0/'
          : 'https://creativecommons.org/publicdomain/zero/1.0/',
      );
      await page.locator('.image-open').click();
      await expect(page.locator('dialog[open]')).toBeVisible();
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(page.locator('dialog output')).toHaveText('150%');
      await page.keyboard.press('Escape');
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      assert.deepEqual(violations, [], `${id}/${width}: axe`);
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `${id}/${width}: no page overflow`,
      );
      await page
        .locator('.object-figure')
        .screenshot({ path: `${out}/${id}-object-${width}.png` });
      await page.locator('.dossier h1').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/${id}-${width}.png` });
      results.push({
        id,
        width,
        reading: true,
        places: true,
        deepLink: true,
        inspection: true,
        axe: violations,
      });
    }
    await page.goto(
      `${root}/?pack=C3&subject=qin-administration&compare=ashoka-messages&scale=local&year=-216`,
    );
    await expect(page.locator('.comparison-dimension')).toHaveCount(3);
    await page.goto(`${root}/?view=world&pack=C3&year=-240&scale=era`);
    await expect(page.locator('.reference-contexts')).toContainText(
      'Qin projects, imperial rule and local records',
    );
    assert.deepEqual(external, [], 'C3 assets remain local');
    assert.deepEqual(errors, [], 'No C3 runtime errors');
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  page = await context.newPage();
  for (const [id] of cases) {
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-bibliography').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => i.decode()));
    });
    await assertReaderMap(page);
    await expect(
      page.locator('.reader-image[data-depiction="explanatory diagram"]'),
    ).toHaveCount(id === 'athens-water' ? 0 : 1);
    if (id !== 'athens-water') {
      const fits = await page
        .locator('.reader-image[data-depiction="explanatory diagram"]')
        .evaluate((f) => {
          const s = document.defaultView.getComputedStyle(f);
          return (
            f.getBoundingClientRect().height +
              parseFloat(s.marginTop) +
              parseFloat(s.marginBottom) <=
            1056 - (28 / 25.4) * 96
          );
        });
      assert.ok(fits, 'Diagram, caption, credit and licence fit printable Letter page');
    }
    const map = await page.locator('.place-map-canvas').evaluate((e) => ({
      h: e.getBoundingClientRect().height,
      svg: e.querySelector('svg').getBoundingClientRect().height,
      borders:
        parseFloat(document.defaultView.getComputedStyle(e).borderTopWidth) +
        parseFloat(document.defaultView.getComputedStyle(e).borderBottomWidth),
    }));
    assert.ok(
      Math.abs(map.h - map.svg - map.borders) < 0.5,
      'Map retains SVG aspect ratio',
    );
    const pills = await page.locator('.place-point').evaluateAll((nodes) =>
      nodes.map((n) => ({
        w: n.clientWidth,
        sw: n.scrollWidth,
        h: n.clientHeight,
        sh: n.scrollHeight,
      })),
    );
    assert.ok(
      pills.every((n) => n.sw <= n.w + 2 && n.sh <= n.h + 2),
      'Print map numbers contained',
    );
    await page.pdf({
      path: `${out}/${id}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
  }
  for (const [, object] of cases.filter(([, o]) => o !== 'met-247244')) {
    await page.goto(`${root}/atlas/media/${object}.svg`);
    const fit = await page.evaluate(() => {
      const boxes = [...document.querySelectorAll('rect')]
        .slice(1)
        .map((r) => r.getBBox());
      const all = [...document.querySelectorAll('text')].every((t) => {
        const b = t.getBBox();
        return b.x >= 0 && b.y >= 0 && b.x + b.width <= 600 && b.y + b.height <= 780;
      });
      return (
        all &&
        [...document.querySelectorAll('text.head')].every((t) => {
          const a = t.getBBox();
          return boxes.some(
            (b) =>
              a.x >= b.x + 8 &&
              a.y >= b.y + 8 &&
              a.x + a.width <= b.x + b.width - 8 &&
              a.y + a.height <= b.y + b.height - 8,
          );
        })
      );
    });
    assert.ok(fit, `${object}: all text within SVG and headings padded within panels`);
  }
  await context.close();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  process.stdout.write(
    'C3 reading layers, three place studies, object/diagram links, inspection and accessibility passed at four widths; three readers exported.\n',
  );
} catch (e) {
  if (page && !page.isClosed())
    await page.screenshot({ path: `${out}/failure.png`, fullPage: true });
  throw e;
} finally {
  await browser.close();
}

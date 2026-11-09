/* global document, HTMLInputElement, Event, performance, requestAnimationFrame */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { URL, URLSearchParams } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { chromium } from 'playwright';

const root = process.env.ATLAS_URL;
if (!root) throw Error('Set ATLAS_URL to the isolated local preview.');
const timeline = '?page=explore&view=timeline&scale=world&pack=C4&year=200+CE';
const corpus = JSON.parse(readFileSync('public/atlas/index.json', 'utf8'));
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    const pinRome = page.getByRole('button', {
      name: 'Pin to compare: The Roman world around 200',
      exact: true,
    });
    const pinHan = page.getByRole('button', {
      name: 'Pin to compare: Eastern Han',
      exact: true,
    });
    const tray = page.locator('.compare-pin-tray');

    await page.goto(root + '/' + timeline);
    await pinRome.click();
    await expect(pinRome).toHaveAttribute('aria-pressed', 'true');
    await expect(tray).toBeInViewport();
    await expect(tray.getByRole('status')).toHaveText(
      'Pinned: The Roman world around 200. Pin one more to compare.',
    );
    await pinHan.click();
    await tray.getByRole('button', { name: 'Compare', exact: true }).click();
    await expect(page.locator('.comparison h1')).toBeFocused();
    const params = new URL(page.url()).searchParams;
    assert.equal(params.get('subject'), 'roman-world');
    assert.equal(params.get('compare'), 'eastern-han');
    const returnTo = new URLSearchParams(params.get('return'));
    assert.equal(returnTo.get('view'), 'timeline');
    assert.equal(returnTo.get('scale'), 'world');
    assert.equal(returnTo.get('year'), '200 CE');

    const partnerGroups = page.getByLabel('Compare with').locator('optgroup');
    const groups = await partnerGroups.evaluateAll((groups) =>
      groups.map((group) => ({
        label: group.label,
        ids: [...group.children].map((option) => option.value),
      })),
    );
    assert.deepEqual(
      groups.map((group) => group.label),
      ['Authored comparisons', 'Cases in the same chapter', 'Other cases'],
    );
    assert.equal(groups[0].ids[0], 'eastern-han');
    assert.ok(groups[1].ids.includes('colima'));
    assert.deepEqual(
      groups.flatMap((group) => group.ids).sort(),
      corpus.subjects
        .map((subject) => subject.id)
        .filter((id) => id !== 'roman-world')
        .sort(),
    );

    await page.goBack();
    await expect(page.getByRole('slider')).toHaveAttribute('aria-valuetext', '200 CE');
    await expect(pinRome).toHaveAttribute('aria-pressed', 'false');
    await expect(pinHan).toHaveAttribute('aria-pressed', 'false');
    await expect(tray).toHaveCount(0);

    await page
      .getByRole('button', { name: 'Meanwhile elsewhere', exact: true })
      .click();
    await pinHan.click();
    await expect(tray.getByRole('status')).toHaveText(
      'Pinned: Eastern Han. Pin one more to compare.',
    );
    await page.getByRole('slider').press('ArrowRight');
    await page.getByRole('button', { name: 'Explore 201 CE', exact: true }).click();
    await expect(page.locator('.meanwhile-view h1')).toHaveText(
      'Meanwhile, around 201 CE…',
    );
    await expect(pinHan).toHaveAttribute('aria-pressed', 'true');
    await tray.getByRole('button', { name: 'Clear comparison pins' }).click();
    await expect(tray).toHaveCount(0);

    await page.goto(root + '/' + timeline);
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const median = await slider.evaluate(async (element) => {
      const setValue = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      ).set;
      const durations = [];
      for (let i = 0; i < 30; i++) {
        const start = performance.now();
        setValue.call(element, String(-3000 + i * 160));
        element.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
        durations.push(performance.now() - start);
      }
      return Math.round(durations.sort((a, b) => a - b)[15]);
    });
    await expect(slider).toHaveAttribute('aria-valuetext', '1640 CE');
    process.stdout.write(`Full-history slider median over 30 steps: ${median} ms.\n`);
    assert.ok(median < 50, 'Full-history slider median must be under 50 ms.');

    const routes = [
      ['home', '', '.living-timeline'],
      ['world', '?view=world&pack=C4&year=200+CE', '.meanwhile-view'],
      ['dossier', '?subject=roman-world', '.dossier[data-reading-ready=true]'],
      ['compare', '?subject=roman-world&compare=eastern-han', '.comparison-dimension'],
    ];
    for (const theme of ['light', 'dark']) {
      await page.goto(root);
      await expect(page.locator('.living-timeline')).toBeVisible();
      if (theme === 'dark')
        await page.getByRole('button', { name: 'Use dark appearance' }).click();
      for (const [label, query, ready] of routes) {
        await page.goto(root + '/' + query);
        await expect(page.locator(ready).first()).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const { violations } = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(
          violations.map(({ id, nodes }) => ({
            id,
            targets: nodes.map((node) => node.target),
          })),
          [],
          `${theme} ${label}`,
        );
        for (const width of [320, 390]) {
          await page.setViewportSize({ width, height: 844 });
          assert.ok(
            await page.evaluate(
              () =>
                document.documentElement.scrollWidth <=
                document.documentElement.clientWidth,
            ),
            `${theme} ${label} overflows at ${width}px`,
          );
        }
        await page.setViewportSize({ width: 1440, height: 900 });
      }
    }
  } finally {
    await context.close();
  }
  process.stdout.write(
    'Pinned comparison, return, year persistence, partner order, axe and reflow passed.\n',
  );
} finally {
  await browser.close();
}

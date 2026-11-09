/* global document, innerWidth, console */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const results = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await page.getByRole('button', { name: 'Search', exact: false }).first().click();
  await page.getByRole('searchbox').fill('Han');
  await page.getByRole('button', { name: /Eastern Han.*25–220/ }).click();
  await page.locator('.dossier h1').waitFor();
  assert.equal(await page.locator('.search-dialog').count(), 0);
  assert.equal(await page.locator('.dossier h1').textContent(), 'Eastern Han');
  await page.reload();
  await page.locator('.dossier h1').waitFor();
  assert.equal(await page.locator('.dossier h1').textContent(), 'Eastern Han');
  await page
    .getByRole('button', { name: 'Inspect object: Central Watchtower', exact: true })
    .click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  assert.match(await page.locator('.inspection output').textContent(), /150/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.inspection').evaluate((e) => e.open), false);
  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  await page.locator('.claims').waitFor();
  assert.match(await page.locator('.claims').textContent(), /25–220/);
  await page.getByRole('button', { name: 'Save a question', exact: true }).click();
  await page
    .locator('textarea[name="answer"]')
    .fill('The tower represents an estate, not every home.');
  await page.getByRole('button', { name: 'Save on this device' }).click();
  await page.getByRole('button', { name: 'Notebook', exact: true }).click();
  assert.match(await page.locator('.notebook-list').textContent(), /Eastern Han/);
  results.push(
    'Search, dossier, reload, object inspection, evidence and local save pass.',
  );
  await page.goto('http://127.0.0.1:4173/?page=journeys');
  await page
    .locator('.journey-grid article')
    .filter({
      has: page.getByRole('heading', { name: 'The world around 200 CE', exact: true }),
    })
    .getByRole('button', { name: 'Begin investigation' })
    .click();
  for (let i = 0; i < 8; i++) {
    await page.locator('.dossier h1').waitFor();
    assert.match(
      await page.locator('.journey-context .eyebrow').textContent(),
      new RegExp(`Stop ${i + 1} of 8`),
    );
    if (i < 7) await page.getByRole('button', { name: 'Next stop' }).click();
  }
  await page
    .getByRole('button', {
      name: 'The models help investigate buildings, social meanings and possible ritual uses.',
    })
    .click();
  assert.match(await page.locator('.feedback').textContent(), /defensible claim/);
  results.push('All 8 real journey stops and reasoning feedback pass.');
  for (const [width, height] of [
    [1440, 900],
    [768, 1024],
    [390, 844],
    [320, 700],
    [1024, 768],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('http://127.0.0.1:4173/?subject=eastern-han&scale=local&pack=C4');
    await page.locator('.dossier h1').waitFor();
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    const axe = await new AxeBuilder({ page }).analyze();
    results.push({
      viewport: [width, height],
      axe: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  await fs.writeFile(
    'output/redesign/pilot/browser-checks.json',
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}

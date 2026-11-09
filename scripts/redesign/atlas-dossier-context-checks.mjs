/* global document */
import assert from 'node:assert/strict';
import process from 'node:process';
import { expect } from '@playwright/test';
import { chromium } from 'playwright';

const root = process.env.ATLAS_URL;
if (!root) throw Error('Set ATLAS_URL to the isolated local preview.');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    const disclosure = page.locator('details.dossier-context');
    const summary = disclosure.locator(':scope > summary');
    const world = disclosure.locator('.meanwhile-view');
    const showWorld = page.getByRole('button', {
      name: 'Show in world context',
      exact: true,
    });
    const heading = page.locator('h1');
    const dossier = page.locator('.dossier[data-reading-ready=true]');

    await page.goto(
      `${root}/?page=explore&view=world&scale=era&pack=C4&year=200+CE&preview=roman-world`,
    );
    await page.locator('.meanwhile-preview .preview-read').click();
    await expect(dossier).toBeVisible();
    await expect(heading).toHaveText('The Roman world around 200');
    await expect(summary).toHaveText('Show this moment in world context');
    await expect(disclosure).toHaveJSProperty('open', false);
    await expect(world).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    assert.ok(height < 11_000, `Closed Roman dossier is ${height}px tall.`);

    await showWorld.click();
    await expect(disclosure).toHaveJSProperty('open', true);
    await expect(summary).toBeFocused();
    await expect(summary).toBeInViewport({ ratio: 1 });
    await expect(
      world.getByRole('heading', { name: 'Meanwhile, around 200 CE…', level: 2 }),
    ).toBeVisible();
    await expect(heading).toHaveCount(1);
    await summary.press('Enter');
    await expect(disclosure).toHaveJSProperty('open', false);
    await expect(world).toBeHidden();
    await showWorld.click();
    await expect(disclosure).toHaveJSProperty('open', true);
    await expect(summary).toBeFocused();
    await expect(summary).toBeInViewport({ ratio: 1 });

    await page.goto(
      `${root}/?view=timeline&subject=roman-world&pack=C4&scale=local&year=200+CE`,
    );
    await expect(disclosure).toHaveJSProperty('open', false);
    await summary.click();
    await expect(disclosure).toHaveJSProperty('open', true);
    await expect(world).toBeVisible();
    await expect(heading).toHaveCount(1);
    process.stdout.write(
      `Roman dossier at 1440×900: ${height}px closed, one H1 open and closed. Disclosure focus and reopening passed.\n`,
    );
  } finally {
    await context.close();
  }
} finally {
  await browser.close();
}

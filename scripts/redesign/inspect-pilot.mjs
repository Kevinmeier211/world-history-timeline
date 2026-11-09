/* global document, innerWidth, console */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('output/redesign/pilot/screens', { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['phone', 390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const [screen, query] of [
      ['overview', ''],
      [
        'han',
        '?pack=C4&subject=eastern-han&object=met-49519&scale=local&year=200%20CE',
      ],
      ['world', '?pack=C4&view=world&year=200%20CE&scale=era'],
      [
        'compare',
        '?pack=C4&subject=colima&compare=eastern-han&scale=local&year=200%20CE',
      ],
    ]) {
      await page.goto(`http://127.0.0.1:4173/${query}`);
      await page.waitForFunction(() => document.querySelector('.app-footer'));
      await page.waitForTimeout(250);
      await page.screenshot({
        path: `output/redesign/pilot/screens/${name}-${screen}.png`,
        fullPage: screen === 'compare',
      });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      console.log(JSON.stringify({ name, screen, overflow, errors }));
    }
    await page.close();
  }
} finally {
  await browser.close();
}

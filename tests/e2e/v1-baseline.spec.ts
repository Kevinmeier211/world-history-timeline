import { expect, test } from '@playwright/test';

import { yearToY } from '../../src/utils/timeLayout';

const scenes = [
  { id: 'default', year: null },
  { id: 'ancient', year: -2500 },
  { id: 'classical', year: 100 },
  { id: 'modern', year: 1800 },
] as const;

test('v1 baseline scenes', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  await page.goto('/?v1=1', { waitUntil: 'domcontentloaded' });
  const viewport = page.locator('.timeline-scroll-viewport');
  await expect(viewport).toBeAttached();
  await Promise.race([
    page.evaluate(() => document.fonts.ready),
    page.waitForTimeout(2_500),
  ]);

  for (const scene of scenes) {
    if (scene.year !== null) {
      const targetY = yearToY(scene.year, 'POSTER_WARPED', 1.05);
      const height = page.viewportSize()?.height ?? 900;
      const top = Math.max(0, targetY - height * 0.4);
      await viewport.evaluate((element, scrollTop) => {
        element.scrollTop = scrollTop;
      }, top);
    }
    await page.screenshot({
      path: `docs/shots/v1/${testInfo.project.name}-${scene.id}.png`,
      animations: 'disabled',
    });
  }
});

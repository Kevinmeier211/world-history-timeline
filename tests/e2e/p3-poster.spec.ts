import { expect, test, type Page } from '@playwright/test';

import { yOfYear } from '../../src/layout/drift';

const YEARS = {
  ancient: -2500,
  classical: 100,
  medieval: 1000,
  modern: 1800,
} as const;

/** A short fit shows several eras at once. Zoom until their scroll targets separate. */
async function ensureEraWindow(page: Page): Promise<void> {
  const designYs = [-2500, 100, 1000, 1800].map((year) => yOfYear(year));
  for (let i = 0; i < 12; i += 1) {
    const tops = await page.evaluate((ys) => {
      const scroller = document.querySelector('.poster-scroll');
      const svg = document.querySelector('svg.stage');
      if (!(scroller instanceof HTMLElement) || !(svg instanceof SVGSVGElement))
        return [];
      const viewHeight = svg.viewBox.baseVal.height || 1;
      const scale = svg.getBoundingClientRect().height / viewHeight;
      const port = scroller.clientHeight;
      const max = Math.max(0, scroller.scrollHeight - port);
      return ys.map((y) => Math.min(max, Math.max(0, y * scale - port * 0.28)));
    }, designYs);
    const separated = tops.every(
      (top, index) => index === 0 || top - (tops[index - 1] ?? 0) >= 120,
    );
    if (separated) return;
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await page.waitForTimeout(30);
  }
}

async function scrollToYear(page: Page, year: number): Promise<void> {
  const designY = yOfYear(year);
  await page.evaluate((y) => {
    const scroller = document.querySelector('.poster-scroll');
    const svg = document.querySelector('svg.stage');
    if (!(scroller instanceof HTMLElement) || !(svg instanceof SVGSVGElement)) return;
    const viewHeight = svg.viewBox.baseVal.height;
    if (viewHeight <= 0) return;
    const scale = svg.getBoundingClientRect().height / viewHeight;
    const port = scroller.clientHeight;
    const top = y * scale - port * 0.28;
    const max = Math.max(0, scroller.scrollHeight - port);
    scroller.scrollTop = Math.min(max, Math.max(0, top));
    scroller.scrollLeft = 0;
  }, designY);
}

async function shoot(page: Page, project: string, scene: string): Promise<void> {
  await page.screenshot({
    path: `docs/shots/p3/${project}-${scene}.png`,
    animations: 'disabled',
  });
}

async function hoverVisibleRibbon(page: Page): Promise<void> {
  const hits = page.locator('.ribbon-hit');
  const count = await hits.count();
  const view = page.viewportSize();
  const viewW = view?.width ?? 1440;
  const viewH = view?.height ?? 900;
  for (let i = 0; i < count; i += 1) {
    const box = await hits.nth(i).boundingBox();
    if (!box || box.width < 2) continue;
    const top = Math.max(box.y, 200);
    const bottom = Math.min(box.y + box.height, viewH - 48);
    const x = box.x + Math.min(box.width / 2, 24);
    if (bottom - top < 10 || x < 16 || x > viewW - 72) continue;
    await page.mouse.move(x, (top + bottom) / 2);
    if (await page.locator('.ribbon-tip').isVisible()) return;
  }
  throw new Error('no ribbon accepted the pointer');
}

test('poster scenes', async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const project = testInfo.project.name;
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('svg.minimap');
  await page.evaluate(() => document.fonts.ready);

  await page.getByRole('button', { name: 'Overview', exact: true }).click();
  await page.waitForTimeout(200);
  await shoot(page, project, 'overview');

  await page.getByRole('button', { name: 'Fit width', exact: true }).click();
  await page.waitForTimeout(200);
  await ensureEraWindow(page);

  for (const id of ['ancient', 'classical', 'medieval', 'modern'] as const) {
    await scrollToYear(page, YEARS[id]);
    await page.waitForTimeout(120);
    await shoot(page, project, id);
  }

  await scrollToYear(page, YEARS.classical);
  await page.waitForTimeout(120);
  await hoverVisibleRibbon(page);
  await expect(page.locator('.ribbon-tip')).toBeVisible();
  await shoot(page, project, 'focus');

  await page.mouse.move(12, 12);
  await page.getByRole('button', { name: 'Theme: system' }).click();
  await page.getByRole('button', { name: 'Theme: light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await scrollToYear(page, YEARS.classical);
  await page.waitForTimeout(150);
  await shoot(page, project, 'dark');
});

import { expect, test, type Page } from '@playwright/test';

import { yOfYear } from '../../src/layout/drift';

const YEARS = {
  ancient: -2500,
  classical: 100,
  medieval: 1000,
  modern: 1800,
} as const;

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

/** DOM boxes of cards, plates, markers, and labels. Leaders are not boxes. */
async function intersections(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const nodes = [
      ...document.querySelectorAll(
        '[data-callout-card], [data-plate], [data-callout-marker], [data-label]',
      ),
    ];
    const boxes = nodes.flatMap((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return [];
      const callout =
        node.getAttribute('data-callout-card') ??
        node.getAttribute('data-plate') ??
        node.getAttribute('data-callout');
      const label = node.getAttribute('data-label');
      return [
        {
          id: callout ?? label ?? 'box',
          kind: label && !callout ? 'label' : 'callout',
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        },
      ];
    });
    const hits: string[] = [];
    for (let i = 0; i < boxes.length; i += 1) {
      const left = boxes[i];
      if (!left) continue;
      for (let j = i + 1; j < boxes.length; j += 1) {
        const right = boxes[j];
        if (!right || (left.kind === 'label' && right.kind === 'label')) continue;
        const overlap =
          left.x + left.width > right.x + 0.5 &&
          right.x + right.width > left.x + 0.5 &&
          left.y + left.height > right.y + 0.5 &&
          right.y + right.height > left.y + 0.5;
        if (overlap) hits.push(`${left.kind}:${left.id} x ${right.kind}:${right.id}`);
      }
    }
    return hits;
  });
}

test('callouts and labels do not intersect at default zoom', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('svg.stage');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: 'Fit width', exact: true }).click();
  await page.waitForTimeout(200);

  const scenes: { name: string; year?: number }[] = [
    { name: 'fit' },
    { name: 'ancient', year: YEARS.ancient },
    { name: 'classical', year: YEARS.classical },
    { name: 'medieval', year: YEARS.medieval },
    { name: 'modern', year: YEARS.modern },
  ];
  for (const scene of scenes) {
    if (scene.year !== undefined) await scrollToYear(page, scene.year);
    await page.waitForTimeout(80);
    expect(await intersections(page), scene.name).toEqual([]);
  }

  await scrollToYear(page, YEARS.classical);
  const ribbon = page.locator('.ribbon-hit').first();
  if ((await ribbon.count()) > 0) await ribbon.hover({ force: true });
  expect(await intersections(page), 'focus').toEqual([]);

  await page.getByRole('button', { name: 'Theme: system' }).click();
  await page.getByRole('button', { name: 'Theme: light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await intersections(page), 'dark').toEqual([]);
});

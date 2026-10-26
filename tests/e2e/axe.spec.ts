import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoSerious(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations
    .filter((item) => item.impact === 'serious' || item.impact === 'critical')
    .map((item) => `${item.impact ?? 'unknown'} ${item.id} (${item.nodes.length})`);
  expect(serious).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('svg.stage');
});

test('chart', async ({ page }) => {
  await expectNoSerious(page);
});

test('dossier and dark theme', async ({ page }) => {
  await page.goto('/#y=-221', { waitUntil: 'domcontentloaded' });
  const han = page.locator('[data-polity="han_dynasty"] .ribbon-hit');
  await han.waitFor();
  await han.press('Enter');
  await page.getByRole('dialog', { name: 'Dossier' }).waitFor();
  await expectNoSerious(page);
  await page.getByRole('button', { name: 'Theme: system' }).click();
  await page.getByRole('button', { name: 'Theme: light' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expectNoSerious(page);
});

test('table', async ({ page }) => {
  await page.getByRole('combobox', { name: 'View' }).selectOption('table');
  await page.getByRole('table', { name: 'Polities and callouts' }).waitFor();
  await expectNoSerious(page);
});

test('search', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Search' }).fill('Han');
  await page.getByRole('dialog', { name: 'Search' }).waitFor();
  await expectNoSerious(page);
});

test('reading key', async ({ page }) => {
  await page.getByRole('button', { name: 'How to read this' }).click();
  await page.getByRole('dialog', { name: 'How to read this' }).waitFor();
  await expectNoSerious(page);
});

test('stories', async ({ page }) => {
  await page.getByRole('button', { name: 'Stories' }).click();
  await page.getByRole('region', { name: 'Stories' }).waitFor();
  await expectNoSerious(page);
});

test('columns', async ({ page }) => {
  await page.getByRole('button', { name: 'Columns' }).click();
  await page.getByRole('region', { name: 'Columns' }).waitFor();
  await expectNoSerious(page);
});

test('era reading', async ({ page }) => {
  await page.getByRole('button', { name: 'Era reading' }).click();
  await page.getByRole('region', { name: 'Era reading' }).waitFor();
  await expectNoSerious(page);
});

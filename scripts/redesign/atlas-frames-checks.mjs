import process from 'node:process';
import { URLSearchParams } from 'node:url';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

const root = process.env.ATLAS_URL;
if (!root) throw Error('Set ATLAS_URL to the isolated local preview.');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    const visit = async (year, pack, view = 'timeline', scale = 'world') => {
      const query = new URLSearchParams({ page: 'explore', view, scale, pack, year });
      await page.goto(`${root}/?${query}`);
    };

    await visit('400 BCE', 'C3');
    const gap = page.locator('.living-region[data-region="West/Central Asia"]');
    await expect(gap.locator('.coverage-gap')).toHaveText(
      'Not yet covered in this atlas.',
    );
    await expect(gap.locator('.living-bar')).toHaveCount(0);
    await expect(gap.locator('.timeline-frame-band')).toHaveCount(0);

    await visit('400 BCE', 'C3', 'world');
    const cards = page.locator('.meanwhile-cards');
    await expect(cards.locator(':scope > [data-region]')).toHaveCount(7);
    await expect(
      cards.locator('.coverage-gap[data-region="West/Central Asia"]'),
    ).toContainText('Not yet covered in this atlas.');
    await expect(page.locator('.snapshot-orientation')).toContainText(
      'A missing frame means this atlas has not covered that region at this date.',
    );

    await visit('1400 BCE', 'C2');
    await expect(page.locator('.living-track[data-subject="uluburun"]')).toContainText(
      'begins 65 years later',
    );
    await visit('1400 BCE', 'C2', 'world');
    await expect(cards.locator('[data-subject="uluburun"]')).toContainText(
      'begins 65 years later',
    );

    await visit('1600 CE', 'C7');
    await page.getByRole('button', { name: /Browse all/ }).click();
    const undated = page.locator('.living-track[data-subject="ocmulgee-council"]');
    await expect(undated).toContainText('Undated: chronology under revision');
    await expect(undated).not.toContainText('Outside this window');
    const ozette = page.locator('.living-track[data-subject="ozette-makah"]');
    await expect(ozette.locator('.living-rival-date')).toHaveCount(2);
    await expect(ozette.locator('.living-bar')).toHaveCount(0);
    await expect(ozette).toHaveAccessibleName(/Date precision: disputed/);
    const kongo = page.locator('.living-track[data-subject="kongo-translation"]');
    await expect(kongo.locator('.living-open-end.spans-year')).toBeVisible();
    await expect(kongo).toHaveAccessibleName(/No end date assigned/);

    await visit('200 CE', 'C4');
    const europe = page.locator('.living-region[data-region="Europe"]');
    const romanFrame = europe.getByRole('button', {
      name: /^Wider frame: Roman imperial rule, 27 BCE–284 CE/,
    });
    const romanCase = europe.locator(
      '.living-track[data-subject="roman-world"] .living-bar',
    );
    await expect(romanFrame).toBeVisible();
    await expect(romanCase).toBeVisible();
    await expect(romanCase.locator('.living-date-fade')).toHaveCount(0);
    const approximate = page.locator(
      '.living-track[data-subject="teotihuacan"] .living-bar',
    );
    await expect(approximate).toHaveAttribute('data-precision', 'approximate');
    await expect(approximate.locator('.living-date-fade')).toHaveCount(2);
    const frameBox = await romanFrame.boundingBox();
    const caseBox = await romanCase.boundingBox();
    assert.ok(
      caseBox.x >= frameBox.x &&
        caseBox.x + caseBox.width <= frameBox.x + frameBox.width,
    );
    assert.ok(caseBox.y >= frameBox.y + frameBox.height);
    const fullTicks = await page.locator('.living-axis > div > span').allTextContents();
    assert.deepEqual(fullTicks, [
      '3000 BCE',
      '2000 BCE',
      '1000 BCE',
      '1000 CE',
      '2000 CE',
    ]);

    await romanFrame.click();
    const notes = page.getByRole('dialog', { name: 'A wider historical frame' });
    await expect(notes).toContainText(
      'The Severans came after two centuries of imperial government.',
    );
    await notes.getByText('Evidence and source notes').click();
    await expect(
      notes.getByText(/Julio-Claudians; Severans; Diocletian sections/),
    ).toBeVisible();
    await notes.getByRole('button', { name: 'Close frame notes' }).click();
    await expect(notes).toBeHidden();
    await expect(romanFrame).toBeFocused();

    await visit('200 CE', 'C4', 'timeline', 'era');
    await expect(page.locator('.living-axis > div > span')).toHaveText([
      '100 CE',
      '200 CE',
      '300 CE',
      '400 CE',
      '500 CE',
    ]);

    await visit('1684 BCE', 'C2', 'timeline', 'era');
    const bronzeFrame = europe.getByRole('button', {
      name: /^Wider frame: Aegean centres and British farms, c. 1900–1100 BCE/,
    });
    await expect(bronzeFrame).toBeVisible();
    await expect(bronzeFrame).toHaveCSS(
      'background-image',
      /repeating-linear-gradient/,
    );
    await expect(europe.locator('.living-track')).toHaveCount(0);
    await expect(europe).not.toContainText('Skara Brae');
    await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
    await expect(bronzeFrame).toHaveCSS('border-top-style', 'dashed');
    await expect(page.locator('.living-year-line').first()).toHaveCSS(
      'transition-duration',
      '0s',
    );
    await page.emulateMedia({ forcedColors: 'none', reducedMotion: 'no-preference' });

    await page.setViewportSize({ width: 390, height: 844 });
    await visit('200 CE', 'C4');
    await expect(romanFrame).toBeVisible();
    await expect(europe.locator('.timeline-frame-lane:visible')).toHaveCount(1);
    await expect(europe.locator('.timeline-frame-label:visible')).toHaveCount(0);
  } finally {
    await context.close();
  }
  process.stdout.write(
    'Atlas coverage, nearby dates, frame bands, notes, focus, ticks and uncertainty passed.\n',
  );
} finally {
  await browser.close();
}

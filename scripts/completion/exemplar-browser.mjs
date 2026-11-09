/* global localStorage, document, innerWidth */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import process from 'node:process';
import assert from 'node:assert/strict';
const origin = process.env.ATLAS_URL;
if (!origin) throw Error('ATLAS_URL required');
const tracker = JSON.parse(
  await fs.readFile('docs/redesign/COMPLETION-TRACKER-2026-11-04.json', 'utf8'),
);
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const out = 'output/completion-2026-11-04/exemplars';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const [width, theme] of [
    [390, 'light'],
    [390, 'dark'],
    [1440, 'light'],
  ]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript(
      (theme) => localStorage.setItem('chronos.theme', theme),
      theme,
    );
    const page = await context.newPage();
    for (const [index, item] of tracker.inspection_exemplars.entries()) {
      const object = corpus.media.find((m) => m.id === item.media);
      const subject = corpus.subjects.find((s) => s.id === item.subject);
      await page.goto(
        `${origin}/?subject=${subject.id}&object=${object.id}&pack=${item.chapter}&year=${object.date.start ?? subject.interval.start}`,
      );
      await expect(page.locator('.object-figure')).toHaveAttribute(
        'data-media-id',
        object.id,
      );
      await expect(page.locator('.object-figure')).toHaveAttribute(
        'data-media-status',
        'ready',
      );
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const trigger = page.locator('.image-open');
      await trigger.click();
      const dialog = page.locator('.inspection[open]');
      await expect(dialog).toBeVisible();
      const image = dialog.locator('.inspection-scroll img');
      await image.evaluate((element) => element.decode());
      assert.ok(await image.getAttribute('alt'));
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      await expect(dialog.locator('output')).toHaveText('100%');
      await dialog.screenshot({ path: `${out}/${subject.id}-${width}-${theme}.png` });
      await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(dialog.locator('output')).toHaveText('150%');
      await dialog.getByRole('button', { name: 'Zoom out', exact: true }).click();
      await expect(dialog.locator('output')).toHaveText('100%');
      if (index === 0)
        assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
      await dialog
        .getByRole('button', { name: 'Close inspection', exact: true })
        .click();
      await expect(trigger).toBeFocused();
      assert.ok(
        subject.evidenceReading?.items.length,
        `${subject.id}: supplied text evidence`,
      );
      results.push({
        subject: subject.id,
        media: object.id,
        width,
        theme,
        decoded: true,
        zoomAndFocusReturn: true,
        textEvidenceItems: subject.evidenceReading.items.length,
      });
    }
    await context.close();
  }
  await fs.writeFile(
    `${out}/receipt.json`,
    JSON.stringify(
      {
        result: 'pass',
        scope:
          'Display/navigation checks; source and rights acceptance remain separate. Screenshots need visual inspection.',
        checks: results,
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
}

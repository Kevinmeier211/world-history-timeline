import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';

const root = process.env.ATLAS_URL;
if (!root) throw Error('Use an isolated candidate preview.');
const out = `${process.env.ATLAS_REPORT_DIR}/reference-loading`;
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    let requests = 0;
    let release;
    const held = new Promise((resolve) => {
      release = resolve;
    });
    await page.route('**/atlas/contexts.json', async (route) => {
      requests++;
      if (requests === 1) {
        await held;
        return route.fulfill({ status: 503, body: 'Temporarily unavailable' });
      }
      return route.continue();
    });
    await page.goto(`${root}/?view=timeline`);
    await expect(page.locator('.living-timeline')).toBeVisible();
    assert.equal(requests, 0, 'The overview must not fetch full reference prose.');
    await page.goto(`${root}/?pack=C2&subject=lapita&scale=local&year=-900`);
    const reading = page.locator('.reference-timeline');
    await expect(reading).toBeVisible();
    await expect(reading.getByRole('status')).toBeVisible();
    await expect(reading.locator('ol li')).toHaveCount(0);
    const summary = await reading.locator('article > p').first().textContent();
    assert.ok(summary?.length > 30);
    release();
    await reading.getByRole('button', { name: 'Retry reference reading' }).click();
    await expect(reading.locator('ol li').first()).toBeVisible();
    assert.equal(requests, 2, 'Retry must issue a fresh request after a failure.');
    const full = await (await context.request.get(`${root}/atlas/corpus.json`)).json();
    const subject = full.subjects.find((s) => s.id === 'lapita');
    const phases = full.contexts
      .filter((c) => subject.contextIds.includes(c.id))
      .flatMap((c) => c.phases);
    await expect(reading.locator('ol li')).toHaveCount(phases.length);
    for (let i = 0; i < phases.length; i++)
      await expect(reading.locator('ol li').nth(i)).toContainText(phases[i].text);
    await expect(reading.locator('article > p').first()).toHaveText(summary);
    assert.deepEqual(errors, []);
    await reading.screenshot({ path: `${out}/recovered-${width}.png` });
    results.push({
      width,
      overviewRequests: 0,
      requestsAfterRetry: requests,
      completePhases: phases.length,
      errors,
    });
    await context.close();
  }
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'Deferred reference prose: overview makes no detail request; loading, failure, retry and complete passages pass at 390/1440 pixels.',
  );
} finally {
  await browser.close();
}

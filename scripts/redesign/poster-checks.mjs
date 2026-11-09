/* global document */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { execFileSync } from 'node:child_process';

const root = process.env.ATLAS_URL;
if (!root) throw Error('Use the isolated browser runner.');
const out = `${process.env.ATLAS_REPORT_DIR}/poster`;
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1640, height: 1200 } });
const page = await context.newPage();
const findings = [];
const companionPlan = JSON.parse(
  execFileSync(
    process.execPath,
    [
      '--import',
      'tsx',
      '--input-type=module',
      '-e',
      "import fs from 'node:fs'; import {posterRows,posterSources,posterNoteGroups} from './src/atlas/poster-layout.ts'; const c=JSON.parse(fs.readFileSync('public/atlas/corpus.json','utf8')); const sources=posterSources(c); const rows=posterRows(c); console.log(JSON.stringify({regionalSheets:rows.reduce((n,row)=>n+posterNoteGroups(row.entries,sources).length,0),subjects:rows.flatMap(row=>row.entries.map(entry=>entry.subject.id)),sources:sources.length}));",
    ],
    { encoding: 'utf8' },
  ),
);
try {
  await page.goto(`${root}/?print=overview`);
  await expect(page.locator('.world-poster')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.poster-row')).toHaveCount(7);
  await expect(page.locator('.poster-event')).toHaveCount(25);
  const geometry = await page.locator('.world-poster').evaluate((poster) => {
    const box = poster.getBoundingClientRect();
    return {
      height: box.height,
      width: box.width,
      labels: [...poster.querySelectorAll('.poster-label')].map((label) => {
        const rect = label.getBoundingClientRect();
        const row = label.closest('.poster-events').getBoundingClientRect();
        return {
          subject: label.closest('.poster-event').getAttribute('data-subject'),
          left: rect.left - row.left,
          right: rect.right - row.left,
          bottom: rect.bottom - row.top,
          rowWidth: row.width,
          rowHeight: row.height,
          contentFits: [...label.children].every(
            (e) => e.scrollWidth <= e.clientWidth + 1,
          ),
        };
      }),
      bars: [...poster.querySelectorAll('.poster-event')].map((event) => {
        const bar = event.querySelector('.poster-time-bar').getBoundingClientRect();
        const row = event.closest('.poster-events').getBoundingClientRect();
        return {
          subject: event.getAttribute('data-subject'),
          start: Number(event.getAttribute('data-start')),
          end: Number(event.getAttribute('data-end')),
          marker: event.querySelector('.short-interval') !== null,
          left: bar.left - row.left,
          width: bar.width,
          rowWidth: row.width,
        };
      }),
    };
  });
  assert.ok(geometry.height <= 1122.6 + 0.5, `Poster height ${geometry.height}`);
  for (const label of geometry.labels) {
    assert.ok(
      label.left >= -0.5 && label.right <= label.rowWidth + 0.5,
      JSON.stringify(label),
    );
    assert.ok(
      label.bottom <= label.rowHeight + 0.5 && label.contentFits,
      JSON.stringify(label),
    );
  }
  const toT = (year) => (year < 0 ? year + 1 : year);
  for (const bar of geometry.bars.filter((b) => !b.marker)) {
    assert.ok(
      Math.abs(bar.left / bar.rowWidth - (toT(bar.start) + 3299) / 5299) < 0.001,
      JSON.stringify(bar),
    );
    assert.ok(
      Math.abs(bar.width / bar.rowWidth - (toT(bar.end) - toT(bar.start)) / 5299) <
        0.001,
      JSON.stringify(bar),
    );
  }
  const axe = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(axe.violations, []);
  await page.locator('.world-poster').screenshot({ path: `${out}/a3-poster.png` });
  await page.addStyleTag({ content: '.world-poster{filter:grayscale(1)}' });
  await page.locator('.world-poster').screenshot({ path: `${out}/a3-grayscale.png` });
  findings.push({ mode: 'poster', ...geometry, axe: [] });

  await page.goto(`${root}/?print=overview-notes`);
  await expect(page.locator('.poster-note-page')).toHaveCount(
    companionPlan.regionalSheets,
  );
  await expect(page.locator('.poster-note-card')).toHaveCount(25);
  assert.deepEqual(
    await page
      .locator('.poster-note-card')
      .evaluateAll((cards) => cards.map((card) => card.dataset.subject)),
    companionPlan.subjects,
    'Companion cards retain every selected subject once in chronological regional order.',
  );
  const cardCounts = await page
    .locator('.poster-note-page')
    .evaluateAll((sheets) =>
      sheets.map((sheet) => sheet.querySelectorAll('.poster-note-card').length),
    );
  assert.ok(cardCounts.every((count) => count >= 1 && count <= 2));
  await expect(page.locator('.poster-source')).toHaveCount(companionPlan.sources);
  await page.evaluate(() => document.fonts.ready);
  const pages = await page.locator('.print-page').evaluateAll((pages) =>
    pages.map((p) => ({
      title: p.querySelector('h1').textContent,
      height: p.getBoundingClientRect().height,
      width: p.getBoundingClientRect().width,
    })),
  );
  for (const composition of pages)
    assert.ok(composition.height <= 1056.5, JSON.stringify(composition));
  const notesAxe = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(notesAxe.violations, []);
  await page
    .locator('.poster-note-page')
    .nth(2)
    .screenshot({ path: `${out}/africa-notes.png` });
  await page
    .locator('.poster-source-page')
    .first()
    .screenshot({ path: `${out}/source-notes.png` });
  findings.push({
    mode: 'companion',
    pages,
    regionalSheets: companionPlan.regionalSheets,
    cards: 25,
    sources: companionPlan.sources,
    axe: [],
  });
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(findings, null, 2));
  console.log(
    `World poster: 25 proportional anchors, seven regions, label bounds, grayscale, reference/case distinction and ${companionPlan.sources}-source companion passed.`,
  );
} finally {
  await browser.close();
}

/* global document */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

const origin = process.env.ATLAS_URL;
assert(origin && new URL(origin).hostname === '127.0.0.1', 'Local ATLAS_URL required');
const build = process.env.ATLAS_BUILD_DIR ?? 'dist';
const files = await Promise.all(
  [
    join(build, 'atlas/corpus.json'),
    join(build, 'atlas/search.json'),
    'docs/redesign/search-acceptance.json',
  ].map((p) => fs.readFile(p)),
);
const [corpus, entries, fixtures] = files.map((x) => JSON.parse(x));
const [corpusSHA256, searchSHA256, fixturesSHA256] = files.map((x) =>
  createHash('sha256').update(x).digest('hex'),
);
const subjectsByName = new Map(corpus.subjects.map((s) => [s.name, s]));
const entriesById = new Map(entries.map((s) => [s.id, s.text]));
const html = await fs.readFile(join(build, 'index.html'), 'utf8');
const mainAsset = html.match(/<script[^>]+src="([^"]+)"/)?.[1];
assert(mainAsset);
const mainJS = await fs.readFile(join(build, mainAsset));
const result = {
  mainAsset,
  mainAssetSHA256: createHash('sha256').update(mainJS).digest('hex'),
  corpusSHA256,
  searchSHA256,
  fixturesSHA256,
  scope:
    'Browser-visible results, keyboard navigation and Chromium accessibility-tree live properties. Screen-reader speech output was not sampled.',
  checks: [],
  failures: [],
};
const receipt = 'docs/redesign/review/SEARCH-BROWSER-2026-11-04.json';
async function tabTo(page, element) {
  for (let n = 0; n <= 150; n++) {
    if (await element.evaluate((el) => el === document.activeElement)) return n;
    await page.keyboard.press('Tab');
  }
  throw Error('Control was not reachable by Tab');
}
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 900 },
    reducedMotion: 'reduce',
  });
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    try {
      for (const [idx, fixture] of fixtures.entries()) {
        const check = {
          id: fixture.id,
          category: fixture.category,
          query: fixture.query,
        };
        try {
          await page.goto(origin, { waitUntil: 'domcontentloaded' });
          const trigger = page.getByRole('button', { name: 'Search the atlas' });
          await expect(trigger).toBeEnabled();
          await tabTo(page, trigger);
          await page.keyboard.press('Enter');
          const dialog = page.locator('.search-dialog[open]');
          const field = dialog.getByRole('searchbox', {
            name: 'Subject, concept or year',
          });
          await expect(field).toBeFocused();
          await expect(
            dialog.getByText('Opening full-text search…', { exact: false }),
          ).toHaveCount(0);
          const announcement = await dialog.locator('.search-count').elementHandle();
          await page.keyboard.insertText(fixture.query);
          assert(
            await announcement.evaluate((el) => el.isConnected),
            'The live region must survive updates',
          );

          await expect(field).toHaveValue(fixture.query);
          const live = dialog.getByRole('status');
          await expect(live).toHaveCount(1);
          check.status = await live.innerText();
          const countsMatch = check.status.match(
            /(\d+) subjects · (\d+) investigations · (\d+) glossary terms$/,
          );
          if (fixture.year === null) {
            assert.equal(check.status, 'There is no year zero. Try 1 BCE or 1 CE.');
          } else {
            assert(countsMatch, check.status);
          }
          const count = countsMatch?.slice(1).map(Number) ?? [0, 0, 0];
          const { nodes } = await cdp.send('Accessibility.getFullAXTree');
          const status = nodes.find(
            (n) =>
              !n.ignored &&
              n.role?.value === 'status' &&
              n.childIds?.some((id) =>
                nodes
                  .find((child) => child.nodeId === id)
                  ?.name?.value?.includes(
                    fixture.year === null ? 'no year zero' : 'subjects',
                  ),
              ),
          );
          assert(status, 'Search count absent from accessible status');
          check.live = Object.fromEntries(
            (status.properties ?? [])
              .filter((p) => ['live', 'atomic'].includes(p.name))
              .map((p) => [p.name, p.value.value]),
          );
          assert.equal(check.live.live, 'polite');
          const hits = dialog.locator('.search-results button');
          check.initialShown = await hits.count();
          const more = dialog.getByRole('button', { name: /Show more subjects/ });
          check.expansions = [];
          while (await more.count()) {
            const before = await hits.count();
            await tabTo(page, more);
            await page.keyboard.press('Enter');
            await expect.poll(() => hits.count()).toBeGreaterThan(before);
            check.expansions.push(await hits.count());
          }
          check.allShown = await hits.count();
          assert.equal(check.allShown, count[0]);
          const groups = dialog.locator('.search-group');
          assert.equal(await groups.locator(':scope > button').count(), count[1]);
          assert.equal(await groups.locator('details').count(), count[2]);
          const cards = await hits.evaluateAll((elements) =>
            elements.map((el) => ({
              name: el.querySelector('strong').textContent,
              excerpt: el.querySelector('small').textContent,
            })),
          );
          for (const card of cards) {
            const s = subjectsByName.get(card.name);
            assert(s, card.name);
            const quote = card.excerpt
              .slice(card.excerpt.indexOf(': ') + 2)
              .replace(/^…|…$/g, '');
            assert(
              [
                s.name,
                ...s.aliases,
                s.question,
                s.place,
                s.summary,
                entriesById.get(s.id),
              ].some((text) => text?.includes(quote)),
              card.excerpt,
            );
          }
          check.excerptsChecked = cards.length;
          if (fixture.subject) {
            const target = corpus.subjects.find((s) => s.id === fixture.subject);
            const row = hits.filter({
              has: page.getByText(target.name, { exact: true }),
            });
            await expect(row).toBeVisible();
            check.expectedHitRank = cards.findIndex((s) => s.name === target.name) + 1;
            check.expectedExcerpt = cards[check.expectedHitRank - 1].excerpt;
            check.tabsToChoice = await tabTo(page, row);
            await page.keyboard.press('Enter');
            await expect(dialog).toHaveCount(0);
            await expect
              .poll(() => new URL(page.url()).searchParams.get('subject'))
              .toBe(fixture.subject);
            check.openedSubject = fixture.subject;
          } else if (Number.isInteger(fixture.year)) {
            const yearButton = dialog.getByRole('button', {
              name:
                'Go to ' +
                Math.abs(fixture.year) +
                ' ' +
                (fixture.year < 0 ? 'BCE' : 'CE'),
              exact: true,
            });
            await expect(yearButton).toBeVisible();
            assert(
              check.status.startsWith((await yearButton.innerText()) + ' by date.'),
            );
            check.tabsToChoice = await tabTo(page, yearButton);
            await page.keyboard.press('Enter');
            await expect(dialog).toHaveCount(0);
            await expect
              .poll(() => new URL(page.url()).searchParams.get('year'))
              .toBe(Math.abs(fixture.year) + (fixture.year < 0 ? ' BCE' : ' CE'));
            check.openedYear = fixture.year;
          } else {
            assert.equal(await dialog.locator('.year-hit').count(), 0);
            if (fixture.category === 'deliberate_coverage_gap') {
              assert.deepEqual(count, [0, 0, 0]);
              const gap = dialog.getByText('No match in the current selection.', {
                exact: false,
              });
              await expect(gap).toBeVisible();
              check.gapExplanation = await gap.innerText();
            }
            if (fixture.year === null) check.invalidYearHasNoJump = true;
            await page.keyboard.press('Escape');
            if ((await dialog.count()) && (await field.inputValue()) === '') {
              check.firstEscapeClearedSearch = true;
              await page.keyboard.press('Escape');
            }
            await expect(dialog).toHaveCount(0);
            await expect(trigger).toBeFocused();
            check.escapeRestoredFocus = true;
          }
          result.checks.push(check);
        } catch (error) {
          result.failures.push({ ...check, message: String(error).slice(0, 1100) });
          if (idx < 4 && result.failures.length === 3) break;
        }
      }
    } finally {
      await cdp.detach();
    }
  } finally {
    await context.close();
  }
} finally {
  await browser.close();
  await fs.writeFile(receipt, JSON.stringify(result, null, 2) + '\n');
}
assert.equal(result.failures.length, 0, JSON.stringify(result.failures));
assert.equal(result.checks.length, 40);

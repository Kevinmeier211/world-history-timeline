/* global console, window */
import { chromium } from 'playwright';
import { URLSearchParams } from 'node:url';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
const root = process.env.ATLAS_URL ?? 'http://127.0.0.1:4174';
const batch = process.argv[2] ?? 'expansion';
if (!['expansion', 'northern', 'woodlands'].includes(batch))
  throw Error('Unknown expansion batch');
const northern = batch === 'northern';
const woodlands = batch === 'woodlands';
const out = process.env.ATLAS_REPORT_DIR
  ? `${process.env.ATLAS_REPORT_DIR}/${batch}`
  : batch === 'expansion'
    ? 'output/redesign/expansion'
    : `output/redesign/${batch}-expansion`;
await fs.mkdir(`${out}/screens`, { recursive: true });
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const ids = woodlands
  ? [
      'ocmulgee-council',
      'wendat-laine',
      'haudenosaunee-canandaigua',
      'cherokee-print',
      'ojibwe-manoomin',
    ]
  : northern
    ? [
        'bering-sea-carvers',
        'inuinnait-sewing',
        'ozette-makah',
        'blackfoot-bison',
        'hidatsa-villages',
        'kwakwakawakw-potlatch',
      ]
    : [
        'poverty-point',
        'hopewell-earthworks',
        'chaco-communities',
        'cahokia-city',
        'ottoman-workshops',
        'isfahan-silk',
        'bukhara-books',
        'zand-iran',
      ];
const b = await chromium.launch();
try {
  const results = [];
  for (const [label, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['phone', 390, 844],
  ]) {
    const context = await b.newContext({ viewport: { width, height } });
    const p = await context.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    for (const id of ids) {
      const s = c.subjects.find((s) => s.id === id);
      const q = new URLSearchParams({
        subject: id,
        pack: s.packs[0],
        scale: 'local',
        year: String(s.interval.start ?? 1200),
      });
      if (northern || woodlands) {
        await p.goto(`${root}/?pack=${s.packs[0]}&scale=era`);
        await p.locator('.timeline-reference > summary').click();
        const entry = p
          .locator('.subject-directory button')
          .filter({ hasText: s.name });
        await expect(entry).toBeVisible();
        await entry.click();
      } else await p.goto(`${root}/?${q}`);
      await p.locator('.dossier-section').first().waitFor();
      await expect(p.locator('.dossier h1')).toHaveText(s.name);
      await expect(p.locator('.dossier h1')).toBeFocused();
      if (woodlands) {
        await p.reload();
        await expect(p.locator('.dossier h1')).toHaveText(s.name);
        assert.doesNotMatch(p.url(), /year=(?:null|0)(?:&|$)/);
      }
      const dossierAxe = (await new AxeBuilder({ page: p }).analyze()).violations;
      assert.deepEqual(dossierAxe, []);
      await p.locator('.image-open img').evaluate((i) => i.decode());
      await p.getByRole('button', { name: /^Inspect object:/ }).click();
      await p.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(p.locator('.inspection output')).toHaveText('150%');
      await p.getByRole('button', { name: 'Close inspection', exact: true }).click();
      await p.getByText('Object record and credit', { exact: true }).click();
      await expect(
        p.getByRole('link', { name: /Read original institutional record/ }),
      ).toHaveAttribute('href', /^https:\/\//);
      await p.locator('.dossier-top button').filter({ hasText: 'Sources' }).click();
      await expect(p.locator('[data-evidence-title]')).toBeFocused();
      await expect(p.locator('[data-evidence-title]')).toBeInViewport({ ratio: 1 });
      const axe = (await new AxeBuilder({ page: p }).analyze()).violations;
      assert.deepEqual(axe, []);
      results.push({ label, subject: id, dossierAxe, sourceAxe: axe, result: 'pass' });
    }
    for (const [left, right, pack, year] of woodlands
      ? [
          ['ocmulgee-council', 'wendat-laine', 'C7', 1600],
          ['haudenosaunee-canandaigua', 'cherokee-print', 'C8', 1828],
        ]
      : northern
        ? [
            ['ozette-makah', 'hidatsa-villages', 'C7', 1700],
            ['inuinnait-sewing', 'kwakwakawakw-potlatch', 'C8', 1915],
          ]
        : [
            ['chaco-communities', 'cahokia-city', 'C6', 1100],
            ['ottoman-workshops', 'isfahan-silk', 'C7', 1630],
          ]) {
      await p.goto(
        `${root}/?pack=${pack}&subject=${left}&compare=${right}&scale=local&year=${year}`,
      );
      await expect(p.locator('.comparison-dimension').first()).toBeVisible();
      await expect(p.locator('.comparison h1')).toBeFocused();
      const axe = (await new AxeBuilder({ page: p }).analyze()).violations;
      assert.deepEqual(axe, []);
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.screenshot({
        path: `${out}/screens/${label}-${pack}-comparison.png`,
        fullPage: true,
      });
      results.push({ label, comparison: [left, right], axe, result: 'pass' });
    }
    if (woodlands) {
      for (const [subject, pack, year] of [
        ['ocmulgee-council', 'C6', 1200],
        ['wendat-laine', 'C7', 1600],
        ['cherokee-print', 'C8', 1828],
        ['ojibwe-manoomin', 'C8', 1913],
      ]) {
        await p.goto(
          `${root}/?pack=${pack}&subject=${subject}&scale=local&year=${year}`,
        );
        await p.locator('.image-open img').evaluate((i) => i.decode());
        await expect(p.locator('.dossier h1')).toBeFocused();
        await p.screenshot({ path: `${out}/screens/${label}-${subject}.png` });
      }
      await p.goto(`${root}/?pack=C8&scale=era`);
      await expect(
        p.getByRole('button', { name: /Begin Eastern Woodlands/ }),
      ).toBeVisible();
    } else if (northern) {
      for (const [subject, pack, year] of [
        ['bering-sea-carvers', 'C4', 400],
        ['inuinnait-sewing', 'C8', 1915],
        ['hidatsa-villages', 'C7', 1780],
      ]) {
        await p.goto(
          `${root}/?pack=${pack}&subject=${subject}&scale=local&year=${year}`,
        );
        await p.locator('.image-open img').evaluate((i) => i.decode());
        await expect(p.locator('.dossier h1')).toBeFocused();
        await p.screenshot({ path: `${out}/screens/${label}-${subject}.png` });
      }
      await p.goto(`${root}/?pack=C8&scale=era`);
      await expect(
        p.getByRole('button', { name: /Begin Arctic, coast and Plains/ }),
      ).toBeVisible();
    } else {
      await p.goto(`${root}/?pack=C7&subject=zand-iran&scale=local&year=1789`);
      await p.locator('.image-open img').evaluate((i) => i.decode());
      await expect(p.locator('.dossier h1')).toBeFocused();
      await p.screenshot({ path: `${out}/screens/${label}-zand.png` });
      await p.goto(`${root}/?pack=C6&subject=chaco-communities&scale=local&year=1100`);
      await p.locator('.image-open img').evaluate((i) => i.decode());
      await expect(p.locator('.dossier h1')).toBeFocused();
      await p.screenshot({ path: `${out}/screens/${label}-chaco.png` });
      await p.goto(`${root}/?pack=C7&scale=era`);
      await expect(
        p.getByRole('button', { name: /Begin Books, silk and power/ }),
      ).toBeVisible();
      await p.goto(`${root}/?pack=C6&scale=era`);
      await expect(
        p.getByRole('button', { name: /Begin Earth, food and gathering/ }),
      ).toBeVisible();
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  const context = await b.newContext({
    viewport: { width: 390, height: 844 },
    acceptDownloads: true,
  });
  const p = await context.newPage();
  const journeyIds = woodlands
    ? ['eastern-woodlands']
    : northern
      ? ['northern-knowledge']
      : ['north-american-communities', 'west-central-workshops'];
  for (const id of journeyIds) {
    const j = c.journeys.find((j) => j.id === id);
    await p.goto(`${root}/?page=journeys`);
    const card = p
      .locator('.journey-grid article')
      .filter({ has: p.getByRole('heading', { name: j.title, exact: true }) });
    await card.getByRole('button', { name: 'Begin investigation →' }).click();
    for (let i = 0; i < j.stops.length; i++) {
      await expect(p.locator('.dossier h1')).toHaveText(
        c.subjects.find((s) => s.id === j.stops[i].subject).name,
      );
      await expect(p.locator('[data-journey-title]')).toBeFocused();
      if (i < j.stops.length - 1)
        await p.getByRole('button', { name: 'Next stop →', exact: true }).click();
    }
    await p.getByRole('button', { name: 'Make your claim ↓', exact: true }).click();
    for (const o of j.evidence.options) {
      await p.getByRole('button', { name: o.text, exact: true }).click();
      await expect(p.locator('.evidence-exercise')).toContainText(o.feedback);
    }
    await p.getByRole('button', { name: 'Save this question', exact: true }).click();
    await p.getByRole('button', { name: 'Save on this device', exact: true }).click();
    await expect(p.locator('.save-dialog')).not.toBeVisible();
    results.push({
      journey: id,
      stops: j.stops.length,
      result: 'pass: all stops, feedback states and saved question',
    });
  }
  await p.getByRole('button', { name: 'Notebook', exact: true }).click();
  await expect(p.locator('.notebook-list article')).toHaveCount(journeyIds.length);
  const downloaded = p.waitForEvent('download');
  await p.getByRole('button', { name: 'Export notebook' }).click();
  await (await downloaded).saveAs(`${out}/notebook-expansion.json`);
  const saved = JSON.parse(await fs.readFile(`${out}/notebook-expansion.json`, 'utf8'));
  assert.equal(saved.notes.length, journeyIds.length);
  await context.close();

  await fs.writeFile(`${out}/browser-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await b.close();
}

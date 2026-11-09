/* global console, document, innerWidth, URLSearchParams */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const results = [];
  await fs.mkdir('output/redesign/chapters', { recursive: true });
  for (const j of corpus.journeys) {
    if (j.id === 'world-200') continue;
    const first = j.stops[0];
    const s = corpus.subjects.find((s) => s.id === first.subject);
    const q = new URLSearchParams({
      subject: s.id,
      journey: j.id,
      step: '0',
      pack: s.packs[0],
      year: String(first.year),
      view: 'world',
      scale: 'local',
    });
    await page.goto(`http://127.0.0.1:4173/?${q}`);
    for (let i = 0; i < j.stops.length; i++) {
      await page.locator('.dossier h1').waitFor();
      assert.equal(
        await page.locator('.dossier h1').textContent(),
        corpus.subjects.find((s) => s.id === j.stops[i].subject).name,
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
      );
      if (i < j.stops.length - 1)
        await page.getByRole('button', { name: 'Next stop' }).click();
    }
    const supported = j.evidence.options.find((o) => o.supported);
    await page.getByRole('button', { name: supported.text, exact: true }).click();
    assert.match(await page.locator('.feedback').textContent(), /defensible claim/);
    const axe = await new AxeBuilder({ page }).analyze();
    results.push({
      journey: j.id,
      stops: j.stops.length,
      feedback: 'passed',
      axe: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
    });
  }
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['phone', 390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(
      'http://127.0.0.1:4173/?subject=benin-ivory&object=met-309900&pack=C7&year=1550&scale=local',
    );
    await page.locator('.dossier-section').first().waitFor();
    await page
      .locator('.image-open img, .compare-pair img')
      .first()
      .evaluate(async (img) => {
        await img.decode();
      });
    await page.screenshot({ path: `output/redesign/chapters/${name}-benin.png` });
    await page.goto(
      'http://127.0.0.1:4173/?subject=ming-workshops&compare=benin-ivory&pack=C7&year=1550&scale=local',
    );
    await page.locator('.comparison-dimension').first().waitFor();
    await page
      .locator('.image-open img, .compare-pair img')
      .first()
      .evaluate(async (img) => {
        await img.decode();
      });
    await page.screenshot({
      path: `output/redesign/chapters/${name}-ocean-compare.png`,
      fullPage: true,
    });
  }
  await fs.writeFile(
    'output/redesign/chapters/browser-checks.json',
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}

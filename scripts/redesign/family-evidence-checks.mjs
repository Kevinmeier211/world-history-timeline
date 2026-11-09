/* global document */
import { chromium } from 'playwright';
import { URL } from 'node:url';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
const root = process.env.ATLAS_URL;
if (!root) throw Error('Use an isolated candidate preview.');
const out = `${process.env.ATLAS_REPORT_DIR}/family-evidence`;
await fs.mkdir(out, { recursive: true });
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1000, height: 1200 } });
const external = [],
  errors = [],
  results = [];
try {
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(root).origin)
      return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${root}/?print=family`);
  await expect(page.locator('.family-sheet')).toHaveCount(c.journeys.length);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode()));
  });
  await page.emulateMedia({ media: 'print' });
  const compositionBounds = [];
  const checkComposition = async (label) => {
    const pages = await page.locator('.print-page').evaluateAll((es) =>
      es.map((e) => ({
        // Document offsets beyond 262144px quantize rectangle subtraction.
        // The used CSS border-box size retains the actual page dimensions.
        height: parseFloat(e.ownerDocument.defaultView.getComputedStyle(e).height),
        width: parseFloat(e.ownerDocument.defaultView.getComputedStyle(e).width),
        boxSizing: e.ownerDocument.defaultView.getComputedStyle(e).boxSizing,
        transform: e.ownerDocument.defaultView.getComputedStyle(e).transform,
        title: e.querySelector('h1')?.textContent,
        context: e.querySelector('header p')?.textContent,
        journey: e.dataset.journey,
      })),
    );
    const overflow = pages.filter(
      (p) =>
        !Number.isFinite(p.height) ||
        !Number.isFinite(p.width) ||
        p.boxSizing !== 'border-box' ||
        p.transform !== 'none' ||
        p.height > 1056.01 ||
        Math.abs(p.width - 816) > 0.5,
    );
    compositionBounds.push({ label, pages: pages.length, overflow });
    await fs.writeFile(
      `${out}/composition-bounds.json`,
      JSON.stringify(compositionBounds, null, 2),
    );
    assert.deepEqual(overflow, []);
  };
  await checkComposition('family');
  for (const j of c.journeys.filter((j) => j.familyEvidence)) {
    const f = j.familyEvidence,
      sheet = page.locator(`.family-sheet[data-journey="${j.id}"]`);
    await expect(sheet.locator('.family-source-summary')).toContainText(f.text);
    await expect(sheet.locator('.family-claim')).toContainText(f.claimPrompt);
    await expect(sheet.locator('.family-claim')).not.toContainText(j.evidence.prompt);
    await expect(sheet.locator('.family-return')).toContainText(f.returnPrompt);
    await expect(sheet.locator('.print-feedback')).toContainText(f.feedback);
    if (f.object === null) await expect(sheet.locator('img')).toHaveCount(0);
    else
      await expect(sheet.locator('img')).toHaveAttribute(
        'src',
        c.media.find((m) => m.id === f.object).image,
      );
    for (const ref of f.citations) {
      const source = c.sources.find((s) => s.id === ref.source);
      await expect(
        sheet.getByRole('link', { name: source.title, exact: true }),
      ).toHaveAttribute('href', source.url);
      await expect(sheet.locator('.family-source-credits')).toContainText(
        source.accessed,
      );
    }
    const geometry = await sheet.evaluate((e) => ({
      width: e.getBoundingClientRect().width,
      height: e.getBoundingClientRect().height,
      bodySize: parseFloat(
        document.defaultView.getComputedStyle(
          e.querySelector('.family-source-summary > p'),
        ).fontSize,
      ),
      claimSpace: e
        .querySelector('.family-claim .writing-space')
        .getBoundingClientRect().height,
      observationSpace: e
        .querySelector('.family-image-grid .writing-space')
        .getBoundingClientRect().height,
    }));
    assert.ok(
      geometry.height <= 1056.01 && Math.abs(geometry.width - 816) <= 0.5,
      JSON.stringify({ journey: j.id, ...geometry }),
    );
    assert.ok(
      geometry.bodySize >= 16.6 &&
        geometry.claimSpace >= 67.9 &&
        geometry.observationSpace >= 67.9,
      JSON.stringify(geometry),
    );
    await sheet.screenshot({ path: `${out}/${j.id}.png` });
    results.push({
      journey: j.id,
      sourceSummary: true,
      appropriateImageOrTextCard: true,
      geometry,
    });
  }
  await fs.writeFile(`${out}/family-results.json`, JSON.stringify(results, null, 2));
  const violations = (await new AxeBuilder({ page }).analyze()).violations;
  await fs.writeFile(`${out}/axe.json`, JSON.stringify(violations, null, 2));
  assert.deepEqual(
    violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
    [],
  );
  await page.goto(`${root}/?print=chapter`);
  await page.locator('.chapter-source-url').first().waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode()));
  });
  const actual = await page
    .locator('.chapter-evidence[data-journey] [data-source]')
    .evaluateAll((es) =>
      es.map((e) => ({
        journey: e.closest('[data-journey]').dataset.journey,
        id: e.dataset.source,
        text: e.textContent,
      })),
    );
  await checkComposition('chapter');
  for (const j of c.journeys) {
    const rows = actual.filter((r) => r.journey === j.id),
      ids = new Set(rows.map((r) => r.id));
    assert.equal(ids.size, rows.length);
    for (const stop of j.stops) {
      const s = c.subjects.find((s) => s.id === stop.subject);
      for (const ref of [
        ...s.sections.flatMap((s) => s.citations),
        ...s.claims.flatMap((cl) => cl.citations),
      ])
        assert.ok(ids.has(ref.source), `${j.id}/${stop.subject}/${ref.source}`);
    }
    for (const row of rows) {
      const s = c.sources.find((s) => s.id === row.id);
      for (const field of [
        'title',
        'url',
        'scope',
        'accessed',
        'institution',
        ...(s.author ? ['author'] : []),
        ...(s.published ? ['published'] : []),
      ])
        assert.ok(row.text.includes(s[field]), `${j.id}/${s.id}/${field}`);
    }
    results.push({ journey: j.id, completeChapterSourceRecords: rows.length });
  }
  assert.deepEqual(external, []);
  assert.deepEqual(errors, []);
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    `${results.filter((r) => r.sourceSummary).length} open family source tasks, images/text cards, citations and writing spaces pass; complete source notes cover every journey.`,
  );
} finally {
  await context.close();
  await browser.close();
}

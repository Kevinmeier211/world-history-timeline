/* global document, getComputedStyle */
import process from 'node:process';
import console from 'node:console';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report) throw Error('Use an isolated candidate preview and report.');
const out = `${report}/regional-contexts`;
await fs.mkdir(out, { recursive: true });
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const cases = [
  { id: 'dongson', object: 'met-39209', year: -200 },
  { id: 'colima', object: 'met-317600', year: 1 },
  { id: 'hopewell-earthworks', object: 'hopewell-moundcity-1848', year: 300 },
];
const journey = c.journeys.find((j) => j.id === 'objects-places-associations');
const browser = await chromium.launch();
const errors = [],
  results = [];
const ready = async (page) => {
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await expect(page.locator('.object-figure')).toHaveAttribute(
    'data-media-status',
    'ready',
  );
  await page.locator('.image-open img').evaluate((img) => img.decode());
  await page.evaluate(() => document.fonts.ready);
};
async function pinGeometry(scope) {
  return scope.locator('.annotation-canvas').evaluate((e) => {
    const box = e.getBoundingClientRect();
    const image = e.querySelector('img').getBoundingClientRect();
    return {
      edgeError: Math.max(
        ...['left', 'top', 'right', 'bottom'].map((k) => Math.abs(box[k] - image[k])),
      ),
      pins: [...e.querySelectorAll('.annotation-pin')].map((p) => {
        const b = p.getBoundingClientRect();
        return {
          id: p.dataset.annotationId,
          x: (b.left + b.width / 2 - box.left) / box.width,
          y: (b.top + b.height / 2 - box.top) / box.height,
          diameter: b.width,
          centerX: b.left + b.width / 2,
          centerY: b.top + b.height / 2,
          fontPixels: Number.parseFloat(getComputedStyle(p).fontSize),
          contained:
            b.left >= box.left &&
            b.right <= box.right &&
            b.top >= box.top &&
            b.bottom <= box.bottom,
        };
      }),
    };
  });
}
function verifyPins(geometry) {
  const notes = c.media.find((m) => m.id === 'met-317600').annotations.items;
  assert.ok(geometry.edgeError < 1);
  assert.equal(geometry.pins.length, notes.length);
  for (const [i, pin] of geometry.pins.entries()) {
    assert.equal(pin.id, notes[i].id);
    assert.ok(pin.contained, 'Annotation circles stay within the source image');
    assert.ok(
      Math.abs(pin.x - notes[i].x) < 0.005 && Math.abs(pin.y - notes[i].y) < 0.005,
    );
    for (const other of geometry.pins.slice(i + 1))
      assert.ok(
        Math.hypot(pin.centerX - other.centerX, pin.centerY - other.centerY) + 0.5 >=
          (pin.diameter + other.diameter) / 2,
        'Annotation circles do not overlap',
      );
  }
}
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    for (const row of cases) {
      const s = c.subjects.find((s) => s.id === row.id);
      await page.goto(
        `${root}/?pack=${s.packs[0]}&subject=${row.id}&object=${row.object}&scale=local&year=${row.year}`,
      );
      await ready(page);
      await expect(page.locator('.dossier h1')).toBeFocused();
      await expect(page.locator('.dossier > .date-label')).toHaveText(s.interval.label);
      await page.locator('.family-start > summary').click();
      await expect(page.locator('.family-start')).toContainText(
        s.familyActivity.explanation,
      );
      const details = page.locator('.deeper-reading > details');
      await expect(details).toHaveCount(s.deeperReading.length);
      for (let i = 0; i < s.deeperReading.length; i++) {
        await details.nth(i).locator(':scope > summary').click();
        await expect(details.nth(i)).toContainText(s.deeperReading[i].text);
      }
      await expect(page.locator('.evidence-reading article')).toHaveCount(3);
      for (const ctx of c.contexts.filter((ctx) => s.contextIds.includes(ctx.id))) {
        await expect(page.locator('.reference-timeline')).toContainText(
          ctx.interval.note,
        );
        for (const phase of ctx.phases)
          await expect(page.locator('.reference-timeline')).toContainText(phase.title);
      }
      if (s.placeStudy) {
        const choices = page.locator('.place-index button');
        await expect(choices).toHaveCount(s.placeStudy.points.length);
        for (let i = 0; i < s.placeStudy.points.length; i++) {
          await choices.nth(i).press('Enter');
          await expect(choices.nth(i)).toHaveAttribute('aria-pressed', 'true');
          await expect(page.locator('.place-explanation')).toContainText(
            s.placeStudy.points[i].text,
          );
        }
        if (width === 390 || width === 1440)
          await page
            .locator('.place-study')
            .screenshot({ path: `${out}/${row.id}-map-${width}.png` });
      }
      if (row.id === 'colima') {
        verifyPins(await pinGeometry(page.locator('.annotated-image--web')));
        await page.locator('.image-open').click();
        const inspection = page.locator('.inspection');
        await expect(inspection).toBeVisible();
        await inspection.getByRole('button', { name: 'Zoom in', exact: true }).click();
        await expect(inspection.locator('output')).toHaveText('150%');
        verifyPins(await pinGeometry(inspection));
        await inspection.getByRole('combobox', { name: /^View/ }).selectOption('1');
        await inspection.locator('img').evaluate((img) => img.decode());
        await expect(inspection.locator('.annotation-pin')).toHaveCount(0);
        await expect(inspection.locator('.annotation-notes')).toHaveCount(0);
        await inspection.getByRole('combobox', { name: /^View/ }).selectOption('0');
        await inspection.locator('img').evaluate((img) => img.decode());
        verifyPins(await pinGeometry(inspection));
        await page.keyboard.press('Escape');
        await expect(page.locator('.image-open')).toBeFocused();
        if (width === 390 || width === 1440)
          await page
            .locator('.object-figure')
            .screenshot({ path: `${out}/colima-image-${width}.png` });
      }
      const image = await page.locator('.image-open img').evaluate((img) => ({
        width: img.getBoundingClientRect().width,
        naturalWidth: img.naturalWidth,
      }));
      assert.ok(
        image.width <= image.naturalWidth + 1,
        'Small source images retain their natural ceiling',
      );
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
      );
      assert.deepEqual(
        (await new AxeBuilder({ page }).analyze()).violations,
        [],
        `${row.id}/${width}`,
      );
      await page.locator('.dossier h1').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/${row.id}-${width}.png` });
      results.push({
        id: row.id,
        width,
        reading: true,
        sourcePhases: true,
        namedPlaces: s.placeStudy?.points.length ?? 0,
        noOverflow: true,
        axe: [],
      });
    }
    await page.goto(
      `${root}/?journey=${journey.id}&step=0&pack=C4&subject=dongson&scale=local&year=-200`,
    );
    await expect(page.locator('.dossier h1')).toBeFocused();
    for (let i = 1; i < journey.stops.length; i++) {
      await page.getByRole('button', { name: 'Next stop →', exact: true }).click();
      await expect(page.locator('[data-journey-title]')).toBeFocused();
      await expect(page.locator('.dossier h1')).toHaveText(
        c.subjects.find((s) => s.id === journey.stops[i].subject).name,
      );
    }
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1000, height: 1200 } });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  for (const { id } of cases) {
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-bibliography').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode()));
    });
    await assertReaderMap(page);
    if (id === 'colima') {
      const figure = page
        .locator('.reader-image')
        .filter({ has: page.locator('img[src$="/317600-0.webp"]') });
      verifyPins(await pinGeometry(figure));
      const notes = page.locator('.reader-print > .annotation-notes');
      for (const item of c.media.find((m) => m.id === 'met-317600').annotations.items)
        await expect(notes).toContainText(item.text);
      assert.ok(!(await notes.innerText()).includes('[0]'));
    }
    if (id === 'hopewell-earthworks') {
      const image = page.locator('img[src$="/hopewell-moundcity-1848.webp"]');
      const width = await image.evaluate(
        (img) => (img.getBoundingClientRect().width * 25.4) / 96,
      );
      assert.ok(width <= 55.01, 'Small historical plan has a55mm maximum print width');
    }
    await page.pdf({
      path: `${out}/${id}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
    results.push({
      id,
      readerExport: true,
      mapGeometry: true,
      sourceImageCeiling: true,
    });
  }
  await page.goto(`${root}/?print=family`);
  const sheet = page.locator(`.family-sheet[data-journey="${journey.id}"]`);
  await sheet.waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  await page.emulateMedia({ media: 'print' });
  assert.ok((await sheet.boundingBox()).height <= 1056.01);
  await expect(sheet).toContainText(journey.familyEvidence.text);
  await expect(sheet).toContainText(journey.familyEvidence.claimPrompt);
  const familyPins = await pinGeometry(sheet);
  verifyPins(familyPins);
  for (const pin of familyPins.pins)
    assert.ok((pin.fontPixels * 72) / 96 >= 10 - 0.001);
  const modelNotes = c.media.find((m) => m.id === 'met-317600').annotations;
  const legend = sheet.locator('.annotation-notes--compact');
  for (const item of modelNotes.items) await expect(legend).toContainText(item.label);
  for (const value of [modelNotes.credit, modelNotes.rights, modelNotes.createdOn])
    await expect(legend).toContainText(value);
  const familyLabelSizes = await legend
    .locator('li, .annotation-credit')
    .evaluateAll((nodes) =>
      nodes.map((e) => (Number.parseFloat(getComputedStyle(e).fontSize) * 72) / 96),
    );
  assert.ok(
    familyLabelSizes.length > 0 &&
      familyLabelSizes.every((points) => points >= 10 - 0.001),
  );
  await expect(
    legend.getByRole('link', { name: 'Annotation licence', exact: true }),
  ).toHaveAttribute('href', modelNotes.licenseUrl);
  results.push({ familyPins, compactLegendAndSeparateRights: true });
  await sheet.screenshot({ path: `${out}/family-sheet.png` });
  await context.close();
  assert.deepEqual(errors, []);
  await fs.writeFile(
    `${out}/results.json`,
    JSON.stringify({ result: 'pass', results, runtimeErrors: errors }, null, 2),
  );
  console.log(
    'Regional contexts: four-width reading/maps/annotations/journey, separate view behavior and three reader exports pass.',
  );
} finally {
  await browser.close();
}

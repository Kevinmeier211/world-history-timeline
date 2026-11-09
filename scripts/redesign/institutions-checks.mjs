/* global document */
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report)
  throw Error('Use an isolated candidate preview and report directory.');
const out = `${report}/institutions`;
await fs.mkdir(out, { recursive: true });
const ccBy = 'https://creativecommons.org/licenses/by/4.0/';
const ccSa = 'https://creativecommons.org/licenses/by-sa/3.0/';
const cc0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
const journeyId = 'makers-supplies-royal-claims';
const cases = [
  { id: 'kerma-potters', object: 'kerma-making-guide', year: -1800 },
  { id: 'nimrud-palace', object: 'nimrud-palace-plan', year: -870 },
  { id: 'taharqo', object: 'sanam-workshop-view', year: -675 },
];
const newMedia = {
  'kerma-making-guide': { width: 600, height: 360, license: ccBy },
  'institution-evidence-guide': { width: 600, height: 360, license: ccBy },
  'nimrud-palace-plan': { width: 460, height: 926, license: ccSa },
  'sanam-workshop-view': { width: 1063, height: 1115, license: ccBy },
  'sanam-mould-match': { width: 512, height: 469, license: ccBy },
};
const browser = await chromium.launch();
const results = [];
let corpus;

const route = (subject, object, year) => {
  const s = corpus.subjects.find((row) => row.id === subject);
  assert.ok(s, subject);
  return `${root}/?pack=${s.packs[0]}&subject=${subject}&object=${object}&scale=local&year=${year}`;
};

async function ready(page) {
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await expect(page.locator('.dossier h1')).toBeFocused();
  await page.locator('.image-open img').evaluate((img) => img.decode());
}

async function inspectMedia(page, id) {
  const expected = newMedia[id];
  const image = page.locator('.image-open img');
  await expect(image).toHaveAttribute('src', new RegExp(`/${id}\\.(svg|webp)$`));
  const size = await image.evaluate((img) => ({
    width: img.getBoundingClientRect().width,
    nativeWidth: img.naturalWidth,
    nativeHeight: img.naturalHeight,
  }));
  assert.equal(size.nativeWidth, expected.width, `${id}: original width retained`);
  assert.equal(size.nativeHeight, expected.height, `${id}: original height retained`);
  assert.ok(size.width <= size.nativeWidth + 1, `${id}: online natural-size ceiling`);
  await page.getByText('Object record and credit', { exact: true }).click();
  await expect(
    page.getByRole('link', { name: 'Read the image licence ↗' }),
  ).toHaveAttribute('href', expected.license);
  const figure = page.locator('.object-figure');
  if (id === 'nimrud-palace-plan') {
    await expect(figure).toContainText(/composite/i);
    await expect(figure).toContainText(/anteroom F/);
    await expect(figure).toContainText(/courtyard Y/);
    await expect(figure).toContainText(/later features/);
    await expect(figure).toContainText(/883–859/);
    await expect(figure).toContainText(/north arrow/i);
    await expect(figure).toContainText(/scale to 50 m/);
    await expect(figure).toContainText(/small original room labels/i);
    await expect(figure).toContainText(/online image date unstated/i);
  } else if (id === 'sanam-workshop-view') {
    await expect(figure).toHaveAttribute(
      'data-depiction',
      'annotated excavation photograph',
    );
    await expect(figure).toContainText(/published in 2026/);
    await expect(figure).toContainText(/exact photograph date unstated/);
    await expect(figure).toContainText(/No north arrow/);
    await expect(figure).toContainText(/not an ancient plan/);
    await expect(figure).toContainText(/granite figure/);
  } else if (id === 'sanam-mould-match') {
    await expect(figure).toContainText(/manufacture years unknown/);
    await expect(figure).toContainText(/uninscribed/i);
    await expect(figure).toContainText(/does not name Taharqo/);
    await expect(figure).toContainText(/no readable unit/);
    await expect(figure).toContainText(/different material and object/);
    await expect(figure).toContainText(/natural-size ceiling/);
  } else {
    await expect(figure).toContainText(/Teaching guide made 29 October 2026/);
    await expect(figure).toContainText(/modern|generic/i);
  }
  await page.locator('.image-open').click();
  const dialog = page.locator('.inspection');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Image licence ↗' })).toHaveAttribute(
    'href',
    expected.license,
  );
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(dialog.locator('output')).toHaveText('150%');
  if (id === 'nimrud-palace-plan') {
    await expect(dialog).toContainText(/Small original room labels/);
    for (const zoom of ['200%', '250%', '300%']) {
      await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
      await expect(dialog.locator('output')).toHaveText(zoom);
    }
    await expect(
      page.getByRole('button', { name: 'Zoom in', exact: true }),
    ).toBeDisabled();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  return size;
}

try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const external = [],
      errors = [];
    await context.route('**/*', (request) => {
      if (new URL(request.request().url()).origin === new URL(root).origin)
        return request.continue();
      external.push(request.request().url());
      return request.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    if (!corpus) {
      const response = await page.request.get(`${root}/atlas/corpus.json`);
      assert.ok(response.ok(), 'The served candidate corpus is available');
      corpus = await response.json();
    }
    await page.goto(root);
    await page.locator('.app-footer').waitFor();
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('link', { name: 'Skip to atlas', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();

    for (const { id, object, year } of cases) {
      await page.goto(route(id, object, year));
      await ready(page);
      const subject = corpus.subjects.find((row) => row.id === id);
      await expect(page.locator('.dossier h1')).toHaveText(subject.name);
      await expect(page.locator('.dossier > .date-label')).toHaveText(
        subject.interval.label,
      );
      for (const section of subject.sections) {
        await expect(
          page.getByRole('heading', { level: 2, name: section.title, exact: true }),
        ).toBeVisible();
      }
      await page.locator('.family-start > summary').click();
      await expect(page.locator('.family-start > ol')).toBeVisible();
      const deeper = page.locator('.deeper-reading > details');
      await expect(deeper).toHaveCount(subject.deeperReading.length);
      for (let i = 0; i < subject.deeperReading.length; i++) {
        await deeper.nth(i).locator(':scope > summary').click();
        await expect(deeper.nth(i).locator('p').first()).toBeVisible();
      }
      await expect(page.locator('.evidence-reading')).toBeVisible();
      await expect(page.locator('.evidence-reading article')).toHaveCount(
        subject.evidenceReading.items.length,
      );
      const timeline = page.locator('.reference-timeline');
      await expect(timeline).toBeVisible();
      for (const reference of corpus.contexts.filter((row) =>
        subject.contextIds.includes(row.id),
      )) {
        for (const phase of reference.phases) {
          if (phase.label) await expect(timeline).toContainText(phase.label);
          await expect(timeline).toContainText(phase.title);
        }
      }
      const controls = page.locator('.place-index button');
      assert.ok(subject.placeStudy.points.length >= 2);
      await expect(controls).toHaveCount(subject.placeStudy.points.length);
      for (let i = 0; i < subject.placeStudy.points.length; i++) {
        await expect(controls.nth(i)).toContainText(subject.placeStudy.points[i].label);
        await controls.nth(i).press('Enter');
        await expect(controls.nth(i)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.place-explanation h3')).toHaveText(
          (await controls.nth(i).innerText()).replace(/^\d+\.\s*/, ''),
        );
      }
      await page
        .locator('.place-study')
        .screenshot({ path: `${out}/${id}-map-${width}.png` });
      await page.reload();
      await ready(page);
      const size = await inspectMedia(page, object);
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      assert.deepEqual(
        violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
        [],
        `${id}/${width}`,
      );
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `${id}/${width}: page bounds`,
      );
      await page.screenshot({ path: `${out}/${id}-${width}.png` });
      results.push({
        id,
        object,
        width,
        readingLayers: true,
        allNamedPlaces: subject.placeStudy.points.length,
        deepLink: true,
        inspection: true,
        sourceImageSize: size,
        axe: [],
      });
    }

    for (const [id, object, year] of [
      ['nimrud-palace', 'institution-evidence-guide', -870],
      ['taharqo', 'sanam-mould-match', -675],
    ]) {
      await page.goto(route(id, object, year));
      await ready(page);
      const size = await inspectMedia(page, object);
      assert.deepEqual(
        (await new AxeBuilder({ page }).analyze()).violations,
        [],
        `${object}/${width}`,
      );
      results.push({ object, width, inspection: true, sourceImageSize: size, axe: [] });
    }
    await page.goto(route('taharqo', 'met-544883', -675));
    await ready(page);
    await expect(page.locator('.object-figure')).toContainText(/granite/i);
    await expect(page.locator('.object-figure')).toContainText(/690–664/);
    await page.getByText('Object record and credit', { exact: true }).click();
    await expect(
      page.getByRole('link', { name: 'Read the image licence ↗' }),
    ).toHaveAttribute('href', cc0);
    assert.deepEqual(external, [], 'Local atlas requests stay on the candidate origin');
    assert.deepEqual(errors, [], 'No runtime errors');
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1000, height: 1200 } });
  const page = await context.newPage();
  const smallestFonts = {};
  for (const { id } of cases) {
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-print').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode()));
    });
    await assertReaderMap(page);
    if (id === 'nimrud-palace') {
      const plan = page
        .locator('.reader-image')
        .filter({ has: page.locator('img[src$="/nimrud-palace-plan.webp"]') });
      await expect(plan).toHaveCount(1);
      await expect(plan.locator('figcaption')).toContainText(/composite/i);
      await expect(plan.locator('figcaption')).toContainText(/anteroom F/);
      await expect(plan.locator('figcaption')).toContainText(/courtyard Y/);
      await expect(plan.locator('figcaption')).toContainText(/later features/);
      await expect(plan.locator('figcaption')).toContainText(/north arrow/i);
      await expect(plan.locator('figcaption')).toContainText(/scale to 50 m/);
      await expect(plan.locator('figcaption')).toContainText(
        /Small original room labels/,
      );
      await expect(plan.locator(`a[href="${ccSa}"]`)).toHaveCount(1);
    }
    if (id === 'taharqo') {
      const workshop = page
        .locator('.reader-image')
        .filter({ has: page.locator('img[src$="/sanam-workshop-view.webp"]') });
      await expect(workshop).toHaveAttribute(
        'data-depiction',
        'annotated excavation photograph',
      );
      await expect(workshop.locator('figcaption')).toContainText(/published in 2026/);
      await expect(workshop.locator('figcaption')).toContainText(
        /exact photograph date unstated/,
      );
      await expect(workshop.locator('figcaption')).toContainText(
        /broad workshop chronology/,
      );
    }
    await page.pdf({
      path: `${out}/${id}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
    results.push({ id, readerExport: true, mapGeometry: true });
  }

  for (const id of ['kerma-making-guide', 'institution-evidence-guide']) {
    await page.goto(`${root}/atlas/media/${id}.svg`);
    const labels = await page.locator('svg text').evaluateAll((nodes) =>
      nodes.map((e) => {
        const b = e.getBBox(),
          v = e.ownerSVGElement.viewBox.baseVal;
        return {
          text: e.textContent,
          x: b.x,
          y: b.y,
          right: b.x + b.width,
          bottom: b.y + b.height,
          width: v.width,
          height: v.height,
          font: parseFloat(document.defaultView.getComputedStyle(e).fontSize),
        };
      }),
    );
    assert.ok(labels.length >= 4);
    assert.deepEqual(
      labels.filter(
        (b) =>
          b.x < -0.1 ||
          b.y < -0.1 ||
          b.right > b.width + 0.1 ||
          b.bottom > b.height + 0.1,
      ),
      [],
      `${id}: SVG labels stay within viewBox`,
    );
    const overlaps = labels.flatMap((a, i) =>
      labels
        .slice(i + 1)
        .filter(
          (b) =>
            Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 &&
            Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1,
        )
        .map((b) => [a.text, b.text]),
    );
    assert.deepEqual(overlaps, [], `${id}: SVG labels do not overlap`);
    smallestFonts[id] = Math.min(...labels.map((label) => label.font));
    assert.ok(smallestFonts[id] >= 32, `${id}: minimum SVG label size remains 32 px`);
    results.push({
      id,
      diagramLabelBounds: labels,
      minimumSVGFontPx: smallestFonts[id],
    });
  }

  const familyPack = corpus.packs.find(
    (pack) =>
      pack.journey === journeyId ||
      pack.investigations?.some((entry) => entry.journey === journeyId),
  );
  assert.ok(familyPack, 'The new investigation is available from a chapter');
  await page.goto(`${root}/?print=family&pack=${familyPack.id}`);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  const family = page.locator(`.family-sheet[data-journey="${journeyId}"]`);
  await expect(family).toHaveCount(1);
  await expect(family.locator('img')).toHaveAttribute(
    'src',
    /institution-evidence-guide\.svg$/,
  );
  await expect(family.locator('.family-claim')).toContainText(
    /claim|order|outcome|result/i,
  );
  await expect(family.locator('.family-source-summary')).toContainText(/modern|guide/i);
  const scale = await family.locator('img').evaluate((img) => {
    const s = document.defaultView.getComputedStyle(img),
      b = img.getBoundingClientRect();
    return Math.min(
      (b.width - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight)) /
        img.naturalWidth,
      (b.height - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom)) /
        img.naturalHeight,
    );
  });
  const smallestPoints =
    (smallestFonts['institution-evidence-guide'] * scale * 72) / 96;
  assert.ok(smallestPoints >= 10, `Family guide smallest label ${smallestPoints}pt`);
  await family.screenshot({ path: `${out}/family-makers-supplies-royal-claims.png` });
  results.push({ familyGuideSmallestPoints: smallestPoints });
  await fs.writeFile(
    `${out}/print-geometry.json`,
    JSON.stringify(
      { smallestFonts, familyGuideSmallestPoints: smallestPoints },
      null,
      2,
    ),
  );
  await context.close();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'Institutions: four-width reading, all named places, five media/rights/date distinctions, two guide bounds and family label target passed; three readers exported.',
  );
} finally {
  await browser.close();
}

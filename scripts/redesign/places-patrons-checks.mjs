/* global document, getComputedStyle */
import process from 'node:process';
import console from 'node:console';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report) throw Error('Use an isolated candidate preview and report.');
const out = `${report}/places-patrons`;
await fs.mkdir(out, { recursive: true });
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const cases = [
  { id: 'byzantium', object: 'met-464428', year: 950 },
  { id: 'borobudur', object: 'borobudur-schematic-plan', year: 800 },
  { id: 'maya-vessel', object: 'met-316711', year: 750 },
];
const journey = c.journeys.find((j) => j.id === 'places-patrons-work');
const annotatedIds = ['met-464428', 'met-316711'];
const ccSa = 'https://creativecommons.org/licenses/by-sa/3.0/';
assert.ok(journey?.familyEvidence);
for (const id of annotatedIds) assert.ok(c.media.find((m) => m.id === id)?.annotations);
const browser = await chromium.launch();
const errors = [];
const external = [];
const results = [];

async function fresh(viewport) {
  const context = await browser.newContext({ viewport });
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(root).origin)
      return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  return { context, page };
}

async function ready(page, media) {
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await expect(page.locator('.object-figure')).toHaveAttribute(
    'data-media-id',
    media.id,
  );
  await expect(page.locator('.object-figure')).toHaveAttribute(
    'data-media-status',
    'ready',
  );
  await page.locator('.image-open img').evaluate((img) => img.decode());
  await expect(page.locator('.image-open img')).toHaveAttribute('src', media.image);
  await page.evaluate(() => document.fonts.ready);
}

async function imageCeiling(page) {
  const image = await page.locator('.image-open img').evaluate((img) => ({
    width: img.getBoundingClientRect().width,
    naturalWidth: img.naturalWidth,
  }));
  assert.ok(
    image.width <= image.naturalWidth + 1,
    'Source images retain their natural-size ceiling.',
  );
  return image;
}

async function pinGeometry(canvas) {
  return canvas.evaluate((e) => {
    const box = e.getBoundingClientRect();
    const image = e.querySelector('img').getBoundingClientRect();
    return {
      edgeError: Math.max(
        ...['left', 'top', 'right', 'bottom'].map((k) => Math.abs(box[k] - image[k])),
      ),
      canvasWidth: box.width,
      canvasHeight: box.height,
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

function verifyPins(geometry, media, minFontPixels) {
  const notes = media.annotations.items;
  assert.ok(
    geometry.edgeError < 1,
    `${media.id}: overlay and image share an aspect surface.`,
  );
  assert.equal(geometry.pins.length, notes.length);
  for (const [i, pin] of geometry.pins.entries()) {
    assert.equal(pin.id, notes[i].id);
    assert.ok(
      pin.contained,
      `${media.id}: annotation circles stay within the photograph.`,
    );
    assert.ok(
      Math.abs(pin.x - notes[i].x) < 0.005 && Math.abs(pin.y - notes[i].y) < 0.005,
    );
    assert.ok(
      pin.fontPixels >= minFontPixels,
      `${media.id}: marker text does not shrink.`,
    );
    for (const other of geometry.pins.slice(i + 1))
      assert.ok(
        Math.hypot(pin.centerX - other.centerX, pin.centerY - other.centerY) + 0.5 >=
          (pin.diameter + other.diameter) / 2,
        `${media.id}: annotation circles do not overlap.`,
      );
  }
  return geometry;
}

async function annotationNotes(scope, media, compact = false) {
  const notes = scope.locator(
    compact ? '.annotation-notes--compact' : '.annotation-notes',
  );
  await expect(notes.locator('.annotation-legend li')).toHaveCount(
    media.annotations.items.length,
  );
  for (const item of media.annotations.items) {
    await expect(notes).toContainText(item.label);
    if (!compact) await expect(notes).toContainText(item.text);
  }
  for (const value of [
    media.annotations.credit,
    media.annotations.rights,
    media.annotations.createdOn,
  ])
    await expect(notes).toContainText(value);
  await expect(
    notes.getByRole('link', { name: 'Annotation licence', exact: true }),
  ).toHaveAttribute('href', media.annotations.licenseUrl);
  return notes;
}

async function decodedPrint(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
}

async function genericPrintAnnotations(page, composition, requiredIds = []) {
  const checked = [];
  for (const id of annotatedIds) {
    const media = c.media.find((m) => m.id === id);
    const figures = page
      .locator('.print-object')
      .filter({ has: page.locator(`img[src$="${media.image}"]`) });
    for (let i = 0; i < (await figures.count()); i++) {
      const figure = figures.nth(i);
      const geometry = verifyPins(
        await pinGeometry(figure.locator('.annotation-canvas')),
        media,
        (10 * 96) / 72 - 0.001,
      );
      const notes = await annotationNotes(figure, media, true);
      const fonts = await notes
        .locator('li, .annotation-credit')
        .evaluateAll((nodes) =>
          nodes.map(
            (node) => (Number.parseFloat(getComputedStyle(node).fontSize) * 72) / 96,
          ),
        );
      assert.ok(fonts.length && fonts.every((size) => size >= 10 - 0.001));
      checked.push({ media: id, instance: i, geometry });
    }
  }
  for (const id of requiredIds)
    assert.ok(
      checked.some((row) => row.media === id),
      `The existing C5 ${composition} actually exercises ${id}.`,
    );
  return { composition, annotatedInstancesPresent: checked.length, checked };
}

try {
  for (const width of [320, 390, 768, 1440]) {
    const { context, page } = await fresh({ width, height: 900 });
    for (const row of cases) {
      const subject = c.subjects.find((s) => s.id === row.id);
      const media = c.media.find((m) => m.id === row.object);
      await page.goto(
        `${root}/?pack=${subject.packs[0]}&subject=${row.id}&object=${row.object}&scale=local&year=${row.year}`,
      );
      await ready(page, media);
      await expect(page.locator('.dossier h1')).toBeFocused();
      await expect(page.locator('.dossier > .date-label')).toHaveText(
        subject.interval.label,
      );
      for (const section of subject.sections)
        await expect(page.locator('.dossier')).toContainText(section.text);
      await page.locator('.family-start > summary').click();
      await expect(page.locator('.family-start > ol')).toBeVisible();
      await expect(page.locator('.family-start')).toContainText(
        subject.familyActivity.explanation,
      );
      const deeper = page.locator('.deeper-reading > details');
      await expect(deeper).toHaveCount(subject.deeperReading.length);
      for (let i = 0; i < subject.deeperReading.length; i++) {
        await deeper.nth(i).locator(':scope > summary').click();
        await expect(deeper.nth(i)).toContainText(subject.deeperReading[i].text);
      }
      const evidence = page.locator('.evidence-reading article');
      await expect(evidence).toHaveCount(subject.evidenceReading.items.length);
      for (let i = 0; i < subject.evidenceReading.items.length; i++) {
        await expect(evidence.nth(i)).toContainText(
          subject.evidenceReading.items[i].text,
        );
        await expect(evidence.nth(i)).toContainText(
          subject.evidenceReading.items[i].interpretation,
        );
      }
      for (const reference of c.contexts.filter((ctx) =>
        subject.contextIds.includes(ctx.id),
      )) {
        await expect(page.locator('.reference-timeline')).toContainText(
          reference.interval.note,
        );
        for (const phase of reference.phases) {
          await expect(page.locator('.reference-timeline')).toContainText(phase.title);
          await expect(page.locator('.reference-timeline')).toContainText(phase.text);
        }
      }
      if (subject.placeStudy) {
        await expect(page.locator('.place-study')).toContainText(
          subject.placeStudy.description,
        );
        const choices = page.locator('.place-index button');
        await expect(choices).toHaveCount(subject.placeStudy.points.length);
        for (let i = 0; i < subject.placeStudy.points.length; i++) {
          await choices.nth(i).press('Enter');
          await expect(choices.nth(i)).toHaveAttribute('aria-pressed', 'true');
          await expect(page.locator('.place-explanation')).toContainText(
            subject.placeStudy.points[i].text,
          );
        }
        if (width === 390 || width === 1440)
          await page
            .locator('.place-study')
            .screenshot({ path: `${out}/${row.id}-map-${width}.png` });
      }
      if (media.annotations) {
        verifyPins(
          await pinGeometry(page.locator('.annotated-image--web .annotation-canvas')),
          media,
          18 - 0.001,
        );
        await annotationNotes(page.locator('.object-figure > figcaption'), media);
        await expect(page.locator('.object-figure figcaption')).toContainText(
          media.credit,
        );
        await expect(page.locator('.object-figure figcaption')).toContainText(
          media.rights,
        );
        await expect(
          page
            .locator('.object-figure figcaption')
            .getByRole('link', { name: 'Read the image licence ↗', exact: true }),
        ).toHaveAttribute('href', media.licenseUrl);
        await page.locator('.image-open').click();
        const inspection = page.locator('.inspection');
        await expect(inspection).toBeVisible();
        await inspection.getByRole('button', { name: 'Zoom in', exact: true }).click();
        await expect(inspection.locator('output')).toHaveText('150%');
        verifyPins(
          await pinGeometry(inspection.locator('.annotation-canvas')),
          media,
          18 - 0.001,
        );
        await annotationNotes(inspection, media);
        if (media.additionalImages?.length) {
          const view = inspection.getByRole('combobox', { name: /^View/ });
          await view.selectOption('1');
          await inspection.locator('img').evaluate((img) => img.decode());
          await expect(inspection.locator('.annotation-pin')).toHaveCount(0);
          await expect(inspection.locator('.annotation-notes')).toHaveCount(0);
          await view.selectOption('0');
          await inspection.locator('img').evaluate((img) => img.decode());
          verifyPins(
            await pinGeometry(inspection.locator('.annotation-canvas')),
            media,
            18 - 0.001,
          );
        } else {
          await expect(inspection.getByRole('combobox', { name: /^View/ })).toHaveCount(
            0,
          );
        }
        await page.keyboard.press('Escape');
        await expect(page.locator('.image-open')).toBeFocused();
        if (width === 390 || width === 1440)
          await page
            .locator('.object-figure')
            .screenshot({ path: `${out}/${row.id}-image-${width}.png` });
      }
      if (row.id === 'borobudur') {
        for (const id of ['borobudur-schematic-plan', 'borobudur-conserved-monument']) {
          const selected = c.media.find((m) => m.id === id);
          await page
            .locator('.object-choices button')
            .filter({ hasText: selected.title })
            .click();
          await ready(page, selected);
          const figure = page.locator('.object-figure');
          await expect(page.locator('.dossier > .date-label')).toHaveText(
            subject.interval.label,
          );
          await expect(figure).toContainText(selected.date.label);
          await expect(figure).toContainText(selected.caption);
          await expect(figure).toContainText(selected.credit);
          await expect(figure).toContainText(selected.rights);
          assert.equal(selected.licenseUrl, ccSa);
          await expect(
            figure.getByRole('link', { name: 'Read the image licence ↗', exact: true }),
          ).toHaveAttribute('href', ccSa);
          await expect(
            figure.getByRole('link', { name: 'Open source image ↗', exact: true }),
          ).toHaveAttribute('href', selected.sourceImage);
          await expect(figure.locator('.annotation-pin')).toHaveCount(0);
          await imageCeiling(page);
          await page.locator('.image-open').click();
          await expect(
            page
              .locator('.inspection')
              .getByRole('link', { name: 'Image licence ↗', exact: true }),
          ).toHaveAttribute('href', ccSa);
          await page.keyboard.press('Escape');
          if (width === 390 || width === 1440)
            await figure.screenshot({ path: `${out}/${id}-${width}.png` });
        }
        await page
          .locator('.object-choices button')
          .filter({ hasText: media.title })
          .click();
        await ready(page, media);
      }
      await imageCeiling(page);
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
        mainFamilyDeeperEvidence: true,
        sourcePhases: true,
        namedPlaces: subject.placeStudy?.points.length ?? 0,
        annotated: Boolean(media.annotations),
        mediaDateAndRights: true,
        noOverflow: true,
        axe: [],
      });
    }
    const first = journey.stops[0];
    await page.goto(
      `${root}/?journey=${journey.id}&step=0&pack=C5&subject=${first.subject}&object=${first.object}&scale=local&year=${first.year}`,
    );
    const inquiry = page.locator('.journey-context');
    for (let i = 0; i < journey.stops.length; i++) {
      if (i)
        await inquiry.getByRole('button', { name: 'Next stop →', exact: true }).click();
      await expect(inquiry).toHaveAttribute('data-journey-status', 'ready');
      await expect(inquiry.locator('[data-journey-title]')).toHaveText(
        journey.stops[i].title,
      );
      await expect(
        i ? inquiry.locator('[data-journey-title]') : page.locator('.dossier h1'),
      ).toBeFocused();
      await expect(inquiry).toContainText(journey.stops[i].narrative);
      await ready(
        page,
        c.media.find((m) => m.id === journey.stops[i].object),
      );
    }
    await expect(page.locator('.journey-ending')).toContainText(journey.conclusion);
    await expect(page.locator('.journey-ending .question')).toHaveText(
      journey.returnPrompt,
    );
    results.push({
      width,
      completeJourney: true,
      stopCount: journey.stops.length,
      journeyFocus: true,
    });
    await context.close();
  }

  const { context, page } = await fresh({ width: 1000, height: 1200 });
  for (const { id } of cases) {
    const subject = c.subjects.find((s) => s.id === id);
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-bibliography').waitFor();
    await decodedPrint(page);
    await assertReaderMap(page);
    const mediaGeometry = [];
    for (const media of c.media.filter((m) => subject.objectIds.includes(m.id))) {
      const figure = page
        .locator('.reader-image')
        .filter({ has: page.locator(`img[src$="${media.image}"]`) });
      await expect(figure).toContainText(media.date.label);
      await expect(figure).toContainText(media.caption);
      if (media.annotations) {
        mediaGeometry.push({
          id: media.id,
          geometry: verifyPins(
            await pinGeometry(figure.locator('.annotation-canvas')),
            media,
            (10 * 96) / 72 - 0.001,
          ),
        });
        const notes = page.locator('.reader-print > .annotation-notes');
        for (const item of media.annotations.items)
          await expect(notes).toContainText(item.text);
        assert.ok(!(await notes.innerText()).includes('[0]'));
      }
      if (media.printWidthMm) {
        const widthMm = await figure
          .locator('img')
          .evaluate((img) => (img.getBoundingClientRect().width * 25.4) / 96);
        assert.ok(
          widthMm <= media.printWidthMm + 0.01,
          `${media.id}: source-specific print width stays bounded.`,
        );
      }
      if (id === 'borobudur')
        await expect(figure.locator('a').filter({ hasText: ccSa })).toHaveAttribute(
          'href',
          ccSa,
        );
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
      sourceImageCeilings: true,
      mediaGeometry,
    });
  }

  await page.goto(`${root}/?print=family&pack=C5`);
  const sheet = page.locator(`.family-sheet[data-journey="${journey.id}"]`);
  await sheet.waitFor();
  await decodedPrint(page);
  await page.emulateMedia({ media: 'print' });
  const familyBounds = await page.locator('.family-sheet').evaluateAll((nodes) =>
    nodes.map((node) => ({
      journey: node.dataset.journey,
      width: node.getBoundingClientRect().width,
      height: node.getBoundingClientRect().height,
    })),
  );
  assert.ok(
    familyBounds.every((bounds) => bounds.height <= 1056.01),
    'New and earlier C5 family pages retain Letter bounds.',
  );
  const plan = c.media.find((m) => m.id === 'borobudur-schematic-plan');
  await expect(sheet.locator('img')).toHaveAttribute('src', plan.image);
  await expect(sheet).toContainText(journey.familyEvidence.text);
  await expect(sheet).toContainText(journey.familyEvidence.claimPrompt);
  await expect(sheet).toContainText(journey.familyEvidence.returnPrompt);
  await expect(sheet).toContainText(journey.familyEvidence.feedback);
  for (const notice of journey.familyEvidence.notice)
    await expect(sheet).toContainText(notice);
  await expect(sheet).toContainText(plan.printCredit);
  await expect(
    sheet.locator('.print-object a').filter({ hasText: ccSa }),
  ).toHaveAttribute('href', ccSa);
  await expect(sheet.locator('.annotation-pin')).toHaveCount(0);
  for (const citation of journey.familyEvidence.citations) {
    const source = c.sources.find((s) => s.id === citation.source);
    await expect(
      sheet.locator('.family-source-credits a').filter({ hasText: source.title }),
    ).toHaveAttribute('href', source.url);
    await expect(sheet.locator('.family-source-credits')).toContainText(
      citation.locator,
    );
  }
  const writing = await sheet
    .locator('.writing-space')
    .evaluateAll((nodes) =>
      nodes.map((node) => (node.getBoundingClientRect().height * 25.4) / 96),
    );
  assert.equal(writing.length, 2);
  assert.ok(
    writing.every((height) => height >= 18 - 0.01),
    'The new source-plan family sheet retains both 18 mm writing spaces.',
  );
  const oldFamilyAnnotations = await genericPrintAnnotations(page, 'family sheet');
  await sheet.screenshot({ path: `${out}/family-sheet.png` });
  results.push({
    familySourcePlan: true,
    naturalImageNotOriginalGuideFontTest: true,
    sourceCapsuleAndRights: true,
    familyBounds,
    writingSpaceMm: writing,
    oldFamilyAnnotations,
  });

  await page.goto(`${root}/?print=chapter&pack=C5`);
  await page.locator('.chapter-route').first().waitFor();
  await decodedPrint(page);
  await page.emulateMedia({ media: 'print' });
  const oldChapterAnnotations = await genericPrintAnnotations(page, 'chapter', [
    'met-464428',
  ]);
  results.push({ oldChapterAnnotations, genericPrintImagePinSpacing: true });
  await context.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await fs.writeFile(
    `${out}/results.json`,
    JSON.stringify(
      { result: 'pass', results, runtimeErrors: errors, externalRequests: external },
      null,
      2,
    ),
  );
  console.log(
    'Places, patrons and work: four-width reading, qualified places, two photograph annotation sets, licensed source plan/photo, journey, three readers and family/earlier generic print geometry pass.',
  );
} finally {
  await browser.close();
}

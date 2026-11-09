/* global document, window */
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
const out = `${report}/images-work`;
await fs.mkdir(out, { recursive: true });
const ccBy = 'https://creativecommons.org/licenses/by/4.0/';
const ccNc = 'https://creativecommons.org/licenses/by-nc/4.0/';
const journeyId = 'images-spaces-work';
const cases = [
  { id: 'chavin-textile', object: 'met-315784', year: -300, interval: [-400, -200] },
  {
    id: 'teotihuacan',
    object: 'teotihuacan-household-guide',
    year: 400,
    interval: [-100, 800],
  },
  { id: 'moche', object: 'moche-evidence-guide', year: 400, interval: [1, 800] },
];
const guides = ['teotihuacan-household-guide', 'moche-evidence-guide'];
const browser = await chromium.launch();
const results = [];
let corpus;
const media = (id) => corpus.media.find((row) => row.id === id);
const route = (id, object, year) => {
  const s = corpus.subjects.find((row) => row.id === id);
  return `${root}/?pack=${s.packs[0]}&subject=${id}&object=${object}&scale=local&year=${year}`;
};
const gate = () => {
  let release;
  const promise = new Promise((resolve) => {
    release = resolve;
  });
  return { promise, release };
};
async function ready(page) {
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await expect(page.locator('.dossier h1')).toBeFocused();
  await page.locator('.image-open img').evaluate((img) => img.decode());
  await page.evaluate(() => document.fonts.ready);
}
async function noOverflow(page) {
  assert.ok(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth + 1,
    ),
    'Page stays inside its viewport',
  );
}
async function assertPins(scope, annotations, minimumPixels) {
  const canvas = scope.locator('.annotation-canvas');
  await expect(canvas).toHaveCount(1);
  await expect(canvas.locator('.annotation-pin')).toHaveCount(annotations.items.length);
  const geometry = await canvas.evaluate((element, items) => {
    const rect = (box) => ({
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      right: box.right,
      bottom: box.bottom,
    });
    const image = element.querySelector('img');
    const c = element.getBoundingClientRect();
    const i = image.getBoundingClientRect();
    const imageStyle = document.defaultView.getComputedStyle(image);
    return {
      canvas: rect(c),
      image: rect(i),
      imageRatio: image.naturalWidth / image.naturalHeight,
      imagePadding: [
        imageStyle.paddingLeft,
        imageStyle.paddingRight,
        imageStyle.paddingTop,
        imageStyle.paddingBottom,
      ].map(Number.parseFloat),
      markers: [...element.querySelectorAll('.annotation-pin')].map((pin, index) => {
        const b = pin.getBoundingClientRect();
        const text = document.createRange();
        text.selectNodeContents(pin);
        const label = text.getBoundingClientRect();
        return {
          id: pin.dataset.annotationId,
          number: pin.textContent,
          box: rect(b),
          fontPixels: Number.parseFloat(
            document.defaultView.getComputedStyle(pin).fontSize,
          ),
          centerError: Math.hypot(
            b.left + b.width / 2 - c.left - items[index].x * c.width,
            b.top + b.height / 2 - c.top - items[index].y * c.height,
          ),
          labelContained:
            label.left >= b.left - 0.5 &&
            label.right <= b.right + 0.5 &&
            label.top >= b.top - 0.5 &&
            label.bottom <= b.bottom + 0.5,
          hiddenFromAT: !!pin.closest('[aria-hidden=true]'),
          interactive: pin.matches('a,button,input,[tabindex]'),
        };
      }),
    };
  }, annotations.items);
  for (const edge of ['left', 'top', 'right', 'bottom'])
    assert.ok(
      Math.abs(geometry.canvas[edge] - geometry.image[edge]) < 1,
      `Annotation surface matches actual image ${edge}`,
    );
  assert.ok(
    Math.abs(geometry.image.width / geometry.image.height - geometry.imageRatio) < 0.01,
    'Image content retains its natural aspect',
  );
  assert.deepEqual(
    geometry.imagePadding,
    [0, 0, 0, 0],
    'Letterbox padding is outside the annotation surface',
  );
  for (const [index, marker] of geometry.markers.entries()) {
    assert.equal(marker.id, annotations.items[index].id);
    assert.equal(
      marker.number,
      String(index + 1),
      'Only numbered markers are drawn on the photograph',
    );
    assert.ok(marker.centerError < 1, JSON.stringify(marker));
    assert.ok(marker.fontPixels + 0.001 >= minimumPixels, JSON.stringify(marker));
    assert.ok(
      marker.labelContained && marker.hiddenFromAT && !marker.interactive,
      JSON.stringify(marker),
    );
  }
  const overlaps = geometry.markers.flatMap((a, index) =>
    geometry.markers
      .slice(index + 1)
      .filter(
        (b) =>
          Math.hypot(
            a.box.left + a.box.width / 2 - b.box.left - b.box.width / 2,
            a.box.top + a.box.height / 2 - b.box.top - b.box.height / 2,
          ) +
            0.5 <
          (a.box.width + b.box.width) / 2,
      )
      .map((b) => [a.id, b.id]),
  );
  assert.deepEqual(overlaps, [], 'Numbered circles do not overlap');
  return geometry;
}
async function assertAnnotationNotes(scope, annotations) {
  const notes = scope.locator('.annotation-notes');
  await expect(notes).toHaveCount(1);
  await expect(notes.locator('ol > li')).toHaveCount(annotations.items.length);
  for (const item of annotations.items) {
    const note = notes.locator(`[data-annotation-note="${item.id}"]`);
    await expect(note).toContainText(item.label);
    await expect(note).toContainText(item.text);
    await note.locator('.citations > summary').click();
    for (const citation of item.citations) {
      const source = corpus.sources.find((row) => row.id === citation.source);
      await expect(note).toContainText(citation.locator);
      await expect(
        note.getByRole('link', { name: `${source.title} ↗`, exact: true }),
      ).toHaveAttribute('href', source.url);
    }
  }
  await expect(notes.locator('.annotation-credit')).toContainText(
    annotations.createdOn,
  );
  await expect(notes.locator('.annotation-credit')).toContainText(annotations.credit);
  await expect(notes.locator('.annotation-credit')).toContainText(annotations.rights);
  await expect(
    notes.getByRole('link', { name: 'Annotation licence', exact: true }),
  ).toHaveAttribute('href', annotations.licenseUrl);
}
async function annotationLoading(page, width) {
  const annotation = media('met-315784').annotations;
  const pending = gate();
  const matcher = '**/atlas/media-records/chavin-textile.json?*';
  let requests = 0;
  await page.route(matcher, async (request) => {
    requests++;
    if (requests === 1) {
      await pending.promise;
      return request.fulfill({ status: 503, body: 'Temporarily unavailable' });
    }
    return request.continue();
  });
  try {
    await page.goto(route('chavin-textile', 'met-315784', -300));
    const figure = page.locator('.object-figure');
    await expect(figure).toHaveAttribute('data-media-status', 'loading');
    await expect(page.locator('.annotated-image--web .annotation-canvas')).toHaveCount(
      1,
    );
    await expect(figure.locator('.annotation-pin')).toHaveCount(0);
    await page.locator('.image-open img').evaluate((img) => img.decode());
    await page.evaluate(() => {
      window.__annotationMain = document.querySelector('.image-open img');
      window.__annotationCanvas = document.querySelector(
        '.annotated-image--web .annotation-canvas',
      );
    });
    await page.locator('.image-open').click();
    const inspection = page.locator('.inspection');
    await expect(inspection).toBeVisible();
    await page.evaluate(() => {
      window.__annotationInspection = document.querySelector('.inspection img');
    });
    await inspection.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await expect(inspection.locator('output')).toHaveText('150%');
    pending.release();
    await expect(figure).toHaveAttribute('data-media-status', 'failed');
    await expect(inspection.locator('.annotation-pin')).toHaveCount(0);
    await expect(inspection.locator('.annotation-notes')).toHaveCount(0);
    const retry = inspection.getByRole('button', {
      name: 'Retry image information',
      exact: true,
    });
    await retry.focus();
    await retry.press('Enter');
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    await expect(
      inspection.getByRole('button', { name: 'Close inspection', exact: true }),
    ).toBeFocused();
    await expect(inspection.locator('output')).toHaveText('150%');
    assert.ok(
      await page.evaluate(
        () =>
          window.__annotationMain === document.querySelector('.image-open img') &&
          window.__annotationCanvas ===
            document.querySelector('.annotated-image--web .annotation-canvas') &&
          window.__annotationInspection === document.querySelector('.inspection img'),
      ),
      'Hydration/retry retains both images and the primary canvas',
    );
    const geometry = await assertPins(inspection, annotation, 18);
    await inspection.evaluate((element) => {
      element.scrollTo(0, 0);
      element.querySelector('.inspection-scroll').scrollTo(0, 0);
    });
    await inspection.screenshot({
      path: `${out}/annotation-inspection-image-${width}.png`,
    });
    const region = inspection.getByRole('region', {
      name: 'Zoomed object image',
      exact: true,
    });
    await region.focus();
    await expect(region).toBeFocused();
    const scrollAxes = await region.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const image = element.querySelector('img').getBoundingClientRect();
      const left = box.left + element.clientLeft;
      const top = box.top + element.clientTop;
      return [
        {
          axis: 'x',
          key: 'ArrowRight',
          position: 'scrollLeft',
          value: element.scrollLeft,
          extent: element.scrollWidth,
          viewport: element.clientWidth,
          imageInside:
            image.left >= left - 1 && image.right <= left + element.clientWidth + 1,
        },
        {
          axis: 'y',
          key: 'ArrowDown',
          position: 'scrollTop',
          value: element.scrollTop,
          extent: element.scrollHeight,
          viewport: element.clientHeight,
          imageInside:
            image.top >= top - 1 && image.bottom <= top + element.clientHeight + 1,
        },
      ];
    });
    const panningAxes = scrollAxes.filter((axis) => axis.extent > axis.viewport + 1);
    assert.ok(
      panningAxes.length,
      'The enlarged annotation fixture has real overflow to pan',
    );
    for (const axis of scrollAxes) {
      if (axis.extent > axis.viewport + 1) {
        await region.press(axis.key);
        await expect
          .poll(() => region.evaluate((element, key) => element[key], axis.position))
          .toBeGreaterThan(axis.value);
      } else {
        assert.equal(axis.value, 0, `The fitting ${axis.axis} axis remains unpanned`);
        assert.ok(
          axis.imageInside,
          `The complete image remains inside the fitting ${axis.axis} axis`,
        );
      }
      await expect(region).toBeFocused();
    }
    await assertAnnotationNotes(inspection, annotation);
    assert.deepEqual(
      (await new AxeBuilder({ page }).analyze()).violations,
      [],
      `Annotated inspection/${width}`,
    );
    await inspection.screenshot({ path: `${out}/annotation-inspection-${width}.png` });
    await page.keyboard.press('Escape');
    await expect(inspection).not.toBeVisible();
    await expect(page.locator('.image-open')).toBeFocused();
    assert.equal(requests, 2);
    return {
      width,
      metadataFailureRetry: true,
      stableImageAndCanvas: true,
      zoom: '150%',
      keyboardPanning: true,
      keyboardPanAxes: panningAxes.map((axis) => axis.axis),
      inspectionScrollAxes: scrollAxes,
      inspectionGeometry: geometry,
    };
  } finally {
    pending.release();
    await page.unroute(matcher);
  }
}
async function inspectObject(page, object) {
  const record = media(object);
  const image = page.locator('.image-open img');
  const size = await image.evaluate((img) => ({
    width: img.getBoundingClientRect().width,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
  }));
  assert.equal(size.naturalWidth, record.width);
  assert.equal(size.naturalHeight, record.height);
  assert.ok(
    size.width <= record.width + 1,
    'Online image stays within its natural-size ceiling',
  );
  await expect(page.locator('.object-figure .media-attribution').first()).toContainText(
    record.credit,
  );
  await expect(page.locator('.object-figure .media-attribution').first()).toContainText(
    record.rights,
  );
  if (record.licenseUrl)
    await expect(
      page.getByRole('link', { name: 'Read the image licence ↗', exact: true }),
    ).toHaveAttribute('href', record.licenseUrl);
  if (record.annotations)
    await assertAnnotationNotes(
      page.locator('.object-figure > figcaption'),
      record.annotations,
    );
  await page.locator('.image-open').click();
  const inspection = page.locator('.inspection');
  await expect(inspection).toBeVisible();
  if (record.licenseUrl)
    await expect(
      inspection.getByRole('link', { name: 'Image licence ↗', exact: true }),
    ).toHaveAttribute('href', record.licenseUrl);
  await page.keyboard.press('Escape');
  await expect(page.locator('.image-open')).toBeFocused();
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
      assert.ok(response.ok());
      corpus = await response.json();
      assert.equal(media('met-315784').annotations.items.length, 4);
    }
    results.push(await annotationLoading(page, width));
    for (const { id, object, year, interval } of cases) {
      await page.goto(route(id, object, year));
      await ready(page);
      const subject = corpus.subjects.find((row) => row.id === id);
      assert.deepEqual([subject.interval.start, subject.interval.end], interval);
      await expect(page.locator('.dossier h1')).toHaveText(subject.name);
      await expect(page.locator('.dossier > .date-label')).toHaveText(
        subject.interval.label,
      );
      await expect(page.locator('.dossier > .scope-note')).toContainText(
        subject.geographicPrecision,
      );
      for (const section of subject.sections)
        await expect(
          page.getByRole('heading', { level: 2, name: section.title, exact: true }),
        ).toBeVisible();
      await page.locator('.family-start > summary').click();
      await expect(page.locator('.family-start > ol')).toBeVisible();
      const deeper = page.locator('.deeper-reading > details');
      await expect(deeper).toHaveCount(subject.deeperReading.length);
      for (let index = 0; index < subject.deeperReading.length; index++) {
        await deeper.nth(index).locator(':scope > summary').click();
        await expect(deeper.nth(index).locator('p').first()).toBeVisible();
      }
      await expect(page.locator('.evidence-reading article')).toHaveCount(
        subject.evidenceReading.items.length,
      );
      const references = corpus.contexts.filter((row) =>
        subject.contextIds.includes(row.id),
      );
      const timeline = page.locator('.reference-timeline');
      for (const reference of references) {
        await expect(timeline).toContainText(reference.interval.label);
        await expect(timeline).toContainText(reference.interval.note);
        for (const phase of reference.phases)
          await expect(timeline).toContainText(phase.title);
      }
      if (id === 'teotihuacan')
        assert.ok(
          references.some((reference) => reference.interval.end === 650),
          'Selected reference stops at650 while full case remains800',
        );
      if (subject.placeStudy) {
        const places = page.locator('.place-index button');
        await expect(places).toHaveCount(subject.placeStudy.points.length);
        for (let index = 0; index < subject.placeStudy.points.length; index++) {
          await places.nth(index).press('Enter');
          await expect(places.nth(index)).toHaveAttribute('aria-pressed', 'true');
          await expect(page.locator('.place-explanation h3')).toHaveText(
            subject.placeStudy.points[index].label,
          );
        }
        await expect(page.locator('.place-study')).toContainText(
          subject.placeStudy.description,
        );
      }
      const imageSize = await inspectObject(page, object);
      const annotations = media(object).annotations;
      const geometry = annotations
        ? await assertPins(page.locator('.annotated-image--web'), annotations, 18)
        : null;
      if (guides.includes(object)) {
        assert.equal(media(object).date.start, 2026);
        assert.equal(media(object).width, 600);
        assert.equal(media(object).height, 360);
        assert.equal(media(object).licenseUrl, ccBy);
        assert.ok(media(object).representedDate?.trim());
      }
      assert.deepEqual(
        (await new AxeBuilder({ page }).analyze()).violations,
        [],
        `${id}/${width}`,
      );
      await noOverflow(page);
      await page.screenshot({ path: `${out}/${id}-${width}.png` });
      results.push({
        id,
        width,
        reading: true,
        phases: true,
        allNamedPlaces: subject.placeStudy?.points.length ?? 0,
        imageSize,
        annotationGeometry: geometry,
        axe: [],
      });
    }
    await page.goto(route('teotihuacan', 'teotihuacan-tlajinga-map', 400));
    await ready(page);
    await inspectObject(page, 'teotihuacan-tlajinga-map');
    assert.equal(media('teotihuacan-tlajinga-map').licenseUrl, ccNc);
    await expect(page.locator('.object-figure > figcaption')).toContainText(
      /composite/i,
    );
    await expect(page.locator('.object-figure > figcaption')).toContainText(/2026/);
    await expect(page.locator('.object-figure > figcaption')).toContainText(/200 m/);
    await expect(page.locator('.object-figure > figcaption')).toContainText(
      /small|text equivalent|text-equivalent/i,
    );
    assert.deepEqual(external, []);
    assert.deepEqual(errors, []);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1000, height: 1200 } });
  const page = await context.newPage();
  const smallestFonts = {},
    readerPrintScales = {};
  for (const id of guides) {
    await page.goto(`${root}/atlas/media/${id}.svg`);
    const labels = await page.locator('svg text').evaluateAll((nodes) =>
      nodes.map((e) => {
        const b = e.getBBox(),
          v = e.ownerSVGElement.viewBox.baseVal;
        const baselineX = Number(e.getAttribute('x')),
          baselineY = Number(e.getAttribute('y'));
        const panel = [...e.ownerSVGElement.querySelectorAll('rect[x][y]')]
          .map((rect) => rect.getBBox())
          .find(
            (rect) =>
              baselineX >= rect.x &&
              baselineX <= rect.x + rect.width &&
              baselineY >= rect.y &&
              baselineY <= rect.y + rect.height,
          );
        return {
          text: e.textContent,
          x: b.x,
          y: b.y,
          right: b.x + b.width,
          bottom: b.y + b.height,
          width: v.width,
          height: v.height,
          panel: panel
            ? {
                left: panel.x,
                top: panel.y,
                right: panel.x + panel.width,
                bottom: panel.y + panel.height,
              }
            : null,
          font: Number.parseFloat(document.defaultView.getComputedStyle(e).fontSize),
        };
      }),
    );
    assert.ok(labels.length >= 4);
    assert.deepEqual(
      labels.filter(
        (label) =>
          label.panel &&
          (label.x < label.panel.left - 0.1 ||
            label.y < label.panel.top - 0.1 ||
            label.right > label.panel.right + 0.1 ||
            label.bottom > label.panel.bottom + 0.1),
      ),
      [],
      `${id}: headings and other panel text stay inside their own inset rectangles`,
    );
    assert.deepEqual(
      labels.filter(
        (b) =>
          b.x < -0.1 ||
          b.y < -0.1 ||
          b.right > b.width + 0.1 ||
          b.bottom > b.height + 0.1,
      ),
      [],
      `${id}: SVG text bounds`,
    );
    assert.deepEqual(
      labels.flatMap((a, index) =>
        labels
          .slice(index + 1)
          .filter(
            (b) =>
              Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 &&
              Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1,
          )
          .map((b) => [a.text, b.text]),
      ),
      [],
      `${id}: SVG text overlaps`,
    );
    smallestFonts[id] = Math.min(...labels.map((label) => label.font));
    assert.ok(smallestFonts[id] >= 32, `${id}: minimum source label size32px`);
    results.push({ id, guideLabelBounds: labels });
  }
  for (const { id } of cases) {
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-bibliography').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode()));
    });
    await assertReaderMap(page);
    if (id === 'chavin-textile') {
      const figure = page
        .locator('.reader-image')
        .filter({ has: page.locator('img[src$="/315784-0.webp"]') });
      const annotations = media('met-315784').annotations;
      const geometry = await assertPins(figure, annotations, (10 * 96) / 72 - 0.001);
      const notes = page.locator('.reader-print > .annotation-notes');
      await expect(notes).toHaveCount(1);
      for (const item of annotations.items) {
        const note = notes.locator(`[data-annotation-note="${item.id}"]`);
        await expect(note).toContainText(item.text);
        for (const citation of item.citations) {
          const source = corpus.sources.find((row) => row.id === citation.source);
          await expect(note).toContainText(citation.locator);
          await expect(page.locator('.reader-bibliography')).toContainText(
            source.title,
          );
        }
      }
      assert.ok(
        !(await notes.innerText()).includes('[0]'),
        'Annotation references are included in reader numbering',
      );
      results.push({
        id,
        printedAnnotationGeometry: geometry,
        fullNotesAndBibliography: true,
      });
    }
    for (const guide of guides.filter((guide) =>
      corpus.subjects.find((row) => row.id === id).objectIds.includes(guide),
    )) {
      const scale = await page
        .locator(`.reader-image img[src$="/${guide}.svg"]`)
        .evaluate((img) => {
          const b = img.getBoundingClientRect(),
            s = document.defaultView.getComputedStyle(img);
          return Math.min(
            (b.width -
              Number.parseFloat(s.paddingLeft) -
              Number.parseFloat(s.paddingRight)) /
              img.naturalWidth,
            (b.height -
              Number.parseFloat(s.paddingTop) -
              Number.parseFloat(s.paddingBottom)) /
              img.naturalHeight,
          );
        });
      const points = (smallestFonts[guide] * scale * 72) / 96;
      assert.ok(points + 0.001 >= 10, `${guide}: actual reader label${points}pt`);
      readerPrintScales[guide] = points;
    }
    if (id === 'teotihuacan') {
      const map = page
        .locator('.reader-image')
        .filter({ has: page.locator('img[src$="/teotihuacan-tlajinga-map.webp"]') });
      await expect(map).toContainText(/composite/i);
      await expect(map.locator(`a[href="${ccNc}"]`)).toHaveCount(1);
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
      letterPageGeometry: true,
      mapGeometry: true,
      pdfPaginationVerification:
        'Final PDF bounds/tags/text/orphan-footer checks are performed by the candidate receipt verifier, without a new reader page-count cap.',
    });
  }
  await page.goto(`${root}/?print=family`);
  await page.locator(`.family-sheet[data-journey="${journeyId}"]`).waitFor();
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
  const family = page.locator(`.family-sheet[data-journey="${journeyId}"]`);
  const familyBounds = await page.locator('.family-sheet').evaluateAll((nodes) =>
    nodes.map((e) => {
      const s = document.defaultView.getComputedStyle(e);
      return {
        journey: e.dataset.journey,
        width: Number.parseFloat(s.width),
        height: Number.parseFloat(s.height),
        boxSizing: s.boxSizing,
        transform: s.transform,
      };
    }),
  );
  assert.deepEqual(
    familyBounds.filter(
      (b) =>
        Math.abs(b.width - 816) > 0.5 ||
        b.height > 1056.01 ||
        b.boxSizing !== 'border-box' ||
        b.transform !== 'none',
    ),
    [],
    'All real family compositions retain existing Letter bounds',
  );
  await expect(family.locator('img')).toHaveAttribute('src', /315784-0\.webp$/);
  const annotations = media('met-315784').annotations;
  const familyGeometry = await assertPins(family, annotations, (10 * 96) / 72 - 0.001);
  const legend = family.locator('.annotation-notes--compact');
  for (const [index, item] of annotations.items.entries()) {
    await expect(legend).toContainText(`${index + 1}. ${item.label}`);
    await expect(legend).not.toContainText(item.text);
  }
  await expect(legend).toContainText(annotations.credit);
  await expect(
    legend.getByRole('link', { name: 'Annotation licence', exact: true }),
  ).toHaveAttribute('href', annotations.licenseUrl);
  const compactFonts = await legend
    .locator('li,.annotation-credit')
    .evaluateAll((nodes) =>
      nodes.map(
        (e) =>
          (Number.parseFloat(document.defaultView.getComputedStyle(e).fontSize) * 72) /
          96,
      ),
    );
  assert.ok(
    compactFonts.every((font) => font + 0.001 >= 10),
    'Compact legend and modern credit retain at least10pt',
  );
  const frame = await family.locator('.annotated-image-frame').evaluate((e) => {
    const b = e.getBoundingClientRect(),
      s = document.defaultView.getComputedStyle(e);
    return {
      width: b.width,
      height: b.height,
      contentWidth:
        b.width - Number.parseFloat(s.paddingLeft) - Number.parseFloat(s.paddingRight),
      contentHeight:
        b.height - Number.parseFloat(s.paddingTop) - Number.parseFloat(s.paddingBottom),
    };
  });
  assert.ok(
    Math.abs(frame.height - (50 / 25.4) * 96) < 1,
    'Family image frame remains50mm',
  );
  const familyGuideFit = {};
  for (const id of guides) {
    const guide = media(id);
    const points =
      (smallestFonts[id] *
        Math.min(frame.contentWidth / guide.width, frame.contentHeight / guide.height) *
        72) /
      96;
    assert.ok(
      points + 0.001 >= 10,
      `${id}: fit at actual50mm family frame is${points}pt`,
    );
    familyGuideFit[id] = points;
  }
  const writing = await family
    .locator('.writing-space')
    .evaluateAll((nodes) => nodes.map((e) => e.getBoundingClientRect().height));
  assert.ok(
    writing.every((height) => height >= 67.9),
    'Family writing spaces retain18mm',
  );
  await family.screenshot({ path: `${out}/family-images-spaces-work.png` });
  await fs.writeFile(
    `${out}/print-geometry.json`,
    JSON.stringify(
      {
        smallestFonts,
        readerPrintScales,
        familyBounds,
        familyAnnotationGeometry: familyGeometry,
        compactFonts,
        measuredFamilyFrame: frame,
        guideFitAtMeasuredFamilyFrame: familyGuideFit,
        writingSpaces: writing,
      },
      null,
      2,
    ),
  );
  await context.close();
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'Images/work: four-width reading, source/guide dates and rights, actual annotation alignment/loading/retry/focus/150% inspection, SVG bounds and physical print-label targets passed; three readers exported.',
  );
} catch (error) {
  await fs.writeFile(
    `${out}/failure.json`,
    JSON.stringify(
      {
        result: 'failed',
        message: error.message,
        stack: error.stack,
        completed: results,
      },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}

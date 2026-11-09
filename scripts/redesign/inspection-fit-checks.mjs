/* global document, window */
import process from 'node:process';
import console from 'node:console';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report) throw Error('Use an isolated candidate preview and report.');
const out = `${report}/inspection-fit`;
await fs.mkdir(out, { recursive: true });
const bytes = await fs.readFile('public/atlas/corpus.json');
assert.ok(
  bytes.equals(
    await fs.readFile(`${process.env.ATLAS_BUILD_ROOT ?? 'dist'}/atlas/corpus.json`),
  ),
  'Stale built corpus',
);
const corpus = JSON.parse(bytes);
const media = (id) => {
  const value = corpus.media.find((object) => object.id === id);
  assert.ok(value, `Missing regression image: ${id}`);
  return value;
};
const portrait = media('met-42549');
const annotated = media('met-317600');
const landscape = media('met-449533');
const tiny = media('indonesia-proclamation');
assert.ok(annotated.annotations?.items.length && annotated.additionalImages?.length);
assert.ok(portrait.width < portrait.height);
assert.ok(landscape.width > landscape.height);
assert.ok(tiny.width < 500 && tiny.height < 500);
const browser = await chromium.launch();
const results = [];
const external = [];
const errors = [];
const gate = () => {
  let release;
  const promise = new Promise((resolve) => {
    release = resolve;
  });
  return { promise, release };
};

function url(object) {
  const subject = corpus.subjects.find((value) => value.id === object.subject);
  assert.ok(subject);
  return `${root}/?pack=${subject.packs[0]}&subject=${subject.id}&object=${object.id}&scale=local&year=${object.date.start ?? subject.interval.start}`;
}

async function fresh(width) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(root).origin)
      return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', (error) => errors.push(error.message));
  return { context, page };
}

function inspection(page) {
  const dialog = page.locator('.inspection[open]');
  return {
    dialog,
    region: dialog.getByRole('region', { name: 'Zoomed object image', exact: true }),
    image: dialog.locator('.inspection-scroll img'),
  };
}

async function loadedImage(image) {
  await expect(image).toBeVisible();
  await expect
    .poll(
      () => image.evaluate((element) => element.complete && element.naturalWidth > 0),
      {
        timeout: 15000,
        message: 'The visible inspection image must actually load within the bound',
      },
    )
    .toBe(true);
}

async function geometry(region) {
  return region.evaluate((element) => {
    const image = element.querySelector('img');
    if (!image) throw Error('Missing inspection image');
    const box = element.getBoundingClientRect();
    const rectangle = image.getBoundingClientRect();
    const viewport = {
      left: box.left + element.clientLeft,
      top: box.top + element.clientTop,
      width: element.clientWidth,
      height: element.clientHeight,
    };
    viewport.right = viewport.left + viewport.width;
    viewport.bottom = viewport.top + viewport.height;
    return {
      viewport,
      image: {
        left: rectangle.left,
        top: rectangle.top,
        right: rectangle.right,
        bottom: rectangle.bottom,
        width: rectangle.width,
        height: rectangle.height,
      },
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      point: {
        x: (viewport.left + viewport.width / 2 - rectangle.left) / rectangle.width,
        y: (viewport.top + viewport.height / 2 - rectangle.top) / rectangle.height,
      },
    };
  });
}

function fitError(value) {
  const fittedWidth = Math.min(
    value.viewport.width,
    (value.viewport.height * value.naturalWidth) / value.naturalHeight,
    value.naturalWidth,
  );
  return Math.max(
    Math.abs(value.image.width - fittedWidth),
    Math.abs(
      value.image.height - (fittedWidth * value.naturalHeight) / value.naturalWidth,
    ),
    Math.abs((value.point.x - 0.5) * value.image.width),
    Math.abs((value.point.y - 0.5) * value.image.height),
  );
}

function centered(value, label) {
  assert.ok(Math.abs(value.point.x - 0.5) <= 0.01, `${label}: centered image x point`);
  assert.ok(Math.abs(value.point.y - 0.5) <= 0.01, `${label}: centered image y point`);
}

async function assertCentered(region, label) {
  await expect
    .poll(
      async () => {
        const value = await geometry(region);
        return Math.max(
          Math.abs((value.point.x - 0.5) * value.image.width),
          Math.abs((value.point.y - 0.5) * value.image.height),
        );
      },
      { message: `${label}: the viewport retains the centered source point` },
    )
    .toBeLessThanOrEqual(2);
  const value = await geometry(region);
  centered(value, label);
  return value;
}

async function assertFit(region, label) {
  await expect
    .poll(async () => fitError(await geometry(region)), {
      message: `${label}: height-aware, width-aware natural-size fit`,
    })
    .toBeLessThanOrEqual(2);
  const value = await geometry(region);
  assert.ok(value.image.width > 0 && value.image.height > 0, `${label}: nonzero image`);
  assert.ok(
    value.image.width <= value.naturalWidth + 1,
    `${label}: natural width ceiling`,
  );
  assert.ok(
    value.image.height <= value.naturalHeight + 1,
    `${label}: natural height ceiling`,
  );
  assert.ok(
    value.image.left >= value.viewport.left - 1,
    `${label}: complete left edge`,
  );
  assert.ok(
    value.image.right <= value.viewport.right + 1,
    `${label}: complete right edge`,
  );
  assert.ok(value.image.top >= value.viewport.top - 1, `${label}: complete top edge`);
  assert.ok(
    value.image.bottom <= value.viewport.bottom + 1,
    `${label}: complete bottom edge`,
  );
  assert.ok(
    value.scrollWidth <= value.viewport.width + 1,
    `${label}: no fake x overflow at fit`,
  );
  assert.ok(
    value.scrollHeight <= value.viewport.height + 1,
    `${label}: no fake y overflow at fit`,
  );
  centered(value, label);
  return value;
}

async function zoom(page, percent) {
  const { dialog } = inspection(page);
  const output = dialog.locator('output');
  const current = Number.parseInt(await output.innerText(), 10);
  const button = dialog.getByRole('button', {
    name: percent > current ? 'Zoom in' : 'Zoom out',
    exact: true,
  });
  for (
    let value = current;
    value !== percent;
    value += Math.sign(percent - current) * 50
  ) {
    await button.focus();
    await button.press('Enter');
    const next = value + Math.sign(percent - current) * 50;
    if (next > 100 && next < 300) await expect(button).toBeFocused();
  }
  await expect(output).toHaveText(`${percent}%`);
}

async function assertZoom(region, fit, multiplier, label) {
  await expect
    .poll(
      async () => {
        const value = await geometry(region);
        return Math.max(
          Math.abs(value.image.width - fit.image.width * multiplier),
          Math.abs(value.image.height - fit.image.height * multiplier),
        );
      },
      { message: `${label}: zoom is relative to the fitted source rectangle` },
    )
    .toBeLessThanOrEqual(2);
  const value = await geometry(region);
  assert.ok(
    Math.abs(
      value.image.width / value.image.height - value.naturalWidth / value.naturalHeight,
    ) < 0.003,
    `${label}: natural ratio is preserved`,
  );
  return value;
}

async function pan(region, label) {
  await region.focus();
  await expect(region).toBeFocused();
  const axes = [];
  for (const [axis, key, size, viewport, position] of [
    ['x', 'ArrowRight', 'scrollWidth', 'width', 'scrollLeft'],
    ['y', 'ArrowDown', 'scrollHeight', 'height', 'scrollTop'],
  ]) {
    const before = await geometry(region);
    if (before[size] > before.viewport[viewport] + 1) {
      await region.press(key);
      await expect
        .poll(async () => (await geometry(region))[position], {
          message: `${label}: native keyboard ${axis} panning`,
        })
        .toBeGreaterThan(before[position]);
      axes.push(axis);
    } else {
      assert.ok(
        before[position] <= 1,
        `${label}: fitting ${axis} axis has no invented pan`,
      );
    }
  }
  await expect(region).toBeFocused();
  let previous;
  let settled = 0;
  await expect
    .poll(
      async () => {
        const value = await geometry(region);
        if (
          previous &&
          Math.abs(value.scrollLeft - previous.scrollLeft) < 0.1 &&
          Math.abs(value.scrollTop - previous.scrollTop) < 0.1
        )
          settled++;
        else settled = 0;
        previous = value;
        return settled;
      },
      {
        intervals: [50, 100, 150],
        message: `${label}: native key pan settles before recovery checks`,
      },
    )
    .toBeGreaterThanOrEqual(2);
  return { axes, geometry: await geometry(region) };
}

async function open(page, object, ready = true) {
  await page.goto(url(object));
  const figure = page.locator('.object-figure');
  await expect(figure).toHaveAttribute('data-media-id', object.id);
  await expect(figure).toHaveAttribute(
    'data-media-status',
    ready ? 'ready' : 'loading',
  );
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe('loaded');
  await page.locator('.image-open').click();
  const value = inspection(page);
  await expect(value.dialog).toBeVisible();
  await loadedImage(value.image);
  await expect(value.dialog.locator('output')).toHaveText('100%');
  return { ...value, figure };
}

async function pinGeometry(dialog, object) {
  const canvas = dialog.locator('.annotation-canvas');
  await expect(canvas).toHaveCount(1);
  await expect(canvas.locator('.annotation-pin')).toHaveCount(
    object.annotations.items.length,
  );
  const measured = await canvas.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const image = element.querySelector('img').getBoundingClientRect();
    return {
      edges: Math.max(
        ...['left', 'right', 'top', 'bottom'].map((key) =>
          Math.abs(box[key] - image[key]),
        ),
      ),
      pins: [...element.querySelectorAll('.annotation-pin')].map((pin) => {
        const rectangle = pin.getBoundingClientRect();
        return {
          id: pin.dataset.annotationId,
          x: ((rectangle.left + rectangle.right) / 2 - box.left) / box.width,
          y: ((rectangle.top + rectangle.bottom) / 2 - box.top) / box.height,
        };
      }),
    };
  });
  assert.ok(
    measured.edges <= 1,
    'Annotation canvas is the complete actual image rectangle',
  );
  for (const item of object.annotations.items) {
    const pin = measured.pins.find((value) => value.id === item.id);
    assert.ok(
      pin && Math.abs(pin.x - item.x) <= 0.003 && Math.abs(pin.y - item.y) <= 0.003,
      `Annotation ${item.id} retains its normalized source target`,
    );
  }
  return measured;
}

try {
  for (const width of [320, 390, 768, 1440]) {
    const { context, page } = await fresh(width);
    const first = gate();
    const retry = gate();
    let requests = 0;
    await page.route(
      /\/atlas\/media-records\/ming-workshops\.json\?/,
      async (route) => {
        requests++;
        if (requests === 1) {
          await first.promise;
          return route.fulfill({ status: 503, body: 'Temporarily unavailable' });
        }
        await retry.promise;
        return route.continue();
      },
    );
    try {
      const { region, dialog, image, figure } = await open(page, portrait, false);
      const fit = await assertFit(region, `Ming/${width}/100% pending`);
      await dialog.screenshot({ path: `${out}/ming-fit-${width}.png` });
      await image.evaluate((element) => {
        window.__fitImage = element;
      });
      await zoom(page, 150);
      await assertZoom(region, fit, 1.5, `Ming/${width}/150%`);
      const enlarged = await assertCentered(region, `Ming/${width}/150%`);
      await dialog.screenshot({ path: `${out}/ming-centered-150-${width}.png` });
      const panned = await pan(region, `Ming/${width}`);
      assert.ok(
        panned.axes.length,
        'A 150% portrait offers real pan on at least one axis',
      );
      first.release();
      await expect(figure).toHaveAttribute('data-media-status', 'failed');
      await expect(dialog.locator('.media-attribution')).toContainText(portrait.credit);
      await expect(dialog.locator('.media-attribution')).toContainText(portrait.rights);
      const retryButton = dialog.getByRole('button', {
        name: 'Retry image information',
        exact: true,
      });
      await retryButton.focus();
      await retryButton.press('Enter');
      await expect(
        dialog.getByRole('button', { name: 'Close inspection', exact: true }),
      ).toBeFocused();
      await expect(figure).toHaveAttribute('data-media-status', 'loading');
      await expect(dialog.locator('output')).toHaveText('150%');
      retry.release();
      await expect(figure).toHaveAttribute('data-media-status', 'ready');
      await expect(
        dialog.getByRole('button', { name: 'Close inspection', exact: true }),
      ).toBeFocused();
      await expect(dialog.locator('output')).toHaveText('150%');
      assert.ok(
        await image.evaluate((element) => element === window.__fitImage),
        'Image node survives metadata retry',
      );
      const recovered = await geometry(region);
      assert.ok(
        Math.abs(recovered.point.x - panned.geometry.point.x) <= 0.02 &&
          Math.abs(recovered.point.y - panned.geometry.point.y) <= 0.02,
        'Metadata recovery preserves the panned source point',
      );
      assert.equal(requests, 2);
      await zoom(page, 100);
      const returned = await assertFit(region, `Ming/${width}/100% return`);
      await dialog
        .getByRole('button', { name: 'Close inspection', exact: true })
        .click();
      await expect(page.locator('.image-open')).toBeFocused();

      const annotatedView = await open(page, annotated);
      const annotationFit = await assertFit(
        annotatedView.region,
        `Annotated/${width}/100%`,
      );
      const fitPins = await pinGeometry(annotatedView.dialog, annotated);
      await zoom(page, 150);
      await assertZoom(
        annotatedView.region,
        annotationFit,
        1.5,
        `Annotated/${width}/150%`,
      );
      const annotationZoom = await assertCentered(
        annotatedView.region,
        `Annotated/${width}/150%`,
      );
      const zoomPins = await pinGeometry(annotatedView.dialog, annotated);
      await pan(annotatedView.region, `Annotated/${width}`);
      await annotatedView.dialog
        .getByRole('combobox', { name: /^View/ })
        .selectOption('1');
      await expect(annotatedView.dialog.locator('output')).toHaveText('100%');
      await expect(annotatedView.image).toHaveAttribute(
        'src',
        annotated.additionalImages[0],
      );
      await expect(annotatedView.image).toHaveAttribute(
        'alt',
        annotated.additionalImageAlts?.[0] ?? `Additional view of ${annotated.title}`,
      );
      await loadedImage(annotatedView.image);
      const alternate = await assertFit(
        annotatedView.region,
        `Alternate/${width}/100%`,
      );
      assert.ok(
        Math.abs(
          alternate.naturalWidth / alternate.naturalHeight -
            annotationFit.naturalWidth / annotationFit.naturalHeight,
        ) > 0.01,
        'The alternate fixture actually exercises a different native ratio',
      );
      await expect(annotatedView.dialog.locator('.annotation-pin')).toHaveCount(0);
      await expect(annotatedView.dialog.locator('.annotation-notes')).toHaveCount(0);
      await annotatedView.dialog
        .getByRole('combobox', { name: /^View/ })
        .selectOption('0');
      await expect(annotatedView.image).toHaveAttribute('src', annotated.image);
      await loadedImage(annotatedView.image);
      const primaryReset = await assertFit(
        annotatedView.region,
        `Primary reset/${width}`,
      );
      await pinGeometry(annotatedView.dialog, annotated);
      await page.keyboard.press('Escape');

      const wide = await open(page, landscape);
      const landscapeFit = await assertFit(wide.region, `Landscape/${width}/100%`);
      await zoom(page, 300);
      const landscapeZoom = await assertZoom(
        wide.region,
        landscapeFit,
        3,
        `Landscape/${width}/300%`,
      );
      assert.ok(
        landscapeZoom.scrollWidth > landscapeZoom.viewport.width + 1,
        'The wider source at300% provides actual horizontal overflow',
      );
      const landscapePan = await pan(wide.region, `Landscape/${width}/300%`);
      assert.ok(
        landscapePan.axes.includes('x'),
        'Native horizontal panning remains available on real overflow',
      );
      await page.keyboard.press('Escape');

      const small = await open(page, tiny);
      const tinyFit = await assertFit(small.region, `Small source/${width}/100%`);
      if (width === 1440)
        assert.ok(
          Math.abs(tinyFit.image.width - tiny.width) <= 1,
          'A small source with space available stays at its natural size',
        );
      await page.keyboard.press('Escape');
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `No document overflow at${width}`,
      );
      results.push({
        width,
        portrait: {
          fit,
          centered150: enlarged,
          panned,
          recovered,
          returned,
          metadataRequests: requests,
        },
        annotated: {
          fit: annotationFit,
          zoom150: annotationZoom,
          fitPins,
          zoomPins,
          alternate,
          primaryReset,
        },
        landscape: {
          fit: landscapeFit,
          zoom300: landscapeZoom,
          keyboardPan: landscapePan,
        },
        smallSource: tinyFit,
      });
    } finally {
      first.release();
      retry.release();
      await context.close();
    }
  }
  assert.deepEqual(errors, [], 'No page errors');
  assert.deepEqual(external, [], 'Inspection requires no external request');
  await fs.writeFile(
    `${out}/result.json`,
    JSON.stringify(
      {
        result: 'pass',
        corpusSHA256: createHash('sha256').update(bytes).digest('hex'),
        widths: results,
        pageErrors: errors,
        externalRequests: external,
        scope:
          'Actual browser geometry, keyboard panning, metadata recovery, annotation alignment and alternate native ratios; screenshots are supplementary author review material.',
      },
      null,
      2,
    ),
  );
  console.log(
    'Inspection fit: all four widths pass complete-source fit, centered relative zoom, keyboard pan, metadata retry, annotations, alternates and natural ceilings.',
  );
} catch (error) {
  await fs.writeFile(
    `${out}/result.json`,
    JSON.stringify(
      {
        result: 'fail',
        error: String(error),
        completedWidths: results,
        pageErrors: errors,
        externalRequests: external,
      },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser.close();
}

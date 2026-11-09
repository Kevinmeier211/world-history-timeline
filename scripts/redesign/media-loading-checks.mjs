/* global document, window, localStorage, history, PopStateEvent */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report)
  throw Error('Use an isolated candidate preview and report directory.');
const out = `${report}/media-loading`;
await fs.mkdir(out, { recursive: true });
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const bootstrap = JSON.parse(await fs.readFile('public/atlas/index.json', 'utf8'));
assert.equal(bootstrap.mediaDetailsDeferred, true);
const plan = corpus.media.find((m) => m.id === 'nimrud-palace-plan');
const guide = corpus.media.find((m) => m.id === 'institution-evidence-guide');
const bundle = JSON.parse(
  await fs.readFile('public/atlas/media-records/nimrud-palace.json', 'utf8'),
);
const url = (subject = 'nimrud-palace', object = plan.id) =>
  `${root}/?pack=C3&subject=${subject}&object=${object}&scale=local&year=-870`;
const browser = await chromium.launch();
const results = [];
const gate = () => {
  let release;
  const promise = new Promise((resolve) => {
    release = resolve;
  });
  return { promise, release };
};

async function fresh(width = 390) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return { context, page, errors };
}
async function saveContext(page, object, answer) {
  await page.getByRole('button', { name: 'Save a question', exact: true }).click();
  await page.locator('textarea[name=answer]').fill(answer);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.locator('.save-dialog')).not.toBeVisible();
  const note = await page.evaluate((answer) => {
    const book = JSON.parse(localStorage.getItem('chronos.household.v1'));
    return book.notes.find((note) => note.answer === answer);
  }, answer);
  assert.equal(note.context.object, object.id);
  assert.ok(note.context.label.includes(object.title));
  assert.ok(
    note.context.sources
      .find((s) => s.id === object.source)
      ?.locator.includes(object.accession),
  );
  const message = page.locator('.app-message');
  await expect(message).toContainText('Saved on this device');
  const dismiss = message.getByRole('button', { name: 'Dismiss', exact: true });
  await expect(dismiss).toBeVisible();
  if (answer.startsWith('Saved after recovery')) {
    await message.screenshot({
      path: `${out}/saved-message-${page.viewportSize().width}.png`,
    });
  }
  await dismiss.click();
  await expect(message).toHaveCount(0);
}
async function noOverflow(page) {
  assert.ok(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth + 1,
    ),
  );
}

try {
  for (const width of [320, 390, 768, 1440]) {
    const { context, page, errors } = await fresh(width);
    const subjectGate = gate();
    const mediaGate = gate();
    let subjectRequests = 0;
    let mediaRequests = 0;
    await page.route('**/atlas/subjects/nimrud-palace.json', async (route) => {
      subjectRequests++;
      await subjectGate.promise;
      return route.continue();
    });
    await page.route('**/atlas/media-records/**', async (route) => {
      mediaRequests++;
      if (mediaRequests === 1) {
        await mediaGate.promise;
        return route.fulfill({ status: 503, body: 'Temporarily unavailable' });
      }
      return route.continue();
    });
    await page.goto(`${root}/?view=timeline`);
    await expect(page.locator('.living-timeline')).toBeVisible();
    assert.equal(mediaRequests, 0, 'Overview must not fetch rich media.');
    await page.goto(url());
    const figure = page.locator('.object-figure');
    await expect(figure).toHaveAttribute('data-media-status', 'loading');
    await expect.poll(() => subjectRequests).toBe(1);
    await expect.poll(() => mediaRequests).toBe(1);
    // Neither request was released: media starts independently of subject prose.
    await expect(page.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'false',
    );
    await expect(figure.getByText(plan.caption, { exact: true })).toHaveCount(0);
    await expect(figure.locator('.media-attribution').first()).toContainText(
      plan.credit,
    );
    await expect(figure.locator('.media-attribution').first()).toContainText(
      plan.rights,
    );
    await expect(
      figure
        .locator('figcaption')
        .getByRole('link', { name: 'Read the image licence ↗' }),
    ).toHaveAttribute('href', plan.licenseUrl);
    await figure.screenshot({ path: `${out}/pending-${width}.png` });
    if (width === 320)
      assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    subjectGate.release();
    await expect(page.locator('#main-explanation + .dossier-section')).toBeVisible();
    // Change the selected object while the shared bundle is still pending.
    await page
      .locator('.object-choices')
      .getByRole('button', { name: new RegExp(guide.title) })
      .click();
    await expect(figure).toHaveAttribute('data-media-id', guide.id);
    await expect(figure).toHaveAttribute('data-media-status', 'loading');
    await page
      .locator('.object-choices')
      .getByRole('button', { name: new RegExp(plan.title) })
      .click();
    await expect(figure).toHaveAttribute('data-media-id', plan.id);
    assert.equal(mediaRequests, 1);
    await saveContext(
      page,
      plan,
      `Saved while image information is pending at ${width}`,
    );
    await page.locator('.image-open img').evaluate((image) => image.decode());
    await page.evaluate(() => {
      window.__mediaImage = document.querySelector('.image-open img');
    });
    await page.locator('.image-open').click();
    const inspection = page.locator('.inspection');
    await expect(inspection).toBeVisible();
    await inspection.getByRole('button', { name: 'Zoom in', exact: true }).click();
    await expect(inspection.locator('output')).toHaveText('150%');
    const imageRegion = inspection.getByRole('region', {
      name: 'Zoomed object image',
      exact: true,
    });
    await page.keyboard.press('Tab');
    await expect(imageRegion).toBeFocused();
    const keyboardPanning = [];
    for (const [axis, key, extent, viewport, position] of [
      ['y', 'ArrowDown', 'scrollHeight', 'clientHeight', 'scrollTop'],
      ['x', 'ArrowRight', 'scrollWidth', 'clientWidth', 'scrollLeft'],
    ]) {
      const before = await imageRegion.evaluate(
        (region, keys) => ({
          extent: region[keys.extent],
          viewport: region[keys.viewport],
          position: region[keys.position],
        }),
        { extent, viewport, position },
      );
      await page.keyboard.press(key);
      if (before.extent > before.viewport + 1) {
        await expect
          .poll(() => imageRegion.evaluate((region, key) => region[key], position))
          .toBeGreaterThan(before.position);
        keyboardPanning.push({ axis, overflow: true, panned: true });
      } else {
        await expect
          .poll(() => imageRegion.evaluate((region, key) => region[key], position))
          .toBe(0);
        assert.ok(
          await imageRegion.evaluate(
            (region, keys) => region[keys.extent] <= region[keys.viewport] + 1,
            { extent, viewport },
          ),
          `The fitted ${axis} axis must not gain artificial overflow`,
        );
        keyboardPanning.push({ axis, overflow: false, panned: false });
      }
      await expect(imageRegion).toBeFocused();
    }
    assert.ok(keyboardPanning.some((axis) => axis.panned));
    mediaGate.release();
    await expect(figure).toHaveAttribute('data-media-status', 'failed');
    await expect(inspection.locator('.media-status')).toContainText(
      'Image information could not be loaded',
    );
    await expect(inspection.locator('output')).toHaveText('150%');
    assert.ok(
      await page.evaluate(() => !!document.activeElement?.closest('.inspection')),
    );
    await inspection.screenshot({ path: `${out}/failed-${width}.png` });
    if (width === 390)
      assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    await inspection
      .getByRole('button', { name: 'Retry image information', exact: true })
      .click();
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    await expect(inspection.getByText(plan.caption, { exact: true })).toBeVisible();
    await expect(inspection.locator('output')).toHaveText('150%');
    assert.ok(
      await page.evaluate(() => !!document.activeElement?.closest('.inspection')),
    );
    assert.ok(
      await page.evaluate(
        () => window.__mediaImage === document.querySelector('.image-open img'),
      ),
    );
    assert.equal(mediaRequests, 2, 'One fresh request recovers a failed bundle.');
    await page.keyboard.press('Escape');
    await expect(inspection).not.toBeVisible();
    await expect(page.locator('.image-open')).toBeFocused();
    await saveContext(page, plan, `Saved after recovery at ${width}`);
    await noOverflow(page);
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    await figure.screenshot({ path: `${out}/recovered-${width}.png` });
    assert.deepEqual(errors, []);
    results.push({
      width,
      overviewRequests: 0,
      parallelRequestsBeforeRelease: true,
      pendingObjectSwitch: true,
      notebookAccessionRetained: true,
      modalFocusAndZoomPreserved: true,
      keyboardPanning,
      stableImageThroughHydration: true,
      requestsAfterRetry: mediaRequests,
      errors,
    });
    await context.close();
  }

  const faults = [
    ['404', { status: 404, body: 'Not found' }],
    [
      'html200',
      { status: 200, contentType: 'text/html', body: '<html>Not a record</html>' },
    ],
    ['malformedJSON', { status: 200, contentType: 'application/json', body: '{' }],
    ['wrongRevision', { json: { ...bundle, revision: 'another-release' } }],
    ['wrongSubject', { json: { ...bundle, subject: 'taharqo' } }],
    ['missingRecord', { json: { ...bundle, media: bundle.media.slice(1) } }],
    [
      'blankCaption',
      {
        json: {
          ...bundle,
          media: bundle.media.map((m, i) => (i ? m : { ...m, caption: '' })),
        },
      },
    ],
    [
      'retainedFieldInjection',
      {
        json: {
          ...bundle,
          media: bundle.media.map((m, i) =>
            i ? m : { ...m, rights: 'Changed rights' },
          ),
        },
      },
    ],
  ];
  for (const [fault, response] of faults) {
    const { context, page, errors } = await fresh();
    let requests = 0;
    await page.route('**/atlas/media-records/nimrud-palace.json?*', (route) => {
      requests++;
      return requests === 1 ? route.fulfill(response) : route.continue();
    });
    await page.goto(url());
    const figure = page.locator('.object-figure');
    await expect(figure).toHaveAttribute('data-media-status', 'failed');
    await expect(figure.getByText(plan.caption, { exact: true })).toHaveCount(0);
    await expect(figure.locator('.media-attribution').first()).toContainText(
      plan.rights,
    );
    await saveContext(page, plan, `Saved during ${fault}`);
    await figure
      .locator('figcaption')
      .getByRole('button', { name: 'Retry image information' })
      .click();
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    await expect(
      figure.locator('figcaption').getByText(plan.caption, { exact: true }),
    ).toBeVisible();
    assert.equal(requests, 2);
    assert.deepEqual(errors, []);
    results.push({
      fault,
      explicitFailure: true,
      notebookAccessionRetained: true,
      requestsAfterRetry: requests,
      errors,
    });
    await context.close();
  }

  {
    const { context, page, errors } = await fresh();
    let indexRequests = 0;
    let mediaRequests = 0;
    await page.route('**/atlas/index.json', (route) => {
      indexRequests++;
      if (indexRequests !== 1) return route.continue();
      const { mediaRevision: _revision, ...incomplete } = bootstrap;
      return route.fulfill({ json: incomplete });
    });
    page.on('request', (request) => {
      if (request.url().includes('/atlas/media-records/')) mediaRequests++;
    });
    await page.goto(url());
    const figure = page.locator('.object-figure');
    await expect(figure).toHaveAttribute('data-media-status', 'failed');
    await expect(
      figure
        .locator('figcaption')
        .getByRole('button', { name: 'Retry image information' }),
    ).toHaveCount(0);
    assert.equal(
      mediaRequests,
      0,
      'An unknown release cannot request a verified media bundle.',
    );
    await figure
      .locator('figcaption')
      .getByRole('button', { name: 'Reload atlas', exact: true })
      .click();
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    await expect(figure.locator('figcaption')).toContainText(plan.caption);
    assert.equal(indexRequests, 2);
    assert.equal(mediaRequests, 1);
    assert.deepEqual(errors, []);
    results.push({
      incompleteBootstrapReload: true,
      indexRequests,
      mediaRequests,
      errors,
    });
    await context.close();
  }

  // Same mounted app, late A response after navigation to B, then a cached return.
  {
    const { context, page, errors } = await fresh();
    const held = gate();
    let requests = 0;
    await page.route('**/atlas/media-records/nimrud-palace.json?*', async (route) => {
      requests++;
      await held.promise;
      return route.continue();
    });
    await page.goto(url());
    await expect(page.locator('.object-figure')).toHaveAttribute(
      'data-media-status',
      'loading',
    );
    await page.evaluate(
      (next) => {
        history.pushState({}, '', next);
        window.dispatchEvent(new PopStateEvent('popstate'));
      },
      url('taharqo', 'sanam-mould-match'),
    );
    const current = corpus.media.find((m) => m.id === 'sanam-mould-match');
    await expect(page.locator('.object-figure')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    await expect(page.locator('.object-figure figcaption')).toContainText(
      current.caption,
    );
    const lateResponse = page.waitForResponse((response) =>
      response.url().includes('/atlas/media-records/nimrud-palace.json'),
    );
    held.release();
    await (await lateResponse).finished();
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)),
        ),
    );
    await expect(page.locator('.object-figure')).toHaveAttribute(
      'data-media-id',
      current.id,
    );
    await expect(page.locator('.object-figure figcaption')).toContainText(
      current.caption,
    );
    await page.evaluate((next) => {
      history.pushState({}, '', next);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, url());
    await expect(page.locator('.object-figure')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    await expect(page.locator('.object-figure figcaption')).toContainText(plan.caption);
    assert.equal(requests, 1, 'A completed shared request is reusable on return.');
    assert.deepEqual(errors, []);
    results.push({
      staleCaseResponseIgnored: true,
      cachedReturnRequests: requests,
      errors,
    });
    await context.close();
  }

  {
    const { context, page, errors } = await fresh();
    const subject = corpus.subjects.find((s) => s.id === 'nimrud-palace');
    const visible = corpus.media.find((m) => subject.objectIds.includes(m.id));
    const requests = [];
    page.on('request', (request) => {
      if (request.url().includes('/atlas/media-records/')) requests.push(request.url());
    });
    await page.goto(url('nimrud-palace', 'sanam-mould-match'));
    await expect(page.locator('.object-figure')).toHaveAttribute(
      'data-media-status',
      'ready',
    );
    await expect(page.locator('.object-figure')).toHaveAttribute(
      'data-media-id',
      visible.id,
    );
    await saveContext(page, visible, 'Saved from a foreign-object URL');
    assert.equal(requests.length, 1);
    assert.ok(requests[0].includes('/nimrud-palace.json?revision='));
    assert.deepEqual(errors, []);
    results.push({
      foreignObjectQueryUsesDisplayedImage: true,
      requestedSubjectOnly: true,
      errors,
    });
    await context.close();
  }

  // A failed image file has its own recovery; complete metadata stays complete.
  {
    const { context, page, errors } = await fresh();
    let imageRequests = 0;
    await page.route('**/atlas/media/nimrud-palace-plan.webp', (route) => {
      imageRequests++;
      return imageRequests === 1 ? route.abort('failed') : route.continue();
    });
    await page.goto(url());
    const figure = page.locator('.object-figure');
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    await expect(page.locator('.image-open .image-error')).toContainText(
      'Image unavailable',
    );
    await expect(page.locator('.image-open a, .image-open button')).toHaveCount(0);
    await expect(
      figure.locator('figcaption').getByRole('link', { name: 'Open source image ↗' }),
    ).toHaveAttribute('href', plan.sourceImage);
    await expect(
      figure
        .locator('figcaption')
        .getByRole('button', { name: 'Retry image information' }),
    ).toHaveCount(0);
    await figure.screenshot({ path: `${out}/image-file-failure.png` });
    await page.locator('.image-retry').click();
    await page.locator('.image-open img').evaluate((image) => image.decode());
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    await expect(figure.locator('figcaption')).toContainText(plan.caption);
    assert.ok(imageRequests >= 2);
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    assert.deepEqual(errors, []);
    results.push({
      independentImageFailureAndRetry: true,
      imageRequests,
      noNestedInteractiveFallback: true,
      errors,
    });
    await context.close();
  }

  {
    const { context, page, errors } = await fresh();
    const subject = corpus.subjects.find((s) => !s.objectIds.length);
    let requests = 0;
    page.on('request', (request) => {
      if (request.url().includes('/atlas/media-records/')) requests++;
    });
    await page.goto(
      `${root}/?pack=${subject.packs[0]}&subject=${subject.id}&year=${subject.interval.start}&scale=local`,
    );
    await expect(page.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'true',
    );
    await expect(page.locator('.object-figure')).toHaveCount(0);
    assert.equal(requests, 0);
    assert.deepEqual(errors, []);
    results.push({ imagelessSubject: subject.id, mediaSidecarRequests: 0, errors });
    await context.close();
  }

  // Full print reads canonical data directly and never needs media sidecars.
  {
    const { context, page, errors } = await fresh();
    let requests = 0;
    page.on('request', (request) => {
      if (request.url().includes('/atlas/media-records/')) requests++;
    });
    await page.goto(`${root}/?print=reader&subject=nimrud-palace`);
    await expect(page.locator('.reader-print')).toContainText(plan.caption);
    assert.equal(requests, 0);
    assert.deepEqual(errors, []);
    results.push({ canonicalPrint: true, mediaSidecarRequests: 0, errors });
    await context.close();
  }
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'Deferred media: four-width parallel loading/failure/retry, stable inspection, notebook provenance, eight corrupt-response cases, case races and complete print passed.',
  );
} finally {
  await browser.close();
}

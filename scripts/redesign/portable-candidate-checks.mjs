import { chromium } from 'playwright';
import { URL, URLSearchParams } from 'node:url';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import { createHash } from 'node:crypto';

const [packageRoot, origin, report] = process.argv.slice(2);
assert.ok(
  packageRoot && origin && report,
  'Pass extracted package, local origin and report path.',
);
assert.equal(new URL(origin).hostname, '127.0.0.1');
const site = path.join(packageRoot, 'site');
const corpus = JSON.parse(
  await fs.readFile(path.join(site, 'atlas/corpus.json'), 'utf8'),
);
const index = JSON.parse(
  await fs.readFile(path.join(site, 'atlas/index.json'), 'utf8'),
);
const state = JSON.parse(
  await fs.readFile(path.join(packageRoot, 'SOURCE_STATE.json'), 'utf8'),
);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const mediaDetailKeys = new Set([
  'caption',
  'notice',
  'creator',
  'place',
  'material',
  'representedDate',
  'relevance',
  'datingNote',
  'additionalImages',
  'additionalImageAlts',
  'printWidthMm',
  'annotations',
]);
const printOnlyKeys = new Set(['printCaption', 'printCredit']);
const fullMedia = new Map(corpus.media.map((m) => [m.id, m]));
for (const media of corpus.media) {
  if (Object.hasOwn(media, 'additionalImageAlts')) {
    assert.ok(
      Array.isArray(media.additionalImages) && Array.isArray(media.additionalImageAlts),
    );
    assert.equal(media.additionalImageAlts.length, media.additionalImages.length);
    assert.ok(
      [...media.additionalImages, ...media.additionalImageAlts].every(
        (value) => typeof value === 'string' && value.trim(),
      ),
    );
  }
  assert.ok(
    !Object.hasOwn(media, 'hasAnnotations') || media.hasAnnotations === true,
    `Invalid retained annotation flag: ${media.id}`,
  );
  assert.equal(
    Object.hasOwn(media, 'annotations'),
    media.hasAnnotations === true,
    `Annotation flag/set mismatch: ${media.id}`,
  );
  if (media.hasAnnotations)
    assert.ok(
      media.annotations !== null &&
        typeof media.annotations === 'object' &&
        !Array.isArray(media.annotations),
      `Invalid annotation set: ${media.id}`,
    );
}
const mediaSubjects = corpus.subjects.filter((s) => s.objectIds.length);
assert.equal(index.mediaDetailsDeferred, true);
assert.match(index.mediaRevision, /^[0-9a-f]{64}$/);
assert.equal(state.mediaRevision, index.mediaRevision);
assert.equal(state.mediaSidecars, mediaSubjects.length);
assert.deepEqual(
  index.media,
  corpus.media.map((m) =>
    Object.fromEntries(
      Object.entries(m).filter(
        ([key]) => !mediaDetailKeys.has(key) && !printOnlyKeys.has(key),
      ),
    ),
  ),
  'The bootstrap must preserve exact retained media fields and order.',
);
const expectedSidecars = mediaSubjects.map((s) => `${s.id}.json`).sort();
const sidecarDir = path.join(site, 'atlas/media-records');
const sidecarEntries = await fs.readdir(sidecarDir, { withFileTypes: true });
assert.ok(sidecarEntries.every((entry) => entry.isFile()));
assert.deepEqual(
  sidecarEntries.map((entry) => entry.name).sort(),
  [...expectedSidecars, ...expectedSidecars.map((name) => `${name}.gz`)].sort(),
  'A fresh package must contain every sidecar and gzip copy, without stale orphans.',
);

function validateMediaPayload(payload, subject) {
  assert.deepEqual(Object.keys(payload).sort(), ['media', 'revision', 'subject']);
  assert.equal(payload.subject, subject.id);
  assert.equal(payload.revision, index.mediaRevision);
  assert.ok(Array.isArray(payload.media));
  const ids = payload.media.map((m) => m?.id);
  assert.equal(new Set(ids).size, ids.length, `Duplicate media IDs: ${subject.id}`);
  assert.deepEqual([...ids].sort(), [...subject.objectIds].sort());
  const deltas = new Map();
  for (const delta of payload.media) {
    assert.ok(
      Object.keys(delta).every((key) => key === 'id' || mediaDetailKeys.has(key)),
    );
    const full = fullMedia.get(delta.id);
    assert.ok(full, `Missing complete media record: ${delta.id}`);
    assert.deepEqual(delta, {
      id: delta.id,
      ...Object.fromEntries(
        Object.entries(full).filter(([key]) => mediaDetailKeys.has(key)),
      ),
    });
    deltas.set(delta.id, delta);
  }
  for (const summary of index.media.filter((m) => subject.objectIds.includes(m.id))) {
    const details = Object.fromEntries(
      Object.entries(deltas.get(summary.id)).filter(([key]) => key !== 'id'),
    );
    assert.deepEqual(
      { ...summary, ...details },
      Object.fromEntries(
        Object.entries(fullMedia.get(summary.id)).filter(
          ([key]) => !printOnlyKeys.has(key),
        ),
      ),
      `The offline sidecar must reconstruct the exact web media record: ${summary.id}`,
    );
  }
}

const journeyPrintOnlyKeys = new Set([
  'familyEvidence',
  'leadObject',
  'printBreakAfter',
  'printSourcesPerPage',
]);
assert.equal(index.journeyDetailsDeferred, true);
assert.equal(state.journeyRecords, corpus.journeys.length);
const journeyRecordDir = path.join(site, 'atlas/journey-records');
const journeyNames = corpus.journeys.map((j) => `${j.id}.json`).sort();
assert.deepEqual(
  (await fs.readdir(journeyRecordDir)).sort(),
  [...journeyNames, ...journeyNames.map((name) => `${name}.gz`)].sort(),
);
function validateJourneyPayload(record, summary) {
  const full = corpus.journeys.find((j) => j.id === summary.id);
  assert.deepEqual(Object.keys(record).sort(), [
    'conclusion',
    'evidence',
    'journey',
    'revision',
    'stops',
  ]);
  assert.equal(record.journey, summary.id);
  assert.match(summary.detailsRevision, /^[0-9a-f]{64}$/);
  assert.equal(record.revision, summary.detailsRevision);
  assert.deepEqual(
    record.stops,
    full.stops.map((stop, index) => ({ index, narrative: stop.narrative })),
  );
  assert.deepEqual(record.evidence, {
    prompt: full.evidence.prompt,
    options: full.evidence.options,
  });
  assert.equal(record.conclusion, full.conclusion);
  const { detailsRevision, ...retained } = summary;
  const reading = {
    stops: record.stops,
    conclusion: record.conclusion,
    evidence: record.evidence,
  };
  assert.equal(hash(JSON.stringify({ summary: retained, reading })), detailsRevision);
  const restored = {
    ...retained,
    stops: summary.stops.map((stop, i) => ({
      ...stop,
      narrative: record.stops[i].narrative,
    })),
    conclusion: record.conclusion,
    evidence: { ...summary.evidence, ...record.evidence },
  };
  assert.deepEqual(
    restored,
    Object.fromEntries(
      Object.entries(full).filter(([key]) => !journeyPrintOnlyKeys.has(key)),
    ),
  );
}

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  acceptDownloads: true,
});
const external = [],
  errors = [],
  failedLocal = [],
  checkedSubjects = [],
  checkedReferences = [],
  checkedMediaReadings = [],
  servedMediaRecords = [],
  servedJourneyRecords = [],
  checkedImageViews = [];
await context.route('**/*', (route) => {
  const url = route.request().url();
  if (new URL(url).origin === origin) return route.continue();
  external.push(url);
  return route.abort();
});
const page = await context.newPage();
page.on('pageerror', (error) => errors.push(error.message));
page.on('response', (response) => {
  if (response.url().startsWith(origin) && response.status() >= 400)
    failedLocal.push({ url: response.url(), status: response.status() });
});
try {
  const response = await page.request.get(origin, {
    headers: { 'Accept-Encoding': 'gzip' },
  });
  assert.equal(response.status(), 200);
  assert.equal(response.headers()['content-encoding'], 'gzip');
  assert.equal(
    hash(await response.body()),
    hash(await fs.readFile(path.join(site, 'index.html'))),
  );
  await page.goto(`${origin}/?view=timeline`);
  await expect(page.locator('.era-row')).toHaveCount(8);
  for (const summary of index.journeys) {
    const name = `${summary.id}.json`;
    const response = await page.request.get(
      `${origin}/atlas/journey-records/${encodeURIComponent(summary.id)}.json?revision=${summary.detailsRevision}`,
      { headers: { 'Accept-Encoding': 'gzip' } },
    );
    assert.equal(response.status(), 200);
    assert.equal(response.headers()['content-encoding'], 'gzip');
    const bytes = await response.body();
    assert.equal(
      hash(bytes),
      hash(await fs.readFile(path.join(journeyRecordDir, name))),
    );
    validateJourneyPayload(JSON.parse(bytes.toString('utf8')), summary);
    servedJourneyRecords.push({
      journey: summary.id,
      revision: summary.detailsRevision,
      sha256: hash(bytes),
      bytes: bytes.length,
    });
  }
  for (const subject of mediaSubjects) {
    const file = `${subject.id}.json`;
    const served = await page.request.get(
      `${origin}/atlas/media-records/${encodeURIComponent(subject.id)}.json`,
      { headers: { 'Accept-Encoding': 'gzip' } },
    );
    assert.equal(served.status(), 200);
    assert.equal(served.headers()['content-encoding'], 'gzip');
    const bytes = await served.body();
    assert.equal(hash(bytes), hash(await fs.readFile(path.join(sidecarDir, file))));
    validateMediaPayload(JSON.parse(bytes.toString('utf8')), subject);
    servedMediaRecords.push({
      subject: subject.id,
      sha256: hash(bytes),
      bytes: bytes.length,
      mediaIds: subject.objectIds,
    });
  }

  // Exercise a later selected object, rather than silently accepting the first image.
  // The single deliberately aborted request is recorded separately; unexpected HTTP
  // failures, runtime errors and external requests remain unconditional failures below.
  const retrySubject = corpus.subjects.find((s) => s.id === 'nimrud-palace');
  const retryObject = fullMedia.get('nimrud-palace-plan');
  assert.ok(retrySubject?.objectIds.includes(retryObject?.id));
  const retryEndpoint = `${origin}/atlas/media-records/${encodeURIComponent(retrySubject.id)}.json?*`;
  let retryRequests = 0;
  const retryRoute = async (route) => {
    retryRequests++;
    if (retryRequests === 1) await route.abort('failed');
    else await route.continue();
  };
  await page.route(retryEndpoint, retryRoute);
  await page.goto(
    `${origin}/?pack=C3&subject=${retrySubject.id}&object=${retryObject.id}&scale=local&year=-883`,
  );
  const retryFigure = page.locator(`.object-figure[data-media-id="${retryObject.id}"]`);
  await expect(retryFigure).toHaveAttribute('data-media-status', 'failed');
  await expect(retryFigure.locator('.image-open img')).toHaveAttribute(
    'src',
    retryObject.image,
  );
  await expect(retryFigure.locator('figcaption')).toContainText(retryObject.date.label);
  await expect(retryFigure.locator('figcaption')).not.toContainText(
    retryObject.caption,
  );
  await expect(
    retryFigure
      .getByText(retryObject.credit, { exact: false })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  await expect(
    retryFigure
      .getByText(retryObject.rights, { exact: false })
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  await expect(
    retryFigure
      .locator(`a[href="${retryObject.licenseUrl}"]`)
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  await retryFigure.locator('.image-open').click();
  const inspection = page.locator('dialog.inspection[open]');
  await expect(inspection).toBeVisible();
  await expect(inspection.locator('.inspection-scroll img')).toHaveAttribute(
    'src',
    retryObject.image,
  );
  await expect(inspection).toContainText(retryObject.date.label);
  await expect(
    inspection.getByRole('link', { name: 'Open source image ↗', exact: true }),
  ).toHaveAttribute('href', retryObject.sourceImage);
  const inspectedDialog = await inspection.elementHandle();
  const inspectedImage = await inspection
    .locator('.inspection-scroll img')
    .elementHandle();
  await inspection.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(inspection.locator('output')).toHaveText('150%');
  await expect(inspection.locator('.credit')).toContainText(retryObject.credit);
  await expect(inspection.locator('.credit')).toContainText(retryObject.rights);
  await expect(inspection.locator(`a[href="${retryObject.licenseUrl}"]`)).toBeVisible();
  await inspection
    .getByRole('button', { name: 'Retry image information', exact: true })
    .click();
  await expect(retryFigure).toHaveAttribute('data-media-status', 'ready');
  await expect(inspection).toBeVisible();
  assert.ok(
    await inspection.evaluate((node, original) => node === original, inspectedDialog),
  );
  assert.ok(
    await inspection
      .locator('.inspection-scroll img')
      .evaluate((node, original) => node === original, inspectedImage),
  );
  await expect(inspection.locator('output')).toHaveText('150%');
  await expect(inspection).toContainText(retryObject.caption);
  await expect(inspection.locator('.inspection-scroll img')).toHaveAttribute(
    'src',
    retryObject.image,
  );
  assert.equal(retryRequests, 2, 'One failed media request and one explicit retry.');
  await inspection
    .getByRole('button', { name: 'Close inspection', exact: true })
    .click();
  await expect(inspection).not.toBeVisible();
  await page.unroute(retryEndpoint, retryRoute);

  // Verify every alternate's own description (or neutral legacy fallback) offline.
  for (const media of corpus.media.filter((row) => row.additionalImages?.length)) {
    const subject = corpus.subjects.find((row) => row.objectIds.includes(media.id));
    assert.ok(subject, `No dossier membership for alternate views: ${media.id}`);
    const pack = corpus.packs.find((row) => row.id === subject.packs[0]);
    const query = new URLSearchParams({
      pack: pack.id,
      subject: subject.id,
      object: media.id,
      scale: 'local',
      year: String(subject.interval.start ?? subject.interval.end ?? pack.anchor),
    });
    await page.goto(`${origin}/?${query}`);
    const figure = page.locator(`.object-figure[data-media-id="${media.id}"]`);
    await expect(figure).toHaveAttribute('data-media-status', 'ready');
    await figure.locator('.image-open').click();
    const dialog = page.locator('dialog.inspection[open]');
    const image = dialog.locator('.inspection-scroll img');
    await expect(image).toHaveAttribute('alt', media.alt);
    const views = [{ image: media.image, alt: media.alt }];
    for (let index = 0; index < media.additionalImages.length; index++) {
      await dialog
        .getByRole('combobox', { name: /^View/ })
        .selectOption(String(index + 1));
      const description =
        media.additionalImageAlts?.[index] ?? `Additional view of ${media.title}`;
      await expect(image).toHaveAttribute('src', media.additionalImages[index]);
      await expect(image).toHaveAttribute('alt', description);
      await expect
        .poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0))
        .toBe(true);
      views.push({ image: media.additionalImages[index], alt: description });
    }
    await dialog.getByRole('combobox', { name: /^View/ }).selectOption('0');
    await expect(image).toHaveAttribute('src', media.image);
    await expect(image).toHaveAttribute('alt', media.alt);
    checkedImageViews.push({
      subject: subject.id,
      media: media.id,
      views,
      primaryRestored: true,
    });
    await dialog.getByRole('button', { name: 'Close inspection', exact: true }).click();
  }

  for (const subject of corpus.subjects) {
    const pack = corpus.packs.find((p) => p.id === subject.packs[0]);
    const year = subject.interval.start ?? subject.interval.end ?? pack.anchor;
    const query = new URLSearchParams({
      pack: pack.id,
      subject: subject.id,
      scale: 'local',
      year: String(year),
    });
    if (subject.objectIds[0]) query.set('object', subject.objectIds[0]);
    await page.goto(`${origin}/?${query}`);
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await expect(page.locator('.dossier h1')).toHaveText(subject.name);
    if (subject.objectIds.length) {
      const object = fullMedia.get(subject.objectIds[0]);
      const figure = page.locator(`.object-figure[data-media-id="${object.id}"]`);
      await expect(figure).toHaveAttribute('data-media-status', 'ready');
      await expect(figure.locator('.image-open img')).toHaveAttribute(
        'src',
        object.image,
      );
      await expect(figure.locator('figcaption')).toContainText(object.caption);
      await figure.getByText('Object record and credit', { exact: true }).click();
      await expect(
        figure
          .getByText(object.credit, { exact: false })
          .filter({ visible: true })
          .first(),
      ).toBeVisible();
      await expect(
        figure
          .getByText(object.rights, { exact: false })
          .filter({ visible: true })
          .first(),
      ).toBeVisible();
      if (object.licenseUrl)
        await expect(
          figure
            .locator(`a[href="${object.licenseUrl}"]`)
            .filter({ visible: true })
            .first(),
        ).toBeVisible();
      let annotationCheck;
      if (object.hasAnnotations) {
        const annotations = object.annotations;
        assert.ok(annotations, `Missing promised annotations: ${object.id}`);
        const frame = figure.locator('.annotated-image--web');
        await expect(frame).toBeVisible();
        await expect(frame).toHaveAttribute('data-annotation-status', 'ready');
        const pins = frame.locator('.annotation-pin');
        const notes = figure.locator('figcaption .annotation-notes');
        const entries = notes.locator('[data-annotation-note]');
        await expect(pins).toHaveCount(annotations.items.length);
        await expect(entries).toHaveCount(annotations.items.length);
        await expect(figure.locator('.image-open .annotation-pin')).toHaveCount(0);
        for (const [index, item] of annotations.items.entries()) {
          await expect(pins.nth(index)).toHaveAttribute('data-annotation-id', item.id);
          await expect(pins.nth(index)).toHaveText(String(index + 1));
          await expect(entries.nth(index)).toHaveAttribute(
            'data-annotation-note',
            item.id,
          );
          await expect(entries.nth(index)).toContainText(item.label);
          await expect(entries.nth(index)).toContainText(item.text);
        }
        await expect(notes).toContainText(annotations.createdOn);
        await expect(notes).toContainText(annotations.credit);
        await expect(notes).toContainText(annotations.rights);
        await expect(
          notes.getByRole('link', { name: 'Annotation licence', exact: true }),
        ).toHaveAttribute('href', annotations.licenseUrl);
        annotationCheck = {
          items: annotations.items.length,
          createdOn: annotations.createdOn,
          licenseUrl: annotations.licenseUrl,
          completeNotesAndMainImagePins: true,
          pinsOutsideInspectionOpener: true,
        };
      }
      checkedMediaReadings.push({
        subject: subject.id,
        object: object.id,
        ...(annotationCheck ? { annotations: annotationCheck } : {}),
      });
    } else {
      await expect(page.locator('.object-figure')).toHaveCount(0);
    }
    const references = (corpus.contexts ?? []).filter((c) =>
      subject.contextIds?.includes(c.id),
    );
    if (references.length) {
      const phases = references.flatMap((c) => c.phases);
      const rows = page.locator('.reference-timeline ol li');
      await expect(rows).toHaveCount(phases.length);
      for (let i = 0; i < phases.length; i++)
        await expect(rows.nth(i)).toContainText(phases[i].text);
      checkedReferences.push(subject.id);
    }
    checkedSubjects.push(subject.id);
  }
  let annotationPrint;
  const annotatedReading = checkedMediaReadings.find((reading) => reading.annotations);
  if (annotatedReading) {
    const printPage = await context.newPage();
    const metadataRequests = [];
    printPage.on('pageerror', (error) => errors.push(error.message));
    printPage.on('request', (request) => {
      if (new URL(request.url()).pathname.includes('/atlas/media-records/'))
        metadataRequests.push(request.url());
    });
    try {
      const query = new URLSearchParams({
        print: 'reader',
        subject: annotatedReading.subject,
      });
      await printPage.goto(`${origin}/?${query}`);
      await expect(printPage.locator('.reader-print')).toBeVisible();
      await expect(
        printPage.locator('.reader-print .annotation-notes').first(),
      ).toBeVisible();
      assert.deepEqual(
        metadataRequests,
        [],
        'Full-corpus print must not fetch media/annotation detail sidecars.',
      );
      annotationPrint = {
        subject: annotatedReading.subject,
        fullCorpusAnnotationsVisible: true,
        metadataRequests: 0,
      };
    } finally {
      await printPage.close();
    }
  }
  const journeyEntries = [];
  for (const journey of corpus.journeys) {
    const stop = journey.stops[0];
    const subject = corpus.subjects.find((s) => s.id === stop.subject);
    const query = new URLSearchParams({
      journey: journey.id,
      step: '0',
      pack: subject.packs[0],
      subject: subject.id,
      year: String(stop.year),
      scale: 'local',
    });
    if (stop.object) query.set('object', stop.object);
    await page.goto(`${origin}/?${query}`);
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await expect(page.locator('.dossier h1')).toHaveText(subject.name);
    await expect(page.locator('.journey-context')).toHaveAttribute(
      'data-journey-status',
      'ready',
    );
    await expect(page.locator('.journey-context')).toContainText(stop.narrative);
    journeyEntries.push(journey.id);
  }
  await page.goto(
    `${origin}/?pack=C5&subject=tang-city&object=tang-access-diagram&scale=local&year=700`,
  );
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await page.reload();
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await page.locator('.citations > summary').first().click();
  await expect(page.locator('.source-scope').first()).toContainText(
    'Scope and access:',
  );
  await page.getByRole('button', { name: 'Search the atlas', exact: true }).click();
  await page.locator('#atlas-search').fill('water');
  await expect(page.locator('.search-results > button').first()).toBeVisible();
  await expect(
    page.getByText('Opening full-text search… Names and summaries are ready.', {
      exact: true,
    }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Close search', exact: true }).click();
  await page.getByRole('button', { name: 'Save a question', exact: true }).click();
  await page.locator('textarea[name=answer]').fill('Fictional offline first answer.');
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.locator('.save-dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Notebook', exact: true }).click();
  await page.getByRole('button', { name: 'Revise thinking', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Your thinking now', exact: true })
    .fill('Fictional revised explanation.');
  await page
    .getByRole('button', { name: 'Return to evidence; keep draft', exact: true })
    .click();
  await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
  await page.getByRole('button', { name: 'Notebook', exact: true }).click();
  await expect(
    page.getByRole('textbox', { name: 'Your thinking now', exact: true }),
  ).toHaveValue('Fictional revised explanation.');
  await page.getByRole('button', { name: 'Save revision', exact: true }).click();
  await page.reload();
  await page
    .getByRole('button', { name: 'Reveal my earlier thinking', exact: true })
    .click();
  await expect(page.locator('.notebook-list')).toContainText(
    'Fictional revised explanation.',
  );
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export notebook', exact: true }).click();
  const fixture = report.replace(/\.json$/, '-fixture-notebook.json');
  await (await downloading).saveAs(fixture);
  const notebook = JSON.parse(await fs.readFile(fixture, 'utf8'));
  assert.equal(notebook.notes[0].answer, 'Fictional offline first answer.');
  assert.equal(notebook.notes[0].revisions[0].answer, 'Fictional revised explanation.');
  assert.equal(notebook.notes[0].context.object, 'tang-access-diagram');
  assert.ok(notebook.notes[0].context.sources.length > 0);

  const servedPDFs = [];
  for (const name of (await fs.readdir(path.join(site, 'atlas/exports'))).filter(
    (name) => name.endsWith('.pdf'),
  )) {
    const served = await page.request.get(`${origin}/atlas/exports/${name}`);
    assert.equal(served.status(), 200);
    const digest = hash(await served.body());
    assert.equal(
      digest,
      hash(await fs.readFile(path.join(site, 'atlas/exports', name))),
    );
    servedPDFs.push({ name, sha256: digest });
  }
  const media = await fs.readdir(path.join(site, 'atlas/media'));
  for (let start = 0; start < media.length; start += 8) {
    await Promise.all(
      media.slice(start, start + 8).map(async (name) => {
        const served = await page.request.get(`${origin}/atlas/media/${name}`);
        assert.equal(served.status(), 200);
        assert.equal(
          hash(await served.body()),
          hash(await fs.readFile(path.join(site, 'atlas/media', name))),
        );
      }),
    );
  }
  const servedCorpus = await page.request.get(`${origin}/atlas/corpus.json`);
  assert.equal(hash(await servedCorpus.body()), state.corpusSHA256);
  assert.deepEqual(errors, []);
  assert.deepEqual(failedLocal, []);
  assert.deepEqual(
    external,
    [],
    'Essential atlas paths must not attempt external requests.',
  );
  await fs.writeFile(
    report,
    JSON.stringify(
      {
        result: 'pass',
        sourceCommit: state.commit,
        freshExtractedPackage: true,
        externalRequestsBlocked: true,
        attemptedExternalRequests: external,
        runtimeErrors: errors,
        failedLocalRequests: failedLocal,
        gzipDeliveryVerified: true,
        corpusSHA256: state.corpusSHA256,
        subjects: checkedSubjects,
        completeReferenceReadings: checkedReferences,
        mediaRevision: index.mediaRevision,
        completeMediaReadings: checkedMediaReadings,
        perViewImageDescriptions: checkedImageViews,
        annotationPrint,
        servedMediaRecords,
        servedJourneyRecords,
        mediaFailureAndRetry: {
          subject: retrySubject.id,
          object: retryObject.id,
          deliberateAbortedRequests: 1,
          requestsIncludingExplicitRetry: retryRequests,
          retainedImageDateCreditRightsLicence: true,
          retainedSourceImageLink: true,
          mountedInspectionAndImagePreserved: true,
          retainedZoom: '150%',
          fullCaptionAfterRetry: true,
        },
        journeyEntryRoutes: journeyEntries,
        localMediaFilesServedAndByteVerified: media.length,
        imageDerivatives: media.filter((name) => !name.endsWith('.gz')).length,
        compressedMediaCopies: media.filter((name) => name.endsWith('.gz')).length,
        servedPDFs,
        notebook: {
          fictionalFixtureOnly: true,
          initialAnswer: true,
          datedRevision: true,
          retainedDraftAcrossEvidence: true,
          savedSourceContext: true,
          reload: true,
          export: true,
        },
        localSearchAndSourceScopes: true,
      },
      null,
      2,
    ),
  );
  console.log(
    `Fresh extraction passed offline: ${checkedSubjects.length} dossiers, ${servedMediaRecords.length} media sidecars, ${journeyEntries.length} journey entries, ${media.length} media files including compressed copies, and ${servedPDFs.length} PDFs; notebook revisions, source scopes, search and gzip verified.`,
  );
} finally {
  await browser.close();
}

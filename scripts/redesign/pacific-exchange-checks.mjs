/** Actual browser evidence boundaries and geometry for the Pacific exchange continuation. */
/* global document, getComputedStyle */
import process from 'node:process';
import console from 'node:console';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { URL, URLSearchParams } from 'node:url';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL,
  report = process.env.ATLAS_REPORT_DIR;
if (!root || !report)
  throw Error('Use an isolated Pacific exchange preview and report.');
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const intervalLabels = JSON.parse(
  await fs.readFile('src/atlas/reviewed-interval-labels.json', 'utf8'),
);
const baseline = JSON.parse(
  await fs.readFile('src/atlas/pacific-baseline.json', 'utf8'),
);
const contract = JSON.parse(
  await fs.readFile('src/atlas/pacific-contract.json', 'utf8'),
);
assert.equal(
  contract.finalized,
  true,
  'Requires reviewed future contract, not the preflight template',
);
assert.match(baseline.baseCommit, /^[0-9a-f]{40}$/);
const out = `${report}/pacific-exchange`;
await fs.mkdir(out, { recursive: true });
const cases = [
  {
    id: 'banda-1621',
    object: null,
    year: 1621,
    context: 'banda-food-displacement-context',
    reference: [1599, 1630],
  },
  {
    id: 'manila-network',
    object: 'met-9198',
    year: 1726,
    context: 'manila-ships-people-context',
    reference: [1565, 1726],
  },
];
const subject = (id) => c.subjects.find((s) => s.id === id);
const media = (id) => c.media.find((m) => m.id === id);
const source = (id) => c.sources.find((s) => s.id === id);
const journey = c.journeys.find((j) => j.id === 'goods-work-coercion');
assert.ok(journey?.familyEvidence, 'Pacific inquiry has not been adopted');
assert.equal(baseline.media.length, 104);
assert.equal(baseline.imageBytes.length, 221);
assert.equal(Object.keys(contract.mediaChanges).length, 1);
assert.deepEqual(Object.keys(contract.mediaChanges['met-9198']).sort(), [
  'caption',
  'notice',
  'relevance',
]);
assert.ok(
  Object.keys(contract.mediaChanges['met-9198']).every((key) =>
    ['caption', 'notice', 'relevance'].includes(key),
  ),
);
for (const original of baseline.media.filter((row) =>
  cases.some((item) => item.object === row.id),
))
  assert.deepEqual(
    media(original.id),
    original.id === 'met-9198'
      ? { ...original, ...contract.mediaChanges[original.id] }
      : original,
    `Complete media preservation/explicit Manila exception: ${original.id}`,
  );
for (const image of baseline.imageBytes)
  assert.equal(
    createHash('sha256')
      .update(await fs.readFile(`public${image.path}`))
      .digest('hex'),
    image.sha256,
    image.path,
  );
for (const original of baseline.intervals) {
  const expected = {
    ...original.interval,
    label: intervalLabels[original.id] ?? original.interval.label,
  };
  assert.deepEqual(subject(original.id).interval, expected, original.id);
}
assert.deepEqual(
  journey.stops.map(({ subject, object, year }) => [subject, object, year]),
  [
    ['banda-1621', undefined, 1621],
    ['manila-network', 'met-9198', 1726],
  ],
);
assert.equal(journey.stops.length, 2, 'No dummy third stop');
assert.equal(journey.familyEvidence.object, 'met-9198');
assert.match(media('met-9198').title, /\bjar\b/i);
assert.doesNotMatch(media('met-9198').title, /\bplate\b/i);
assert.equal(media('met-9198').accession, '11.87.36');
assert.deepEqual(subject('banda-1621').objectIds, []);
assert.match(
  journey.familyEvidence.text,
  /does not identify this jar|not identified/is,
);
assert.match(journey.familyEvidence.text, /1726/);
assert.match(journey.familyEvidence.text, /1680/);
assert.match(journey.introduction, /not a shared route/is);
const browser = await chromium.launch();
const results = [],
  errors = [],
  external = [];
async function fresh(viewport) {
  const context = await browser.newContext({ viewport });
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
async function visibleImages(page) {
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe('loaded');
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          [...document.images]
            .filter((image) => image.getClientRects().length > 0)
            .every((image) => image.complete && image.naturalWidth > 0),
        ),
      { timeout: 15000 },
    )
    .toBe(true);
}
async function ready(page, object) {
  await expect(page.locator('.dossier')).toHaveAttribute('data-reading-ready', 'true');
  const figure = page.locator('.object-figure');
  if (!object) {
    await expect(figure).toHaveCount(0);
    await visibleImages(page);
    return null;
  }
  await expect(figure).toHaveAttribute('data-media-id', object.id);
  await expect(figure).toHaveAttribute('data-media-status', 'ready');
  await expect(figure.locator('.image-open img')).toHaveAttribute('src', object.image);
  await visibleImages(page);
  await expect(figure.locator('.image-open img')).toHaveAttribute('alt', object.alt);
  const dimensions = await figure.locator('.image-open img').evaluate((image) => ({
    width: image.getBoundingClientRect().width,
    natural: image.naturalWidth,
  }));
  assert.ok(
    dimensions.width > 0 && dimensions.width <= dimensions.natural + 1,
    'Natural primary-source ceiling',
  );
  return figure;
}
async function inspectViews(page, figure, object, width) {
  if ([390, 1440].includes(width))
    await figure.screenshot({ path: `${out}/${object.id}-figure-${width}.png` });
  await figure.locator('.image-open').click();
  const dialog = page.locator('dialog.inspection[open]');
  await expect(dialog).toBeVisible();
  const image = dialog.locator('.inspection-scroll img');
  await image.evaluate((element) => element.decode());
  await expect(image).toHaveAttribute('alt', object.alt);
  await expect(dialog.locator('output')).toHaveText('100%');
  await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(dialog.locator('output')).toHaveText('150%');
  for (const value of [object.date.label, object.caption, object.credit, object.rights])
    await expect(dialog).toContainText(value);
  if ([390, 1440].includes(width)) {
    await dialog.screenshot({ path: `${out}/${object.id}-inspection-${width}.png` });
  }
  const checked = [{ image: object.image, alt: object.alt }];
  for (let index = 0; index < (object.additionalImages?.length ?? 0); index++) {
    await dialog
      .getByRole('combobox', { name: /^View/ })
      .selectOption(String(index + 1));
    await image.evaluate((element) => element.decode());
    const alt =
      object.additionalImageAlts?.[index] ?? `Additional view of ${object.title}`;
    await expect(image).toHaveAttribute('src', object.additionalImages[index]);
    await expect(image).toHaveAttribute('alt', alt);
    await expect(dialog.locator('output')).toHaveText('100%');
    await expect(dialog.locator('.annotation-pin')).toHaveCount(0);
    await expect
      .poll(() =>
        dialog.locator('.inspection-scroll').evaluate((region) => {
          const image = region.querySelector('img').getBoundingClientRect();
          const box = region.getBoundingClientRect();
          const left = box.left + region.clientLeft,
            top = box.top + region.clientTop;
          return (
            image.left >= left - 1 &&
            image.top >= top - 1 &&
            image.right <= left + region.clientWidth + 1 &&
            image.bottom <= top + region.clientHeight + 1
          );
        }),
      )
      .toBe(true);
    const dimensions = await image.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
      };
    });
    assert.ok(dimensions.width <= dimensions.naturalWidth + 1);
    assert.ok(
      Math.abs(
        dimensions.width / dimensions.height -
          dimensions.naturalWidth / dimensions.naturalHeight,
      ) < 0.003,
    );
    if ([390, 1440].includes(width))
      await dialog.screenshot({
        path: `${out}/${object.id}-view-${index + 1}-${width}.png`,
      });
    checked.push({ image: object.additionalImages[index], alt, dimensions });
  }
  if (object.additionalImages?.length) {
    await dialog.getByRole('combobox', { name: /^View/ }).selectOption('0');
    await image.evaluate((element) => element.decode());
    await expect(image).toHaveAttribute('src', object.image);
    await expect(image).toHaveAttribute('alt', object.alt);
    await expect(dialog.locator('output')).toHaveText('100%');
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(figure.locator('.image-open')).toBeFocused();
  return checked;
}
async function sourceLinks(container, refs) {
  const links = await container.locator('a').evaluateAll((nodes) =>
    nodes.map((node) => ({
      href: node.getAttribute('href'),
      text: node.textContent,
    })),
  );
  for (const ref of refs) {
    const record = source(ref.source);
    assert.ok(record, ref.source);
    assert.ok(
      links.some(
        (link) => link.href === record.url && link.text?.includes(record.title),
      ),
      `Original title/URL retained: ${record.id}`,
    );
    await expect(container).toContainText(ref.locator);
  }
}
async function openScopes(container) {
  const notes = container.locator('details.citations');
  for (let i = 0; i < (await notes.count()); i++) {
    const note = notes.nth(i);
    if ((await note.getAttribute('open')) === null)
      await note.locator(':scope > summary').click();
  }
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
    const { context, page } = await fresh({ width, height: 900 });
    try {
      for (const row of cases) {
        const s = subject(row.id),
          object = row.object ? media(row.object) : null,
          reference = c.contexts.find((r) => r.id === row.context);
        assert.ok(s && reference);
        if (row.object) assert.ok(object, `Missing supplied object: ${row.object}`);
        else assert.deepEqual(s.objectIds, [], 'Banda remains intentionally imageless');
        assert.deepEqual(
          [reference.interval.start, reference.interval.end],
          row.reference,
        );
        await page.goto(
          `${root}/?pack=C7&subject=${row.id}&${row.object ? `object=${row.object}&` : ''}scale=local&year=${row.year}`,
        );
        const figure = await ready(page, object),
          dossier = page.locator('.dossier');
        await expect(dossier.locator('h1')).toBeFocused();
        await expect(dossier.locator(':scope > .date-label')).toHaveText(
          s.interval.label,
        );
        await expect(dossier.locator(':scope > .scope-note')).toContainText(
          s.interval.note,
        );
        for (const section of s.sections)
          await expect(dossier).toContainText(section.text);
        await dossier.locator('.family-start > summary').click();
        for (const step of s.familyActivity.steps)
          await expect(dossier.locator('.family-start')).toContainText(step);
        await expect(dossier.locator('.family-start')).toContainText(
          s.familyActivity.explanation,
        );
        const deeper = dossier.locator('.deeper-reading > details');
        await expect(deeper).toHaveCount(s.deeperReading.length);
        for (let i = 0; i < s.deeperReading.length; i++) {
          await deeper.nth(i).locator(':scope > summary').click();
          await expect(deeper.nth(i)).toContainText(s.deeperReading[i].text);
        }
        const evidence = dossier.locator('.evidence-reading article');
        await expect(evidence).toHaveCount(s.evidenceReading.items.length);
        for (let i = 0; i < s.evidenceReading.items.length; i++)
          for (const key of ['text', 'interpretation'])
            await expect(evidence.nth(i)).toContainText(
              s.evidenceReading.items[i][key],
            );
        const timeline = dossier.locator('.reference-timeline');
        await expect(timeline).toContainText(reference.interval.note);
        for (const phase of reference.phases) {
          await expect(timeline).toContainText(phase.title);
          await expect(timeline).toContainText(phase.text);
        }
        let inspectedViews = [];
        if (object) {
          const caption = figure.locator(':scope > figcaption');
          for (const value of [
            object.date.label,
            object.caption,
            object.credit,
            object.rights,
          ])
            await expect(caption).toContainText(value);
          await expect(
            caption.getByRole('link', { name: 'Open source image ↗', exact: true }),
          ).toHaveAttribute('href', object.sourceImage);
          if (object.licenseUrl)
            await expect(
              caption.getByRole('link', {
                name: 'Read the image licence ↗',
                exact: true,
              }),
            ).toHaveAttribute('href', object.licenseUrl);
          await caption.getByText('Object record and credit', { exact: true }).click();
          if (object.representedDate)
            await expect(caption).toContainText(object.representedDate);
          if (object.datingNote) await expect(caption).toContainText(object.datingNote);
          await expect(figure.locator('.annotation-pin')).toHaveCount(0);
          inspectedViews = await inspectViews(page, figure, object, width);
        } else {
          await expect(dossier.locator('.object-figure')).toHaveCount(0);
        }
        let mapCheck = null;
        if (row.id === 'banda-1621') {
          const study = s.placeStudy,
            map = dossier.locator('.place-study');
          assert.equal(study.points.length, 3);
          assert.deepEqual(study.features, []);
          await expect(map).toContainText(study.description);
          await expect(map.locator('.place-index button')).toHaveCount(3);
          await expect(map.locator('polyline.place-feature')).toHaveCount(0);
          await expect(map.locator('svg image')).toHaveCount(0);
          const selected = [];
          for (const [i, p] of study.points.entries()) {
            const control = map
              .locator('.place-index')
              .getByRole('button', { name: `${i + 1}. ${p.label}`, exact: true });
            await control.click();
            await expect(control).toHaveAttribute('aria-pressed', 'true');
            await expect(map.locator('.place-explanation h3')).toHaveText(p.label);
            await expect(map.locator('.place-explanation')).toContainText(p.text);
            await openScopes(map.locator('.place-explanation'));
            await sourceLinks(map.locator('.place-explanation'), p.citations);
            for (const ref of p.citations)
              await expect(map.locator('.place-explanation')).toContainText(
                source(ref.source).scope,
              );
            selected.push(p.id);
          }
          if ([390, 1440].includes(width))
            await map.screenshot({ path: `${out}/banda-reference-map-${width}.png` });
          mapCheck = {
            namedControls: selected,
            pointsOnly: true,
            noDrawnRiverRouteOrBoundary: true,
          };
        } else await expect(dossier.locator('.place-study')).toHaveCount(0);
        await openScopes(dossier);
        const refs = [
          ...s.sections,
          ...s.deeperReading,
          ...s.evidenceReading.items,
        ].flatMap((section) => section.citations);
        await sourceLinks(dossier, refs);
        for (const id of new Set(refs.map((ref) => ref.source)))
          await expect(
            dossier
              .locator('.source-scope')
              .filter({ hasText: source(id).scope })
              .first(),
          ).toBeVisible();
        if (row.id === 'manila-network') {
          for (const notice of object.notice)
            await expect(dossier.locator('.notice')).toContainText(notice);
          await expect(dossier).toContainText('1726');
          await expect(dossier).toContainText('1595');
          await expect(dossier).toContainText('1680');
          assert.match(object.caption, /not identified.*1595.*1726/is);
          assert.ok(
            object.notice.every((line) => !line.includes('the Chinese porcelain jar')),
            'No unseen comparison object is required',
          );
        } else {
          await expect(dossier).toContainText('2021');
          await expect(dossier).toContainText('not a 1621 eyewitness');
          assert.deepEqual(
            s.placeStudy.features,
            [],
            'No invented routes, campaign or plantation geometry',
          );
        }
        await noOverflow(page);
        assert.deepEqual(
          (await new AxeBuilder({ page }).analyze()).violations,
          [],
          `${row.id}/${width}`,
        );
        await dossier.locator('h1').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${out}/${row.id}-${width}.png` });
        results.push({
          subject: row.id,
          width,
          completeReadingLayers: true,
          originalCaseDate: s.interval,
          objectDate: object?.date ?? null,
          referenceDate: reference.interval,
          mapCheck,
          sourceScopesAndRights: true,
          inspectedViews,
          axe: [],
        });
      }
      const first = journey.stops[0];
      const firstQuery = new URLSearchParams({
        journey: journey.id,
        step: '0',
        pack: 'C7',
        subject: first.subject,
        scale: 'local',
        year: String(first.year),
        ...(first.object ? { object: first.object } : {}),
      });
      await page.goto(`${root}/?${firstQuery}`);
      const inquiry = page.locator('.journey-context');
      await expect(inquiry).toContainText(journey.title);
      for (let i = 0; i < journey.stops.length; i++) {
        if (i)
          await inquiry
            .getByRole('button', { name: 'Next stop →', exact: true })
            .click();
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
          journey.stops[i].object ? media(journey.stops[i].object) : null,
        );
        await expect(page.locator('.dossier > .date-label')).toHaveText(
          subject(journey.stops[i].subject).interval.label,
        );
      }
      const ending = page.locator('.journey-ending');
      await expect(ending).toContainText(journey.conclusion);
      await expect(ending.locator('.question')).toHaveText(journey.returnPrompt);
      for (const option of journey.evidence.options) {
        await ending.getByRole('button', { name: option.text, exact: true }).click();
        await expect(ending.locator('.feedback')).toContainText(option.feedback);
      }
      for (let i = journey.stops.length - 2; i >= 0; i--) {
        await inquiry
          .getByRole('button', { name: 'Previous stop', exact: true })
          .click();
        await expect(inquiry.locator('[data-journey-title]')).toHaveText(
          journey.stops[i].title,
        );
        await expect(inquiry.locator('[data-journey-title]')).toBeFocused();
        await ready(
          page,
          journey.stops[i].object ? media(journey.stops[i].object) : null,
        );
      }
      results.push({
        width,
        completeJourney: true,
        explicitMediaAndFocus: true,
        allEvidenceFeedback: true,
        previousStopFocus: true,
      });
    } finally {
      await context.close();
    }
  }
  const { context, page } = await fresh({ width: 1000, height: 1200 });
  try {
    let mediaRequests = 0;
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.includes('/atlas/media-records/'))
        mediaRequests++;
    });
    for (const row of cases) {
      const s = subject(row.id),
        object = row.object ? media(row.object) : null;
      await page.goto(`${root}/?print=reader&subject=${row.id}`);
      await page.locator('.reader-bibliography').waitFor();
      await visibleImages(page);
      await assertReaderMap(page);
      await expect(page.locator('.reader-print .place-map-canvas')).toHaveCount(
        row.id === 'banda-1621' ? 1 : 0,
      );
      if (row.id === 'banda-1621') {
        await expect(page.locator('.reader-print .place-feature')).toHaveCount(0);
        for (const p of s.placeStudy.points)
          await expect(page.locator('.reader-print')).toContainText(p.text);
      }
      for (const section of [...s.sections, ...s.deeperReading])
        await expect(page.locator('.reader-print')).toContainText(section.text);
      for (const item of s.evidenceReading.items)
        for (const key of ['text', 'interpretation'])
          await expect(page.locator('.reader-print')).toContainText(item[key]);
      await expect(page.locator('.reader-print > header')).toContainText(
        s.interval.label,
      );
      const reference = c.contexts.find((r) => r.id === row.context);
      await expect(page.locator('.reader-print')).toContainText(
        reference.interval.note,
      );
      for (const phase of reference.phases)
        await expect(page.locator('.reader-print')).toContainText(phase.text);
      let bounds = null;
      if (object) {
        const figure = page
          .locator('.reader-image')
          .filter({ has: page.locator(`img[src$="${object.image}"]`) });
        for (const value of [
          object.date.label,
          object.caption,
          object.credit,
          object.rights,
        ])
          await expect(figure).toContainText(value);
        bounds = await figure.evaluate((node) => {
          const box = node.getBoundingClientRect(),
            style = getComputedStyle(node);
          return {
            height: box.height,
            totalHeight:
              box.height + parseFloat(style.marginTop) + parseFloat(style.marginBottom),
          };
        });
        assert.ok(
          bounds.totalHeight <= 1056 - (28 / 25.4) * 96 + 1,
          'Complete source figure/caption fits unchanged Letter content height',
        );
      } else {
        await expect(page.locator('.reader-image')).toHaveCount(0);
      }
      await page.pdf({
        path: `${out}/${row.id}.pdf`,
        preferCSSPageSize: true,
        printBackground: true,
        tagged: true,
      });
      results.push({
        subject: row.id,
        readerExport: true,
        completeDateAndSourceLayers: true,
        printMapGeometry: true,
        mediaBounds: bounds,
      });
    }
    await page.goto(`${root}/?print=family&pack=C7`);
    const sheet = page.locator(`.family-sheet[data-journey="${journey.id}"]`);
    await sheet.waitFor();
    await visibleImages(page);
    await page.emulateMedia({ media: 'print' });
    const familyBounds = await page.locator('.family-sheet').evaluateAll((nodes) =>
      nodes.map((node) => ({
        journey: node.dataset.journey,
        width: node.getBoundingClientRect().width,
        height: node.getBoundingClientRect().height,
      })),
    );
    await fs.writeFile(
      `${out}/family-measurements.json`,
      JSON.stringify(familyBounds, null, 2),
    );
    assert.ok(
      familyBounds.every((b) => b.height <= 1056.01),
      'All existing and new family sheets retain Letter bounds',
    );
    const lead = media(journey.familyEvidence.object);
    await expect(sheet.locator('img')).toHaveAttribute('src', lead.image);
    for (const key of ['text', 'claimPrompt', 'returnPrompt', 'feedback'])
      await expect(sheet).toContainText(journey.familyEvidence[key]);
    for (const note of journey.familyEvidence.notice)
      await expect(sheet).toContainText(note);
    for (const value of [
      lead.printCaption ?? lead.caption,
      lead.printCredit ?? lead.credit,
      lead.rights,
    ])
      await expect(sheet).toContainText(value);
    await sourceLinks(
      sheet.locator('.family-source-credits'),
      journey.familyEvidence.citations,
    );
    const writing = await sheet
      .locator('.writing-space')
      .evaluateAll((nodes) =>
        nodes.map((node) => (node.getBoundingClientRect().height * 25.4) / 96),
      );
    assert.equal(writing.length, 2);
    assert.ok(
      writing.every((height) => height >= 18 - 0.01),
      'Both original writing areas remain at least18mm',
    );
    await expect(sheet.locator('.annotation-pin')).toHaveCount(0);
    await sheet.screenshot({ path: `${out}/family-sheet.png` });
    assert.equal(mediaRequests, 0, 'Full print never fetches deferred image metadata');
    results.push({
      familySourceCapsuleAndCredits: true,
      familyBounds,
      writingSpaceMm: writing,
      printMediaMetadataRequests: mediaRequests,
      noInventedThirdStop: true,
    });
  } finally {
    await context.close();
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await fs.writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        result: 'pass',
        baselineCommit: baseline.baseCommit,
        results,
        runtimeErrors: errors,
        externalRequests: external,
      },
      null,
      2,
    ),
  );
  console.log(
    'Pacific exchange: four-width reading/source/family/map and journey flows, exact approved three-field jar correction, all original pixels, two readers and family writing bounds pass.',
  );
} finally {
  await browser.close();
}

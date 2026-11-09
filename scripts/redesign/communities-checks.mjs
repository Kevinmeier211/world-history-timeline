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
const out = `${report}/communities-work`;
await fs.mkdir(out, { recursive: true });
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const cases = [
  { id: 'chaco-communities', object: 'chaco-corner-door', year: 1000 },
  { id: 'cahokia-city', object: 'cahokia-view-1907', year: 1100 },
  { id: 'ocmulgee-council', object: 'ocmulgee-floor', year: 1200 },
];
const planLicences = {
  'chaco-plan-1850': 'https://creativecommons.org/licenses/by-nc-sa/3.0/',
  'ocmulgee-earthlodge-feature-plan': 'https://creativecommons.org/licenses/by/4.0/',
};
const journey = c.journeys.find((j) => j.id === 'buildings-food-continuity');
assert.ok(journey?.familyEvidence);
assert.equal(journey.familyEvidence.object, 'chaco-plan-1850');
assert.deepEqual(
  journey.stops.map((stop) => [stop.subject, stop.year]),
  [
    ['chaco-communities', 1000],
    ['cahokia-city', 1100],
    ['ocmulgee-council', 1200],
  ],
);
const ocmulgee = c.subjects.find((s) => s.id === 'ocmulgee-council');
assert.deepEqual(ocmulgee.interval, {
  start: null,
  end: null,
  label: 'Earthlodge construction chronology under revision',
  note: 'No settled construction/use endpoints are plotted. The older 1015 label is a median of early radiocarbon determinations; newer roof-wood evidence indicates cutting sometime after c.1160 and leaves possible earlier construction unresolved. Neither observation dates the lifespan of Muscogee people or the whole Ocmulgee site.',
  precision: 'disputed',
  alternatives: [
    {
      label:
        'NPS retains 1015, an older median date; this is not a directly observed construction year.',
      citations: [
        { source: 'ocmu-earthlodge', locator: 'Older date label' },
        { source: 'ocmu-chronology', locator: 'Discussion: older median' },
      ],
    },
    {
      label:
        'New roof-wood evidence indicates cutting sometime after c.1160; possible earlier construction remains unresolved.',
      citations: [
        { source: 'ocmu-chronology', locator: 'Earthlodge results and discussion' },
      ],
    },
  ],
});
assert.equal(c.sources.find((s) => s.id === 'chaco-cacao').accessed, '2026-10-27');
assert.deepEqual(ocmulgee.objectIds.slice(0, 2), [
  'ocmulgee-floor',
  'ocmulgee-exterior',
]);
for (const [id, licence] of Object.entries(planLicences)) {
  const media = c.media.find((m) => m.id === id);
  assert.equal(media.licenseUrl, licence);
  assert.equal(Boolean(media.annotations), false);
}
assert.equal(c.media.find((m) => m.id === 'chaco-plan-1850').date.start, 1850);
assert.equal(c.media.find((m) => m.id === 'chaco-plan-1850').date.end, 1850);
assert.deepEqual(
  ['width', 'height'].map(
    (key) => c.media.find((m) => m.id === 'ocmulgee-earthlodge-feature-plan')[key],
  ),
  [1600, 1725],
);

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
async function selectMedia(page, subject, media) {
  if (subject.objectIds.length > 1)
    await page
      .locator('.object-choices button')
      .filter({ hasText: media.title })
      .click();
  await ready(page, media);
}
async function decodePrint(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((img) => img.decode()));
  });
}
try {
  for (const width of [320, 390, 768, 1440]) {
    const { context, page } = await fresh({ width, height: 900 });
    for (const row of cases) {
      const subject = c.subjects.find((s) => s.id === row.id);
      const primary = c.media.find((m) => m.id === row.object);
      await page.goto(
        `${root}/?pack=C6&subject=${row.id}&object=${row.object}&scale=local&year=${row.year}`,
      );
      await ready(page, primary);
      await expect(page.locator('.dossier h1')).toBeFocused();
      await expect(page.locator('.dossier > .date-label')).toHaveText(
        subject.interval.label,
      );
      await expect(page.locator('.dossier > .scope-note')).toContainText(
        subject.interval.note,
      );
      if (row.id === 'ocmulgee-council') {
        const summary = page.getByText('Alternative date treatments', { exact: true });
        await summary.click();
        const alternatives = summary.locator('..');
        for (const alternative of subject.interval.alternatives)
          await expect(alternatives).toContainText(alternative.label);
        // A view at 1200 remains distinct from the case's unknown endpoints.
        assert.equal(new URL(page.url()).searchParams.get('year'), '1200');
        await expect(page.locator('.dossier > .date-label')).not.toContainText('1200');
      }
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
      const sourceNotes = page.locator('.dossier-section .citations').first();
      await sourceNotes.locator(':scope > summary').click();
      for (const ref of subject.sections[0].citations) {
        const source = c.sources.find((s) => s.id === ref.source);
        await expect(sourceNotes).toContainText(source.scope);
        const links = await sourceNotes.locator('a').evaluateAll((elements) =>
          elements.map((element) => ({
            title: element.textContent,
            href: element.getAttribute('href'),
          })),
        );
        assert.ok(
          links.some(
            (link) => link.href === source.url && link.title?.includes(source.title),
          ),
          `The cited title retains its exact source URL: ${source.id}`,
        );
      }
      for (const media of c.media.filter((m) => subject.objectIds.includes(m.id))) {
        await selectMedia(page, subject, media);
        await expect(page.locator('.dossier > .date-label')).toHaveText(
          subject.interval.label,
        );
        const caption = page.locator('.object-figure > figcaption');
        await expect(caption).toContainText(media.date.label);
        await expect(caption).toContainText(media.caption);
        await expect(caption).toContainText(media.credit);
        await expect(caption).toContainText(media.rights);
        await expect(
          caption.getByRole('link', { name: 'Open source image ↗', exact: true }),
        ).toHaveAttribute('href', media.sourceImage);
        if (media.licenseUrl)
          await expect(
            caption.getByRole('link', {
              name: 'Read the image licence ↗',
              exact: true,
            }),
          ).toHaveAttribute('href', media.licenseUrl);
        await expect(page.locator('.object-figure .annotation-pin')).toHaveCount(0);
        const dimensions = await page.locator('.image-open img').evaluate((img) => ({
          width: img.getBoundingClientRect().width,
          naturalWidth: img.naturalWidth,
        }));
        assert.ok(
          dimensions.width <= dimensions.naturalWidth + 1,
          `${media.id}: preserve source-image natural ceiling.`,
        );
        await page.getByText('Object record and credit', { exact: true }).click();
        if (media.representedDate)
          await expect(caption).toContainText(media.representedDate);
        if (media.datingNote) await expect(caption).toContainText(media.datingNote);
        await page.locator('.image-open').click();
        const inspection = page.locator('.inspection');
        await expect(inspection).toBeVisible();
        await inspection.getByRole('button', { name: 'Zoom in', exact: true }).click();
        await expect(inspection.locator('output')).toHaveText('150%');
        await expect(inspection).toContainText(media.caption);
        if (media.licenseUrl)
          await expect(
            inspection.getByRole('link', { name: 'Image licence ↗', exact: true }),
          ).toHaveAttribute('href', media.licenseUrl);
        if (media.additionalImages?.length) {
          await inspection.getByRole('combobox', { name: /^View/ }).selectOption('1');
          await inspection.locator('img').evaluate((img) => img.decode());
          await expect(inspection.locator('.annotation-pin')).toHaveCount(0);
        }
        if ((width === 390 || width === 1440) && planLicences[media.id])
          await inspection.screenshot({
            path: `${out}/${media.id}-inspection-${width}.png`,
          });
        await page.keyboard.press('Escape');
        await expect(page.locator('.image-open')).toBeFocused();
        if (
          (width === 390 || width === 1440) &&
          (planLicences[media.id] || media.id.startsWith('ocmulgee-'))
        )
          await page
            .locator('.object-figure')
            .screenshot({ path: `${out}/${media.id}-${width}.png` });
      }
      await selectMedia(page, subject, primary);
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
        readingFamilyDeeperEvidence: true,
        contextPhases: true,
        sourceNotes: true,
        sourceMediaInspectionAndRights: true,
        unknownDateTreatments: row.id === 'ocmulgee-council',
        namedMapControlsTested: false,
        noNewAnnotations: true,
        noOverflow: true,
        axe: [],
      });
    }
    const first = journey.stops[0];
    await page.goto(
      `${root}/?journey=${journey.id}&step=0&pack=C6&subject=${first.subject}&object=${first.object}&scale=local&year=${first.year}`,
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
    await expect(page.locator('.dossier > .date-label')).toHaveText(
      ocmulgee.interval.label,
    );
    results.push({
      width,
      completeJourney: true,
      explicitSelectedMedia: true,
      coldDossierThenStopHeadingFocus: true,
      ocmulgeeEndpointsRemainUnknown: true,
    });
    await context.close();
  }

  const { context, page } = await fresh({ width: 1000, height: 1200 });
  for (const { id } of cases) {
    const subject = c.subjects.find((s) => s.id === id);
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.locator('.reader-bibliography').waitFor();
    await decodePrint(page);
    await assertReaderMap(page);
    const sourcePlanBounds = [];
    for (const media of c.media.filter((m) => subject.objectIds.includes(m.id))) {
      const figure = page
        .locator('.reader-image')
        .filter({ has: page.locator(`img[src$="${media.image}"]`) });
      await expect(figure).toContainText(media.date.label);
      await expect(figure).toContainText(media.caption);
      await expect(figure).toContainText(media.credit);
      if (media.licenseUrl)
        await expect(
          figure.locator('a').filter({ hasText: media.licenseUrl }),
        ).toHaveAttribute('href', media.licenseUrl);
      if (media.printWidthMm) {
        const widthMm = await figure
          .locator('img')
          .evaluate((img) => (img.getBoundingClientRect().width * 25.4) / 96);
        assert.ok(
          widthMm <= media.printWidthMm + 0.01,
          `${media.id}: source-specific print width remains bounded.`,
        );
      }
      if (planLicences[media.id]) {
        const bounds = await figure.evaluate((node) => {
          const b = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return {
            height: b.height,
            totalHeight:
              b.height +
              Number.parseFloat(style.marginTop) +
              Number.parseFloat(style.marginBottom),
          };
        });
        assert.ok(
          bounds.totalHeight <= 1056 - (28 / 25.4) * 96 + 1,
          `${media.id}: complete source plan and caption fit one Letter content area.`,
        );
        sourcePlanBounds.push({ id: media.id, ...bounds });
      }
    }
    await expect(page.locator('.reader-print > header')).toContainText(
      subject.interval.label,
    );
    await expect(page.locator('.reader-refs').first()).toContainText(
      subject.interval.note,
    );
    for (const section of subject.sections)
      await expect(page.locator('.reader-print')).toContainText(section.text);
    for (const item of subject.evidenceReading.items) {
      await expect(page.locator('.reader-print')).toContainText(item.text);
      await expect(page.locator('.reader-print')).toContainText(item.interpretation);
    }
    // The reader preserves the full original date note. Its dating account is
    // printed in the authored body/evidence, not a duplicate alternatives list.
    await page.pdf({
      path: `${out}/${id}.pdf`,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
    results.push({
      id,
      readerExport: true,
      mapLayoutCompatibilityOnly: true,
      sourcePlanBounds,
      unchangedCaseDate: true,
    });
  }
  await page.goto(`${root}/?print=family&pack=C6`);
  const sheet = page.locator(`.family-sheet[data-journey="${journey.id}"]`);
  await sheet.waitFor();
  await decodePrint(page);
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
    'New and existing C6 family sheets retain Letter bounds.',
  );
  const plan = c.media.find((m) => m.id === 'chaco-plan-1850');
  await expect(sheet.locator('img')).toHaveAttribute('src', plan.image);
  await expect(sheet).toContainText(journey.familyEvidence.title);
  for (const key of ['text', 'claimPrompt', 'returnPrompt', 'feedback'])
    await expect(sheet).toContainText(journey.familyEvidence[key]);
  for (const notice of journey.familyEvidence.notice)
    await expect(sheet).toContainText(notice);
  await expect(sheet).toContainText(plan.printCaption ?? plan.caption);
  await expect(sheet).toContainText(plan.printCredit ?? plan.credit);
  await expect(sheet).toContainText(plan.rights);
  await expect(
    sheet.locator('.print-object a').filter({ hasText: plan.licenseUrl }),
  ).toHaveAttribute('href', plan.licenseUrl);
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
    'Both existing writing areas remain at least 18 mm.',
  );
  await sheet.screenshot({ path: `${out}/family-sheet.png` });
  results.push({
    sourcePlanFamily: true,
    sourceCapsuleAndProviderRights: true,
    familyBounds,
    writingSpaceMm: writing,
    originalGuideFontTestAppliedToSourceScan: false,
  });
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
    'Communities: four-width reading/source inspection and disputed dates, explicit journey media/focus, three readers, complete licensed source-plan heights and family writing/source rights pass.',
  );
} finally {
  await browser.close();
}

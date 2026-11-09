/* global document, getComputedStyle */
import process from 'node:process';
import console from 'node:console';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { URL } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report) throw Error('Use an isolated candidate preview and report.');
const out = `${report}/workshops`;
await fs.mkdir(out, { recursive: true });
const c = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const cases = [
  { id: 'ming-workshops', object: 'met-42549', year: 1550 },
  { id: 'ottoman-workshops', object: 'met-449533', year: 1560 },
  { id: 'mughal-books', object: 'met-448183', year: 1592 },
];
const retained = {
  subjects: [
    {
      id: 'ming-workshops',
      interval: {
        start: 1368,
        end: 1644,
        label: '1368–1644 CE',
        note: 'Conventional Ming dynastic period. Individual works and trade routes retain their own dates.',
        precision: 'exact',
      },
      objectIds: ['met-42549'],
    },
    {
      id: 'mughal-books',
      interval: {
        start: 1556,
        end: 1605,
        label: '1556–1605 CE',
        note: 'Akbar’s reign; not the entire Mughal state’s lifespan.',
        precision: 'exact',
      },
      objectIds: ['met-448183'],
    },
    {
      id: 'ottoman-workshops',
      interval: {
        start: 1500,
        end: 1755,
        label: 'Selected Ottoman art and urban contexts, c. 1500–1755',
        note: 'A bounded investigation of sixteenth-century work, seventeenth-century markets and eighteenth-century building, ending with the cited 1748–55 mosque example. These are not the Ottoman Empire’s founding or dissolution dates.',
        precision: 'approximate',
      },
      objectIds: ['met-451490', 'met-449533'],
    },
  ],
  media: [
    {
      id: 'met-42549',
      title: 'Jar with carp in lotus pond',
      subject: 'ming-workshops',
      source: 'met-42549',
      accession: '17.127.2',
      creator: 'Maker not recorded',
      date: {
        start: 1534,
        end: 1566,
        label: 'mid-16th century',
        precision: 'range',
        note: 'Catalogue wording retained. Numeric bounds are museum search envelopes, not exact production dates.',
      },
      place: 'Jingdezhen, China; production attribution',
      material:
        'Porcelain painted in underglaze cobalt blue and overglaze polychrome enamels (Jingdezhen ware)',
      image: '/atlas/media/42549-0.webp',
      width: 1200,
      height: 1600,
      thumbnail: '/atlas/media/42549-thumb.webp',
      alt: 'Large round porcelain jar with orange carp and water plants painted around its surface.',
      caption:
        'A mid-sixteenth-century porcelain jar decorated with fish and lotus plants. This specimen is not identified as galleon cargo.',
      notice: [
        'How many fish can you follow around the surface?',
        'Which materials and colors required specialized work?',
      ],
      rights: 'Public domain; The Met Open Access (CC0)',
      credit: 'The Metropolitan Museum of Art. Rogers Fund, 1917. 17.127.2.',
      sourceImage: 'https://images.metmuseum.org/CRDImages/as/original/DP342697.jpg',
      depiction: 'object photograph',
      relevance: 'Imperial production, technique and comparison of intended audiences.',
      additionalImages: [],
    },
    {
      id: 'met-448183',
      title:
        '"Krishna Holds Up Mount Govardhan to Shelter the Villagers of Braj", Folio from a Harivamsa (The Legend of Hari (Krishna))',
      subject: 'mughal-books',
      source: 'met-448183',
      accession: '28.63.1',
      creator: 'Maker not recorded',
      date: {
        start: 1565,
        end: 1620,
        label: 'ca. 1590–95',
        precision: 'range',
        note: 'Catalogue wording retained. Numeric bounds are museum search envelopes, not exact production dates.',
      },
      place: 'Probably Lahore, present-day Pakistan',
      material: 'Ink, opaque watercolor, and gold on paper',
      image: '/atlas/media/448183-0.webp',
      width: 1164,
      height: 1600,
      thumbnail: '/atlas/media/448183-thumb.webp',
      alt: 'Colorful manuscript painting of Krishna lifting a mountain above gathered villagers and animals.',
      caption:
        'A folio made around 1590–95 depicting Krishna protecting villagers. The making date is not the date of the sacred story.',
      notice: [
        'How does the artist arrange the protected people?',
        'How is the sheltering mountain made visible?',
      ],
      rights: 'Public domain; The Met Open Access (CC0)',
      credit:
        'The Metropolitan Museum of Art. Purchase, Edward C. Moore Jr. Gift, 1928. 28.63.1.',
      sourceImage: 'https://images.metmuseum.org/CRDImages/is/original/DP231327.jpg',
      depiction: 'object photograph',
      representedDate: 'A sacred narrative; no historical event year assigned.',
      relevance:
        'Courtly translation and manuscript invention; sacred representation distinguished from eyewitness evidence.',
      additionalImages: [],
    },
    {
      id: 'met-451490',
      subject: 'ottoman-workshops',
      source: 'met-451490',
      title: 'Dish Depicting Two Birds among Flowering Plants',
      accession: '59.69.1',
      creator: 'Maker not recorded',
      date: {
        start: 1575,
        end: 1590,
        label: 'ca. 1575–90',
        precision: 'range',
        note: 'Visible catalogue wording used instead of the API’s wider search envelope. Approximate production range, not exact manufacture dates.',
      },
      place: 'Iznik, present-day Türkiye',
      material: 'Stonepaste; polychrome painted under transparent glaze',
      image: '/atlas/media/met-451490-0.webp',
      width: 1600,
      height: 1600,
      thumbnail: '/atlas/media/met-451490-thumb.webp',
      additionalImages: ['/atlas/media/met-451490-1.webp'],
      alt: 'Round Iznik dish with two small birds among blue, red and green flowering stems.',
      caption:
        'The catalogue dates this Iznik dish around 1575–90. Its painted stonepaste is a local material and design tradition, not Chinese porcelain. The precise buyer and original occasion of use are not identified by this object record.',
      printCaption:
        'Iznik stonepaste dish, c1575–90. The catalogue does not identify its particular buyer or original occasion of use.',
      notice: [
        'Find the two birds among the stems.',
        'How does the design fit a round surface?',
      ],
      relevance:
        'Connects skilled ceramic work with both courtly tastes and wider markets.',
      rights: 'Public domain; The Met Open Access (CC0)',
      credit:
        "The Metropolitan Museum of Art. Gift of James J. Rorimer in appreciation of Maurice S. Dimand's curatorship, 1933–1959, 1959. 59.69.1.",
      sourceImage: 'https://images.metmuseum.org/CRDImages/is/original/DP131621.jpg',
      depiction: 'object photograph',
      datingNote:
        'Museum API envelopes are wider; the visible catalogue dates are retained.',
    },
    {
      id: 'met-449533',
      subject: 'ottoman-workshops',
      source: 'met-449533',
      title: 'Tughra (Insignia) of Sultan Süleiman the Magnificent (r. 1520–66)',
      accession: '38.149.1',
      creator: 'Maker not recorded',
      date: {
        start: 1555,
        end: 1560,
        label: 'ca. 1555–60',
        precision: 'range',
        note: 'Visible catalogue wording used instead of the API’s wider search envelope. Approximate production range, not exact manufacture dates.',
      },
      place: 'Ottoman court; present-day Türkiye',
      material: 'Ink, opaque watercolor, and gold on paper',
      image: '/atlas/media/met-449533-0.webp',
      width: 1600,
      height: 1291,
      thumbnail: '/atlas/media/met-449533-thumb.webp',
      additionalImages: [],
      alt: 'Gold and blue calligraphic tughra with three tall shafts and looping lines filled with floral ornament.',
      caption:
        'A tughra made authority visible on documents. The catalogue distinguishes the specialist who drew its standard form from the illuminator who decorated it. This surviving emblem does not establish how every recipient understood a decree.',
      notice: [
        'Where does writing become a repeated shape?',
        'What work might be needed to make many official documents?',
      ],
      relevance:
        'Makes administration, specialist labor and representation of sovereignty comparable.',
      rights: 'Public domain; The Met Open Access (CC0)',
      credit: 'The Metropolitan Museum of Art. Rogers Fund, 1938. 38.149.1.',
      sourceImage: 'https://images.metmuseum.org/CRDImages/is/original/DP251197.jpg',
      depiction: 'object photograph',
      datingNote:
        'Museum API envelopes are wider; the visible catalogue dates are retained.',
    },
  ],
  files: [
    {
      path: '/atlas/media/42549-0.webp',
      sha256: 'e62f18f14daa2e5665bd2cd6cddc568852e06eb2e471be296da1ad8408d06f4e',
    },
    {
      path: '/atlas/media/42549-thumb.webp',
      sha256: 'ffce94cd2b9f74e9ff71cce757013f7a5e1de80ace03e8b54eeafd5787b5cf20',
    },
    {
      path: '/atlas/media/448183-0.webp',
      sha256: 'd2a7854f7865d3fb6b0fe073eb47c3200007d33d614f027bc9bb10f8b8c96f79',
    },
    {
      path: '/atlas/media/448183-thumb.webp',
      sha256: 'e911500226b5255ebb94532521d4b8eeed0b2fd44bf9eb979615df9b196a89c3',
    },
    {
      path: '/atlas/media/met-451490-0.webp',
      sha256: '16143595b140a1824e2a72e6aab10a781c5d295c136f3303effc6ee7fa22674e',
    },
    {
      path: '/atlas/media/met-451490-thumb.webp',
      sha256: '83a8417ab1f5072eb4cc1e62b1a3cedd3a562a402dde163b3c104d4a6baee310',
    },
    {
      path: '/atlas/media/met-451490-1.webp',
      sha256: '2918bf1c7cb20ec58321b593863a57a0b70e14bb7a49b27791865ecbffc5fa59',
    },
    {
      path: '/atlas/media/met-449533-0.webp',
      sha256: '57a41bb90eb4899134d882c8d9540abd72225b7bff34d8284cbc3def57971445',
    },
    {
      path: '/atlas/media/met-449533-thumb.webp',
      sha256: 'c609196fdadaad32d90d614bf4bf41ab352ce9c19c0584c389bea41e06637a0a',
    },
  ],
};
const journey = c.journeys.find((j) => j.id === 'makers-patrons-markets');
assert.ok(
  journey?.familyEvidence,
  'Integrate the authored C7 family capsule before running this helper.',
);
assert.equal(journey.title, 'Makers, patrons and markets');
assert.equal(journey.question, 'How did makers, patrons and markets organize work?');
assert.equal(journey.leadObject, 'met-42549');
assert.equal(journey.familyEvidence.object, 'met-42549');
assert.deepEqual(
  journey.stops.map((stop) => [stop.subject, stop.year, stop.object]),
  cases.map((row) => [row.id, row.year, row.object]),
);
assert.equal(retained.media.length, 4);
assert.equal(retained.files.length, 9);
for (const previous of retained.subjects) {
  const subject = c.subjects.find((subject) => subject.id === previous.id);
  assert.deepEqual(subject.interval, previous.interval);
  assert.deepEqual(subject.objectIds, previous.objectIds);
  assert.ok(subject.dimensions['work-organization']);
}
for (const previous of retained.media) {
  const media = c.media.find((media) => media.id === previous.id);
  assert.deepEqual(
    media,
    previous,
    'Original complete media record unchanged: ' + previous.id,
  );
  assert.ok(!media.annotations);
}
for (const previous of retained.files) {
  const bytes = await fs.readFile('public' + previous.path);
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    previous.sha256,
    previous.path,
  );
}
assert.deepEqual(c.media.find((media) => media.id === 'met-451490').additionalImages, [
  '/atlas/media/met-451490-1.webp',
]);
for (const key of ['title', 'text', 'claimPrompt', 'returnPrompt', 'feedback'])
  assert.ok(
    typeof journey.familyEvidence[key] === 'string' &&
      journey.familyEvidence[key].trim(),
  );
assert.ok(
  journey.familyEvidence.notice.length && journey.familyEvidence.citations.length,
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
        `${root}/?pack=C7&subject=${row.id}&object=${row.object}&scale=local&year=${row.year}`,
      );
      await ready(page, primary);
      await expect(page.locator('.dossier h1')).toBeFocused();
      await expect(page.locator('.dossier > .date-label')).toHaveText(
        subject.interval.label,
      );
      await expect(page.locator('.dossier > .scope-note')).toContainText(
        subject.interval.note,
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
        if (width === 390 || width === 1440)
          await inspection.screenshot({
            path: out + '/' + media.id + '-inspection-' + width + '.png',
          });
        if (media.additionalImages?.length) {
          const selector = inspection.getByRole('combobox', { name: /^View/ });
          await selector.selectOption('1');
          await expect(inspection.locator('output')).toHaveText('100%');
          await inspection.locator('img').evaluate((img) => img.decode());
          await expect(inspection.locator('img')).toHaveAttribute(
            'src',
            media.additionalImages[0],
          );
          await inspection
            .getByRole('button', { name: 'Zoom in', exact: true })
            .click();
          await expect(inspection.locator('output')).toHaveText('150%');
          await expect(inspection.locator('.annotation-pin')).toHaveCount(0);
          await expect(inspection).toContainText(media.credit);
          await expect(inspection).toContainText(media.rights);
          if (width === 390 || width === 1440)
            await inspection.screenshot({
              path: out + '/' + media.id + '-alternative-inspection-' + width + '.png',
            });
          await selector.selectOption('0');
          await inspection.locator('img').evaluate((img) => img.decode());
          await expect(inspection.locator('img')).toHaveAttribute('src', media.image);
          await expect(inspection.locator('output')).toHaveText('100%');
        }
        await page.keyboard.press('Escape');
        await expect(page.locator('.image-open')).toBeFocused();
        if (width === 390 || width === 1440)
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
        originalCaseAndObjectDates: true,
        namedMapControlsTested: false,
        noNewAnnotations: true,
        noOverflow: true,
        axe: [],
      });
    }
    const first = journey.stops[0];
    await page.goto(
      `${root}/?journey=${journey.id}&step=0&pack=C7&subject=${first.subject}&object=${first.object}&scale=local&year=${first.year}`,
    );
    const inquiry = page.locator('.journey-context');
    await expect(inquiry).toContainText(journey.title);
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
      c.subjects.find((subject) => subject.id === journey.stops.at(-1).subject).interval
        .label,
    );
    for (let i = journey.stops.length - 2; i >= 0; i--) {
      await inquiry.getByRole('button', { name: 'Previous stop', exact: true }).click();
      await expect(inquiry.locator('[data-journey-title]')).toHaveText(
        journey.stops[i].title,
      );
      await expect(inquiry.locator('[data-journey-title]')).toBeFocused();
      await ready(
        page,
        c.media.find((media) => media.id === journey.stops[i].object),
      );
    }
    results.push({
      width,
      completeJourney: true,
      explicitSelectedMedia: true,
      coldDossierThenStopHeadingFocus: true,
      caseAndViewDatesRemainDistinct: true,
      previousStopFocusAndExplicitMedia: true,
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
    const mediaBounds = [];
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
      {
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
          `${media.id}: complete image and caption fit one Letter content area.`,
        );
        mediaBounds.push({ id: media.id, ...bounds });
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
    for (const section of subject.deeperReading)
      await expect(page.locator('.reader-print')).toContainText(section.text);
    for (const reference of c.contexts.filter((ctx) =>
      subject.contextIds.includes(ctx.id),
    )) {
      await expect(page.locator('.reader-print')).toContainText(
        reference.interval.note,
      );
      for (const phase of reference.phases)
        await expect(page.locator('.reader-print')).toContainText(phase.text);
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
      mapLayoutCompatibilityOnly: true,
      mediaBounds,
      unchangedCaseDate: true,
    });
  }
  await page.goto(`${root}/?print=family&pack=C7`);
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
    'New and existing C7 family sheets retain Letter bounds.',
  );
  const lead = c.media.find((m) => m.id === 'met-42549');
  await expect(sheet.locator('img')).toHaveAttribute('src', lead.image);
  await expect(sheet).toContainText(journey.familyEvidence.title);
  for (const key of ['text', 'claimPrompt', 'returnPrompt', 'feedback'])
    await expect(sheet).toContainText(journey.familyEvidence[key]);
  for (const notice of journey.familyEvidence.notice)
    await expect(sheet).toContainText(notice);
  await expect(sheet).toContainText(lead.printCaption ?? lead.caption);
  await expect(sheet).toContainText(lead.printCredit ?? lead.credit);
  await expect(sheet).toContainText(lead.rights);
  if (lead.licenseUrl)
    await expect(
      sheet.locator('.print-object a').filter({ hasText: lead.licenseUrl }),
    ).toHaveAttribute('href', lead.licenseUrl);
  await expect(sheet.locator('.annotation-pin')).toHaveCount(0);
  for (const citation of journey.familyEvidence.citations) {
    const source = c.sources.find((s) => s.id === citation.source);
    const links = await sheet.locator('.family-source-credits a').evaluateAll((nodes) =>
      nodes.map((node) => ({
        title: node.textContent,
        href: node.getAttribute('href'),
      })),
    );
    assert.ok(
      links.some(
        (link) => link.href === source.url && link.title?.includes(source.title),
      ),
    );
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
    unchangedMingJarFamily: true,
    authoredSourceCapsuleAndRights: true,
    familyBounds,
    writingSpaceMm: writing,
    newGuideFontTestApplied: false,
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
    'Workshops: four-width layered reading, original case/media dates and assets, rights and primary/alternate inspection, explicit journey media/focus, three readers and authored family capsule/writing bounds pass.',
  );
} finally {
  await browser.close();
}

/* global document, window, localStorage, history, PopStateEvent */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { URL, URLSearchParams } from 'node:url';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report)
  throw Error('Use an isolated candidate preview and report directory.');
const out = `${report}/journey-loading`;
await fs.mkdir(out, { recursive: true });
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const bootstrap = JSON.parse(await fs.readFile('public/atlas/index.json', 'utf8'));
assert.equal(bootstrap.journeyDetailsDeferred, true);
const journey = corpus.journeys.find((j) => j.id === 'institutions-shipment-ritual');
const other = corpus.journeys.find((j) => j.id === 'rules-messages-public-work');
assert.ok(journey && other);
const bundle = JSON.parse(
  await fs.readFile(`public/atlas/journey-records/${journey.id}.json`, 'utf8'),
);
const endpoint = `**/atlas/journey-records/${journey.id}.json?*`;
const url = (selected = journey, step = 0) => {
  const stop = selected.stops[step];
  const subject = corpus.subjects.find((s) => s.id === stop.subject);
  const query = new URLSearchParams({
    journey: selected.id,
    step: String(step),
    pack: subject.packs[0],
    subject: stop.subject,
    scale: 'local',
    year: String(stop.year),
  });
  if (stop.object) query.set('object', stop.object);
  return `${root}/?${query}`;
};
const gate = () => {
  let release;
  const promise = new Promise((resolve) => {
    release = resolve;
  });
  return { promise, release };
};
const browser = await chromium.launch();
const results = [];

async function fresh(width = 390) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  const external = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await context.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(root).origin)
      return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  return { context, page, errors, external };
}

async function saveJourney(page, selected, step, answer) {
  await page
    .locator('.journey-context')
    .getByRole('button', { name: 'Save journey', exact: true })
    .click();
  await expect(page.locator('.save-dialog textarea[name=question]')).toHaveValue(
    selected.returnPrompt,
  );
  await page.locator('textarea[name=answer]').fill(answer);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(page.locator('.save-dialog')).not.toBeVisible();
  const note = await page.evaluate((answer) => {
    const book = JSON.parse(localStorage.getItem('chronos.household.v1'));
    return book.notes.find((item) => item.answer === answer);
  }, answer);
  assert.equal(note.kind, 'journey');
  assert.equal(note.title, selected.title);
  assert.equal(note.question, selected.returnPrompt);
  assert.equal(note.context.journey, selected.id);
  assert.equal(note.context.step, step);
  assert.equal(note.context.subject, selected.stops[step].subject);
  assert.equal(note.context.year, selected.stops[step].year);
  for (const citation of selected.evidence.citations) {
    const source = corpus.sources.find((s) => s.id === citation.source);
    const saved = note.context.sources.find((s) => s.id === citation.source);
    assert.ok(saved, `Retain journey source ${citation.source} before prose loads.`);
    assert.equal(saved.url, source.url);
    assert.equal(saved.consulted, source.accessed);
    assert.ok(saved.locator.includes(citation.locator));
  }
  await page
    .locator('.app-message')
    .getByRole('button', { name: 'Dismiss', exact: true })
    .click();
}

async function sameTitle(page) {
  assert.ok(
    await page.evaluate(
      () => window.__journeyTitle === document.querySelector('[data-journey-title]'),
    ),
    'Hydration and recovery must retain the selected stop heading node.',
  );
}

async function settleFrames(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)),
      ),
  );
}

try {
  for (const width of [320, 390, 768, 1440]) {
    const { context, page, errors, external } = await fresh(width);
    const subjectGate = gate();
    const failedGate = gate();
    const recoveryGate = gate();
    let subjectRequests = 0;
    let journeyRequests = 0;
    await page.route(
      `**/atlas/subjects/${journey.stops[0].subject}.json`,
      async (route) => {
        subjectRequests++;
        await subjectGate.promise;
        return route.continue();
      },
    );
    await page.route('**/atlas/journey-records/**', async (route) => {
      journeyRequests++;
      if (journeyRequests === 1) {
        await failedGate.promise;
        return route.fulfill({ status: 503, body: 'Temporarily unavailable' });
      }
      await recoveryGate.promise;
      return route.continue();
    });
    await page.goto(`${root}/?view=timeline`);
    await expect(page.locator('.living-timeline')).toBeVisible();
    assert.equal(journeyRequests, 0, 'Overview must not request journey prose.');
    await page.goto(`${root}/?page=journeys`);
    const card = page.locator('.journey-grid article').filter({
      has: page.getByRole('heading', { name: journey.title, exact: true }),
    });
    await expect(card).toContainText(journey.introduction);
    assert.equal(journeyRequests, 0, 'The journey catalogue uses retained summaries.');
    await card
      .getByRole('button', { name: 'Begin investigation →', exact: true })
      .click();
    const reading = page.locator('.journey-context');
    const title = reading.locator('[data-journey-title]');
    await expect(reading).toHaveAttribute('data-journey-id', journey.id);
    await expect(reading).toHaveAttribute('data-journey-status', 'loading');
    await expect(title).toHaveText(journey.stops[0].title);
    await expect(title).toBeFocused();
    await expect.poll(() => subjectRequests).toBe(1);
    await expect.poll(() => journeyRequests).toBe(1);
    // Both responses remain held: journey reading begins alongside case prose.
    await expect(page.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'false',
    );
    await expect(reading.getByRole('status')).toHaveText('Loading journey reading…');
    await expect(
      reading.getByText(journey.stops[0].narrative, { exact: true }),
    ).toHaveCount(0);
    await page.evaluate(() => {
      window.__journeyTitle = document.querySelector('[data-journey-title]');
    });
    await reading.screenshot({ path: `${out}/pending-${width}.png` });
    subjectGate.release();
    await expect(page.locator('.dossier')).toHaveAttribute(
      'data-reading-ready',
      'true',
    );
    await expect(reading).toHaveAttribute('data-journey-status', 'loading');
    await expect(title).toBeFocused();
    await sameTitle(page);
    await saveJourney(
      page,
      journey,
      0,
      `Journey evidence retained while pending at ${width}`,
    );
    failedGate.release();
    await expect(reading).toHaveAttribute('data-journey-status', 'failed');
    await expect(reading.getByRole('status')).toContainText(
      'The cases, source records and stop navigation remain available.',
    );
    await expect(
      reading.getByRole('button', { name: 'Retry journey reading', exact: true }),
    ).toBeVisible();
    await sameTitle(page);
    await reading.screenshot({ path: `${out}/failed-${width}.png` });
    await reading.getByRole('button', { name: /^Compare with / }).click();
    await expect(page.locator('.comparison')).toBeVisible();
    assert.equal(
      new URL(page.url()).searchParams.get('compare'),
      journey.stops[0].compare,
    );
    await expect(reading).toHaveAttribute('data-journey-status', 'failed');
    // Navigation and saved citation provenance work even when all rich journey text failed.
    for (let step = 1; step < journey.stops.length; step++) {
      await reading.getByRole('button', { name: 'Next stop →', exact: true }).click();
      await expect(title).toHaveText(journey.stops[step].title);
      await expect(title).toBeFocused();
      await expect(reading).toHaveAttribute('data-journey-status', 'failed');
      await expect(page.locator('.dossier')).toHaveAttribute(
        'data-reading-ready',
        'true',
      );
    }
    assert.equal(
      journeyRequests,
      1,
      'Changing stops must not silently retry failed prose.',
    );
    const last = journey.stops.length - 1;
    const ending = page.locator('.journey-ending');
    await expect(ending).toHaveAttribute('data-journey-status', 'failed');
    await expect(ending.locator('.question')).toHaveText(journey.returnPrompt);
    await expect(ending).toContainText(
      'The closing reading and source question are unavailable',
    );
    await expect(ending.locator('.evidence-exercise')).toHaveCount(0);
    await saveJourney(
      page,
      journey,
      last,
      `Journey evidence retained after failure at ${width}`,
    );
    await reading
      .getByRole('button', { name: 'Retry journey reading', exact: true })
      .click();
    await expect(reading).toHaveAttribute('data-journey-status', 'loading');
    await expect.poll(() => journeyRequests).toBe(2);
    await expect(title).toBeFocused();
    recoveryGate.release();
    await expect(reading).toHaveAttribute('data-journey-status', 'ready');
    await expect(
      reading.getByText(journey.stops[last].narrative, { exact: true }),
    ).toBeVisible();
    await expect(title).toBeFocused();
    await sameTitle(page);
    await expect(ending).toHaveAttribute('data-journey-status', 'ready');
    await expect(ending.getByText(journey.conclusion, { exact: true })).toBeVisible();
    await expect(ending.locator('.evidence-exercise h2')).toHaveText(
      journey.evidence.prompt,
    );
    await expect(ending.locator('.answer-options button')).toHaveText(
      journey.evidence.options.map((option) => option.text),
    );
    await ending.locator('.citations > summary').click();
    for (const citation of journey.evidence.citations) {
      const source = corpus.sources.find((s) => s.id === citation.source);
      await expect(
        ending.locator('.citations a').filter({ hasText: source.title }).first(),
      ).toHaveAttribute('href', source.url);
      await expect(ending.locator('.citations')).toContainText(citation.locator);
    }
    await reading.getByRole('button', { name: 'Previous stop', exact: true }).click();
    await expect(title).toHaveText(journey.stops[last - 1].title);
    await expect(title).toBeFocused();
    await expect(
      reading.getByText(journey.stops[last - 1].narrative, { exact: true }),
    ).toBeVisible();
    assert.equal(journeyRequests, 2, 'A recovered journey is reused across stops.');
    await reading.screenshot({ path: `${out}/recovered-${width}.png` });
    assert.ok(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1,
      ),
    );
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    await reading.getByRole('button', { name: 'Exit journey', exact: true }).click();
    await expect(page.locator('.journeys-page')).toBeVisible();
    await expect(page.locator('.journey-context')).toHaveCount(0);
    assert.equal(new URL(page.url()).searchParams.get('page'), 'journeys');
    assert.equal(journeyRequests, 2);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    results.push({
      width,
      overviewAndCatalogueRequests: 0,
      parallelCaseAndJourneyRequests: true,
      stopNavigationDuringFailure: true,
      comparisonDuringFailure: true,
      stableHeadingAndHydrationFocus: true,
      pendingAndFailedNotebookProvenance: true,
      exactRecoveredReadingAndEvidence: true,
      returnToCatalogue: true,
      requestsAfterRetry: journeyRequests,
      errors,
      external,
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
    ['wrongJourney', { json: { ...bundle, journey: other.id } }],
    ['wrongRevision', { json: { ...bundle, revision: 'another-release' } }],
    ['missingStop', { json: { ...bundle, stops: bundle.stops.slice(1) } }],
    [
      'duplicateStop',
      {
        json: {
          ...bundle,
          stops: bundle.stops.map((stop, i) =>
            i === 1 ? { ...stop, index: 0 } : stop,
          ),
        },
      },
    ],
    [
      'blankNarrative',
      {
        json: {
          ...bundle,
          stops: bundle.stops.map((stop, i) =>
            i ? stop : { ...stop, narrative: ' ' },
          ),
        },
      },
    ],
    ['missingConclusion', { json: { ...bundle, conclusion: '' } }],
    [
      'missingEvidenceOptions',
      { json: { ...bundle, evidence: { ...bundle.evidence, options: [] } } },
    ],
    ['unknownEnvelopeField', { json: { ...bundle, title: 'Injected retained title' } }],
    [
      'unknownStopField',
      {
        json: {
          ...bundle,
          stops: bundle.stops.map((stop, i) =>
            i ? stop : { ...stop, subject: other.stops[0].subject },
          ),
        },
      },
    ],
    [
      'unknownEvidenceField',
      {
        json: {
          ...bundle,
          evidence: { ...bundle.evidence, citations: other.evidence.citations },
        },
      },
    ],
    [
      'unknownOptionField',
      {
        json: {
          ...bundle,
          evidence: {
            ...bundle.evidence,
            options: bundle.evidence.options.map((option, i) =>
              i ? option : { ...option, injected: true },
            ),
          },
        },
      },
    ],
  ];
  for (const [fault, response] of faults) {
    const { context, page, errors, external } = await fresh();
    let requests = 0;
    await page.route(endpoint, (route) => {
      requests++;
      return requests === 1 ? route.fulfill(response) : route.continue();
    });
    await page.goto(url(journey, journey.stops.length - 1));
    const reading = page.locator('.journey-context');
    const ending = page.locator('.journey-ending');
    await expect(reading).toHaveAttribute('data-journey-status', 'failed');
    await expect(reading.locator('[data-journey-title]')).toHaveText(
      journey.stops.at(-1).title,
    );
    await expect(
      reading.getByText(journey.stops.at(-1).narrative, { exact: true }),
    ).toHaveCount(0);
    await expect(ending.locator('.evidence-exercise')).toHaveCount(0);
    await expect(ending.locator('.question')).toHaveText(journey.returnPrompt);
    if (fault === 'unknownEvidenceField')
      await saveJourney(
        page,
        journey,
        journey.stops.length - 1,
        'Rejected evidence cannot replace saved provenance',
      );
    await reading
      .getByRole('button', { name: 'Retry journey reading', exact: true })
      .click();
    await expect(reading).toHaveAttribute('data-journey-status', 'ready');
    await expect(
      reading.getByText(journey.stops.at(-1).narrative, { exact: true }),
    ).toBeVisible();
    await expect(ending.getByText(journey.conclusion, { exact: true })).toBeVisible();
    assert.equal(requests, 2, `Explicit retry must recover ${fault}.`);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    results.push({
      fault,
      rejectedBeforeDisplay: true,
      requestsAfterRetry: requests,
      errors,
      external,
    });
    await context.close();
  }

  for (const fault of ['missingRevision', 'unmarkedIncompleteJourney']) {
    const { context, page, errors, external } = await fresh();
    let indexRequests = 0;
    let journeyRequests = 0;
    await page.route('**/atlas/index.json', (route) => {
      indexRequests++;
      if (indexRequests !== 1) return route.continue();
      const incomplete = JSON.parse(JSON.stringify(bootstrap));
      if (fault === 'missingRevision') {
        delete incomplete.journeys.find((j) => j.id === journey.id).detailsRevision;
      } else {
        delete incomplete.journeyDetailsDeferred;
      }
      return route.fulfill({ json: incomplete });
    });
    page.on('request', (request) => {
      if (request.url().includes('/atlas/journey-records/')) journeyRequests++;
    });
    await page.goto(url());
    const reading = page.locator('.journey-context');
    await expect(reading).toHaveAttribute('data-journey-status', 'failed');
    await expect(
      reading.getByRole('button', { name: 'Retry journey reading', exact: true }),
    ).toHaveCount(0);
    assert.equal(
      journeyRequests,
      0,
      'Invalid bootstrap cannot request unverified prose.',
    );
    await reading.getByRole('button', { name: 'Reload atlas', exact: true }).click();
    await expect(reading).toHaveAttribute('data-journey-status', 'ready');
    assert.equal(indexRequests, 2);
    assert.equal(journeyRequests, 1);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    results.push({
      bootstrapFault: fault,
      reloadRecovery: true,
      indexRequests,
      journeyRequests,
      errors,
      external,
    });
    await context.close();
  }

  // One mounted app: a slow old journey cannot replace another journey's reading.
  {
    const { context, page, errors, external } = await fresh();
    const held = gate();
    let oldRequests = 0;
    await page.route(endpoint, async (route) => {
      oldRequests++;
      await held.promise;
      return route.continue();
    });
    await page.goto(url());
    const reading = page.locator('.journey-context');
    await expect(reading).toHaveAttribute('data-journey-status', 'loading');
    await page.evaluate((next) => {
      history.pushState({}, '', next);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, url(other));
    await expect(reading).toHaveAttribute('data-journey-id', other.id);
    await expect(reading).toHaveAttribute('data-journey-status', 'ready');
    await expect(
      reading.getByText(other.stops[0].narrative, { exact: true }),
    ).toBeVisible();
    const lateResponse = page.waitForResponse((response) =>
      new URL(response.url()).pathname.endsWith(
        `/atlas/journey-records/${journey.id}.json`,
      ),
    );
    held.release();
    await (await lateResponse).finished();
    await settleFrames(page);
    await expect(reading).toHaveAttribute('data-journey-id', other.id);
    await expect(reading).toHaveAttribute('data-journey-status', 'ready');
    await expect(
      reading.getByText(other.stops[0].narrative, { exact: true }),
    ).toBeVisible();
    await expect(
      reading.getByText(journey.stops[0].narrative, { exact: true }),
    ).toHaveCount(0);
    await page.evaluate((next) => {
      history.pushState({}, '', next);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, url());
    await expect(reading).toHaveAttribute('data-journey-id', journey.id);
    await expect(reading).toHaveAttribute('data-journey-status', 'ready');
    await expect(
      reading.getByText(journey.stops[0].narrative, { exact: true }),
    ).toBeVisible();
    assert.equal(oldRequests, 1, 'A completed old request remains reusable on return.');
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    results.push({
      staleJourneyIgnored: true,
      cachedReturnRequests: oldRequests,
      errors,
      external,
    });
    await context.close();
  }

  // Canonical print still reads every full paragraph and option directly.
  {
    const { context, page, errors, external } = await fresh();
    let journeyRequests = 0;
    await page.route('**/atlas/journey-records/**', (route) => {
      journeyRequests++;
      return route.abort();
    });
    const pack = corpus.packs.find(
      (p) =>
        p.journey === journey.id ||
        p.investigations?.some((i) => i.journey === journey.id),
    );
    assert.ok(pack);
    await page.goto(`${root}/?print=chapter&pack=${pack.id}`);
    const routePages = page.locator('.chapter-route').filter({
      has: page.getByRole('heading', { name: journey.title, exact: true }),
    });
    for (const stop of journey.stops)
      await expect(routePages).toContainText([stop.narrative]);
    await expect(routePages).toContainText([journey.conclusion]);
    const exercise = page.locator('.chapter-evidence').filter({
      has: page.getByRole('heading', { name: journey.evidence.prompt, exact: true }),
    });
    for (const option of journey.evidence.options)
      await expect(exercise).toContainText(option.text);
    assert.equal(journeyRequests, 0);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    results.push({
      canonicalPrintComplete: true,
      journeySidecarRequests: 0,
      errors,
      external,
    });
    await context.close();
  }
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'Deferred journeys: four-width parallel loading/failure/retry, stable headings, navigation and notebook provenance, corrupt records/bootstrap, journey races and canonical print passed.',
  );
} finally {
  await browser.close();
}

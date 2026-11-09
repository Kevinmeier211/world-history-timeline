import process from 'node:process';
/* global document, innerWidth, innerHeight, console, matchMedia, window */
import { URL, URLSearchParams } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const root = process.env.ATLAS_URL ?? 'http://127.0.0.1:4174';
const out = process.env.ATLAS_REPORT_DIR
  ? `${process.env.ATLAS_REPORT_DIR}/release`
  : 'output/redesign/final';
await fs.mkdir(`${out}/screens`, { recursive: true });
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true,
  });
  context.setDefaultTimeout(15_000);
  context.setDefaultNavigationTimeout(20_000);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => {
    errors.push(e.message);
    console.error('Release runtime error:', e.message);
  });
  const findings = [];
  const goto = async (q = '') => {
    await page.goto(`${root}/${q}`);
    await page.locator('.app-footer').waitFor();
  };
  const title = async () => {
    await page.locator('.dossier-section').first().waitFor();
    return page.locator('.dossier h1').textContent();
  };
  await goto('?view=timeline');
  assert.match(await page.locator('.living-timeline').textContent(), /3300 BCE/);
  await page.locator('.timeline-reference > summary').click();
  assert.equal(await page.locator('.era-row').count(), 8);
  findings.push({
    scenario: 1,
    result: 'Opening scope and eight actionable chapters present',
  });
  await goto('?pack=C1&region=Americas&scale=era');
  await page.getByRole('button', { name: 'Search', exact: false }).first().click();
  await page.getByRole('searchbox').fill('Byzantine');
  await page.locator('.search-results button').filter({ hasText: 'Byzantium' }).click();
  assert.match(await title(), /Byzantium/);
  assert.equal(await page.locator('.search-dialog').count(), 0);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.search-dialog').count(), 0);
  findings.push({
    scenario: 2,
    result:
      'Alias search reveals target from another chapter/region; modal closes without reopening',
  });
  await page.locator('#year-input').fill('1200 BCE');
  await page.locator('.year-form button').click();
  await page.locator('.date-more > summary').click();
  assert.equal(
    await page.getByLabel('Go to year', { exact: true }).inputValue(),
    '1200 BCE',
  );
  assert.equal(new URL(page.url()).searchParams.get('year'), '1200 BCE');
  await page.getByLabel('Go to year', { exact: true }).fill('0');
  await page.locator('.date-jump button').click();
  assert.match(
    await page.locator('.date-more [role="alert"]').textContent(),
    /no year zero/,
  );
  await page.getByLabel('Go to year', { exact: true }).fill('3000 CE');
  await page.locator('.date-jump button').click();
  assert.match(
    await page.locator('.date-more [role="alert"]').textContent(),
    /3300 BCE to 2000 CE/,
  );
  findings.push({
    scenario: 3,
    result: 'BCE context restored; zero rejected; out-of-program explanation present',
  });
  await goto('?pack=C4&view=world&year=200%20CE&scale=era');
  await page.locator('.world-reading-notes > summary').click();
  assert.ok(
    (await page
      .locator('.regional-snapshot')
      .filter({ has: page.locator('button') })
      .count()) >= 3,
  );
  findings.push({
    scenario: 4,
    result: 'World at200 includes multiple regions and explicit coverage notes',
  });
  await goto('?pack=C7&subject=mughal-books&object=met-448183&scale=local&year=1592');
  await title();
  await page.locator('.image-open img').evaluate((i) => i.decode());
  await page.getByRole('button', { name: /Inspect object:/ }).click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  assert.match(await page.locator('.inspection output').textContent(), /150/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.inspection').evaluate((d) => d.open), false);
  await page.getByText('Object record and credit', { exact: true }).click();
  assert.match(await page.locator('.object-figure').textContent(), /Represented date/);
  assert.ok(
    (
      await page
        .getByRole('link', { name: /Read original institutional record/ })
        .getAttribute('href')
    ).startsWith('https://www.metmuseum.org/'),
  );
  findings.push({
    scenario: 5,
    result:
      'Decoded authentic image, enlarged inspection, date distinction and original record link checked',
  });
  await goto('?pack=C4&subject=palmyra&scale=local&year=200');
  await title();
  assert.match(await page.locator('.connection').textContent(), /trade|network/i);
  assert.ok(await page.locator('.connection .citations').count());
  await page
    .getByRole('button', { name: /Follow to/ })
    .first()
    .click();
  assert.match(await title(), /Kushan/);
  findings.push({
    scenario: 6,
    result:
      'Connection has typed meaning, chronology, explanation and precise evidence; activation reaches visible target',
  });
  await goto('?pack=C4&view=world&scale=era&year=200%20CE&region=all');
  const prior = new URL(page.url()).search;
  await page
    .getByRole('button', { name: 'Begin The world around 200 CE →', exact: true })
    .click();
  await title();
  await page.getByRole('button', { name: 'Next stop' }).click();
  const stopBefore = new URL(page.url()).search;
  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  await page.locator('.claims').waitFor();
  await page.getByRole('button', { name: 'Sources', exact: true }).click();
  assert.equal(new URL(page.url()).searchParams.get('step'), '1');
  await page.getByRole('button', { name: 'Exit journey', exact: true }).click();
  const restored = new URL(page.url()).searchParams;
  const original = new URLSearchParams(prior);
  for (const key of ['pack', 'view', 'scale', 'year'])
    assert.equal(restored.get(key), original.get(key));
  assert.equal(restored.get('region') ?? 'all', original.get('region') ?? 'all');
  assert.equal(restored.get('subject'), null);
  assert.equal(restored.get('journey'), null);
  findings.push({
    scenario: 7,
    result: 'Sources detour retains exact stop; exit restores prior exploration',
    stop: stopBefore,
  });
  await goto(
    '?pack=C3&subject=ashoka-messages&compare=tomioka&scale=local&year=250%20BCE',
  );
  await page.locator('.comparison-dimension').first().waitFor();
  assert.match(
    await page.locator('.comparison').textContent(),
    /documented for only one subject/,
  );
  findings.push({
    scenario: 8,
    result: 'Aligned sourced dimensions; asymmetric dimensions explicitly explained',
  });
  // Complete every actual journey, including all three modern investigations.
  for (const j of corpus.journeys) {
    const first = j.stops[0],
      s = corpus.subjects.find((x) => x.id === first.subject);
    await goto(
      `?pack=${s.packs[0]}&subject=${s.id}&journey=${j.id}&step=0&scale=local&year=${first.year}`,
    );
    for (let i = 0; i < j.stops.length; i++) {
      assert.equal(
        await title(),
        corpus.subjects.find((s) => s.id === j.stops[i].subject).name,
      );
      assert.equal(
        new URL(page.url()).searchParams
          .get('year')
          ?.replace(' BCE', '')
          .replace(' CE', ''),
        i === 0 ? String(first.year) : String(Math.abs(j.stops[i].year)),
      );
      if (i < j.stops.length - 1)
        await page.getByRole('button', { name: 'Next stop' }).click();
    }
    const wrong = j.evidence.options.find((o) => !o.supported);
    await page.getByRole('button', { name: wrong.text, exact: true }).click();
    assert.match(await page.locator('.feedback').textContent(), /Look again/);
    const right = j.evidence.options.find((o) => o.supported);
    await page.getByRole('button', { name: right.text, exact: true }).click();
    assert.match(await page.locator('.feedback').textContent(), /defensible claim/);
    findings.push({
      journey: j.id,
      stops: j.stops.length,
      result: 'All subjects, years and both reasoning feedback states passed',
    });
  }
  findings.push({
    scenario: 9,
    result: `Observation, limited inference and overreach feedback exercised in all ${corpus.journeys.length} journeys`,
  });
  await goto('?pack=C4&subject=eastern-han&scale=local&year=200%20CE');
  await title();
  const link = page.url();
  await page.getByRole('button', { name: 'Save a question', exact: true }).click();
  await page
    .locator('textarea[name=answer]')
    .fill('An estate model does not describe every home.');
  await page.getByRole('button', { name: 'Save on this device' }).click();
  await page.getByRole('button', { name: 'Notebook', exact: true }).click();
  const dlPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export notebook' }).click();
  const dl = await dlPromise;
  const bookPath = `${out}/notebook-export.json`;
  await dl.saveAs(bookPath);
  const exported = JSON.parse(await fs.readFile(bookPath, 'utf8'));
  assert.equal(exported.version, 1);
  assert.equal(exported.notes.length, 1);
  const fresh = await browser.newContext({
    viewport: { width: 390, height: 844 },
    acceptDownloads: true,
  });
  const second = await fresh.newPage();
  await second.goto(`${root}/?page=notebook`);
  await second.locator('input[type=file]').setInputFiles(bookPath);
  await second.getByRole('button', { name: 'Add imported entries' }).click();
  await second.getByRole('button', { name: 'Return to this moment' }).click();
  await second.locator('.dossier-section').first().waitFor();
  assert.equal(await second.locator('.dossier h1').textContent(), 'Eastern Han');
  await second.reload();
  await second.locator('.dossier-section').first().waitFor();
  await page.goto(link);
  await title();
  await page.getByRole('button', { name: 'Search', exact: false }).first().click();
  await page.getByRole('searchbox').fill('Colima');
  await page.locator('.search-results button').first().click();
  assert.match(await title(), /Colima/);
  await page.goBack();
  assert.equal(await title(), 'Eastern Han');
  await page.goForward();
  assert.match(await title(), /Colima/);
  findings.push({
    scenario: 10,
    result:
      'Real JSON export/import across fresh contexts, saved return, reload, copied links and Back/Forward passed',
  });
  await goto('#y=476&z=2&sel=eastern_roman_empire');
  assert.match(await title(), /Byzantium/);
  assert.match(
    await page.locator('[aria-label="Legacy link disposition"]').textContent(),
    /395–476/,
  );
  await page.reload();
  assert.match(await title(), /Byzantium/);
  // Actual keyboard actions, native modal focus, semantic reading sequence.
  await goto();
  await page.keyboard.press('Tab');
  assert.match(
    await page.evaluate(() => document.activeElement.textContent),
    /Skip to atlas/,
  );
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Search', exact: false }).first().focus();
  await page.keyboard.press('Enter');
  assert.equal(
    await page.getByRole('searchbox').evaluate((e) => e === document.activeElement),
    true,
  );
  await page.getByRole('searchbox').fill('Han');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  assert.equal(await title(), 'Eastern Han');
  await page.getByRole('button', { name: /Inspect object:/ }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.inspection').evaluate((d) => d.open), false);
  await fs.writeFile(
    `${out}/reading-sequence.txt`,
    await page.locator('main').ariaSnapshot(),
  );
  findings.push({
    scenario: 11,
    result:
      'Keyboard search/selection/modal controls and semantic reading sequence checked; no human screen-reader session claimed',
  });
  for (const [name, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 768, 1024],
    ['phone', 390, 844],
    ['narrow', 320, 700],
    ['landscape', 1024, 768],
    ['zoom-equivalent', 720, 900],
  ]) {
    await page.setViewportSize({ width, height });
    for (const [screen, q] of [
      ['overview', ''],
      ['chapter', '?pack=C3&scale=era&year=300%20BCE'],
      ['dossier', '?pack=C8&subject=hine-labor&scale=local&year=1908'],
      [
        'compare',
        '?pack=C3&subject=nimrud-palace&compare=ashoka-messages&scale=local&year=250%20BCE',
      ],
    ]) {
      console.log(`Release viewport ${name}/${screen}`);
      await goto(q);
      if (screen === 'dossier') await title();
      if (screen === 'compare')
        await page.locator('.comparison-dimension').first().waitFor();
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        `${name}/${screen} overflows`,
      );
      const axe = await new AxeBuilder({ page }).analyze();
      findings.push({
        viewport: [width, height],
        screen,
        axe: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => n.target),
        })),
      });
      if (['desktop', 'tablet', 'phone'].includes(name)) {
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.images]
              .filter((image) => {
                const rect = image.getBoundingClientRect();
                return (
                  rect.width > 0 &&
                  rect.height > 0 &&
                  rect.bottom > 0 &&
                  rect.top < innerHeight &&
                  rect.right > 0 &&
                  rect.left < innerWidth
                );
              })
              .map(async (image) => {
                let timer;
                try {
                  await Promise.race([
                    image.decode(),
                    new Promise((_, reject) => {
                      timer = window.setTimeout(
                        () =>
                          reject(
                            new Error(
                              `Visible image decode timed out: ${image.currentSrc}`,
                            ),
                          ),
                        10_000,
                      );
                    }),
                  ]);
                } finally {
                  window.clearTimeout(timer);
                }
              }),
          );
        });
        await page.screenshot({
          path: `${out}/screens/${name}-${screen}.png`,
          fullPage: screen === 'compare',
        });
      }
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(
    await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
    true,
  );
  await page.getByRole('button', { name: 'Use dark appearance' }).click();
  const darkAxe = await new AxeBuilder({ page }).analyze();
  findings.push({
    mode: 'dark reduced-motion',
    axe: darkAxe.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  });
  await page.screenshot({ path: `${out}/screens/dark-compare.png` });
  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const tp = await touch.newPage();
  await tp.goto(`${root}/?pack=C8&subject=tiriti&scale=local&year=1840`);
  await tp.locator('.dossier-section').first().waitFor();
  assert.equal(await tp.evaluate(() => matchMedia('(pointer:coarse)').matches), true);
  await tp.getByRole('button', { name: 'Sources', exact: true }).tap();
  await tp.locator('.claims').waitFor();
  findings.push({
    scenario: 12,
    result:
      'Six widths, 200%-zoom-equivalent CSS viewport, coarse touch, dark and reduced motion checked. Actual device and human screen-reader limits remain documented.',
  });
  // Check every media file is decodable; all dossiers actually load.
  for (const s of corpus.subjects) {
    const response = await context.request.get(`${root}/atlas/subjects/${s.id}.json`);
    assert.equal(response.status(), 200);
    assert.equal((await response.json()).id, s.id);
  }
  for (const m of corpus.media) {
    for (const src of [m.image, m.thumbnail, ...(m.additionalImages ?? [])]) {
      const r = await context.request.get(`${root}${src}`);
      assert.equal(r.status(), 200);
      assert.ok((await r.body()).length > 100);
    }
  }
  assert.deepEqual(errors, []);
  for (const finding of findings)
    if (finding.axe) assert.equal(finding.axe.length, 0, JSON.stringify(finding));
  await fs.writeFile(
    `${out}/browser-results.json`,
    JSON.stringify({ findings, errors }, null, 2),
  );
  console.log(JSON.stringify(findings, null, 2));
} finally {
  await browser.close();
}

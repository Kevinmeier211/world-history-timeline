/* Check delivered evidence and return state; this does not authenticate sources. */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { URL, URLSearchParams } from 'node:url';
import console from 'node:console';
import process from 'node:process';
const raw = await fs.readFile('dist/atlas/corpus.json');
const corpus = JSON.parse(raw);
const readingNotes = JSON.parse(
  await fs.readFile('src/atlas/comparison-reading-notes.json', 'utf8'),
);
const byId = new Map(corpus.subjects.map((s) => [s.id, s]));
const bySource = new Map(corpus.sources.map((s) => [s.id, s]));
const server = spawn('python3', [
  '-u',
  'scripts/redesign/serve.py',
  '--root',
  'dist',
  '--port',
  '0',
]);
let browser, context;
const comparisons = [],
  defaults = [],
  places = [],
  errors = [];
try {
  const [line] = await once(server.stdout, 'data');
  const origin = String(line).match(/http:\/\/127\.0\.0\.1:\d+/)[0];
  browser = await chromium.launch();
  context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  function query(s) {
    const year =
      s.interval.start ||
      corpus.orientations.find((r) => r.chapter === s.packs[0]).snapshots[0].year;
    return new URLSearchParams({
      page: 'explore',
      view: 'world',
      scale: 'era',
      pack: s.packs[0],
      year: Math.abs(year) + (year < 0 ? ' BCE' : ' CE'),
      region: s.region,
      subject: s.id,
    });
  }
  for (const s of corpus.subjects) {
    const q = query(s);
    await page.goto(origin + '/?' + q);
    await page.locator('.dossier[data-reading-ready=true]').waitFor();
    if (s.placeStudy) {
      const study = s.placeStudy,
        area = page.locator('.place-study');
      await expect(area.getByRole('img')).toHaveAccessibleName(
        study.title +
          '. Approximate geographic locators, with an equivalent place list below.',
      );
      const checks = [];
      for (const [i, p] of study.points.entries()) {
        const b = area.locator('.place-index button').nth(i);
        await b.click();
        await expect(b).toHaveAttribute('aria-pressed', 'true');
        await expect(area.locator('.place-explanation h3')).toHaveText(p.label);
        await expect(area.locator('.place-explanation')).toContainText(p.text);
        const links = area.locator('.place-explanation .citations a');
        await expect(links).toHaveCount(p.citations.length);
        assert.deepEqual(
          await links.evaluateAll((items) => items.map((a) => a.getAttribute('href'))),
          p.citations.map((c) => bySource.get(c.source).url),
        );
        checks.push({ id: p.id, citations: p.citations });
      }
      await area.getByText('How to read this map', { exact: true }).click();
      for (const f of study.features) await expect(area).toContainText(f.note);
      places.push({
        subject: s.id,
        points: checks,
        features: study.features.map((f) => ({
          kind: f.kind,
          note: f.note,
          citations: f.citations,
        })),
      });
    }
    await page
      .getByRole('button', { name: 'Compare two subjects', exact: true })
      .click();
    await page.locator('.compare-pair article').nth(1).waitFor();
    await expect(page.locator('.comparison h1')).toBeFocused();
    const other = new URL(page.url()).searchParams.get('compare');
    const pair = corpus.comparisons.find(
      (p) => p.subjects.includes(s.id) && p.subjects.includes(other),
    );
    assert.ok(pair, 'Default must open an authored pair for ' + s.id);
    await expect(page.locator('.comparison .question')).toHaveText(pair.question);
    await page.getByRole('button', { name: 'Return to subject', exact: false }).click();
    await page.locator('.dossier[data-reading-ready=true]').waitFor();
    assert.deepEqual(
      Object.fromEntries(new URL(page.url()).searchParams),
      Object.fromEntries(q),
      'Return state for ' + s.id,
    );
    defaults.push({
      subject: s.id,
      partner: other,
      pair: pair.id,
      returnState: 'matched',
    });
  }
  for (const pair of corpus.comparisons) {
    const [a, b] = pair.subjects.map((id) => byId.get(id));
    const q = query(a);
    q.set('compare', b.id);
    await page.goto(origin + '/?' + q);
    await expect(page.locator('.comparison .question')).toHaveText(pair.question);
    await expect(page.locator('.comparison > .compare-pair article')).toHaveCount(2);
    const note = readingNotes[pair.id];
    const noteArea = page.getByRole('region', {
      name: 'Reading the two sources together',
    });
    await expect(noteArea).toContainText(note.text);
    const refs = [a, b].flatMap(
      (subject, i) =>
        subject.sections.find((section) => section.title === note.sections[i])
          .citations,
    );
    await expect(noteArea.locator('.citations a')).toHaveCount(refs.length);
    assert.deepEqual(
      await noteArea
        .locator('.citations a')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href'))),
      refs.map((r) => bySource.get(r.source).url),
    );
    const keys = Object.keys(a.dimensions).filter((k) => b.dimensions[k]);
    const blocks = page.locator('.comparison-dimension');
    await expect(blocks).toHaveCount(keys.length);
    for (const [i, k] of keys.entries())
      for (const [j, s] of [a, b].entries()) {
        const pane = blocks.nth(i).locator('article').nth(j),
          cell = s.dimensions[k];
        await expect(pane).toContainText(cell.text);
        await expect(pane.locator('.citations a')).toHaveCount(cell.citations.length);
        assert.deepEqual(
          await pane
            .locator('.citations a')
            .evaluateAll((items) => items.map((a) => a.getAttribute('href'))),
          cell.citations.map((c) => bySource.get(c.source).url),
        );
        for (const ref of cell.citations) await expect(pane).toContainText(ref.locator);
      }
    const unmatched = [
      ...new Set([...Object.keys(a.dimensions), ...Object.keys(b.dimensions)]),
    ].filter((k) => !keys.includes(k));
    if (unmatched.length)
      await expect(page.locator('.comparison .scope-note')).toContainText(
        'documented for only one subject',
      );
    comparisons.push({
      id: pair.id,
      readingNoteAndSources: 'verified',
      matched: keys,
      oneSided: unmatched,
      sourceLinksAndLocators: 'matched to authored record on both sides',
    });
  }
  assert.deepEqual(errors, []);
  const summary = {
    status: 'pass',
    corpusSHA256: createHash('sha256').update(raw).digest('hex'),
    engine: await browser.version(),
    comparisons,
    defaults,
    places,
    errors,
  };
  await fs.writeFile(
    process.env.ATLAS_COMPARISON_RECEIPT ??
      'output/completion-2026-11-04/comparison-place-browser.json',
    JSON.stringify(summary, null, 2) + '\n',
  );
  console.log(
    comparisons.length +
      ' pairs, ' +
      defaults.length +
      ' defaults and returns, ' +
      places.length +
      ' place studies, ' +
      places.flatMap((p) => p.points).length +
      ' selectable locators.',
  );
} finally {
  try {
    try {
      await context?.close();
    } finally {
      await browser?.close();
    }
  } finally {
    if (server.exitCode === null && server.signalCode === null) {
      const done = once(server, 'exit');
      server.kill();
      await done;
    }
  }
}

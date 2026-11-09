/** Browser and standalone-reader checks for the seventeen deepened dossiers. */
/* global document */
import { spawnSync } from 'node:child_process';
import { URL } from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { assertReaderMap } from './assert-reader-map.mjs';

const root = process.env.ATLAS_URL;
const report = process.env.ATLAS_REPORT_DIR;
if (!root || !report) throw Error('Use an isolated candidate preview and report.');
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const ids = [
  'bering-sea-carvers',
  'middle-niger',
  'polynesian-voyaging',
  'haitian-revolution',
  'ozette-makah',
  'wendat-laine',
  'haudenosaunee-canandaigua',
  'tiriti',
  'world-war-one',
  'world-war-two',
  'sputnik',
  'inuinnait-sewing',
  'cherokee-print',
  'ojibwe-manoomin',
  'blackfoot-bison',
  'hidatsa-villages',
  'kwakwakawakw-potlatch',
];
const out = `${report}/reading-repairs`;
await fs.mkdir(out, { recursive: true });
const subject = (id) => corpus.subjects.find((row) => row.id === id);
const mediaOf = (id) => corpus.media.find((row) => row.id === id);
const citedIds = (row) => {
  const citations = [
    ...row.sections.flatMap((section) => section.citations),
    ...(row.deeperReading ?? []).flatMap((section) => section.citations),
    ...(row.evidenceReading?.items ?? []).flatMap((item) => item.citations),
  ];
  for (const id of row.contextIds ?? []) {
    const context = corpus.contexts.find((item) => item.id === id);
    assert.ok(context, `Missing context ${id}`);
    citations.push(...context.citations);
    for (const phase of context.phases) citations.push(...phase.citations);
  }
  return [...new Set(citations.map((item) => item.source))];
};

assert.equal(new Set(ids).size, 17);
assert.equal(corpus.subjects.length, 77);
for (const id of ids) {
  const row = subject(id);
  assert.ok(row, id);
  assert.ok(row.deeperReading?.length, `${id} deeper reading`);
  assert.equal(
    (row.contextIds ?? []).includes('wider-context'),
    false,
    `${id} must not invent a destination named wider-context`,
  );
}
assert.deepEqual(subject('wendat-laine').contextIds ?? [], []);
assert.ok(subject('world-war-one').evidenceReading.items.length >= 4);
assert.ok(subject('world-war-two').evidenceReading.items.length >= 4);
assert.match(subject('world-war-two').familyActivity.duration, /older reader/i);
assert.equal(
  corpus.contexts.some((row) => row.id === 'middle-niger-urban-study-context'),
  false,
);
assert.equal(
  corpus.contexts.some((row) => row.id === 'polynesian-settlement-practice-context'),
  false,
);

const browser = await chromium.launch();
const results = [];
const errors = [];
const external = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === new URL(root).origin)
        return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on('pageerror', (error) => errors.push(`${width}:${error.message}`));
    for (const id of ids) {
      const row = subject(id);
      const object = row.objectIds[0] ? mediaOf(row.objectIds[0]) : null;
      const reference = row.contextIds?.[0]
        ? corpus.contexts.find((item) => item.id === row.contextIds[0])
        : null;
      await page.goto(
        `${root}/?pack=${encodeURIComponent(row.packs[0])}&subject=${id}${object ? `&object=${object.id}` : ''}&scale=local&year=${row.interval.start}`,
      );
      const dossier = page.locator('.dossier');
      await expect(dossier).toHaveAttribute('data-reading-ready', 'true');
      await expect(dossier.locator('h1')).toBeFocused();
      await expect(dossier.locator(':scope > .date-label')).toHaveText(
        row.interval.label,
      );
      await expect(dossier.locator(':scope > .scope-note')).toContainText(
        row.interval.note,
      );
      await expect(dossier).toContainText(row.summary);
      for (const section of row.sections) {
        if (section.title)
          await expect(dossier.locator('h2', { hasText: section.title })).toBeVisible();
        await expect(dossier).toContainText(section.text);
      }
      if (row.familyActivity) {
        await dossier.locator('.family-start > summary').click();
        for (const step of row.familyActivity.steps)
          await expect(dossier.locator('.family-start')).toContainText(step);
        await expect(dossier.locator('.family-start')).toContainText(
          row.familyActivity.explanation,
        );
      } else {
        await expect(dossier.locator('.family-start')).toHaveCount(0);
      }
      const contents = dossier.locator('.reader-contents a');
      const hrefs = await contents.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href')),
      );
      assert.ok(hrefs.includes('#main-explanation'), id);
      assert.ok(hrefs.includes('#deeper-reading'), id);
      if (reference) {
        assert.ok(hrefs.includes('#wider-context'), id);
        await contents.filter({ hasText: 'Time and place' }).focus();
        await page.keyboard.press('Enter');
        await expect(dossier.locator('#wider-context')).toBeVisible();
        await expect(dossier.locator('.reference-timeline')).toContainText(
          reference.interval.label,
        );
        await expect(dossier.locator('.reference-timeline')).toContainText(
          reference.interval.note,
        );
        assert.notEqual(reference.interval.note, row.interval.note, id);
      } else {
        assert.equal(hrefs.includes('#wider-context'), false, id);
        await expect(dossier.locator('#wider-context')).toHaveCount(0);
      }
      for (const href of hrefs.filter((href) => href?.startsWith('#'))) {
        assert.equal(await page.locator(href).count(), 1, `${id} ${href}`);
      }
      if (row.evidenceReading) {
        await expect(dossier.locator('.evidence-reading')).toContainText(
          row.evidenceReading.title,
        );
        for (const item of row.evidenceReading.items) {
          await expect(dossier.locator('.evidence-reading')).toContainText(item.text);
          await expect(dossier.locator('.evidence-reading')).toContainText(
            item.interpretation,
          );
        }
      }
      for (const section of row.deeperReading) {
        const details = dossier.locator('.deeper-reading details', {
          has: page.locator('summary', { hasText: section.title }),
        });
        await details.locator(':scope > summary').click();
        await expect(details).toContainText(section.text);
      }
      if (object) {
        const figure = dossier.locator('.object-figure');
        await expect(figure).toHaveAttribute('data-media-id', object.id);
        await expect(figure.locator('.image-open img')).toHaveAttribute(
          'alt',
          object.alt,
        );
        if (object.date.label !== row.interval.label)
          await expect(figure).toContainText(object.date.label);
        await figure.getByText('Object record and credit', { exact: true }).click();
        await expect(figure).toContainText(object.credit);
        await expect(figure).toContainText(object.rights);
        await figure.locator('.image-open').focus();
        await page.keyboard.press('Enter');
        const dialog = page.locator('dialog.inspection[open]');
        await expect(dialog).toBeVisible();
        await dialog.getByRole('button', { name: 'Zoom in', exact: true }).focus();
        await page.keyboard.press('Enter');
        await expect(dialog.locator('output')).toHaveText('150%');
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
      } else {
        await expect(dossier.locator('.object-figure')).toHaveCount(0);
      }
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `${id} overflow at ${width}`,
      );
      const violations = (await new AxeBuilder({ page }).analyze()).violations;
      assert.deepEqual(
        violations.map((item) => ({ id: item.id, nodes: item.nodes.length })),
        [],
        `${id}/${width}`,
      );
      if (width === 390 || width === 1440)
        await page.screenshot({ path: `${out}/${id}-${width}.png` });
      results.push({ id, width, screen: true });
    }
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1000, height: 1200 } });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror', (error) => errors.push(`print:${error.message}`));
  for (const id of ids) {
    const row = subject(id);
    const object = row.objectIds[0] ? mediaOf(row.objectIds[0]) : null;
    await page.goto(`${root}/?print=reader&subject=${id}`);
    await page.emulateMedia({ media: 'print' });
    await page.locator('.reader-bibliography').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((image) => image.decode().catch(() => undefined)),
      );
    });
    await expect(page.locator('.reader-print')).toContainText(row.summary);
    await expect(page.locator('.reader-print > header')).toContainText(
      row.interval.label,
    );
    for (const section of [...row.sections, ...row.deeperReading])
      await expect(page.locator('.reader-print')).toContainText(section.text);
    if (row.evidenceReading)
      for (const item of row.evidenceReading.items)
        await expect(page.locator('.reader-print')).toContainText(item.text);
    if (row.familyActivity)
      for (const step of row.familyActivity.steps)
        await expect(page.locator('.reader-print')).toContainText(step);
    const reference = row.contextIds?.[0]
      ? corpus.contexts.find((item) => item.id === row.contextIds[0])
      : null;
    if (reference) {
      await expect(page.locator('.reader-print')).toContainText(
        reference.interval.note,
      );
      for (const phase of reference.phases)
        await expect(page.locator('.reader-print')).toContainText(phase.text);
    } else {
      await expect(
        page.locator('.reader-print #wider-context, .reader-print .reference-timeline'),
      ).toHaveCount(0);
    }
    if (object) {
      const figure = page.locator('.reader-image').filter({
        has: page.locator(`img[src$="${object.image.split('/').pop()}"]`),
      });
      for (const value of [
        object.date.label,
        object.caption,
        object.credit,
        object.rights,
      ])
        await expect(figure).toContainText(value);
    }
    const bibliography = page.locator('.reader-bibliography');
    for (const sourceId of citedIds(row)) {
      const source = corpus.sources.find((item) => item.id === sourceId);
      assert.ok(source, sourceId);
      const link = bibliography.locator(`a[href="${source.url}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toContainText(source.title);
      await expect(bibliography).toContainText(source.scope.slice(0, 80));
      await expect(bibliography).toContainText(`Consulted ${source.accessed}`);
    }
    await assertReaderMap(page);
    const pdf = `${out}/${id}.pdf`;
    await page.pdf({
      path: pdf,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
    results.push({ id, readerExport: pdf });
  }
  await context.close();
} finally {
  await browser.close();
}
assert.deepEqual(external, []);
assert.deepEqual(errors, []);

const inspection = spawnSync(
  'python3',
  [
    '-c',
    `
import json, subprocess, sys
from pathlib import Path
from pypdf import PdfReader
out = Path(sys.argv[1])
ids = json.loads(sys.argv[2])
report = []
for ident in ids:
    pdf = out / f"{ident}.pdf"
    reader = PdfReader(str(pdf))
    pages = []
    for index, page in enumerate(reader.pages, start=1):
        box = page.mediabox
        text = page.extract_text() or ""
        pages.append({
            "page": index,
            "width": round(float(box.width), 2),
            "height": round(float(box.height), 2),
            "chars": len(text.strip()),
        })
        if abs(float(box.width) - 612) > 2 or abs(float(box.height) - 792) > 2:
            raise SystemExit(f"{ident} page {index} is not Letter: {box.width} x {box.height}")
        if len(text.strip()) < 40:
            raise SystemExit(f"{ident} page {index} has too little text")
    render = out / ident
    render.mkdir(exist_ok=True)
    done = subprocess.run(["pdftoppm", "-png", "-r", "72", str(pdf), str(render / "page")], check=False)
    if done.returncode != 0:
        raise SystemExit(f"pdftoppm failed for {ident}")
    images = sorted(render.glob("page*.png"))
    if len(images) != len(pages):
        raise SystemExit(f"{ident} rendered {len(images)} images for {len(pages)} pages")
    report.append({"id": ident, "pages": pages, "images": [item.name for item in images]})
print(json.dumps(report))
`,
    out,
    JSON.stringify(ids),
  ],
  { encoding: 'utf8' },
);
if (inspection.status !== 0) {
  throw Error(inspection.stderr || inspection.stdout || 'PDF inspection failed');
}
const pages = JSON.parse(inspection.stdout);
await fs.writeFile(`${out}/results.json`, JSON.stringify({ results, pages }, null, 2));
console.log(
  JSON.stringify(
    pages.map((row) => ({ id: row.id, pages: row.pages.length })),
    null,
    2,
  ),
);

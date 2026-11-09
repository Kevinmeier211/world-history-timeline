/* global document */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import process from 'node:process';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const origin = process.env.ATLAS_URL;
const build = process.env.ATLAS_BUILD_ROOT;
if (!origin || !build)
  throw Error('Set ATLAS_URL and ATLAS_BUILD_ROOT to the frozen candidate.');
const corpusBytes = await fs.readFile(`${build}/atlas/corpus.json`);
const corpus = JSON.parse(corpusBytes);
const revision = createHash('sha256').update(corpusBytes).digest('hex');
const folder = 'output/pdf/chronos-downloads';
await fs.mkdir(folder, { recursive: true });
const jobs = [
  ...[...new Set(corpus.orientations?.map((r) => r.chapter) ?? [])].map((chapter) => ({
    id: `regional-${chapter}`,
    title: `Regional settings: ${corpus.packs.find((p) => p.id === chapter).title}`,
    chapter,
    kind: 'Regional reading companion',
    query: `regional&pack=${chapter}`,
    limit: 5_000_000,
  })),
  ...corpus.subjects.map((s) => ({
    id: `reader-${s.id}`,
    title: s.name,
    chapter: s.packs.join(', '),
    kind: 'Investigation reader',
    query: `reader&subject=${s.id}`,
    limit: 5_000_000,
  })),
  ...corpus.packs.map((p) => ({
    id: `chapter-${p.id}`,
    title: p.title,
    chapter: p.id,
    kind: 'Chapter bundle',
    query: `chapter&pack=${p.id}`,
    limit: 10_000_000,
  })),
  ...corpus.journeys.map((j) => ({
    id: `family-${j.id}`,
    title: j.title,
    chapter: corpus.packs
      .filter(
        (p) => p.journey === j.id || p.investigations?.some((i) => i.journey === j.id),
      )
      .map((p) => p.id)
      .join(', '),
    kind: 'Family investigation sheet',
    query: `family&journey=${j.id}`,
    limit: 2_000_000,
  })),
  ...[
    ['world-overview', 'overview', 'World overview poster', 'A3 landscape'],
    [
      'world-overview-notes',
      'overview-notes',
      'World overview source companion',
      'US Letter portrait',
    ],
    ['chapter-spreads', 'chapter', 'Complete chapter collection', 'US Letter portrait'],
    [
      'family-explorations',
      'family',
      'Complete family sheet collection',
      'US Letter portrait',
    ],
  ].map(([id, query, title, paper]) => ({
    id,
    query,
    title,
    paper,
    chapter: 'All chapters',
    kind: 'Complete collection',
    limit: null,
  })),
];
const idsIndex = process.argv.indexOf('--ids');
const selectedIds =
  idsIndex < 0 ? null : new Set(process.argv[idsIndex + 1].split(','));
const selectedJobs = selectedIds ? jobs.filter((job) => selectedIds.has(job.id)) : jobs;
if (selectedIds && selectedJobs.length !== selectedIds.size) {
  throw Error('Unknown export id');
}
const files = selectedIds
  ? JSON.parse(await fs.readFile(`${folder}/catalog.json`, 'utf8')).files.filter(
      (row) => !selectedIds.has(row.id) && row.kind !== 'Short activity',
    )
  : [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const job of selectedJobs) {
    await page.goto(`${origin}/?print=${job.query}`);
    await page
      .locator(
        /^(reader|regional)/.test(job.query) ? '.reader-print h1' : '.print-page',
      )
      .first()
      .waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => i.decode()));
    });
    await page.emulateMedia({ media: 'print' });
    const paper = job.paper ?? 'US Letter portrait';
    await page.addStyleTag({
      content: `@page{size:${paper.startsWith('A3') ? 'A3 landscape' : 'Letter portrait'};${/^(reader|regional)/.test(job.query) ? '' : 'margin:0'}}`,
    });
    const filename = `${folder}/${job.id}.pdf`;
    await page.evaluate((title) => {
      document.title = title;
    }, job.title);
    await page.pdf({
      path: filename,
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });
    const validation = JSON.parse(
      execFileSync(
        'python3',
        [
          '-c',
          'from pypdf import PdfReader;import json,sys;r=PdfReader(sys.argv[1]);print(json.dumps({"pages":len(r.pages),"textLengths":[len(p.extract_text() or "") for p in r.pages],"tagged":bool(r.trailer["/Root"].get("/StructTreeRoot"))}))',
          filename,
        ],
        { encoding: 'utf8' },
      ),
    );
    if (!validation.pages || validation.textLengths.some((n) => n < 20))
      throw Error(`Blank or unreadable page in ${job.id}`);
    const bytes = await fs.readFile(filename);
    if (job.kind === 'Investigation reader') {
      const subject = corpus.subjects.find((item) => 'reader-' + item.id === job.id);
      const claimBoxes = page.locator('.reader-claims .reader-block');
      if ((await claimBoxes.count()) !== subject.claims.length)
        throw Error('Missing print claims in ' + job.id);
      for (const [index, claim] of subject.claims.entries()) {
        const rendered = await claimBoxes.nth(index).innerText();
        const expected = [
          claim.text,
          claim.uncertainty,
          ...claim.citations.map((ref) => ref.locator),
        ].filter(Boolean);
        if (expected.some((part) => !rendered.includes(part)))
          throw Error('Missing claim or locator in ' + claim.id);
      }
    }
    const row = {
      id: job.id,
      title: job.title,
      chapter: job.chapter,
      kind: job.kind,
      path: `/atlas/exports/${job.id}.pdf`,
      pages: validation.pages,
      bytes: bytes.length,
      paper,
      revision: `4 November 2026 · ${revision.slice(0, 12)}`,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      tagged: validation.tagged,
      budget: job.limit,
      withinBudget: job.limit === null || bytes.length <= job.limit,
      renderReview: 'pending',
      physicalPrint: 'pending',
    };
    files.push(row);
    await fs.copyFile(filename, `public${row.path}`);
    await fs.copyFile(filename, `${build}${row.path}`);
    process.stdout.write(
      `${job.id}: ${row.pages} pages, ${row.bytes} bytes${row.withinBudget ? '' : ' OVER BUDGET'}\n`,
    );
  }
  const short = JSON.parse(
    await fs.readFile('src/atlas/short-print-index.json', 'utf8'),
  );
  for (const row of short) {
    const bytes = await fs.readFile(`public${row.path}`);
    if (createHash('sha256').update(bytes).digest('hex') !== row.sha256)
      throw Error(`Short PDF changed: ${row.chapter}`);
    await fs.copyFile(`public${row.path}`, `${build}${row.path}`);
    files.push({
      ...row,
      id: `short-${row.chapter}`,
      title: `Short starting activity: ${corpus.subjects.find((s) => s.id === row.subject).name}`,
      kind: 'Short activity',
      paper: 'US Letter portrait',
      revision: '4 November 2026',
      budget: 2_000_000,
      withinBudget: row.bytes <= 2_000_000,
      renderReview: '16 pages visually reviewed',
      physicalPrint: 'pending',
    });
  }
  const manifest =
    JSON.stringify(
      { status: 'local_review_candidate', corpusSHA256: revision, files },
      null,
      2,
    ) + '\n';
  for (const path of [
    `${folder}/catalog.json`,
    'public/atlas/exports/catalog.json',
    `${build}/atlas/exports/catalog.json`,
  ])
    await fs.writeFile(path, manifest);
  if (files.some((f) => !f.withinBudget))
    throw Error(
      'One or more downloads exceed their unchanged budget. See catalog.json.',
    );
} finally {
  await browser.close();
}

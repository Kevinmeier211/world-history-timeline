import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { chromium, type Browser, type Page } from 'playwright';

import { logBlocked } from './pdf/blocked.ts';
import {
  boxNear,
  DIST_PRINT,
  paperInches,
  printPath,
  selectJobs,
  viewportPx,
  type PdfJob,
} from './pdf/jobs.ts';
import {
  fontProblems,
  hasSelectableTitle,
  pageSizeOk,
  parsePdfFonts,
  parsePdfInfo,
  type FontRow,
} from './pdf/parse.ts';
import { runTool } from './pdf/run.ts';

const TASK = 'T7.02';
const PORT = Number(process.env.PRINT_PORT ?? '4183');

export interface PdfExportResult {
  file: string;
  bytes: number;
  fonts: FontRow[];
  widthPt: number | null;
  heightPt: number | null;
  pages: number | null;
  selectable: boolean;
  problems: string[];
  blocked: { tool: string; error: string }[];
}

const FONT_SPECS = [
  "600 16px 'Barlow Condensed'",
  "700 16px 'Barlow Condensed'",
  "800 16px 'Barlow Condensed'",
  "400 16px 'Source Sans 3'",
  "600 16px 'Source Sans 3'",
] as const;

function waitFor(url: string): Promise<void> {
  const started = Date.now();
  const tick = (): Promise<void> =>
    fetch(url)
      .then((response) => {
        if (response.ok) return;
        if (Date.now() - started > 60_000)
          throw new Error(`preview did not start at ${url}`);
        return new Promise((resolve) => setTimeout(resolve, 250)).then(tick);
      })
      .catch((error: unknown) => {
        if (Date.now() - started > 60_000) {
          const message = error instanceof Error ? error.message : String(error);
          throw new Error(`preview did not start at ${url}: ${message}`);
        }
        return new Promise((resolve) => setTimeout(resolve, 250)).then(tick);
      });
  return tick();
}

function startPreview(port: number): ChildProcess {
  return spawn(
    'npx',
    ['vite', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
}

function stop(child: ChildProcess | null): void {
  if (!child || child.killed) return;
  child.kill('SIGTERM');
}

async function openSheet(
  page: Page,
  url: string,
): Promise<{ width: number; height: number }> {
  await page.goto(url, { waitUntil: 'load', timeout: 120_000 });
  await page.waitForSelector('svg.stage .ribbon-label', { timeout: 120_000 });
  const loaded = await page.evaluate(
    async (specs) => {
      await Promise.all(specs.map((spec) => document.fonts.load(spec)));
      await document.fonts.ready;
      return specs.map((spec) => `${spec} ${document.fonts.check(spec)}`);
    },
    [...FONT_SPECS],
  );
  console.log(loaded.join('\n'));
  const box = await page.evaluate(() => {
    const node = document.querySelector('.poster-print');
    const rect = node?.getBoundingClientRect();
    return { width: rect?.width ?? 0, height: rect?.height ?? 0 };
  });
  return box;
}

function inspectFile(file: string, job: PdfJob): PdfExportResult {
  const paper = paperInches(job.id, job.bleed);
  const result: PdfExportResult = {
    file,
    bytes: statSync(file).size,
    fonts: [],
    widthPt: null,
    heightPt: null,
    pages: null,
    selectable: false,
    problems: [],
    blocked: [],
  };
  const fonts = runTool('pdffonts', [file]);
  if (!fonts.ok) {
    result.blocked.push({ tool: 'pdffonts', error: fonts.error });
    logBlocked('pdffonts', TASK, fonts.error);
  } else {
    console.log(fonts.stdout.trim());
    result.fonts = parsePdfFonts(fonts.stdout);
    result.problems.push(...fontProblems(result.fonts));
  }
  const info = runTool('pdfinfo', [file]);
  if (!info.ok) {
    result.blocked.push({ tool: 'pdfinfo', error: info.error });
    logBlocked('pdfinfo', TASK, info.error);
  } else {
    console.log(info.stdout.trim());
    const box = parsePdfInfo(info.stdout);
    if (!box) {
      result.problems.push('pdfinfo did not report a page size');
    } else {
      result.widthPt = box.widthPt;
      result.heightPt = box.heightPt;
      result.pages = box.pages;
      if (box.pages !== 1)
        result.problems.push(`expected 1 page, pdfinfo says ${box.pages}`);
      if (!pageSizeOk(box, paper.widthIn, paper.heightIn)) {
        result.problems.push(
          `page ${box.widthPt} x ${box.heightPt} pt, expected ${paper.widthIn} x ${paper.heightIn} in`,
        );
      }
    }
  }
  const text = runTool('pdftotext', ['-q', file, '-']);
  if (!text.ok) {
    result.blocked.push({ tool: 'pdftotext', error: text.error });
    logBlocked('pdftotext', TASK, text.error);
  } else {
    result.selectable = hasSelectableTitle(text.stdout);
    if (!result.selectable) result.problems.push('pdftotext did not find Chronos');
  }
  return result;
}

async function writePdf(
  browser: Browser,
  baseUrl: string,
  job: PdfJob,
): Promise<PdfExportResult> {
  const paper = paperInches(job.id, job.bleed);
  const viewport = viewportPx(paper.widthIn, paper.heightIn);
  const file = path.join(DIST_PRINT, job.file);
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: 'light',
  });
  try {
    await page.emulateMedia({ media: 'print' });
    const box = await openSheet(page, `${baseUrl}${printPath(job.id, job.bleed)}`);
    console.log(
      `${job.id} css box ${box.width.toFixed(1)} x ${box.height.toFixed(1)} px`,
    );
    if (!boxNear(box, paper.widthIn, paper.heightIn)) {
      throw new Error(
        `${job.id} box ${box.width} x ${box.height} px, expected ${viewport.width} x ${viewport.height}`,
      );
    }
    await page.addStyleTag({
      content: `@page { size: ${paper.widthIn}in ${paper.heightIn}in; margin: 0; }`,
    });
    await page.pdf({
      path: file,
      width: `${paper.widthIn}in`,
      height: `${paper.heightIn}in`,
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
  } finally {
    await page.close();
  }
  const inspected = inspectFile(file, job);
  const fontList = inspected.fonts.map(
    (row) => `${row.name} type=${row.type} emb=${row.embedded ? 'yes' : 'no'}`,
  );
  console.log(`${job.file} ${inspected.bytes} bytes`);
  for (const line of fontList) console.log(`  ${line}`);
  for (const problem of inspected.problems) console.error(`  problem: ${problem}`);
  return inspected;
}

export async function exportPdfs(options?: {
  jobs?: readonly PdfJob[];
  baseUrl?: string;
}): Promise<PdfExportResult[]> {
  const jobs = options?.jobs ?? selectJobs([]);
  mkdirSync(DIST_PRINT, { recursive: true });
  const ownServer =
    options?.baseUrl === undefined && process.env.PRINT_URL === undefined;
  let preview: ChildProcess | null = null;
  if (ownServer) {
    execFileSync('npx', ['vite', 'build'], { stdio: 'inherit' });
    preview = startPreview(PORT);
  }
  const baseUrl =
    options?.baseUrl ?? process.env.PRINT_URL ?? `http://127.0.0.1:${PORT}`;
  let browser: Browser | null = null;
  try {
    if (ownServer) await waitFor(`${baseUrl}/`);
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-dev-shm-usage'],
    });
    const results: PdfExportResult[] = [];
    for (const job of jobs) results.push(await writePdf(browser, baseUrl, job));
    return results;
  } finally {
    await browser?.close();
    stop(preview);
  }
}

function invoked(): boolean {
  const file = process.argv[1] ?? '';
  return file.endsWith('export-pdf.ts') || file.endsWith('export-pdf.js');
}

if (invoked()) {
  exportPdfs({ jobs: selectJobs(process.argv.slice(2)) })
    .then((results) => {
      const problems = results.reduce((sum, result) => sum + result.problems.length, 0);
      if (problems > 0) process.exit(1);
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message);
      if (message.includes('ENOENT') || message.includes("Executable doesn't exist")) {
        logBlocked('export:pdf', TASK, message);
      }
      process.exit(1);
    });
}

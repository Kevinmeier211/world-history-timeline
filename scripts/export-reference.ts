import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { chromium, type Browser } from 'playwright';

import { bundledGeography } from '../src/data/catalog.ts';
import { datasetSchema } from '../src/data/schema/index.ts';
import { loadDataset } from './load-dataset.ts';
import { logBlocked } from './pdf/blocked.ts';
import { DIST_PRINT } from './pdf/jobs.ts';
import { pageSizeOk, parsePdfFonts, parsePdfInfo, type FontRow } from './pdf/parse.ts';
import { runTool } from './pdf/run.ts';
import { colophonFor } from './media/credits.ts';
import { referenceHtml, type ReferenceFaces } from './reference/html.ts';
import { referenceFontProblems, referenceTextProblems } from './reference/text.ts';

const TASK = 'T7.05';
const HTML_FILE = 'chronos-reference.html';
const PDF_FILE = 'chronos-reference.pdf';
const LETTER = { widthIn: 8.5, heightIn: 11 };
const FAMILY_NEEDLES = ['BarlowCondensed', 'SourceSans', 'SourceSerif'] as const;

export interface ReferenceExportResult {
  htmlFile: string;
  file: string;
  bytes: number;
  pages: number | null;
  widthPt: number | null;
  heightPt: number | null;
  fonts: FontRow[];
  problems: string[];
}

function faceHref(parts: readonly string[]): string {
  const file = path.join('node_modules', '@fontsource', ...parts);
  if (!existsSync(file)) return '';
  return pathToFileURL(path.resolve(file)).href;
}

function faces(): ReferenceFaces {
  return {
    barlow700: faceHref([
      'barlow-condensed',
      'files',
      'barlow-condensed-latin-700-normal.woff2',
    ]),
    barlow800: faceHref([
      'barlow-condensed',
      'files',
      'barlow-condensed-latin-800-normal.woff2',
    ]),
    sans400: faceHref([
      'source-sans-3',
      'files',
      'source-sans-3-latin-400-normal.woff2',
    ]),
    sans600: faceHref([
      'source-sans-3',
      'files',
      'source-sans-3-latin-600-normal.woff2',
    ]),
    serif600: faceHref([
      'source-serif-4',
      'files',
      'source-serif-4-latin-600-normal.woff2',
    ]),
  };
}

function missingFaces(set: ReferenceFaces): string[] {
  return Object.entries(set)
    .filter((entry) => entry[1].length === 0)
    .map((entry) => `missing font file for ${entry[0]}`);
}

function buildHtml(): { html: string; colophon: string; faceProblems: string[] } {
  const dataset = datasetSchema.parse(loadDataset());
  const set = faces();
  const colophon = colophonFor(
    readFileSync('src/data/media.generated.json', 'utf8'),
    readFileSync('src/data/media-src.json', 'utf8'),
  );
  const html = referenceHtml({
    notes: dataset.notes,
    sources: dataset.sources,
    geography: bundledGeography(),
    colophon,
    faces: set,
  });
  return { html, colophon, faceProblems: missingFaces(set) };
}

function inspect(file: string, colophon: string): ReferenceExportResult {
  const result: ReferenceExportResult = {
    htmlFile: path.join(DIST_PRINT, HTML_FILE),
    file,
    bytes: statSync(file).size,
    pages: null,
    widthPt: null,
    heightPt: null,
    fonts: [],
    problems: [],
  };
  const info = runTool('pdfinfo', [file]);
  if (!info.ok) {
    logBlocked('pdfinfo', TASK, info.error);
    result.problems.push('pdfinfo did not run');
  } else {
    console.log(info.stdout.trim());
    const box = parsePdfInfo(info.stdout);
    if (!box) result.problems.push('pdfinfo did not report a page size');
    else {
      result.pages = box.pages;
      result.widthPt = box.widthPt;
      result.heightPt = box.heightPt;
      if (box.pages < 1) result.problems.push('pdfinfo reported no pages');
      if (!pageSizeOk(box, LETTER.widthIn, LETTER.heightIn)) {
        result.problems.push(
          `page ${box.widthPt} x ${box.heightPt} pt, expected ${LETTER.widthIn} x ${LETTER.heightIn} in`,
        );
      }
    }
  }
  const fonts = runTool('pdffonts', [file]);
  if (!fonts.ok) {
    logBlocked('pdffonts', TASK, fonts.error);
    result.problems.push('pdffonts did not run');
  } else {
    console.log(fonts.stdout.trim());
    result.fonts = parsePdfFonts(fonts.stdout);
    result.problems.push(...referenceFontProblems(result.fonts, FAMILY_NEEDLES));
  }
  const text = runTool('pdftotext', ['-q', file, '-']);
  if (!text.ok) {
    logBlocked('pdftotext', TASK, text.error);
    result.problems.push('pdftotext did not run');
  } else {
    result.problems.push(...referenceTextProblems(text.stdout, colophon));
  }
  return result;
}

async function printPdf(htmlPath: string, pdfPath: string): Promise<void> {
  let browser: Browser | null = null;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-dev-shm-usage'],
    });
    const page = await browser.newPage({
      viewport: { width: 816, height: 1056 },
      deviceScaleFactor: 1,
      colorScheme: 'light',
    });
    try {
      await page.emulateMedia({ media: 'print' });
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await page.pdf({
        path: pdfPath,
        width: `${LETTER.widthIn}in`,
        height: `${LETTER.heightIn}in`,
        printBackground: true,
        preferCSSPageSize: true,
        scale: 1,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
    } finally {
      await page.close();
    }
  } finally {
    await browser?.close();
  }
}

export async function exportReference(): Promise<ReferenceExportResult> {
  const built = buildHtml();
  mkdirSync(DIST_PRINT, { recursive: true });
  const htmlPath = path.join(DIST_PRINT, HTML_FILE);
  const pdfPath = path.join(DIST_PRINT, PDF_FILE);
  writeFileSync(htmlPath, built.html);
  console.log(`${HTML_FILE} ${statSync(htmlPath).size} bytes`);
  for (const problem of built.faceProblems) console.error(`  problem: ${problem}`);
  try {
    await printPdf(htmlPath, pdfPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('ENOENT') || message.includes("Executable doesn't exist")) {
      logBlocked('chromium', TASK, message);
    }
    return {
      htmlFile: htmlPath,
      file: pdfPath,
      bytes: 0,
      pages: null,
      widthPt: null,
      heightPt: null,
      fonts: [],
      problems: [...built.faceProblems, message],
    };
  }
  const inspected = inspect(pdfPath, built.colophon);
  inspected.problems.unshift(...built.faceProblems);
  for (const problem of inspected.problems) console.error(`  problem: ${problem}`);
  return inspected;
}

function invoked(): boolean {
  const file = process.argv[1] ?? '';
  return file.endsWith('export-reference.ts') || file.endsWith('export-reference.js');
}

if (invoked()) {
  exportReference()
    .then((result) => {
      console.log(`${PDF_FILE} ${result.bytes} bytes, pages ${result.pages ?? 'none'}`);
      if (result.problems.length > 0) process.exit(1);
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message);
      process.exit(1);
    });
}

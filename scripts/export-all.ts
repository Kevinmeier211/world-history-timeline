import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { exportPdfs, type PdfExportResult } from './export-pdf.ts';
import { exportReference, type ReferenceExportResult } from './export-reference.ts';
import { checkPdfs } from './check-pdf.ts';
import { logBlocked } from './pdf/blocked.ts';
import {
  DIST_PRINT,
  paperInches,
  PDF_JOBS,
  POSTER_BLEED_JOB,
  type PdfJob,
} from './pdf/jobs.ts';
import {
  manifestJson,
  pageInches,
  printManifest,
  type ManifestEntry,
} from './pdf/manifest.ts';

const TASK = 'T7.06';
const JOBS: readonly PdfJob[] = [...PDF_JOBS, POSTER_BLEED_JOB];

function chartEntry(result: PdfExportResult): ManifestEntry | null {
  if (result.bytes <= 0) return null;
  const job = JOBS.find((item) => result.file.endsWith(item.file));
  const paper = job ? paperInches(job.id, job.bleed) : { widthIn: 0, heightIn: 0 };
  return {
    path: result.file,
    bytes: result.bytes,
    widthIn: pageInches(result.widthPt, paper.widthIn),
    heightIn: pageInches(result.heightPt, paper.heightIn),
    pages: result.pages,
  };
}

function referenceEntry(result: ReferenceExportResult): ManifestEntry | null {
  if (result.bytes <= 0) return null;
  return {
    path: result.file,
    bytes: result.bytes,
    widthIn: pageInches(result.widthPt, 8.5),
    heightIn: pageInches(result.heightPt, 11),
    pages: result.pages,
  };
}

export async function exportAll(): Promise<number> {
  let charts: PdfExportResult[] = [];
  let chartProblems = 0;
  try {
    charts = await exportPdfs({ jobs: JOBS });
    chartProblems = charts.reduce((sum, result) => sum + result.problems.length, 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    chartProblems += 1;
    console.error(message);
    if (message.includes('ENOENT') || message.includes("Executable doesn't exist")) {
      logBlocked('export:pdf', TASK, message);
    }
  }

  const reference = await exportReference();
  const files = [...charts.map(chartEntry), referenceEntry(reference)].filter(
    (entry): entry is ManifestEntry => entry !== null,
  );
  const generatedAt = new Date().toISOString();
  mkdirSync(DIST_PRINT, { recursive: true });
  const manifestPath = path.join(DIST_PRINT, 'manifest.json');
  writeFileSync(manifestPath, manifestJson(printManifest(generatedAt, files)));
  console.log(`${manifestPath} ${generatedAt} files ${files.length}`);
  const checked = checkPdfs([]);
  return chartProblems + reference.problems.length + checked;
}

function invoked(): boolean {
  const file = process.argv[1] ?? '';
  return file.endsWith('export-all.ts') || file.endsWith('export-all.js');
}

if (invoked()) {
  exportAll()
    .then((problems) => {
      if (problems > 0) process.exit(1);
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message);
      process.exit(1);
    });
}

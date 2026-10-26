import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { assessPdf } from './pdf/assess.ts';
import { logBlocked } from './pdf/blocked.ts';
import {
  DIST_PRINT,
  paperInches,
  PDF_JOBS,
  POSTER_BLEED_JOB,
  type PdfJob,
} from './pdf/jobs.ts';
import { MIN_STROKE_PT, parsePdfObjects } from './pdf/strokes.ts';
import { runTool } from './pdf/run.ts';

const TASK = 'T7.04';

interface CheckTarget {
  file: string;
  widthIn: number;
  heightIn: number;
  enforceStroke: boolean;
}

function targetFor(job: PdfJob): CheckTarget {
  const paper = paperInches(job.id, job.bleed);
  return {
    file: path.join(DIST_PRINT, job.file),
    widthIn: paper.widthIn,
    heightIn: paper.heightIn,
    enforceStroke: job.id === 'poster',
  };
}

function targets(names: readonly string[]): CheckTarget[] {
  const jobs = names.length === 0 ? [...PDF_JOBS, POSTER_BLEED_JOB] : null;
  if (jobs) return jobs.map(targetFor);
  return names.map((name) => {
    const known = [...PDF_JOBS, POSTER_BLEED_JOB].find(
      (job) => job.file === path.basename(name) || job.key === name,
    );
    if (known) return targetFor(known);
    return { file: name, widthIn: 0, heightIn: 0, enforceStroke: true };
  });
}

function checkOne(target: CheckTarget): string[] {
  if (!existsSync(target.file)) return [`missing ${target.file}`];
  const info = runTool('pdfinfo', [target.file]);
  const fonts = runTool('pdffonts', [target.file]);
  const images = runTool('pdfimages', ['-list', target.file]);
  if (!info.ok) logBlocked('pdfinfo', TASK, info.error);
  if (!fonts.ok) logBlocked('pdffonts', TASK, fonts.error);
  if (!images.ok) logBlocked('pdfimages', TASK, images.error);
  const objects =
    target.widthIn > 0 ? parsePdfObjects(readFileSync(target.file)) : null;
  const result = assessPdf({
    infoText: info.ok ? info.stdout : null,
    fontText: fonts.ok ? fonts.stdout : null,
    imageText: images.ok ? images.stdout : null,
    objects,
    widthIn: target.widthIn,
    heightIn: target.heightIn,
    enforceStroke: target.enforceStroke,
  });
  const min =
    result.minStrokePt === null ? 'none' : `${result.minStrokePt.toFixed(3)} pt`;
  const floor = target.enforceStroke
    ? `floor ${MIN_STROKE_PT} pt`
    : 'floor not applied';
  console.log(
    `${target.file}: fonts ${result.fontCount} images ${result.imageCount} strokes ${result.strokeCount} min ${min} (${floor})`,
  );
  for (const problem of result.problems) console.error(`  problem: ${problem}`);
  return result.problems;
}

function invoked(): boolean {
  const file = process.argv[1] ?? '';
  return file.endsWith('check-pdf.ts') || file.endsWith('check-pdf.js');
}

export function checkPdfs(names: readonly string[]): number {
  const problems = targets(names).flatMap(checkOne);
  return problems.length;
}

if (invoked()) {
  const count = checkPdfs(process.argv.slice(2));
  if (count > 0) process.exit(1);
}

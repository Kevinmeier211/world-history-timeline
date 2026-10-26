import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

/** Chart thumbnail caps from the image spec. */
export const THUMB_TOTAL_MAX = Math.round(1.2 * 1024 * 1024);
export const THUMB_EACH_MAX = 10 * 1024;

export interface ThumbStat {
  name: string;
  bytes: number;
}

/** A thumbnail is a 128px AVIF or WebP. Larger derivatives are not the chart payload. */
export function isThumbnail(name: string): boolean {
  return /(?:^|[-_/])128\.(?:webp|avif)$/i.test(name);
}

export function assessBudget(files: readonly ThumbStat[]): {
  ok: boolean;
  total: number;
  failures: string[];
} {
  const failures: string[] = [];
  let total = 0;
  for (const file of files) {
    total += file.bytes;
    if (file.bytes > THUMB_EACH_MAX)
      failures.push(`${file.name} is ${file.bytes} bytes`);
  }
  if (total > THUMB_TOTAL_MAX) failures.push(`total is ${total} bytes`);
  return { ok: failures.length === 0, total, failures };
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** Thumbnails under `dir`. A missing directory is an empty set. */
export function thumbStats(dir: string): ThumbStat[] {
  let names: string[] = [];
  try {
    names = walk(dir);
  } catch {
    return [];
  }
  return names
    .filter((name) => isThumbnail(name))
    .map((name) => ({ name, bytes: statSync(name).size }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

const invoked =
  process.argv[1]?.endsWith('budget.ts') || process.argv[1]?.endsWith('budget.js');

if (invoked) {
  const files = thumbStats('public/media');
  const report = assessBudget(files);
  if (files.length === 0) {
    console.log('media:budget: 0 thumbnails. Gated: no image files are shipped.');
  } else if (!report.ok) {
    for (const failure of report.failures) console.error(`media:budget: ${failure}`);
    process.exit(1);
  } else {
    console.log(`media:budget: ${files.length} thumbnails, ${report.total} bytes.`);
  }
}

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { bundledDataset } from '../src/data/catalog.ts';

const ROOT = 'src/data';

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function readCollection(dir: string): unknown[] {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const files = readdirSync(abs)
    .filter((name) => name.endsWith('.json'))
    .sort();
  const rows: unknown[] = [];
  for (const name of files) {
    const file = path.join(abs, name);
    if (!statSync(file).isFile()) continue;
    const parsed = readJson(file);
    if (!Array.isArray(parsed)) throw new Error(`${file} must be a JSON array`);
    rows.push(...parsed);
  }
  return rows;
}

function readFileArray(file: string): unknown[] {
  const abs = path.join(ROOT, file);
  if (!existsSync(abs)) return [];
  const parsed = readJson(abs);
  if (!Array.isArray(parsed)) throw new Error(`${abs} must be a JSON array`);
  return parsed;
}

export function loadRoots(): unknown[] {
  return readCollection('roots');
}

export function loadDataset(): unknown {
  const base = bundledDataset();
  return {
    ...base,
    polities: readCollection('polities'),
    relations: readCollection('relations'),
    callouts: readCollection('callouts'),
    bands: readCollection('bands'),
    routes: readCollection('routes'),
    notes: readCollection('notes'),
    tours: readCollection('tours'),
    presets: readFileArray('presets.json'),
    sources: readFileArray('sources.json'),
    media: readFileArray('media.json'),
  };
}

import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { z } from 'zod';

import {
  bandSchema,
  calloutSchema,
  climateCurveSchema,
  presetSchema,
  routeSchema,
  tourSchema,
} from '../src/data/schema/index.ts';
import {
  migrateBand,
  migrateClimate,
  migrateNode,
  migratePreset,
  migrateRoute,
  migrateTour,
  type V1Band,
  type V1ClimatePoint,
  type V1Node,
  type V1Preset,
  type V1Route,
  type V1Tour,
} from './migrate-v1-notes.ts';
import type { V1Polity } from './migrate-v1-map.ts';

function gitShow(spec: string): string {
  return execFileSync('git', ['show', spec], { encoding: 'utf8' });
}

function stripImport(source: string): string {
  return source.replace(/^import\s+\{[\s\S]*?\}\s+from\s+['"][^'"]+['"];\r?\n/, '');
}

function resetJson(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.json')) unlinkSync(path.join(dir, name));
  }
}

function writeChunks(dir: string, rows: unknown[], perFile: number): void {
  resetJson(dir);
  for (let index = 0; index < rows.length; index += perFile) {
    const chunk = rows.slice(index, index + perFile);
    const name = `migrated-${String(index / perFile + 1).padStart(2, '0')}.json`;
    writeFileSync(path.join(dir, name), `${JSON.stringify(chunk, null, 2)}\n`);
  }
}

const root = mkdtempSync(path.join(tmpdir(), 'gemini-v1-notes-'));
try {
  const dataDir = path.join(root, 'src/data');
  mkdirSync(dataDir, { recursive: true });
  for (const file of [
    'historicalNodes.ts',
    'regionsAndEras.ts',
    'politiesWest.ts',
    'politiesEast.ts',
  ]) {
    writeFileSync(
      path.join(dataDir, file),
      stripImport(gitShow(`gemini-v1:src/data/${file}`)),
    );
  }
  const nodesMod = (await import(
    pathToFileURL(path.join(dataDir, 'historicalNodes.ts')).href
  )) as {
    HISTORICAL_NODES: V1Node[];
  };
  const eras = (await import(
    pathToFileURL(path.join(dataDir, 'regionsAndEras.ts')).href
  )) as {
    CROSS_CUTTING_BANDS: V1Band[];
    TRADE_AND_MIGRATION_ROUTES: V1Route[];
    STORY_TOURS: V1Tour[];
    COMPARISON_PRESETS: V1Preset[];
    PALEOCLIMATE_CURVE: V1ClimatePoint[];
  };
  const west = (await import(
    pathToFileURL(path.join(dataDir, 'politiesWest.ts')).href
  )) as {
    POLITIES_WEST: V1Polity[];
  };
  const east = (await import(
    pathToFileURL(path.join(dataDir, 'politiesEast.ts')).href
  )) as {
    POLITIES_EAST: V1Polity[];
  };
  const polityIds = new Set(
    [...west.POLITIES_WEST, ...east.POLITIES_EAST].map((polity) => polity.id),
  );
  const callouts = z
    .array(calloutSchema)
    .parse(nodesMod.HISTORICAL_NODES.map((node) => migrateNode(node, polityIds)));
  const bands = z.array(bandSchema).parse(eras.CROSS_CUTTING_BANDS.map(migrateBand));
  const routes = z
    .array(routeSchema)
    .parse(eras.TRADE_AND_MIGRATION_ROUTES.map(migrateRoute));
  const tours = z.array(tourSchema).parse(eras.STORY_TOURS.map(migrateTour));
  const presets = z
    .array(presetSchema)
    .parse(eras.COMPARISON_PRESETS.map(migratePreset));
  const climate = climateCurveSchema.parse(migrateClimate(eras.PALEOCLIMATE_CURVE));
  writeChunks('src/data/callouts', callouts, 15);
  writeChunks('src/data/bands', bands, 11);
  writeChunks('src/data/routes', routes, 9);
  writeChunks('src/data/tours', tours, 3);
  writeFileSync('src/data/presets.json', `${JSON.stringify(presets, null, 2)}\n`);
  writeFileSync('src/data/climate.json', `${JSON.stringify(climate, null, 2)}\n`);
  console.log(
    `migrate-v1-annotations callouts ${callouts.length}, bands ${bands.length}, routes ${routes.length}, tours ${tours.length}, presets ${presets.length}, climate ${climate.points.length}`,
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}

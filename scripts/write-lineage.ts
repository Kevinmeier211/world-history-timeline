import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { POLITIES_EAST } from '../src/data/politiesEast.ts';
import { POLITIES_WEST } from '../src/data/politiesWest.ts';
import { buildLineage, CHECKLIST_TWINS } from '../src/data/lineage.ts';
import { datasetSchema, type Polity } from '../src/data/schema/index.ts';
import { loadDataset } from './load-dataset.ts';

function chunk<T>(rows: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < rows.length; index += size) {
    chunks.push(rows.slice(index, index + size));
  }
  return chunks;
}

function writeChunks(
  dir: string,
  prefix: string,
  rows: readonly unknown[],
  size: number,
): void {
  mkdirSync(dir, { recursive: true });
  const pattern = new RegExp(`^${prefix}-\\d+\\.json$`);
  for (const name of readdirSync(dir)) {
    if (pattern.test(name)) unlinkSync(path.join(dir, name));
  }
  chunk(rows, size).forEach((part, index) => {
    const file = path.join(dir, `${prefix}-${String(index + 1).padStart(2, '0')}.json`);
    const body = `${JSON.stringify(part, null, 2)}\n`;
    const lines = body.split('\n').length;
    if (lines > 400) throw new Error(`${file} is ${lines} lines`);
    writeFileSync(file, body);
  });
}

const dataset = datasetSchema.parse(loadDataset());
const polities = dataset.polities.map((polity: Polity) => ({
  id: polity.id,
  family: polity.family,
  start: polity.start,
  end: polity.end,
  sourceIds: polity.sourceIds,
  overlay: polity.dateNote?.includes('Migrated from gemini-v1') ?? false,
  clusterStart: polity.dateNote?.includes('gives no single year') ?? false,
}));
const parents = [...POLITIES_WEST, ...POLITIES_EAST].map((polity) => ({
  id: polity.id,
  parentIds: polity.parentIds,
}));
const built = buildLineage(polities, parents, CHECKLIST_TWINS);
writeChunks('src/data/relations', 'lineage', built.relations, 12);
writeChunks('src/data/roots', 'roots', built.roots, 24);

const familyOf = new Map(polities.map((polity) => [polity.id, polity.family]));
const crossFamily = built.relations.filter((item) => {
  const families = new Set(
    [...item.from, ...item.to]
      .map((id) => familyOf.get(id))
      .filter((id) => id !== undefined),
  );
  return families.size > 1;
});
const counts = new Map<string, number>();
for (const item of built.relations)
  counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
console.log(
  JSON.stringify(
    {
      relations: built.relations.length,
      roots: built.roots.length,
      crossFamily: crossFamily.length,
      types: Object.fromEntries(counts),
      skipped: built.skippedParents,
    },
    null,
    2,
  ),
);

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { migratePolity, type V1Polity } from './migrate-v1-map.ts';

function gitShow(spec: string): string {
  return execFileSync('git', ['show', spec], { encoding: 'utf8' });
}

const root = mkdtempSync(path.join(tmpdir(), 'gemini-v1-'));
try {
  const dataDir = path.join(root, 'src/data');
  mkdirSync(dataDir, { recursive: true });
  for (const file of ['politiesWest.ts', 'politiesEast.ts']) {
    const source = gitShow(`gemini-v1:src/data/${file}`).replace(
      /^import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];\r?\n/,
      '',
    );
    writeFileSync(path.join(dataDir, file), source);
  }
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
  const polities = [...west.POLITIES_WEST, ...east.POLITIES_EAST].map(migratePolity);
  const byFamily = new Map<string, ReturnType<typeof migratePolity>[]>();
  for (const polity of polities) {
    const list = byFamily.get(polity.family) ?? [];
    list.push(polity);
    byFamily.set(polity.family, list);
  }
  const outDir = path.join('src/data/polities');
  mkdirSync(outDir, { recursive: true });
  for (const [family, rows] of [...byFamily.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    rows.sort((a, b) => a.start - b.start || a.id.localeCompare(b.id));
    writeFileSync(
      path.join(outDir, `${family}.json`),
      `${JSON.stringify(rows, null, 2)}\n`,
    );
  }
  console.log(
    `migrate-v1 wrote ${polities.length} polities in ${byFamily.size} family files`,
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}

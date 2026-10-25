import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { isLegacyDesignPath, lintDesignSource } from '../src/lint/designRules.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const EXTENSIONS = new Set(['.css', '.tsx', '.ts', '.html']);

function filesUnder(entry: string): string[] {
  const abs = path.join(ROOT, entry);
  const stat = statSync(abs);
  if (stat.isFile()) return [entry];
  const out: string[] = [];
  for (const name of readdirSync(abs)) {
    const rel = path.join(entry, name);
    const child = statSync(path.join(ROOT, rel));
    if (child.isDirectory()) {
      if (name === 'node_modules' || name === '__fixtures__') continue;
      out.push(...filesUnder(rel));
    } else if (EXTENSIONS.has(path.extname(name))) {
      out.push(rel);
    }
  }
  return out;
}

const violations = filesUnder('src')
  .concat(filesUnder('index.html'))
  .filter((file) => !isLegacyDesignPath(file))
  .filter((file) => !file.endsWith('.test.ts') && !file.endsWith('.test.tsx'))
  .flatMap((file) =>
    lintDesignSource(file, readFileSync(path.join(ROOT, file), 'utf8')),
  );

if (violations.length === 0) {
  console.log('design:lint ok');
  process.exit(0);
}

for (const hit of violations) {
  console.error(`${hit.file}:${hit.line} ${hit.rule} ${hit.message}`);
}
console.error(`design:lint failed (${violations.length})`);
process.exit(1);

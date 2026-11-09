/* global fetch */
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import console from 'node:console';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';
import assert from 'node:assert/strict';

const origin = process.env.ATLAS_URL;
assert(origin && new URL(origin).hostname === '127.0.0.1', 'Local ATLAS_URL required');
const out = process.env.ATLAS_OUTPUT_DIR ?? 'output/accessibility-2026-11-05';
await fs.mkdir(out, { recursive: true });
async function hash(path) {
  const response = await fetch(new URL(path, origin));
  assert(response.ok, path);
  return createHash('sha256')
    .update(Buffer.from(await response.arrayBuffer()))
    .digest('hex');
}
const html = await (await fetch(origin)).text();
const scripts = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(
  (m) => m[1],
);
const paths = [...scripts, '/atlas/corpus.json', '/atlas/index.json'];
const initial = Object.fromEntries(
  await Promise.all(paths.map(async (path) => [path, await hash(path)])),
);
const results = [];
for (const engine of ['chromium', 'firefox', 'webkit']) {
  for (const script of [
    'notebook-browser.mjs',
    'learning-browser.mjs',
    'accessibility-browser.mjs',
  ]) {
    console.log(`${engine}: ${script}`);
    const result = spawnSync(process.execPath, [`scripts/completion/${script}`], {
      stdio: 'inherit',
      env: { ...process.env, ATLAS_ENGINE: engine, ATLAS_OUTPUT_DIR: out },
    });
    results.push({
      engine,
      script,
      status: result.status,
      error: result.error?.message,
      signal: result.signal,
    });
    await fs.writeFile(
      `${out}/cross-engine.json`,
      JSON.stringify({ build: initial, results }, null, 2) + '\n',
    );
  }
}
const zoom = spawnSync(process.execPath, ['scripts/completion/browser-zoom.mjs'], {
  stdio: 'inherit',
  env: { ...process.env, ATLAS_OUTPUT_DIR: out },
});
results.push({
  engine: 'chromium',
  script: 'browser-zoom.mjs',
  status: zoom.status,
  error: zoom.error?.message,
  signal: zoom.signal,
});
const final = Object.fromEntries(
  await Promise.all(paths.map(async (path) => [path, await hash(path)])),
);
await fs.writeFile(
  `${out}/cross-engine.json`,
  JSON.stringify({ build: initial, finalBuild: final, results }, null, 2) + '\n',
);
assert.deepEqual(final, initial, 'Build changed during cross-engine checks');
assert(
  results.every((r) => r.status === 0 && !r.error && !r.signal),
  'Review failed suites in cross-engine.json',
);

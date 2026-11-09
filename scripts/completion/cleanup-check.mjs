import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import assert from 'node:assert/strict';
import net from 'node:net';
import { URL } from 'node:url';
const out = path.resolve('output/completion-2026-11-04/cleanup');
await fs.mkdir(out, { recursive: true });
const preload = path.resolve('scripts/completion/inject-browser-failure.mjs');
const targets = [
  'candidate-browser.mjs',
  'notebook-checks.mjs',
  'glossary-checks.mjs',
  'portable-smoke.mjs',
  'export-print.mjs',
  'performance.mjs',
  'chapter-checks.mjs',
  'inspect-pilot.mjs',
  'expansion-checks.mjs',
  'pilot-checks.mjs',
  'baseline-browser.mjs',
  'reading-checks.mjs',
  'run-browser-suite.mjs',
];
const results = [];
for (const script of targets) {
  const marker = path.join(out, script + '.marker');
  await fs.writeFile(marker, '');
  const result = spawnSync(
    process.execPath,
    ['--import', preload, 'scripts/redesign/' + script],
    {
      env: {
        ...process.env,
        ATLAS_URL: process.env.ATLAS_URL,
        ATLAS_BUILD_ROOT: 'output/completion-2026-11-04/candidate',
        ATLAS_REPORT_DIR: path.join(out, script),
        CHRONOS_CLEANUP_MARKER: marker,
        NODE_OPTIONS: '--import ' + JSON.stringify(preload),
      },
      encoding: 'utf8',
      timeout: 45000,
    },
  );
  const events = await fs.readFile(marker, 'utf8');
  await fs.writeFile(path.join(out, script + '.log'), result.stdout + result.stderr);
  assert.ok(
    result.status !== 0 && !result.signal,
    script + ': expected a normal failing exit',
  );
  assert.ok(
    (result.stdout + result.stderr).includes('CHRONOS_INJECTED_NAVIGATION_FAILURE'),
    script + ': failed before the injected navigation',
  );
  assert.equal(events, 'launched\nclosed\n', script + ': browser did not close');
  if (script === 'run-browser-suite.mjs') {
    const origin = result.stdout.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    assert.ok(origin);
    const url = new URL(origin);
    await new Promise((resolve, reject) => {
      const socket = net.connect(Number(url.port), url.hostname);
      socket.once('connect', () => {
        socket.destroy();
        reject(Error('Isolated server still accepts connections'));
      });
      socket.once('error', (error) =>
        error.code === 'ECONNREFUSED' ? resolve() : reject(error),
      );
    });
  }
  results.push({
    script,
    result: 'pass',
    injectedFailure: true,
    browserClosed: true,
    serverClosed: script === 'run-browser-suite.mjs' ? true : undefined,
  });
}
await fs.writeFile(path.join(out, 'receipt.json'), JSON.stringify(results, null, 2));

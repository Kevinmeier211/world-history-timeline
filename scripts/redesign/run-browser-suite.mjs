import { URL } from 'node:url';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const root = path.resolve(process.env.ATLAS_BUILD_ROOT ?? 'dist');
const report = path.resolve(
  process.env.ATLAS_REPORT_DIR ?? 'output/current-candidate/browser',
);
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};
const index = await fs.readFile(path.join(root, 'index.html'));
const compiled = await fs.readFile(path.join(root, 'atlas/corpus.json'));
const current = await fs.readFile('public/atlas/corpus.json');
if (!compiled.equals(current))
  throw Error('dist content is stale; run npm run build before browser verification');
for (const name of ['index.json', 'source-records.json']) {
  const built = await fs.readFile(path.join(root, 'atlas', name));
  const authored = await fs.readFile(path.join('public/atlas', name));
  if (!built.equals(authored))
    throw Error(
      `${name} in dist is stale; run npm run build before browser verification`,
    );
}
const server = http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, `.${name === '/' ? '/index.html' : name}`);
    if (!file.startsWith(`${root}${path.sep}`)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const bytes = await fs.readFile(file);
    const compress =
      /gzip/.test(req.headers['accept-encoding'] ?? '') &&
      ['.html', '.js', '.css', '.json', '.svg'].includes(path.extname(file));
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      ...(compress ? { 'Content-Encoding': 'gzip' } : {}),
    });
    res.end(compress ? gzipSync(bytes) : bytes);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}`;
await fs.mkdir(report, { recursive: true });
const checks = process.argv.includes('--axe-only')
  ? [['candidate-browser.mjs', '--axe-only']]
  : [
      ['candidate-browser.mjs'],
      ['atlas-frames-checks.mjs'],
      ['atlas-compare-checks.mjs'],
      ['atlas-dossier-context-checks.mjs'],
      ['visual-exploration-checks.mjs'],
      ['citizenship-checks.mjs'],
      ['early-cities-checks.mjs'],
      ['bronze-institutions-checks.mjs'],
      ['government-work-checks.mjs'],
      ['exchange-checks.mjs'],
      ['learning-checks.mjs'],
      ['bibliography-loader-checks.mjs'],
      ['obligations-checks.mjs'],
      ['encounters-checks.mjs'],
      ['households-checks.mjs'],
      ['coasts-checks.mjs'],
      ['reference-loading-checks.mjs'],
      ['journey-loading-checks.mjs'],
      ['media-loading-checks.mjs'],
      ['inspection-fit-checks.mjs'],
      ['institutions-checks.mjs'],
      ['images-work-checks.mjs'],
      ['regional-contexts-checks.mjs'],
      ['places-patrons-checks.mjs'],
      ['communities-checks.mjs'],
      ['workshops-checks.mjs'],
      ['cities-checks.mjs'],
      ['pacific-exchange-checks.mjs'],
      ['industry-work-checks.mjs'],
      ['glossary-checks.mjs'],
      ['family-evidence-checks.mjs'],
      ['release-browser.mjs'],
      ['reading-checks.mjs'],
      ['notebook-checks.mjs'],
      ['expansion-checks.mjs', 'expansion'],
      ['expansion-checks.mjs', 'northern'],
      ['expansion-checks.mjs', 'woodlands'],
      ['reading-repairs-checks.mjs'],
      ['export-print.mjs'],
      ['poster-checks.mjs'],
      ['performance.mjs'],
      ['verify-media.mjs'],
    ];
const from = process.argv.indexOf('--from');
const variantIndex = process.argv.indexOf('--variant');
const variant = variantIndex < 0 ? undefined : process.argv[variantIndex + 1];
const start =
  from < 0
    ? 0
    : checks.findIndex(
        ([name, argument]) =>
          name === process.argv[from + 1] && (!variant || argument === variant),
      );
if (start < 0) {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  throw Error('Unknown --from check');
}
const selectedChecks = checks.slice(start);
try {
  for (const [script, ...args] of selectedChecks) {
    process.stdout.write(
      `Checking ${script} ${args.join(' ')} against isolated preview ${url}\n`,
    );
    await new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [path.join('scripts/redesign', script), ...args],
        {
          stdio: 'inherit',
          env: { ...process.env, ATLAS_URL: url, ATLAS_REPORT_DIR: report },
        },
      );
      child.on('error', reject);
      child.on('exit', (code) =>
        code === 0 ? resolve() : reject(Error(`${script} exited ${code}`)),
      );
    });
  }
  await fs.writeFile(
    path.join(report, 'suite.json'),
    JSON.stringify(
      {
        result: 'pass',
        indexSHA256: createHash('sha256').update(index).digest('hex'),
        corpusSHA256: createHash('sha256').update(compiled).digest('hex'),
        checks: selectedChecks,
        partialRun: start > 0,
        checkedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}

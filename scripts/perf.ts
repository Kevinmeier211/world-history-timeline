import { spawn, type ChildProcess } from 'node:child_process';

import { chromium, type Page } from 'playwright';

import { percentile } from '../src/render/bench.ts';

const PORT = 5199;
const FRAME_BUDGET_MS = 20;
const MIN_RIBBONS = 300;

function waitForServer(url: string): Promise<void> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      fetch(url)
        .then((response) => {
          if (response.ok) resolve();
          else if (Date.now() - started > 30_000)
            reject(new Error('preview did not start'));
          else setTimeout(tick, 200);
        })
        .catch(() => {
          if (Date.now() - started > 30_000) reject(new Error('preview did not start'));
          else setTimeout(tick, 200);
        });
    };
    tick();
  });
}

const PAN_SCRIPT = `new Promise(function (resolve) {
  var scroller = document.querySelector('.poster-scroll');
  if (!(scroller instanceof HTMLElement)) { resolve([]); return; }
  var samples = [];
  var last = performance.now();
  var frame = 0;
  var max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
  var tick = function (now) {
    samples.push(now - last);
    last = now;
    scroller.scrollTop = ((frame % 80) / 80) * max;
    frame += 1;
    if (frame < 150) requestAnimationFrame(tick);
    else resolve(samples);
  };
  requestAnimationFrame(tick);
})`;

async function frameSamples(page: Page): Promise<number[]> {
  const pan = page.evaluate((source) => {
    return eval(source) as Promise<number[]>;
  }, PAN_SCRIPT);
  for (let i = 0; i < 4; i += 1) {
    await page.waitForTimeout(280);
    const name = i % 2 === 0 ? 'Zoom in' : 'Zoom out';
    await page.getByRole('button', { name, exact: true }).click();
  }
  const samples = await pan;
  return samples.slice(1);
}

async function main(): Promise<void> {
  const server: ChildProcess = spawn(
    'npx',
    ['vite', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { stdio: 'ignore' },
  );
  const browser = await chromium.launch({ headless: true });
  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://127.0.0.1:${PORT}/?bench=${MIN_RIBBONS}`, {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForSelector('svg.stage');
    await page.waitForTimeout(300);
    const roster = await page.locator('.stage-host').getAttribute('data-ribbon-count');
    const count = Number(roster);
    await page.getByRole('button', { name: 'Overview', exact: true }).click();
    await page.waitForTimeout(200);
    const mounted = await page.locator('.ribbon').count();
    const samples = await frameSamples(page);
    const p95 = percentile(samples, 0.95);
    const worst = percentile(samples, 1);
    console.log(
      `perf: ribbons ${count} mounted ${mounted} frames ${samples.length} p95 ${p95.toFixed(2)} ms worst ${worst.toFixed(2)} ms`,
    );
    if (count < MIN_RIBBONS || mounted < MIN_RIBBONS) {
      console.error(`perf: expected at least ${MIN_RIBBONS} ribbons`);
      process.exitCode = 1;
      return;
    }
    if (p95 > FRAME_BUDGET_MS) {
      console.error(`perf: p95 ${p95.toFixed(2)} ms exceeds ${FRAME_BUDGET_MS} ms`);
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
    server.kill('SIGTERM');
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

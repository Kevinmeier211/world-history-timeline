import process from 'node:process';
/* global document, console */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const root = process.env.ATLAS_URL ?? 'http://127.0.0.1:4173';
const out = process.env.ATLAS_REPORT_DIR
  ? `${process.env.ATLAS_REPORT_DIR}/print`
  : 'output/redesign/print';
const buildRoot = process.env.ATLAS_BUILD_ROOT ?? 'dist';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await fs.mkdir('public/atlas/exports', { recursive: true });
  await fs.mkdir(out, { recursive: true });
  await fs.mkdir(`${buildRoot}/atlas/exports`, { recursive: true });
  const results = [];
  for (const [name, query, paper] of [
    ['world-overview', 'overview', 'A3'],
    ['world-overview-notes', 'overview-notes', 'Letter'],
    ['chapter-spreads', 'chapter', 'Letter'],
    ['family-explorations', 'family', 'Letter'],
  ]) {
    await page.goto(`${root}/?print=${query}`);
    await page.locator('.print-page').first().waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => i.decode()));
    });
    await page.emulateMedia({ media: 'print' });
    await page.addStyleTag({
      content: `@page{size:${paper} ${paper === 'A3' ? 'landscape' : 'portrait'};margin:0}`,
    });
    const bounds = await page.locator('.print-page').evaluateAll((es) =>
      es.map((e) => ({
        // Avoid accumulated document-offset rounding in long chapter exports.
        height: parseFloat(e.ownerDocument.defaultView.getComputedStyle(e).height),
        width: parseFloat(e.ownerDocument.defaultView.getComputedStyle(e).width),
        boxSizing: e.ownerDocument.defaultView.getComputedStyle(e).boxSizing,
        transform: e.ownerDocument.defaultView.getComputedStyle(e).transform,
        title: e.querySelector('h1')?.textContent,
      })),
    );
    const expectedHeight = paper === 'A3' ? 1122.6 : 1056;
    const overflow = bounds
      .map((b, i) => ({ ...b, page: i + 1 }))
      .filter(
        (b) =>
          !Number.isFinite(b.height) ||
          !Number.isFinite(b.width) ||
          b.boxSizing !== 'border-box' ||
          b.transform !== 'none' ||
          b.height > expectedHeight + 0.5,
      );
    if (overflow.length)
      throw Error(
        `${name}: print composition overflows its page: ${JSON.stringify(overflow)}`,
      );
    results.push({ name, paper, compositions: bounds });
    await page.pdf({
      path: `public/atlas/exports/${name}.pdf`,
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });
    await fs.copyFile(`public/atlas/exports/${name}.pdf`, `${out}/${name}.pdf`);
    await fs.copyFile(
      `public/atlas/exports/${name}.pdf`,
      `${buildRoot}/atlas/exports/${name}.pdf`,
    );
    const published = await fs.readFile(`public/atlas/exports/${name}.pdf`);
    const built = await fs.readFile(`${buildRoot}/atlas/exports/${name}.pdf`);
    const reported = await fs.readFile(`${out}/${name}.pdf`);
    if (!published.equals(built) || !published.equals(reported))
      throw Error(`${name}: public, dist and report PDF bytes differ`);
  }
  await fs.writeFile(
    `${out}/export-measurements.json`,
    JSON.stringify(results, null, 2),
  );
  console.log(
    JSON.stringify(
      results.map((r) => ({ name: r.name, pages: r.compositions.length })),
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}

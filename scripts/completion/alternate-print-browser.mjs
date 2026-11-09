/* global document */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';

const origin = process.env.ATLAS_URL;
if (!origin) throw Error('ATLAS_URL required');
const corpus = JSON.parse(await fs.readFile('public/atlas/corpus.json', 'utf8'));
const media = new Map(corpus.media.map((row) => [row.id, row]));
const subjects = corpus.subjects.filter((subject) =>
  subject.objectIds.some((id) => media.get(id).additionalImages?.length),
);
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage();
  for (const subject of subjects) {
    const objects = subject.objectIds.map((id) => media.get(id));
    const alternateCount = objects.reduce(
      (total, object) => total + (object.additionalImages?.length ?? 0),
      0,
    );
    await page.goto(`${origin}/?print=reader&subject=${subject.id}`);
    await expect(page.locator('.reader-print h1')).toHaveText(subject.name);
    await expect(page.locator('.reader-image img')).toHaveCount(
      objects.length + alternateCount,
    );
    await page.evaluate(async () => {
      await Promise.all([...document.images].map((image) => image.decode()));
    });
    for (const object of objects)
      for (const alt of object.additionalImageAlts ?? [])
        assert.ok((await page.getByAltText(alt, { exact: true }).count()) > 0);
    results.push({ subject: subject.id, alternateCount, allImagesDecoded: true });
  }
  await fs.writeFile(
    'output/completion-2026-11-04/alternate-print-browser.json',
    JSON.stringify({ result: 'pass', readers: results }, null, 2) + '\n',
  );
} finally {
  await browser.close();
}

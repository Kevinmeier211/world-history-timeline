import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import process from 'node:process';

const origin = process.env.ATLAS_URL;
if (!origin) throw Error('Set ATLAS_URL to the local candidate.');
const out = 'output/dossier-review-2026-11-04';
const before = JSON.parse(await fs.readFile(out + '/before.json', 'utf8'));
const corpusBytes = await fs.readFile('public/atlas/corpus.json');
const corpus = JSON.parse(corpusBytes);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const investigations = [
  {
    id: 'polynesian-voyaging',
    citations: ['nz-settlement', 'navigation'],
    finding:
      'The settlement summary supports the approximate date. Rāwiri Taonui’s Ocean voyaging account describes using stars and swells to keep direction. These statements require separate passages.',
  },
  {
    id: 'haitian-revolution',
    citations: ['haiti-declaration'],
    finding:
      'Printed p. 7 on digital leaf 8 gives the closing place and date of Dessalines’s address. His name below the dateline is printed. The image establishes the dateline, without establishing a manuscript signature or granting republication rights.',
  },
  {
    id: 'world-war-one',
    citations: ['ww1-indian-service-geography'],
    finding:
      'The National Army Museum exhibition account, prepared with the United Service Institution of India, explicitly lists both campaigns. The original Key Facts URL could not be retrieved. Tara Arts’ Subterranean Sepoys pack independently lists the locations on printed p. 6.',
  },
  {
    id: 'ozette-makah',
    citations: ['ozette-museum', 'ozette-dating-discussion'],
    finding:
      'The Makah museum describes the oral history and reports 500 ± 50 BP. Gavin et al., printed p. 84, distinguish the initial estimate around 1500 from a proposed 1700 earthquake correlation. The interval separately attributes 1560/1700 to SAH. The new report supplies no independent determination of 1560 or an exact year for the slide.',
  },
];
const browser = await chromium.launch();
const results = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    for (const item of investigations) {
      const claimId = item.id + '-checked';
      const getClaim = (input) =>
        input.subjects
          .find((s) => s.id === item.id)
          .claims.find((c) => c.id === claimId);
      const claim = getClaim(corpus);
      assert.deepEqual(
        claim.citations.map((c) => c.source),
        item.citations,
      );
      assert.equal(claim.checkedOn, '2026-11-04');
      await page.goto(origin + '/?subject=' + item.id);
      await page.getByRole('button', { name: 'Open claim-specific evidence' }).click();
      const article = page
        .locator('.claims article')
        .filter({ has: page.getByRole('heading', { name: claim.text, exact: true }) });
      await article.getByText('Evidence and source notes', { exact: true }).click();
      const sources = [];
      for (const cite of claim.citations) {
        const source = corpus.sources.find((s) => s.id === cite.source);
        await expect(
          article.locator('a').filter({ hasText: source.title }).first(),
        ).toHaveAttribute('href', source.url);
        await expect(article).toContainText(cite.locator);
        sources.push({
          id: source.id,
          title: source.title,
          url: source.url,
          locator: cite.locator,
        });
      }
      results.push({
        id: claimId,
        previous: getClaim(before),
        repaired: claim,
        sources,
        finding: item.finding,
        liveEvidenceLinks: 'pass',
      });
    }
    const response = await page.request.get(origin + '/atlas/exports/catalog.json');
    const catalog = await response.json();
    assert.equal(catalog.corpusSHA256, sha(corpusBytes));
    assert.equal(new Set(catalog.files.map((row) => row.id)).size, 138);
    for (const file of catalog.files) {
      const pdf = await page.request.get(origin + file.path);
      assert.equal(pdf.status(), 200, file.id);
      const bytes = await pdf.body();
      assert.equal(bytes.length, file.bytes, file.id);
      assert.equal(sha(bytes), file.sha256, file.id);
      assert.ok(file.withinBudget, file.id);
    }
    await fs.writeFile(
      'docs/redesign/review/DOSSIER-CITATION-CLOSURE-2026-11-04.json',
      JSON.stringify(
        {
          result: 'pass',
          corpusSHA256: sha(corpusBytes),
          priorPass: 'CLAIM-FOLLOWUP-RESULTS-2026-11-04.json',
          scope:
            'Four previously open named claims. The preceding two passes account for the other 110 of 114.',
          repairs: results,
          catalogFilesVerified: catalog.files.length,
          catalogPages: catalog.files.reduce((sum, row) => sum + row.pages, 0),
        },
        null,
        2,
      ) + '\n',
    );
  } finally {
    await context.close();
  }
} finally {
  await browser.close();
}

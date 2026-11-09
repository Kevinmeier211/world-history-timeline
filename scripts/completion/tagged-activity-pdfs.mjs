/* global document */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const input = JSON.parse(await fs.readFile(process.argv[2], 'utf8'));
const browser = await chromium.launch();
let context;
const packets = [];
try {
  context = await browser.newContext();
  const page = await context.newPage();
  for (const row of input.packets) {
    await page.goto(pathToFileURL(path.resolve(row.html)).href);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => i.decode()));
    });
    await page.pdf({
      path: row.path,
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate:
        '<div style="width:100%;margin:0 42pt;font-family:Georgia,serif;color:#47574e;font-size:7pt;line-height:11pt"><div>CHRONOS ATLAS | Local review candidate | Ages 10-14 with an adult / adult reading <span style="float:right" class="pageNumber"></span></div><div>Independent historical, reader and physical-print acceptance remain open.</div></div>',
    });
    const validation = JSON.parse(
      execFileSync(
        'python3',
        [
          '-c',
          'from pypdf import PdfReader;import json,sys;r=PdfReader(sys.argv[1]);root=r.trailer["/Root"];print(json.dumps({"pages":len(r.pages),"tagged":bool(root.get("/StructTreeRoot")),"language":root.get("/Lang"),"textLengths":[len(p.extract_text() or "") for p in r.pages],"paperSizes":[[float(p.mediabox.width),float(p.mediabox.height)] for p in r.pages]}))',
          row.path,
        ],
        { encoding: 'utf8' },
      ),
    );
    const bytes = await fs.readFile(row.path);
    assert(validation.tagged && validation.language === 'en');
    assert(validation.textLengths.every((n) => n > 100));
    assert(validation.paperSizes.every((s) => s[0] === 612 && s[1] === 792));
    assert(bytes.length <= 2000000);
    packets.push({
      ...row,
      ...validation,
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      textChecked: false,
      renderReview: 'pending',
      physicalPrint: 'pending',
    });
  }
} finally {
  try {
    await context?.close();
  } finally {
    await browser.close();
  }
}
await fs.writeFile(
  path.join(path.dirname(process.argv[2]), 'manifest.json'),
  JSON.stringify(
    {
      corpusSHA256: input.corpusSHA256,
      renderer:
        'Managed Chromium semantic HTML; tagged PDF with source-derived image descriptions',
      version: browser.version(),
      packets,
    },
    null,
    2,
  ) + '\n',
);

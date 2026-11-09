/* global document, window */
import { URL } from 'node:url';
import { chromium, webkit } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
const root = process.env.ATLAS_URL;
if (!root) throw Error('Pass the local candidate preview.');
const out = process.env.ATLAS_REPORT_DIR + '/glossary';
await fs.mkdir(out, { recursive: true });
const engine = process.env.ATLAS_BROWSER ?? 'chromium';
assert.ok(['chromium', 'webkit'].includes(engine), 'Use chromium or webkit');
const browser = await (engine === 'webkit' ? webkit : chromium).launch(),
  findings = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const errors = [],
      external = [];
    await context.route('**/*', (route) => {
      if (new URL(route.request().url()).origin === new URL(root).origin)
        return route.continue();
      external.push(route.request().url());
      return route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    for (const [subject, pack, year, id, name] of [
      ['nalanda', 'C5', 680, 'endowment', 'Endowment'],
      ['mali-networks', 'C6', 1375, 'jeli', 'Jeli / jeliw'],
      ['inca-weaving', 'C6', 1500, 'mita', 'Mit’a'],
    ]) {
      await page.goto(
        `${root}/?pack=${pack}&subject=${subject}&year=${year}&scale=local`,
      );
      await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
      const authored = await (
        await page.request.get(`${root}/atlas/subjects/${subject}.json`)
      ).json();
      assert.equal(
        await page.locator('.dossier-opening > .lead').innerText(),
        authored.summary,
      );
      const paragraphs = await page.locator('.dossier-section > p').allInnerTexts();
      assert.deepEqual(
        paragraphs.slice(0, authored.sections.length),
        authored.sections.map((s) => s.text),
      );
      const opener = page
        .locator('.dossier .inline-term')
        .filter({
          hasText: id === 'jeli' ? 'jeliw' : id === 'mita' ? 'mit’a' : 'Endowment',
        })
        .first();
      await opener.scrollIntoViewIfNeeded();
      const before = await opener.boundingBox(),
        scroll = await page.evaluate(() => window.scrollY),
        url = page.url();
      await opener.focus();
      await opener.press('Enter');
      const dialog = page.getByRole('dialog', { name, exact: true });
      await expect(dialog).toBeVisible();
      await expect(
        dialog.getByRole('button', { name: 'Back to reading' }),
      ).toBeFocused();
      assert.ok((await dialog.locator('p').innerText()).length > 40);
      await page
        .locator('.dossier-top button')
        .first()
        .evaluate((button) => button.focus());
      await expect(
        dialog.getByRole('button', { name: 'Back to reading' }),
      ).toBeFocused();
      await page.mouse.move(3, 450);
      await page.mouse.wheel(0, 600);
      assert.ok(
        Math.abs((await page.evaluate(() => window.scrollY)) - scroll) < 2,
        'Background reading position stays still',
      );
      assert.equal(page.url(), url);
      assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
      await page.screenshot({ path: `${out}/${subject}-${width}.png` });
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
      await page.screenshot({ path: `${out}/${subject}-reading-${width}.png` });
      await expect
        .poll(async () => Math.abs((await opener.boundingBox()).y - before.y))
        .toBeLessThan(2);
      await expect
        .poll(() => page.evaluate(() => document.body.style.overflow))
        .toBe('');
      assert.equal(page.url(), url);
      await opener.click();
      await dialog.getByRole('button', { name: 'Back to reading' }).click();
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
      );
      findings.push({
        subject,
        engine,
        id,
        width,
        keyboardOpenClose: true,
        backgroundInert: true,
        scrollRestored: true,
        URLUnchanged: true,
        axe: [],
      });
    }
    await page.goto(`${root}/?pack=C5&subject=nalanda&year=680&scale=local`);
    const deeper = page
      .locator('.deeper-reading details')
      .filter({ has: page.locator('.inline-term') })
      .first();
    await deeper.locator(':scope > summary').click();
    const deepWord = deeper.locator('.inline-term').first();
    await deepWord.click();
    await page.keyboard.press('Escape');
    await expect(deepWord).toBeFocused();
    await expect(deeper).toHaveAttribute('open', '');
    await page.goto(`${root}/?view=world&pack=C5&year=680&scale=era`);
    await page.locator('.world-reading-notes > summary').click();
    await page.getByRole('button', { name: /^Explore Nalanda/ }).click();
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await page.locator('.inline-term[data-term="endowment"]').first().click();
    await expect(page.locator('.glossary-dialog[open]')).toBeVisible();
    await page.goBack();
    await expect(page.locator('.glossary-dialog[open]')).toHaveCount(0);
    await expect(page.locator('.dossier')).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
    assert.ok(!new URL(page.url()).searchParams.has('subject'));
    findings.push({
      engine,
      width,
      historyBackClosesDefinitionAndRestoresScrolling: true,
    });
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await context.close();
  }
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(findings, null, 2));
  console.log(
    'Inline glossary: preserved reading/URL, exact definitions, keyboard/modal isolation, scroll and focus restoration passed at four widths.',
  );
} finally {
  await browser.close();
}

/* global document, localStorage, Storage */
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import process from 'node:process';
import console from 'node:console';
const root = process.env.ATLAS_URL;
if (!root) throw Error('Use the isolated browser runner.');
const out = process.env.ATLAS_REPORT_DIR + '/notebook';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const [width, blocked] of [
    [320, false],
    [390, false],
    [768, false],
    [1440, false],
    [390, true],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      acceptDownloads: true,
    });
    await context.addInitScript(
      ({ blocked }) => {
        localStorage.setItem(
          'chronos.household.v1',
          JSON.stringify({
            version: 1,
            notes: [
              {
                id: 'legacy',
                title: 'Legacy question',
                question: 'What do I remember?',
                answer: 'Earlier answer',
                collection: 'Household',
                saved: '2026-10-25T10:00:00Z',
                location: '?subject=eastern-han&pack=C4&year=200&scale=local',
                kind: 'question',
              },
            ],
          }),
        );
        if (blocked) {
          const original = Storage.prototype.setItem;
          Storage.prototype.setItem = function (key, value) {
            if (key === 'chronos.household.v1') throw Error('Storage blocked');
            return original.call(this, key, value);
          };
        }
      },
      { blocked },
    );
    const page = await context.newPage();
    await page.goto(
      `${root}/?pack=C5&subject=tang-city&object=tang-access-diagram&year=700&scale=local`,
    );
    await expect(page.locator('.dossier[data-reading-ready=true]')).toBeVisible();
    await page.getByRole('button', { name: 'Save a question', exact: true }).click();
    await page.locator('textarea[name=answer]').fill('My first theory.');
    await page.locator('input[name=collection]').fill('Cities');
    await page
      .getByRole('button', { name: 'Save on this device', exact: true })
      .click();
    await expect(page.locator('.save-dialog')).not.toBeVisible();
    if (blocked)
      await expect(page.locator('.app-message')).toContainText(
        'Export the notebook now',
      );
    await page.getByRole('button', { name: 'Notebook', exact: true }).click();
    if (blocked) {
      await expect(page.locator('.notebook-view > .eyebrow')).toHaveText(
        'Available for this visit',
      );
      await expect(
        page.locator('.notebook-view > [role=status]').first(),
      ).toContainText('Browser storage could not save');
    }
    const entries = page.locator('.notebook-list > article');
    await expect(entries).toHaveCount(2);
    await entries
      .first()
      .getByRole('button', { name: 'Revise thinking', exact: true })
      .click();
    await page
      .getByRole('textbox', { name: 'Your thinking now', exact: true })
      .fill('Rules and actual practice need separate evidence.');
    await page
      .getByRole('textbox', {
        name: 'What changed in your thinking? (optional)',
        exact: true,
      })
      .fill('I now distinguish a model from an observed journey.');
    await page
      .getByRole('textbox', { name: 'What evidence helped? (optional)', exact: true })
      .fill('The ward source and the diagram’s conventions.');
    await page
      .getByRole('button', { name: 'Return to evidence; keep draft', exact: true })
      .click();
    await expect(page.locator('.dossier h1')).toContainText('Tang');
    await page.getByRole('button', { name: 'Notebook', exact: true }).click();
    await expect(
      page.getByRole('textbox', { name: 'Your thinking now', exact: true }),
    ).toHaveValue('Rules and actual practice need separate evidence.');
    await page.getByRole('button', { name: 'Save revision', exact: true }).click();
    await expect(entries.first()).toContainText('My first theory.');
    await expect(entries.first()).toContainText('Rules and actual practice');
    await page.locator('.notebook-filters select').selectOption('Cities');
    await expect(entries).toHaveCount(1);
    await entries
      .first()
      .getByRole('button', { name: 'Edit details', exact: true })
      .click();
    await page
      .getByRole('textbox', { name: 'Title', exact: true })
      .fill('Gate evidence revisited');
    await page
      .getByRole('textbox', { name: 'Collection', exact: true })
      .fill('Revised cities');
    await page.getByRole('button', { name: 'Save details', exact: true }).click();
    await expect(page.locator('.notebook-filters select')).toHaveValue('');
    await expect(entries).toHaveCount(2);
    await expect(entries.first().getByRole('heading', { level: 2 })).toHaveText(
      'Gate evidence revisited',
    );
    await entries.first().getByRole('button', { name: 'Remove', exact: true }).click();
    await expect(entries).toHaveCount(1);
    await page.getByRole('button', { name: 'Undo last removal', exact: true }).click();
    await expect(entries).toHaveCount(2);
    await expect(entries.first()).toContainText('Gate evidence revisited');
    const downloading = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export notebook', exact: true }).click();
    const path = `${out}/notebook-${width}-${blocked ? 'blocked' : 'normal'}.json`;
    await (await downloading).saveAs(path);
    const exported = JSON.parse(await fs.readFile(path, 'utf8'));
    const saved = exported.notes.find((n) => n.title === 'Gate evidence revisited');
    assert.equal(exported.version, 1);
    assert.equal(saved.answer, 'My first theory.');
    assert.equal(saved.collection, 'Revised cities');
    assert.equal(saved.revisions.length, 1);
    assert.equal(saved.context.year, 700);
    assert.equal(saved.context.object, 'tang-access-diagram');
    assert.ok(saved.context.sources.some((s) => s.id === 'tang-wards'));
    assert.equal(
      exported.notes.find((n) => n.id === 'legacy').saved,
      '2026-10-25T10:00:00Z',
    );
    const incoming = {
      version: 1,
      notes: [{ ...saved, answer: 'An imported alternative.' }],
    };
    const file = {
      name: 'alternative.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(incoming)),
    };
    await page.locator('input[type=file]').setInputFiles(file);
    await page
      .getByRole('button', { name: 'Add imported entries', exact: true })
      .click();
    await expect(entries).toHaveCount(3);
    await page.locator('input[type=file]').setInputFiles(file);
    await page
      .getByRole('button', { name: 'Add imported entries', exact: true })
      .click();
    await expect(entries).toHaveCount(3);
    await expect(entries.first()).toContainText('My first theory.');
    await entries
      .first()
      .getByRole('button', { name: 'Revise thinking', exact: true })
      .click();
    await page
      .getByRole('textbox', { name: 'Your thinking now', exact: true })
      .fill('Keep this unsaved draft.');
    await page.locator('input[type=file]').setInputFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"version":2,"notes":[]}'),
    });
    await expect(page.locator('.notebook-view > [role=status]').last()).toContainText(
      'existing notebook is unchanged',
    );
    await expect(
      page.getByRole('textbox', { name: 'Your thinking now', exact: true }),
    ).toHaveValue('Keep this unsaved draft.');
    await page.getByRole('button', { name: 'Cancel edit', exact: true }).click();
    await page
      .getByRole('button', { name: 'Revisit an earlier question', exact: true })
      .click();
    await expect(page.locator('#note-legacy')).toBeFocused();
    await expect(
      entries
        .filter({ has: page.locator('#note-legacy') })
        .locator('.thinking-history'),
    ).toHaveCount(0);
    await entries.first().locator('.saved-context > summary').click();
    await expect(entries.first().locator('.saved-context')).toContainText('700 CE');
    assert.deepEqual((await new AxeBuilder({ page }).analyze()).violations, []);
    assert.ok(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1,
      ),
    );
    await page.screenshot({
      path: `${out}/notebook-${width}-${blocked ? 'blocked' : 'normal'}.png`,
      fullPage: true,
    });
    results.push({
      width,
      storage: blocked ? 'blocked' : 'normal',
      legacy: true,
      revision: true,
      keptDraft: true,
      undo: true,
      sourceContext: true,
      conflictCopies: true,
      idempotentImport: true,
      invalidImportRecovered: true,
      axe: [],
    });
    await context.close();
  }
  await fs.writeFile(`${out}/checks.json`, JSON.stringify(results, null, 2));
  console.log(
    'Notebook legacy data, revisions/reflection, drafts, undo, source context, import conflicts and blocked storage passed at four widths.',
  );
} finally {
  await browser.close();
}

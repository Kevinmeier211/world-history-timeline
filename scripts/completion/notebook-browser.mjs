/* global localStorage, sessionStorage, console, window, navigator */
import { expect } from '@playwright/test';
import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import process from 'node:process';
const root = process.env.ATLAS_URL;
if (!root) throw Error('ATLAS_URL is required');
const engine = process.env.ATLAS_ENGINE ?? 'chromium';
if (!['chromium', 'firefox', 'webkit'].includes(engine))
  throw Error('Unknown managed engine');
const out = process.env.ATLAS_OUTPUT_DIR ?? 'output/completion-2026-11-04';
await fs.mkdir(out, { recursive: true });
const browser = await { chromium, firefox, webkit }[engine].launch();
let context;
let fresh;
try {
  context = await browser.newContext();
  const a = await context.newPage(),
    b = await context.newPage();
  const visit = async (page, subject) => {
    await page.goto(`${root}/?subject=${subject}&pack=C4&scale=local&year=200`);
    await page.locator('.dossier[data-reading-ready=true]').waitFor();
  };
  await visit(a, 'eastern-han');
  await visit(b, 'roman-world');
  const save = async (page, answer) => {
    await page.getByRole('button', { name: 'Save a question', exact: true }).click();
    await page.locator('textarea[name=answer]').fill(answer);
    await page
      .getByRole('button', { name: 'Save on this device', exact: true })
      .click();
    await page.locator('.save-dialog').waitFor({ state: 'hidden' });
  };
  await Promise.all([save(a, 'First tab'), save(b, 'Second tab')]);
  await a.reload();
  await a.locator('.dossier').waitFor();
  const stored = await a.evaluate(() =>
    JSON.parse(localStorage.getItem('chronos.household.v1')),
  );
  assert.equal(stored.notes.length, 2);
  assert.deepEqual(stored.notes.map((n) => n.answer).sort(), [
    'First tab',
    'Second tab',
  ]);
  // A partially written new question survives a reload in its original context.
  await a.getByRole('button', { name: 'Save a question', exact: true }).click();
  await a.locator('textarea[name=answer]').fill('Draft after reload');
  await a.reload();
  await expect(a.locator('textarea[name=answer]')).toHaveValue('Draft after reload');
  await a.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await expect(a.locator('.save-dialog')).not.toBeVisible();
  const afterDraft = await a.evaluate(() =>
    JSON.parse(localStorage.getItem('chronos.household.v1')),
  );
  assert.equal(
    afterDraft.notes.find((n) => n.answer === 'Draft after reload').context.subject,
    'eastern-han',
  );
  // Both editors start from the same note, before either revision is saved.
  for (const page of [a, b]) {
    await page.getByRole('button', { name: 'Notebook', exact: true }).click();
    await page
      .getByRole('button', { name: 'Revise thinking', exact: true })
      .first()
      .click();
  }
  await a
    .getByRole('textbox', { name: 'Your thinking now', exact: true })
    .fill('Revision from A');
  await b
    .getByRole('textbox', { name: 'Your thinking now', exact: true })
    .fill('Revision from B');
  await a.getByRole('button', { name: 'Save revision', exact: true }).click();
  await expect(
    a.getByRole('textbox', { name: 'Your thinking now', exact: true }),
  ).toHaveCount(0);
  await b.getByRole('button', { name: 'Save revision', exact: true }).click();
  await expect(
    b.getByRole('textbox', { name: 'Your thinking now', exact: true }),
  ).toHaveCount(0);
  const revised = await b.evaluate(() =>
    JSON.parse(localStorage.getItem('chronos.household.v1')),
  );
  assert.ok(
    revised.notes.some((n) => n.revisions?.some((r) => r.answer === 'Revision from A')),
  );
  assert.ok(
    revised.notes.some((n) => n.revisions?.some((r) => r.answer === 'Revision from B')),
  );
  assert.ok(revised.notes.some((n) => n.importedFrom));
  // A revision draft also survives reload, and remains usable after a remote deletion.
  await a.getByRole('button', { name: 'Revise thinking', exact: true }).first().click();
  await a
    .getByRole('textbox', { name: 'Your thinking now', exact: true })
    .fill('Revision survives deletion');
  await a.reload();
  await expect(
    a.getByRole('textbox', { name: 'Your thinking now', exact: true }),
  ).toHaveValue('Revision survives deletion');
  await b.getByRole('button', { name: 'Remove', exact: true }).first().click();
  await a.getByRole('button', { name: 'Save revision', exact: true }).click();
  await expect(
    a.getByRole('textbox', { name: 'Your thinking now', exact: true }),
  ).toHaveCount(0);
  const deletion = await a.evaluate(() =>
    JSON.parse(localStorage.getItem('chronos.household.v1')),
  );
  assert.ok(
    deletion.notes.some(
      (n) =>
        n.importedFrom &&
        n.revisions?.some((r) => r.answer === 'Revision survives deletion'),
    ),
  );
  await visit(a, 'eastern-han');
  await b.evaluate(() => localStorage.setItem('chronos.household.v1', '{damaged'));
  await save(a, 'Recoverable session note');
  assert.equal(
    await a.evaluate(() => localStorage.getItem('chronos.household.v1')),
    '{damaged',
  );
  await a.getByRole('button', { name: 'Notebook', exact: true }).click();
  const downloadEvent = a.waitForEvent('download');
  await a.getByRole('button', { name: /Export notebook/ }).click();
  const download = await downloadEvent;
  const exported = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  assert.ok(exported.notes.some((n) => n.answer === 'Recoverable session note'));
  // The recovery UI works after a fresh load as well as during a failed save.
  await b.reload();
  await b.getByRole('button', { name: 'Notebook', exact: true }).click();
  await expect(b.getByRole('heading', { name: 'Recover saved work' })).toBeVisible();
  const rawDownload = b.waitForEvent('download');
  await b.getByRole('button', { name: 'Export original saved data' }).click();
  assert.equal(await fs.readFile(await (await rawDownload).path(), 'utf8'), '{damaged');
  await b.getByRole('button', { name: 'Restore previous backup' }).click();
  await expect(b.getByRole('heading', { name: 'Recover saved work' })).toHaveCount(0);
  assert.ok(
    await b.evaluate(() =>
      Object.keys(localStorage).some(
        (k) =>
          k.startsWith('chronos.household.recovery.') &&
          localStorage.getItem(k) === '{damaged',
      ),
    ),
  );
  fresh = await browser.newContext();
  const restoredPage = await fresh.newPage();
  await restoredPage.goto(root + '/?page=notebook');
  await restoredPage.locator('input[type=file]').setInputFiles({
    name: 'restoration.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await expect(
    restoredPage.getByRole('heading', { name: 'Review notebook import' }),
  ).toBeVisible();
  assert.equal(
    await restoredPage.evaluate(() => localStorage.getItem('chronos.household.v1')),
    null,
  );
  await restoredPage
    .getByRole('button', { name: 'Add imported entries', exact: true })
    .click();
  await expect(
    restoredPage.getByRole('heading', { name: 'Review notebook import' }),
  ).toHaveCount(0);
  await restoredPage.reload();
  assert.deepEqual(
    await restoredPage.evaluate(() =>
      JSON.parse(localStorage.getItem('chronos.household.v1')),
    ),
    exported,
  );
  // Use a second real page to delay the Web Lock, so the first save finishes
  // only after Cancel and a different draft have changed the active dialog.
  const lockPage = await fresh.newPage();
  await lockPage.goto(root);
  await lockPage.evaluate(async () => {
    let acquired;
    const ready = new Promise((resolve) => {
      acquired = resolve;
    });
    const gate = new Promise((resolve) => {
      window.__a02ReleaseNotebookLock = resolve;
    });
    window.__a02NotebookLock = navigator.locks.request(
      'chronos-notebook-write',
      async () => {
        acquired();
        await gate;
      },
    );
    await ready;
  });
  try {
    await visit(restoredPage, 'eastern-han');
    await restoredPage
      .getByRole('button', { name: 'Save a question', exact: true })
      .click();
    const draft = restoredPage.locator('.save-dialog[open]');
    await draft.locator('textarea[name=question]').fill('Earlier submitted question');
    await draft.locator('textarea[name=answer]').fill('Earlier submitted answer');
    await draft.getByRole('textbox', { name: 'Collection' }).fill('Earlier collection');
    await draft.getByRole('button', { name: 'Save on this device' }).click();
    await expect(draft.locator('textarea[name=question]')).toBeDisabled();
    await expect(draft.locator('textarea[name=answer]')).toBeDisabled();
    await expect(draft.getByRole('textbox', { name: 'Collection' })).toBeDisabled();
    await expect
      .poll(() =>
        restoredPage.evaluate(async () =>
          (await navigator.locks.query()).pending.some(
            (lock) => lock.name === 'chronos-notebook-write',
          ),
        ),
      )
      .toBe(true);
    await draft.getByRole('button', { name: 'Cancel', exact: true }).click();
    await restoredPage
      .getByRole('button', { name: 'Save a question', exact: true })
      .click();
    await draft.locator('textarea[name=question]').fill('Newer unsaved question');
    await draft.locator('textarea[name=answer]').fill('Newer unsaved answer');
    await lockPage.evaluate(async () => {
      window.__a02ReleaseNotebookLock();
      await window.__a02NotebookLock;
    });
    await expect
      .poll(() =>
        restoredPage.evaluate(() =>
          JSON.parse(localStorage.getItem('chronos.household.v1')).notes.some(
            (note) => note.answer === 'Earlier submitted answer',
          ),
        ),
      )
      .toBe(true);
    // A following lock acquisition also waits until the earlier write settles.
    await restoredPage.evaluate(() =>
      navigator.locks.request('chronos-notebook-write', () => true),
    );
    await expect(draft).toBeVisible();
    await expect(draft.locator('textarea[name=question]')).toBeEnabled();
    await expect(draft.locator('textarea[name=question]')).toHaveValue(
      'Newer unsaved question',
    );
    await expect(draft.locator('textarea[name=answer]')).toHaveValue(
      'Newer unsaved answer',
    );
    assert.deepEqual(
      await restoredPage.evaluate(() => {
        const { question, answer } = JSON.parse(
          sessionStorage.getItem('chronos.question-draft'),
        );
        return { question, answer };
      }),
      { question: 'Newer unsaved question', answer: 'Newer unsaved answer' },
    );
    await expect(
      restoredPage.getByText('Saved on this device. Revisit it from Notebook.', {
        exact: true,
      }),
    ).toHaveCount(0);
  } finally {
    await lockPage.evaluate(() => window.__a02ReleaseNotebookLock()).catch(() => {});
    await lockPage.close();
  }
  const result = {
    result: 'pass',
    engine,
    version: browser.version(),
    checks: [
      'concurrent real-tab saves',
      'reload preserves both answers',
      'malformed saved data is not overwritten',
      'failed save remains available in session',
      'new question draft reload retains answer and context',
      'concurrent editor revisions retained separately',
      'revision draft survives reload and remote deletion',
      'raw recovery download preserves exact bytes',
      'previous backup restores with damaged data archived',
      'import preview does not mutate storage',
      'fresh context import and reload preserve all exported fields',
      'delayed real Web Lock save locks submitted fields and preserves a newer cancelled/reopened draft without a stale success announcement',
    ],
  };
  await fs.writeFile(
    `${out}/notebook-browser-${engine}.json`,
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result));
} finally {
  await Promise.allSettled([fresh?.close(), context?.close()]);
  await browser.close();
}

import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { notebookKey, persistNotebook } from './notebook-persistence';
import type { Notebook } from './notebook-data';

const base: Notebook = { version: 1, notes: [] };
const intended: Notebook = {
  version: 1,
  notes: [
    {
      id: 'answer',
      title: 'Question',
      question: 'What is visible?',
      answer: 'A mark',
      collection: 'Household',
      saved: '2026-11-04T12:00:00Z',
      location: '?subject=uruk-accounts',
      kind: 'question',
    },
  ],
};
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(notebookKey, JSON.stringify(base));
  vi.stubGlobal('navigator', {
    locks: {
      request: async (_name: string, operation: () => Promise<Notebook>) => operation(),
    },
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  localStorage.clear();
});

it('preserves saved bytes when the backup write exceeds quota', async () => {
  const original = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key === 'chronos.household.backup')
      throw new DOMException('Full', 'QuotaExceededError');
    return original.call(this, key, value);
  });
  await expect(persistNotebook(base, intended)).rejects.toMatchObject({
    name: 'QuotaExceededError',
  });
  expect(localStorage.getItem(notebookKey)).toBe(JSON.stringify(base));
});

it('keeps the prior notebook and backup when the final write exceeds quota', async () => {
  const original = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key === notebookKey) throw new DOMException('Full', 'QuotaExceededError');
    return original.call(this, key, value);
  });
  await expect(persistNotebook(base, intended)).rejects.toMatchObject({
    name: 'QuotaExceededError',
  });
  expect(localStorage.getItem(notebookKey)).toBe(JSON.stringify(base));
  expect(localStorage.getItem('chronos.household.backup')).toBe(JSON.stringify(base));
});

it('fails before mutation when safe browser locking is unavailable', async () => {
  vi.stubGlobal('navigator', {});
  await expect(persistNotebook(base, intended)).rejects.toThrow(
    'Safe notebook storage is unavailable',
  );
  expect(localStorage.getItem(notebookKey)).toBe(JSON.stringify(base));
  expect(localStorage.getItem('chronos.household.backup')).toBeNull();
});

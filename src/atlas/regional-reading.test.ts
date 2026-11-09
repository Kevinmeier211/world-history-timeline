import { readFileSync } from 'node:fs';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import type { Corpus, RuntimeCorpus } from './model';
import { orientationYears } from './regional-reading-contract';
import { regionalSnapshot } from './snapshot';
import { validateCorpus } from './validate';
import { RegionalPrint } from './RegionalPrint';
const full: Corpus = JSON.parse(readFileSync('public/atlas/corpus.json', 'utf8'));
const index: RuntimeCorpus = JSON.parse(
  readFileSync('public/atlas/index.json', 'utf8'),
);
const readings = JSON.parse(readFileSync('public/atlas/orientations.json', 'utf8'));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});
describe('regional reading and independently dated snapshots', () => {
  it('keeps the full reading out of bootstrap while preserving snapshot parity', () => {
    expect(index.orientations).toBeUndefined();
    expect(readings).toEqual(full.orientations);
    const regionalSnapshots = JSON.parse(
      readFileSync('public/atlas/regional-snapshots.json', 'utf8'),
    );
    expect(regionalSnapshots).toEqual(full.orientations!.flatMap((r) => r.snapshots));
    expect(full.orientations).toHaveLength(56);
    expect(regionalSnapshots).toHaveLength(84);
    for (const year of Object.values(orientationYears).flat()) {
      const hydrated = { ...index, regionalSnapshots };
      expect(index.regionalSnapshots).toBeUndefined();
      expect(index.regionalSnapshotsDeferred).toBe(true);
      expect(regionalSnapshot(hydrated, year, 'all').map((r) => r.reading)).toEqual(
        regionalSnapshot(full, year, 'all').map((r) => r.reading),
      );
    }
  });
  it('adds Orkney orientation without extending Skara Brae or arbitrary nearby years', () => {
    const row = regionalSnapshot(full, -2400, 'Europe')[0]!;
    expect(row.reading?.orientation).toBe('C1-R3');
    expect(row.cases.some((s) => s.id === 'skara-brae')).toBe(false);
    expect(regionalSnapshot(full, -2401, 'Europe')[0]!.reading).toBeUndefined();
  });
  it('does not backdate imperial Qin or Ashoka to fill 300 BCE', () => {
    const rows = regionalSnapshot(full, -300, 'all');
    expect(rows.flatMap((r) => r.cases).map((s) => s.id)).not.toContain(
      'qin-administration',
    );
    expect(rows.flatMap((r) => r.cases).map((s) => s.id)).not.toContain(
      'ashoka-messages',
    );
    expect(rows.find((r) => r.region === 'East Asia')?.reading?.text).toContain(
      'before imperial Qin',
    );
  });
  it('rejects duplicate, out-of-chapter, unanchored and unreferenced readings', () => {
    expect(validateCorpus(full)).toEqual([]);
    for (const mutate of [
      (c: Corpus) => {
        c.orientations![1]!.snapshots[0]!.region = 'Americas';
      },
      (c: Corpus) => {
        c.orientations![0]!.snapshots[0]!.year = -1200;
      },
      (c: Corpus) => {
        c.orientations![0]!.snapshots[0]!.year = -2401;
      },
      (c: Corpus) => {
        c.orientations![0]!.summary.citations[0]!.source = 'missing-source';
      },
    ]) {
      const candidate = structuredClone(full);
      mutate(candidate);
      expect(validateCorpus(candidate).length).toBeGreaterThan(0);
    }
  });
  it('deduplicates loading across chapters and retries a malformed response', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 'broken' }] })
      .mockResolvedValue({ ok: true, json: async () => readings });
    vi.stubGlobal('fetch', fetcher);
    const { loadRegionalOrientations } = await import('./data');
    await expect(loadRegionalOrientations('C1')).rejects.toThrow();
    const [a, b] = await Promise.all([
      loadRegionalOrientations('C1'),
      loadRegionalOrientations('C2'),
    ]);
    expect(a.every((r) => r.chapter === 'C1')).toBe(true);
    expect(b.every((r) => r.chapter === 'C2')).toBe(true);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('loads only on expansion, supports regional choice and exposes response criteria', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => readings });
    vi.stubGlobal('fetch', fetcher);
    const { ChapterRegionalReading } = await import('./RegionalReading');
    const { container, unmount } = render(
      React.createElement(ChapterRegionalReading, {
        corpus: index,
        chapter: 'C1',
        openSubject: vi.fn(),
      }),
    );
    expect(fetcher).not.toHaveBeenCalled();
    const details = container.querySelector('details')!;
    details.open = true;
    fireEvent(details, new Event('toggle'));
    const select = await screen.findByLabelText('Choose a regional setting');
    fireEvent.change(select, { target: { value: 'Europe' } });
    expect(
      await screen.findByText(full.orientations!.find((r) => r.id === 'C1-R3')!.title),
    ).toBeTruthy();
    expect(screen.getByText('Compare your reasoning')).toBeTruthy();
    unmount();
  });
  it('prints the exact authored text, response criteria and source URLs for one chapter', () => {
    const { container, unmount } = render(
      React.createElement(RegionalPrint, { corpus: full, chapter: 'C2' }),
    );
    expect(container.querySelectorAll('[data-orientation]')).toHaveLength(7);
    for (const reading of full.orientations!.filter((r) => r.chapter === 'C2')) {
      expect(container.textContent).toContain(reading.summary.text);
      expect(container.textContent).toContain(reading.activity.response);
      expect(container.textContent).toContain(reading.snapshots[0]!.text);
      for (const citation of reading.summary.citations)
        expect(container.textContent).toContain(
          full.sources.find((s) => s.id === citation.source)!.url,
        );
    }
    expect(container.textContent).not.toContain(
      full.orientations!.find((r) => r.id === 'C1-R1')!.question,
    );
    unmount();
  });
});

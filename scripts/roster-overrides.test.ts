import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { bundledGeography } from '../src/data/catalog.ts';
import { datasetSchema } from '../src/data/schema/index.ts';
import { layoutOverridesSchema } from '../src/data/schema/overrides.ts';
import { layout } from '../src/layout/index.ts';
import { labelFitByImportance, ribbonOverlap } from '../src/layout/metrics.ts';
import type { LayoutLabel, LayoutResult } from '../src/layout/types.ts';
import { loadDataset } from './load-dataset.ts';

function hitCount(result: LayoutResult): number {
  const fitted = result.labels.filter((label) => label.fitted);
  let count = 0;
  const intersects = (left: LayoutLabel, right: LayoutLabel) =>
    left.x < right.x + right.width - 0.5 &&
    right.x < left.x + left.width - 0.5 &&
    left.y < right.y + right.height - 0.5 &&
    right.y < left.y + left.height - 0.5;
  for (let i = 0; i < fitted.length; i += 1) {
    const left = fitted[i];
    if (!left) continue;
    for (let j = i + 1; j < fitted.length; j += 1) {
      const right = fitted[j];
      if (right && intersects(left, right)) count += 1;
    }
  }
  return count;
}

describe('roster label overrides', () => {
  it('does not hide a name or add a fitted overlap', () => {
    const dataset = datasetSchema.parse(loadDataset());
    const tunedFile = layoutOverridesSchema.parse(
      JSON.parse(readFileSync('src/data/layoutOverrides.json', 'utf8')),
    );
    expect(tunedFile.ribbons.length).toBeGreaterThanOrEqual(8);
    expect(tunedFile.callouts).toEqual([]);
    const input = {
      polities: dataset.polities,
      relations: dataset.relations,
      callouts: dataset.callouts,
      bands: dataset.bands,
      geography: bundledGeography(),
      viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
      visibleFamilies: [] as const,
      visibleMacroRegions: [] as const,
    };
    const bare = layout({ ...input, overrides: { ribbons: [], callouts: [] } });
    const tuned = layout({ ...input, overrides: tunedFile });
    const bareHits = hitCount(bare);
    const tunedHits = hitCount(tuned);
    expect(bareHits).toBe(0);
    expect(tunedHits).toBeLessThanOrEqual(bareHits);
    expect(ribbonOverlap(tuned.ribbons).overlaps).toBe(0);
    const importance = new Map(
      dataset.polities.map((polity) => [polity.id, polity.importance]),
    );
    expect(labelFitByImportance(tuned.labels, importance).get(3)?.rate).toBe(1);
    expect(tuned.labels.filter((label) => label.fitted).length).toBeGreaterThanOrEqual(
      bare.labels.filter((label) => label.fitted).length,
    );
    for (const row of tunedFile.ribbons) {
      expect(row.reason.trim().length).toBeGreaterThanOrEqual(8);
      const before = bare.labels.find((label) => label.polityId === row.polityId);
      const after = tuned.labels.find((label) => label.polityId === row.polityId);
      expect(before?.fitted).toBe(true);
      expect(after?.fitted).toBe(true);
      expect(after && before && after.text.length >= before.text.length).toBe(true);
      expect(after?.text.endsWith('…') && !before?.text.endsWith('…')).toBe(false);
    }
    const byId = new Map(dataset.polities.map((polity) => [polity.id, polity]));
    const covers = (start: number, end: number) =>
      tunedFile.ribbons.some((row) => {
        const polity = byId.get(row.polityId);
        return polity !== undefined && polity.start <= end && polity.end >= start;
      });
    expect(covers(500, 800)).toBe(true);
    expect(covers(1200, 1300)).toBe(true);
    expect(covers(1500, 1800)).toBe(true);
  });
});

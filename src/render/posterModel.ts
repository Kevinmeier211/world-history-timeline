import { bundledGeography } from '../data/catalog.ts';
import { clientDataset, clientOverrides } from '../data/clientDataset.ts';
import type { Dataset } from '../data/schema/index.ts';
import type { Geography } from '../data/schema/geography.ts';
import type { LayoutOverrides } from '../data/schema/overrides.ts';
import { layout } from '../layout/index.ts';
import type { LayoutInput, LayoutResult } from '../layout/types.ts';
import { posterPaint, type LabelPaint, type RibbonPaint } from './ribbonInk.ts';

export function posterLayoutInput(
  dataset: Dataset,
  geography: Geography,
  overrides: LayoutOverrides,
): LayoutInput {
  return {
    polities: dataset.polities,
    relations: dataset.relations,
    callouts: dataset.callouts,
    bands: dataset.bands,
    geography,
    overrides,
    viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
    visibleFamilies: [],
    visibleMacroRegions: [],
  };
}

export interface PosterPaint {
  ribbons: RibbonPaint[];
  labels: LabelPaint[];
  result: LayoutResult;
}

let paintCache: PosterPaint | null = null;

/** One layout of the bundled roster. Later tasks reuse `result`. */
export function posterModel(): PosterPaint {
  if (paintCache) return paintCache;
  const dataset = clientDataset();
  const result = layout(
    posterLayoutInput(dataset, bundledGeography(), clientOverrides()),
  );
  paintCache = { ...posterPaint(dataset, result), result };
  return paintCache;
}

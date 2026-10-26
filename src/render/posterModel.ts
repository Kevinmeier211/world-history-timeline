import { bundledGeography } from '../data/catalog.ts';
import { bandPaints, type BandPaint } from './bandInk.ts';
import { clientDataset, clientOverrides } from '../data/clientDataset.ts';
import type { Dataset } from '../data/schema/index.ts';
import type { Geography } from '../data/schema/geography.ts';
import type { LayoutOverrides } from '../data/schema/overrides.ts';
import {
  familiesForLayout,
  familyColumns,
  visibleFamilyIds,
} from '../layout/columns.ts';
import { layout } from '../layout/index.ts';
import type { LayoutInput, LayoutResult } from '../layout/types.ts';
import { connectorPaints, type ConnectorPaint } from './connectorInk.ts';
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
  connectors: ConnectorPaint[];
  bands: BandPaint[];
  result: LayoutResult;
}

const paintCache = new Map<string, PosterPaint>();
const PAINT_CACHE_LIMIT = 4;

function cacheKey(fold: readonly string[], pin: readonly string[]): string {
  return `${[...fold].sort().join(',')}|${[...pin].sort().join(',')}`;
}

/** Layout for a fold and pin. The same columns return the same object. */
export function posterFor(
  fold: readonly string[] = [],
  pin: readonly string[] = [],
): PosterPaint {
  const key = cacheKey(fold, pin);
  const hit = paintCache.get(key);
  if (hit) return hit;
  const dataset = clientDataset();
  const geography = bundledGeography();
  const families = familyColumns();
  const visible = visibleFamilyIds(families, fold, pin);
  const result = layout({
    ...posterLayoutInput(dataset, geography, clientOverrides()),
    visibleFamilies: familiesForLayout(visible, families.length),
  });
  const paint: PosterPaint = {
    ...posterPaint(dataset, result),
    connectors: connectorPaints(dataset, result.connectors),
    bands: bandPaints(dataset, result.bands, geography),
    result,
  };
  paintCache.set(key, paint);
  if (paintCache.size > PAINT_CACHE_LIMIT) {
    const oldest = paintCache.keys().next().value;
    if (oldest !== undefined) paintCache.delete(oldest);
  }
  return paint;
}

/** One layout of the bundled roster. Later tasks reuse `result`. */
export function posterModel(): PosterPaint {
  return posterFor();
}

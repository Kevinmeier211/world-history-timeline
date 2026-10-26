import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { bundledGeography } from '../src/data/catalog.ts';
import { datasetSchema } from '../src/data/schema/index.ts';
import { layoutOverridesSchema } from '../src/data/schema/overrides.ts';
import { clearLayoutCache, layout } from '../src/layout/index.ts';
import { labelHitPairs } from '../src/layout/labelTrack.ts';
import {
  droppedCallouts,
  gateFailures,
  labelFitByImportance,
  maxRibbonDrift,
  relationRouting,
  ribbonOverlap,
} from '../src/layout/metrics.ts';
import { loadDataset } from './load-dataset.ts';

const dataset = datasetSchema.parse(loadDataset());
const overrides = layoutOverridesSchema.parse(
  JSON.parse(readFileSync('src/data/layoutOverrides.json', 'utf8')),
);
const input = {
  polities: dataset.polities,
  relations: dataset.relations,
  callouts: dataset.callouts,
  bands: dataset.bands,
  geography: bundledGeography(),
  overrides,
  viewport: { width: 1500, height: 900, zoomX: 1, zoomY: 1 },
  visibleFamilies: [],
  visibleMacroRegions: [],
};

clearLayoutCache();
const coldStart = performance.now();
const result = layout(input);
const coldMs = performance.now() - coldStart;
clearLayoutCache();
const warmStart = performance.now();
layout(input);
const warmMs = performance.now() - warmStart;

const overlap = ribbonOverlap(result.ribbons);
const importance = new Map(
  dataset.polities.map((polity) => [polity.id, polity.importance]),
);
const fit = labelFitByImportance(result.labels, importance);
const tier3 = fit.get(3) ?? { fitted: 0, total: 0, rate: 1 };
const routing = relationRouting(dataset.relations, result.ribbons, result.connectors);
const callouts = droppedCallouts(result.callouts);
const drift = maxRibbonDrift(result.ribbons).slope;
const failures = gateFailures({
  overlaps: overlap.overlaps,
  unroutable: routing.unroutable,
  importance3Fit: tier3.rate,
  warmMs,
});

const fitJson = Object.fromEntries(
  [...fit.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([tier, row]) => [String(tier), row]),
);

const report = {
  zoomY: 1,
  ribbons: result.ribbons.length,
  polities: dataset.polities.length,
  overlaps: overlap.overlaps,
  minGap: overlap.minGap === null ? null : Math.round(overlap.minGap * 1000) / 1000,
  labelFit: fitJson,
  importance3Fit: tier3.rate,
  callouts,
  relations: {
    total: dataset.relations.length,
    routed: result.connectors.length,
    ...routing,
  },
  labelHits: labelHitPairs(result.labels).length,
  maxDrift: Math.round(drift * 1000) / 1000,
  runtimeMs: {
    cold: Math.round(coldMs),
    warm: Math.round(warmMs),
  },
  gates: {
    overlaps: overlap.overlaps === 0,
    unroutable: routing.unroutable === 0,
    importance3Fit: tier3.rate >= 0.9,
    runtimeMs: warmMs < 150,
    pass: failures.length === 0,
  },
  failures,
};

mkdirSync('docs/reports', { recursive: true });
writeFileSync(
  'docs/reports/layout-latest.json',
  `${JSON.stringify(report, null, 2)}\n`,
);

const fitLabel =
  tier3.total === 0
    ? 'n/a'
    : `${tier3.fitted}/${tier3.total} (${Math.round(tier3.rate * 100)}%)`;
console.log(
  [
    'layout:report',
    `ribbons ${report.ribbons}  overlaps ${report.overlaps}  minGap ${report.minGap ?? 'n/a'}`,
    `label fit importance>=3 ${fitLabel}`,
    `unroutable ${routing.unroutable}  omitted ${routing.omitted}`,
    `callouts dropped ${callouts.dropped}  markers ${callouts.markers}`,
    `label hits ${report.labelHits}`,
    `maxDrift ${drift.toFixed(2)}`,
    `runtime cold ${report.runtimeMs.cold}ms  warm ${report.runtimeMs.warm}ms`,
    failures.length === 0 ? 'gates pass' : `gates failed: ${failures.join(', ')}`,
  ].join('\n'),
);

if (failures.length > 0) process.exitCode = 1;

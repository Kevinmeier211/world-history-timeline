import { readFileSync, writeFileSync } from 'node:fs';

import { climateCurveSchema, datasetSchema } from '../src/data/schema/index.ts';
import { loadDataset } from './load-dataset.ts';
import { claimsFrom, unverifiedMarkdown } from './unverified-report.ts';

const dataset = datasetSchema.parse(loadDataset());
const climate = climateCurveSchema.parse(
  JSON.parse(readFileSync('src/data/climate.json', 'utf8')),
);
const markdown = unverifiedMarkdown(
  claimsFrom(dataset, climate),
  dataset.families.map((family) => family.id),
);
writeFileSync('docs/UNVERIFIED.md', markdown);
const flagged = markdown.match(/importance>=4 unverified: (\d+ of \d+)/);
console.log(
  `report:unverified wrote docs/UNVERIFIED.md (${markdown.split('\n').length} lines, ${flagged?.[1] ?? 'unknown'})`,
);

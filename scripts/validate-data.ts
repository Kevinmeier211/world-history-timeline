import { readFileSync } from 'node:fs';

import {
  layoutOverridesSchema,
  overrideTargetIssues,
} from '../src/data/schema/overrides.ts';
import { eraShortfalls, validateDataset } from '../src/data/validate.ts';
import { loadDataset, loadRoots } from './load-dataset.ts';

const loaded = loadDataset();
const roots = loadRoots();
const { issues, coverage, dataset } = validateDataset(loaded, roots);
const errors = issues.filter((issue) => issue.level === 'error');
const warnings = issues.filter((issue) => issue.level === 'warning');
const orphans = warnings.filter((issue) =>
  issue.message.includes('no inbound relation'),
);

if (coverage) {
  console.log('coverage by era', coverage.byEra);
  console.log('coverage by family', coverage.byFamily);
  console.log('coverage by macro-region', coverage.byMacroRegion);
  console.log('coverage by importance', coverage.byImportance);
  const short = eraShortfalls(coverage.byEra);
  if (short.length === 0) console.log('era floors: all §7 minimums met');
  else {
    for (const gap of short) {
      console.log(`era floor short: ${gap.id} ${gap.count}/${gap.floor}`);
    }
  }
}
console.log(
  'adjacent-lane color check: not run (lane pairs arrive with the layout report)',
);
for (const warning of warnings) console.log(`warning: ${warning.message}`);
for (const error of errors) console.error(`error: ${error.message}`);

const overrideParsed = layoutOverridesSchema.safeParse(
  JSON.parse(readFileSync('src/data/layoutOverrides.json', 'utf8')),
);
const overrideIssues = overrideParsed.success
  ? overrideTargetIssues(
      overrideParsed.data,
      new Set(dataset?.polities.map((polity) => polity.id) ?? []),
      new Set(dataset?.callouts.map((callout) => callout.id) ?? []),
    )
  : ['layout overrides failed schema'];
for (const message of overrideIssues) console.error(`error: ${message}`);

if (errors.length > 0 || overrideIssues.length > 0) {
  console.error(
    `validate:data failed (${errors.length + overrideIssues.length} errors, ${warnings.length} warnings)`,
  );
  process.exit(1);
}
console.log(
  `layout overrides ok (${overrideParsed.success ? overrideParsed.data.ribbons.length : 0} ribbons, ${overrideParsed.success ? overrideParsed.data.callouts.length : 0} callouts)`,
);

console.log(
  `validate:data ok (${dataset?.polities.length ?? 0} polities, ${roots.length} roots, ${orphans.length} orphan warnings, ${warnings.length} warnings)`,
);

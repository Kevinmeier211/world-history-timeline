import { loadDataset } from './load-dataset.ts';
import { validateDataset } from '../src/data/validate.ts';

const loaded = loadDataset();
const { issues, coverage, dataset } = validateDataset(loaded);
const errors = issues.filter((issue) => issue.level === 'error');
const warnings = issues.filter((issue) => issue.level === 'warning');

if (coverage) {
  console.log('coverage by era', coverage.byEra);
  console.log('coverage by family', coverage.byFamily);
  console.log('coverage by macro-region', coverage.byMacroRegion);
  console.log('coverage by importance', coverage.byImportance);
}
console.log(
  'adjacent-lane color check: not run (lane pairs arrive with the layout report)',
);
for (const warning of warnings) console.log(`warning: ${warning.message}`);
for (const error of errors) console.error(`error: ${error.message}`);

if (errors.length > 0) {
  console.error(
    `validate:data failed (${errors.length} errors, ${warnings.length} warnings)`,
  );
  process.exit(1);
}

console.log(
  `validate:data ok (${dataset?.polities.length ?? 0} polities, ${warnings.length} warnings)`,
);

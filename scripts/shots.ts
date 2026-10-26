import { spawnSync } from 'node:child_process';

const result = spawnSync(
  'playwright',
  ['test', 'tests/e2e/p3-poster.spec.ts', '--reporter=line'],
  { stdio: 'inherit' },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);

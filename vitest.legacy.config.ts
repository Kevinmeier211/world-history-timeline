import { mergeConfig, defineConfig } from 'vitest/config';
import base from './vite.config';

// The inherited poster/layout engine remains supported, but its coverage is
// deliberately separate from the current atlas application.
export default mergeConfig(
  base,
  defineConfig({
    test: {
      exclude: ['src/atlas/**', 'node_modules/**', 'output/**'],
      coverage: { reportsDirectory: 'output/legacy-engine/coverage' },
    },
  }),
);

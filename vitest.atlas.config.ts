import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import process from 'node:process';

// Current application coverage is reported separately from the inherited layout engine.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    maxWorkers: 2,
    include: ['src/atlas/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json-summary'],
      reportsDirectory:
        process.env.ATLAS_COVERAGE_DIR ?? 'output/current-candidate/coverage-atlas',
      include: ['src/atlas/**/*.{ts,tsx}'],
      exclude: ['src/atlas/**/*.test.ts'],
    },
  },
});

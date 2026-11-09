import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
  },
  build: {
    target: 'esnext',
    modulePreload: {
      // These readers recover through native imports after a failed request.
      // Preserve target preloads elsewhere, especially print views with CSS.
      resolveDependencies: (filename, dependencies, { hostType }) =>
        hostType === 'js' && /(?:^|\/)(?:Dossier|WorldContext|Notebook)-/.test(filename)
          ? dependencies.filter((dependency) => dependency !== filename)
          : dependencies,
    },
  },
  test: {
    maxWorkers: 2,
    environment: 'jsdom',
    passWithNoTests: true,
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary'],
      include: ['src/layout/**/*.ts'],
      exclude: ['src/layout/**/*.test.ts'],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});

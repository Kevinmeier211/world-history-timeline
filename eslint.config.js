import eslint from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// v1 folders stay ignored until T3.16 deletes them. Do not add new files here.
const v1Ignores = [
  'src/components/**',
  'src/utils/**',
  'src/styles/**',
  'src/App.tsx',
  'src/main.tsx',
  'src/types/**',
  'src/data/politiesWest.ts',
  'src/data/politiesEast.ts',
  'src/data/historicalNodes.ts',
  'src/data/regionsAndEras.ts',
  'src/data/index.ts',
];

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'dist-print/**',
      'media-cache/**',
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      ...v1Ignores,
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs.flat.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);

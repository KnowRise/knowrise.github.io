import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs['flat/recommended'].rules,
      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript sudah memeriksa unresolved identifier, dan dia juga
      // memahami type-only import. Mematikan no-undef menghindari false
      // positive pada namespace React di file .tsx.
      'no-undef': 'off',

      // Base rule tidak memahami type usage; rule versi TS di bawah
      // yang dipakai.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // Pola "const { a, ...rest } = obj" untuk membuang satu properti
          // memang membuat a tidak terpakai, dan itu disengaja.
          ignoreRestSiblings: true,
        },
      ],

      // Query builder Supabase sering perlu `any` untuk chaining
      // .or() / .ilike() tanpa narrowing.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

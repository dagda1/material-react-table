import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import muiPathImports from 'eslint-plugin-mui-path-imports';
import perfectionist from 'eslint-plugin-perfectionist';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/dist/',
      '**/locales/',
      '**/node_modules/',
      '**/storybook-static/',
      '**/stories/',
    ],
  },
  js.configs.recommended,
  ...storybook.configs['flat/recommended'],
  perfectionist.configs['recommended-natural'],
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'mui-path-imports': muiPathImports,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'mui-path-imports/mui-path-imports': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-useless-assignment': 'off',
    },
  },
];

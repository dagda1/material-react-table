import config from '@cutting/oxc-config/react';

export default {
  ...config,
  ignorePatterns: [...config.ignorePatterns, '**/locales/**', '**/storybook-static/**'],
  overrides: [
    ...config.overrides,
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'cutting/no-react-namespace-types': 'off',
        'cutting/no-test-code-imports': 'off',
        'max-lines': 'off',
        'sonarjs/class-name': 'off',
        'sonarjs/cognitive-complexity': 'off',
        'sonarjs/no-nested-assignment': 'off',
        'sonarjs/no-nested-conditional': 'off',
        'sonarjs/pseudo-random': 'off',
        'sonarjs/use-type-alias': 'off',
        'storybook/prefer-pascal-case': 'off',
      },
    },
  ],
};

import config from '@cutting/oxc-config/react';

export default {
  ...config,
  ignorePatterns: [...config.ignorePatterns, '**/locales/**', '**/storybook-static/**'],
};

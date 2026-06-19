import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^react-transition-group\/(.*)$/,
        replacement: 'react-transition-group/esm/$1.js',
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: false,
    server: {
      deps: {
        inline: [/@mui\//, /react-transition-group/],
      },
    },
    setupFiles: ['./src/vitest.setup.ts'],
  },
});

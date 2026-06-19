import { defineConfig } from 'vitest/config';

export default defineConfig({
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

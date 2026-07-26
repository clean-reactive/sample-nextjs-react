import { URL, fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';
import env from 'vite-plugin-env-compatible';

export default defineConfig({
  test: {
    // e2e tests run under Playwright (see playwright.config.ts); keep them out
    // of the unit run.
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    coverage: {
      provider: 'istanbul',
      reportsDirectory: './tests/coverage',
    },
  },
  plugins: [env()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
});

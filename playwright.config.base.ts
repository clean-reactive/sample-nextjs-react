import { defineConfig, devices } from '@playwright/test';

const DEFAULT_PORT = '3222';

// Exported so tests/e2e/app/helpers.ts can point browser-context cookies at
// the same origin the webServer answers on.
export const E2E_BASE_URL = `http://localhost:${DEFAULT_PORT}`;

export interface E2eBackendOptions {
  serverEnv: Record<string, string>;
  // Runs before `next start`: resets the backend's data files and does any
  // further setup it needs (e.g. sqlite applying migrations).
  beforeStart: string;
}

// Shared e2e config. Everything backend-specific arrives via `options`, so each
// target is a thin config file calling this — no .env files involved.
export function defineE2eConfig(options: E2eBackendOptions) {
  const { serverEnv, beforeStart } = options;
  const baseURL = E2E_BASE_URL;

  // tests/e2e/app/helpers.ts builds its own DI container in this process
  // (calling BFF use-cases directly instead of going over HTTP), so it needs
  // the same backend selection as the `next start` server spawned below.
  Object.assign(process.env, serverEnv);

  return defineConfig({
    testDir: './tests/e2e',
    // One server is shared across specs; keep the run serial.
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    timeout: 30_000,
    reporter: 'list',
    use: { baseURL, trace: 'on-first-retry' },
    webServer: {
      // Run the backend's beforeStart (data reset + any setup), then serve the
      // built artifact. `env` is what selects the backend.
      command: `${beforeStart} && node_modules/.bin/next start -p ${DEFAULT_PORT}`,
      url: `${baseURL}/sign-in`,
      env: serverEnv,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    projects: [
      // Tests are grouped by folder: API tests drive the route handlers
      // directly and need no browser; app tests drive the pages in Chromium
      // (`npx playwright install chromium`).
      { name: 'api', testDir: './tests/e2e/api' },
      {
        name: 'app',
        testDir: './tests/e2e/app',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
  });
}

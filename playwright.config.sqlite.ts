import { defineE2eConfig } from './playwright.config.base';

const DATABASE_FILE = 'e2e.sqlite.local.db';

// sqlite e2e target. Run with `playwright test -c playwright.config.sqlite.ts`.
export default defineE2eConfig({
  serverEnv: {
    PERSISTENCE: 'sqlite',
    DATABASE_URL: `file:${DATABASE_FILE}`,
    // DrizzleConnection requires this to be set, but a local file db doesn't
    // check it — any value works.
    DATABASE_AUTH_TOKEN: 'e2e-local-placeholder',
  },
  beforeStart: `node scripts/reset-e2e-data.mjs ${DATABASE_FILE} && node scripts/migrate-e2e-db.mjs`,
});

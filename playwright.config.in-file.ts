import { defineE2eConfig } from './playwright.config.base';

const USERS_FILE = 'e2e.in-file-users.local.json';
const TODOS_FILE = 'e2e.in-file-todos.local.json';

// in-file e2e target. Run with `playwright test -c playwright.config.in-file.ts`.
export default defineE2eConfig({
  serverEnv: {
    PERSISTENCE: 'in-file',
    IN_FILE_USERS_FILE: USERS_FILE,
    IN_FILE_TODOS_FILE: TODOS_FILE,
  },
  beforeStart: `node scripts/reset-e2e-data.mjs ${USERS_FILE} ${TODOS_FILE}`,
});

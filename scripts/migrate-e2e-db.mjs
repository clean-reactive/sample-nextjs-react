import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

// Applies drizzle/migrations to the DATABASE_URL database. Runs after
// reset-e2e-data.mjs deleted the file and before `next start`, so the sqlite
// repositories find their tables (unlike the in-file repos, they don't seed
// their store on construction).
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('migrate-e2e-db: DATABASE_URL is not set');
  process.exit(1);
}

const client = createClient({ url });
await migrate(drizzle(client), { migrationsFolder: 'drizzle/migrations' });
client.close();

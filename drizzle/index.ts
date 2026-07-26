import { createClient, ResultSet } from '@libsql/client';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import { must } from '@/lib/utils';
import { sessions, todos, users } from './schema';

type Schema = {
  users: typeof users;
  sessions: typeof sessions;
  todos: typeof todos;
};

export type Transaction = SQLiteTransaction<
  'async',
  ResultSet,
  Schema,
  ExtractTablesWithRelations<Schema>
>;

export class DrizzleConnection {
  private static instance: DrizzleConnection | undefined;

  static make(): DrizzleConnection {
    if (!DrizzleConnection.instance) {
      DrizzleConnection.instance = new DrizzleConnection(
        must(process.env.DATABASE_URL),
        must(process.env.DATABASE_AUTH_TOKEN)
      );
    }
    return DrizzleConnection.instance;
  }

  readonly db: LibSQLDatabase<Schema>;
  readonly luciaAdapter: DrizzleSQLiteAdapter;

  constructor(url: string, authToken: string) {
    const client = createClient({ url, authToken });
    this.db = drizzle(client, { schema: { users, sessions, todos } });
    this.luciaAdapter = new DrizzleSQLiteAdapter(this.db, sessions, users);
  }
}

import { migrate } from 'drizzle-orm/libsql/migrator';

import { DrizzleConnection } from '@/drizzle';
import { todos, users } from '@/drizzle/schema';
import type { Todo, TodoInsert } from '@/src/entities/models/todo';
import type { User } from '@/src/entities/models/user';

export function newSqliteTestConnection(): DrizzleConnection {
  return new DrizzleConnection('file::memory:', 'unit-test-auth-token');
}

export async function migrateSqliteTestDb(
  connection: DrizzleConnection
): Promise<void> {
  await migrate(connection.db, { migrationsFolder: 'drizzle/migrations' });
}

export async function clearSqliteTestDb(
  connection: DrizzleConnection
): Promise<void> {
  await connection.db.delete(todos);
  await connection.db.delete(users);
}

// Writes straight to the table, bypassing the repository under test, so
// tests preparing state for a *different* repo method (e.g. seeding for
// getTodo/getUser) don't also depend on createTodo/createUser working.
// Pure command, no return value — read seeded state back via
// getAllTodos/getAllUsers instead of trusting what insert reports.
// todos.user_id is a foreign key, so tests need a real user row before
// creating a todo for that userId.
export async function insertTestUser(
  connection: DrizzleConnection,
  id: string
): Promise<void> {
  await connection.db.insert(users).values({
    id,
    username: `${id}-name`,
    password_hash: 'password_hash',
  });
}

export async function insertTestTodo(
  connection: DrizzleConnection,
  todo: TodoInsert
): Promise<void> {
  await connection.db.insert(todos).values(todo);
}

// Reads straight off the table, bypassing the repository under test, so
// tests can assert against the db independently of the repo's own read
// methods.
export async function getAllTodos(
  connection: DrizzleConnection
): Promise<Todo[]> {
  return connection.db.select().from(todos);
}

export async function getAllUsers(
  connection: DrizzleConnection
): Promise<User[]> {
  return connection.db.select().from(users);
}

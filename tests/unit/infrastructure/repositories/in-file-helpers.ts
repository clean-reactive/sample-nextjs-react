import { readFileSync, writeFileSync } from 'node:fs';

import type { Todo } from '@/src/entities/models/todo';
import type { User } from '@/src/entities/models/user';

// Reads/writes straight to the file, bypassing the repository under test, so
// tests preparing state for a *different* repo method (e.g. seeding for
// getTodo/getUser) don't also depend on createTodo/createUser working.
export function readTodosFile(file: string): Todo[] {
  return JSON.parse(readFileSync(file, 'utf8')) as Todo[];
}

export function writeTodosFile(file: string, todos: Todo[]): void {
  writeFileSync(file, JSON.stringify(todos, null, 2));
}

export function readUsersFile(file: string): User[] {
  return JSON.parse(readFileSync(file, 'utf8')) as User[];
}

export function writeUsersFile(file: string, users: User[]): void {
  writeFileSync(file, JSON.stringify(users, null, 2));
}

import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, rmSync } from 'node:fs';

import { todoFactory } from '@/src/entities/models/todo.factory';
import { todoInsertFactory } from '@/src/entities/models/todo-insert.factory';
import { InFileTodosRepository } from '@/src/infrastructure/repositories/todos.repository.in-file';
import { readTodosFile, writeTodosFile } from './in-file-helpers';

const TEST_FILE = 'unit-in-file-todos.local.json';

describe(`${InFileTodosRepository.name}`, () => {
  beforeEach(() => {
    rmSync(TEST_FILE, { force: true });
  });

  afterAll(() => {
    rmSync(TEST_FILE, { force: true });
  });

  describe('when the file does not exist', () => {
    it('does not create the file on construction', () => {
      new InFileTodosRepository(TEST_FILE);

      expect(existsSync(TEST_FILE)).toBe(false);
    });

    it('reads as an empty store without creating the file', async () => {
      const repo = new InFileTodosRepository(TEST_FILE);

      expect(await repo.getTodosForUser('user-1')).toEqual([]);
      expect(existsSync(TEST_FILE)).toBe(false);
    });

    it('creates the file once a write happens', async () => {
      const repo = new InFileTodosRepository(TEST_FILE);

      await repo.createTodo(todoInsertFactory.item());

      expect(existsSync(TEST_FILE)).toBe(true);
      expect(readTodosFile(TEST_FILE)).toHaveLength(1);
    });
  });

  describe('createTodo', () => {
    it('appends with an incremented id and persists it', async () => {
      const existing = todoFactory.item({ id: 4 });
      writeTodosFile(TEST_FILE, [existing]);
      const repo = new InFileTodosRepository(TEST_FILE);

      const created = await repo.createTodo(todoInsertFactory.item());

      expect(created.id).toBe(5);
      expect(readTodosFile(TEST_FILE)).toEqual([existing, created]);
    });

    it('starts ids at 1 for an empty store', async () => {
      writeTodosFile(TEST_FILE, []);
      const repo = new InFileTodosRepository(TEST_FILE);

      const created = await repo.createTodo(todoInsertFactory.item());

      expect(created.id).toBe(1);
    });
  });

  describe('getTodo', () => {
    it('returns the matching todo', async () => {
      const [first, second] = todoFactory.list({ count: 2 });
      writeTodosFile(TEST_FILE, [first, second]);
      const repo = new InFileTodosRepository(TEST_FILE);

      expect(await repo.getTodo(second.id)).toEqual(second);
    });

    it('returns undefined when not found', async () => {
      writeTodosFile(TEST_FILE, todoFactory.list({ count: 1 }));
      const repo = new InFileTodosRepository(TEST_FILE);

      expect(await repo.getTodo(999)).toBeUndefined();
    });
  });

  describe('getTodosForUser', () => {
    it("returns only the given user's todos", async () => {
      const todos = todoFactory.list({
        partials: [{ userId: 'alice' }, { userId: 'bob' }, { userId: 'alice' }],
      });
      writeTodosFile(TEST_FILE, todos);
      const repo = new InFileTodosRepository(TEST_FILE);

      const result = await repo.getTodosForUser('alice');

      expect(result).toEqual([todos.at(0), todos.at(2)]);
    });
  });

  describe('updateTodo', () => {
    it('merges the given fields and persists', async () => {
      const todo = todoFactory.item({ completed: false });
      writeTodosFile(TEST_FILE, [todo]);
      const repo = new InFileTodosRepository(TEST_FILE);

      const updated = await repo.updateTodo(todo.id, { completed: true });

      expect(updated).toEqual({ ...todo, completed: true });
      expect(readTodosFile(TEST_FILE).at(0)?.completed).toBe(true);
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo and persists', async () => {
      const [first, second] = todoFactory.list({ count: 2 });
      writeTodosFile(TEST_FILE, [first, second]);
      const repo = new InFileTodosRepository(TEST_FILE);

      await repo.deleteTodo(first.id);

      expect(readTodosFile(TEST_FILE)).toEqual([second]);
    });
  });

  it('persists across instances (file-backed, not in-memory)', async () => {
    writeTodosFile(TEST_FILE, []);
    const input = todoInsertFactory.item({ todo: 'persist me' });
    await new InFileTodosRepository(TEST_FILE).createTodo(input);

    const todos = await new InFileTodosRepository(TEST_FILE).getTodosForUser(
      input.userId
    );

    expect(todos.map((t) => t.todo)).toEqual(['persist me']);
  });
});

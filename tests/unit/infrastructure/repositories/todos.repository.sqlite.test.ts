import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { SqliteTodosRepository } from '@/src/infrastructure/repositories/todos.repository.sqlite';
import { todoInsertFactory } from '@/src/entities/models/todo-insert.factory';
import {
  clearSqliteTestDb,
  getAllTodos,
  insertTestTodo,
  insertTestUser,
  migrateSqliteTestDb,
  newSqliteTestConnection,
} from './sqlite-helpers';

describe(`${SqliteTodosRepository.name}`, () => {
  const connection = newSqliteTestConnection();
  const repo = new SqliteTodosRepository(connection);

  beforeAll(async () => {
    await migrateSqliteTestDb(connection);
  });

  beforeEach(async () => {
    todoInsertFactory.resetCount();
    await clearSqliteTestDb(connection);
  });

  describe('createTodo', () => {
    it('assigns an incrementing id and persists the row', async () => {
      const todo0 = todoInsertFactory.item();
      const todo1 = todoInsertFactory.item();
      await insertTestUser(connection, todo0.userId);
      await insertTestUser(connection, todo1.userId);

      const first = await repo.createTodo(todo0);
      const second = await repo.createTodo(todo1);

      expect(await getAllTodos(connection)).toEqual([first, second]);
    });

    it('persists the given fields', async () => {
      const input = todoInsertFactory.item({
        todo: 'walk dog',
        completed: true,
      });
      await insertTestUser(connection, input.userId);

      await repo.createTodo(input);

      const todos = await getAllTodos(connection);
      expect(todos).toHaveLength(1);
      expect(todos.at(0)).toMatchObject(input);
    });

    // The `tx` parameter is what lets a use case make several writes atomic.
    // Without these cases the transactional branch is never exercised - every
    // other call goes through `this.db` and autocommits.
    it('commits the write when the transaction it joins commits', async () => {
      const input = todoInsertFactory.item();
      await insertTestUser(connection, input.userId);

      const created = await connection.db.transaction((tx) =>
        repo.createTodo(input, tx)
      );

      expect(await getAllTodos(connection)).toEqual([created]);
    });

    it('discards the write when the transaction it joins rolls back', async () => {
      const input = todoInsertFactory.item();
      await insertTestUser(connection, input.userId);

      await expect(
        connection.db.transaction(async (tx) => {
          await repo.createTodo(input, tx);
          // Throwing is how a transaction is rolled back - the contract the
          // transaction manager and its use cases rely on.
          throw new Error('abort');
        })
      ).rejects.toThrow('abort');

      expect(await getAllTodos(connection)).toEqual([]);
    });
  });

  describe('getTodo', () => {
    it('returns the matching todo', async () => {
      const todo = todoInsertFactory.item();
      await insertTestUser(connection, todo.userId);
      await insertTestTodo(connection, todo);
      const [seeded] = await getAllTodos(connection);

      expect(await repo.getTodo(seeded.id)).toEqual(seeded);
    });

    it('returns undefined when not found', async () => {
      expect(await repo.getTodo(999)).toBeUndefined();
    });
  });

  describe('getTodosForUser', () => {
    it("returns only the given user's todos", async () => {
      const alice1 = todoInsertFactory.item({ userId: 'alice' });
      const bob1 = todoInsertFactory.item({ userId: 'bob' });
      const alice2 = todoInsertFactory.item({ userId: 'alice' });
      await insertTestUser(connection, alice1.userId);
      await insertTestUser(connection, bob1.userId);
      await insertTestTodo(connection, alice1);
      await insertTestTodo(connection, bob1);
      await insertTestTodo(connection, alice2);

      const result = await repo.getTodosForUser('alice');

      expect(result.map(({ id: _id, ...rest }) => rest)).toEqual([
        alice1,
        alice2,
      ]);
    });

    it('returns an empty list for a user with no todos', async () => {
      expect(await repo.getTodosForUser('nobody')).toEqual([]);
    });
  });

  describe('updateTodo', () => {
    it('merges the given fields and persists', async () => {
      const todo = todoInsertFactory.item({ completed: false });
      await insertTestUser(connection, todo.userId);
      await insertTestTodo(connection, todo);
      const [seeded] = await getAllTodos(connection);

      const updated = await repo.updateTodo(seeded.id, { completed: true });

      expect(updated).toEqual({ ...seeded, completed: true });
      expect(await getAllTodos(connection)).toEqual([updated]);
    });

    it('returns undefined when the todo does not exist', async () => {
      expect(await repo.updateTodo(999, { completed: true })).toBeUndefined();
    });

    it('discards the update when the transaction it joins rolls back', async () => {
      const todo = todoInsertFactory.item({ completed: false });
      await insertTestUser(connection, todo.userId);
      await insertTestTodo(connection, todo);
      const [seeded] = await getAllTodos(connection);

      await expect(
        connection.db.transaction(async (tx) => {
          await repo.updateTodo(seeded.id, { completed: true }, tx);
          throw new Error('abort');
        })
      ).rejects.toThrow('abort');

      expect(await getAllTodos(connection)).toEqual([seeded]);
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo', async () => {
      const todo = todoInsertFactory.item();
      await insertTestUser(connection, todo.userId);
      await insertTestTodo(connection, todo);
      const [seeded] = await getAllTodos(connection);

      await repo.deleteTodo(seeded.id);

      expect(await getAllTodos(connection)).toEqual([]);
    });

    it('is a no-op for a non-existent id', async () => {
      await expect(repo.deleteTodo(999)).resolves.toBeUndefined();
    });

    it('restores the row when the transaction it joins rolls back', async () => {
      const todo = todoInsertFactory.item();
      await insertTestUser(connection, todo.userId);
      await insertTestTodo(connection, todo);
      const [seeded] = await getAllTodos(connection);

      await expect(
        connection.db.transaction(async (tx) => {
          await repo.deleteTodo(seeded.id, tx);
          throw new Error('abort');
        })
      ).rejects.toThrow('abort');

      expect(await getAllTodos(connection)).toEqual([seeded]);
    });
  });
});

import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, rmSync } from 'node:fs';

import { InFileTodosRepository } from '@/src/infrastructure/repositories/todos.repository.in-file';
import { InFileTransactionManagerService } from '@/src/infrastructure/services/transaction-manager.service.in-file';
import { todoFactory } from '@/src/entities/models/todo.factory';
import { readTodosFile, writeTodosFile } from '../repositories/in-file-helpers';

const TEST_FILE = 'unit-in-file-tx-todos.local.json';

describe(`${InFileTransactionManagerService.name}`, () => {
  const repository = new InFileTodosRepository(TEST_FILE);
  const transactionManager = new InFileTransactionManagerService([TEST_FILE]);

  beforeEach(() => {
    rmSync(TEST_FILE, { force: true });
  });

  afterAll(() => {
    rmSync(TEST_FILE, { force: true });
  });

  it('keeps the writes when the callback resolves', async () => {
    const todo = todoFactory.item({ completed: false });
    writeTodosFile(TEST_FILE, [todo]);

    await transactionManager.startTransaction(() =>
      repository.updateTodo(todo.id, { completed: true })
    );

    expect(readTodosFile(TEST_FILE).at(0)?.completed).toBe(true);
  });

  it('reverts the writes when the callback throws', async () => {
    const todo = todoFactory.item({ completed: false });
    writeTodosFile(TEST_FILE, [todo]);

    await expect(
      transactionManager.startTransaction(async () => {
        await repository.updateTodo(todo.id, { completed: true });
        throw new Error('abort');
      })
    ).rejects.toThrow('abort');

    expect(readTodosFile(TEST_FILE)).toEqual([todo]);
  });

  it('removes a file the callback created before throwing', async () => {
    await expect(
      transactionManager.startTransaction(async () => {
        await repository.createTodo(todoFactory.item({ completed: false }));
        throw new Error('abort');
      })
    ).rejects.toThrow('abort');

    expect(existsSync(TEST_FILE)).toBe(false);
  });
});

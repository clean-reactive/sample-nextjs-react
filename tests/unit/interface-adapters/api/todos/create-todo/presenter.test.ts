import { describe, expect, it, vi } from 'vitest';

import { createTodoApiPresenter } from '@/src/interface-adapters/api/todos/create-todo/presenter';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { todoFactory } from '@/src/entities/models/todo.factory';

describe(`${createTodoApiPresenter.name}`, () => {
  it('maps an InputParseError to a 400 failure', async () => {
    const presenter = createTodoApiPresenter();

    await expect(
      presenter(new InputParseError('Invalid data'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    });
  });

  it('maps an UnauthenticatedError to a 401 failure', async () => {
    const presenter = createTodoApiPresenter();

    await expect(
      presenter(new UnauthenticatedError('Unauthenticated'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Unauthenticated' },
      init: { status: 401 },
    });
  });

  it('maps an UnknownError to a 500 failure', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const presenter = createTodoApiPresenter();

    await expect(presenter(new UnknownError('boom'))).resolves.toEqual({
      status: 'failure',
      body: { error: 'An unexpected error occurred' },
      init: { status: 500 },
    });

    consoleErrorSpy.mockRestore();
  });

  it('maps a list of todos to a success result', async () => {
    const presenter = createTodoApiPresenter();
    const todos = todoFactory.list({ count: 2 });

    await expect(presenter(todos)).resolves.toEqual({
      status: 'success',
      body: {
        todos: todos.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          userId: todo.userId,
          completed: todo.completed,
        })),
      },
      init: { status: 201 },
    });
  });
});

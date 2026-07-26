import { describe, expect, it, vi } from 'vitest';

import { toggleTodoApiPresenter } from '@/src/interface-adapters/api/todos/toggle-todo/presenter';
import {
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import {
  InputParseError,
  NotFoundError,
  UnknownError,
} from '@/src/entities/errors/common';
import { todoFactory } from '@/src/entities/models/todo.factory';

describe(`${toggleTodoApiPresenter.name}`, () => {
  it('maps an InputParseError to a 400 failure', async () => {
    const presenter = toggleTodoApiPresenter();

    await expect(
      presenter(new InputParseError('Invalid data'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    });
  });

  it('maps an UnauthenticatedError to a 401 failure', async () => {
    const presenter = toggleTodoApiPresenter();

    await expect(
      presenter(new UnauthenticatedError('Unauthenticated'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Unauthenticated' },
      init: { status: 401 },
    });
  });

  it('maps a NotFoundError to a 404 failure', async () => {
    const presenter = toggleTodoApiPresenter();

    await expect(
      presenter(new NotFoundError('Todo not found'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Todo not found' },
      init: { status: 404 },
    });
  });

  it('maps an UnauthorizedError to a 403 failure', async () => {
    const presenter = toggleTodoApiPresenter();

    await expect(
      presenter(new UnauthorizedError('Unauthorized'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Unauthorized' },
      init: { status: 403 },
    });
  });

  it('maps an UnknownError to a 500 failure', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const presenter = toggleTodoApiPresenter();

    await expect(presenter(new UnknownError('boom'))).resolves.toEqual({
      status: 'failure',
      body: { error: 'An unexpected error occurred' },
      init: { status: 500 },
    });

    consoleErrorSpy.mockRestore();
  });

  it('maps a todo to a success result', async () => {
    const presenter = toggleTodoApiPresenter();
    const todo = todoFactory.item();

    await expect(presenter(todo)).resolves.toEqual({
      status: 'success',
      body: {
        id: todo.id,
        todo: todo.todo,
        userId: todo.userId,
        completed: todo.completed,
      },
    });
  });
});

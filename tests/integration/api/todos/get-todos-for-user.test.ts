import { describe, expect, it, vi, beforeEach, Mocked } from 'vitest';

import type { IGetTodosForUserApiController } from '@/src/interface-adapters/api/todos/get-todos-for-user/contract';
import { createTodosRepositoryMock } from '@/src/infrastructure/repositories/todos.repository.mock';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { todoFactory } from '@/src/entities/models/todo.factory';
import { userFactory } from '@/src/entities/models/user.factory';
import { TestBed } from '@/tests/integration/test-bed';
import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { getTodosForUserApiController } from '@/src/interface-adapters/api/todos/get-todos-for-user/controller';

type Context = {
  controller: IGetTodosForUserApiController;
  todosRepository: Mocked<ITodosRepository>;
  authenticationService: Mocked<IAuthenticationService>;
};

describe(`${getTodosForUserApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.todosRepository = createTodosRepositoryMock();
    ctx.authenticationService = createAuthenticationServiceMock();

    const testBed = TestBed.make();
    testBed.override('ITodosRepository', ctx.todosRepository);
    testBed.override('IAuthenticationService', ctx.authenticationService);

    ctx.controller = testBed.inject('IGetTodosForUserApiController');
  });

  it<Context>('returns 401 when no session id is provided', async (ctx) => {
    await expect(ctx.controller(undefined)).resolves.toEqual({
      status: 'failure',
      body: { error: 'Unauthenticated' },
      init: { status: 401 },
    });

    expect(ctx.authenticationService.validateSession).not.toHaveBeenCalled();
  });

  it<Context>('returns 401 when the session fails to validate', async (ctx) => {
    ctx.authenticationService.validateSession.mockRejectedValue(
      new AuthenticationError('Invalid session')
    );

    await expect(ctx.controller('bad-session-id')).resolves.toEqual({
      status: 'failure',
      body: { error: 'Unauthenticated' },
      init: { status: 401 },
    });
  });

  it<Context>('returns the mapped todos for the session user', async (ctx) => {
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });
    const todos = todoFactory.list({ count: 2, partial: { userId: user.id } });
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });
    ctx.todosRepository.getTodosForUser.mockResolvedValue(todos);

    await expect(ctx.controller(session.id)).resolves.toEqual({
      status: 'success',
      body: {
        todos: todos.map((todo) => ({
          id: todo.id,
          todo: todo.todo,
          userId: todo.userId,
          completed: todo.completed,
        })),
      },
    });

    expect(ctx.todosRepository.getTodosForUser).toHaveBeenCalledWith(user.id);
  });

  it<Context>('returns 500 when the repository throws unexpectedly', async (ctx) => {
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });
    ctx.todosRepository.getTodosForUser.mockRejectedValue(new Error('boom'));
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(ctx.controller(session.id)).resolves.toEqual({
      status: 'failure',
      body: { error: 'An unexpected error occurred' },
      init: { status: 500 },
    });

    consoleErrorSpy.mockRestore();
  });
});

import { describe, it, expect, beforeEach, type Mocked } from 'vitest';

import {
  getTodosForUserUseCase,
  type GetTodosForUserInputData,
  type GetTodosForUserOutputData,
} from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { createTodosRepositoryMock } from '@/src/infrastructure/repositories/todos.repository.mock';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { UnknownError } from '@/src/entities/errors/common';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { todoFactory } from '@/src/entities/models/todo.factory';
import { userFactory } from '@/src/entities/models/user.factory';

const presenter = async <T>(output: T): Promise<T> => output;

type UseCase = (
  input: GetTodosForUserInputData
) => Promise<GetTodosForUserOutputData>;

type Context = {
  useCase: UseCase;
  todosRepository: Mocked<ITodosRepository>;
  authenticationService: Mocked<IAuthenticationService>;
};

describe(`${getTodosForUserUseCase.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.todosRepository = createTodosRepositoryMock();
    ctx.authenticationService = createAuthenticationServiceMock();
    ctx.useCase = getTodosForUserUseCase(
      ctx.todosRepository,
      ctx.authenticationService,
      presenter
    );
  });

  it<Context>('returns an UnauthenticatedError when no sessionId is provided', async (ctx) => {
    await expect(ctx.useCase({})).resolves.toBeInstanceOf(UnauthenticatedError);
  });

  it<Context>('returns todos for the session user', async (ctx) => {
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });
    const todos = todoFactory.list({ count: 2, partial: { userId: user.id } });
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });
    ctx.todosRepository.getTodosForUser.mockResolvedValue(todos);

    await expect(ctx.useCase({ sessionId: session.id })).resolves.toBe(todos);

    expect(ctx.authenticationService.validateSession).toHaveBeenCalledWith(
      session.id
    );
    expect(ctx.todosRepository.getTodosForUser).toHaveBeenCalledWith(user.id);
  });

  it<Context>('propagates an UnauthenticatedError thrown while validating the session', async (ctx) => {
    const error = new UnauthenticatedError('Session expired');
    ctx.authenticationService.validateSession.mockRejectedValue(error);

    await expect(ctx.useCase({ sessionId: 'session-id' })).resolves.toBe(error);
  });

  it<Context>('propagates an AuthenticationError thrown while validating the session', async (ctx) => {
    const error = new AuthenticationError('Invalid session');
    ctx.authenticationService.validateSession.mockRejectedValue(error);

    await expect(ctx.useCase({ sessionId: 'session-id' })).resolves.toBe(error);
  });

  it<Context>('returns an UnknownError when any other error is thrown', async (ctx) => {
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });
    ctx.todosRepository.getTodosForUser.mockRejectedValue(new Error('boom'));

    await expect(
      ctx.useCase({ sessionId: session.id })
    ).resolves.toBeInstanceOf(UnknownError);
  });
});

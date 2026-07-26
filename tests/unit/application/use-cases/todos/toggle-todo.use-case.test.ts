import { describe, it, expect, beforeEach, type Mocked } from 'vitest';

import {
  toggleTodoUseCase,
  type ToggleTodoInputData,
  type ToggleTodoOutputData,
} from '@/src/application/use-cases/todos/toggle-todo.use-case';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { createTodosRepositoryMock } from '@/src/infrastructure/repositories/todos.repository.mock';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import {
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import {
  InputParseError,
  NotFoundError,
  UnknownError,
} from '@/src/entities/errors/common';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { todoFactory } from '@/src/entities/models/todo.factory';
import { userFactory } from '@/src/entities/models/user.factory';
import type { User } from '@/src/entities/models/user';
import type { Session } from '@/src/entities/models/session';

const presenter = async <T>(output: T): Promise<T> => output;

type UseCase = (input: ToggleTodoInputData) => Promise<ToggleTodoOutputData>;

type Context = {
  useCase: UseCase;
  todosRepository: Mocked<ITodosRepository>;
  authenticationService: Mocked<IAuthenticationService>;
  user: User;
  session: Session;
};

describe(`${toggleTodoUseCase.name}`, () => {
  beforeEach<Context>((ctx) => {
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });

    ctx.user = user;
    ctx.session = session;
    ctx.todosRepository = createTodosRepositoryMock();
    ctx.authenticationService = createAuthenticationServiceMock();
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });
    ctx.useCase = toggleTodoUseCase(
      ctx.todosRepository,
      ctx.authenticationService,
      presenter
    );
  });

  it<Context>('returns an UnauthenticatedError when no sessionId is provided', async (ctx) => {
    await expect(ctx.useCase({ todoId: 1 })).resolves.toBeInstanceOf(
      UnauthenticatedError
    );
  });

  it<Context>('propagates an UnauthenticatedError thrown while validating the session', async (ctx) => {
    const error = new UnauthenticatedError('Session expired');
    ctx.authenticationService.validateSession.mockRejectedValue(error);

    await expect(
      ctx.useCase({ sessionId: 'session-id', todoId: 1 })
    ).resolves.toBe(error);
  });

  it<Context>('returns an InputParseError when the todoId is missing', async (ctx) => {
    await expect(
      ctx.useCase({ sessionId: ctx.session.id })
    ).resolves.toBeInstanceOf(InputParseError);
  });

  it<Context>('returns an InputParseError when the todoId is not an integer', async (ctx) => {
    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todoId: 1.5 })
    ).resolves.toBeInstanceOf(InputParseError);

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todoId: NaN })
    ).resolves.toBeInstanceOf(InputParseError);

    expect(ctx.todosRepository.getTodo).not.toHaveBeenCalled();
  });

  it<Context>('returns a NotFoundError when the todo does not exist', async (ctx) => {
    ctx.todosRepository.getTodo.mockResolvedValue(undefined);

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todoId: 1 })
    ).resolves.toBeInstanceOf(NotFoundError);
  });

  it<Context>('returns an UnauthorizedError when the todo belongs to another user', async (ctx) => {
    const todo = todoFactory.item({ userId: 'another-user-id' });
    ctx.todosRepository.getTodo.mockResolvedValue(todo);

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todoId: todo.id })
    ).resolves.toBeInstanceOf(UnauthorizedError);

    expect(ctx.todosRepository.updateTodo).not.toHaveBeenCalled();
  });

  it<Context>('toggles the todo and returns the updated todo', async (ctx) => {
    const todo = todoFactory.item({ userId: ctx.user.id, completed: false });
    const updatedTodo = { ...todo, completed: true };
    ctx.todosRepository.getTodo.mockResolvedValue(todo);
    ctx.todosRepository.updateTodo.mockResolvedValue(updatedTodo);

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todoId: todo.id })
    ).resolves.toBe(updatedTodo);

    expect(ctx.todosRepository.updateTodo).toHaveBeenCalledWith(todo.id, {
      completed: true,
    });
  });

  it<Context>('returns an UnknownError when any other error is thrown', async (ctx) => {
    ctx.todosRepository.getTodo.mockRejectedValue(new Error('boom'));

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todoId: 1 })
    ).resolves.toBeInstanceOf(UnknownError);
  });
});

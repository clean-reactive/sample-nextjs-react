import { describe, it, expect, beforeEach, type Mocked } from 'vitest';

import {
  createTodoUseCase,
  type CreateTodoInputData,
  type CreateTodoOutputData,
} from '@/src/application/use-cases/todos/create-todo.use-case';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { createTodosRepositoryMock } from '@/src/infrastructure/repositories/todos.repository.mock';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import { createTransactionManagerServiceMock } from '@/src/infrastructure/services/transaction-manager.service.mock';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { todoFactory } from '@/src/entities/models/todo.factory';
import { userFactory } from '@/src/entities/models/user.factory';
import type { User } from '@/src/entities/models/user';
import type { Session } from '@/src/entities/models/session';

const presenter = async <T>(output: T): Promise<T> => output;

type UseCase = (input: CreateTodoInputData) => Promise<CreateTodoOutputData>;

type Context = {
  useCase: UseCase;
  todosRepository: Mocked<ITodosRepository>;
  authenticationService: Mocked<IAuthenticationService>;
  transactionManagerService: Mocked<ITransactionManagerService> & {
    tx: Mocked<ITransaction>;
  };
  user: User;
  session: Session;
};

describe(`${createTodoUseCase.name}`, () => {
  beforeEach<Context>((ctx) => {
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });

    ctx.user = user;
    ctx.session = session;
    ctx.todosRepository = createTodosRepositoryMock();
    ctx.authenticationService = createAuthenticationServiceMock();
    ctx.transactionManagerService = createTransactionManagerServiceMock();
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });
    ctx.todosRepository.createTodo.mockImplementation(async (todoInsert) =>
      todoFactory.item(todoInsert)
    );
    ctx.useCase = createTodoUseCase(
      ctx.todosRepository,
      ctx.transactionManagerService,
      ctx.authenticationService,
      presenter
    );
  });

  it<Context>('returns an UnauthenticatedError when no sessionId is provided', async (ctx) => {
    await expect(ctx.useCase({ todo: 'todo-one' })).resolves.toBeInstanceOf(
      UnauthenticatedError
    );
  });

  it<Context>('propagates an UnauthenticatedError thrown while validating the session', async (ctx) => {
    const error = new UnauthenticatedError('Session expired');
    ctx.authenticationService.validateSession.mockRejectedValue(error);

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todo: 'todo-one' })
    ).resolves.toBe(error);
  });

  it<Context>('returns an InputParseError when the todo is missing', async (ctx) => {
    await expect(
      ctx.useCase({ sessionId: ctx.session.id })
    ).resolves.toBeInstanceOf(InputParseError);
  });

  it<Context>('returns an InputParseError when a todo is shorter than 4 characters', async (ctx) => {
    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todo: 'abc' })
    ).resolves.toBeInstanceOf(InputParseError);

    expect(ctx.todosRepository.createTodo).not.toHaveBeenCalled();
  });

  it<Context>('creates a todo for the session user', async (ctx) => {
    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todo: 'todo-one' })
    ).resolves.toMatchObject([
      { todo: 'todo-one', userId: ctx.user.id, completed: false },
    ]);

    expect(ctx.todosRepository.createTodo).toHaveBeenCalledTimes(1);
    expect(ctx.todosRepository.createTodo).toHaveBeenCalledWith(
      { todo: 'todo-one', userId: ctx.user.id, completed: false },
      expect.anything()
    );
  });

  it<Context>('creates multiple todos when the todo field is a comma-separated list', async (ctx) => {
    await expect(
      ctx.useCase({
        sessionId: ctx.session.id,
        todo: 'todo-one, todo-two, todo-three',
      })
    ).resolves.toMatchObject([
      { todo: 'todo-one', userId: ctx.user.id },
      { todo: 'todo-two', userId: ctx.user.id },
      { todo: 'todo-three', userId: ctx.user.id },
    ]);

    expect(ctx.todosRepository.createTodo).toHaveBeenCalledTimes(3);
  });

  it<Context>('rolls back and returns an empty array when creating a todo fails', async (ctx) => {
    ctx.todosRepository.createTodo.mockRejectedValue(new Error('boom'));

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todo: 'todo-one' })
    ).resolves.toEqual([]);

    expect(ctx.transactionManagerService.tx.rollback).toHaveBeenCalledTimes(1);
  });

  it<Context>('returns an UnknownError when any other error is thrown', async (ctx) => {
    ctx.transactionManagerService.startTransaction.mockRejectedValue(
      new Error('boom')
    );

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, todo: 'todo-one' })
    ).resolves.toBeInstanceOf(UnknownError);
  });
});

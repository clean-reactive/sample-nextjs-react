import { describe, it, expect, beforeEach, type Mocked } from 'vitest';

import {
  bulkUpdateUseCase,
  type BulkUpdateInputData,
  type BulkUpdateOutputData,
} from '@/src/application/use-cases/todos/bulk-update.use-case';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import type { ITransaction } from '@/src/entities/models/transaction.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { createTodosRepositoryMock } from '@/src/infrastructure/repositories/todos.repository.mock';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import { createTransactionManagerServiceMock } from '@/src/infrastructure/services/transaction-manager.service.mock';
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

type UseCase = (input: BulkUpdateInputData) => Promise<BulkUpdateOutputData>;

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

describe(`${bulkUpdateUseCase.name}`, () => {
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
    ctx.useCase = bulkUpdateUseCase(
      ctx.todosRepository,
      ctx.transactionManagerService,
      ctx.authenticationService,
      presenter
    );
  });

  it<Context>('applies the toggles and the deletes in a single transaction (all or nothing)', async (ctx) => {
    const toToggle = todoFactory.item({
      userId: ctx.user.id,
      completed: false,
    });
    const toDelete = todoFactory.item({ userId: ctx.user.id });
    ctx.todosRepository.getTodo.mockImplementation(async (id) =>
      id === toToggle.id ? toToggle : toDelete
    );
    ctx.todosRepository.updateTodo.mockResolvedValue({
      ...toToggle,
      completed: true,
    });

    await ctx.useCase({
      sessionId: ctx.session.id,
      dirty: [toToggle.id],
      deleted: [toDelete.id],
    });

    const { tx } = ctx.transactionManagerService;
    expect(ctx.todosRepository.updateTodo).toHaveBeenCalledWith(
      toToggle.id,
      { completed: true },
      tx
    );
    expect(ctx.todosRepository.deleteTodo).toHaveBeenCalledWith(
      toDelete.id,
      tx
    );
    expect(
      ctx.transactionManagerService.startTransaction
    ).toHaveBeenCalledTimes(1);
  });

  it<Context>('leaves the deletes unattempted when a toggle fails', async (ctx) => {
    ctx.todosRepository.getTodo.mockResolvedValue(undefined);

    await ctx.useCase({
      sessionId: ctx.session.id,
      dirty: [1],
      deleted: [2],
    });

    expect(ctx.todosRepository.updateTodo).not.toHaveBeenCalled();
    expect(ctx.todosRepository.deleteTodo).not.toHaveBeenCalled();
  });

  it<Context>('returns an UnauthenticatedError when no sessionId is provided', async (ctx) => {
    await expect(
      ctx.useCase({ dirty: [], deleted: [] })
    ).resolves.toBeInstanceOf(UnauthenticatedError);
  });

  it<Context>('returns an InputParseError when the input is malformed', async (ctx) => {
    await expect(
      ctx.useCase({ sessionId: ctx.session.id, dirty: undefined, deleted: [] })
    ).resolves.toBeInstanceOf(InputParseError);
  });

  it<Context>('returns a NotFoundError when a toggled todo does not exist', async (ctx) => {
    ctx.todosRepository.getTodo.mockResolvedValue(undefined);

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, dirty: [1], deleted: [] })
    ).resolves.toBeInstanceOf(NotFoundError);
  });

  it<Context>('returns a NotFoundError when a todo marked for deletion does not exist', async (ctx) => {
    ctx.todosRepository.getTodo.mockResolvedValue(undefined);

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, dirty: [], deleted: [1] })
    ).resolves.toBeInstanceOf(NotFoundError);
  });

  it<Context>('returns an UnauthorizedError when the todo belongs to another user', async (ctx) => {
    const theirs = todoFactory.item({ userId: 'another-user-id' });
    ctx.todosRepository.getTodo.mockResolvedValue(theirs);

    await expect(
      ctx.useCase({
        sessionId: ctx.session.id,
        dirty: [theirs.id],
        deleted: [],
      })
    ).resolves.toBeInstanceOf(UnauthorizedError);
  });

  it<Context>('returns an UnknownError when any other error is thrown', async (ctx) => {
    ctx.todosRepository.getTodo.mockRejectedValue(new Error('boom'));

    await expect(
      ctx.useCase({ sessionId: ctx.session.id, dirty: [1], deleted: [] })
    ).resolves.toBeInstanceOf(UnknownError);
  });
});

import { z } from 'zod';

import {
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import {
  InputParseError,
  NotFoundError,
  UnknownError,
} from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import { Session } from '@/src/entities/models/session';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type BulkUpdateInputData = Partial<{
  dirty: Todo['id'][];
  deleted: Todo['id'][];
  sessionId: Session['id'];
}>;

const inputSchema = z.object({
  dirty: z.array(z.number()),
  deleted: z.array(z.number()),
});

export type BulkUpdateOutputData =
  | Todo[]
  | InputParseError
  | UnauthenticatedError
  | NotFoundError
  | UnauthorizedError
  | UnknownError;

export type IBulkUpdateUseCase<VM> = (
  input: BulkUpdateInputData
) => Promise<VM>;

export type IBulkUpdatePresenter<VM> = (
  output: BulkUpdateOutputData
) => Promise<VM>;

export const bulkUpdateUseCase =
  <VM>(
    todosRepository: ITodosRepository,
    transactionManagerService: ITransactionManagerService,
    authenticationService: IAuthenticationService,
    presenter: IBulkUpdatePresenter<VM>
  ): IBulkUpdateUseCase<VM> =>
  async (input: BulkUpdateInputData): Promise<VM> => {
    try {
      if (!input.sessionId) {
        return presenter(
          new UnauthenticatedError('Must be logged in to bulk update todos')
        );
      }

      const { user } = await authenticationService.validateSession(
        input.sessionId
      );

      const { data, error: inputParseError } = inputSchema.safeParse({
        dirty: input.dirty,
        deleted: input.deleted,
      });
      if (inputParseError) {
        return presenter(
          new InputParseError('Invalid data', { cause: inputParseError })
        );
      }

      const { dirty, deleted } = data;

      const toggledTodos = await transactionManagerService.startTransaction(
        async (mainTx) => {
          let toggled: Todo[] | undefined;
          try {
            toggled = await Promise.all(
              dirty.map(async (id) => {
                const todo = await todosRepository.getTodo(id);
                if (!todo) {
                  throw new NotFoundError('Todo does not exist');
                }
                if (todo.userId !== user.id) {
                  throw new UnauthorizedError(
                    'Cannot toggle todo. Reason: unauthorized'
                  );
                }
                return todosRepository.updateTodo(
                  todo.id,
                  { completed: !todo.completed },
                  mainTx
                );
              })
            );
          } catch (err) {
            console.error(err);
            console.error('Rolling back toggles!');
            mainTx.rollback();
          }

          // Savepoint: a failed delete rolls back only the deletes, not the
          // toggles.
          await transactionManagerService.startTransaction(async (deleteTx) => {
            try {
              await Promise.all(
                deleted.map(async (id) => {
                  const todo = await todosRepository.getTodo(id);
                  if (!todo) {
                    throw new NotFoundError('Todo does not exist');
                  }
                  if (todo.userId !== user.id) {
                    throw new UnauthorizedError(
                      'Cannot delete todo. Reason: unauthorized'
                    );
                  }
                  await todosRepository.deleteTodo(todo.id, deleteTx);
                })
              );
            } catch (err) {
              console.error('Rolling back deletes!');
              deleteTx.rollback();
            }
          }, mainTx);

          return toggled;
        }
      );

      return presenter(toggledTodos ?? []);
    } catch (err) {
      if (
        err instanceof UnauthenticatedError ||
        err instanceof NotFoundError ||
        err instanceof InputParseError
      ) {
        return presenter(err);
      }
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };

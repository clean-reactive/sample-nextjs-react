import { z } from 'zod';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import { Session } from '@/src/entities/models/session';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type CreateTodoInputData = Partial<{
  todo: string;
  sessionId: Session['id'];
}>;

export type CreateTodoOutputData =
  Todo[] | InputParseError | UnauthenticatedError | UnknownError;

export type ICreateTodoUseCase<VM> = (
  input: CreateTodoInputData
) => Promise<VM>;

export type ICreateTodoPresenter<VM> = (
  output: CreateTodoOutputData
) => Promise<VM>;

const inputSchema = z.object({ todo: z.string().min(1) });

export const createTodoUseCase =
  <VM>(
    todosRepository: ITodosRepository,
    transactionManagerService: ITransactionManagerService,
    authenticationService: IAuthenticationService,
    presenter: ICreateTodoPresenter<VM>
  ): ICreateTodoUseCase<VM> =>
  async (input: CreateTodoInputData): Promise<VM> => {
    try {
      if (!input.sessionId) {
        return presenter(
          new UnauthenticatedError('Must be logged in to create a todo')
        );
      }

      const { user } = await authenticationService.validateSession(
        input.sessionId
      );

      const { data, error: inputParseError } = inputSchema.safeParse({
        todo: input.todo,
      });
      if (inputParseError) {
        return presenter(
          new InputParseError('Invalid data', { cause: inputParseError })
        );
      }

      const todosFromInput = data.todo.split(',').map((t) => t.trim());

      // Validate before the transaction: the inner catch below rolls back and
      // swallows, so an error thrown inside would surface as a false success.
      if (todosFromInput.some((t) => t.length < 4)) {
        return presenter(new InputParseError('Todo must be at least 4 chars'));
      }

      const todos = await transactionManagerService.startTransaction(
        async (tx) => {
          try {
            return await Promise.all(
              todosFromInput.map((t) =>
                todosRepository.createTodo(
                  { todo: t, userId: user.id, completed: false },
                  tx
                )
              )
            );
          } catch (err) {
            console.error('Rolling back!');
            tx.rollback();
          }
        }
      );
      return presenter(todos ?? []);
    } catch (err) {
      if (err instanceof UnauthenticatedError) {
        return presenter(err);
      }
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };

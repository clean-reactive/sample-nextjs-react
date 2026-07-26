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
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type DeleteTodoInputData = Partial<{
  todoId: Todo['id'];
  sessionId: Session['id'];
}>;

export type DeleteTodoOutputData =
  | Todo
  | InputParseError
  | UnauthenticatedError
  | NotFoundError
  | UnauthorizedError
  | UnknownError;

export type IDeleteTodoUseCase<VM> = (
  input: DeleteTodoInputData
) => Promise<VM>;

export type IDeleteTodoPresenter<VM> = (
  output: DeleteTodoOutputData
) => Promise<VM>;

export const deleteTodoUseCase =
  <VM>(
    todosRepository: ITodosRepository,
    authenticationService: IAuthenticationService,
    presenter: IDeleteTodoPresenter<VM>
  ): IDeleteTodoUseCase<VM> =>
  async (input: DeleteTodoInputData): Promise<VM> => {
    try {
      if (!input.sessionId) {
        return presenter(
          new UnauthenticatedError('Must be logged in to delete a todo')
        );
      }

      const { session } = await authenticationService.validateSession(
        input.sessionId
      );

      if (input.todoId === undefined || !Number.isInteger(input.todoId)) {
        return presenter(new InputParseError('Invalid todo id'));
      }

      const todo = await todosRepository.getTodo(input.todoId);
      if (!todo) {
        return presenter(new NotFoundError('Todo does not exist'));
      }
      if (todo.userId !== session.userId) {
        return presenter(
          new UnauthorizedError('Cannot delete todo. Reason: unauthorized')
        );
      }

      await todosRepository.deleteTodo(todo.id);
      return presenter(todo);
    } catch (err) {
      if (err instanceof UnauthenticatedError) {
        return presenter(err);
      }
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };

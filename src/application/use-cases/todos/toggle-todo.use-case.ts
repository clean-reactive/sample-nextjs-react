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

export type ToggleTodoInputData = Partial<{
  todoId: Todo['id'];
  sessionId: Session['id'];
}>;

export type ToggleTodoOutputData =
  | Todo
  | InputParseError
  | UnauthenticatedError
  | NotFoundError
  | UnauthorizedError
  | UnknownError;

export type IToggleTodoUseCase<VM> = (
  input: ToggleTodoInputData
) => Promise<VM>;

export type IToggleTodoPresenter<VM> = (
  output: ToggleTodoOutputData
) => Promise<VM>;

export const toggleTodoUseCase =
  <VM>(
    todosRepository: ITodosRepository,
    authenticationService: IAuthenticationService,
    presenter: IToggleTodoPresenter<VM>
  ): IToggleTodoUseCase<VM> =>
  async (input: ToggleTodoInputData): Promise<VM> => {
    try {
      if (!input.sessionId) {
        return presenter(
          new UnauthenticatedError('Must be logged in to toggle a todo')
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
          new UnauthorizedError('Cannot toggle todo. Reason: unauthorized')
        );
      }

      const updatedTodo = await todosRepository.updateTodo(todo.id, {
        completed: !todo.completed,
      });
      return presenter(updatedTodo);
    } catch (err) {
      if (err instanceof UnauthenticatedError) {
        return presenter(err);
      }
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { UnknownError } from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import { Session } from '@/src/entities/models/session';
import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export type GetTodosForUserInputData = Partial<{
  sessionId: Session['id'];
}>;

export type GetTodosForUserOutputData =
  Todo[] | UnauthenticatedError | AuthenticationError | UnknownError;

export type IGetTodosForUserUseCase<VM> = (
  input: GetTodosForUserInputData
) => Promise<VM>;

export type IGetTodosForUserPresenter<VM> = (
  output: GetTodosForUserOutputData
) => Promise<VM>;

export const getTodosForUserUseCase =
  <VM>(
    todosRepository: ITodosRepository,
    authenticationService: IAuthenticationService,
    presenter: IGetTodosForUserPresenter<VM>
  ): IGetTodosForUserUseCase<VM> =>
  async (input: GetTodosForUserInputData): Promise<VM> => {
    try {
      if (!input.sessionId) {
        return presenter(
          new UnauthenticatedError('Must be logged in to view todos')
        );
      }

      const { session } = await authenticationService.validateSession(
        input.sessionId
      );
      const todos = await todosRepository.getTodosForUser(session.userId);
      return presenter(todos);
    } catch (err) {
      if (
        err instanceof UnauthenticatedError ||
        err instanceof AuthenticationError
      ) {
        return presenter(err);
      }
      return presenter(
        new UnknownError('Unknown error has happen', { cause: err })
      );
    }
  };

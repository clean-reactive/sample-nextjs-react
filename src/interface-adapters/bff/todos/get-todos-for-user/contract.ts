import { Todo } from '@/src/entities/models/todo';
import {
  IGetTodosForUserPresenter,
  IGetTodosForUserUseCase,
} from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { Session } from '@/src/entities/models/session';

export type GetTodosForUserFailure = {
  status: 'failure';
  code: 'unauthenticated' | 'unexpected_error';
};

export type GetTodosForUserSuccess = {
  status: 'success';
  data: Todo[];
};

export type GetTodosForUserBffViewModel =
  GetTodosForUserFailure | GetTodosForUserSuccess;

export type IGetTodosForUserBffController = (
  sessionId?: Session['id']
) => Promise<GetTodosForUserBffViewModel>;

export type IGetTodosForUserBffUseCase =
  IGetTodosForUserUseCase<GetTodosForUserBffViewModel>;

export type IGetTodosForUserBffPresenter =
  IGetTodosForUserPresenter<GetTodosForUserBffViewModel>;

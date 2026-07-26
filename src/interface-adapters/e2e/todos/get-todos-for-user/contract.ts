import { Todo } from '@/src/entities/models/todo';
import {
  GetTodosForUserInputData,
  IGetTodosForUserPresenter,
  IGetTodosForUserUseCase,
} from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { Session } from '@/src/entities/models/session';

export type IGetTodosForUserE2eController = (
  sessionId?: Session['id']
) => Promise<Todo[]>;

export type IGetTodosForUserE2eUseCase = IGetTodosForUserUseCase<Todo[]>;

export type IGetTodosForUserE2ePresenter = IGetTodosForUserPresenter<Todo[]>;

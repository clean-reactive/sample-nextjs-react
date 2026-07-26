import {
  IGetTodosForUserPresenter,
  IGetTodosForUserUseCase,
} from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { Session } from '@/src/entities/models/session';

export type GetTodosForUserApiTodo = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

export type GetTodosForUserApiViewModel =
  | { status: 'success'; body: { todos: GetTodosForUserApiTodo[] } }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type IGetTodosForUserApiController = (
  sessionId?: Session['id']
) => Promise<GetTodosForUserApiViewModel>;

export type IGetTodosForUserApiUseCase =
  IGetTodosForUserUseCase<GetTodosForUserApiViewModel>;

export type IGetTodosForUserApiPresenter =
  IGetTodosForUserPresenter<GetTodosForUserApiViewModel>;

import {
  ICreateTodoPresenter,
  ICreateTodoUseCase,
} from '@/src/application/use-cases/todos/create-todo.use-case';
import { Session } from '@/src/entities/models/session';

export type CreateTodoFailure = {
  status: 'failure';
  code: 'invalid_data' | 'unauthenticated' | 'unexpected_error';
};

export type CreateTodoSuccess = { status: 'success' };

export type CreateTodoBffViewModel = CreateTodoFailure | CreateTodoSuccess;

export type ICreateTodoBffController = (
  payload: FormData,
  sessionId?: Session['id']
) => Promise<CreateTodoBffViewModel>;

export type ICreateTodoBffUseCase = ICreateTodoUseCase<CreateTodoBffViewModel>;

export type ICreateTodoBffPresenter =
  ICreateTodoPresenter<CreateTodoBffViewModel>;

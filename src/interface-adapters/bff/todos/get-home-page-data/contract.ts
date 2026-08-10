import { Todo } from '@/src/entities/models/todo';
import {
  IGetTodosForUserPresenter,
  IGetTodosForUserUseCase,
} from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { Session } from '@/src/entities/models/session';

export type GetHomePageDataFailure = {
  status: 'failure';
  code: 'unauthenticated' | 'unexpected_error';
};

export type GetHomePageDataSuccess = {
  status: 'success';
  data: Todo[];
};

export type GetHomePageDataBffViewModel =
  GetHomePageDataFailure | GetHomePageDataSuccess;

export type IGetHomePageDataBffController = (
  sessionId?: Session['id']
) => Promise<GetHomePageDataBffViewModel>;

export type IGetHomePageDataBffUseCase =
  IGetTodosForUserUseCase<GetHomePageDataBffViewModel>;

export type IGetHomePageDataBffPresenter =
  IGetTodosForUserPresenter<GetHomePageDataBffViewModel>;

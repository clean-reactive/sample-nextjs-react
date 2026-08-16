import {
  IToggleTodoPresenter,
  IToggleTodoUseCase,
} from '@/src/application/use-cases/todos/toggle-todo.use-case';
import { Session } from '@/src/entities/models/session';

export type ToggleTodoFailure = {
  status: 'failure';
  code: 'invalid_data' | 'unauthenticated' | 'not_found' | 'unexpected_error';
};

export type ToggleTodoSuccess = { status: 'success' };

export type ToggleTodoBffViewModel = ToggleTodoFailure | ToggleTodoSuccess;

export type IToggleTodoBffController = (
  payload: number,
  sessionId?: Session['id']
) => Promise<ToggleTodoBffViewModel>;

export type IToggleTodoBffUseCase = IToggleTodoUseCase<ToggleTodoBffViewModel>;

export type IToggleTodoBffPresenter =
  IToggleTodoPresenter<ToggleTodoBffViewModel>;

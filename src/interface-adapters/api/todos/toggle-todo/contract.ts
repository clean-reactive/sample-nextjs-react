import {
  IToggleTodoPresenter,
  IToggleTodoUseCase,
} from '@/src/application/use-cases/todos/toggle-todo.use-case';
import { Session } from '@/src/entities/models/session';

export type ToggleTodoApiTodo = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

export type ToggleTodoApiViewModel =
  | { status: 'success'; body: ToggleTodoApiTodo }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type IToggleTodoApiController = (
  input: string,
  sessionId?: Session['id']
) => Promise<ToggleTodoApiViewModel>;

export type IToggleTodoApiUseCase = IToggleTodoUseCase<ToggleTodoApiViewModel>;

export type IToggleTodoApiPresenter =
  IToggleTodoPresenter<ToggleTodoApiViewModel>;

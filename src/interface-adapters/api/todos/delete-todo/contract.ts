import {
  IDeleteTodoPresenter,
  IDeleteTodoUseCase,
} from '@/src/application/use-cases/todos/delete-todo.use-case';
import { Session } from '@/src/entities/models/session';

export type DeleteTodoApiTodo = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

export type DeleteTodoApiViewModel =
  | { status: 'success'; body: DeleteTodoApiTodo }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type IDeleteTodoApiController = (
  input: string,
  sessionId?: Session['id']
) => Promise<DeleteTodoApiViewModel>;

export type IDeleteTodoApiUseCase = IDeleteTodoUseCase<DeleteTodoApiViewModel>;

export type IDeleteTodoApiPresenter =
  IDeleteTodoPresenter<DeleteTodoApiViewModel>;

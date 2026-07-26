import {
  ICreateTodoPresenter,
  ICreateTodoUseCase,
} from '@/src/application/use-cases/todos/create-todo.use-case';
import { Session } from '@/src/entities/models/session';

export type CreateTodoApiTodo = {
  id: number;
  todo: string;
  userId: string;
  completed: boolean;
};

export type CreateTodoApiViewModel =
  | {
      status: 'success';
      body: { todos: CreateTodoApiTodo[] };
      init: { status: number };
    }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type ICreateTodoApiController = (
  payload: unknown,
  sessionId?: Session['id']
) => Promise<CreateTodoApiViewModel>;

export type ICreateTodoApiUseCase = ICreateTodoUseCase<CreateTodoApiViewModel>;

export type ICreateTodoApiPresenter =
  ICreateTodoPresenter<CreateTodoApiViewModel>;

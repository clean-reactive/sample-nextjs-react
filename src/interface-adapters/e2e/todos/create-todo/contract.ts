import { Todo } from '@/src/entities/models/todo';
import {
  ICreateTodoPresenter,
  ICreateTodoUseCase,
} from '@/src/application/use-cases/todos/create-todo.use-case';
import { Session } from '@/src/entities/models/session';

export type ICreateTodoE2eController = (input: {
  todo: string;
  sessionId: Session['id'];
}) => Promise<Todo>;

export type ICreateTodoE2eUseCase = ICreateTodoUseCase<Todo>;

export type ICreateTodoE2ePresenter = ICreateTodoPresenter<Todo>;

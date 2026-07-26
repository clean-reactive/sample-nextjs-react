import {
  ICreateTodoE2eController,
  ICreateTodoE2eUseCase,
} from '@/src/interface-adapters/e2e/todos/create-todo/contract';

export const createTodoE2eController =
  (createTodoUseCase: ICreateTodoE2eUseCase): ICreateTodoE2eController =>
  ({ todo, sessionId }) =>
    createTodoUseCase({ todo, sessionId });

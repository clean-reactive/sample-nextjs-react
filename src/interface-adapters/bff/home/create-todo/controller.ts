import { CreateTodoInputData } from '@/src/application/use-cases/todos/create-todo.use-case';
import {
  ICreateTodoBffController,
  ICreateTodoBffUseCase,
} from '@/src/interface-adapters/bff/home/create-todo/contract';

export const createTodoBffController =
  (createTodoUseCase: ICreateTodoBffUseCase): ICreateTodoBffController =>
  async (payload, sessionId) => {
    const inputData: CreateTodoInputData = {
      todo: payload.get('todo')?.toString(),
      sessionId,
    };

    return createTodoUseCase(inputData);
  };

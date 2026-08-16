import { ToggleTodoInputData } from '@/src/application/use-cases/todos/toggle-todo.use-case';
import {
  IToggleTodoBffController,
  IToggleTodoBffUseCase,
} from '@/src/interface-adapters/bff/home/toggle-todo/contract';

export const toggleTodoBffController =
  (toggleTodoUseCase: IToggleTodoBffUseCase): IToggleTodoBffController =>
  async (payload, sessionId) => {
    const inputData: ToggleTodoInputData = {
      todoId: payload,
      sessionId,
    };

    return toggleTodoUseCase(inputData);
  };

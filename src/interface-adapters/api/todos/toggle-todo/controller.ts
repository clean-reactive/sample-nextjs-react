import { ToggleTodoInputData } from '@/src/application/use-cases/todos/toggle-todo.use-case';
import {
  IToggleTodoApiController,
  IToggleTodoApiUseCase,
} from '@/src/interface-adapters/api/todos/toggle-todo/contract';

export const toggleTodoApiController =
  (toggleTodoUseCase: IToggleTodoApiUseCase): IToggleTodoApiController =>
  (input, sessionId) => {
    const inputData: ToggleTodoInputData = {
      todoId: Number(input),
      sessionId,
    };
    return toggleTodoUseCase(inputData);
  };

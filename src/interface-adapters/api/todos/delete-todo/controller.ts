import { DeleteTodoInputData } from '@/src/application/use-cases/todos/delete-todo.use-case';
import {
  IDeleteTodoApiController,
  IDeleteTodoApiUseCase,
} from '@/src/interface-adapters/api/todos/delete-todo/contract';

export const deleteTodoApiController =
  (deleteTodoUseCase: IDeleteTodoApiUseCase): IDeleteTodoApiController =>
  (input, sessionId) => {
    const inputData: DeleteTodoInputData = {
      todoId: Number(input),
      sessionId,
    };
    return deleteTodoUseCase(inputData);
  };

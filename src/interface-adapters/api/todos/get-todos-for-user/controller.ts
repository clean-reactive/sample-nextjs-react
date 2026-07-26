import { GetTodosForUserInputData } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import {
  IGetTodosForUserApiController,
  IGetTodosForUserApiUseCase,
} from '@/src/interface-adapters/api/todos/get-todos-for-user/contract';

export const getTodosForUserApiController =
  (
    getTodosForUserUseCase: IGetTodosForUserApiUseCase
  ): IGetTodosForUserApiController =>
  (sessionId) => {
    const inputData: GetTodosForUserInputData = { sessionId };
    return getTodosForUserUseCase(inputData);
  };

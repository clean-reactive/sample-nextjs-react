import { GetTodosForUserInputData } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import {
  IGetTodosForUserBffController,
  IGetTodosForUserBffUseCase,
} from '@/src/interface-adapters/bff/todos/get-todos-for-user/contract';

export const getTodosForUserBffController =
  (
    getTodosForUserUseCase: IGetTodosForUserBffUseCase
  ): IGetTodosForUserBffController =>
  async (sessionId) => {
    const inputData: GetTodosForUserInputData = { sessionId };

    return getTodosForUserUseCase(inputData);
  };

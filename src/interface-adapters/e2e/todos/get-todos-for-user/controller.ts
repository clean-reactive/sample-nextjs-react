import { GetTodosForUserInputData } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import {
  IGetTodosForUserE2eController,
  IGetTodosForUserE2eUseCase,
} from '@/src/interface-adapters/e2e/todos/get-todos-for-user/contract';

export const getTodosForUserE2eController =
  (
    getTodosForUserUseCase: IGetTodosForUserE2eUseCase
  ): IGetTodosForUserE2eController =>
  (sessionId) => {
    const inputData: GetTodosForUserInputData = { sessionId };
    return getTodosForUserUseCase(inputData);
  };

import { GetTodosForUserInputData } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import {
  IGetHomePageDataBffController,
  IGetHomePageDataBffUseCase,
} from '@/src/interface-adapters/bff/home/get-home-page-data/contract';

export const getHomePageDataBffController =
  (
    getTodosForUserUseCase: IGetHomePageDataBffUseCase
  ): IGetHomePageDataBffController =>
  async (sessionId) => {
    const inputData: GetTodosForUserInputData = { sessionId };

    return getTodosForUserUseCase(inputData);
  };

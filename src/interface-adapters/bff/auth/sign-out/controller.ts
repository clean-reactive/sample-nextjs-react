import { SignOutInputData } from '@/src/application/use-cases/auth/sign-out.use-case';
import {
  ISignOutBffController,
  ISignOutBffUseCase,
} from '@/src/interface-adapters/bff/auth/sign-out/contract';

export const signOutBffController =
  (signOutUseCase: ISignOutBffUseCase): ISignOutBffController =>
  async (sessionId) => {
    const inputData: SignOutInputData = { sessionId };

    return signOutUseCase(inputData);
  };

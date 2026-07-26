import { SignOutInputData } from '@/src/application/use-cases/auth/sign-out.use-case';
import {
  ISignOutApiController,
  ISignOutApiUseCase,
} from '@/src/interface-adapters/api/auth/sign-out/contract';

export const signOutApiController =
  (signOutUseCase: ISignOutApiUseCase): ISignOutApiController =>
  (sessionId) => {
    const inputData: SignOutInputData = { sessionId };
    return signOutUseCase(inputData);
  };

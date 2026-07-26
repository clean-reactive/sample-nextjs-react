import { SignInInputData } from '@/src/application/use-cases/auth/sign-in.use-case';
import {
  ISignInBffController,
  ISignInBffUseCase,
} from '@/src/interface-adapters/bff/auth/sign-in/contract';

export const signInBffController =
  (signInUseCase: ISignInBffUseCase): ISignInBffController =>
  async (payload) => {
    const inputData: SignInInputData = {
      username: payload.get('username')?.toString(),
      password: payload.get('password')?.toString(),
    };

    return signInUseCase(inputData);
  };

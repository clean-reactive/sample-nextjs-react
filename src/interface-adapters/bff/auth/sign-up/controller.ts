import { SignUpInputData } from '@/src/application/use-cases/auth/sign-up.use-case';
import {
  ISignUpBffController,
  ISignUpBffUseCase,
} from '@/src/interface-adapters/bff/auth/sign-up/contract';

export const signUpBffController =
  (signUpUseCase: ISignUpBffUseCase): ISignUpBffController =>
  async (payload) => {
    const inputData: SignUpInputData = {
      username: payload.get('username')?.toString(),
      password: payload.get('password')?.toString(),
      confirm_password: payload.get('confirm_password')?.toString(),
    };

    return signUpUseCase(inputData);
  };

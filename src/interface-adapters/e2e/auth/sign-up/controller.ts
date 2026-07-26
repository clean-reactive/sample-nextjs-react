import {
  ISignUpE2eController,
  ISignUpE2eUseCase,
} from '@/src/interface-adapters/e2e/auth/sign-up/contract';

export const signUpE2eController =
  (signUpUseCase: ISignUpE2eUseCase): ISignUpE2eController =>
  (input) =>
    signUpUseCase(input);

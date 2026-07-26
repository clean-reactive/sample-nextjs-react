import { Cookie } from '@/src/entities/models/cookie';
import {
  ISignUpPresenter,
  ISignUpUseCase,
  SignUpInputData,
} from '@/src/application/use-cases/auth/sign-up.use-case';

export type ISignUpE2eController = (input: SignUpInputData) => Promise<Cookie>;

export type ISignUpE2eUseCase = ISignUpUseCase<Cookie>;

export type ISignUpE2ePresenter = ISignUpPresenter<Cookie>;

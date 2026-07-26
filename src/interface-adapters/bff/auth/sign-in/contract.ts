import { Cookie } from '@/src/entities/models/cookie';
import {
  ISignInPresenter,
  ISignInUseCase,
} from '@/src/application/use-cases/auth/sign-in.use-case';

export type SignInFailure = {
  status: 'failure';
  code: 'invalid_credentials' | 'unexpected_error';
};

export type SignInSuccess = {
  status: 'success';
  data: Cookie;
};

export type SignInBffViewModel = SignInFailure | SignInSuccess;

export type ISignInBffController = (
  payload: FormData
) => Promise<SignInBffViewModel>;

export type ISignInBffUseCase = ISignInUseCase<SignInBffViewModel>;

export type ISignInBffPresenter = ISignInPresenter<SignInBffViewModel>;

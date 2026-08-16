import { Cookie } from '@/src/entities/models/cookie';
import {
  ISignUpPresenter,
  ISignUpUseCase,
} from '@/src/application/use-cases/auth/sign-up.use-case';

export type SignUpFailure = {
  status: 'failure';
  code: 'invalid_data' | 'username_taken' | 'unexpected_error';
};

export type SignUpSuccess = {
  status: 'success';
  data: Cookie;
};

export type SignUpBffViewModel = SignUpFailure | SignUpSuccess;

export type ISignUpBffController = (
  payload: FormData
) => Promise<SignUpBffViewModel>;

export type ISignUpBffUseCase = ISignUpUseCase<SignUpBffViewModel>;

export type ISignUpBffPresenter = ISignUpPresenter<SignUpBffViewModel>;

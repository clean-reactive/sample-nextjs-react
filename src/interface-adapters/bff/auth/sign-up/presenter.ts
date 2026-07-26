import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ISignUpBffPresenter } from '@/src/interface-adapters/bff/auth/sign-up/contract';

export const signUpBffPresenter = (): ISignUpBffPresenter => async (output) => {
  if (output instanceof InputParseError) {
    return { status: 'failure', code: 'invalid_data' };
  }

  if (output instanceof AuthenticationError) {
    return { status: 'failure', code: 'username_taken' };
  }

  if (output instanceof UnknownError) {
    return { status: 'failure', code: 'unexpected_error' };
  }

  return { status: 'success', data: output };
};

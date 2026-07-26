import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ISignInBffPresenter } from '@/src/interface-adapters/bff/auth/sign-in/contract';

export const signInBffPresenter = (): ISignInBffPresenter => async (output) => {
  if (
    output instanceof AuthenticationError ||
    output instanceof InputParseError
  ) {
    return { status: 'failure', code: 'invalid_credentials' };
  }

  if (output instanceof UnknownError) {
    return { status: 'failure', code: 'unexpected_error' };
  }

  return { status: 'success', data: output };
};

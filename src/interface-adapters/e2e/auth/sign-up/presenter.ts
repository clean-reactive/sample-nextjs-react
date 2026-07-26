import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ISignUpE2ePresenter } from '@/src/interface-adapters/e2e/auth/sign-up/contract';

export const signUpE2ePresenter = (): ISignUpE2ePresenter => async (output) => {
  if (
    output instanceof InputParseError ||
    output instanceof AuthenticationError ||
    output instanceof UnknownError
  ) {
    throw new Error(`sign-up failed: ${output.message}`, { cause: output });
  }

  return output;
};

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ISignOutBffPresenter } from '@/src/interface-adapters/bff/auth/sign-out/contract';

export const signOutBffPresenter =
  (): ISignOutBffPresenter => async (output) => {
    if (
      output instanceof InputParseError ||
      output instanceof UnauthenticatedError
    ) {
      return { status: 'failure', code: 'unauthenticated' };
    }

    if (output instanceof UnknownError) {
      return { status: 'failure', code: 'unexpected_error' };
    }

    return { status: 'success', data: output };
  };

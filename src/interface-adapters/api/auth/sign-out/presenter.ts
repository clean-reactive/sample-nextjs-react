import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ISignOutApiPresenter } from '@/src/interface-adapters/api/auth/sign-out/contract';

export const signOutApiPresenter =
  (): ISignOutApiPresenter => async (output) => {
    if (output instanceof InputParseError) {
      return {
        status: 'failure',
        body: { error: output.message },
        init: { status: 400 },
      };
    }

    if (output instanceof UnauthenticatedError) {
      return {
        status: 'failure',
        body: { error: 'Unauthenticated' },
        init: { status: 401 },
      };
    }

    if (output instanceof UnknownError) {
      console.error(output);
      return {
        status: 'failure',
        body: { error: 'An unexpected error occurred' },
        init: { status: 500 },
      };
    }

    return {
      status: 'success',
      body: { success: true },
      init: { status: 200 },
      cookie: output,
    };
  };

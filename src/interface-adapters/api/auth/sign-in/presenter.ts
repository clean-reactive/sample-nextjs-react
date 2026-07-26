import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ISignInApiPresenter } from './contract';

export const signInApiPresenter = (): ISignInApiPresenter => async (output) => {
  if (output instanceof InputParseError) {
    return {
      status: 'failure',
      body: { error: output.message },
      init: { status: 400 },
    };
  }

  if (output instanceof AuthenticationError) {
    return {
      status: 'failure',
      body: { error: output.message },
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

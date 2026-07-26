import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ICreateTodoBffPresenter } from '@/src/interface-adapters/bff/todos/create-todo/contract';

export const createTodoBffPresenter =
  (): ICreateTodoBffPresenter => async (output) => {
    if (output instanceof InputParseError) {
      return { status: 'failure', code: 'invalid_data' };
    }

    if (output instanceof UnauthenticatedError) {
      return { status: 'failure', code: 'unauthenticated' };
    }

    if (output instanceof UnknownError) {
      return { status: 'failure', code: 'unexpected_error' };
    }

    return { status: 'success' };
  };

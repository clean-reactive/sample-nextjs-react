import {
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import {
  InputParseError,
  NotFoundError,
  UnknownError,
} from '@/src/entities/errors/common';
import { IToggleTodoBffPresenter } from '@/src/interface-adapters/bff/todos/toggle-todo/contract';

export const toggleTodoBffPresenter =
  (): IToggleTodoBffPresenter => async (output) => {
    if (output instanceof InputParseError) {
      return { status: 'failure', code: 'invalid_data' };
    }

    if (output instanceof UnauthenticatedError) {
      return { status: 'failure', code: 'unauthenticated' };
    }

    if (output instanceof NotFoundError) {
      return { status: 'failure', code: 'not_found' };
    }

    if (output instanceof UnauthorizedError || output instanceof UnknownError) {
      return { status: 'failure', code: 'unexpected_error' };
    }

    return { status: 'success' };
  };

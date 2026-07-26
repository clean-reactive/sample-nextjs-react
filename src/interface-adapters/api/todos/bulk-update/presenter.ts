import {
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import {
  InputParseError,
  NotFoundError,
  UnknownError,
} from '@/src/entities/errors/common';
import { IBulkUpdateApiPresenter } from '@/src/interface-adapters/api/todos/bulk-update/contract';

export const bulkUpdateApiPresenter =
  (): IBulkUpdateApiPresenter => async (output) => {
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

    if (output instanceof NotFoundError) {
      return {
        status: 'failure',
        body: { error: output.message },
        init: { status: 404 },
      };
    }

    if (output instanceof UnauthorizedError) {
      return {
        status: 'failure',
        body: { error: 'Unauthorized' },
        init: { status: 403 },
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
    };
  };

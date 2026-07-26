import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { UnknownError } from '@/src/entities/errors/common';
import { IGetTodosForUserE2ePresenter } from '@/src/interface-adapters/e2e/todos/get-todos-for-user/contract';

export const getTodosForUserE2ePresenter =
  (): IGetTodosForUserE2ePresenter => async (output) => {
    if (
      output instanceof UnauthenticatedError ||
      output instanceof AuthenticationError ||
      output instanceof UnknownError
    ) {
      throw new Error(`get todos failed: ${output.message}`, {
        cause: output,
      });
    }

    return output;
  };

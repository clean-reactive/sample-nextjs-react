import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { UnknownError } from '@/src/entities/errors/common';
import { IGetHomePageDataBffPresenter } from '@/src/interface-adapters/bff/todos/get-home-page-data/contract';

export const getHomePageDataBffPresenter =
  (): IGetHomePageDataBffPresenter => async (output) => {
    if (
      output instanceof UnauthenticatedError ||
      output instanceof AuthenticationError
    ) {
      return { status: 'failure', code: 'unauthenticated' };
    }

    if (output instanceof UnknownError) {
      return { status: 'failure', code: 'unexpected_error' };
    }

    return { status: 'success', data: output };
  };

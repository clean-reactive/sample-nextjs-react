import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { ISignUpApiPresenter } from '@/src/interface-adapters/api/auth/sign-up/contract';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export const signUpApiPresenter =
  (authenticationService: IAuthenticationService): ISignUpApiPresenter =>
  async (output) => {
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

    try {
      const { user } = await authenticationService.validateSession(
        output.value
      );
      return {
        status: 'success',
        body: { user: { id: user.id, username: user.username } },
        cookie: output,
        init: { status: 201 },
      };
    } catch (err) {
      // The account was created, but this failed to look the user back up
      // to sign the client in. Reporting this as a plain failure would lie
      // (the account was created), so the account creation is reported as
      // it is — no cookie, since the client isn't signed in and has to sign
      // in separately.
      console.error(
        'sign-up: created the user but failed to sign the client in',
        err
      );
      return {
        status: 'created',
        body: { message: 'Account created. Please sign in.' },
        init: { status: 201 },
      };
    }
  };

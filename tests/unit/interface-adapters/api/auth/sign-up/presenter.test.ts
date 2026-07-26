import { describe, expect, it, vi, beforeEach, type Mocked } from 'vitest';

import { signUpApiPresenter } from '@/src/interface-adapters/api/auth/sign-up/presenter';
import type { ISignUpApiPresenter } from '@/src/interface-adapters/api/auth/sign-up/contract';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { cookieFactory } from '@/src/entities/models/cookie.factory';
import { userFactory } from '@/src/entities/models/user.factory';
import { sessionFactory } from '@/src/entities/models/session.factory';

type Context = {
  presenter: ISignUpApiPresenter;
  authenticationService: Mocked<IAuthenticationService>;
};

describe(`${signUpApiPresenter.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.authenticationService = createAuthenticationServiceMock();
    ctx.presenter = signUpApiPresenter(ctx.authenticationService);
  });

  it<Context>('maps an InputParseError to a 400 failure', async (ctx) => {
    await expect(
      ctx.presenter(new InputParseError('Invalid data'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    });
  });

  it<Context>('maps an AuthenticationError to a 401 failure', async (ctx) => {
    await expect(
      ctx.presenter(new AuthenticationError('Username taken'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Username taken' },
      init: { status: 401 },
    });
  });

  it<Context>('maps an UnknownError to a 500 failure', async (ctx) => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await expect(ctx.presenter(new UnknownError('boom'))).resolves.toEqual({
      status: 'failure',
      body: { error: 'An unexpected error occurred' },
      init: { status: 500 },
    });

    consoleErrorSpy.mockRestore();
  });

  it<Context>('queries the user by validating the session and returns a success result', async (ctx) => {
    const cookie = cookieFactory.item();
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });

    await expect(ctx.presenter(cookie)).resolves.toEqual({
      status: 'success',
      body: { user: { id: user.id, username: user.username } },
      cookie,
      init: { status: 201 },
    });

    expect(ctx.authenticationService.validateSession).toHaveBeenCalledWith(
      cookie.value
    );
  });

  it<Context>('reports the account as created but not signed in when the follow-up session validation fails', async (ctx) => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const cookie = cookieFactory.item();
    ctx.authenticationService.validateSession.mockRejectedValue(
      new UnauthenticatedError('Session expired')
    );

    await expect(ctx.presenter(cookie)).resolves.toEqual({
      status: 'created',
      body: { message: 'Account created. Please sign in.' },
      init: { status: 201 },
    });

    consoleErrorSpy.mockRestore();
  });
});

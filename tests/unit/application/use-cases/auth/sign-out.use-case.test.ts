import { describe, it, expect, beforeEach, type Mocked } from 'vitest';

import {
  signOutUseCase,
  type SignOutInputData,
  type SignOutOutputData,
} from '@/src/application/use-cases/auth/sign-out.use-case';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { userFactory } from '@/src/entities/models/user.factory';
import { cookieFactory } from '@/src/entities/models/cookie.factory';
import type { User } from '@/src/entities/models/user';
import type { Session } from '@/src/entities/models/session';

const presenter = async <T>(output: T): Promise<T> => output;

type UseCase = (input: SignOutInputData) => Promise<SignOutOutputData>;

type Context = {
  useCase: UseCase;
  authenticationService: Mocked<IAuthenticationService>;
  user: User;
  session: Session;
};

describe(`${signOutUseCase.name}`, () => {
  beforeEach<Context>((ctx) => {
    const user = userFactory.item();
    const session = sessionFactory.item({ userId: user.id });

    ctx.user = user;
    ctx.session = session;
    ctx.authenticationService = createAuthenticationServiceMock();
    ctx.authenticationService.validateSession.mockResolvedValue({
      user,
      session,
    });
    ctx.useCase = signOutUseCase(ctx.authenticationService, presenter);
  });

  it<Context>('returns an InputParseError when no sessionId is provided', async (ctx) => {
    await expect(ctx.useCase({})).resolves.toBeInstanceOf(InputParseError);

    expect(ctx.authenticationService.validateSession).not.toHaveBeenCalled();
  });

  it<Context>('propagates an UnauthenticatedError thrown while validating the session', async (ctx) => {
    const error = new UnauthenticatedError('Session expired');
    ctx.authenticationService.validateSession.mockRejectedValue(error);

    await expect(ctx.useCase({ sessionId: ctx.session.id })).resolves.toBe(
      error
    );

    expect(ctx.authenticationService.invalidateSession).not.toHaveBeenCalled();
  });

  it<Context>('invalidates the session and returns the blank cookie', async (ctx) => {
    const blankCookie = cookieFactory.item();
    ctx.authenticationService.invalidateSession.mockResolvedValue({
      blankCookie,
    });

    await expect(ctx.useCase({ sessionId: ctx.session.id })).resolves.toBe(
      blankCookie
    );

    expect(ctx.authenticationService.invalidateSession).toHaveBeenCalledWith(
      ctx.session.id
    );
  });

  it<Context>('returns an UnknownError when any other error is thrown', async (ctx) => {
    ctx.authenticationService.invalidateSession.mockRejectedValue(
      new Error('boom')
    );

    await expect(
      ctx.useCase({ sessionId: ctx.session.id })
    ).resolves.toBeInstanceOf(UnknownError);
  });
});

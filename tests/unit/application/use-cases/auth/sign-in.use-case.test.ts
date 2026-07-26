import { describe, it, expect, beforeEach, type Mocked } from 'vitest';

import {
  signInUseCase,
  type SignInInputData,
  type SignInOutputData,
} from '@/src/application/use-cases/auth/sign-in.use-case';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { createUsersRepositoryMock } from '@/src/infrastructure/repositories/users.repository.mock';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { userFactory } from '@/src/entities/models/user.factory';
import { cookieFactory } from '@/src/entities/models/cookie.factory';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { passwordFactory } from '@/src/entities/models/password.factory';
import { usernameFactory } from '@/src/entities/models/username.factory';
import type { User } from '@/src/entities/models/user';

const presenter = async <T>(output: T): Promise<T> => output;

type UseCase = (input: SignInInputData) => Promise<SignInOutputData>;

type Context = {
  useCase: UseCase;
  usersRepository: Mocked<IUsersRepository>;
  authenticationService: Mocked<IAuthenticationService>;
  user: User;
  password: string;
};

describe(`${signInUseCase.name}`, () => {
  beforeEach<Context>((ctx) => {
    const { password } = passwordFactory.item();
    const user = userFactory.item({ password_hash: password });

    ctx.user = user;
    ctx.password = password;
    ctx.usersRepository = createUsersRepositoryMock();
    ctx.authenticationService = createAuthenticationServiceMock();
    ctx.useCase = signInUseCase(
      ctx.usersRepository,
      ctx.authenticationService,
      presenter
    );
  });

  it<Context>('returns an InputParseError when the input fails validation', async (ctx) => {
    await expect(
      ctx.useCase({ username: 'ab', password: ctx.password })
    ).resolves.toBeInstanceOf(InputParseError);

    expect(ctx.usersRepository.getUserByUsername).not.toHaveBeenCalled();
  });

  it<Context>('returns an AuthenticationError when the user does not exist', async (ctx) => {
    ctx.usersRepository.getUserByUsername.mockResolvedValue(undefined);

    await expect(
      ctx.useCase({
        username: usernameFactory.item().username,
        password: ctx.password,
      })
    ).resolves.toBeInstanceOf(AuthenticationError);

    expect(ctx.authenticationService.validatePasswords).not.toHaveBeenCalled();
  });

  it<Context>('returns an AuthenticationError when the password is incorrect', async (ctx) => {
    ctx.usersRepository.getUserByUsername.mockResolvedValue(ctx.user);
    ctx.authenticationService.validatePasswords.mockResolvedValue(false);

    await expect(
      ctx.useCase({ username: ctx.user.username, password: ctx.password })
    ).resolves.toBeInstanceOf(AuthenticationError);

    expect(ctx.authenticationService.createSession).not.toHaveBeenCalled();
  });

  it<Context>('creates a session and returns the cookie on success', async (ctx) => {
    const session = sessionFactory.item({ userId: ctx.user.id });
    const cookie = cookieFactory.item();
    ctx.usersRepository.getUserByUsername.mockResolvedValue(ctx.user);
    ctx.authenticationService.validatePasswords.mockResolvedValue(true);
    ctx.authenticationService.createSession.mockResolvedValue({
      session,
      cookie,
    });

    await expect(
      ctx.useCase({ username: ctx.user.username, password: ctx.password })
    ).resolves.toBe(cookie);

    expect(ctx.authenticationService.createSession).toHaveBeenCalledWith(
      ctx.user
    );
  });

  it<Context>('returns an UnknownError when any other error is thrown', async (ctx) => {
    ctx.usersRepository.getUserByUsername.mockRejectedValue(new Error('boom'));

    await expect(
      ctx.useCase({ username: ctx.user.username, password: ctx.password })
    ).resolves.toBeInstanceOf(UnknownError);
  });
});

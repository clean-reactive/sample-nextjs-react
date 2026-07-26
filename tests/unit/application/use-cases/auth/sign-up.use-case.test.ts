import { describe, it, expect, beforeEach, type Mocked } from 'vitest';

import {
  signUpUseCase,
  type SignUpInputData,
  type SignUpOutputData,
} from '@/src/application/use-cases/auth/sign-up.use-case';
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

type UseCase = (input: SignUpInputData) => Promise<SignUpOutputData>;

type Context = {
  useCase: UseCase;
  usersRepository: Mocked<IUsersRepository>;
  authenticationService: Mocked<IAuthenticationService>;
  username: string;
  password: string;
};

describe(`${signUpUseCase.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.username = usernameFactory.item().username;
    ctx.password = passwordFactory.item().password;
    ctx.usersRepository = createUsersRepositoryMock();
    ctx.authenticationService = createAuthenticationServiceMock();
    ctx.useCase = signUpUseCase(
      ctx.usersRepository,
      ctx.authenticationService,
      presenter
    );
  });

  it<Context>('returns an InputParseError when the passwords do not match', async (ctx) => {
    await expect(
      ctx.useCase({
        username: ctx.username,
        password: ctx.password,
        confirm_password: 'something-else',
      })
    ).resolves.toBeInstanceOf(InputParseError);

    expect(ctx.usersRepository.getUserByUsername).not.toHaveBeenCalled();
  });

  it<Context>('returns an AuthenticationError when the username is taken', async (ctx) => {
    ctx.usersRepository.getUserByUsername.mockResolvedValue(
      userFactory.item({ username: ctx.username })
    );

    await expect(
      ctx.useCase({
        username: ctx.username,
        password: ctx.password,
        confirm_password: ctx.password,
      })
    ).resolves.toBeInstanceOf(AuthenticationError);

    expect(ctx.usersRepository.createUser).not.toHaveBeenCalled();
  });

  it<Context>('creates a user, a session, and returns the cookie on success', async (ctx) => {
    const newUser = userFactory.item({ username: ctx.username });
    const session = sessionFactory.item({ userId: newUser.id });
    const cookie = cookieFactory.item();
    ctx.usersRepository.getUserByUsername.mockResolvedValue(undefined);
    ctx.authenticationService.generateUserId.mockReturnValue(newUser.id);
    ctx.usersRepository.createUser.mockResolvedValue(newUser);
    ctx.authenticationService.createSession.mockResolvedValue({
      session,
      cookie,
    });

    await expect(
      ctx.useCase({
        username: ctx.username,
        password: ctx.password,
        confirm_password: ctx.password,
      })
    ).resolves.toBe(cookie);

    expect(ctx.usersRepository.createUser).toHaveBeenCalledWith({
      id: newUser.id,
      username: ctx.username,
      password: ctx.password,
    });
    expect(ctx.authenticationService.createSession).toHaveBeenCalledWith(
      newUser
    );
  });

  it<Context>('returns an UnknownError when any other error is thrown', async (ctx) => {
    ctx.usersRepository.getUserByUsername.mockRejectedValue(new Error('boom'));

    await expect(
      ctx.useCase({
        username: ctx.username,
        password: ctx.password,
        confirm_password: ctx.password,
      })
    ).resolves.toBeInstanceOf(UnknownError);
  });
});

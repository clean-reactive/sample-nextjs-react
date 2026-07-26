import { describe, expect, it, beforeEach, Mocked } from 'vitest';

import type { ISignInBffController } from '@/src/interface-adapters/bff/auth/sign-in/contract';
import { createUsersRepositoryMock } from '@/src/infrastructure/repositories/users.repository.mock';
import { createAuthenticationServiceMock } from '@/src/infrastructure/services/authentication.service.mock';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { userFactory } from '@/src/entities/models/user.factory';
import { usernameFactory } from '@/src/entities/models/username.factory';
import { passwordFactory } from '@/src/entities/models/password.factory';
import { cookieFactory } from '@/src/entities/models/cookie.factory';
import { sessionFactory } from '@/src/entities/models/session.factory';
import { TestBed } from '@/tests/integration/test-bed';
import { signInBffController } from '@/src/interface-adapters/bff/auth/sign-in/controller';

type Context = {
  controller: ISignInBffController;
  usersRepository: Mocked<IUsersRepository>;
  authenticationService: Mocked<IAuthenticationService>;
};

function formDataOf(fields: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe(`${signInBffController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.usersRepository = createUsersRepositoryMock();
    ctx.authenticationService = createAuthenticationServiceMock();

    const testBed = TestBed.make();
    testBed.override('IUsersRepository', ctx.usersRepository);
    testBed.override('IAuthenticationService', ctx.authenticationService);

    ctx.controller = testBed.inject('ISignInBffController');
  });

  it<Context>('returns invalid_credentials when the payload fails validation', async (ctx) => {
    await expect(ctx.controller(formDataOf({}))).resolves.toEqual({
      status: 'failure',
      code: 'invalid_credentials',
    });

    expect(ctx.usersRepository.getUserByUsername).not.toHaveBeenCalled();
  });

  it<Context>('returns invalid_credentials when the user does not exist', async (ctx) => {
    const { username } = usernameFactory.item();
    const { password } = passwordFactory.item();
    ctx.usersRepository.getUserByUsername.mockResolvedValue(undefined);

    await expect(
      ctx.controller(formDataOf({ username, password }))
    ).resolves.toEqual({
      status: 'failure',
      code: 'invalid_credentials',
    });

    expect(ctx.authenticationService.validatePasswords).not.toHaveBeenCalled();
  });

  it<Context>('returns invalid_credentials when the password is incorrect', async (ctx) => {
    const { password } = passwordFactory.item();
    const user = userFactory.item();
    ctx.usersRepository.getUserByUsername.mockResolvedValue(user);
    ctx.authenticationService.validatePasswords.mockResolvedValue(false);

    await expect(
      ctx.controller(formDataOf({ username: user.username, password }))
    ).resolves.toEqual({
      status: 'failure',
      code: 'invalid_credentials',
    });

    expect(ctx.authenticationService.createSession).not.toHaveBeenCalled();
  });

  it<Context>('returns the session cookie for valid credentials', async (ctx) => {
    const { password } = passwordFactory.item();
    const user = userFactory.item();
    const cookie = cookieFactory.item();
    const session = sessionFactory.item({ userId: user.id });
    ctx.usersRepository.getUserByUsername.mockResolvedValue(user);
    ctx.authenticationService.validatePasswords.mockResolvedValue(true);
    ctx.authenticationService.createSession.mockResolvedValue({
      session,
      cookie,
    });

    await expect(
      ctx.controller(formDataOf({ username: user.username, password }))
    ).resolves.toEqual({
      status: 'success',
      data: cookie,
    });

    expect(ctx.authenticationService.createSession).toHaveBeenCalledWith(user);
  });

  it<Context>('returns unexpected_error when the repository throws unexpectedly', async (ctx) => {
    const { username } = usernameFactory.item();
    const { password } = passwordFactory.item();
    ctx.usersRepository.getUserByUsername.mockRejectedValue(new Error('boom'));

    await expect(
      ctx.controller(formDataOf({ username, password }))
    ).resolves.toEqual({
      status: 'failure',
      code: 'unexpected_error',
    });
  });
});

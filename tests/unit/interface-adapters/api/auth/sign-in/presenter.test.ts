import { describe, expect, it, vi } from 'vitest';

import { signInApiPresenter } from '@/src/interface-adapters/api/auth/sign-in/presenter';
import { AuthenticationError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { cookieFactory } from '@/src/entities/models/cookie.factory';

describe(`${signInApiPresenter.name}`, () => {
  it('maps an InputParseError to a 400 failure', async () => {
    const presenter = signInApiPresenter();

    await expect(
      presenter(new InputParseError('Invalid data'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    });
  });

  it('maps an AuthenticationError to a 401 failure', async () => {
    const presenter = signInApiPresenter();

    await expect(
      presenter(new AuthenticationError('Incorrect username or password'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Incorrect username or password' },
      init: { status: 401 },
    });
  });

  it('maps an UnknownError to a 500 failure', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const presenter = signInApiPresenter();

    await expect(presenter(new UnknownError('boom'))).resolves.toEqual({
      status: 'failure',
      body: { error: 'An unexpected error occurred' },
      init: { status: 500 },
    });

    consoleErrorSpy.mockRestore();
  });

  it('maps a Cookie to a success result', async () => {
    const presenter = signInApiPresenter();
    const cookie = cookieFactory.item();

    await expect(presenter(cookie)).resolves.toEqual({
      status: 'success',
      body: { success: true },
      init: { status: 200 },
      cookie,
    });
  });
});

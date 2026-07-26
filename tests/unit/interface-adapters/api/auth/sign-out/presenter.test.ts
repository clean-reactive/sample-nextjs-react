import { describe, expect, it, vi } from 'vitest';

import { signOutApiPresenter } from '@/src/interface-adapters/api/auth/sign-out/presenter';
import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { cookieFactory } from '@/src/entities/models/cookie.factory';

describe(`${signOutApiPresenter.name}`, () => {
  it('maps an InputParseError to a 400 failure', async () => {
    const presenter = signOutApiPresenter();

    await expect(
      presenter(new InputParseError('Must provide a session ID'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Must provide a session ID' },
      init: { status: 400 },
    });
  });

  it('maps an UnauthenticatedError to a 401 failure', async () => {
    const presenter = signOutApiPresenter();

    await expect(
      presenter(new UnauthenticatedError('Session expired'))
    ).resolves.toEqual({
      status: 'failure',
      body: { error: 'Unauthenticated' },
      init: { status: 401 },
    });
  });

  it('maps an UnknownError to a 500 failure', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const presenter = signOutApiPresenter();

    await expect(presenter(new UnknownError('boom'))).resolves.toEqual({
      status: 'failure',
      body: { error: 'An unexpected error occurred' },
      init: { status: 500 },
    });

    consoleErrorSpy.mockRestore();
  });

  it('maps a Cookie to a success result', async () => {
    const presenter = signOutApiPresenter();
    const cookie = cookieFactory.item();

    await expect(presenter(cookie)).resolves.toEqual({
      status: 'success',
      body: { success: true },
      init: { status: 200 },
      cookie,
    });
  });
});

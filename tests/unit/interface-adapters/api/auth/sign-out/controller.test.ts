import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { signOutApiController } from '@/src/interface-adapters/api/auth/sign-out/controller';
import type {
  ISignOutApiUseCase,
  SignOutApiViewModel,
} from '@/src/interface-adapters/api/auth/sign-out/contract';
import { cookieFactory } from '@/src/entities/models/cookie.factory';

type Context = {
  controller: ReturnType<typeof signOutApiController>;
  signOutUseCase: Mock<ISignOutApiUseCase>;
};

describe(`${signOutApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.signOutUseCase = vi.fn();
    ctx.controller = signOutApiController(ctx.signOutUseCase);
  });

  it<Context>('forwards the session id to the use case and returns its output', async (ctx) => {
    const output: SignOutApiViewModel = {
      status: 'success',
      body: { success: true },
      init: { status: 200 },
      cookie: cookieFactory.item(),
    };
    ctx.signOutUseCase.mockResolvedValue(output);

    await expect(ctx.controller('session-id')).resolves.toBe(output);

    expect(ctx.signOutUseCase).toHaveBeenCalledWith({
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards undefined input as an undefined sessionId', async (ctx) => {
    const output: SignOutApiViewModel = {
      status: 'failure',
      body: { error: 'Must provide a session ID' },
      init: { status: 400 },
    };
    ctx.signOutUseCase.mockResolvedValue(output);

    await expect(ctx.controller(undefined)).resolves.toBe(output);

    expect(ctx.signOutUseCase).toHaveBeenCalledWith({ sessionId: undefined });
  });
});

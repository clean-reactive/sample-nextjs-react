import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { signInApiController } from '@/src/interface-adapters/api/auth/sign-in/controller';
import type {
  ISignInApiUseCase,
  SignInApiViewModel,
} from '@/src/interface-adapters/api/auth/sign-in/contract';
import { cookieFactory } from '@/src/entities/models/cookie.factory';

type Context = {
  controller: ReturnType<typeof signInApiController>;
  signInUseCase: Mock<ISignInApiUseCase>;
};

describe(`${signInApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.signInUseCase = vi.fn();
    ctx.controller = signInApiController(ctx.signInUseCase);
  });

  it<Context>('forwards the input to the use case and returns its output', async (ctx) => {
    const output: SignInApiViewModel = {
      status: 'success',
      body: { success: true },
      init: { status: 200 },
      cookie: cookieFactory.item(),
    };
    ctx.signInUseCase.mockResolvedValue(output);

    const input = { username: 'one', password: 'password-one' };

    await expect(ctx.controller(input)).resolves.toBe(output);

    expect(ctx.signInUseCase).toHaveBeenCalledWith(input);
  });

  it<Context>('forwards an empty input when the input is an empty object', async (ctx) => {
    const output: SignInApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signInUseCase.mockResolvedValue(output);

    await expect(ctx.controller({})).resolves.toBe(output);

    expect(ctx.signInUseCase).toHaveBeenCalledWith({});
  });

  it<Context>('extracts only the credential fields from the input', async (ctx) => {
    const output: SignInApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signInUseCase.mockResolvedValue(output);

    const input = { username: 'one', password: 'password-one', extra: 'noise' };

    await expect(ctx.controller(input)).resolves.toBe(output);

    expect(ctx.signInUseCase).toHaveBeenCalledWith({
      username: 'one',
      password: 'password-one',
    });
  });

  it<Context>('forwards an empty input when the input is not an object', async (ctx) => {
    const output: SignInApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signInUseCase.mockResolvedValue(output);

    await expect(ctx.controller('just-a-string')).resolves.toBe(output);

    expect(ctx.signInUseCase).toHaveBeenCalledWith({});
  });

  it<Context>('forwards a partial input when a credential field is missing', async (ctx) => {
    const output: SignInApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signInUseCase.mockResolvedValue(output);

    await expect(ctx.controller({ username: 'one' })).resolves.toBe(output);

    expect(ctx.signInUseCase).toHaveBeenCalledWith({ username: 'one' });
  });

  it<Context>('forwards an empty input when the credential fields have wrong types', async (ctx) => {
    const output: SignInApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signInUseCase.mockResolvedValue(output);

    await expect(
      ctx.controller({ username: 123, password: ['secret'] })
    ).resolves.toBe(output);

    expect(ctx.signInUseCase).toHaveBeenCalledWith({});
  });

  it<Context>('forwards out-of-bounds fields for the use case to reject', async (ctx) => {
    const output: SignInApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signInUseCase.mockResolvedValue(output);

    await expect(
      ctx.controller({ username: 'ab', password: 'short' })
    ).resolves.toBe(output);

    // The controller enforces only the wire shape; the entity bounds are the
    // use case's credentialsSchema to apply.
    expect(ctx.signInUseCase).toHaveBeenCalledWith({
      username: 'ab',
      password: 'short',
    });
  });
});

import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { signUpApiController } from '@/src/interface-adapters/api/auth/sign-up/controller';
import type {
  ISignUpApiUseCase,
  SignUpApiViewModel,
} from '@/src/interface-adapters/api/auth/sign-up/contract';
import { cookieFactory } from '@/src/entities/models/cookie.factory';
import { userFactory } from '@/src/entities/models/user.factory';

type Context = {
  controller: ReturnType<typeof signUpApiController>;
  signUpUseCase: Mock<ISignUpApiUseCase>;
};

describe(`${signUpApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.signUpUseCase = vi.fn();
    ctx.controller = signUpApiController(ctx.signUpUseCase);
  });

  it<Context>('forwards the input to the use case and returns its output', async (ctx) => {
    const user = userFactory.item();
    const output: SignUpApiViewModel = {
      status: 'success',
      body: { user: { id: user.id, username: user.username } },
      cookie: cookieFactory.item(),
      init: { status: 201 },
    };
    ctx.signUpUseCase.mockResolvedValue(output);

    const input = {
      username: 'one',
      password: 'password-one',
      confirm_password: 'password-one',
    };

    await expect(ctx.controller(input)).resolves.toBe(output);

    expect(ctx.signUpUseCase).toHaveBeenCalledWith(input);
  });

  it<Context>('forwards an empty input when the input is an empty object', async (ctx) => {
    const output: SignUpApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signUpUseCase.mockResolvedValue(output);

    await expect(ctx.controller({})).resolves.toBe(output);

    expect(ctx.signUpUseCase).toHaveBeenCalledWith({});
  });

  it<Context>('extracts only the credential fields from the input', async (ctx) => {
    const output: SignUpApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signUpUseCase.mockResolvedValue(output);

    const input = {
      username: 'one',
      password: 'password-one',
      confirm_password: 'password-one',
      extra: 'noise',
    };

    await expect(ctx.controller(input)).resolves.toBe(output);

    expect(ctx.signUpUseCase).toHaveBeenCalledWith({
      username: 'one',
      password: 'password-one',
      confirm_password: 'password-one',
    });
  });

  it<Context>('forwards an empty input when the input is not an object', async (ctx) => {
    const output: SignUpApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signUpUseCase.mockResolvedValue(output);

    await expect(ctx.controller('just-a-string')).resolves.toBe(output);

    expect(ctx.signUpUseCase).toHaveBeenCalledWith({});
  });

  it<Context>('forwards an empty input when the credential fields have wrong types', async (ctx) => {
    const output: SignUpApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.signUpUseCase.mockResolvedValue(output);

    await expect(
      ctx.controller({ username: 123, password: ['secret'] })
    ).resolves.toBe(output);

    expect(ctx.signUpUseCase).toHaveBeenCalledWith({});
  });
});

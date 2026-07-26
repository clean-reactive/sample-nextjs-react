import type { Dispatch } from 'react';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
  type Mocked,
} from 'vitest';

import { useSignUpUseCase } from './use-sign-up-use-case';
import { makeSignUpPageGateway } from '../../gateway';
import type { SignUpPageGateway } from '../../gateway.types';
import type { SignUpPageEntity, SignUpPageEvent } from '../../reducer';

vi.mock('../../gateway', () => {
  const gateway: Mocked<SignUpPageGateway> = { signUp: vi.fn() };
  return { makeSignUpPageGateway: () => gateway };
});

function makeFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    formData.append(name, value);
  }
  return formData;
}

type Context = {
  gateway: Mocked<SignUpPageGateway>;
  dispatch: Mock<Dispatch<SignUpPageEvent>>;
  state: SignUpPageEntity;
};

describe(`${useSignUpUseCase.name}`, () => {
  beforeEach<Context>((ctx) => {
    const gateway = makeSignUpPageGateway();
    ctx.gateway = vi.mocked(gateway);
    ctx.gateway.signUp.mockReset();
    ctx.dispatch = vi.fn();
    ctx.state = { status: 'idle' };
  });

  it<Context>('rejects mismatched passwords without calling the gateway', async (ctx) => {
    const signUpUseCase = useSignUpUseCase({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });

    await signUpUseCase(
      makeFormData({ password: 'one', confirm_password: 'two' })
    );

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'password_mismatch',
    });
    expect(ctx.gateway.signUp).not.toHaveBeenCalled();
  });

  it<Context>('starts the submit and forwards the form data when passwords match', async (ctx) => {
    ctx.gateway.signUp.mockResolvedValue(undefined);
    const signUpUseCase = useSignUpUseCase({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });
    const formData = makeFormData({
      password: 'same',
      confirm_password: 'same',
    });

    await signUpUseCase(formData);

    expect(ctx.dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
    expect(ctx.gateway.signUp).toHaveBeenCalledWith(formData);
  });

  it<Context>('does not dispatch a failure when the gateway succeeds', async (ctx) => {
    ctx.gateway.signUp.mockResolvedValue(undefined);
    const signUpUseCase = useSignUpUseCase({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });

    await signUpUseCase(
      makeFormData({ password: 'same', confirm_password: 'same' })
    );

    expect(ctx.dispatch).toHaveBeenCalledTimes(1);
    expect(ctx.dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
  });

  it<Context>('dispatches the failure code returned by the gateway', async (ctx) => {
    ctx.gateway.signUp.mockResolvedValue({
      status: 'failure',
      code: 'username_taken',
    });
    const signUpUseCase = useSignUpUseCase({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });

    await signUpUseCase(
      makeFormData({ password: 'same', confirm_password: 'same' })
    );

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'username_taken',
    });
  });

  it<Context>('dispatches unexpected_error when the gateway throws', async (ctx) => {
    ctx.gateway.signUp.mockRejectedValue(new Error('network down'));
    const signUpUseCase = useSignUpUseCase({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });

    await signUpUseCase(
      makeFormData({ password: 'same', confirm_password: 'same' })
    );

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'unexpected_error',
    });
  });

  it<Context>('ignores a submit while one is already in flight', async (ctx) => {
    const submitting: SignUpPageEntity = { status: 'submitting' };
    const signUpUseCase = useSignUpUseCase({
      state: submitting,
      dispatch: ctx.dispatch,
    });

    await signUpUseCase(
      makeFormData({ password: 'same', confirm_password: 'same' })
    );

    expect(ctx.dispatch).not.toHaveBeenCalled();
    expect(ctx.gateway.signUp).not.toHaveBeenCalled();
  });
});

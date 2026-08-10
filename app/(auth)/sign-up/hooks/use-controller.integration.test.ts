// @vitest-environment jsdom
import type { Dispatch, FormEvent } from 'react';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
  type Mocked,
} from 'vitest';

import { useController } from './use-controller';
import { makeSignUpPageGateway } from '../gateway/gateway';
import type { SignUpPageGateway } from '../gateway/gateway.types';
import type { SignUpPageEntity, SignUpPageEvent } from '../reducer';

vi.mock('../gateway/gateway', () => {
  const gateway: Mocked<SignUpPageGateway> = { signUp: vi.fn() };
  return { makeSignUpPageGateway: () => gateway };
});

function makeFormSubmitEvent(fields: Record<string, string>) {
  const form = document.createElement('form');
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  return {
    preventDefault: vi.fn(),
    currentTarget: form,
  } as unknown as FormEvent<HTMLFormElement>;
}

type Context = {
  gateway: Mocked<SignUpPageGateway>;
  dispatch: Mock<Dispatch<SignUpPageEvent>>;
  state: SignUpPageEntity;
};

describe(`${useController.name} integration`, () => {
  beforeEach<Context>((ctx) => {
    const gateway = makeSignUpPageGateway();
    ctx.gateway = vi.mocked(gateway);
    ctx.gateway.signUp.mockReset();
    ctx.dispatch = vi.fn();
    ctx.state = { status: 'idle' };
  });

  it<Context>('rejects mismatched passwords without calling the gateway', (ctx) => {
    const { onFormSubmit } = useController({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });
    const event = makeFormSubmitEvent({
      password: 'one',
      confirm_password: 'two',
    });

    onFormSubmit(event);

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'password_mismatch',
    });
    expect(ctx.gateway.signUp).not.toHaveBeenCalled();
  });

  it<Context>('starts the submit and forwards the form data when passwords match', (ctx) => {
    ctx.gateway.signUp.mockResolvedValue(undefined);
    const { onFormSubmit } = useController({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);

    expect(ctx.dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
    expect(ctx.gateway.signUp).toHaveBeenCalledWith(expect.any(FormData));
    const formData = ctx.gateway.signUp.mock.calls[0][0];
    expect(formData.get('password')).toBe('same');
    expect(formData.get('confirm_password')).toBe('same');
  });

  it<Context>('does not dispatch a failure when the gateway succeeds', async (ctx) => {
    const actionResult = Promise.resolve(undefined);
    ctx.gateway.signUp.mockReturnValue(actionResult);
    const { onFormSubmit } = useController({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);
    await actionResult;

    expect(ctx.dispatch).toHaveBeenCalledTimes(1);
    expect(ctx.dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
  });

  it<Context>('dispatches the failure code returned by the gateway', async (ctx) => {
    const actionResult = Promise.resolve({
      status: 'failure' as const,
      code: 'username_taken' as const,
    });
    ctx.gateway.signUp.mockReturnValue(actionResult);
    const { onFormSubmit } = useController({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);
    await actionResult;

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'username_taken',
    });
  });

  it<Context>('dispatches unexpected_error when the gateway throws', async (ctx) => {
    const actionResult = Promise.reject(new Error('network down'));
    ctx.gateway.signUp.mockReturnValue(actionResult);
    const { onFormSubmit } = useController({
      state: ctx.state,
      dispatch: ctx.dispatch,
    });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);
    await actionResult.catch(() => {});

    expect(ctx.dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'unexpected_error',
    });
  });

  it<Context>('ignores a submit while one is already in flight', (ctx) => {
    const submitting: SignUpPageEntity = { status: 'submitting' };
    const { onFormSubmit } = useController({
      state: submitting,
      dispatch: ctx.dispatch,
    });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);

    expect(ctx.dispatch).not.toHaveBeenCalled();
    expect(ctx.gateway.signUp).not.toHaveBeenCalled();
  });
});

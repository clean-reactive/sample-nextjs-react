// @vitest-environment jsdom
import type { FormEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useController } from './use-controller';
import { signUpAction } from '../actions';
import type { SignUpPageEntity } from '../reducer';

vi.mock('../actions', () => ({
  signUpAction: vi.fn(),
}));

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

describe(`${useController.name} integration`, () => {
  beforeEach(() => {
    vi.mocked(signUpAction).mockReset();
  });

  it('rejects mismatched passwords without calling the action', () => {
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const { onFormSubmit } = useController({ state: idle, dispatch });
    const event = makeFormSubmitEvent({
      password: 'one',
      confirm_password: 'two',
    });

    onFormSubmit(event);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'password_mismatch',
    });
    expect(signUpAction).not.toHaveBeenCalled();
  });

  it('starts the submit and forwards the form data when passwords match', () => {
    vi.mocked(signUpAction).mockResolvedValue(undefined);
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const { onFormSubmit } = useController({ state: idle, dispatch });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);

    expect(dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
    expect(signUpAction).toHaveBeenCalledWith(expect.any(FormData));
    const formData = vi.mocked(signUpAction).mock.calls[0][0];
    expect(formData.get('password')).toBe('same');
    expect(formData.get('confirm_password')).toBe('same');
  });

  it('does not dispatch a failure when the action succeeds', async () => {
    const actionResult = Promise.resolve(undefined);
    vi.mocked(signUpAction).mockReturnValue(actionResult);
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const { onFormSubmit } = useController({ state: idle, dispatch });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);
    await actionResult;

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
  });

  it('dispatches the failure code returned by the action', async () => {
    const actionResult = Promise.resolve({
      status: 'failure' as const,
      code: 'username_taken' as const,
    });
    vi.mocked(signUpAction).mockReturnValue(actionResult);
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const { onFormSubmit } = useController({ state: idle, dispatch });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);
    await actionResult;

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'username_taken',
    });
  });

  it('dispatches unexpected_error when the action throws', async () => {
    const actionResult = Promise.reject(new Error('network down'));
    vi.mocked(signUpAction).mockReturnValue(actionResult);
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const { onFormSubmit } = useController({ state: idle, dispatch });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);
    await actionResult.catch(() => {});

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'unexpected_error',
    });
  });

  it('ignores a submit while one is already in flight', () => {
    const dispatch = vi.fn();
    const submitting: SignUpPageEntity = { status: 'submitting' };
    const { onFormSubmit } = useController({ state: submitting, dispatch });
    const event = makeFormSubmitEvent({
      password: 'same',
      confirm_password: 'same',
    });

    onFormSubmit(event);

    expect(dispatch).not.toHaveBeenCalled();
    expect(signUpAction).not.toHaveBeenCalled();
  });
});

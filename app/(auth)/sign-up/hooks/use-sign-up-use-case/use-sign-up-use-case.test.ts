import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSignUpUseCase } from './use-sign-up-use-case';
import { signUpAction } from '../../actions';
import type { SignUpPageEntity } from '../../reducer';

vi.mock('../../actions', () => ({
  signUpAction: vi.fn(),
}));

function makeFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    formData.append(name, value);
  }
  return formData;
}

describe(`${useSignUpUseCase.name}`, () => {
  beforeEach(() => {
    vi.mocked(signUpAction).mockReset();
  });

  it('rejects mismatched passwords without calling the action', async () => {
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const signUp = useSignUpUseCase({ state: idle, dispatch });

    await signUp(makeFormData({ password: 'one', confirm_password: 'two' }));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'password_mismatch',
    });
    expect(signUpAction).not.toHaveBeenCalled();
  });

  it('starts the submit and forwards the form data when passwords match', async () => {
    vi.mocked(signUpAction).mockResolvedValue(undefined);
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const signUp = useSignUpUseCase({ state: idle, dispatch });
    const formData = makeFormData({
      password: 'same',
      confirm_password: 'same',
    });

    await signUp(formData);

    expect(dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
    expect(signUpAction).toHaveBeenCalledWith(formData);
  });

  it('does not dispatch a failure when the action succeeds', async () => {
    vi.mocked(signUpAction).mockResolvedValue(undefined);
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const signUp = useSignUpUseCase({ state: idle, dispatch });

    await signUp(makeFormData({ password: 'same', confirm_password: 'same' }));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: 'SUBMIT_STARTED' });
  });

  it('dispatches the failure code returned by the action', async () => {
    vi.mocked(signUpAction).mockResolvedValue({
      status: 'failure',
      code: 'username_taken',
    });
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const signUp = useSignUpUseCase({ state: idle, dispatch });

    await signUp(makeFormData({ password: 'same', confirm_password: 'same' }));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'username_taken',
    });
  });

  it('dispatches unexpected_error when the action throws', async () => {
    vi.mocked(signUpAction).mockRejectedValue(new Error('network down'));
    const dispatch = vi.fn();
    const idle: SignUpPageEntity = { status: 'idle' };
    const signUp = useSignUpUseCase({ state: idle, dispatch });

    await signUp(makeFormData({ password: 'same', confirm_password: 'same' }));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SUBMIT_FAILED',
      code: 'unexpected_error',
    });
  });

  it('ignores a submit while one is already in flight', async () => {
    const dispatch = vi.fn();
    const submitting: SignUpPageEntity = { status: 'submitting' };
    const signUp = useSignUpUseCase({ state: submitting, dispatch });

    await signUp(makeFormData({ password: 'same', confirm_password: 'same' }));

    expect(dispatch).not.toHaveBeenCalled();
    expect(signUpAction).not.toHaveBeenCalled();
  });
});

import type { Dispatch } from 'react';
import { signUpAction } from '../../actions';
import type { SignUpPageEntity, SignUpPageEvent } from '../../reducer';

type AppUseCase<T> = (params: T) => Promise<void>;

export interface UseCaseDependencies {
  state: SignUpPageEntity;
  dispatch: Dispatch<SignUpPageEvent>;
}

export function useSignUpUseCase(
  dependencies: UseCaseDependencies
): AppUseCase<FormData> {
  const { state, dispatch } = dependencies;

  return async (formData: FormData) => {
    if (state.status === 'submitting') return;

    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirm_password')?.toString();
    if (password !== confirmPassword) {
      dispatch({ type: 'SUBMIT_FAILED', code: 'password_mismatch' });
      return;
    }

    dispatch({ type: 'SUBMIT_STARTED' });
    try {
      const res = await signUpAction(formData);
      if (res?.status === 'failure') {
        dispatch({ type: 'SUBMIT_FAILED', code: res.code });
      }
    } catch {
      dispatch({ type: 'SUBMIT_FAILED', code: 'unexpected_error' });
    }
  };
}

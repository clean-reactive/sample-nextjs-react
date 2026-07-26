import type { SignUpFailureCode, SignUpPageEntity } from '../reducer';
import type { SignUpPagePresenter } from '../page.types';

export interface PresenterDependencies {
  state: SignUpPageEntity;
}

const errorMessages: Record<SignUpFailureCode, string> = {
  invalid_data:
    'Invalid data. Make sure the Password and Confirm Password match.',
  username_taken: 'Username taken',
  password_mismatch: 'Passwords must match',
  unexpected_error: 'Something went wrong. Please try again.',
};

export function usePresenter(
  dependencies: PresenterDependencies
): SignUpPagePresenter {
  const { state } = dependencies;

  const isSubmitting = state.status === 'submitting';
  const errorMessage =
    state.status === 'failure' ? errorMessages[state.code] : undefined;

  return {
    errorMessage,
    hasErrorVisible: !!errorMessage,
    isCreateAccountSpinnerVisible: isSubmitting,
    isCreateAccountLabelVisible: !isSubmitting,
    isCreateButtonDisabled: isSubmitting,
  };
}

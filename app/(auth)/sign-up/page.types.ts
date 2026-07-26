import type { FormEvent } from 'react';

export interface SignUpPageController {
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface SignUpPagePresenter {
  errorMessage?: string;
  hasErrorVisible: boolean;
  isCreateAccountSpinnerVisible: boolean;
  isCreateAccountLabelVisible: boolean;
  isCreateButtonDisabled: boolean;
}

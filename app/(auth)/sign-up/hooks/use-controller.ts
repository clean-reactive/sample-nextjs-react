import type { Dispatch, FormEvent } from 'react';
import { useSignUpUseCase } from './use-sign-up-use-case/use-sign-up-use-case';
import type { SignUpPageEntity, SignUpPageEvent } from '../reducer';
import type { SignUpPageController } from '../page.types';

export interface ControllerDependencies {
  state: SignUpPageEntity;
  dispatch: Dispatch<SignUpPageEvent>;
}

export function useController(
  dependencies: ControllerDependencies
): SignUpPageController {
  const signUp = useSignUpUseCase(dependencies);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    void signUp(formData);
  };

  return { onFormSubmit };
}

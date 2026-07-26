import type { SignInFailureCode } from './reducer';

/**
 * @description The sign-in gateway method (one function type per method);
 * no success branch — on success the action redirects and the promise
 * resolves with `void`.
 * @owner The page gateway; actions.ts implements it.
 * @emerges From the page use case's needs (inlined in the controller).
 */
export type SignInActionFailure = {
  status: 'failure';
  code: SignInFailureCode;
};

export type SignInAction = (
  formData: FormData
) => Promise<SignInActionFailure | void>;

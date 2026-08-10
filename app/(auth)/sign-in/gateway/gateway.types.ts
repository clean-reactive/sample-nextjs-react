import type { SignInFailureCode } from '../reducer';

export type SignInActionFailure = {
  status: 'failure';
  code: SignInFailureCode;
};

export type SignInAction = (
  formData: FormData
) => Promise<SignInActionFailure | void>;

/**
 * @description Gateway<I> of the sign-in page — all available actions.
 * @emerges From the page's needs: page use case depends on this contract rather
 * than on the concrete action.
 */
export interface SignInPageGateway {
  signIn: SignInAction;
}

import type { SignInFailureCode } from '../reducer';

/**
 * @description The sign-in gateway method; no success branch — on success the
 * action redirects and the promise resolves with `void`.
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

/**
 * @description Gateway<I> of the sign-in page — all available actions.
 * @owner The page; gateway.ts binds it to the server actions.
 * @emerges From the controller's needs: it depends on this contract rather than
 * on the concrete action.
 */
export interface SignInPageGateway {
  signIn: SignInAction;
}

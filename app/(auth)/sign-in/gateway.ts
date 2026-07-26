import { signInAction } from './actions';
import type { SignInPageGateway } from './gateway.types';

export const makeSignInPageGateway = (): SignInPageGateway => ({
  signIn: signInAction,
});

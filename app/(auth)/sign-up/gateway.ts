import { signUpAction } from './actions';
import type { SignUpPageGateway } from './gateway.types';

export const makeSignUpPageGateway = (): SignUpPageGateway => ({
  signUp: signUpAction,
});

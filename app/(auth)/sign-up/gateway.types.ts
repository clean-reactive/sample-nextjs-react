import type { SignUpFailureCode } from './reducer';

export type SignUpAction = (
  formData: FormData
) => Promise<SignUpActionFailure | void>;

export type SignUpActionFailure = {
  status: 'failure';
  code: SignUpFailureCode;
};

export interface SignUpPageGateway {
  signUp: SignUpAction;
}

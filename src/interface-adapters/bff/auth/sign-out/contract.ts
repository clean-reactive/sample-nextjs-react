import { Cookie } from '@/src/entities/models/cookie';
import {
  ISignOutPresenter,
  ISignOutUseCase,
} from '@/src/application/use-cases/auth/sign-out.use-case';
import { Session } from '@/src/entities/models/session';

export type SignOutFailure = {
  status: 'failure';
  code: 'unauthenticated' | 'unexpected_error';
};

export type SignOutSuccess = {
  status: 'success';
  data: Cookie;
};

export type SignOutBffViewModel = SignOutFailure | SignOutSuccess;

export type ISignOutBffController = (
  sessionId?: Session['id']
) => Promise<SignOutBffViewModel>;

export type ISignOutBffUseCase = ISignOutUseCase<SignOutBffViewModel>;

export type ISignOutBffPresenter = ISignOutPresenter<SignOutBffViewModel>;

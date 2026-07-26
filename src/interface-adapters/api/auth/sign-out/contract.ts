import { Cookie } from '@/src/entities/models/cookie';
import {
  ISignOutPresenter,
  ISignOutUseCase,
} from '@/src/application/use-cases/auth/sign-out.use-case';
import { Session } from '@/src/entities/models/session';

export type SignOutApiViewModel =
  | {
      status: 'success';
      body: { success: true };
      init: { status: number };
      cookie: Cookie;
    }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type ISignOutApiController = (
  sessionId?: Session['id']
) => Promise<SignOutApiViewModel>;

export type ISignOutApiUseCase = ISignOutUseCase<SignOutApiViewModel>;

export type ISignOutApiPresenter = ISignOutPresenter<SignOutApiViewModel>;

import { Cookie } from '@/src/entities/models/cookie';
import {
  ISignInPresenter,
  ISignInUseCase,
} from '@/src/application/use-cases/auth/sign-in.use-case';

export type SignInApiViewModel =
  | {
      status: 'success';
      body: { success: true };
      init: { status: number };
      cookie: Cookie;
    }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type ISignInApiController = (
  payload: unknown
) => Promise<SignInApiViewModel>;

export type ISignInApiUseCase = ISignInUseCase<SignInApiViewModel>;

export type ISignInApiPresenter = ISignInPresenter<SignInApiViewModel>;

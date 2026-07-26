import { Cookie } from '@/src/entities/models/cookie';
import { User } from '@/src/entities/models/user';
import {
  ISignUpPresenter,
  ISignUpUseCase,
} from '@/src/application/use-cases/auth/sign-up.use-case';

export type SignUpApiViewModel =
  | {
      status: 'success';
      body: { user: { id: string; username: string } };
      cookie: Cookie;
      init: { status: number };
    }
  | {
      status: 'created';
      body: { message: string };
      init: { status: number };
    }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type ISignUpApiController = (
  payload: unknown
) => Promise<SignUpApiViewModel>;

export type ISignUpApiUseCase = ISignUpUseCase<SignUpApiViewModel>;

export type ISignUpApiPresenter = ISignUpPresenter<SignUpApiViewModel>;

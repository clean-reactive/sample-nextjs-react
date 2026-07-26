import { createModule } from '@evyweb/ioctopus';

import { AuthenticationService } from '@/src/infrastructure/services/authentication.service.sqlite';
import { InFileAuthenticationService } from '@/src/infrastructure/services/authentication.service.in-file';

import { signInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { signUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';

import { signInApiController } from '@/src/interface-adapters/api/auth/sign-in/controller';
import { signInApiPresenter } from '@/src/interface-adapters/api/auth/sign-in/presenter';
import { signUpApiController } from '@/src/interface-adapters/api/auth/sign-up/controller';
import { signUpApiPresenter } from '@/src/interface-adapters/api/auth/sign-up/presenter';
import { signOutApiController } from '@/src/interface-adapters/api/auth/sign-out/controller';
import { signOutApiPresenter } from '@/src/interface-adapters/api/auth/sign-out/presenter';
import { signInBffController } from '@/src/interface-adapters/bff/auth/sign-in/controller';
import { signInBffPresenter } from '@/src/interface-adapters/bff/auth/sign-in/presenter';
import { signUpBffController } from '@/src/interface-adapters/bff/auth/sign-up/controller';
import { signUpBffPresenter } from '@/src/interface-adapters/bff/auth/sign-up/presenter';
import { signOutBffController } from '@/src/interface-adapters/bff/auth/sign-out/controller';
import { signOutBffPresenter } from '@/src/interface-adapters/bff/auth/sign-out/presenter';
import { signUpE2eController } from '@/src/interface-adapters/e2e/auth/sign-up/controller';
import { signUpE2ePresenter } from '@/src/interface-adapters/e2e/auth/sign-up/presenter';

import { DI_SYMBOLS } from '@/di/types';
import { USE_IN_FILE } from '@/di/persistence';

export function createAuthenticationModule() {
  const authenticationModule = createModule();

  if (USE_IN_FILE) {
    authenticationModule
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(InFileAuthenticationService);
  } else {
    authenticationModule
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(AuthenticationService, [DI_SYMBOLS.IUsersRepository]);
  }

  authenticationModule
    .bind(DI_SYMBOLS.ISignInApiPresenter)
    .toHigherOrderFunction(signInApiPresenter, []);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInApiUseCase)
    .toHigherOrderFunction(signInUseCase, [
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignInApiPresenter,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInApiController)
    .toHigherOrderFunction(signInApiController, [DI_SYMBOLS.ISignInApiUseCase]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInBffPresenter)
    .toHigherOrderFunction(signInBffPresenter, []);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInBffUseCase)
    .toHigherOrderFunction(signInUseCase, [
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignInBffPresenter,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignInBffController)
    .toHigherOrderFunction(signInBffController, [DI_SYMBOLS.ISignInBffUseCase]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpBffPresenter)
    .toHigherOrderFunction(signUpBffPresenter, []);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpBffUseCase)
    .toHigherOrderFunction(signUpUseCase, [
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignUpBffPresenter,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpBffController)
    .toHigherOrderFunction(signUpBffController, [DI_SYMBOLS.ISignUpBffUseCase]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutBffPresenter)
    .toHigherOrderFunction(signOutBffPresenter, []);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutBffUseCase)
    .toHigherOrderFunction(signOutUseCase, [
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignOutBffPresenter,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutBffController)
    .toHigherOrderFunction(signOutBffController, [
      DI_SYMBOLS.ISignOutBffUseCase,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutApiPresenter)
    .toHigherOrderFunction(signOutApiPresenter, []);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutApiUseCase)
    .toHigherOrderFunction(signOutUseCase, [
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignOutApiPresenter,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutApiController)
    .toHigherOrderFunction(signOutApiController, [
      DI_SYMBOLS.ISignOutApiUseCase,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpApiPresenter)
    .toHigherOrderFunction(signUpApiPresenter, [
      DI_SYMBOLS.IAuthenticationService,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpApiUseCase)
    .toHigherOrderFunction(signUpUseCase, [
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignUpApiPresenter,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpApiController)
    .toHigherOrderFunction(signUpApiController, [DI_SYMBOLS.ISignUpApiUseCase]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpE2ePresenter)
    .toHigherOrderFunction(signUpE2ePresenter, []);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpE2eUseCase)
    .toHigherOrderFunction(signUpUseCase, [
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignUpE2ePresenter,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignUpE2eController)
    .toHigherOrderFunction(signUpE2eController, [DI_SYMBOLS.ISignUpE2eUseCase]);

  return authenticationModule;
}

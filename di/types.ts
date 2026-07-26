import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

import { ISignInBffUseCase } from '@/src/interface-adapters/bff/auth/sign-in/contract';
import { ISignUpBffUseCase } from '@/src/interface-adapters/bff/auth/sign-up/contract';
import { ISignOutBffUseCase } from '@/src/interface-adapters/bff/auth/sign-out/contract';
import { ICreateTodoBffUseCase } from '@/src/interface-adapters/bff/todos/create-todo/contract';
import { IToggleTodoBffUseCase } from '@/src/interface-adapters/bff/todos/toggle-todo/contract';
import { IBulkUpdateBffUseCase } from '@/src/interface-adapters/bff/todos/bulk-update/contract';
import { IGetTodosForUserBffUseCase } from '@/src/interface-adapters/bff/todos/get-todos-for-user/contract';

import {
  ISignInApiController,
  ISignInApiPresenter,
  ISignInApiUseCase,
} from '@/src/interface-adapters/api/auth/sign-in/contract';
import {
  ISignUpApiController,
  ISignUpApiPresenter,
  ISignUpApiUseCase,
} from '@/src/interface-adapters/api/auth/sign-up/contract';
import {
  ISignOutApiController,
  ISignOutApiPresenter,
  ISignOutApiUseCase,
} from '@/src/interface-adapters/api/auth/sign-out/contract';
import {
  ISignInBffController,
  ISignInBffPresenter,
} from '@/src/interface-adapters/bff/auth/sign-in/contract';
import {
  ISignUpBffController,
  ISignUpBffPresenter,
} from '@/src/interface-adapters/bff/auth/sign-up/contract';
import {
  ISignOutBffController,
  ISignOutBffPresenter,
} from '@/src/interface-adapters/bff/auth/sign-out/contract';
import {
  ICreateTodoBffController,
  ICreateTodoBffPresenter,
} from '@/src/interface-adapters/bff/todos/create-todo/contract';
import {
  IToggleTodoBffController,
  IToggleTodoBffPresenter,
} from '@/src/interface-adapters/bff/todos/toggle-todo/contract';
import {
  IBulkUpdateBffController,
  IBulkUpdateBffPresenter,
} from '@/src/interface-adapters/bff/todos/bulk-update/contract';
import {
  IGetTodosForUserBffController,
  IGetTodosForUserBffPresenter,
} from '@/src/interface-adapters/bff/todos/get-todos-for-user/contract';
import {
  IGetTodosForUserApiController,
  IGetTodosForUserApiPresenter,
  IGetTodosForUserApiUseCase,
} from '@/src/interface-adapters/api/todos/get-todos-for-user/contract';
import {
  ICreateTodoApiController,
  ICreateTodoApiPresenter,
  ICreateTodoApiUseCase,
} from '@/src/interface-adapters/api/todos/create-todo/contract';
import {
  IToggleTodoApiController,
  IToggleTodoApiPresenter,
  IToggleTodoApiUseCase,
} from '@/src/interface-adapters/api/todos/toggle-todo/contract';
import {
  IBulkUpdateApiController,
  IBulkUpdateApiPresenter,
  IBulkUpdateApiUseCase,
} from '@/src/interface-adapters/api/todos/bulk-update/contract';
import {
  IDeleteTodoApiController,
  IDeleteTodoApiPresenter,
  IDeleteTodoApiUseCase,
} from '@/src/interface-adapters/api/todos/delete-todo/contract';
import {
  ISignUpE2eController,
  ISignUpE2ePresenter,
  ISignUpE2eUseCase,
} from '@/src/interface-adapters/e2e/auth/sign-up/contract';
import {
  ICreateTodoE2eController,
  ICreateTodoE2ePresenter,
  ICreateTodoE2eUseCase,
} from '@/src/interface-adapters/e2e/todos/create-todo/contract';
import {
  IGetTodosForUserE2eController,
  IGetTodosForUserE2ePresenter,
  IGetTodosForUserE2eUseCase,
} from '@/src/interface-adapters/e2e/todos/get-todos-for-user/contract';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),

  // Repositories
  ITodosRepository: Symbol.for('ITodosRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),

  // Use Cases
  ISignInBffUseCase: Symbol.for('ISignInBffUseCase'),
  ISignUpBffUseCase: Symbol.for('ISignUpBffUseCase'),
  ISignOutBffUseCase: Symbol.for('ISignOutBffUseCase'),
  ISignInApiUseCase: Symbol.for('ISignInApiUseCase'),
  ISignUpApiUseCase: Symbol.for('ISignUpApiUseCase'),
  ISignOutApiUseCase: Symbol.for('ISignOutApiUseCase'),
  ICreateTodoBffUseCase: Symbol.for('ICreateTodoBffUseCase'),
  IToggleTodoBffUseCase: Symbol.for('IToggleTodoBffUseCase'),
  IBulkUpdateBffUseCase: Symbol.for('IBulkUpdateBffUseCase'),
  IGetTodosForUserBffUseCase: Symbol.for('IGetTodosForUserBffUseCase'),
  IGetTodosForUserApiUseCase: Symbol.for('IGetTodosForUserApiUseCase'),
  ICreateTodoApiUseCase: Symbol.for('ICreateTodoApiUseCase'),
  IToggleTodoApiUseCase: Symbol.for('IToggleTodoApiUseCase'),
  IBulkUpdateApiUseCase: Symbol.for('IBulkUpdateApiUseCase'),
  IDeleteTodoApiUseCase: Symbol.for('IDeleteTodoApiUseCase'),
  ISignUpE2eUseCase: Symbol.for('ISignUpE2eUseCase'),
  ICreateTodoE2eUseCase: Symbol.for('ICreateTodoE2eUseCase'),
  IGetTodosForUserE2eUseCase: Symbol.for('IGetTodosForUserE2eUseCase'),

  // Presenters
  ISignInBffPresenter: Symbol.for('ISignInBffPresenter'),
  ISignUpBffPresenter: Symbol.for('ISignUpBffPresenter'),
  ISignOutBffPresenter: Symbol.for('ISignOutBffPresenter'),
  ISignInApiPresenter: Symbol.for('ISignInApiPresenter'),
  ISignUpApiPresenter: Symbol.for('ISignUpApiPresenter'),
  ISignOutApiPresenter: Symbol.for('ISignOutApiPresenter'),
  ICreateTodoBffPresenter: Symbol.for('ICreateTodoBffPresenter'),
  IToggleTodoBffPresenter: Symbol.for('IToggleTodoBffPresenter'),
  IBulkUpdateBffPresenter: Symbol.for('IBulkUpdateBffPresenter'),
  IGetTodosForUserBffPresenter: Symbol.for('IGetTodosForUserBffPresenter'),
  IGetTodosForUserApiPresenter: Symbol.for('IGetTodosForUserApiPresenter'),
  ICreateTodoApiPresenter: Symbol.for('ICreateTodoApiPresenter'),
  IToggleTodoApiPresenter: Symbol.for('IToggleTodoApiPresenter'),
  IBulkUpdateApiPresenter: Symbol.for('IBulkUpdateApiPresenter'),
  IDeleteTodoApiPresenter: Symbol.for('IDeleteTodoApiPresenter'),
  ISignUpE2ePresenter: Symbol.for('ISignUpE2ePresenter'),
  ICreateTodoE2ePresenter: Symbol.for('ICreateTodoE2ePresenter'),
  IGetTodosForUserE2ePresenter: Symbol.for('IGetTodosForUserE2ePresenter'),

  // Controllers
  ISignInBffController: Symbol.for('ISignInBffController'),
  ISignUpBffController: Symbol.for('ISignUpBffController'),
  ISignOutBffController: Symbol.for('ISignOutBffController'),
  ICreateTodoBffController: Symbol.for('ICreateTodoBffController'),
  IToggleTodoBffController: Symbol.for('IToggleTodoBffController'),
  IBulkUpdateBffController: Symbol.for('IBulkUpdateBffController'),
  IGetTodosForUserBffController: Symbol.for('IGetTodosForUserBffController'),
  ISignInApiController: Symbol.for('ISignInApiController'),
  ISignUpApiController: Symbol.for('ISignUpApiController'),
  ISignOutApiController: Symbol.for('ISignOutApiController'),
  IGetTodosForUserApiController: Symbol.for('IGetTodosForUserApiController'),
  ICreateTodoApiController: Symbol.for('ICreateTodoApiController'),
  IToggleTodoApiController: Symbol.for('IToggleTodoApiController'),
  IBulkUpdateApiController: Symbol.for('IBulkUpdateApiController'),
  IDeleteTodoApiController: Symbol.for('IDeleteTodoApiController'),

  // E2E controllers
  ISignUpE2eController: Symbol.for('ISignUpE2eController'),
  ICreateTodoE2eController: Symbol.for('ICreateTodoE2eController'),
  IGetTodosForUserE2eController: Symbol.for('IGetTodosForUserE2eController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;

  // Repositories
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;

  // Use Cases
  ISignInBffUseCase: ISignInBffUseCase;
  ISignUpBffUseCase: ISignUpBffUseCase;
  ISignOutBffUseCase: ISignOutBffUseCase;
  ISignInApiUseCase: ISignInApiUseCase;
  ISignUpApiUseCase: ISignUpApiUseCase;
  ISignOutApiUseCase: ISignOutApiUseCase;
  ICreateTodoBffUseCase: ICreateTodoBffUseCase;
  IToggleTodoBffUseCase: IToggleTodoBffUseCase;
  IBulkUpdateBffUseCase: IBulkUpdateBffUseCase;
  IGetTodosForUserBffUseCase: IGetTodosForUserBffUseCase;
  IGetTodosForUserApiUseCase: IGetTodosForUserApiUseCase;
  ICreateTodoApiUseCase: ICreateTodoApiUseCase;
  IToggleTodoApiUseCase: IToggleTodoApiUseCase;
  IBulkUpdateApiUseCase: IBulkUpdateApiUseCase;
  IDeleteTodoApiUseCase: IDeleteTodoApiUseCase;
  ISignUpE2eUseCase: ISignUpE2eUseCase;
  ICreateTodoE2eUseCase: ICreateTodoE2eUseCase;
  IGetTodosForUserE2eUseCase: IGetTodosForUserE2eUseCase;

  // Presenters
  ISignInBffPresenter: ISignInBffPresenter;
  ISignUpBffPresenter: ISignUpBffPresenter;
  ISignOutBffPresenter: ISignOutBffPresenter;
  ISignInApiPresenter: ISignInApiPresenter;
  ISignUpApiPresenter: ISignUpApiPresenter;
  ISignOutApiPresenter: ISignOutApiPresenter;
  ICreateTodoBffPresenter: ICreateTodoBffPresenter;
  IToggleTodoBffPresenter: IToggleTodoBffPresenter;
  IBulkUpdateBffPresenter: IBulkUpdateBffPresenter;
  IGetTodosForUserBffPresenter: IGetTodosForUserBffPresenter;
  IGetTodosForUserApiPresenter: IGetTodosForUserApiPresenter;
  ICreateTodoApiPresenter: ICreateTodoApiPresenter;
  IToggleTodoApiPresenter: IToggleTodoApiPresenter;
  IBulkUpdateApiPresenter: IBulkUpdateApiPresenter;
  IDeleteTodoApiPresenter: IDeleteTodoApiPresenter;
  ISignUpE2ePresenter: ISignUpE2ePresenter;
  ICreateTodoE2ePresenter: ICreateTodoE2ePresenter;
  IGetTodosForUserE2ePresenter: IGetTodosForUserE2ePresenter;

  // Controllers
  ISignInBffController: ISignInBffController;
  ISignUpBffController: ISignUpBffController;
  ISignOutBffController: ISignOutBffController;
  ICreateTodoBffController: ICreateTodoBffController;
  IToggleTodoBffController: IToggleTodoBffController;
  IBulkUpdateBffController: IBulkUpdateBffController;
  IGetTodosForUserBffController: IGetTodosForUserBffController;
  ISignInApiController: ISignInApiController;
  ISignUpApiController: ISignUpApiController;
  ISignOutApiController: ISignOutApiController;
  IGetTodosForUserApiController: IGetTodosForUserApiController;
  ICreateTodoApiController: ICreateTodoApiController;
  IToggleTodoApiController: IToggleTodoApiController;
  IBulkUpdateApiController: IBulkUpdateApiController;
  IDeleteTodoApiController: IDeleteTodoApiController;

  // E2E controllers
  ISignUpE2eController: ISignUpE2eController;
  ICreateTodoE2eController: ICreateTodoE2eController;
  IGetTodosForUserE2eController: IGetTodosForUserE2eController;
}

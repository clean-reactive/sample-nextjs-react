import { createModule } from '@evyweb/ioctopus';

import { InFileTodosRepository } from '@/src/infrastructure/repositories/todos.repository.in-file';
import { SqliteTodosRepository } from '@/src/infrastructure/repositories/todos.repository.sqlite';

import { createTodoUseCase } from '@/src/application/use-cases/todos/create-todo.use-case';
import { toggleTodoUseCase } from '@/src/application/use-cases/todos/toggle-todo.use-case';
import { bulkUpdateUseCase } from '@/src/application/use-cases/todos/bulk-update.use-case';
import { getTodosForUserUseCase } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { deleteTodoUseCase } from '@/src/application/use-cases/todos/delete-todo.use-case';

import { createTodoBffController } from '@/src/interface-adapters/bff/todos/create-todo/controller';
import { createTodoBffPresenter } from '@/src/interface-adapters/bff/todos/create-todo/presenter';
import { toggleTodoBffController } from '@/src/interface-adapters/bff/todos/toggle-todo/controller';
import { toggleTodoBffPresenter } from '@/src/interface-adapters/bff/todos/toggle-todo/presenter';
import { bulkUpdateBffController } from '@/src/interface-adapters/bff/todos/bulk-update/controller';
import { bulkUpdateBffPresenter } from '@/src/interface-adapters/bff/todos/bulk-update/presenter';
import { getTodosForUserBffController } from '@/src/interface-adapters/bff/todos/get-todos-for-user/controller';
import { getTodosForUserBffPresenter } from '@/src/interface-adapters/bff/todos/get-todos-for-user/presenter';
import { getTodosForUserApiController } from '@/src/interface-adapters/api/todos/get-todos-for-user/controller';
import { getTodosForUserApiPresenter } from '@/src/interface-adapters/api/todos/get-todos-for-user/presenter';
import { createTodoApiController } from '@/src/interface-adapters/api/todos/create-todo/controller';
import { createTodoApiPresenter } from '@/src/interface-adapters/api/todos/create-todo/presenter';
import { toggleTodoApiController } from '@/src/interface-adapters/api/todos/toggle-todo/controller';
import { toggleTodoApiPresenter } from '@/src/interface-adapters/api/todos/toggle-todo/presenter';
import { bulkUpdateApiController } from '@/src/interface-adapters/api/todos/bulk-update/controller';
import { bulkUpdateApiPresenter } from '@/src/interface-adapters/api/todos/bulk-update/presenter';
import { deleteTodoApiController } from '@/src/interface-adapters/api/todos/delete-todo/controller';
import { deleteTodoApiPresenter } from '@/src/interface-adapters/api/todos/delete-todo/presenter';
import { createTodoE2eController } from '@/src/interface-adapters/e2e/todos/create-todo/controller';
import { createTodoE2ePresenter } from '@/src/interface-adapters/e2e/todos/create-todo/presenter';
import { getTodosForUserE2eController } from '@/src/interface-adapters/e2e/todos/get-todos-for-user/controller';
import { getTodosForUserE2ePresenter } from '@/src/interface-adapters/e2e/todos/get-todos-for-user/presenter';

import { DI_SYMBOLS } from '@/di/types';
import { USE_IN_FILE } from '@/di/persistence';

export function createTodosModule() {
  const todosModule = createModule();

  if (USE_IN_FILE) {
    todosModule
      .bind(DI_SYMBOLS.ITodosRepository)
      .toClass(InFileTodosRepository);
  } else {
    todosModule
      .bind(DI_SYMBOLS.ITodosRepository)
      .toClass(SqliteTodosRepository);
  }

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoBffPresenter)
    .toHigherOrderFunction(createTodoBffPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoBffUseCase)
    .toHigherOrderFunction(createTodoUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ICreateTodoBffPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoBffController)
    .toHigherOrderFunction(createTodoBffController, [
      DI_SYMBOLS.ICreateTodoBffUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IToggleTodoBffPresenter)
    .toHigherOrderFunction(toggleTodoBffPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IToggleTodoBffUseCase)
    .toHigherOrderFunction(toggleTodoUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IToggleTodoBffPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IToggleTodoBffController)
    .toHigherOrderFunction(toggleTodoBffController, [
      DI_SYMBOLS.IToggleTodoBffUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IBulkUpdateBffPresenter)
    .toHigherOrderFunction(bulkUpdateBffPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IBulkUpdateBffUseCase)
    .toHigherOrderFunction(bulkUpdateUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IBulkUpdateBffPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IBulkUpdateBffController)
    .toHigherOrderFunction(bulkUpdateBffController, [
      DI_SYMBOLS.IBulkUpdateBffUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserBffPresenter)
    .toHigherOrderFunction(getTodosForUserBffPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserBffUseCase)
    .toHigherOrderFunction(getTodosForUserUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IGetTodosForUserBffPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserBffController)
    .toHigherOrderFunction(getTodosForUserBffController, [
      DI_SYMBOLS.IGetTodosForUserBffUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserApiPresenter)
    .toHigherOrderFunction(getTodosForUserApiPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserApiUseCase)
    .toHigherOrderFunction(getTodosForUserUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IGetTodosForUserApiPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserApiController)
    .toHigherOrderFunction(getTodosForUserApiController, [
      DI_SYMBOLS.IGetTodosForUserApiUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoApiPresenter)
    .toHigherOrderFunction(createTodoApiPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoApiUseCase)
    .toHigherOrderFunction(createTodoUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ICreateTodoApiPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoApiController)
    .toHigherOrderFunction(createTodoApiController, [
      DI_SYMBOLS.ICreateTodoApiUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IToggleTodoApiPresenter)
    .toHigherOrderFunction(toggleTodoApiPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IToggleTodoApiUseCase)
    .toHigherOrderFunction(toggleTodoUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IToggleTodoApiPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IToggleTodoApiController)
    .toHigherOrderFunction(toggleTodoApiController, [
      DI_SYMBOLS.IToggleTodoApiUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IBulkUpdateApiPresenter)
    .toHigherOrderFunction(bulkUpdateApiPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IBulkUpdateApiUseCase)
    .toHigherOrderFunction(bulkUpdateUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IBulkUpdateApiPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IBulkUpdateApiController)
    .toHigherOrderFunction(bulkUpdateApiController, [
      DI_SYMBOLS.IBulkUpdateApiUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IDeleteTodoApiPresenter)
    .toHigherOrderFunction(deleteTodoApiPresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IDeleteTodoApiUseCase)
    .toHigherOrderFunction(deleteTodoUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IDeleteTodoApiPresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IDeleteTodoApiController)
    .toHigherOrderFunction(deleteTodoApiController, [
      DI_SYMBOLS.IDeleteTodoApiUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoE2ePresenter)
    .toHigherOrderFunction(createTodoE2ePresenter, []);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoE2eUseCase)
    .toHigherOrderFunction(createTodoUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ICreateTodoE2ePresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.ICreateTodoE2eController)
    .toHigherOrderFunction(createTodoE2eController, [
      DI_SYMBOLS.ICreateTodoE2eUseCase,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserE2ePresenter)
    .toHigherOrderFunction(getTodosForUserE2ePresenter, []);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserE2eUseCase)
    .toHigherOrderFunction(getTodosForUserUseCase, [
      DI_SYMBOLS.ITodosRepository,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IGetTodosForUserE2ePresenter,
    ]);

  todosModule
    .bind(DI_SYMBOLS.IGetTodosForUserE2eController)
    .toHigherOrderFunction(getTodosForUserE2eController, [
      DI_SYMBOLS.IGetTodosForUserE2eUseCase,
    ]);

  return todosModule;
}

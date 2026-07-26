import { createContainer, type Container } from '@evyweb/ioctopus';

import { DI_RETURN_TYPES, DI_SYMBOLS } from '@/di/types';

import { createAuthenticationModule } from '@/di/modules/authentication.module';
import { createTransactionManagerModule } from '@/di/modules/database.module';
import { createTodosModule } from '@/di/modules/todos.module';
import { createUsersModule } from '@/di/modules/users.module';

export function registerApplicationModules(container: Container) {
  container.load(
    Symbol('TransactionManagerModule'),
    createTransactionManagerModule()
  );
  container.load(Symbol('AuthenticationModule'), createAuthenticationModule());
  container.load(Symbol('UsersModule'), createUsersModule());
  container.load(Symbol('TodosModule'), createTodosModule());
}

const ApplicationContainer = createContainer();
registerApplicationModules(ApplicationContainer);

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}

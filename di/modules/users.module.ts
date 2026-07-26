import { createModule } from '@evyweb/ioctopus';

import { InFileUsersRepository } from '@/src/infrastructure/repositories/users.repository.in-file';
import { SqliteUsersRepository } from '@/src/infrastructure/repositories/users.repository.sqlite';

import { DI_SYMBOLS } from '@/di/types';
import { USE_IN_FILE } from '@/di/persistence';

export function createUsersModule() {
  const usersModule = createModule();

  if (USE_IN_FILE) {
    usersModule
      .bind(DI_SYMBOLS.IUsersRepository)
      .toClass(InFileUsersRepository);
  } else {
    usersModule
      .bind(DI_SYMBOLS.IUsersRepository)
      .toClass(SqliteUsersRepository);
  }

  return usersModule;
}

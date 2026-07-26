import { createModule } from '@evyweb/ioctopus';

import { TransactionManagerService } from '@/src/infrastructure/services/transaction-manager.service.sqlite';
import { InFileTransactionManagerService } from '@/src/infrastructure/services/transaction-manager.service.in-file';

import { DI_SYMBOLS } from '@/di/types';
import { USE_IN_FILE } from '@/di/persistence';

export function createTransactionManagerModule() {
  const transactionManagerModule = createModule();

  if (USE_IN_FILE) {
    transactionManagerModule
      .bind(DI_SYMBOLS.ITransactionManagerService)
      .toClass(InFileTransactionManagerService);
  } else {
    transactionManagerModule
      .bind(DI_SYMBOLS.ITransactionManagerService)
      .toClass(TransactionManagerService);
  }

  return transactionManagerModule;
}

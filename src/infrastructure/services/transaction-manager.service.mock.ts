import { vi, type Mocked } from 'vitest';

import type { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import type { ITransaction } from '@/src/entities/models/transaction.interface';

export const createTransactionManagerServiceMock = () => {
  const tx: ITransaction = {};
  const startTransaction = vi.fn(
    (clb: (tx: ITransaction) => Promise<unknown>) => clb(tx)
  ) as Mocked<ITransactionManagerService>['startTransaction'];

  return { tx, startTransaction };
};

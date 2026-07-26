import { vi, type Mocked } from 'vitest';

import type { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import type { ITransaction } from '@/src/entities/models/transaction.interface';

export const createTransactionManagerServiceMock = () => {
  const tx: Mocked<ITransaction> = { rollback: vi.fn() };
  const startTransaction = vi.fn(
    (clb: (tx: ITransaction) => Promise<unknown>) => clb(tx)
  ) as unknown as Mocked<ITransactionManagerService>['startTransaction'];

  return { tx, startTransaction };
};

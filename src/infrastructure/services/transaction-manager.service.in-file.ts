import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { ITransaction } from '@/src/entities/models/transaction.interface';

// In-file mode has no real transactions to roll back, so this just invokes
// the callback with a no-op transaction handle.
export class InFileTransactionManagerService implements ITransactionManagerService {
  public startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>
  ): Promise<T> {
    return clb({ rollback: () => {} });
  }
}

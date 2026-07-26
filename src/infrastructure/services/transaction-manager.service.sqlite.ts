import { DrizzleConnection, SqliteTransaction } from '@/drizzle';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

export class TransactionManagerService implements ITransactionManagerService {
  constructor(
    private readonly connection: DrizzleConnection = DrizzleConnection.make()
  ) {}

  private get db() {
    return this.connection.db;
  }

  public startTransaction<T>(
    clb: (tx: SqliteTransaction) => Promise<T>,
    parent?: SqliteTransaction
  ): Promise<T> {
    const invoker = parent ?? this.db;
    return invoker.transaction(clb);
  }
}

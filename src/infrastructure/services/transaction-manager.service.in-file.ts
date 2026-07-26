import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

import { must } from '@/lib/utils';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { ITransaction } from '@/src/entities/models/transaction.interface';

/**
 * In-file mode has no database transactions, so one is emulated: the backing
 * files are snapshotted before the callback runs and restored if it throws.
 * That gives the same all-or-nothing outcome a real driver provides, so a use
 * case behaves the same whichever backend is injected.
 *
 * The snapshot is whole-file, so a rollback also reverts anything else written
 * to those files while the callback ran. That is fine for the single-process
 * dev/test store this backend exists for, and would not be for concurrent
 * writers.
 */
export class InFileTransactionManagerService implements ITransactionManagerService {
  constructor(
    private readonly files: string[] = [
      must(process.env.IN_FILE_USERS_FILE),
      must(process.env.IN_FILE_TODOS_FILE),
    ]
  ) {}

  public async startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>,
    parent?: ITransaction
  ): Promise<T> {
    // A nested call is already covered by the snapshot the outer one took.
    if (parent) {
      return clb(parent);
    }

    const snapshot = this.files.map(
      (file) =>
        [file, existsSync(file) ? readFileSync(file, 'utf8') : null] as const
    );

    try {
      return await clb({ rollback: () => {} });
    } catch (err) {
      for (const [file, contents] of snapshot) {
        if (contents === null) {
          rmSync(file, { force: true });
        } else {
          writeFileSync(file, contents);
        }
      }
      throw err;
    }
  }
}

import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

import { must } from '@/lib/utils';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

export type InFileTransaction = Record<string, never>;

export class InFileTransactionManagerService implements ITransactionManagerService {
  constructor(
    private readonly files: string[] = [
      must(process.env.IN_FILE_USERS_FILE),
      must(process.env.IN_FILE_TODOS_FILE),
    ]
  ) {}

  public async startTransaction<T>(
    clb: (tx: InFileTransaction) => Promise<T>,
    parent?: InFileTransaction
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
      return await clb({});
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

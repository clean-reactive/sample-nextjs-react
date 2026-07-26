import { BulkUpdateInputData } from '@/src/application/use-cases/todos/bulk-update.use-case';
import {
  IBulkUpdateBffController,
  IBulkUpdateBffUseCase,
} from '@/src/interface-adapters/bff/todos/bulk-update/contract';

export const bulkUpdateBffController =
  (bulkUpdateUseCase: IBulkUpdateBffUseCase): IBulkUpdateBffController =>
  async (dirty, deleted, sessionId) => {
    const inputData: BulkUpdateInputData = {
      dirty,
      deleted,
      sessionId,
    };

    return bulkUpdateUseCase(inputData);
  };

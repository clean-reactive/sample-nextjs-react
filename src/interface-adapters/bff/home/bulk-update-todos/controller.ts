import { BulkUpdateInputData } from '@/src/application/use-cases/todos/bulk-update.use-case';
import {
  IBulkUpdateTodosBffController,
  IBulkUpdateTodosBffUseCase,
} from '@/src/interface-adapters/bff/home/bulk-update-todos/contract';

export const bulkUpdateTodosBffController =
  (
    bulkUpdateUseCase: IBulkUpdateTodosBffUseCase
  ): IBulkUpdateTodosBffController =>
  async (dirty, deleted, sessionId) => {
    const inputData: BulkUpdateInputData = {
      dirty,
      deleted,
      sessionId,
    };

    return bulkUpdateUseCase(inputData);
  };

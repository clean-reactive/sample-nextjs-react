import { z } from 'zod';

import { BulkUpdateInputData } from '@/src/application/use-cases/todos/bulk-update.use-case';
import {
  IBulkUpdateApiController,
  IBulkUpdateApiUseCase,
} from '@/src/interface-adapters/api/todos/bulk-update/contract';

const bulkUpdateInputSchema = z
  .object({
    dirty: z.array(z.number()),
    deleted: z.array(z.number()),
  })
  .partial();

export const bulkUpdateApiController =
  (bulkUpdateUseCase: IBulkUpdateApiUseCase): IBulkUpdateApiController =>
  (payload, sessionId) => {
    const { data = {} } = bulkUpdateInputSchema.safeParse(payload);
    const inputData: BulkUpdateInputData = {
      dirty: data.dirty,
      deleted: data.deleted,
      sessionId,
    };
    return bulkUpdateUseCase(inputData);
  };

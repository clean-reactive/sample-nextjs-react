import {
  IBulkUpdatePresenter,
  IBulkUpdateUseCase,
} from '@/src/application/use-cases/todos/bulk-update.use-case';
import { Session } from '@/src/entities/models/session';

export type BulkUpdateApiViewModel =
  | { status: 'success'; body: { success: true }; init: { status: number } }
  | { status: 'failure'; body: { error: string }; init: { status: number } };

export type IBulkUpdateApiController = (
  payload: unknown,
  sessionId?: Session['id']
) => Promise<BulkUpdateApiViewModel>;

export type IBulkUpdateApiUseCase = IBulkUpdateUseCase<BulkUpdateApiViewModel>;

export type IBulkUpdateApiPresenter =
  IBulkUpdatePresenter<BulkUpdateApiViewModel>;

import {
  IBulkUpdatePresenter,
  IBulkUpdateUseCase,
} from '@/src/application/use-cases/todos/bulk-update.use-case';
import { Session } from '@/src/entities/models/session';

export type BulkUpdateFailure = {
  status: 'failure';
  code: 'invalid_data' | 'unauthenticated' | 'not_found' | 'unexpected_error';
};

export type BulkUpdateSuccess = { status: 'success' };

export type BulkUpdateBffViewModel = BulkUpdateFailure | BulkUpdateSuccess;

export type IBulkUpdateBffController = (
  dirty: number[],
  deleted: number[],
  sessionId?: Session['id']
) => Promise<BulkUpdateBffViewModel>;

export type IBulkUpdateBffUseCase = IBulkUpdateUseCase<BulkUpdateBffViewModel>;

export type IBulkUpdateBffPresenter =
  IBulkUpdatePresenter<BulkUpdateBffViewModel>;

import {
  IBulkUpdatePresenter,
  IBulkUpdateUseCase,
} from '@/src/application/use-cases/todos/bulk-update.use-case';
import { Session } from '@/src/entities/models/session';

export type BulkUpdateTodosFailure = {
  status: 'failure';
  code: 'invalid_data' | 'unauthenticated' | 'not_found' | 'unexpected_error';
};

export type BulkUpdateTodosSuccess = { status: 'success' };

export type BulkUpdateTodosBffViewModel =
  BulkUpdateTodosFailure | BulkUpdateTodosSuccess;

export type IBulkUpdateTodosBffController = (
  dirty: number[],
  deleted: number[],
  sessionId?: Session['id']
) => Promise<BulkUpdateTodosBffViewModel>;

export type IBulkUpdateTodosBffUseCase =
  IBulkUpdateUseCase<BulkUpdateTodosBffViewModel>;

export type IBulkUpdateTodosBffPresenter =
  IBulkUpdatePresenter<BulkUpdateTodosBffViewModel>;

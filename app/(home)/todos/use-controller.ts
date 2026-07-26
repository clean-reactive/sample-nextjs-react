import type { Dispatch } from 'react';
import { toast } from 'sonner';
import { bulkUpdateAction } from '../actions/bulk-update.action';
import type { HomePageEvent, HomePageState } from '../reducer';
import type { BulkUpdateFailureCode } from '../gateway.types';
import type { TodosController } from './todos.types';

export interface ControllerDependencies {
  state: HomePageState;
  dispatch: Dispatch<HomePageEvent>;
}

const unexpectedErrorMessage =
  'An error happened while bulk updating the todos. The developers have been notified. Please try again later.';

const errorMessages: Record<BulkUpdateFailureCode, string> = {
  invalid_data: 'Invalid data',
  unauthenticated: 'Must be logged in to bulk update todos',
  not_found: 'Todo does not exist',
  unexpected_error: unexpectedErrorMessage,
};

export function useController(
  dependencies: ControllerDependencies
): TodosController {
  const { state, dispatch } = dependencies;

  const onUpdateAllClick = async () => {
    if (state.status !== 'bulk') return;

    dispatch({ type: 'UPDATE_ALL_STARTED' });
    try {
      const res = await bulkUpdateAction(state.dirty, state.deleted);
      if (res.status === 'failure') {
        toast.error(errorMessages[res.code]);
      } else {
        toast.success('Bulk update completed!');
      }
    } catch {
      toast.error(unexpectedErrorMessage);
    } finally {
      dispatch({ type: 'UPDATE_ALL_FINISHED' });
    }
  };

  const onBulkOperationsClick = () => dispatch({ type: 'BULK_MODE_ENTERED' });

  const onCancelClick = () => dispatch({ type: 'BULK_MODE_CANCELED' });

  return { onUpdateAllClick, onBulkOperationsClick, onCancelClick };
}

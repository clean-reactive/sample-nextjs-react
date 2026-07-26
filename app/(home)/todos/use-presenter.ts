import type { HomePageState } from '../reducer';
import type { Todo, TodosPresenter } from './todos.types';

export interface PresenterDependencies {
  todos: Todo[];
  state: HomePageState;
}

export function usePresenter(
  dependencies: PresenterDependencies
): TodosPresenter {
  const { todos, state } = dependencies;

  const isUpdating = state.status === 'updating';

  return {
    isEmptyMessageVisible: todos.length === 0,
    isBulkActionsVisible: state.status !== 'view',
    isUpdateAllSpinnerVisible: isUpdating,
    isUpdateAllLabelVisible: !isUpdating,
    isUpdateAllButtonDisabled: isUpdating,
  };
}

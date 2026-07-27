import type { HomePageEntity } from '../reducer';
import type { TodosPresenter } from './todos.types';
import type { TodoEntity } from '../page.types';

export interface PresenterDependencies {
  todos: TodoEntity[];
  state: HomePageEntity;
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

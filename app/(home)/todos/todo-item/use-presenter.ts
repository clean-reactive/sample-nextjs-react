import type { HomePageState } from '../../reducer';
import type { Todo } from '../todos.types';
import type { TodoItemPresenter } from './todo-item.types';

export interface PresenterDependencies {
  todo: Todo;
  state: HomePageState;
}

export function usePresenter(
  dependencies: PresenterDependencies
): TodoItemPresenter {
  const { todo, state } = dependencies;

  const dirty = state.status === 'view' ? [] : state.dirty;
  const deleted = state.status === 'view' ? [] : state.deleted;
  const isUpdating = state.status === 'updating';

  const isChecked = dirty.includes(todo.id) ? !todo.completed : todo.completed;
  const isMarkedForDeletion = deleted.includes(todo.id);

  return {
    isChecked,
    isMarkedForDeletion,
    isCheckboxDisabled: isMarkedForDeletion || isUpdating,
    isDeleteButtonVisible: state.status !== 'view',
    isDeleteButtonDisabled: isUpdating,
  };
}

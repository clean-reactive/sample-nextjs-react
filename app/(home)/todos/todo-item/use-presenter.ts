import type { HomePageEntity } from '../../reducer';
import type { TodoEntity } from '../../page.types';
import type { TodoItemPresenter } from './todo-item.types';

export interface PresenterDependencies {
  todo: TodoEntity;
  state: HomePageEntity;
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

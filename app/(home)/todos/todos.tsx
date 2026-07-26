'use client';

import { Loader } from 'lucide-react';

import { Button } from '../../_components/ui/button';
import { useHomePageContext } from '../context';
import { TodoItem } from './todo-item/todo-item';
import type { Todo } from './todos.types';
import { useController } from './use-controller';
import { usePresenter } from './use-presenter';

export function Todos({ todos }: { todos: Todo[] }) {
  // entities
  const { state, dispatch } = useHomePageContext();

  // presenter
  const {
    isEmptyMessageVisible,
    isBulkActionsVisible,
    isUpdateAllSpinnerVisible,
    isUpdateAllLabelVisible,
    isUpdateAllButtonDisabled,
  } = usePresenter({ todos, state });

  // controller
  const { onUpdateAllClick, onBulkOperationsClick, onCancelClick } =
    useController({ state, dispatch });

  if (isEmptyMessageVisible) {
    return (
      <p data-testid="todos-empty-message">
        No todos. Create some to get started!
      </p>
    );
  }

  return (
    <>
      <ul className="w-full">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      {isBulkActionsVisible ? (
        <div className="w-full grid grid-cols-2 gap-2">
          <Button
            disabled={isUpdateAllButtonDisabled}
            onClick={onUpdateAllClick}
            data-testid="update-all-button"
          >
            {isUpdateAllSpinnerVisible && <Loader className="animate-spin" />}
            {isUpdateAllLabelVisible && 'Update all'}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancelClick}
            data-testid="bulk-cancel-button"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          onClick={onBulkOperationsClick}
          data-testid="bulk-operations-button"
        >
          Bulk operations
        </Button>
      )}
    </>
  );
}

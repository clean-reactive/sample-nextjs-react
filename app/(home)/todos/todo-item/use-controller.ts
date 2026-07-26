import type { Dispatch } from 'react';
import { toast } from 'sonner';
import { toggleTodoAction } from '../../actions/toggle-todo.action';
import type { HomePageEvent, HomePageState } from '../../reducer';
import type { Todo } from '../todos.types';
import type { ToggleTodoFailureCode } from '../../gateway.types';
import type { TodoItemController } from './todo-item.types';

export interface ControllerDependencies {
  todo: Todo;
  state: HomePageState;
  dispatch: Dispatch<HomePageEvent>;
}

const unexpectedErrorMessage =
  'An error happened while toggling the todo. The developers have been notified. Please try again later.';

const errorMessages: Record<ToggleTodoFailureCode, string> = {
  invalid_data: 'Invalid data',
  unauthenticated: 'Must be logged in to toggle a todo',
  not_found: 'Todo does not exist',
  unexpected_error: unexpectedErrorMessage,
};

export function useController(
  dependencies: ControllerDependencies
): TodoItemController {
  const { todo, state, dispatch } = dependencies;

  const onCheckedChange = async () => {
    if (state.status !== 'view') {
      dispatch({ type: 'TODO_DIRTY_TOGGLED', id: todo.id });
      return;
    }

    try {
      const res = await toggleTodoAction(todo.id);
      if (res.status === 'failure') {
        toast.error(errorMessages[res.code]);
      } else {
        toast.success('Todo toggled!');
      }
    } catch {
      toast.error(unexpectedErrorMessage);
    }
  };

  const onDeleteClick = () =>
    dispatch({ type: 'TODO_DELETION_TOGGLED', id: todo.id });

  return { onCheckedChange, onDeleteClick };
}

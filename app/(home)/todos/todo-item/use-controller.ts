import type { Dispatch } from 'react';
import { toast } from 'sonner';
import { makeHomePageGateway } from '../../gateway/gateway';
import type { HomePageEvent, HomePageEntity } from '../../reducer';
import type { TodoEntity } from '../../page.types';
import type { ToggleTodoFailureCode } from '../../gateway/gateway.types';
import type { TodoItemController } from './todo-item.types';

export interface ControllerDependencies {
  todo: TodoEntity;
  state: HomePageEntity;
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
    const gateway = makeHomePageGateway();

    if (state.status !== 'view') {
      dispatch({ type: 'TODO_DIRTY_TOGGLED', id: todo.id });
      return;
    }

    try {
      const res = await gateway.toggleTodo(todo.id);
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

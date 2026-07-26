import {
  UnauthenticatedError,
  UnauthorizedError,
} from '@/src/entities/errors/auth';
import {
  InputParseError,
  NotFoundError,
  UnknownError,
} from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import {
  IDeleteTodoApiPresenter,
  DeleteTodoApiTodo,
} from '@/src/interface-adapters/api/todos/delete-todo/contract';

function toApiTodo(todo: Todo): DeleteTodoApiTodo {
  return {
    id: todo.id,
    todo: todo.todo,
    userId: todo.userId,
    completed: todo.completed,
  };
}

export const deleteTodoApiPresenter =
  (): IDeleteTodoApiPresenter => async (output) => {
    if (output instanceof InputParseError) {
      return {
        status: 'failure',
        body: { error: output.message },
        init: { status: 400 },
      };
    }

    if (output instanceof UnauthenticatedError) {
      return {
        status: 'failure',
        body: { error: 'Unauthenticated' },
        init: { status: 401 },
      };
    }

    if (output instanceof NotFoundError) {
      return {
        status: 'failure',
        body: { error: output.message },
        init: { status: 404 },
      };
    }

    if (output instanceof UnauthorizedError) {
      return {
        status: 'failure',
        body: { error: 'Unauthorized' },
        init: { status: 403 },
      };
    }

    if (output instanceof UnknownError) {
      console.error(output);
      return {
        status: 'failure',
        body: { error: 'An unexpected error occurred' },
        init: { status: 500 },
      };
    }

    return { status: 'success', body: toApiTodo(output) };
  };

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { UnknownError } from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import {
  GetTodosForUserApiTodo,
  IGetTodosForUserApiPresenter,
} from '@/src/interface-adapters/api/todos/get-todos-for-user/contract';

function toApiTodo(todo: Todo): GetTodosForUserApiTodo {
  return {
    id: todo.id,
    todo: todo.todo,
    userId: todo.userId,
    completed: todo.completed,
  };
}

// Decides the HTTP status and body for every outcome; the route only
// forwards these into the response.
export const getTodosForUserApiPresenter =
  (): IGetTodosForUserApiPresenter => async (output) => {
    if (
      output instanceof UnauthenticatedError ||
      output instanceof AuthenticationError
    ) {
      return {
        status: 'failure',
        body: { error: 'Unauthenticated' },
        init: { status: 401 },
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

    return { status: 'success', body: { todos: output.map(toApiTodo) } };
  };

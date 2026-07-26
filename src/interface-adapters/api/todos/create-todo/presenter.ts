import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, UnknownError } from '@/src/entities/errors/common';
import { Todo } from '@/src/entities/models/todo';
import {
  CreateTodoApiTodo,
  ICreateTodoApiPresenter,
} from '@/src/interface-adapters/api/todos/create-todo/contract';

function toApiTodo(todo: Todo): CreateTodoApiTodo {
  return {
    id: todo.id,
    todo: todo.todo,
    userId: todo.userId,
    completed: todo.completed,
  };
}

export const createTodoApiPresenter =
  (): ICreateTodoApiPresenter => async (output) => {
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

    if (output instanceof UnknownError) {
      console.error(output);
      return {
        status: 'failure',
        body: { error: 'An unexpected error occurred' },
        init: { status: 500 },
      };
    }

    return {
      status: 'success',
      body: { todos: output.map(toApiTodo) },
      init: { status: 201 },
    };
  };

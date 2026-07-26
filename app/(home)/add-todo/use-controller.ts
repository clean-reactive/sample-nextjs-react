import type { Dispatch, FormEvent, RefObject, SetStateAction } from 'react';
import { toast } from 'sonner';
import { createTodoAction } from '../actions/create-todo.action';
import type { AddTodoFailureCode } from '../gateway.types';
import type { AddTodoController } from './add-todo.types';

export interface ControllerDependencies {
  inputRef: RefObject<HTMLInputElement>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const unexpectedErrorMessage =
  'An error happened while creating a todo. The developers have been notified. Please try again later.';

const errorMessages: Record<AddTodoFailureCode, string> = {
  invalid_data: 'Invalid data. Todos must be at least 4 characters long.',
  unauthenticated: 'Must be logged in to create a todo',
  unexpected_error: unexpectedErrorMessage,
};

export function useController(
  dependencies: ControllerDependencies
): AddTodoController {
  const { inputRef, loading, setLoading } = dependencies;

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);

    setLoading(true);
    try {
      const res = await createTodoAction(formData);
      if (res.status === 'failure') {
        toast.error(errorMessages[res.code]);
      } else {
        toast.success('Todo(s) created!');
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    } catch {
      toast.error(unexpectedErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { onFormSubmit };
}

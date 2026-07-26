import type { FormEvent } from 'react';

export interface AddTodoController {
  onFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

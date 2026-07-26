'use client';

import { Loader, Plus } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '../../_components/ui/button';
import { Input } from '../../_components/ui/input';
import { useController } from './use-controller';

export function AddTodo() {
  // entities
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // presenter
  const isAddSpinnerVisible = loading;
  const isAddIconVisible = !loading;
  const isAddButtonDisabled = loading;

  // controller
  const { onFormSubmit } = useController({ inputRef, loading, setLoading });

  return (
    <form onSubmit={onFormSubmit} className="flex items-center w-full gap-2">
      <Input
        ref={inputRef}
        name="todo"
        className="flex-1"
        placeholder="Take out trash"
        data-testid="add-todo-input"
      />
      <Button
        size="icon"
        disabled={isAddButtonDisabled}
        type="submit"
        data-testid="add-todo-button"
      >
        {isAddSpinnerVisible && <Loader className="animate-spin" />}
        {isAddIconVisible && <Plus />}
      </Button>
    </form>
  );
}

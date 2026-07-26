'use client';

import { Trash } from 'lucide-react';

import { Button } from '../../../_components/ui/button';
import { Checkbox } from '../../../_components/ui/checkbox';
import { cn } from '../../../_components/utils';
import { useHomePageContext } from '../../context';
import type { Todo } from '../todos.types';
import { useController } from './use-controller';
import { usePresenter } from './use-presenter';

export interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  // entities
  const { state, dispatch } = useHomePageContext();

  // presenter
  const {
    isChecked,
    isMarkedForDeletion,
    isCheckboxDisabled,
    isDeleteButtonVisible,
    isDeleteButtonDisabled,
  } = usePresenter({ todo, state });

  // controller
  const { onCheckedChange, onDeleteClick } = useController({
    todo,
    state,
    dispatch,
  });

  return (
    <li
      data-testid="todo-item"
      className="h-10 flex items-center gap-2 w-full hover:bg-muted/50 active:bg-muted rounded-sm p-1"
    >
      <Checkbox
        checked={isChecked}
        onCheckedChange={onCheckedChange}
        id={`checkbox-${todo.id}`}
        disabled={isCheckboxDisabled}
      />
      <label
        htmlFor={`checkbox-${todo.id}`}
        className={cn('flex-1 cursor-pointer', {
          'text-muted-foreground line-through': isChecked,
          'text-destructive line-through': isMarkedForDeletion,
        })}
      >
        {todo.todo}
      </label>
      {isDeleteButtonVisible && (
        <Button
          size="sm"
          variant="destructive"
          className="p-3"
          disabled={isDeleteButtonDisabled}
          onClick={onDeleteClick}
          data-testid="todo-item-delete-button"
        >
          <Trash size={16} />
        </Button>
      )}
    </li>
  );
}

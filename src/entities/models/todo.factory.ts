import { factoryT, fields } from 'factory-t';
import { Todo } from '@/src/entities/models/todo';

export const todoFactory = factoryT<Todo>({
  id: fields.index(),
  todo: (ctx) => `todo-${ctx.index}`,
  completed: false,
  userId: (ctx) => `user-id-${ctx.index}`,
});

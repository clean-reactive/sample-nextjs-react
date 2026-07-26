import { factoryT } from 'factory-t';
import { TodoInsert } from '@/src/entities/models/todo';
import { userIdFactory } from '@/src/entities/models/user.factory';

export const todoInsertFactory = factoryT<TodoInsert>({
  todo: (ctx) => `todo-${ctx.index}`,
  completed: false,
  userId: userIdFactory,
});

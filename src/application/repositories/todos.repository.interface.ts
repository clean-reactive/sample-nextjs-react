import type { Todo, TodoInsert } from '@/src/entities/models/todo';
import { ITransaction } from '@/src/entities/models/transaction.interface';

export interface ITodosRepository {
  createTodo(todo: TodoInsert, tx?: ITransaction): Promise<Todo>;
  getTodo(id: number): Promise<Todo | undefined>;
  getTodosForUser(userId: string): Promise<Todo[]>;
  updateTodo(
    id: number,
    input: Partial<TodoInsert>,
    tx?: ITransaction
  ): Promise<Todo>;
  deleteTodo(id: number, tx?: ITransaction): Promise<void>;
}

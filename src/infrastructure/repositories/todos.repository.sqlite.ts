import { eq } from 'drizzle-orm';

import { DrizzleConnection, Transaction } from '@/drizzle';
import { todos } from '@/drizzle/schema';
import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { DatabaseOperationError } from '@/src/entities/errors/common';
import { TodoInsert, Todo } from '@/src/entities/models/todo';

export class SqliteTodosRepository implements ITodosRepository {
  constructor(
    private readonly connection: DrizzleConnection = DrizzleConnection.make()
  ) {}

  private get db() {
    return this.connection.db;
  }

  async createTodo(todo: TodoInsert, tx?: Transaction): Promise<Todo> {
    const invoker = tx ?? this.db;

    const query = invoker.insert(todos).values(todo).returning();

    const [created] = await query.execute();

    if (created) {
      return created;
    } else {
      throw new DatabaseOperationError('Cannot create todo');
    }
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    const query = this.db.query.todos.findFirst({
      where: eq(todos.id, id),
    });

    const todo = await query.execute();

    return todo;
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    const query = this.db.query.todos.findMany({
      where: eq(todos.userId, userId),
    });

    const usersTodos = await query.execute();
    return usersTodos;
  }

  async updateTodo(
    id: number,
    input: Partial<TodoInsert>,
    tx?: Transaction
  ): Promise<Todo> {
    const invoker = tx ?? this.db;

    const query = invoker
      .update(todos)
      .set(input)
      .where(eq(todos.id, id))
      .returning();

    const [updated] = await query.execute();
    return updated;
  }

  async deleteTodo(id: number, tx?: Transaction): Promise<void> {
    const invoker = tx ?? this.db;

    const query = invoker.delete(todos).where(eq(todos.id, id)).returning();

    await query.execute();
  }
}

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { must } from '@/lib/utils';
import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { Todo, TodoInsert } from '@/src/entities/models/todo';

export class InFileTodosRepository implements ITodosRepository {
  constructor(
    private readonly file: string = must(process.env.IN_FILE_TODOS_FILE)
  ) {}

  private load(): Todo[] {
    if (!existsSync(this.file)) {
      return [];
    }
    return JSON.parse(readFileSync(this.file, 'utf8')) as Todo[];
  }

  private save(todos: Todo[]): void {
    writeFileSync(this.file, JSON.stringify(todos, null, 2));
  }

  async createTodo(todo: TodoInsert): Promise<Todo> {
    const todos = this.load();
    const id = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    const created: Todo = { ...todo, id };
    this.save([...todos, created]);
    return created;
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return this.load().find((t) => t.id === id);
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    return this.load().filter((t) => t.userId === userId);
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    const todos = this.load();
    const index = todos.findIndex((t) => t.id === id);
    const updated: Todo = { ...todos[index], ...input };
    todos[index] = updated;
    this.save(todos);
    return updated;
  }

  async deleteTodo(id: number): Promise<void> {
    this.save(this.load().filter((t) => t.id !== id));
  }
}

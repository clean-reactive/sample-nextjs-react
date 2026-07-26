import { vi, type Mocked } from 'vitest';

import type { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';

export const createTodosRepositoryMock = (): Mocked<ITodosRepository> => ({
  createTodo: vi.fn(),
  getTodo: vi.fn(),
  getTodosForUser: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
});

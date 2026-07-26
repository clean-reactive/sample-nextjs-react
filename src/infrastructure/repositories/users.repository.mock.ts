import { vi, type Mocked } from 'vitest';

import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';

export const createUsersRepositoryMock = (): Mocked<IUsersRepository> => ({
  getUser: vi.fn(),
  getUserByUsername: vi.fn(),
  createUser: vi.fn(),
});

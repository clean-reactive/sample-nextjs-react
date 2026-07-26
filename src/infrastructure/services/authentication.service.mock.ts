import { vi, type Mocked } from 'vitest';

import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';

export const createAuthenticationServiceMock =
  (): Mocked<IAuthenticationService> => ({
    generateUserId: vi.fn(),
    validateSession: vi.fn(),
    validatePasswords: vi.fn(),
    createSession: vi.fn(),
    invalidateSession: vi.fn(),
  });

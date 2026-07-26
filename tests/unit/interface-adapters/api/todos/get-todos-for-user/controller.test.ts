import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { getTodosForUserApiController } from '@/src/interface-adapters/api/todos/get-todos-for-user/controller';
import type {
  GetTodosForUserApiViewModel,
  IGetTodosForUserApiUseCase,
} from '@/src/interface-adapters/api/todos/get-todos-for-user/contract';
import { todoFactory } from '@/src/entities/models/todo.factory';

type Context = {
  controller: ReturnType<typeof getTodosForUserApiController>;
  getTodosForUserUseCase: Mock<IGetTodosForUserApiUseCase>;
};

describe(`${getTodosForUserApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.getTodosForUserUseCase = vi.fn();
    ctx.controller = getTodosForUserApiController(ctx.getTodosForUserUseCase);
  });

  it<Context>('forwards the session id to the use case and returns its output', async (ctx) => {
    const output: GetTodosForUserApiViewModel = {
      status: 'success',
      body: { todos: [todoFactory.item()] },
    };
    ctx.getTodosForUserUseCase.mockResolvedValue(output);

    await expect(ctx.controller('session-id')).resolves.toBe(output);

    expect(ctx.getTodosForUserUseCase).toHaveBeenCalledWith({
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards undefined input as an undefined sessionId', async (ctx) => {
    const output: GetTodosForUserApiViewModel = {
      status: 'failure',
      body: { error: 'Unauthenticated' },
      init: { status: 401 },
    };
    ctx.getTodosForUserUseCase.mockResolvedValue(output);

    await expect(ctx.controller(undefined)).resolves.toBe(output);

    expect(ctx.getTodosForUserUseCase).toHaveBeenCalledWith({
      sessionId: undefined,
    });
  });
});

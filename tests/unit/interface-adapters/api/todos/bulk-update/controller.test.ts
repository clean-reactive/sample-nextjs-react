import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { bulkUpdateApiController } from '@/src/interface-adapters/api/todos/bulk-update/controller';
import type {
  BulkUpdateApiViewModel,
  IBulkUpdateApiUseCase,
} from '@/src/interface-adapters/api/todos/bulk-update/contract';

type Context = {
  controller: ReturnType<typeof bulkUpdateApiController>;
  bulkUpdateUseCase: Mock<IBulkUpdateApiUseCase>;
};

describe(`${bulkUpdateApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.bulkUpdateUseCase = vi.fn();
    ctx.controller = bulkUpdateApiController(ctx.bulkUpdateUseCase);
  });

  it<Context>('forwards dirty, deleted, and session id to the use case and returns its output', async (ctx) => {
    const output: BulkUpdateApiViewModel = {
      status: 'success',
      body: { success: true },
      init: { status: 200 },
    };
    ctx.bulkUpdateUseCase.mockResolvedValue(output);

    await expect(
      ctx.controller({ dirty: [1, 2], deleted: [3] }, 'session-id')
    ).resolves.toBe(output);

    expect(ctx.bulkUpdateUseCase).toHaveBeenCalledWith({
      dirty: [1, 2],
      deleted: [3],
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards missing lists and an undefined sessionId as-is', async (ctx) => {
    const output: BulkUpdateApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.bulkUpdateUseCase.mockResolvedValue(output);

    await expect(ctx.controller({}, undefined)).resolves.toBe(output);

    expect(ctx.bulkUpdateUseCase).toHaveBeenCalledWith({
      dirty: undefined,
      deleted: undefined,
      sessionId: undefined,
    });
  });

  it<Context>('extracts only the dirty and deleted fields from the input', async (ctx) => {
    const output: BulkUpdateApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.bulkUpdateUseCase.mockResolvedValue(output);

    const input = { dirty: [1], deleted: [2], extra: 'noise' };

    await expect(ctx.controller(input, 'session-id')).resolves.toBe(output);

    expect(ctx.bulkUpdateUseCase).toHaveBeenCalledWith({
      dirty: [1],
      deleted: [2],
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards missing lists when the input is not an object', async (ctx) => {
    const output: BulkUpdateApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.bulkUpdateUseCase.mockResolvedValue(output);

    await expect(ctx.controller('just-a-string', undefined)).resolves.toBe(
      output
    );

    expect(ctx.bulkUpdateUseCase).toHaveBeenCalledWith({
      dirty: undefined,
      deleted: undefined,
      sessionId: undefined,
    });
  });

  it<Context>('forwards missing lists when the fields have wrong types', async (ctx) => {
    const output: BulkUpdateApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.bulkUpdateUseCase.mockResolvedValue(output);

    await expect(
      ctx.controller({ dirty: 'not-an-array', deleted: [1] }, undefined)
    ).resolves.toBe(output);

    expect(ctx.bulkUpdateUseCase).toHaveBeenCalledWith({
      dirty: undefined,
      deleted: undefined,
      sessionId: undefined,
    });
  });
});

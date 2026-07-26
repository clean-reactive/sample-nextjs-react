import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { createTodoApiController } from '@/src/interface-adapters/api/todos/create-todo/controller';
import type {
  CreateTodoApiViewModel,
  ICreateTodoApiUseCase,
} from '@/src/interface-adapters/api/todos/create-todo/contract';
import { todoFactory } from '@/src/entities/models/todo.factory';

type Context = {
  controller: ReturnType<typeof createTodoApiController>;
  createTodoUseCase: Mock<ICreateTodoApiUseCase>;
};

describe(`${createTodoApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.createTodoUseCase = vi.fn();
    ctx.controller = createTodoApiController(ctx.createTodoUseCase);
  });

  it<Context>('forwards the todo input and session id to the use case and returns its output', async (ctx) => {
    const output: CreateTodoApiViewModel = {
      status: 'success',
      body: { todos: [todoFactory.item()] },
      init: { status: 201 },
    };
    ctx.createTodoUseCase.mockResolvedValue(output);

    await expect(
      ctx.controller({ todo: 'write more tests' }, 'session-id')
    ).resolves.toBe(output);

    expect(ctx.createTodoUseCase).toHaveBeenCalledWith({
      todo: 'write more tests',
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards an undefined todo and sessionId as-is', async (ctx) => {
    const output: CreateTodoApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.createTodoUseCase.mockResolvedValue(output);

    await expect(ctx.controller({}, undefined)).resolves.toBe(output);

    expect(ctx.createTodoUseCase).toHaveBeenCalledWith({
      todo: undefined,
      sessionId: undefined,
    });
  });

  it<Context>('extracts only the todo field from the input', async (ctx) => {
    const output: CreateTodoApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.createTodoUseCase.mockResolvedValue(output);

    const input = { todo: 'write more tests', extra: 'noise' };

    await expect(ctx.controller(input, 'session-id')).resolves.toBe(output);

    expect(ctx.createTodoUseCase).toHaveBeenCalledWith({
      todo: 'write more tests',
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards an undefined todo when the input is not an object', async (ctx) => {
    const output: CreateTodoApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.createTodoUseCase.mockResolvedValue(output);

    await expect(ctx.controller('just-a-string', undefined)).resolves.toBe(
      output
    );

    expect(ctx.createTodoUseCase).toHaveBeenCalledWith({
      todo: undefined,
      sessionId: undefined,
    });
  });

  it<Context>('forwards an undefined todo when the field has the wrong type', async (ctx) => {
    const output: CreateTodoApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid data' },
      init: { status: 400 },
    };
    ctx.createTodoUseCase.mockResolvedValue(output);

    await expect(ctx.controller({ todo: 123 }, undefined)).resolves.toBe(
      output
    );

    expect(ctx.createTodoUseCase).toHaveBeenCalledWith({
      todo: undefined,
      sessionId: undefined,
    });
  });
});

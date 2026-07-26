import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { toggleTodoApiController } from '@/src/interface-adapters/api/todos/toggle-todo/controller';
import type {
  IToggleTodoApiUseCase,
  ToggleTodoApiViewModel,
} from '@/src/interface-adapters/api/todos/toggle-todo/contract';
import { todoFactory } from '@/src/entities/models/todo.factory';

type Context = {
  controller: ReturnType<typeof toggleTodoApiController>;
  toggleTodoUseCase: Mock<IToggleTodoApiUseCase>;
};

describe(`${toggleTodoApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.toggleTodoUseCase = vi.fn();
    ctx.controller = toggleTodoApiController(ctx.toggleTodoUseCase);
  });

  it<Context>('forwards the parsed todo id and session id to the use case and returns its output', async (ctx) => {
    const output: ToggleTodoApiViewModel = {
      status: 'success',
      body: todoFactory.item(),
    };
    ctx.toggleTodoUseCase.mockResolvedValue(output);

    await expect(ctx.controller('42', 'session-id')).resolves.toBe(output);

    expect(ctx.toggleTodoUseCase).toHaveBeenCalledWith({
      todoId: 42,
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards a non-numeric id as NaN and an undefined sessionId as-is', async (ctx) => {
    const output: ToggleTodoApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid todo id' },
      init: { status: 400 },
    };
    ctx.toggleTodoUseCase.mockResolvedValue(output);

    await expect(ctx.controller('not-a-number', undefined)).resolves.toBe(
      output
    );

    expect(ctx.toggleTodoUseCase).toHaveBeenCalledWith({
      todoId: NaN,
      sessionId: undefined,
    });
  });
});

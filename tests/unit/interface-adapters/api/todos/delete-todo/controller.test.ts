import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';

import { deleteTodoApiController } from '@/src/interface-adapters/api/todos/delete-todo/controller';
import type {
  IDeleteTodoApiUseCase,
  DeleteTodoApiViewModel,
} from '@/src/interface-adapters/api/todos/delete-todo/contract';
import { todoFactory } from '@/src/entities/models/todo.factory';

type Context = {
  controller: ReturnType<typeof deleteTodoApiController>;
  deleteTodoUseCase: Mock<IDeleteTodoApiUseCase>;
};

describe(`${deleteTodoApiController.name}`, () => {
  beforeEach<Context>((ctx) => {
    ctx.deleteTodoUseCase = vi.fn();
    ctx.controller = deleteTodoApiController(ctx.deleteTodoUseCase);
  });

  it<Context>('forwards the parsed todo id and session id to the use case and returns its output', async (ctx) => {
    const output: DeleteTodoApiViewModel = {
      status: 'success',
      body: todoFactory.item(),
    };
    ctx.deleteTodoUseCase.mockResolvedValue(output);

    await expect(ctx.controller('42', 'session-id')).resolves.toBe(output);

    expect(ctx.deleteTodoUseCase).toHaveBeenCalledWith({
      todoId: 42,
      sessionId: 'session-id',
    });
  });

  it<Context>('forwards a non-numeric id as NaN and an undefined sessionId as-is', async (ctx) => {
    const output: DeleteTodoApiViewModel = {
      status: 'failure',
      body: { error: 'Invalid todo id' },
      init: { status: 400 },
    };
    ctx.deleteTodoUseCase.mockResolvedValue(output);

    await expect(ctx.controller('not-a-number', undefined)).resolves.toBe(
      output
    );

    expect(ctx.deleteTodoUseCase).toHaveBeenCalledWith({
      todoId: NaN,
      sessionId: undefined,
    });
  });
});

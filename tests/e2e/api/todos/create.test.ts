import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';
import { signUp } from '../helpers';

// POST /api/todos
test.describe('POST /api/todos', () => {
  test('returns 401 when there is no session cookie', async ({ request }) => {
    const res = await request.post('/api/todos', { data: { todo: 'nope' } });

    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthenticated' });
  });

  test('returns 400 when the body is invalid', async ({ request }) => {
    await signUp(request);

    const missing = await request.post('/api/todos', { data: {} });
    expect(missing.status()).toBe(400);
    expect(await missing.json()).toEqual({ error: 'Invalid data' });

    const empty = await request.post('/api/todos', { data: { todo: '' } });
    expect(empty.status()).toBe(400);
  });

  test('creates a todo and returns it (completed: false)', async ({
    request,
  }) => {
    await signUp(request);

    const res = await request.post('/api/todos', {
      data: { todo: 'write more tests' },
    });
    expect(res.status()).toBe(201);

    const body = (await res.json()) as { todos: { todo: string }[] };
    expect(body.todos).toHaveLength(1);
    expect(body.todos.at(0)).toMatchObject({
      todo: 'write more tests',
      completed: false,
    });
  });

  test('splits a comma-separated value into multiple todos', async ({
    request,
  }) => {
    await signUp(request);

    const res = await request.post('/api/todos', {
      data: { todo: 'first task, second task' },
    });
    expect(res.status()).toBe(201);

    const body = (await res.json()) as { todos: { todo: string }[] };
    // Each segment is trimmed.
    expect(body.todos.map((t) => t.todo)).toEqual([
      'first task',
      'second task',
    ]);
  });

  test('returns 400 when a segment is shorter than 4 chars', async ({
    request,
  }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(request);

    const res = await request.post('/api/todos', { data: { todo: 'ab' } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({
      error: 'Todo must be at least 4 chars',
    });

    // Nothing was persisted.
    expect(await driver.getTodos(sessionId)).toEqual([]);
  });
});

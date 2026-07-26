import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';
import { signUp } from '../helpers';

// DELETE /api/todos/[id]
test.describe('DELETE /api/todos/[id]', () => {
  test('returns 401 when there is no session cookie', async ({ request }) => {
    const res = await request.delete('/api/todos/1');

    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthenticated' });
  });

  test('returns 400 for a non-integer id', async ({ request }) => {
    await signUp(request);

    const res = await request.delete('/api/todos/not-a-number');
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid todo id' });
  });

  test('returns 404 when the todo does not exist', async ({ request }) => {
    await signUp(request);

    const res = await request.delete('/api/todos/999999');
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: 'Todo does not exist' });
  });

  test('returns 403 when deleting another user’s todo', async ({ request }) => {
    const driver = E2EDriver.make();
    // Owner creates a todo.
    const owner = await driver.createUser(driver.uniqueUsername('owner'));
    const todo = await driver.createTodo(
      owner.sessionCookie.value,
      'owned todo'
    );

    // A different user tries to delete it.
    await signUp(request);
    const res = await request.delete(`/api/todos/${todo.id}`);
    expect(res.status()).toBe(403);
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  test('deletes the todo and returns it', async ({ request }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(request);
    const todo = await driver.createTodo(sessionId, 'delete me');

    const res = await request.delete(`/api/todos/${todo.id}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ id: todo.id, todo: 'delete me' });

    // The todo is gone: a second delete finds nothing.
    const again = await request.delete(`/api/todos/${todo.id}`);
    expect(again.status()).toBe(404);
    expect(await again.json()).toEqual({ error: 'Todo does not exist' });
  });
});

import { expect, test } from '@playwright/test';

import { SESSION_COOKIE } from '@/config';

import { E2EDriver } from '../../e2e-driver';
import { signUp } from '../helpers';

// GET /api/todos
test.describe('GET /api/todos', () => {
  test('returns 401 when there is no session cookie', async ({ request }) => {
    const res = await request.get('/api/todos');

    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthenticated' });
  });

  test('returns an empty list for a fresh user', async ({ request }) => {
    await signUp(request);

    const res = await request.get('/api/todos');
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ todos: [] });
  });

  test('returns the created todos with the full shape', async ({ request }) => {
    const driver = E2EDriver.make();
    const { username, sessionCookie } = await driver.createUser();
    const sessionId = sessionCookie.value;
    const created = await driver.createTodo(sessionId, 'buy milk');

    const res = await request.get('/api/todos', {
      headers: { Cookie: `${SESSION_COOKIE}=${sessionId}` },
    });
    expect(res.status()).toBe(200);

    const { todos } = (await res.json()) as {
      todos: { id: number; todo: string; userId: string; completed: boolean }[];
    };
    expect(todos).toHaveLength(1);
    expect(todos.at(0)).toEqual({
      id: created.id,
      todo: 'buy milk',
      userId: created.userId,
      completed: false,
    });
    // userId is a real string id, not the username.
    expect(created.userId).toEqual(expect.any(String));
    expect(created.userId).not.toBe(username);
  });

  test('only lists the signed-in user’s todos', async ({ request }) => {
    const driver = E2EDriver.make();
    // Another user with their own todo.
    const other = await driver.createUser(driver.uniqueUsername('other'));
    await driver.createTodo(other.sessionCookie.value, 'not yours');

    // The primary user sees only their own.
    const { sessionCookie } = await driver.createUser();
    const sessionId = sessionCookie.value;
    await driver.createTodo(sessionId, 'mine only');

    const res = await request.get('/api/todos', {
      headers: { Cookie: `${SESSION_COOKIE}=${sessionId}` },
    });
    expect(res.status()).toBe(200);

    const { todos } = (await res.json()) as { todos: { todo: string }[] };
    expect(todos.map((t) => t.todo)).toEqual(['mine only']);
  });
});

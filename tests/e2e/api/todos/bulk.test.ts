import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';
import { signUp } from '../helpers';

const MISSING_TODO_ID = 987654;

// POST /api/todos/bulk
test.describe('POST /api/todos/bulk', () => {
  test('returns 401 when there is no session cookie', async ({ request }) => {
    const res = await request.post('/api/todos/bulk', {
      data: { dirty: [], deleted: [] },
    });

    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: 'Unauthenticated' });
  });

  test('returns 400 when the body is invalid', async ({ request }) => {
    await signUp(request);

    const res = await request.post('/api/todos/bulk', { data: {} });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid data' });
  });

  test('toggles the dirty todos and deletes the deleted ones', async ({
    request,
  }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(request);
    const toToggle = await driver.createTodo(sessionId, 'toggle this');
    const toDelete = await driver.createTodo(sessionId, 'delete this');

    const res = await request.post('/api/todos/bulk', {
      data: { dirty: [toToggle.id], deleted: [toDelete.id] },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ success: true });

    const remaining = await driver.getTodos(sessionId);
    expect(remaining).toHaveLength(1);
    expect(remaining.at(0)).toMatchObject({ id: toToggle.id, completed: true });
  });

  test('rejects the request when a todo in it does not exist (all of nothing)', async ({
    request,
  }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(request);
    const toToggle = await driver.createTodo(sessionId, 'toggle this');

    const res = await request.post('/api/todos/bulk', {
      data: { dirty: [toToggle.id], deleted: [MISSING_TODO_ID] },
    });

    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({ error: 'Todo does not exist' });
  });

  test('reverts the toggles when a delete in the same request fails (all or nothing)', async ({
    request,
  }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(request);
    const toToggle = await driver.createTodo(sessionId, 'toggle this');

    await request.post('/api/todos/bulk', {
      data: { dirty: [toToggle.id], deleted: [MISSING_TODO_ID] },
    });

    const todos = await driver.getTodos(sessionId);
    expect(todos).toHaveLength(1);
    expect(todos.at(0)).toMatchObject({
      id: toToggle.id,
      completed: false,
    });
  });

  test('is a no-op success when both lists are empty', async ({ request }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(request);
    await driver.createTodo(sessionId, 'untouched');

    const res = await request.post('/api/todos/bulk', {
      data: { dirty: [], deleted: [] },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ success: true });

    const todos = await driver.getTodos(sessionId);
    expect(todos.map((t) => t.todo)).toEqual(['untouched']);
  });
});

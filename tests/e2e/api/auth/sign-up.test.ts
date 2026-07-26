import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';

// POST /api/auth/sign-up
test.describe('POST /api/auth/sign-up', () => {
  test('returns 400 when the body is invalid', async ({ request }) => {
    const res = await request.post('/api/auth/sign-up', { data: {} });

    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid data' });
  });

  test('returns 400 when the passwords do not match', async ({ request }) => {
    const driver = E2EDriver.make();
    const res = await request.post('/api/auth/sign-up', {
      data: {
        username: driver.uniqueUsername(),
        password: E2EDriver.TEST_PASSWORD,
        confirm_password: 'different-password',
      },
    });

    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid data' });
  });

  test('creates the user, returns it, and signs the client in', async ({
    request,
  }) => {
    const driver = E2EDriver.make();
    const username = driver.uniqueUsername();

    const res = await request.post('/api/auth/sign-up', {
      data: {
        username,
        password: E2EDriver.TEST_PASSWORD,
        confirm_password: E2EDriver.TEST_PASSWORD,
      },
    });
    expect(res.status()).toBe(201);

    // Body carries the new user; the id is a generated string, not the username.
    const body = (await res.json()) as {
      user: { id: string; username: string };
    };
    expect(body.user.username).toBe(username);
    expect(body.user.id).toEqual(expect.any(String));

    // The session cookie is set on the response...
    expect(res.headers()['set-cookie']).toContain('auth_session=');

    // ...so the client is now authenticated.
    const todos = await request.get('/api/todos');
    expect(todos.status()).toBe(200);
  });

  test('returns 401 when the username is already taken', async ({
    request,
  }) => {
    const driver = E2EDriver.make();
    const username = driver.uniqueUsername();
    const body = {
      username,
      password: E2EDriver.TEST_PASSWORD,
      confirm_password: E2EDriver.TEST_PASSWORD,
    };

    const first = await request.post('/api/auth/sign-up', { data: body });
    expect(first.status()).toBe(201);

    const second = await request.post('/api/auth/sign-up', { data: body });
    expect(second.status()).toBe(401);
    expect(await second.json()).toEqual({ error: 'Username taken' });
  });
});

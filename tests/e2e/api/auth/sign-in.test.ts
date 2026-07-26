import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';

// POST /api/auth/sign-in
test.describe('POST /api/auth/sign-in', () => {
  test('returns 400 when the body is invalid', async ({ request }) => {
    const res = await request.post('/api/auth/sign-in', { data: {} });

    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid data' });
  });

  // Non-object and malformed bodies are sent raw so the wire payload is
  // exactly the JSON scalar/array under test, not Playwright's serialization.
  const invalidBodies = [
    { name: 'a JSON string', body: JSON.stringify('just-a-string') },
    { name: 'a JSON array', body: JSON.stringify(['user', 'pass']) },
    { name: 'a JSON null', body: JSON.stringify(null) },
    { name: 'a JSON number', body: JSON.stringify(42) },
    { name: 'malformed JSON', body: '{not-json' },
    {
      name: 'an object with wrong field types',
      body: JSON.stringify({ username: 123, password: ['secret'] }),
    },
    {
      name: 'an object with empty string fields',
      body: JSON.stringify({ username: '', password: '' }),
    },
  ];

  for (const { name, body } of invalidBodies) {
    test(`returns 400 when the body is ${name}`, async ({ request }) => {
      const res = await request.post('/api/auth/sign-in', {
        headers: { 'content-type': 'application/json' },
        data: body,
      });

      expect(res.status()).toBe(400);
      expect(await res.json()).toEqual({ error: 'Invalid data' });
    });
  }

  test('returns 401 when the user does not exist', async ({ request }) => {
    const driver = E2EDriver.make();
    const res = await request.post('/api/auth/sign-in', {
      data: {
        username: driver.uniqueUsername('ghost'),
        password: E2EDriver.TEST_PASSWORD,
      },
    });

    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({ error: 'User does not exist' });
  });

  test('returns 401 when the password is wrong', async ({ request }) => {
    const driver = E2EDriver.make();
    const { username } = await driver.createUser();

    const res = await request.post('/api/auth/sign-in', {
      data: { username, password: 'wrong-password' },
    });

    expect(res.status()).toBe(401);
    expect(await res.json()).toEqual({
      error: 'Incorrect username or password',
    });
  });

  test('signs in with valid credentials and sets a session cookie', async ({
    playwright,
    baseURL,
  }) => {
    // createUser never touches any Playwright client, so this fresh client
    // starts with no cookies — the session it ends up with can only have
    // come from the sign-in call below.
    const driver = E2EDriver.make();
    const { username } = await driver.createUser();
    const fresh = await playwright.request.newContext({ baseURL });
    const res = await fresh.post('/api/auth/sign-in', {
      data: { username, password: E2EDriver.TEST_PASSWORD },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(res.headers()['set-cookie']).toContain('auth_session=');

    // The fresh client is now authenticated.
    const todos = await fresh.get('/api/todos');
    expect(todos.status()).toBe(200);

    await fresh.dispose();
  });
});

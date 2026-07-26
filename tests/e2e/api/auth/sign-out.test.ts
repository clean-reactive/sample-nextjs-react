import { expect, test } from '@playwright/test';

import { signUp } from '../helpers';

// POST /api/auth/sign-out
test.describe('POST /api/auth/sign-out', () => {
  test('returns 400 when there is no session cookie', async ({ request }) => {
    const res = await request.post('/api/auth/sign-out');

    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Must provide a session ID' });
  });

  test('signs the user out and clears the session', async ({ request }) => {
    await signUp(request);
    // Logged in: todos are readable.
    expect((await request.get('/api/todos')).status()).toBe(200);

    const res = await request.post('/api/auth/sign-out');
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ success: true });

    // The session cookie was cleared, so the same client is now unauthenticated.
    const after = await request.get('/api/todos');
    expect(after.status()).toBe(401);
    expect(await after.json()).toEqual({ error: 'Unauthenticated' });
  });
});

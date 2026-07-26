import { expect, type APIRequestContext } from '@playwright/test';

import { E2EDriver } from '../e2e-driver';

/**
 * A Playwright request client with its own cookie jar. Signing one in keeps it
 * authenticated for the rest of the test; passing two different clients around
 * lets a test act as two different users.
 */
export type ApiClient = APIRequestContext;

/**
 * Creates the account through {@link E2EDriver.make} (no HTTP), then
 * signs `client` in through the real `/api/auth/sign-in` endpoint — that's
 * the one step that has to go over HTTP, since `client`'s cookie jar can only
 * be populated by a real Set-Cookie response.
 */
export async function signUp(
  client: ApiClient,
  username?: string
): Promise<{ username: string; sessionId: string }> {
  const driver = E2EDriver.make();
  const { username: createdUsername, sessionCookie } =
    await driver.createUser(username);

  const response = await client.post('/api/auth/sign-in', {
    data: { username: createdUsername, password: E2EDriver.TEST_PASSWORD },
  });
  expect(response.status(), 'sign-in should return 200').toBe(200);

  return { username: createdUsername, sessionId: sessionCookie.value };
}

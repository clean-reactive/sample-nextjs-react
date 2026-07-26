import { type Page } from '@playwright/test';

import { E2E_BASE_URL } from '../../../playwright.config.base';
import { E2EDriver } from '../e2e-driver';

/**
 * Registers a new user (see {@link E2EDriver.make} in
 * tests/e2e/helpers.ts) and drops the returned session cookie into `page`'s
 * browser context, so the page is signed in for the rest of the test. Also
 * returns the session id, so the rest of the driver's methods (e.g.
 * createTodo) can be driven directly without going back through the page.
 */
export async function signUp(
  page: Page,
  username?: string
): Promise<{ username: string; sessionId: string }> {
  const driver = E2EDriver.make();
  const { sessionCookie, username: createdUsername } =
    await driver.createUser(username);

  await page.context().addCookies([
    {
      name: sessionCookie.name,
      value: sessionCookie.value,
      url: E2E_BASE_URL,
      httpOnly: sessionCookie.attributes.httpOnly,
      secure: sessionCookie.attributes.secure,
      sameSite: toPlaywrightSameSite(sessionCookie.attributes.sameSite),
    },
  ]);

  return { username: createdUsername, sessionId: sessionCookie.value };
}

function toPlaywrightSameSite(
  sameSite: 'lax' | 'strict' | 'none' | undefined
): 'Lax' | 'Strict' | 'None' | undefined {
  if (!sameSite) return undefined;
  const capitalized = sameSite.charAt(0).toUpperCase() + sameSite.slice(1);
  return capitalized as 'Lax' | 'Strict' | 'None';
}

import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';

test.describe('/sign-in page', () => {
  test('signs in with valid credentials and lands on the todos page', async ({
    page,
  }) => {
    const driver = E2EDriver.make();
    // createUser never touches the browser, so the page stays signed out
    // until the form below actually signs it in.
    const { username } = await driver.createUser();

    await page.goto('/sign-in');
    await page.getByTestId('username-input').fill(username);
    await page.getByTestId('password-input').fill(E2EDriver.TEST_PASSWORD);
    await page.getByTestId('sign-in-button').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('home-title')).toBeVisible();
  });

  test('shows an error for invalid credentials and stays on the page', async ({
    page,
  }) => {
    const driver = E2EDriver.make();
    await page.goto('/sign-in');
    await page
      .getByTestId('username-input')
      .fill(driver.uniqueUsername('ghost'));
    await page.getByTestId('password-input').fill('wrong-password');
    await page.getByTestId('sign-in-button').click();

    await expect(page.getByTestId('sign-in-error')).toBeVisible();
    await expect(page).toHaveURL('/sign-in');
  });

  test('shows an error when the sign-in request fails unexpectedly', async ({
    page,
  }) => {
    const driver = E2EDriver.make();
    await page.goto('/sign-in');

    // Kill the server-action POST to simulate the backend failing
    // mid-request; the rejected action promise must surface as the
    // unexpected_error message, not as invalid credentials.
    await page.route('**/sign-in', (route, request) =>
      request.method() === 'POST' ? route.abort() : route.continue()
    );

    await page
      .getByTestId('username-input')
      .fill(driver.uniqueUsername('ghost'));
    await page.getByTestId('password-input').fill(E2EDriver.TEST_PASSWORD);
    await page.getByTestId('sign-in-button').click();

    await expect(page.getByTestId('sign-in-error')).toHaveText(
      'Something went wrong. Please try again.'
    );
    await expect(page).toHaveURL('/sign-in');
  });

  test('redirects an unauthenticated visitor from / to /sign-in', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/sign-in');
  });

  test('links to the sign-up page', async ({ page }) => {
    await page.goto('/sign-in');

    await page.getByTestId('sign-up-link').click();

    await expect(page).toHaveURL('/sign-up');
  });
});

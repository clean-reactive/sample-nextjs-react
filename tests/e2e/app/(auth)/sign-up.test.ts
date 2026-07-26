import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';

test.describe('/sign-up page', () => {
  test('creates an account and lands on the todos page', async ({ page }) => {
    const driver = E2EDriver.make();
    await page.goto('/sign-up');
    await page.getByTestId('username-input').fill(driver.uniqueUsername());
    await page.getByTestId('password-input').fill(E2EDriver.TEST_PASSWORD);
    await page
      .getByTestId('confirm-password-input')
      .fill(E2EDriver.TEST_PASSWORD);
    await page.getByTestId('sign-up-button').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('home-title')).toBeVisible();
  });

  test('shows an error when the passwords do not match', async ({ page }) => {
    const driver = E2EDriver.make();
    await page.goto('/sign-up');
    await page.getByTestId('username-input').fill(driver.uniqueUsername());
    await page.getByTestId('password-input').fill(E2EDriver.TEST_PASSWORD);
    await page.getByTestId('confirm-password-input').fill('something-else');
    await page.getByTestId('sign-up-button').click();

    await expect(page.getByTestId('sign-up-error')).toBeVisible();
    await expect(page).toHaveURL('/sign-up');
  });

  test('shows an error when the username is taken', async ({ page }) => {
    const driver = E2EDriver.make();
    // Register the username through the BFF use-case first; createUser
    // never touches the browser, so the page stays signed out.
    const { username } = await driver.createUser();

    await page.goto('/sign-up');
    await page.getByTestId('username-input').fill(username);
    await page.getByTestId('password-input').fill(E2EDriver.TEST_PASSWORD);
    await page
      .getByTestId('confirm-password-input')
      .fill(E2EDriver.TEST_PASSWORD);
    await page.getByTestId('sign-up-button').click();

    await expect(page.getByTestId('sign-up-error')).toBeVisible();
    await expect(page).toHaveURL('/sign-up');
  });

  test('links to the sign-in page', async ({ page }) => {
    await page.goto('/sign-up');

    await page.getByTestId('sign-in-link').click();

    await expect(page).toHaveURL('/sign-in');
  });
});

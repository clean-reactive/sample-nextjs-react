import { expect, test } from '@playwright/test';

import { signUp } from '../helpers';

test.describe('sign-out via the user menu', () => {
  test('signs the user out and returns to the sign-in page', async ({
    page,
  }) => {
    await signUp(page);

    await page.goto('/');
    await page.getByTestId('user-menu-trigger').click();
    await page.getByTestId('sign-out-menu-item').click();

    await expect(page).toHaveURL('/sign-in');

    // The session is gone, not just the page: revisiting / bounces back.
    await page.goto('/');
    await expect(page).toHaveURL('/sign-in');
  });
});

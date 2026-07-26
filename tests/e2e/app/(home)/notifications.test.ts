import { expect, test, type Page } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';
import { signUp } from '../helpers';

// Toasts are located by sonner's structural attributes instead of their copy,
// so translations and wording changes do not break these tests.
const successToast = (page: Page) =>
  page.locator('[data-sonner-toast][data-type="success"]');
const errorToast = (page: Page) =>
  page.locator('[data-sonner-toast][data-type="error"]');

test.describe('notifications', () => {
  test('shows a success toast when a todo is created', async ({ page }) => {
    await signUp(page);

    await page.goto('/');
    await page.getByTestId('add-todo-input').fill('buy milk');
    await page.getByTestId('add-todo-button').click();

    await expect(successToast(page)).toBeVisible();
  });

  test('shows an error toast and creates nothing when the todo text is shorter than 4 characters', async ({
    page,
  }) => {
    await signUp(page);

    await page.goto('/');
    await page.getByTestId('add-todo-input').fill('1');
    await page.getByTestId('add-todo-button').click();

    await expect(errorToast(page)).toBeVisible();
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    await expect(page.getByTestId('todos-empty-message')).toBeVisible();
  });

  test('shows a success toast when a todo is toggled', async ({ page }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(page);
    await driver.createTodo(sessionId, 'water plants');

    await page.goto('/');
    await page
      .getByTestId('todo-item')
      .filter({ hasText: 'water plants' })
      .getByRole('checkbox')
      .click();

    await expect(successToast(page)).toBeVisible();
  });

  test('shows a success toast when a bulk update completes', async ({
    page,
  }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(page);
    await driver.createTodo(sessionId, 'first errand');

    await page.goto('/');
    await page.getByTestId('bulk-operations-button').click();
    await page
      .getByTestId('todo-item')
      .filter({ hasText: 'first errand' })
      .getByRole('checkbox')
      .click();
    await page.getByTestId('update-all-button').click();

    await expect(successToast(page)).toBeVisible();
  });
});

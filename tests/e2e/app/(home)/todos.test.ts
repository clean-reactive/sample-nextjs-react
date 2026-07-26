import { expect, test } from '@playwright/test';

import { E2EDriver } from '../../e2e-driver';
import { signUp } from '../helpers';

// Each test registers its own account via signUp, which drops the session
// cookie into the page's browser context, so it starts signed in with an
// empty todo list.
test.describe('todos on the home page', () => {
  test('shows the empty message for a fresh account', async ({ page }) => {
    await signUp(page);

    await page.goto('/');

    await expect(page.getByTestId('todos-empty-message')).toBeVisible();
  });

  test('adds a todo and shows it in the list', async ({ page }) => {
    await signUp(page);
    const todoText = `walk the dog ${Date.now()}`;

    await page.goto('/');
    await page.getByTestId('add-todo-input').fill(todoText);
    await page.getByTestId('add-todo-button').click();

    await expect(
      page.getByTestId('todo-item').filter({ hasText: todoText })
    ).toBeVisible();
  });

  test('toggles a todo as completed', async ({ page }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(page);
    const todoText = `water plants ${Date.now()}`;
    await driver.createTodo(sessionId, todoText);

    await page.goto('/');
    const item = page.getByTestId('todo-item').filter({ hasText: todoText });
    await item.getByRole('checkbox').click();

    await expect(item.getByRole('checkbox')).toBeChecked();

    // The completed state came from the server, not just local state.
    await page.reload();
    await expect(
      page
        .getByTestId('todo-item')
        .filter({ hasText: todoText })
        .getByRole('checkbox')
    ).toBeChecked();
  });
});

test.describe('bulk operations on the home page', () => {
  test('cancel leaves bulk mode without changing anything', async ({
    page,
  }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(page);
    await driver.createTodo(sessionId, 'keep me around');

    await page.goto('/');
    await page.getByTestId('bulk-operations-button').click();
    await expect(page.getByTestId('todo-item-delete-button')).toBeVisible();

    await page.getByTestId('bulk-cancel-button').click();

    await expect(page.getByTestId('todo-item-delete-button')).toBeHidden();
    await expect(page.getByTestId('bulk-operations-button')).toBeVisible();
    await expect(
      page.getByTestId('todo-item').filter({ hasText: 'keep me around' })
    ).toBeVisible();
  });

  test('update all toggles the marked todos', async ({ page }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(page);
    await driver.createTodo(sessionId, 'first errand');
    await driver.createTodo(sessionId, 'second errand');

    await page.goto('/');
    const first = page
      .getByTestId('todo-item')
      .filter({ hasText: 'first errand' });
    const second = page
      .getByTestId('todo-item')
      .filter({ hasText: 'second errand' });

    await page.getByTestId('bulk-operations-button').click();
    await first.getByRole('checkbox').click();
    await second.getByRole('checkbox').click();
    await page.getByTestId('update-all-button').click();

    // Bulk mode exits and both todos are completed on the server.
    await expect(page.getByTestId('bulk-operations-button')).toBeVisible();
    await expect(first.getByRole('checkbox')).toBeChecked();
    await expect(second.getByRole('checkbox')).toBeChecked();
  });

  test('update all deletes the todos marked for deletion', async ({ page }) => {
    const driver = E2EDriver.make();
    const { sessionId } = await signUp(page);
    await driver.createTodo(sessionId, 'delete me');
    await driver.createTodo(sessionId, 'keep me');

    await page.goto('/');
    await page.getByTestId('bulk-operations-button').click();
    await page
      .getByTestId('todo-item')
      .filter({ hasText: 'delete me' })
      .getByTestId('todo-item-delete-button')
      .click();
    await page.getByTestId('update-all-button').click();

    await expect(
      page.getByTestId('todo-item').filter({ hasText: 'delete me' })
    ).toHaveCount(0);
    await expect(
      page.getByTestId('todo-item').filter({ hasText: 'keep me' })
    ).toBeVisible();
  });
});

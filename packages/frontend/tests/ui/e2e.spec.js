const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./todo-page');

test.describe('Todo app journeys', () => {
  test.beforeEach(async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.resetState();
    await todoPage.goto();
  });

  test('creates a todo item from the input form', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Write a UI test');

    await todoPage.expectTodoVisible('Write a UI test');
    await todoPage.expectStats(1, 0);
  });

  test('edits and toggles a todo item', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Draft update');
    await todoPage.editTodo('Draft update', 'Final draft');
    await todoPage.toggleTodo('Final draft');

    await todoPage.expectTodoVisible('Final draft');
    await todoPage.expectStats(0, 1);
  });

  test('deletes a todo item from the list', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Delete me');
    await todoPage.deleteTodo('Delete me');

    await expect(page.getByText('Delete me')).toHaveCount(0);
  });

  test('shows the empty state when all todos are removed', async ({ page }) => {
    const todoPage = new TodoPage(page);

    await todoPage.addTodo('Only item');
    await todoPage.deleteTodo('Only item');

    await todoPage.expectEmptyState();
    await todoPage.expectStats(0, 0);
  });

  test('shows an error state when the todo API fails', async ({ page }) => {
    await page.route('**/api/todos**', (route) => route.abort());
    await page.goto('/');

    await expect(page.getByText(/Unable to load todos/i)).toBeVisible();
  });
});
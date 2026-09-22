const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('heading', { name: 'TODO App' }).waitFor();
  }

  async resetState() {
    const todoIds = await this.page.evaluate(async () => {
      const response = await fetch('http://127.0.0.1:3001/api/todos');
      if (!response.ok) {
        return [];
      }

      const todos = await response.json();
      return todos.map((todo) => todo.id);
    });

    for (const todoId of todoIds) {
      await this.page.evaluate(async (id) => {
        await fetch(`http://127.0.0.1:3001/api/todos/${id}`, {
          method: 'DELETE',
        });
      }, todoId);
    }

    await this.page.reload();
  }

  async addTodo(title) {
    await this.page.getByPlaceholder('What needs to be done?').fill(title);
    await this.page.getByRole('button', { name: 'Add' }).click();
  }

  async toggleTodo(title) {
    await this.page.locator('li').filter({ hasText: title }).getByRole('checkbox').click();
  }

  async editTodo(currentTitle, nextTitle) {
    await this.page.getByLabel(`Edit ${currentTitle}`).click();
    await this.page.locator('input[type="text"]').last().fill(nextTitle);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async deleteTodo(title) {
    await this.page.getByLabel(`Delete ${title}`).click();
  }

  async expectTodoVisible(title) {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.page.getByText(/No todos yet/i)).toBeVisible();
  }

  async expectStats(itemsLeft, completed) {
    await expect(this.page.getByText(`${itemsLeft} items left`)).toBeVisible();
    await expect(this.page.getByText(`${completed} completed`)).toBeVisible();
  }
}

module.exports = { TodoPage };

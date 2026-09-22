const { expect } = require('@playwright/test');

class ProjectPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('heading', { name: 'Project Tracker' }).waitFor();
  }

  async resetState() {
    const projectIds = await this.page.evaluate(async () => {
      const response = await fetch('http://127.0.0.1:3001/api/projects');
      if (!response.ok) {
        return [];
      }

      const projects = await response.json();
      return projects.map((project) => project.id);
    });

    for (const projectId of projectIds) {
      const taskResponse = await this.page.evaluate(async (id) => {
        const response = await fetch(`http://127.0.0.1:3001/api/projects/${id}/tasks`);
        if (!response.ok) {
          return [];
        }

        return response.json();
      }, projectId);

      for (const task of taskResponse) {
        await this.page.evaluate(async (taskId) => {
          await fetch(`http://127.0.0.1:3001/api/tasks/${taskId}`, {
            method: 'DELETE',
          });
        }, task.id);
      }

      await this.page.evaluate(async (id) => {
        await fetch(`http://127.0.0.1:3001/api/projects/${id}`, {
          method: 'DELETE',
        });
      }, projectId);
    }

    await this.page.reload();
  }

  async addProject(name, owner) {
    await this.page.getByRole('textbox', { name: 'Edit project name' }).first().fill(name);
    await this.page.getByRole('textbox', { name: 'Owner' }).fill(owner);
    await this.page.getByRole('button', { name: 'Add project' }).click();
  }

  async selectProject(name) {
    await this.page.getByRole('button', { name: new RegExp(`Select ${name}`, 'i') }).click();
  }

  async addTask(title) {
    await this.page.getByLabel('Task title').fill(title);
    await this.page.getByRole('button', { name: 'Add task' }).click();
  }

  async updateTaskStatus(title, status) {
    await this.page.getByRole('combobox', { name: 'Task status' }).click();
    await this.page.getByRole('option', { name: status }).click();
  }

  async deleteTask(title) {
    await this.page.getByRole('button', { name: `Delete ${title}` }).click();
  }

  async deleteProject(name) {
    await this.page.getByRole('button', { name: `Delete ${name}` }).click();
  }

  async expectProjectVisible(name) {
    await expect(this.page.getByText(name).first()).toBeVisible();
  }

  async expectTaskVisible(title) {
    await expect(this.page.getByText(title).first()).toBeVisible();
  }

  async expectTaskStatus(title, status) {
    await expect(this.page.getByRole('combobox', { name: 'Task status' })).toHaveText(status);
  }

  async expectEmptyState() {
    await expect(this.page.getByText(/No projects yet/i)).toBeVisible();
  }

  async expectStats(total, inProgress, completed) {
    await expect(this.page.getByText(`${total} total`)).toBeVisible();
    await expect(this.page.getByText(`${inProgress} in progress`)).toBeVisible();
    await expect(this.page.getByText(`${completed} completed`)).toBeVisible();
  }
}

module.exports = { ProjectPage };

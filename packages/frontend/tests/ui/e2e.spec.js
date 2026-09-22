const { test, expect } = require('@playwright/test');
const { ProjectPage } = require('./todo-page');

test.describe('Project tracker journeys', () => {
  test.beforeEach(async ({ page }) => {
    const projectPage = new ProjectPage(page);
    await projectPage.resetState();
    await projectPage.goto();
  });

  test('creates a project from the input form', async ({ page }) => {
    const projectPage = new ProjectPage(page);

    await projectPage.addProject('Website Redesign', 'Alicia');

    await projectPage.expectProjectVisible('Website Redesign');
    await projectPage.expectStats(1, 0, 0);
  });

  test('adds a task to the selected project', async ({ page }) => {
    const projectPage = new ProjectPage(page);

    await projectPage.addProject('Website Redesign', 'Alicia');
    await projectPage.selectProject('Website Redesign');
    await projectPage.addTask('Define launch plan');

    await projectPage.expectTaskVisible('Define launch plan');
  });

  test('updates a task status from the selected project', async ({ page }) => {
    const projectPage = new ProjectPage(page);

    await projectPage.addProject('Website Redesign', 'Alicia');
    await projectPage.selectProject('Website Redesign');
    await projectPage.addTask('Define launch plan');
    await projectPage.updateTaskStatus('Define launch plan', 'Done');

    await projectPage.expectTaskStatus('Define launch plan', 'Done');
  });

  test('deletes a task from the selected project', async ({ page }) => {
    const projectPage = new ProjectPage(page);

    await projectPage.addProject('Website Redesign', 'Alicia');
    await projectPage.selectProject('Website Redesign');
    await projectPage.addTask('Remove old plan');
    await projectPage.deleteTask('Remove old plan');

    await expect(page.getByText('Remove old plan')).toHaveCount(0);
  });

  test('shows the empty state when all projects are removed', async ({ page }) => {
    const projectPage = new ProjectPage(page);

    await projectPage.addProject('Website Redesign', 'Alicia');
    await projectPage.deleteProject('Website Redesign');

    await projectPage.expectEmptyState();
    await projectPage.expectStats(0, 0, 0);
  });

  test('shows an error state when the project API fails', async ({ page }) => {
    await page.route('**/api/projects**', (route) => route.abort());
    await page.goto('/');

    await expect(page.getByText(/Unable to load projects/i)).toBeVisible();
  });
});

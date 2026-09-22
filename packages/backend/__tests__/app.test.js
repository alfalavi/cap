const request = require('supertest');
const app = require('../src/app');

describe('TODO API Tests', () => {
  describe('GET /api/todos', () => {
    test('should return an array of todos', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return empty array initially', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/todos', () => {
    test('should create a new todo with title', async () => {
      const newTodo = { title: 'Test Todo' };
      const response = await request(app).post('/api/todos').send(newTodo);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'Test Todo');
      expect(response.body).toHaveProperty('completed', false);
      expect(response.body).toHaveProperty('createdAt');
    });

    test('should return 400 when title is missing', async () => {
      const response = await request(app).post('/api/todos').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 when title is empty string', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should auto-increment IDs', async () => {
      const todo1 = await request(app)
        .post('/api/todos')
        .send({ title: 'First Todo' });

      const todo2 = await request(app)
        .post('/api/todos')
        .send({ title: 'Second Todo' });

      expect(todo2.body.id).toBeGreaterThan(todo1.body.id);
    });
  });

  describe('PUT /api/todos/:id', () => {
    test('should update todo title', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Original Title' });

      const todoId = createResponse.body.id;

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated Title' });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.title).toBe('Updated Title');
      expect(updateResponse.body.id).toBe(todoId);
    });

    test('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .put('/api/todos/99999')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
    });

    test('should not change completed status', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo' });

      const todoId = createResponse.body.id;

      await request(app).patch(`/api/todos/${todoId}/toggle`);

      const updateResponse = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'New Title' });

      expect(updateResponse.body.completed).toBe(true);
    });
  });

  describe('PATCH /api/todos/:id/toggle', () => {
    test('should toggle todo from incomplete to complete', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo' });

      const todoId = createResponse.body.id;

      const toggleResponse = await request(app).patch(
        `/api/todos/${todoId}/toggle`
      );

      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.completed).toBe(true);
    });

    test('should toggle todo from complete to incomplete', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo' });

      const todoId = createResponse.body.id;

      await request(app).patch(`/api/todos/${todoId}/toggle`);

      const toggleResponse = await request(app).patch(
        `/api/todos/${todoId}/toggle`
      );

      expect(toggleResponse.status).toBe(200);
      expect(toggleResponse.body.completed).toBe(false);
    });

    test('should return 404 for non-existent todo', async () => {
      const response = await request(app).patch('/api/todos/99999/toggle');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    test('should delete a todo', async () => {
      const createResponse = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo' });

      const todoId = createResponse.body.id;

      const deleteResponse = await request(app).delete(`/api/todos/${todoId}`);

      expect(deleteResponse.status).toBe(200);

      const getResponse = await request(app).get('/api/todos');
      const todoExists = getResponse.body.some((t) => t.id === todoId);
      expect(todoExists).toBe(false);
    });

    test('should return 404 for non-existent todo', async () => {
      const response = await request(app).delete('/api/todos/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('Integration Tests', () => {
    test('should handle full CRUD lifecycle', async () => {
      const createRes = await request(app)
        .post('/api/todos')
        .send({ title: 'Lifecycle Test' });
      const todoId = createRes.body.id;
      expect(createRes.status).toBe(201);

      const getRes = await request(app).get('/api/todos');
      expect(getRes.body.some((t) => t.id === todoId)).toBe(true);

      const updateRes = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ title: 'Updated Lifecycle' });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated Lifecycle');

      const toggleRes = await request(app).patch(`/api/todos/${todoId}/toggle`);
      expect(toggleRes.body.completed).toBe(true);

      const deleteRes = await request(app).delete(`/api/todos/${todoId}`);
      expect(deleteRes.status).toBe(200);

      const finalGetRes = await request(app).get('/api/todos');
      expect(finalGetRes.body.some((t) => t.id === todoId)).toBe(false);
    });
  });
});

describe('Project Tracker API Tests', () => {
  test('should return an empty list of projects initially', async () => {
    const response = await request(app).get('/api/projects');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual([]);
  });

  test('should create a new project', async () => {
    const newProject = {
      name: 'Website Redesign',
      description: 'Refresh marketing site',
      status: 'In Progress',
      owner: 'Alicia',
    };

    const response = await request(app).post('/api/projects').send(newProject);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Website Redesign');
    expect(response.body).toHaveProperty('status', 'In Progress');
    expect(response.body).toHaveProperty('owner', 'Alicia');
  });

  test('should accept assignee when creating a project', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send({
        name: 'Support Migration',
        status: 'Not Started',
        assignee: 'Taylor',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('assignee', 'Taylor');
    expect(response.body).toHaveProperty('owner', 'Taylor');
  });

  test('should return a project by id', async () => {
    const createResponse = await request(app)
      .post('/api/projects')
      .send({ name: 'Mobile App Launch', owner: 'Sam' });

    const projectId = createResponse.body.id;
    const response = await request(app).get(`/api/projects/${projectId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', projectId);
    expect(response.body).toHaveProperty('name', 'Mobile App Launch');
  });

  test('should update a project', async () => {
    const createResponse = await request(app)
      .post('/api/projects')
      .send({ name: 'Brand Refresh', owner: 'Nina' });

    const projectId = createResponse.body.id;
    const response = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({ name: 'Brand Refresh v2', status: 'Completed' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', projectId);
    expect(response.body).toHaveProperty('name', 'Brand Refresh v2');
    expect(response.body).toHaveProperty('status', 'Completed');
  });

  test('should delete a project', async () => {
    const createResponse = await request(app)
      .post('/api/projects')
      .send({ name: 'Internal Portal', owner: 'Milo' });

    const projectId = createResponse.body.id;
    const deleteResponse = await request(app).delete(`/api/projects/${projectId}`);

    expect(deleteResponse.status).toBe(200);

    const getResponse = await request(app).get('/api/projects');
    expect(getResponse.body.some((project) => project.id === projectId)).toBe(false);
  });
});


describe('Project Tasks API Tests', () => {
  test('should create a task for a project', async () => {
    const projectResponse = await request(app)
      .post('/api/projects')
      .send({ name: 'Operations Upgrade', owner: 'Lena' });

    const projectId = projectResponse.body.id;
    const response = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .send({
        title: 'Define rollout plan',
        status: 'In Progress',
        assignee: 'Jordan',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('projectId', projectId);
    expect(response.body).toHaveProperty('title', 'Define rollout plan');
    expect(response.body).toHaveProperty('status', 'In Progress');
    expect(response.body).toHaveProperty('assignee', 'Jordan');
  });

  test('should update a task status', async () => {
    const projectResponse = await request(app)
      .post('/api/projects')
      .send({ name: 'Client Portal', owner: 'Jules' });

    const projectId = projectResponse.body.id;
    const createResponse = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .send({ title: 'Review requirements' });

    const taskId = createResponse.body.id;
    const response = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ status: 'Completed' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', taskId);
    expect(response.body).toHaveProperty('status', 'Completed');
  });

  test('should delete a task', async () => {
    const projectResponse = await request(app)
      .post('/api/projects')
      .send({ name: 'Analytics Launch', owner: 'Priya' });

    const projectId = projectResponse.body.id;
    const createResponse = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .send({ title: 'QA checklist' });

    const taskId = createResponse.body.id;
    const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`);

    expect(deleteResponse.status).toBe(200);

    const tasksResponse = await request(app).get(`/api/projects/${projectId}/tasks`);
    expect(tasksResponse.body.some((task) => task.id === taskId)).toBe(false);
  });
});

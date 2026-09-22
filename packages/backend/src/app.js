const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store for TODOs
let todos = [];
let nextId = 1;

// In-memory data store for projects
let projects = [];
let nextProjectId = 1;

// In-memory data store for project tasks
let tasks = [];
let nextTaskId = 1;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// POST /api/todos - Create a new todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (typeof req.body.title === 'string' && req.body.title.trim()) {
    todo.title = req.body.title.trim();
  }

  res.json(todo);
});

// PATCH /api/todos/:id/toggle - Toggle todo completion status
app.patch('/api/todos/:id/toggle', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todo.completed = !todo.completed;

  res.json(todo);
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const [removedTodo] = todos.splice(index, 1);
  res.json(removedTodo);
});

// GET /api/projects - Get all projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// GET /api/projects/:id - Get a single project
app.get('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json(project);
});

// POST /api/projects - Create a new project
app.post('/api/projects', (req, res) => {
  const { name, description, status, owner, assignee } = req.body;

  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const normalizedOwner = typeof owner === 'string' && owner.trim() ? owner.trim() : (typeof assignee === 'string' && assignee.trim() ? assignee.trim() : 'Unassigned');
  const normalizedAssignee = typeof assignee === 'string' && assignee.trim() ? assignee.trim() : normalizedOwner;

  const newProject = {
    id: nextProjectId++,
    name: name.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    status: typeof status === 'string' && status.trim() ? status.trim() : 'Not Started',
    owner: normalizedOwner,
    assignee: normalizedAssignee,
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// PUT /api/projects/:id - Update a project
app.put('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  if (typeof req.body.name === 'string' && req.body.name.trim()) {
    project.name = req.body.name.trim();
  }

  if (typeof req.body.description === 'string') {
    project.description = req.body.description.trim();
  }

  if (typeof req.body.status === 'string' && req.body.status.trim()) {
    project.status = req.body.status.trim();
  }

  const nextOwner = typeof req.body.owner === 'string' && req.body.owner.trim() ? req.body.owner.trim() : (typeof req.body.assignee === 'string' && req.body.assignee.trim() ? req.body.assignee.trim() : project.owner);
  const nextAssignee = typeof req.body.assignee === 'string' && req.body.assignee.trim() ? req.body.assignee.trim() : nextOwner;

  if (nextOwner) {
    project.owner = nextOwner;
  }

  if (nextAssignee) {
    project.assignee = nextAssignee;
  }

  res.json(project);
});

// DELETE /api/projects/:id - Delete a project
app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = projects.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const [removedProject] = projects.splice(index, 1);
  res.json(removedProject);
});


// GET /api/projects/:projectId/tasks - Get tasks for a project
app.get('/api/projects/:projectId/tasks', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  res.json(projectTasks);
});

// POST /api/projects/:projectId/tasks - Create a task for a project
app.post('/api/projects/:projectId/tasks', (req, res) => {
  const projectId = parseInt(req.params.projectId, 10);
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { title, description, status, assignee, priority } = req.body;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: nextTaskId++,
    projectId,
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    status: typeof status === 'string' && status.trim() ? status.trim() : 'To Do',
    assignee: typeof assignee === 'string' && assignee.trim() ? assignee.trim() : 'Unassigned',
    priority: typeof priority === 'string' && priority.trim() ? priority.trim() : 'Medium',
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id - Update a task
app.patch('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (typeof req.body.title === 'string' && req.body.title.trim()) {
    task.title = req.body.title.trim();
  }

  if (typeof req.body.description === 'string') {
    task.description = req.body.description.trim();
  }

  if (typeof req.body.status === 'string' && req.body.status.trim()) {
    task.status = req.body.status.trim();
  }

  if (typeof req.body.assignee === 'string' && req.body.assignee.trim()) {
    task.assignee = req.body.assignee.trim();
  }

  if (typeof req.body.priority === 'string' && req.body.priority.trim()) {
    task.priority = req.body.priority.trim();
  }

  res.json(task);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const [removedTask] = tasks.splice(index, 1);
  res.json(removedTask);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;

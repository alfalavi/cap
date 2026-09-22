import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderApp = () => {
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders Project Tracker heading', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  renderApp();

  expect(await screen.findByText(/Project Tracker/i)).toBeInTheDocument();
});

test('shows empty state and summary stats for no projects', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  renderApp();

  expect(await screen.findByText(/No projects yet/i)).toBeInTheDocument();
  expect(screen.getByText('0 total')).toBeInTheDocument();
  expect(screen.getByText('0 in progress')).toBeInTheDocument();
  expect(screen.getByText('0 completed')).toBeInTheDocument();
});

test('does not count Not Started projects as in progress', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => [
      { id: 1, name: 'Website Redesign', status: 'In Progress', owner: 'Alicia' },
      { id: 2, name: 'Brand Refresh', status: 'Not Started', owner: 'Jordan' },
    ],
  });

  renderApp();

  expect(await screen.findByText('1 in progress')).toBeInTheDocument();
  expect(screen.getByText('2 total')).toBeInTheDocument();
  expect(screen.getByText('0 completed')).toBeInTheDocument();
});

test('shows project detail and tasks when a project is selected', async () => {
  const user = userEvent.setup();

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/projects') {
      return Promise.resolve({
        ok: true,
        json: async () => [{ id: 1, name: 'Website Redesign', status: 'In Progress', owner: 'Alicia' }],
      });
    }

    if (url === '/api/projects/1/tasks') {
      return Promise.resolve({
        ok: true,
        json: async () => [
          { id: 11, projectId: 1, title: 'Define rollout plan', status: 'In Progress', assignee: 'Jordan' },
        ],
      });
    }

    return Promise.resolve({ ok: true, json: async () => [] });
  });

  renderApp();

  const projectButton = await screen.findByRole('button', { name: /select website redesign/i });
  await user.click(projectButton);

  expect(await screen.findByText(/Project Detail/i)).toBeInTheDocument();
  expect(screen.getByText(/Define rollout plan/i)).toBeInTheDocument();
});

test('adds a task to the selected project', async () => {
  const user = userEvent.setup();
  const tasks = [];

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/projects') {
      return Promise.resolve({
        ok: true,
        json: async () => [{ id: 1, name: 'Website Redesign', status: 'In Progress', owner: 'Alicia' }],
      });
    }

    if (url === '/api/projects/1/tasks' && !options.method) {
      return Promise.resolve({
        ok: true,
        json: async () => tasks,
      });
    }

    if (url === '/api/projects/1/tasks' && options.method === 'POST') {
      const payload = JSON.parse(options.body);
      const newTask = {
        id: 22,
        projectId: 1,
        title: payload.title,
        status: payload.status || 'To Do',
        assignee: payload.assignee || 'Unassigned',
      };

      tasks.push(newTask);
      return Promise.resolve({
        ok: true,
        json: async () => newTask,
      });
    }

    return Promise.resolve({ ok: true, json: async () => [] });
  });

  renderApp();

  const projectButton = await screen.findByRole('button', { name: /select website redesign/i });
  await user.click(projectButton);

  await user.type(screen.getByLabelText(/task title/i), 'Publish launch plan');
  await user.click(screen.getByRole('button', { name: /add task/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/projects/1/tasks',
      expect.objectContaining({ method: 'POST' })
    );
  });

  expect(await screen.findByText(/Publish launch plan/i)).toBeInTheDocument();
});


test('adds a task with an assignee to the selected project', async () => {
  const user = userEvent.setup();
  const tasks = [];

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/projects') {
      return Promise.resolve({
        ok: true,
        json: async () => [{ id: 1, name: 'Website Redesign', status: 'In Progress', owner: 'Alicia' }],
      });
    }

    if (url === '/api/projects/1/tasks' && !options.method) {
      return Promise.resolve({
        ok: true,
        json: async () => tasks,
      });
    }

    if (url === '/api/projects/1/tasks' && options.method === 'POST') {
      const payload = JSON.parse(options.body);
      const newTask = {
        id: 22,
        projectId: 1,
        title: payload.title,
        status: payload.status || 'To Do',
        assignee: payload.assignee || 'Unassigned',
      };

      tasks.push(newTask);
      return Promise.resolve({
        ok: true,
        json: async () => newTask,
      });
    }

    return Promise.resolve({ ok: true, json: async () => [] });
  });

  renderApp();

  const projectButton = await screen.findByRole('button', { name: /select website redesign/i });
  await user.click(projectButton);

  await user.type(screen.getByLabelText(/task title/i), 'Customer onboarding');
  await user.type(screen.getByLabelText(/task assignee/i), 'Morgan');
  await user.click(screen.getByRole('button', { name: /add task/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/projects/1/tasks',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Morgan'),
      })
    );
  });

  expect(await screen.findByText(/Customer onboarding/i)).toBeInTheDocument();
});

test('deletes a task from the selected project', async () => {
  const user = userEvent.setup();
  let tasks = [{ id: 11, projectId: 1, title: 'Define rollout plan', status: 'In Progress', assignee: 'Jordan' }];

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/projects') {
      return Promise.resolve({
        ok: true,
        json: async () => [{ id: 1, name: 'Website Redesign', status: 'In Progress', owner: 'Alicia' }],
      });
    }

    if (url === '/api/projects/1/tasks' && !options.method) {
      return Promise.resolve({
        ok: true,
        json: async () => tasks,
      });
    }

    if (url === '/api/tasks/11' && options.method === 'DELETE') {
      tasks = [];
      return Promise.resolve({
        ok: true,
        json: async () => ({ id: 11 }),
      });
    }

    return Promise.resolve({ ok: true, json: async () => [] });
  });

  renderApp();

  const projectButton = await screen.findByRole('button', { name: /select website redesign/i });
  await user.click(projectButton);

  const deleteButton = await screen.findByRole('button', { name: /delete define rollout plan/i });
  await user.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByText(/Define rollout plan/i)).not.toBeInTheDocument();
  });
});

test('updates task status from the selected project', async () => {
  const user = userEvent.setup();
  let tasks = [{ id: 11, projectId: 1, title: 'Define rollout plan', status: 'In Progress', assignee: 'Jordan' }];

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/projects') {
      return Promise.resolve({
        ok: true,
        json: async () => [{ id: 1, name: 'Website Redesign', status: 'In Progress', owner: 'Alicia' }],
      });
    }

    if (url === '/api/projects/1/tasks' && !options.method) {
      return Promise.resolve({
        ok: true,
        json: async () => tasks,
      });
    }

    if (url === '/api/tasks/11' && options.method === 'PATCH') {
      const payload = JSON.parse(options.body);
      tasks = [{ ...tasks[0], status: payload.status }];
      return Promise.resolve({
        ok: true,
        json: async () => tasks[0],
      });
    }

    return Promise.resolve({ ok: true, json: async () => [] });
  });

  renderApp();

  const projectButton = await screen.findByRole('button', { name: /select website redesign/i });
  await user.click(projectButton);

  const statusSelect = await screen.findByLabelText(/task status/i);
  await user.click(statusSelect);
  await user.click(await screen.findByRole('option', { name: /done/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/tasks/11',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  await waitFor(() => {
    expect(screen.getByRole('combobox', { name: /task status/i })).toHaveTextContent('Done');
  });
});

test('updates a project status from the selected project', async () => {
  const user = userEvent.setup();
  let project = { id: 1, name: 'Website Redesign', status: 'Not Started', owner: 'Alicia' };

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/projects') {
      return Promise.resolve({
        ok: true,
        json: async () => [project],
      });
    }

    if (url === '/api/projects/1' && options.method === 'PUT') {
      const payload = JSON.parse(options.body);
      project = { ...project, status: payload.status };
      return Promise.resolve({
        ok: true,
        json: async () => project,
      });
    }

    if (url === '/api/projects/1/tasks') {
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    }

    return Promise.resolve({ ok: true, json: async () => [] });
  });

  renderApp();

  const projectButton = await screen.findByRole('button', { name: /select website redesign/i });
  await user.click(projectButton);

  const completeButton = await screen.findByRole('button', { name: /complete project/i });
  await user.click(completeButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/projects/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /complete project/i })).toHaveTextContent('Complete project');
  });
});

test('edits project details from the selected project', async () => {
  const user = userEvent.setup();
  let project = { id: 1, name: 'Website Redesign', status: 'In Progress', owner: 'Alicia' };

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/projects') {
      return Promise.resolve({
        ok: true,
        json: async () => [project],
      });
    }

    if (url === '/api/projects/1' && options.method === 'PUT') {
      const payload = JSON.parse(options.body);
      project = { ...project, name: payload.name, owner: payload.owner };
      return Promise.resolve({
        ok: true,
        json: async () => project,
      });
    }

    if (url === '/api/projects/1/tasks') {
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    }

    return Promise.resolve({ ok: true, json: async () => [] });
  });

  renderApp();

  const projectButton = await screen.findByRole('button', { name: /select website redesign/i });
  await user.click(projectButton);

  await user.click(screen.getByRole('button', { name: /edit project/i }));
  const nameField = screen.getAllByLabelText(/edit project name/i)[0];
  await user.clear(nameField);
  await user.type(nameField, 'Website Refresh');
  const ownerField = screen.getAllByLabelText(/edit project owner/i)[0];
  await user.clear(ownerField);
  await user.type(ownerField, 'Sam');
  await user.click(screen.getByRole('button', { name: /save changes/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/projects/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });

  await waitFor(() => {
    expect(screen.queryByRole('button', { name: /save changes/i })).not.toBeInTheDocument();
  });
});

test('shows an error message when loading projects fails', async () => {
  global.fetch.mockRejectedValue(new Error('Request failed'));

  renderApp();

  expect(await screen.findByText(/Unable to load projects/i)).toBeInTheDocument();
});

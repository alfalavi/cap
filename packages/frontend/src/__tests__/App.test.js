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

test('renders TODO App heading', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  renderApp();

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('shows empty state and correct stats for no todos', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  renderApp();

  expect(await screen.findByText(/No todos yet/i)).toBeInTheDocument();
  expect(screen.getByText('0 items left')).toBeInTheDocument();
  expect(screen.getByText('0 completed')).toBeInTheDocument();
});

test('deletes a todo through the API', async () => {
  const user = userEvent.setup();
  const todos = [
    { id: 1, title: 'Write tests', completed: false },
    { id: 2, title: 'Ship feature', completed: true },
  ];

  global.fetch.mockImplementation((url, options = {}) => {
    if (url === '/api/todos' && !options.method) {
      return Promise.resolve({
        ok: true,
        json: async () => todos,
      });
    }

    if (url === '/api/todos/1' && options.method === 'DELETE') {
      return Promise.resolve({
        ok: true,
        json: async () => ({ id: 1 }),
      });
    }

    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  });

  renderApp();

  const deleteButton = await screen.findByRole('button', {
    name: /delete write tests/i,
  });
  await user.click(deleteButton);

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'DELETE',
    });
  });
});

test('shows an error message when loading todos fails', async () => {
  global.fetch.mockRejectedValue(new Error('Request failed'));

  renderApp();

  expect(await screen.findByText(/Unable to load todos/i)).toBeInTheDocument();
});

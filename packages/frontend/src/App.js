import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css';

const API_URL = '/api/todos';

const useTodos = () =>
  useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Unable to load todos');
      }

      return response.json();
    },
  });

function App() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const queryClient = useQueryClient();
  const { data: todos = [], isLoading, error } = useTodos();

  const addTodoMutation = useMutation({
    mutationFn: async (title) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        throw new Error('Title is required');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to add todo' }));
        throw new Error(errorData.error || 'Unable to add todo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTodoTitle('');
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to update todo' }));
        throw new Error(errorData.error || 'Unable to update todo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to delete todo' }));
        throw new Error(errorData.error || 'Unable to delete todo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, title }) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        throw new Error('Title is required');
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to update todo' }));
        throw new Error(errorData.error || 'Unable to update todo');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingId(null);
      setEditingTitle('');
    },
  });

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      return;
    }

    addTodoMutation.mutate(newTodoTitle);
  };

  const handleToggleTodo = (id) => {
    toggleTodoMutation.mutate(id);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const handleEditTodo = (id, title) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    updateTodoMutation.mutate({ id, title: trimmedTitle });
  };

  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            TODO App
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Session 5: Agentic Development
          </Typography>
        </Paper>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleAddTodo}
              sx={{ display: 'flex', gap: 2 }}
            >
              <TextField
                fullWidth
                value={newTodoTitle}
                onChange={(event) => setNewTodoTitle(event.target.value)}
                placeholder="What needs to be done?"
                variant="outlined"
                size="medium"
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: 120 }}
              >
                Add
              </Button>
            </Box>
            {(addTodoMutation.isError || deleteTodoMutation.isError || updateTodoMutation.isError) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {addTodoMutation.error?.message ||
                  deleteTodoMutation.error?.message ||
                  updateTodoMutation.error?.message ||
                  'Something went wrong'}
              </Alert>
            )}
          </CardContent>
        </Card>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && !isLoading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Unable to load todos.
          </Alert>
        )}

        {!isLoading && !error && todos.length === 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                No todos yet. Add one to get started.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && todos.length > 0 && (
          <Card>
            <List sx={{ p: 0 }}>
              {todos.map((todo, index) => (
                <ListItem
                  key={todo.id}
                  sx={{
                    borderBottom: index < todos.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {editingId === todo.id ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <TextField
                        fullWidth
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                        size="small"
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            handleEditTodo(todo.id, editingTitle);
                          }

                          if (event.key === 'Escape') {
                            setEditingId(null);
                            setEditingTitle('');
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEditTodo(todo.id, editingTitle)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setEditingId(null);
                          setEditingTitle('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                        sx={{ mr: 2 }}
                      />
                      <Typography
                        sx={{
                          flex: 1,
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {todo.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label={`Edit ${todo.title}`}
                          onClick={() => {
                            setEditingId(todo.id);
                            setEditingTitle(todo.title);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={`Delete ${todo.title}`}
                          onClick={() => handleDeleteTodo(todo.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          </Card>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Chip label={`${itemsLeft} items left`} color="primary" />
          <Chip label={`${completedCount} completed`} color="success" />
        </Box>
      </Container>
    </Box>
  );
}

export default App;

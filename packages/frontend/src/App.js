import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css';

const API_URL = '/api/projects';

const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Unable to load projects');
        }

        return response.json();
      } catch (error) {
        throw new Error('Unable to load projects');
      }
    },
  });

function App() {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectOwner, setNewProjectOwner] = useState('');
  const [newProjectAssignee, setNewProjectAssignee] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Unassigned');
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectDraft, setProjectDraft] = useState({ name: '', owner: '', assignee: '' });
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading, error } = useProjects();

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || null;

  useEffect(() => {
    if (selectedProject) {
      setProjectDraft({
        name: selectedProject.name || '',
        owner: selectedProject.owner || selectedProject.assignee || 'Unassigned',
        assignee: selectedProject.assignee || selectedProject.owner || 'Unassigned',
      });
    } else {
      setProjectDraft({ name: '', owner: '', assignee: '' });
    }
  }, [selectedProject]);

  const { data: projectTasks = [], error: taskError } = useQuery({
    queryKey: ['projectTasks', selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) {
        return [];
      }

      const response = await fetch(`${API_URL}/${selectedProjectId}/tasks`);

      if (!response.ok) {
        throw new Error('Unable to load tasks');
      }

      return response.json();
    },
    enabled: Boolean(selectedProjectId),
  });

  const normalizePersonName = (value, fallback = 'Unassigned') => {
    if (typeof value !== 'string') {
      return fallback;
    }

    const trimmed = value.trim();
    return trimmed || fallback;
  };

  const addProjectMutation = useMutation({
    mutationFn: async ({ name, owner, assignee }) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error('Project name is required');
      }

      const resolvedOwner = normalizePersonName(owner, normalizePersonName(assignee, 'Unassigned'));
      const resolvedAssignee = normalizePersonName(assignee, resolvedOwner);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          owner: resolvedOwner,
          assignee: resolvedAssignee,
          status: 'Not Started',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to add project' }));
        throw new Error(errorData.error || 'Unable to add project');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProjectName('');
      setNewProjectOwner('');
      setNewProjectAssignee('');
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async ({ title, assignee }) => {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        throw new Error('Task title is required');
      }

      const response = await fetch(`${API_URL}/${selectedProjectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: trimmedTitle,
          status: 'To Do',
          assignee: normalizePersonName(assignee, 'Unassigned'),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to add task' }));
        throw new Error(errorData.error || 'Unable to add task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', selectedProjectId] });
      setNewTaskTitle('');
      setNewTaskAssignee('Unassigned');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId) => {
      const response = await fetch(`${API_URL}/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to delete project' }));
        throw new Error(errorData.error || 'Unable to delete project');
      }

      return response.json();
    },
    onSuccess: (_, deletedProjectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projectTasks'] });
      setSelectedProjectId((currentId) => (currentId === deletedProjectId ? null : currentId));
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ projectId, name, owner, assignee }) => {
      const resolvedOwner = normalizePersonName(owner, normalizePersonName(assignee, 'Unassigned'));
      const resolvedAssignee = normalizePersonName(assignee, resolvedOwner);

      const response = await fetch(`${API_URL}/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, owner: resolvedOwner, assignee: resolvedAssignee }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to update project' }));
        throw new Error(errorData.error || 'Unable to update project');
      }

      return response.json();
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['projects'], (currentProjects = []) =>
        currentProjects.map((project) => (project.id === updatedProject.id ? updatedProject : project))
      );
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsEditingProject(false);
    },
  });

  const updateTaskAssigneeMutation = useMutation({
    mutationFn: async ({ taskId, assignee }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignee: normalizePersonName(assignee, 'Unassigned') }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to update task assignee' }));
        throw new Error(errorData.error || 'Unable to update task assignee');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', selectedProjectId] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to delete task' }));
        throw new Error(errorData.error || 'Unable to delete task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', selectedProjectId] });
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to update task status' }));
        throw new Error(errorData.error || 'Unable to update task status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectTasks', selectedProjectId] });
    },
  });

  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }) => {
      const response = await fetch(`${API_URL}/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unable to update project status' }));
        throw new Error(errorData.error || 'Unable to update project status');
      }

      return response.json();
    },
    onSuccess: (updatedProject, { projectId }) => {
      queryClient.setQueryData(['projects'], (currentProjects = []) =>
        currentProjects.map((project) => (project.id === updatedProject.id ? updatedProject : project))
      );
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProjectId(projectId);
    },
  });

  const handleAddProject = (event) => {
    event.preventDefault();
    addProjectMutation.mutate({ name: newProjectName, owner: newProjectOwner, assignee: newProjectAssignee });
  };

  const handleAddTask = (event) => {
    event.preventDefault();

    if (!selectedProjectId) {
      return;
    }

    addTaskMutation.mutate({ title: newTaskTitle, assignee: newTaskAssignee });
  };

  const handleDeleteProject = (projectId) => {
    deleteProjectMutation.mutate(projectId);
  };

  const handleDeleteTask = (taskId) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleTaskStatusChange = (taskId, status) => {
    updateTaskStatusMutation.mutate({ taskId, status });
  };

  const handleProjectSave = () => {
    if (!selectedProjectId) {
      return;
    }

    const assignee = projectDraft.assignee || projectDraft.owner || 'Unassigned';
    const owner = projectDraft.owner || assignee;

    updateProjectMutation.mutate({
      projectId: selectedProjectId,
      name: projectDraft.name.trim(),
      owner: owner.trim() || 'Unassigned',
      assignee: assignee.trim() || 'Unassigned',
    });
  };

  const handleProjectStatusChange = (projectId, status) => {
    if (!projectId || !status) {
      return;
    }

    updateProjectStatusMutation.mutate({ projectId, status });
  };

  const normalizeProjectStatus = (status) => String(status ?? '').trim();
  const isInProgressStatus = (status) => ['In Progress', 'Active', 'Started'].includes(normalizeProjectStatus(status));
  const isCompletedStatus = (status) => ['Done', 'Completed', 'Closed', 'Delivered'].includes(normalizeProjectStatus(status));

  const totalProjects = projects.length;
  const inProgress = projects.filter((project) => isInProgressStatus(project.status)).length;
  const completed = projects.filter((project) => isCompletedStatus(project.status)).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 0,
            background: 'linear-gradient(135deg, #0f172a 0%, #1f4e79 100%)',
            color: 'white',
            mb: 4,
            border: '1px solid rgba(148,163,184,0.2)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/project-logo.png"
                  alt="Project Tracker logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)' }}>Portfolio</Typography>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  Project Tracker
                </Typography>
              </Box>
            </Box>
            <Chip label="Corporate pipeline" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }} />
          </Box>
          <Typography variant="body1" sx={{ mt: 2, maxWidth: 640, color: 'rgba(255,255,255,0.82)' }}>
            Portfolio dashboard for project delivery and execution.
          </Typography>
        </Paper>

        <Box component="form" onSubmit={handleAddProject} sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', p: 2, borderRadius: 0, border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: 'none' }}>
          <TextField
            label="Edit project name"
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
            variant="outlined"
            sx={{ minWidth: 260, flex: 1 }}
          />
          <TextField
            label="Project assignee"
            value={newProjectAssignee}
            onChange={(event) => setNewProjectAssignee(event.target.value)}
            variant="outlined"
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Owner"
            value={newProjectOwner}
            onChange={(event) => setNewProjectOwner(event.target.value)}
            variant="outlined"
            sx={{ minWidth: 200 }}
          />
          <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ minWidth: 180 }}>
            Add project
          </Button>
        </Box>

        {(addProjectMutation.isError || error) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {addProjectMutation.error?.message || error?.message || 'Something went wrong'}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'total', value: totalProjects, color: '#e2e8f0' },
            { label: 'in progress', value: inProgress, color: '#dbeafe' },
            { label: 'completed', value: completed, color: '#dcfce7' },
          ].map((stat) => (
            <Grid item xs={12} sm={4} key={stat.label}>
              <Card sx={{ background: stat.color, borderColor: 'rgba(15,23,42,0.06)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="overline" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{`${stat.value} ${stat.label}`}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                No projects yet.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <Stack spacing={2}>
            {projects.map((project) => (
              <Box key={project.id} sx={{ display: 'flex', gap: 1.5, alignItems: 'stretch' }}>
                <Button
                  fullWidth
                  aria-label={`Select ${project.name}`}
                  variant={selectedProjectId === project.id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedProjectId(project.id)}
                  sx={{
                    justifyContent: 'space-between',
                    p: 2,
                    textTransform: 'none',
                    borderRadius: 0,
                    borderColor: selectedProjectId === project.id ? 'primary.main' : '#dfe7f1',
                    backgroundColor: selectedProjectId === project.id ? '#eef6ff' : '#ffffff',
                    boxShadow: 'none',
                    borderLeft: selectedProjectId === project.id ? '4px solid #1f4e79' : '4px solid #dbeafe',
                    '&:hover': { backgroundColor: selectedProjectId === project.id ? '#eaf3ff' : '#f8fafc' },
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="h6" sx={{ color: 'text.primary' }}>{project.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assignee: {project.assignee || project.owner || 'Unassigned'}
                    </Typography>
                  </Box>
                  <Chip
                    label={project.status || 'Not Started'}
                    sx={{
                      backgroundColor: isCompletedStatus(project.status) ? '#dcfce7' : isInProgressStatus(project.status) ? '#dbeafe' : '#f1f5f9',
                      color: isCompletedStatus(project.status) ? '#14532d' : isInProgressStatus(project.status) ? '#1d4ed8' : '#334155',
                      borderRadius: 0,
                      fontWeight: 700,
                    }}
                  />
                </Button>
                <IconButton
                  aria-label={`Delete ${project.name}`}
                  color="error"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  sx={{ border: '1px solid', borderColor: 'error.main', backgroundColor: '#fff', borderRadius: 0 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}

        {selectedProject && (
          <Card sx={{ mt: 4, borderRadius: 0, background: '#ffffff' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Project Detail
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedProject.name}</Typography>
                </Box>
                <Chip
                  label={selectedProject.status || 'Not Started'}
                  sx={{
                    backgroundColor: isCompletedStatus(selectedProject.status) ? '#dcfce7' : isInProgressStatus(selectedProject.status) ? '#dbeafe' : '#f1f5f9',
                    color: isCompletedStatus(selectedProject.status) ? '#14532d' : isInProgressStatus(selectedProject.status) ? '#1d4ed8' : '#334155',
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Assignee: {selectedProject.assignee || selectedProject.owner || 'Unassigned'}
              </Typography>

              {!isEditingProject ? (
                <Button variant="outlined" onClick={() => setIsEditingProject(true)} sx={{ mb: 2 }}>
                  Edit project
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  <TextField
                    label="Edit project name"
                    value={projectDraft.name}
                    onChange={(event) => setProjectDraft((current) => ({ ...current, name: event.target.value }))}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Project assignee"
                    value={projectDraft.assignee}
                    onChange={(event) => setProjectDraft((current) => ({ ...current, assignee: event.target.value }))}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    label="Edit project owner"
                    value={projectDraft.owner}
                    onChange={(event) => setProjectDraft((current) => ({ ...current, owner: event.target.value }))}
                    variant="outlined"
                    size="small"
                  />
                  <Button variant="contained" onClick={handleProjectSave}>
                    Save changes
                  </Button>
                  <Button variant="text" onClick={() => setIsEditingProject(false)}>
                    Cancel
                  </Button>
                </Box>
              )}

              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                {['In Progress', 'Postponed', 'Completed'].map((status) => {
                  const label = status === 'In Progress' ? 'Start project' : status === 'Postponed' ? 'Postpone project' : 'Complete project';
                  const isActive = (selectedProject.status || 'Not Started') === status;

                  return (
                    <Button
                      key={status}
                      variant={isActive ? 'contained' : 'outlined'}
                      color={status === 'Completed' ? 'success' : status === 'Postponed' ? 'warning' : 'primary'}
                      onClick={() => handleProjectStatusChange(selectedProject.id, status)}
                      sx={{ borderRadius: 0, px: 2 }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Stack>

              <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', p: 2, borderRadius: 0, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <TextField
                  label="Task title"
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                  variant="outlined"
                  sx={{ minWidth: 260, flex: 1 }}
                />
                <TextField
                  label="Task assignee"
                  value={newTaskAssignee}
                  onChange={(event) => setNewTaskAssignee(event.target.value)}
                  variant="outlined"
                  sx={{ minWidth: 180 }}
                />
                <Button type="submit" variant="contained" sx={{ minWidth: 140 }}>
                  Add task
                </Button>
              </Box>

              {(addTaskMutation.isError || taskError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {addTaskMutation.error?.message || taskError?.message || 'Something went wrong'}
                </Alert>
              )}

              {projectTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No tasks yet.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {projectTasks.map((task) => (
                    <Card key={task.id} variant="outlined">
                      <CardContent sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                        <Box>
                          <Typography variant="body1">{task.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {task.status || 'To Do'} • {task.assignee || 'Unassigned'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            size="small"
                            label="Task assignee"
                            defaultValue={task.assignee || 'Unassigned'}
                            onBlur={(event) => {
                              const nextAssignee = event.target.value.trim() || 'Unassigned';
                              if (nextAssignee !== (task.assignee || 'Unassigned')) {
                                updateTaskAssigneeMutation.mutate({ taskId: task.id, assignee: nextAssignee });
                              }
                            }}
                            sx={{ minWidth: 140 }}
                          />
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel id={`task-status-label-${task.id}`}>Task status</InputLabel>
                            <Select
                              labelId={`task-status-label-${task.id}`}
                              value={task.status || 'To Do'}
                              label="Task status"
                              onChange={(event) => handleTaskStatusChange(task.id, event.target.value)}
                            >
                              {['To Do', 'In Progress', 'Done', 'Blocked'].map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <IconButton
                            aria-label={`Delete ${task.title}`}
                            color="error"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export default App;

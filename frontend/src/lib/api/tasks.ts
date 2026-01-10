
import { apiRequest } from './client';
import { CreateTaskInput, Task, TaskQueryInput, UpdateTaskInput } from '@/features/tasks/types';

export const taskApi = {
  getTasks: async (query: TaskQueryInput = {}): Promise<Task[]> => {
    // Convert query params to record<string, string>
    const params: Record<string, string> = {};
    if (query.status) params.status = query.status;
    if (query.deadline) params.deadline = query.deadline;

    return apiRequest<Task[]>('/tasks', {
      method: 'GET',
      params,
    });
  },

  getTask: async (id: string): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: 'GET',
    });
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    return apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask: async (id: string, data: UpdateTaskInput): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteTask: async (id: string): Promise<void> => {
    return apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  completeTask: async (id: string): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}/complete`, {
      method: 'POST',
      body: '{}',
    });
  },

  rescheduleTask: async (id: string, deadline: 'TODAY' | 'TOMORROW' | 'SOMEDAY'): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ deadline }),
    });
  },
};

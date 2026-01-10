
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/lib/api/tasks';
import { CreateTaskInput, Task, TaskQueryInput, UpdateTaskInput } from '../types';
import { useToast } from '@/components/ui/ToastProvider';

export const TASK_KEYS = {
    all: ['tasks'] as const,
    list: (filters: TaskQueryInput) => [...TASK_KEYS.all, 'list', filters] as const,
    detail: (id: string) => [...TASK_KEYS.all, 'detail', id] as const,
};

export function useTasksQuery(filters: TaskQueryInput = {}) {
    return useQuery({
        queryKey: TASK_KEYS.list(filters),
        queryFn: () => taskApi.getTasks(filters),
    });
}

export function useCreateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTaskInput) => taskApi.createTask(data),
        onSuccess: (newTask) => {
            // If this is a subtask, update the parent task's subtasks array
            if (newTask.parentTaskId) {
                queryClient.setQueriesData({ queryKey: TASK_KEYS.all }, (oldData: any) => {
                    if (!oldData) return oldData;
                    if (Array.isArray(oldData)) {
                        return oldData.map((task: Task) => {
                            if (task.id === newTask.parentTaskId) {
                                return {
                                    ...task,
                                    subtasks: [...(task.subtasks || []), newTask],
                                };
                            }
                            return task;
                        });
                    }
                    return oldData;
                });
            }
            // Invalidate all list queries to refresh data
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
        },
    });
}

export function useUpdateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
            taskApi.updateTask(id, data),
        onSuccess: (updatedTask) => {
            // Update specific task in cache if it exists in lists
            queryClient.setQueriesData({ queryKey: TASK_KEYS.all }, (oldData: any) => {
                if (!oldData) return oldData;
                if (Array.isArray(oldData)) {
                    return oldData.map((task: Task) => task.id === updatedTask.id ? updatedTask : task);
                }
                return oldData;
            });
            // Also invalidate to be safe
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
        },
    });
}

export function useDeleteTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => taskApi.deleteTask(id),
        onMutate: async (deletedId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: TASK_KEYS.all });

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData(TASK_KEYS.all);

            // Find the task being deleted to check if it's a subtask or parent
            let deletedTask: Task | undefined;
            if (Array.isArray(previousTasks)) {
                deletedTask = previousTasks.find((task: Task) => task.id === deletedId);
                // Also check in subtasks
                if (!deletedTask) {
                    for (const task of previousTasks) {
                        if (task.subtasks) {
                            deletedTask = task.subtasks.find((st: Task) => st.id === deletedId);
                            if (deletedTask) break;
                        }
                    }
                }
            }

            // Optimistically update to remove the task
            queryClient.setQueriesData({ queryKey: TASK_KEYS.all }, (oldData: any) => {
                if (!oldData) return oldData;
                if (Array.isArray(oldData)) {
                    // If deleting a parent task, remove it (backend will handle subtasks)
                    // If deleting a subtask, remove it from parent's subtasks array
                    if (deletedTask?.parentTaskId) {
                        // It's a subtask - remove from parent's subtasks array
                        return oldData.map((task: Task) => {
                            if (task.id === deletedTask?.parentTaskId) {
                                return {
                                    ...task,
                                    subtasks: (task.subtasks || []).filter((st: Task) => st.id !== deletedId),
                                };
                            }
                            return task;
                        });
                    } else {
                        // It's a parent task - remove it (and its subtasks will be handled by backend)
                        return oldData.filter((task: Task) => task.id !== deletedId);
                    }
                }
                return oldData;
            });

            return { previousTasks, deletedTask };
        },
        onError: (_err, _newTodo, context) => {
            // Rollback on error
            if (context?.previousTasks) {
                queryClient.setQueryData(TASK_KEYS.all, context.previousTasks);
            }
        },
        onSuccess: () => {
            // Always refetch after error or success to ensure sync
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
        },
    });
}

export function useCompleteTaskMutation() {
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    return useMutation({
        mutationFn: (id: string) => taskApi.completeTask(id),
        onMutate: async (completedTaskId) => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: TASK_KEYS.all });

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData(TASK_KEYS.all);

            // Optimistically update to the new value
            queryClient.setQueriesData({ queryKey: TASK_KEYS.all }, (oldData: any) => {
                if (!oldData) return oldData;
                if (Array.isArray(oldData)) {
                    return oldData.map((task: Task) =>
                        task.id === completedTaskId
                            ? { ...task, status: 'COMPLETED', completedAt: new Date().toISOString() }
                            : task
                    );
                }
                return oldData;
            });

            // Return a context object with the snapshotted value
            return { previousTasks };
        },
        onError: (err, _newTodo, context) => {
            console.error('Complete task failed:', err);
            addToast('Failed to complete task', 'error');
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousTasks) {
                queryClient.setQueryData(TASK_KEYS.all, context.previousTasks);
            }
        },
        onSuccess: (updatedTask) => {
            // Update with server response to be sure
            queryClient.setQueriesData({ queryKey: TASK_KEYS.all }, (oldData: any) => {
                if (!oldData) return oldData;
                if (Array.isArray(oldData)) {
                    return oldData.map((task: Task) => {
                        // Update the task itself if it matches
                        if (task.id === updatedTask.id) {
                            return updatedTask;
                        }
                        // If this task has subtasks, check if the completed task is a subtask
                        if (task.subtasks && task.subtasks.length > 0) {
                            const updatedSubtasks = task.subtasks.map((subtask: Task) =>
                                subtask.id === updatedTask.id ? updatedTask : subtask
                            );
                            // Check if all subtasks are now completed
                            const allSubtasksCompleted = updatedSubtasks.every((st: Task) => st.status === 'COMPLETED');
                            return {
                                ...task,
                                subtasks: updatedSubtasks,
                                // Auto-update parent status if all subtasks are done
                                ...(allSubtasksCompleted && task.status !== 'COMPLETED' ? {
                                    status: 'COMPLETED' as const,
                                    completedAt: new Date().toISOString(),
                                } : {}),
                            };
                        }
                        return task;
                    });
                }
                return oldData;
            });
        },
        onSettled: () => {
            // Always refetch after error or success to ensure sync with server
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
        },
    });
}

export function useRescheduleTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, deadline }: { id: string; deadline: 'TODAY' | 'TOMORROW' | 'SOMEDAY' }) =>
            taskApi.rescheduleTask(id, deadline),
        onSuccess: (updatedTask) => {
            // Update specific task in cache
            queryClient.setQueriesData({ queryKey: TASK_KEYS.all }, (oldData: any) => {
                if (!oldData) return oldData;
                if (Array.isArray(oldData)) {
                    return oldData.map((task: Task) => task.id === updatedTask.id ? updatedTask : task);
                }
                return oldData;
            });
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.all });
        },
    });
}

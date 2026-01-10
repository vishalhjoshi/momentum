
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  deadline: z.enum(['TODAY', 'TOMORROW', 'SOMEDAY']).optional(),
  parentTaskId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  deadline: z.enum(['TODAY', 'TOMORROW', 'SOMEDAY']).optional(),
});

export const taskQuerySchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED']).optional(),
  deadline: z.enum(['TODAY', 'TOMORROW', 'SOMEDAY']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

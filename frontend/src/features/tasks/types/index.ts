
import { z } from 'zod';

export const taskStatusSchema = z.enum(['PENDING', 'COMPLETED', 'DELETED']);
export const taskDeadlineSchema = z.enum(['TODAY', 'TOMORROW', 'SOMEDAY']);

export const taskSchema: z.ZodType<any> = z.lazy(() => z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    status: taskStatusSchema,
    deadline: taskDeadlineSchema,
    completedAt: z.string().nullable().optional(), // ISO string
    createdAt: z.string(), // ISO string
    updatedAt: z.string(), // ISO string
    deletedAt: z.string().nullable().optional(), // ISO string
    parentTaskId: z.string().nullable().optional(),
    subtasks: z.array(taskSchema).optional(),
}));

export type Task = {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    deadline: TaskDeadline;
    completedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    parentTaskId?: string | null;
    subtasks?: Task[];
};

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    status: taskStatusSchema.optional(),
    deadline: taskDeadlineSchema.optional(),
    parentTaskId: z.string().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    status: taskStatusSchema.optional(),
    deadline: taskDeadlineSchema.optional(),
});

export const taskQuerySchema = z.object({
    status: taskStatusSchema.optional(),
    deadline: taskDeadlineSchema.optional(),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskDeadline = z.infer<typeof taskDeadlineSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

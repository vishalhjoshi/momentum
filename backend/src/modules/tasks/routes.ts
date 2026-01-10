
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authGuard, AuthenticatedRequest } from '@/modules/auth/middleware';
import { createTask, getTasks, getTask, updateTask, deleteTask, completeTask, rescheduleTask } from './service';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from './schemas';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard);

  // Create Task
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const parsed = createTaskSchema.parse(request.body);
      const task = await createTask(userId, parsed);
      return reply.code(201).send(task);
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(400).send({ error: 'Invalid task data' });
    }
  });

  // Get Tasks
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const query = taskQuerySchema.parse(request.query);
      const tasks = await getTasks(userId, query);
      return reply.send(tasks);
    } catch (error) {
      return reply.code(400).send({ error: 'Invalid query parameters' });
    }
  });

  // Get Single Task
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: userId } = (request as AuthenticatedRequest).user;
    const { id: taskId } = request.params as { id: string };
    const task = await getTask(userId, taskId);
    return reply.send(task);
  });

  // Update Task
  fastify.patch('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const { id: taskId } = request.params as { id: string };
      const parsed = updateTaskSchema.parse(request.body);
      const task = await updateTask(userId, taskId, parsed);
      return reply.send(task);
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(400).send({ error: 'Invalid update data' });
    }
  });

  // Delete Task
  fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id: userId } = (request as AuthenticatedRequest).user;
    const { id: taskId } = request.params as { id: string };
    await deleteTask(userId, taskId);
    return reply.code(204).send();
  });

  // Complete Task
  fastify.post('/:id/complete', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const { id: taskId } = request.params as { id: string };
      const task = await completeTask(userId, taskId);
      return reply.code(200).send(task);
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(400).send({ error: 'Failed to complete task' });
    }
  });

  // Reschedule Task
  fastify.post('/:id/reschedule', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const { id: taskId } = request.params as { id: string };
      const body = z.object({
        deadline: z.enum(['TODAY', 'TOMORROW', 'SOMEDAY']),
      }).parse(request.body);
      const task = await rescheduleTask(userId, taskId, body.deadline);
      return reply.code(200).send(task);
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(400).send({ error: 'Failed to reschedule task' });
    }
  });
}

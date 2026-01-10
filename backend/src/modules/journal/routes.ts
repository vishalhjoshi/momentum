
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authGuard, AuthenticatedRequest } from '@/modules/auth/middleware';
import { saveJournalEntry, getJournalEntries, getJournalEntryByDate, updateJournalEntry, deleteJournalEntry } from './service';
import { createJournalSchema, journalQuerySchema, updateJournalSchema } from './schemas';
import { AppError } from '@/lib/errors';

export async function journalRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard);

  // Create or Update Entry (Upsert)
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const parsed = createJournalSchema.parse(request.body);
      const entry = await saveJournalEntry(userId, parsed);
      return reply.code(200).send(entry);
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(400).send({ error: 'Invalid journal data' });
    }
  });

  // Get Entries (List)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const query = journalQuerySchema.parse(request.query);
      const entries = await getJournalEntries(userId, query);
      return reply.send(entries);
    } catch (error) {
      return reply.code(400).send({ error: 'Invalid query parameters' });
    }
  });

  // Get Single Entry by Date
  fastify.get('/:date', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const { date } = request.params as { date: string };
      const entry = await getJournalEntryByDate(userId, date);
      return reply.send(entry);
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(404).send({ error: 'Entry not found' });
    }
  });

  // Update Entry
  fastify.patch('/:date', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const { date } = request.params as { date: string };
      const parsed = updateJournalSchema.parse(request.body);
      const entry = await updateJournalEntry(userId, date, parsed);
      return reply.send(entry);
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(400).send({ error: 'Invalid update data' });
    }
  });

  // Delete Entry
  fastify.delete('/:date', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const { date } = request.params as { date: string };
      await deleteJournalEntry(userId, date);
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof AppError) throw error;
      return reply.code(404).send({ error: 'Entry not found' });
    }
  });
}

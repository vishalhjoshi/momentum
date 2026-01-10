
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authGuard, AuthenticatedRequest } from '@/modules/auth/middleware';
import { getAnalyticsSummary } from './service';

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authGuard);

  fastify.get('/summary', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const stats = await getAnalyticsSummary(userId);
      return reply.send(stats);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch analytics' });
    }
  });
}

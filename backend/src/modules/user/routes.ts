import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { authGuard, AuthenticatedRequest } from '@/modules/auth/middleware'
import { getUserProfile } from './service'

export async function userRoutes(fastify: FastifyInstance) {
  // All user endpoints require authentication
  fastify.get(
    '/me',
    {
      preHandler: authGuard,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = (request as AuthenticatedRequest).user
      const user = await getUserProfile(id)
      return reply.code(200).send(user)
    }
  )

  fastify.patch(
    '/preferences',
    {
      preHandler: authGuard,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = (request as AuthenticatedRequest).user

      // Basic validation ensuring at least one field is present if we want, or just pass through
      // We can use a partial schema here if we imported one, but for now we'll trust the keys 
      // are filtered by the service or we allow what's passed. 
      // Ideally we should validte specific fields.
      const data = request.body as Record<string, unknown>

      // Allowlist of updateable fields to prevent mass assignment of restricted fields
      const allowedFields = [
        'timeZone',
        'dailyReminderTime',
        'eveningCheckInTime',
        'notificationsEnabled',
        'soundEnabled',
        'hapticEnabled',
        'quietHoursStart',
        'quietHoursEnd',
        'darkModeEnabled',
        'insightsEnabled'
      ]

      const updates: Record<string, unknown> = {}
      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          updates[field] = data[field]
        }
      }

      if (Object.keys(updates).length === 0) {
        return reply.code(400).send({ error: 'No valid preference fields provided' })
      }

      const user = await import('./service').then(s => s.updateUserPreferences(id, updates))
      return reply.code(200).send(user)
    }
  )

  fastify.post(
    '/export-data',
    {
      preHandler: authGuard,
    },
    async (_request: FastifyRequest, _reply: FastifyReply) => {
      return { message: 'Export data endpoint - coming soon' }
    }
  )

  fastify.delete(
    '/',
    {
      preHandler: authGuard,
    },
    async (_request: FastifyRequest, _reply: FastifyReply) => {
      return { message: 'Delete account endpoint - coming soon' }
    }
  )


}


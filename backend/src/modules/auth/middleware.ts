import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken } from './jwt.js'
import { UnauthorizedError } from '@/lib/errors.js'

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string
  }
}

export async function authGuard(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError()
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const payload = verifyAccessToken(token)
      ; (request as AuthenticatedRequest).user = { id: payload.userId }
  } catch {
    throw new UnauthorizedError()
  }

  return
}



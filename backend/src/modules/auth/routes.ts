import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { signUp, login, requestPasswordReset, resetPassword } from './service.js'
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from './schemas.js'
import { AppError } from '@/lib/errors.js'

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', async (request, reply) => {
    try {
      const parsed = signUpSchema.parse(request.body)
      const result = await signUp(parsed)
      return reply.code(201).send({
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        message: 'Account created',
      })
    } catch (error) {
      console.error('Signup Error:', error)
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message, code: error.code })
      }
      if (error instanceof ZodError) {
        return reply.code(400).send({ error: 'Validation failed', details: error.errors })
      }
      return reply.code(400).send({ error: 'Invalid signup data' })
    }
  })

  fastify.post('/login', async (request, reply) => {
    try {
      const parsed = loginSchema.parse(request.body)
      const result = await login(parsed)
      return reply.code(200).send({
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
      })
    } catch (error) {
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message, code: error.code })
      }
      if (error instanceof ZodError) {
        return reply.code(400).send({ error: 'Validation failed', details: error.errors })
      }
      return reply.code(400).send({ error: 'Invalid login data' })
    }
  })

  // For JWT-based auth, logout is handled client-side by discarding tokens.
  fastify.post('/logout', async (_request, reply) => {
    return reply.code(200).send({ message: 'Logged out' })
  })

  fastify.post('/forgot-password', async (request, reply) => {
    try {
      const parsed = forgotPasswordSchema.parse(request.body)
      await requestPasswordReset(parsed)
      return reply
        .code(200)
        .send({ message: 'If that email exists, a reset link has been sent' })
    } catch {
      return reply.code(400).send({ error: 'Invalid email' })
    }
  })

  fastify.post('/reset-password', async (request, reply) => {
    try {
      const parsed = resetPasswordSchema.parse(request.body)
      await resetPassword(parsed)
      return reply.code(200).send({ message: 'Password updated' })
    } catch {
      return reply.code(400).send({ error: 'Invalid or expired reset token' })
    }
  })
}


import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { logger } from './lib/logger.js'
import { AppError } from './lib/errors.js'
import { authRoutes } from './modules/auth/routes.js'
import { userRoutes } from './modules/user/routes.js'
import { taskRoutes } from './modules/tasks/routes.js'
import { journalRoutes } from './modules/journal/routes.js'
import cron from 'node-cron'
import { runDailyRollover } from './jobs/dailyRollover.js'
import { analyticsRoutes } from './modules/analytics/routes.js'

async function start() {
  const server = Fastify({
    logger: true, // Use Fastify's default logger, we'll use our logger for custom logging
  })

  // Global error handler
  server.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        error: error.message,
        code: error.code,
      })
      return
    }

    // Handle Zod validation errors
    if (error.validation) {
      reply.status(400).send({
        error: 'Validation error',
        details: error.validation,
      })
      return
    }

    // Log unexpected errors
    logger.error(error)

    // Send generic error response
    reply.status(500).send({
      error: 'Internal server error',
    })
  })

  // Register plugins
  await server.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })

  await server.register(helmet)

  await server.register(rateLimit, {
    max: 5000,
    timeWindow: '1 minute',
    allowList: ['127.0.0.1', 'localhost'],
  })

  // Health check endpoint
  server.get('/healthz', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // Register routes
  await server.register(authRoutes, { prefix: '/api/auth' })
  await server.register(userRoutes, { prefix: '/api/user' })
  await server.register(taskRoutes, { prefix: '/api/tasks' })
  await server.register(journalRoutes, { prefix: '/api/journal' })
  await server.register(analyticsRoutes, { prefix: '/api/analytics' })

  // Start server

  // Schedule background jobs
  // Check for rollover every hour at minute 0
  cron.schedule('0 * * * *', () => {
    runDailyRollover()
  })

  const port = Number(process.env.PORT) || 3000
  const host = process.env.HOST || '0.0.0.0'

  try {
    await server.listen({ port, host })
    logger.info(`Server listening on http://${host}:${port}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()


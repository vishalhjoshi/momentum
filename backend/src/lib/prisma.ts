import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Safely construct DATABASE_URL if components are available
// This handles special characters in password/user that might break simple interpolation
if (process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && process.env.POSTGRES_DB) {
  const user = encodeURIComponent(process.env.POSTGRES_USER)
  const password = encodeURIComponent(process.env.POSTGRES_PASSWORD)
  const host = process.env.POSTGRES_HOST || 'postgres'
  const port = process.env.POSTGRES_PORT || '5432'
  const db = encodeURIComponent(process.env.POSTGRES_DB)
  const schema = 'public'

  process.env.DATABASE_URL = `postgres://${user}:${password}@${host}:${port}/${db}?schema=${schema}`
  console.log('Constructed safe DATABASE_URL from environment variables')
} else {
  console.warn('Missing POSTGRES_USER, POSTGRES_PASSWORD, or POSTGRES_DB env vars. Skipping safe URL construction.')
  console.log('Available Env Vars:', Object.keys(process.env).filter(k => k.startsWith('POSTGRES')))
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


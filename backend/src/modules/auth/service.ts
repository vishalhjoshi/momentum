import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma.js'
import { logger } from '@/lib/logger.js'
import {
  signAccessToken,
  signRefreshToken,
  signPasswordResetToken,
  verifyPasswordResetToken,
} from './jwt.js'
import {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignUpInput,
} from './schemas.js'
import { AppError, UnauthorizedError } from '@/lib/errors.js'

const BCRYPT_ROUNDS = 12

export async function signUp(input: SignUpInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (existing) {
    throw new AppError('Email already in use', 400, 'EMAIL_TAKEN')
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name,
      passwordHash,
    },
  })

  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    accessToken,
    refreshToken,
  }
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (!user || !user.passwordHash) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash)

  if (!isValid) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    accessToken,
    refreshToken,
  }
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (!user) {
    // For security, do not reveal whether the email exists
    logger.info({ email: input.email }, 'Password reset requested for non-existent email')
    return
  }

  const token = signPasswordResetToken(user.id)

  // TODO: integrate with real email service
  logger.info({ email: user.email, token }, 'Password reset token generated')

  // In real implementation, send email with reset link containing the token
}

export async function resetPassword(input: ResetPasswordInput) {
  const payload = verifyPasswordResetToken(input.token)

  const passwordHash = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS)

  await prisma.user.update({
    where: { id: payload.userId },
    data: { passwordHash },
  })
}



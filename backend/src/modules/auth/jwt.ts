import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'

export function signAccessToken(userId: string): string {
  const payload: TokenPayload = { userId }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function signRefreshToken(userId: string): string {
  const payload: TokenPayload = { userId }
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
}

// Password reset tokens can reuse JWT with different subject / expiry
const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET || JWT_SECRET
const PASSWORD_RESET_EXPIRES_IN = process.env.PASSWORD_RESET_EXPIRES_IN || '1h'

export function signPasswordResetToken(userId: string): string {
  const payload: TokenPayload = { userId }
  return jwt.sign(payload, PASSWORD_RESET_SECRET, {
    expiresIn: PASSWORD_RESET_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyPasswordResetToken(token: string): TokenPayload {
  return jwt.verify(token, PASSWORD_RESET_SECRET) as TokenPayload
}



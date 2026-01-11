# Environment Variables Reference

This document describes all environment variables used in the Momentum application.

## Backend Environment Variables

### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/momentum?schema=public` | Must include `?schema=public` for Prisma |
| `JWT_SECRET` | Secret key for JWT access tokens | `base64-encoded-32-char-minimum` | Generate with `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | Access token expiration time | `15m` | Use short duration (15m recommended) |
| `REFRESH_TOKEN_SECRET` | Secret key for refresh tokens | `base64-encoded-32-char-minimum` | Must differ from JWT_SECRET |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration time | `30d` | Use longer duration (7-30 days) |
| `NODE_ENV` | Environment mode | `production` | Options: `development`, `production`, `test` |
| `PORT` | Server port | `3000` | Default: 3000 |
| `FRONTEND_URL` | Frontend application URL | `https://yourdomain.com` | Used for CORS configuration |

### Optional Variables

| Variable | Description | Example | Default |
|----------|-------------|---------|---------|
| `HOST` | Server bind host | `0.0.0.0` | `0.0.0.0` |
| `LOG_LEVEL` | Logging verbosity | `info` | `info` |

### Generating Secrets

**JWT_SECRET and REFRESH_TOKEN_SECRET:**
```bash
# Generate secure random secrets
openssl rand -base64 32

# Alternative using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Important:** Never reuse secrets between environments (dev/staging/production).

### Example Backend .env

```bash
# Database
DATABASE_URL="postgresql://momentum_user:secure_password@localhost:5432/momentum_prod?schema=public"

# Authentication
JWT_SECRET="aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE"
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET="zY9xW7vU5tS3rQ1pO9nM7lK5jI3hG1fE9dC7bA5zY3xW"
REFRESH_TOKEN_EXPIRES_IN=30d

# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
FRONTEND_URL=https://momentum.yourdomain.com

# Optional
LOG_LEVEL=info
```

## Frontend Environment Variables

### Required Variables

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `VITE_API_URL` | Backend API base URL | `/api` or `https://api.yourdomain.com/api` | Use relative path `/api` when using nginx proxy |
| `VITE_ENVIRONMENT` | Build environment | `production` | Options: `development`, `production` |

### Example Frontend .env

**For Docker deployment with nginx proxy:**
```bash
VITE_API_URL=/api
VITE_ENVIRONMENT=production
```

**For separate backend deployment:**
```bash
VITE_API_URL=https://api.yourdomain.com/api
VITE_ENVIRONMENT=production
```

**Development:**
```bash
VITE_API_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
```

## Docker Compose Environment Variables

When using `docker-compose.yml`, create a `.env` file in the root directory:

```bash
# Database Configuration
POSTGRES_USER=momentum
POSTGRES_PASSWORD=secure_db_password_change_me
POSTGRES_DB=momentum

# Auth Secrets
JWT_SECRET=generate_secure_secret_32_chars_min
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=generate_different_secure_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# App Config
NODE_ENV=production
PORT=3000
FRONTEND_URL=http://localhost
```

**Note:** Docker Compose automatically constructs `DATABASE_URL` from `POSTGRES_*` variables.

## Platform-Specific Configuration

### Railway

Railway auto-injects `DATABASE_URL` when you provision PostgreSQL. Only add:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<your-secret>
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.railway.app
```

### Render

Render provides `DATABASE_URL` automatically. Backend environment variables:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<your-secret>
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://your-frontend.onrender.com
```

Frontend variables:
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_ENVIRONMENT=production
```

### Fly.io

Set secrets via CLI:

```bash
fly secrets set \
  JWT_SECRET="your-secret" \
  REFRESH_TOKEN_SECRET="your-secret" \
  NODE_ENV=production \
  FRONTEND_URL="https://your-frontend.fly.dev"
```

`DATABASE_URL` is auto-configured when attaching Postgres.

### DigitalOcean App Platform

Use DigitalOcean's built-in environment variable UI. Reference other components:

```
FRONTEND_URL=${frontend.PUBLIC_URL}
VITE_API_URL=${backend.PUBLIC_URL}/api
```

## Security Best Practices

### ✅ Do's

- **Generate unique secrets** for each environment
- **Use strong passwords** (32+ characters) for secrets
- **Store secrets securely** using platform secret managers
- **Rotate secrets regularly** (every 90 days recommended)
- **Use HTTPS** for all production URLs
- **Set short JWT expiration** (15 minutes recommended)
- **Use longer refresh token expiration** (7-30 days)
- **Enable DATABASE_URL SSL** in production when possible

### ❌ Don'ts

- **Never commit** `.env` files to version control
- **Don't reuse** secrets between environments
- **Don't share** production secrets in chat/email
- **Don't use weak secrets** like "changeme" or "password123"
- **Don't expose** secrets in client-side code
- **Don't use HTTP** for production FRONTEND_URL

## Validating Environment Variables

The backend validates required environment variables on startup. If any are missing or invalid, the application will fail to start with a descriptive error message.

### Manual Validation

Check if all required variables are set:

```bash
# Backend
cd backend
node -e "
const required = ['DATABASE_URL', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET', 'NODE_ENV'];
const missing = required.filter(v => !process.env[v]);
if (missing.length) {
  console.error('Missing variables:', missing);
  process.exit(1);
}
console.log('All required variables present');
"

# Frontend (during build)
cd frontend
node -e "
const required = ['VITE_API_URL'];
const missing = required.filter(v => !process.env[v]);
if (missing.length) {
  console.error('Missing variables:', missing);
  process.exit(1);
}
console.log('All required variables present');
"
```

## Troubleshooting

### Backend fails to start

**Error:** `DATABASE_URL is not defined`
- **Solution:** Ensure `DATABASE_URL` is set in environment or `.env` file
- Check format: `postgresql://user:pass@host:port/db?schema=public`

**Error:** `JWT_SECRET is not defined`
- **Solution:** Set `JWT_SECRET` environment variable
- Generate a secure secret: `openssl rand -base64 32`

**Error:** `prisma client not generated`
- **Solution:** Run `npx prisma generate` before starting
- In Docker, ensure Dockerfile runs this command

### Frontend can't connect to backend

**Error:** Network requests failing to `/api`
- **Solution:** Check `VITE_API_URL` is correct
- In Docker with nginx: use `/api` (relative path)
- With separate backend: use full URL like `https://backend.com/api`

**Error:** CORS errors in browser console
- **Solution:** Ensure `FRONTEND_URL` in backend matches your frontend domain
- Include protocol (http/https) and don't add trailing slash

### Database connection errors

**Error:** `Connection refused` or `timeout`
- **Solution:** Verify database is running and accessible
- Check host/port in `DATABASE_URL`
- Ensure firewall allows connections

**Error:** `authentication failed`
- **Solution:** Verify username/password in `DATABASE_URL`
- Check database user permissions

## Migration Guide

### From Development to Production

1. **Generate new secrets** (don't reuse dev secrets):
   ```bash
   openssl rand -base64 32  # For JWT_SECRET
   openssl rand -base64 32  # For REFRESH_TOKEN_SECRET
   ```

2. **Update DATABASE_URL** to point to production database

3. **Change NODE_ENV** to `production`

4. **Update URLs** to production domains:
   - `FRONTEND_URL` → Production frontend URL
   - `VITE_API_URL` → Production backend URL

5. **Verify all secrets** are set in platform's secret manager

6. **Test configuration** before deploying

### From HTTP to HTTPS

When migrating to HTTPS, update:
- `FRONTEND_URL` → Change `http://` to `https://`
- `VITE_API_URL` → Change `http://` to `https://` (if absolute URL)

No other changes needed - CORS will work correctly.

---

**Questions?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific setup or open an issue on GitHub.

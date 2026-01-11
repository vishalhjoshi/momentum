# Pre-Deployment Checklist

Use this checklist before deploying to production. Run `pnpm validate-deployment` to automatically check most items.

## Code Quality

- [ ] All code passes linting (`pnpm lint`)
- [ ] All TypeScript checks pass (`pnpm type-check` in backend and frontend)
- [ ] Application builds successfully (`pnpm build`)
- [ ] No console errors or warnings in browser dev tools
- [ ] Git repository is clean (all changes committed)

## Environment Configuration

- [ ] Production secrets generated (use `openssl rand -base64 32`)
- [ ] `.env` files are **NOT** committed to git
- [ ] All required environment variables documented in `ENV_VARS.md`
- [ ] Environment variables set in deployment platform
- [ ] `NODE_ENV=production` is set
- [ ] `FRONTEND_URL` matches your production frontend URL
- [ ] `DATABASE_URL` points to production database

## Security

- [ ] Strong JWT secrets generated (32+ characters)
- [ ] Refresh token secret differs from JWT secret
- [ ] Database credentials are secure
- [ ] HTTPS enabled on production domain
- [ ] Security headers present in nginx config
- [ ] CORS configured correctly (`FRONTEND_URL`)
- [ ] Rate limiting enabled
- [ ] Production database has SSL enabled (if supported)

## Database

- [ ] Production database created
- [ ] Database user has appropriate permissions
- [ ] Database connection tested
- [ ] Backup strategy in place
- [ ] Prisma schema is up to date
- [ ] Migrations tested in staging environment
- [ ] Migration script works (`start.sh` runs `prisma migrate deploy`)

## Docker (if using)

- [ ] Dockerfiles present for backend and frontend
- [ ] `.dockerignore` files configured
- [ ] Docker images build successfully (`docker compose build`)
- [ ] Health checks configured
- [ ] Multi-stage builds optimized
- [ ] Non-root user configured in containers

## Infrastructure

- [ ] Platform account created (Railway, Render, etc.)
- [ ] Domain configured (if using custom domain)
- [ ] SSL/TLS certificates configured
- [ ] Database instance provisioned
- [ ] Sufficient resources allocated (CPU, memory)
- [ ] Proper region selected for database and services

## Monitoring & Observability

- [ ] Application monitoring set up (optional but recommended)
- [ ] Log aggregation configured
- [ ] Uptime monitoring enabled
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Alerts configured for critical errors
- [ ] Database performance monitoring

## Testing

- [ ] Application tested locally with production build
- [ ] User registration flow tested
- [ ] Login flow tested
- [ ] Task management tested
- [ ] Journal features tested
- [ ] API endpoints respond correctly
- [ ] Frontend connects to backend successfully

## Documentation

- [ ] `DEPLOYMENT.md` reviewed
- [ ] `ENV_VARS.md` reviewed
- [ ] `README.md` updated with any project-specific details
- [ ] Team members informed of deployment

## Post-Deployment Verification

After deploying, verify:

- [ ] Frontend loads at production URL
- [ ] Backend health check responds: `GET /healthz`
- [ ] User can register
- [ ] User can login
- [ ] API calls succeed (check browser Network tab)
- [ ] No errors in application logs
- [ ] Database migrations completed successfully
- [ ] Background jobs are running (check logs for cron output)
- [ ] Security headers present (check browser dev tools)
- [ ] HTTPS working correctly
- [ ] Performance is acceptable (page load <3s)

## Rollback Plan

Before deploying, ensure you know how to:

- [ ] Revert to previous deployment
- [ ] Restore database from backup
- [ ] Access logs to diagnose issues
- [ ] Contact platform support if needed

## Continuous Deployment (Optional)

If setting up CI/CD:

- [ ] GitHub Actions (or other CI) configured
- [ ] Deployment secrets added to CI
- [ ] Build passes on CI
- [ ] Auto-deployment configured for main branch
- [ ] Manual approval required for production (recommended)

---

## Quick Commands

```bash
# Validate deployment readiness
pnpm validate-deployment

# Test local production build
docker compose up --build

# Generate secure secrets
openssl rand -base64 32

# Check environment variables
env | grep -E "(JWT|DATABASE|NODE_ENV|FRONTEND_URL)"

# Test backend health
curl http://localhost:3000/healthz

# View Docker logs
docker compose logs -f

# Run database migrations manually
docker compose exec backend npx prisma migrate deploy
```

---

**Ready to deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific instructions.

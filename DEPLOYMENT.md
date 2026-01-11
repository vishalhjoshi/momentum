# Deployment Guide

This guide covers deploying Momentum to various platforms. The application consists of three components:
- **Frontend**: React SPA served via nginx
- **Backend**: Node.js API (Fastify)
- **Database**: PostgreSQL

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Docker Deployment](#docker-deployment)
4. [Platform-Specific Guides](#platform-specific-guides)
   - [Railway](#railway)
   - [Render](#render)
   - [Fly.io](#flyio)
   - [DigitalOcean App Platform](#digitalocean-app-platform)
   - [AWS (ECS)](#aws-ecs)
   - [Heroku](#heroku)
5. [Database Migrations](#database-migrations)
6. [Post-Deployment Checklist](#post-deployment-checklist)

## Prerequisites

- Node.js 20+ (for local builds)
- pnpm 10.11.0+
- Docker & Docker Compose (for containerized deployments)
- PostgreSQL 15+ database (managed or self-hosted)

## Environment Variables

### Backend Environment Variables

Required variables for the backend:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public

# Authentication
JWT_SECRET=your-secure-jwt-secret-minimum-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-secure-refresh-token-secret-minimum-32-chars
REFRESH_TOKEN_EXPIRES_IN=30d

# Server Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com

# Optional: Logging
LOG_LEVEL=info
```

**Security Notes:**
- Generate secrets using: `openssl rand -base64 32`
- Never commit `.env` files to version control
- Use your platform's secret management system in production

### Frontend Environment Variables

Required variables for the frontend:

```bash
# API Configuration
VITE_API_URL=/api
VITE_ENVIRONMENT=production
```

## Docker Deployment

### Local Docker Compose

1. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build and Run**:
   ```bash
   docker compose up --build -d
   ```

3. **Verify Deployment**:
   - Frontend: http://localhost
   - Backend Health: http://localhost:3000/healthz

4. **View Logs**:
   ```bash
   docker compose logs -f
   ```

5. **Stop Services**:
   ```bash
   docker compose down
   ```

### Production Docker Deployment

For production servers (VPS, dedicated server):

1. **Set up production environment file** with secure values
2. **Run with production configuration**:
   ```bash
   docker compose -f docker-compose.yml up -d
   ```

3. **Set up reverse proxy** (nginx/Caddy) for SSL/TLS:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

## Platform-Specific Guides

### Railway

Railway provides automatic deployments from Git with zero-config support for Node.js apps.

#### Method 1: Monorepo Deployment (Recommended)

1. **Create New Project** on [Railway](https://railway.app)

2. **Add PostgreSQL Database**:
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically provisions and connects the database

3. **Deploy Backend**:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Configure:
     - **Root Directory**: `backend`
     - **Build Command**: `pnpm install && pnpm db:generate && pnpm build`
     - **Start Command**: `./start.sh`
     - **Watch Paths**: `backend/**`

4. **Add Backend Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=<generate-secure-secret>
   JWT_EXPIRES_IN=15m
   REFRESH_TOKEN_SECRET=<generate-secure-secret>
   REFRESH_TOKEN_EXPIRES_IN=30d
   FRONTEND_URL=https://your-frontend-url.railway.app
   ```
   - `DATABASE_URL` is automatically set by Railway

5. **Deploy Frontend**:
   - Click "New" → "GitHub Repo" (same repository)
   - Configure:
     - **Root Directory**: `frontend`
     - **Build Command**: `pnpm install && pnpm build`
     - **Start Command**: `npx serve -s dist -l 3000`
     - **Watch Paths**: `frontend/**`

6. **Add Frontend Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

7. **Generate Domain**:
   - Go to each service settings → Generate Domain

#### Method 2: Docker Deployment

1. Use Railway's Dockerfile deployment
2. Set up services individually using the Dockerfiles in each directory
3. Configure environment variables as above

**Notes**:
- Railway provides automatic HTTPS
- Set up health checks at `/healthz` endpoint
- Railway offers 500 hours/month on free tier

### Render

Render supports both Docker and native builds with managed PostgreSQL.

#### Setup

1. **Create PostgreSQL Database**:
   - Go to [Render Dashboard](https://render.com)
   - New → PostgreSQL
   - Note the internal/external database URLs

2. **Deploy Backend**:
   - New → Web Service
   - Connect your Git repository
   - Configure:
     - **Root Directory**: `backend`
     - **Environment**: Docker
     - **Dockerfile Path**: `backend/Dockerfile`
   - Add environment variables (see above)
   - Use internal database URL for better performance

3. **Deploy Frontend**:
   - New → Web Service
   - Same repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Environment**: Docker
     - **Dockerfile Path**: `frontend/Dockerfile`
   - Add environment variables:
     ```
     VITE_API_URL=https://your-backend.onrender.com/api
     ```

4. **Configure Custom Domain** (optional):
   - Settings → Custom Domain

**Notes**:
- Free tier: Services spin down after 15 min of inactivity
- Paid tier: Always-on instances with better performance
- Automatic SSL/TLS certificates
- Health checks recommended at `/healthz`

### Fly.io

Fly.io provides edge deployment with automatic scaling.

#### Setup

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**:
   ```bash
   fly auth login
   ```

3. **Create Postgres Database**:
   ```bash
   fly postgres create --name momentum-db --region ord
   ```

4. **Deploy Backend**:
   ```bash
   cd backend
   fly launch --name momentum-backend --region ord
   # Select PostgreSQL when prompted
   fly secrets set JWT_SECRET="your-secret" \
     REFRESH_TOKEN_SECRET="your-secret" \
     NODE_ENV=production \
     FRONTEND_URL="https://momentum-frontend.fly.dev"
   fly deploy
   ```

5. **Deploy Frontend**:
   ```bash
   cd frontend
   fly launch --name momentum-frontend --region ord
   fly deploy
   ```

6. **Attach Database to Backend**:
   ```bash
   fly postgres attach momentum-db --app momentum-backend
   ```

**Notes**:
- Fly.io automatically configures DATABASE_URL
- Includes 3 shared-cpu VMs on free tier
- Multi-region deployment available
- Configure `fly.toml` for custom settings

### DigitalOcean App Platform

App Platform provides managed container hosting with auto-scaling.

#### Setup

1. **Create App** from [DigitalOcean Console](https://cloud.digitalocean.com/apps)

2. **Connect Repository**:
   - Select GitHub/GitLab repository
   - App Platform auto-detects Dockerfiles

3. **Add Database Component**:
   - Add Component → Database → PostgreSQL
   - Choose plan (Dev/Prod)

4. **Configure Backend Component**:
   - Component: Web Service
   - Source: backend directory
   - Build: Dockerfile
   - HTTP Port: 3000
   - Health Check: `/healthz`
   - Add environment variables

5. **Configure Frontend Component**:
   - Component: Web Service
   - Source: frontend directory
   - Build: Dockerfile
   - HTTP Port: 80
   - Add environment variables

6. **Configure Environment Variables**:
   - Backend: Add all required variables
   - Frontend: `VITE_API_URL=${backend.PUBLIC_URL}/api`

7. **Deploy**:
   - Review and Create
   - App Platform builds and deploys automatically

**Notes**:
- Automatic HTTPS with managed certificates
- Auto-scaling available
- Free tier: $5/month credits for 3 months
- DATABASE_URL auto-injected for managed database

### AWS (ECS)

For AWS deployment using Elastic Container Service:

#### Setup

1. **Prerequisites**:
   - AWS CLI installed and configured
   - ECR repositories created for frontend and backend
   - RDS PostgreSQL instance created

2. **Build and Push Images**:
   ```bash
   # Backend
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t momentum-backend ./backend
   docker tag momentum-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/momentum-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/momentum-backend:latest
   
   # Frontend
   docker build -t momentum-frontend ./frontend
   docker tag momentum-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/momentum-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/momentum-frontend:latest
   ```

3. **Create ECS Task Definitions** for backend and frontend

4. **Create ECS Services**:
   - Configure Application Load Balancer
   - Set up target groups
   - Configure security groups

5. **Configure Secrets**:
   - Use AWS Secrets Manager or SSM Parameter Store
   - Reference in task definitions

6. **Set up RDS Connection**:
   - Ensure ECS tasks can reach RDS
   - Configure DATABASE_URL environment variable

**Notes**:
- More complex setup but highly scalable
- Use AWS Fargate for serverless containers
- Consider AWS Copilot CLI for easier management

### Heroku

Heroku provides simple deployment with buildpacks or Docker.

#### Setup (Buildpack Method)

1. **Install Heroku CLI**:
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login**:
   ```bash
   heroku login
   ```

3. **Create Apps**:
   ```bash
   heroku create momentum-backend
   heroku create momentum-frontend
   ```

4. **Add PostgreSQL**:
   ```bash
   heroku addons:create heroku-postgresql:mini -a momentum-backend
   ```

5. **Deploy Backend**:
   ```bash
   cd backend
   git subtree push --prefix backend heroku main
   # Or use Heroku Git remote
   ```

6. **Configure Backend**:
   ```bash
   heroku config:set JWT_SECRET="your-secret" -a momentum-backend
   heroku config:set REFRESH_TOKEN_SECRET="your-secret" -a momentum-backend
   heroku config:set NODE_ENV=production -a momentum-backend
   heroku config:set FRONTEND_URL="https://momentum-frontend.herokuapp.com" -a momentum-backend
   ```

7. **Deploy Frontend** (similar process)

**Notes**:
- Free tier discontinued; paid plans start at $5/month per dyno
- Easy to use with great documentation
- Automatic SSL on `*.herokuapp.com` domains

## Database Migrations

### Running Migrations in Production

The backend `start.sh` script automatically runs migrations on container start:

```bash
npx prisma migrate deploy
```

### Manual Migration

If you need to run migrations manually:

```bash
# Inside backend container
docker exec -it momentum-backend sh
npx prisma migrate deploy

# Or via docker-compose
docker compose exec backend npx prisma migrate deploy
```

### Creating New Migrations

During development:

```bash
cd backend
pnpm db:migrate
# Creates a new migration file in prisma/migrations/
```

Commit migration files to Git so they're deployed automatically.

### Migration Best Practices

- Always test migrations in staging first
- Back up database before running migrations in production
- Monitor application logs during migration
- Consider downtime windows for breaking schema changes
- Use `prisma migrate deploy` (not `db:push`) in production

## Post-Deployment Checklist

After deploying, verify these items:

### Health Checks

- [ ] Backend health endpoint returns 200: `GET /healthz`
- [ ] Frontend loads successfully
- [ ] API endpoints are accessible from frontend

### Security

- [ ] HTTPS is enabled and working
- [ ] Environment variables are set correctly (check logs for missing vars)
- [ ] Database connection is secured (SSL enabled if required)
- [ ] CORS is properly configured (check FRONTEND_URL)
- [ ] Rate limiting is active
- [ ] Security headers are present (check with browser dev tools)

### Functionality

- [ ] User registration works
- [ ] User login works
- [ ] Tasks can be created and updated
- [ ] Journal entries can be created
- [ ] Background jobs are running (check logs for cron output)
- [ ] Database queries are performing well

### Monitoring

- [ ] Set up application monitoring (e.g., Sentry, LogRocket)
- [ ] Configure log aggregation
- [ ] Set up uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Create alerts for error rates and response times
- [ ] Monitor database performance

### Performance

- [ ] Check page load times (<3s initial load)
- [ ] Verify API response times (<200ms for most endpoints)
- [ ] Test under load if expecting traffic
- [ ] Optimize slow queries if any

### Backup

- [ ] Database backup strategy in place
- [ ] Test database restore procedure
- [ ] Document backup retention policy

## Troubleshooting

### Common Issues

**Backend won't start**:
- Check DATABASE_URL is correctly formatted
- Ensure PostgreSQL is accessible
- Verify all required environment variables are set
- Check logs: `docker compose logs backend`

**Frontend can't reach backend**:
- Verify VITE_API_URL is correct
- Check CORS settings (FRONTEND_URL in backend)
- Inspect network tab in browser dev tools
- Ensure backend is running and healthy

**Database connection errors**:
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/db?schema=public`
- Check database credentials
- Ensure database accepts connections from your host
- Check SSL requirements

**Migrations fail**:
- Check database permissions
- Review migration files for errors
- Verify database schema is in expected state
- Check Prisma version compatibility

### Getting Help

- Check application logs first
- Review platform-specific documentation
- Open an issue on GitHub
- Join the community discussion

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs linting on push/PR
- Builds both frontend and backend
- Builds Docker images

To add deployment:

1. Add platform-specific deploy action (Railway, Render, etc.)
2. Configure secrets in GitHub repository settings
3. Update workflow to deploy on successful build

Example Railway deployment:
```yaml
- name: Deploy to Railway
  uses: bervProject/railway-deploy@main
  with:
    railway_token: ${{ secrets.RAILWAY_TOKEN }}
    service: momentum-backend
```

---

**Need help?** Open an issue in the repository or consult platform-specific documentation.

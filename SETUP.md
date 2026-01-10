# Setup Guide - Momentum

This guide walks you through setting up the Momentum development environment from scratch.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20+** (LTS recommended) - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/) or use Docker
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended (with ESLint, Prettier extensions)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd adhd-app
```

### 2. Set Up PostgreSQL Database

**Option A: Using Docker (Recommended for Development)**

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify it's running
docker ps
```

The database will be available at `localhost:5432` with:
- Username: `momentum`
- Password: `momentum_dev_password`
- Database: `momentum`

**Option B: Local PostgreSQL Installation**

```bash
# Create database
createdb momentum

# Or using psql
psql -U postgres
CREATE DATABASE momentum;
\q
```

### 3. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

### 4. Configure Environment Variables

**Backend Environment** (`backend/.env`):

Create `backend/.env` file:

```bash
# Server
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
FRONTEND_URL=http://localhost:5173

# Database (adjust if not using Docker)
DATABASE_URL="postgresql://momentum:momentum_dev_password@localhost:5432/momentum?schema=public"

# Auth (generate secure secrets for production!)
JWT_SECRET=dev-secret-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=dev-refresh-secret-change-in-production-min-32-chars
REFRESH_TOKEN_EXPIRES_IN=30d

# Logging
LOG_LEVEL=info
```

**Frontend Environment** (`frontend/.env`):

Create `frontend/.env` file:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_ENVIRONMENT=development
```

### 5. Set Up Database Schema

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Optional: Open Prisma Studio to view database
npm run db:studio
```

Prisma Studio will open at http://localhost:5555

### 6. Verify Setup

**Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server listening on http://0.0.0.0:3000
```

Test health endpoint:
```bash
curl http://localhost:3000/healthz
# Should return: {"status":"ok","timestamp":"..."}
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open http://localhost:5173 in your browser. You should see the Momentum homepage.

## Development Workflow

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Database Management

```bash
cd backend

# View database in browser
npm run db:studio

# Create a migration (for production)
npm run db:migrate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Code Quality

**Linting:**
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

**Type Checking:**
```bash
# Frontend
cd frontend
npm run type-check

# Backend
cd backend
npm run type-check
```

**Formatting:**
```bash
# Frontend
cd frontend
npm run format
```

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**

- Verify PostgreSQL is running: `docker ps` or `pg_isready`
- Check DATABASE_URL in `backend/.env` matches your setup
- For Docker: ensure container is running: `docker-compose up -d`

**Error: "Database does not exist"**

- Create database: `createdb momentum` or check Docker setup
- Verify DATABASE_URL points to correct database name

### Port Already in Use

**Error: "Port 3000 already in use"**

- Change PORT in `backend/.env` to another port (e.g., 3001)
- Update `frontend/.env` VITE_API_URL to match

**Error: "Port 5173 already in use"**

- Vite will automatically try next available port
- Or specify: `npm run dev -- --port 5174`

### Prisma Issues

**Error: "Prisma Client not generated"**

```bash
cd backend
npm run db:generate
```

**Error: "Schema is out of sync"**

```bash
cd backend
npm run db:push
```

### Module Resolution Errors

**Error: "Cannot find module"**

- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## Next Steps

Once setup is complete:

1. ✅ Verify both servers are running
2. ✅ Check database connection (Prisma Studio)
3. ✅ Review [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for development plan
4. ✅ Start implementing features from Phase 1 (Authentication)

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run linter |
| `npm run type-check` | Check TypeScript types |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create migration |
| `npm run db:studio` | Open Prisma Studio |

## Getting Help

- Check [README.md](./README.md) for project overview
- Review [TECH_STACK.md](./TECH_STACK.md) for technology details
- See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for development plan

---

**Happy coding! 🚀**


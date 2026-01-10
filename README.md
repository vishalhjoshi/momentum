# Momentum - ADHD-Friendly Task Management & Daily Journal

A calm, forgiving task and journal app designed for ADHD brains—focused on showing up, not perfection.

## 🎯 Project Overview

Momentum is a web application that helps people with ADHD manage daily tasks and reflect on their lives through gentle journaling. It combines two core workflows:

1. **Task Management:** Add tasks in seconds, break them into micro-steps if needed, and mark them done without guilt.
2. **Daily Journal:** Write one reflection per day with optional mood and energy tracking.

## 🏗️ Architecture

This is a full-stack application with:

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + TypeScript + Fastify + Prisma + PostgreSQL
- **Database:** PostgreSQL (managed or local)

See [TECH_STACK.md](./TECH_STACK.md) for detailed technology choices and [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for the development plan.

## 📁 Project Structure

```
momentum/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── app/       # App shell, routing, pages
│   │   ├── features/  # Feature modules (auth, tasks, journal)
│   │   ├── components/# Shared UI components
│   │   ├── lib/       # Utilities, API client
│   │   └── hooks/     # Custom React hooks
│   └── package.json
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── modules/   # Feature modules (auth, tasks, journal, user)
│   │   ├── lib/       # Shared utilities (prisma, logger, errors)
│   │   └── jobs/      # Background jobs (cron)
│   ├── prisma/        # Prisma schema and migrations
│   └── package.json
├── IMPLEMENTATION_ROADMAP.md  # 16-week development plan
├── TECH_STACK.md              # Technology reference
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (LTS)
- PostgreSQL 15+
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/vishalhjoshi/momentum.git
cd momentum

# Install dependencies for all packages
pnpm install
```

### 2. Set Up Database

```bash
# Create a PostgreSQL database
createdb momentum

# Or use Docker
docker run --name momentum-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=momentum -p 5432:5432 -d postgres:15
```

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
Copy `backend/.env.example` to `backend/.env` and update values.

**Frontend** (`frontend/.env`):
Copy `frontend/.env.example` to `frontend/.env` and update values.

### 4. Run Database Migrations

```bash
cd backend
pnpm db:push      # Push schema to database (or use db:migrate for production)
```

### 5. Start Development Servers

You can start servers from the root directory:

```bash
# Terminal 1 - Backend
pnpm dev:backend

# Terminal 2 - Frontend
pnpm dev:frontend
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/healthz

## 🐳 Docker Deployment

You can run the entire application stack (Frontend + Backend + Database) using Docker.

1.  **Configure Environment**:
    Copy `.env.example` to `.env` in the root directory.
    ```bash
    cp .env.example .env
    ```
    Modify the values in `.env` if desired (optional for local dev).

2.  **Run with Docker Compose**:
    ```bash
    docker compose up --build
    ```
    This will start:
    - **Frontend:** http://localhost
    - **Backend:** Internal container (proxied via Frontend)
    - **PostgreSQL:** Internal container

3.  **Stop**:
    ```bash
    docker compose down
    # To remove volumes (reset db):
    docker compose down -v
    ```

## 📚 Development

### Frontend Commands

```bash
cd frontend
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
pnpm format       # Format code with Prettier
```

### Backend Commands

```bash
cd backend
pnpm dev          # Start dev server with hot reload
pnpm build        # Build TypeScript
pnpm start        # Run production build
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema changes (dev)
pnpm db:migrate   # Create migration (production)
pnpm db:studio    # Open Prisma Studio (DB GUI)
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

## 🧪 Testing

Testing infrastructure is set up but tests need to be implemented. See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) Phase 7 for testing strategy.

## 📖 Documentation

- **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - 16-week development plan with milestones and tasks
- **[TECH_STACK.md](./TECH_STACK.md)** - Technology choices and configuration reference
- **[PRD.md](./PRD.md)** - Product Requirements Document (if available)

## 🎨 Design Principles

Momentum follows ADHD-friendly UX principles:

1. **Minimize Cognitive Load** - ≤3 primary actions per screen
2. **Progressive Disclosure** - Advanced features hidden by default
3. **Forgiving, Not Punitive** - Missed tasks roll forward without shame
4. **Immediate Feedback** - Every action gets response within 200ms
5. **Reduce Decision Fatigue** - Sensible defaults, customization opt-in
6. **Time-Aware** - Anchor tasks to time when possible
7. **Celebrate Effort** - Reward showing up, not perfection
8. **Readable, Not Dense** - Max 50 words per screen instruction
9. **Dark Mode by Default** - ADHD often co-occurs with light sensitivity
10. **No Shame Spirals** - Welcome back messages, not guilt trips

## 🔒 Security

- HTTPS only (TLS 1.2+)
- Password hashing with bcrypt (cost 12+)
- JWT tokens (short-lived access, long-lived refresh)
- Rate limiting on auth endpoints
- SQL injection prevention (Prisma)
- XSS prevention (React escaping, CSP headers)
- CSRF protection (SameSite cookies)

## ♿ Accessibility

Target: WCAG 2.1 AA compliance

- Color contrast ≥4.5:1
- Keyboard navigation
- Screen reader support
- Touch targets ≥44x44px
- Reduced motion support
- Focus management

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📧 Support

Open an issue in the Github repository for support.

---

**Status:** 🚧 In Development - Phase 0 (Foundation & Setup)

See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for current progress and next steps.


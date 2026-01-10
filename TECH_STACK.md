# Tech Stack Reference: Momentum

Quick reference for technologies, tools, and key architectural decisions.

---

## Frontend

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **React** | 18.x | UI framework | Industry standard, excellent ecosystem |
| **TypeScript** | 5.x | Type safety | Catch errors early, better DX |
| **Vite** | 5.x | Build tool | Fast HMR, simple config |
| **Tailwind CSS** | 3.x | Styling | Utility-first, rapid development |
| **React Router** | 6.x | Routing | Client-side navigation |
| **TanStack Query** | 5.x | Server state | Caching, refetch, optimistic updates |
| **Zod** | 3.x | Validation | Type-safe form/API validation |
| **date-fns** | 3.x | Date utilities | Timezone-aware date handling |
| **date-fns-tz** | 2.x | Timezone support | User timezone conversions |

### Frontend Dev Tools
- **ESLint** - Linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Storybook** (optional) - Component development

---

## Backend

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Node.js** | LTS (20.x) | Runtime | JavaScript ecosystem consistency |
| **TypeScript** | 5.x | Type safety | Shared types with frontend |
| **Fastify** or **Express** | Latest | HTTP server | Fast, minimal, plugin ecosystem |
| **Prisma** | 5.x | ORM | Type-safe DB access, migrations |
| **PostgreSQL** | 15+ | Database | Reliable, feature-rich |
| **bcrypt** | 5.x | Password hashing | Industry standard |
| **jsonwebtoken** | 9.x | JWT tokens | Stateless auth |
| **node-cron** | 3.x | Job scheduling | Simple cron jobs |
| **Zod** | 3.x | Validation | Request/response validation |
| **Pino** | 8.x | Logging | Fast, structured logging |

### Backend Dev Tools
- **Jest** or **Vitest** - Testing
- **Supertest** - API testing
- **Docker** (optional) - Local DB containerization

---

## Infrastructure & DevOps

| Service/Tool | Purpose | MVP Choice |
|-------------|---------|------------|
| **Frontend Hosting** | Static site hosting | Vercel / Netlify |
| **Backend Hosting** | Node.js app hosting | Fly.io / Render / Railway |
| **Database** | Managed PostgreSQL | Supabase / Neon / RDS |
| **Email Service** | Transactional emails | Postmark / SendGrid |
| **Error Monitoring** | Error tracking | Sentry |
| **Uptime Monitoring** | Health checks | UptimeRobot |
| **CI/CD** | Automated deployments | GitHub Actions |

---

## Key Libraries & Patterns

### State Management
- **React Query (TanStack Query)** for server state (tasks, journal, user)
- **React Context** for client state (auth, UI, theme)
- **No Redux** - Keep it simple for MVP

### Form Handling
- **React Hook Form** (optional) - Form state management
- **Zod** - Schema validation

### Date/Time
- **date-fns** + **date-fns-tz** - Timezone-aware date operations
- Store all dates as UTC in DB, convert to user timezone in UI

### Notifications
- **Web Push API** - Browser push notifications
- **web-push** (npm) - Server-side push sending

### Accessibility
- **@axe-core/react** - Automated a11y testing
- **react-aria** (optional) - Accessible component primitives

---

## Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=https://api.momentum.app
VITE_ENVIRONMENT=production
```

### Backend (.env)
```bash
# Server
NODE_ENV=production
PORT=3000
API_URL=https://api.momentum.app

# Database
DATABASE_URL=postgresql://user:pass@host:5432/momentum

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Email
EMAIL_PROVIDER=postmark
EMAIL_API_KEY=your-api-key
EMAIL_FROM=noreply@momentum.app

# Web Push
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_SUBJECT=mailto:admin@momentum.app

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## Database Schema (Prisma)

See `prisma/schema.prisma` for full schema. Key models:
- `User` - User accounts, preferences, streaks
- `Task` - Tasks with subtask support (self-referential)
- `JournalEntry` - Daily journal entries with mood/energy
- `AnalyticsEvent` - Event tracking for insights
- `NotificationSubscription` - Web push subscriptions

---

## API Structure

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://api.momentum.app/api`

### Endpoint Groups
- `/auth/*` - Authentication (signup, login, reset password)
- `/tasks/*` - Task CRUD and actions
- `/journal/*` - Journal entries
- `/user/*` - User profile and preferences
- `/notifications/*` - Push subscription management
- `/insights/*` - Analytics (Phase 2)

### Response Format
```typescript
// Success
{ data: T, message?: string }

// Error
{ error: string, code?: string, details?: any }
```

---

## Code Organization

### Frontend Structure
```
src/
├── app/              # App shell, routing, providers
├── features/         # Feature modules (tasks, journal, auth)
├── components/       # Shared UI components
├── lib/              # Utilities, API client, helpers
├── hooks/            # Custom React hooks
├── styles/           # Tailwind config, global styles
└── types/            # TypeScript types
```

### Backend Structure
```
src/
├── index.ts          # Server entry point
├── config/           # Environment config
├── modules/          # Feature modules (auth, tasks, journal)
├── lib/              # Shared utilities (prisma, logger, errors)
├── jobs/             # Background jobs (cron)
└── types/            # TypeScript types
```

---

## Testing Strategy

### Frontend
- **Unit tests**: Component logic, hooks, utilities
- **Integration tests**: User flows (signup → tasks → journal)
- **Accessibility tests**: Automated (Axe) + manual (screen readers)

### Backend
- **Unit tests**: Service logic, utilities
- **Integration tests**: API endpoints (with test DB)
- **E2E tests**: Full user journeys (optional for MVP)

### Coverage Target
- Critical paths: >80%
- Overall: >70%

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load | <2s (4G) | Lighthouse |
| API response | <500ms (p99) | Server logs |
| Task creation | <100ms (UI feedback) | User perception |
| Time to interactive | <3s | Lighthouse |

---

## Security Checklist

- [ ] HTTPS only (TLS 1.2+)
- [ ] Password hashing (bcrypt, cost 12+)
- [ ] JWT tokens (short-lived access, long-lived refresh)
- [ ] Rate limiting (auth endpoints)
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] XSS prevention (React escaping, CSP headers)
- [ ] CSRF protection (SameSite cookies)
- [ ] Input validation (Zod schemas)
- [ ] Secrets in environment variables (never commit)
- [ ] Regular dependency updates

---

## Accessibility Checklist

- [ ] WCAG 2.1 AA compliance
- [ ] Color contrast ≥4.5:1 (text)
- [ ] Keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Screen reader support (ARIA labels, semantic HTML)
- [ ] Touch targets ≥44x44px
- [ ] Reduced motion support
- [ ] Focus management (modals, toasts)
- [ ] Error messages associated with inputs

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] HTTPS/SSL certificates active
- [ ] Error monitoring configured (Sentry)
- [ ] Uptime monitoring configured
- [ ] Database backups enabled
- [ ] Logging configured
- [ ] Rate limiting configured
- [ ] CORS configured correctly
- [ ] Health check endpoint (`/healthz`)

---

## Future Considerations

### Phase 2+
- **Real-time sync**: WebSockets or Server-Sent Events
- **Mobile apps**: React Native or native (iOS/Android)
- **AI features**: Voice-to-text, smart suggestions (carefully)
- **Collaboration**: Multi-user features, shared lists

### Scaling
- **Database**: Read replicas, connection pooling
- **Backend**: Horizontal scaling (load balancer, multiple instances)
- **Caching**: Redis for session storage, API response caching
- **CDN**: Static asset delivery

---

**Last Updated:** [Date]


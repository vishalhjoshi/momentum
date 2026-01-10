# Implementation Roadmap: Momentum (ADHD Task & Journal App)

**Timeline:** 12-16 weeks (MVP)  
**Team Size:** Solo dev or 2-3 person team  
**Goal:** Launch a functional, ADHD-friendly task management and journaling app

---

## PHASE 0: Foundation & Setup (Week 1-2)

### Milestone 0.1: Project Scaffolding
**Goal:** Get development environment running with core tooling

**Tasks:**
- [ ] **T0.1.1** - Initialize frontend: Vite + React 18 + TypeScript + Tailwind CSS
- [ ] **T0.1.2** - Set up ESLint, Prettier, and TypeScript strict mode
- [ ] **T0.1.3** - Initialize backend: Node.js + TypeScript + Fastify/Express
- [ ] **T0.1.4** - Set up Prisma with PostgreSQL schema (User, Task, JournalEntry models)
- [ ] **T0.1.5** - Configure environment variables (.env.example files)
- [ ] **T0.1.6** - Set up Git repository with .gitignore
- [ ] **T0.1.7** - Create basic CI/CD pipeline (lint, type-check, test)
- [ ] **T0.1.8** - Set up local PostgreSQL database (Docker Compose or local install)

**Deliverable:** Both frontend and backend run locally, can connect to DB, basic "Hello World" API endpoint works

---

### Milestone 0.2: Design System Foundation
**Goal:** Establish visual language and component library

**Tasks:**
- [ ] **T0.2.1** - Configure Tailwind with ADHD-friendly color palette (calm neutrals + accent)
- [ ] **T0.2.2** - Create base typography scale (readable, not dense)
- [ ] **T0.2.3** - Build core component: `Button` (primary, secondary, ghost variants)
- [ ] **T0.2.4** - Build `Input` and `Textarea` components (accessible, clear focus states)
- [ ] **T0.2.5** - Build `Card` component (subtle borders, good spacing)
- [ ] **T0.2.6** - Build `Toast` component (non-intrusive, auto-dismiss)
- [ ] **T0.2.7** - Build `Modal` component (keyboard-trap, focus management)
- [ ] **T0.2.8** - Implement dark mode toggle (system preference detection + manual override)
- [ ] **T0.2.9** - Create `useReducedMotion` hook for accessibility
- [ ] **T0.2.10** - Set up Storybook (optional but recommended for component dev)

**Deliverable:** Component library with 5-7 core components, dark mode working, accessible patterns established

---

## PHASE 1: Authentication & Core Infrastructure (Week 3-4)

### Milestone 1.1: Backend Auth System
**Goal:** Secure user registration, login, and session management

**Tasks:**
- [ ] **T1.1.1** - Implement `POST /auth/signup` endpoint (email validation, password hashing with bcrypt)
- [ ] **T1.1.2** - Implement `POST /auth/login` endpoint (JWT token generation)
- [ ] **T1.1.3** - Implement `POST /auth/logout` endpoint (token invalidation)
- [ ] **T1.1.4** - Create JWT middleware for protected routes
- [ ] **T1.1.5** - Implement `POST /auth/forgot-password` (email service integration)
- [ ] **T1.1.6** - Implement `POST /auth/reset-password` (token validation, password update)
- [ ] **T1.1.7** - Add rate limiting for auth endpoints (5 attempts / 15 min)
- [ ] **T1.1.8** - Write integration tests for auth flows

**Deliverable:** Users can sign up, log in, reset passwords. All endpoints secured with JWT.

---

### Milestone 1.2: Frontend Auth UI
**Goal:** Beautiful, friction-free signup and login experience

**Tasks:**
- [ ] **T1.2.1** - Build `SignUp` page (email + password, clear error messages)
- [ ] **T1.2.2** - Build `Login` page (email + password, "Stay logged in" option)
- [ ] **T1.2.3** - Build `ForgotPassword` page (email input, success message)
- [ ] **T1.2.4** - Build `ResetPassword` page (token from URL, new password form)
- [ ] **T1.2.5** - Create `useAuth` hook (login, logout, current user state)
- [ ] **T1.2.6** - Set up React Query for auth API calls
- [ ] **T1.2.7** - Implement protected route wrapper (redirect to login if not authenticated)
- [ ] **T1.2.8** - Add loading states and error handling for all auth flows
- [ ] **T1.2.9** - Test auth flows manually (signup → login → logout → reset)

**Deliverable:** Users can sign up and log in through UI. Session persists across page refreshes.

---

### Milestone 1.3: User Preferences & Settings
**Goal:** User can customize app behavior

**Tasks:**
- [ ] **T1.3.1** - Extend User model with `preferences` JSON field (or separate table)
- [ ] **T1.3.2** - Implement `GET /user/me` endpoint (returns user + preferences)
- [ ] **T1.3.3** - Implement `PATCH /user/preferences` endpoint
- [ ] **T1.3.4** - Build `Settings` page UI (dark mode toggle, notification preferences)
- [ ] **T1.3.5** - Persist preferences to backend on change
- [ ] **T1.3.6** - Implement account deletion flow (`DELETE /user` with soft delete)

**Deliverable:** Users can change settings, preferences persist, account deletion works.

---

## PHASE 2: Task Management Core (Week 5-7)

### Milestone 2.1: Task CRUD Backend
**Goal:** Full task lifecycle API

**Tasks:**
- [ ] **T2.1.1** - Implement `GET /tasks` endpoint (filter by deadline: today/tomorrow/someday)
- [ ] **T2.1.2** - Implement `POST /tasks` endpoint (create task, default to "today")
- [ ] **T2.1.3** - Implement `PATCH /tasks/:id` endpoint (update title, deadline, status)
- [ ] **T2.1.4** - Implement `DELETE /tasks/:id` endpoint (soft delete)
- [ ] **T2.1.5** - Implement `POST /tasks/:id/complete` endpoint (mark completed, update streak)
- [ ] **T2.1.6** - Implement `POST /tasks/:id/reschedule` endpoint (move to tomorrow/someday)
- [ ] **T2.1.7** - Add subtask support (self-referential Task model, `parentTaskId`)
- [ ] **T2.1.8** - Write API tests for all task endpoints

**Deliverable:** Complete task API with all CRUD operations, subtasks, completion tracking.

---

### Milestone 2.2: Task List UI
**Goal:** Clean, minimal task list that reduces cognitive load

**Tasks:**
- [ ] **T2.2.1** - Build `TaskList` component (displays tasks for selected deadline)
- [ ] **T2.2.2** - Build `TaskItem` component (checkbox, title, actions: edit, reschedule, delete)
- [ ] **T2.2.3** - Implement task creation form (single input, instant feedback)
- [ ] **T2.2.4** - Add "Today / Tomorrow / Someday" tab navigation
- [ ] **T2.2.5** - Implement task completion (checkmark, celebration animation)
- [ ] **T2.2.6** - Implement task rescheduling (swipe left or button → move to tomorrow)
- [ ] **T2.2.7** - Implement task editing (inline edit or modal)
- [ ] **T2.2.8** - Implement task deletion (confirmation dialog)
- [ ] **T2.2.9** - Add "Completed today" section (strikethrough, still visible)
- [ ] **T2.2.10** - Integrate React Query for task data fetching and mutations
- [ ] **T2.2.11** - Add optimistic updates for task actions (instant UI feedback)
- [ ] **T2.2.12** - Implement progressive disclosure (max 7 tasks visible, "Show more" if needed)

**Deliverable:** Users can view, create, complete, edit, reschedule, and delete tasks. UI is calm and forgiving.

---

### Milestone 2.3: Task Breakdown (Micro-Steps)
**Goal:** Users can break large tasks into smaller steps

**Tasks:**
- [ ] **T2.3.1** - Extend Task UI to show "Add steps" button (collapsed by default)
- [ ] **T2.3.2** - Build subtask creation form (nested under parent task)
- [ ] **T2.3.3** - Display subtasks as collapsible nested list
- [ ] **T2.3.4** - Implement subtask completion (updates parent task status when all done)
- [ ] **T2.3.5** - Add visual indicator for parent tasks with incomplete subtasks
- [ ] **T2.3.6** - Test edge cases (delete parent with subtasks, complete parent before subtasks)

**Deliverable:** Users can break tasks into steps. Parent task completion logic works correctly.

---

### Milestone 2.4: Daily Task Rollover
**Goal:** Incomplete tasks automatically roll forward without shame

**Tasks:**
- [ ] **T2.4.1** - Create background job: `dailyTaskRollover` (runs at 12:01 AM per timezone)
- [ ] **T2.4.2** - Implement rollover logic: "today" → "tomorrow", threshold check for "someday"
- [ ] **T2.4.3** - Store rollover summary event for user notification
- [ ] **T2.4.4** - Test rollover with multiple users in different timezones
- [ ] **T2.4.5** - Add user-facing message: "You've got 2 tasks from yesterday" (gentle, not shaming)

**Deliverable:** Tasks roll forward automatically. Users see friendly notification, not guilt.

---

## PHASE 3: Daily Journal (Week 8-9)

### Milestone 3.1: Journal Backend
**Goal:** Store and retrieve journal entries

**Tasks:**
- [ ] **T3.1.1** - Implement `GET /journal` endpoint (list entries, optional month filter)
- [ ] **T3.1.2** - Implement `GET /journal/:date` endpoint (single entry by date)
- [ ] **T3.1.3** - Implement `POST /journal` endpoint (create entry for today)
- [ ] **T3.1.4** - Implement `PATCH /journal/:date` endpoint (update entry)
- [ ] **T3.1.5** - Implement `DELETE /journal/:date` endpoint
- [ ] **T3.1.6** - Add mood and energy fields to JournalEntry model
- [ ] **T3.1.7** - Write API tests for journal endpoints

**Deliverable:** Complete journal API with mood/energy tracking support.

---

### Milestone 3.2: Journal UI
**Goal:** Low-friction daily reflection experience

**Tasks:**
- [ ] **T3.2.1** - Build `JournalEntry` component (text editor, auto-save)
- [ ] **T3.2.2** - Add optional guided prompts (rotate ADHD-friendly questions)
- [ ] **T3.2.3** - Build mood selector (5-point scale: 😢 😟 😐 🙂 😄)
- [ ] **T3.2.4** - Build energy selector (3-point scale or 0-10 slider)
- [ ] **T3.2.5** - Add "Journal" button as primary CTA on home screen
- [ ] **T3.2.6** - Build journal history view (calendar or timeline)
- [ ] **T3.2.7** - Implement entry viewing (click date → read entry)
- [ ] **T3.2.8** - Add entry deletion (with confirmation)
- [ ] **T3.2.9** - Integrate React Query for journal data
- [ ] **T3.2.10** - Test journal flow: create → view → edit → delete

**Deliverable:** Users can write daily journal entries with optional mood/energy tracking. History view works.

---

## PHASE 4: Motivation & Streaks (Week 10-11)

### Milestone 4.1: Streak Calculation Backend
**Goal:** Track task and journal completion streaks

**Tasks:**
- [ ] **T4.1.1** - Add streak fields to User model (`taskStreakDays`, `journalStreakDays`, `lastTaskCompletionDate`, `lastJournalDate`)
- [ ] **T4.1.2** - Create streak calculation service (determines if streak continues or resets)
- [ ] **T4.1.3** - Update streaks on task completion (increment or reset)
- [ ] **T4.1.4** - Update streaks on journal entry creation (increment or reset)
- [ ] **T4.1.5** - Create daily job to recalculate streaks (backup/lazy calculation)
- [ ] **T4.1.6** - Test streak logic (consecutive days, missed day resets, timezone handling)

**Deliverable:** Streaks calculated correctly. Backend tracks both task and journal streaks.

---

### Milestone 4.2: Motivation UI & Celebrations
**Goal:** Positive reinforcement without shame

**Tasks:**
- [ ] **T4.2.1** - Display streak counter on home screen ("🔥 5 days")
- [ ] **T4.2.2** - Implement celebration animations (task completion: checkmark glow, optional sound)
- [ ] **T4.2.3** - Add celebration messages:
  - First task: "You're off to a great start ✓"
  - 50% tasks: "Halfway there! 💪"
  - All tasks: "You crushed today! 🎉"
- [ ] **T4.2.4** - Add "You showed up" feedback on login (if user skipped yesterday)
- [ ] **T4.2.5** - Display streak reset message gently ("New streak starting now" not "You broke your streak")
- [ ] **T4.2.6** - Add haptic feedback option (respects user preferences)
- [ ] **T4.2.7** - Test celebration flow (complete tasks → see messages → feel good)

**Deliverable:** Users see streaks, get positive feedback, feel encouraged (not judged).

---

### Milestone 4.3: Weekly Reflection (Optional)
**Goal:** Gentle weekly summary without performance pressure

**Tasks:**
- [ ] **T4.3.1** - Create background job: `weeklyReflectionPrep` (runs Sunday night)
- [ ] **T4.3.2** - Aggregate weekly stats (task completion %, mood trends)
- [ ] **T4.3.3** - Build weekly reflection UI (optional prompt, can skip)
- [ ] **T4.3.4** - Display week summary (tasks completed, best day, mood trend)
- [ ] **T4.3.5** - Make weekly reflection completely optional (no nagging)

**Deliverable:** Users can optionally see weekly summaries. No pressure, just reflection.

---

## PHASE 5: Notifications (Week 12)

### Milestone 5.1: Web Push Setup
**Goal:** Users can receive gentle reminders

**Tasks:**
- [ ] **T5.1.1** - Generate VAPID keys for web push
- [ ] **T5.1.2** - Create `NotificationSubscription` model (store push subscriptions)
- [ ] **T5.1.3** - Implement `POST /notifications/subscribe` endpoint
- [ ] **T5.1.4** - Build frontend push permission request (explicit, not auto-popup)
- [ ] **T5.1.5** - Store subscription in backend on user opt-in
- [ ] **T5.1.6** - Create notification service (sends push notifications)
- [ ] **T5.1.7** - Test push notification delivery

**Deliverable:** Web push infrastructure working. Users can subscribe to notifications.

---

### Milestone 5.2: Notification Scheduling
**Goal:** Daily reminders and evening check-ins

**Tasks:**
- [ ] **T5.2.1** - Create background job: `sendDailyReminders` (runs at user's `dailyReminderTime`)
- [ ] **T5.2.2** - Create background job: `sendEveningCheckIns` (runs at user's `eveningCheckInTime`)
- [ ] **T5.2.3** - Implement reminder logic (respects `notificationsEnabled`, `quietHours`)
- [ ] **T5.2.4** - Send task-specific reminders (if user sets reminder for a task)
- [ ] **T5.2.5** - Test notification scheduling (multiple users, timezones, preferences)
- [ ] **T5.2.6** - Add notification preferences UI (toggles for each type)

**Deliverable:** Users receive gentle reminders at their preferred times. Quiet hours respected.

---

## PHASE 6: Polish & Accessibility (Week 13-14)

### Milestone 6.1: Accessibility Audit & Fixes
**Goal:** WCAG 2.1 AA compliance

**Tasks:**
- [ ] **T6.1.1** - Run Lighthouse accessibility audit (target: 95+)
- [ ] **T6.1.2** - Run WAVE accessibility checker
- [ ] **T6.1.3** - Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] **T6.1.4** - Fix color contrast issues (ensure 4.5:1 ratio)
- [ ] **T6.1.5** - Add ARIA labels to all interactive elements
- [ ] **T6.1.6** - Ensure keyboard navigation works (Tab, Enter, Arrow keys)
- [ ] **T6.1.7** - Test touch targets (≥44x44px on mobile)
- [ ] **T6.1.8** - Verify reduced motion support (`prefers-reduced-motion`)
- [ ] **T6.1.9** - Fix any focus management issues (modals, toasts)

**Deliverable:** App passes accessibility audits. Screen reader users can navigate fully.

---

### Milestone 6.2: Performance Optimization
**Goal:** Fast, responsive experience

**Tasks:**
- [ ] **T6.2.1** - Measure page load time (target: <2s on 4G)
- [ ] **T6.2.2** - Optimize bundle size (code splitting, lazy loading)
- [ ] **T6.2.3** - Optimize API response times (target: <500ms p99)
- [ ] **T6.2.4** - Add database indexes (userId + status + deadline, userId + entryDate)
- [ ] **T6.2.5** - Implement React Query caching strategies
- [ ] **T6.2.6** - Test on slow 3G network
- [ ] **T6.2.7** - Optimize images/assets (if any)

**Deliverable:** App loads quickly, feels snappy, works on slow networks.

---

### Milestone 6.3: Error Handling & Resilience
**Goal:** Graceful degradation, no broken states

**Tasks:**
- [ ] **T6.3.1** - Add error boundaries to React app (catch component errors)
- [ ] **T6.3.2** - Implement offline detection (show message when API unreachable)
- [ ] **T6.3.3** - Queue mutations when offline (retry when back online)
- [ ] **T6.3.4** - Add user-friendly error messages (no technical jargon)
- [ ] **T6.3.5** - Test error scenarios (network failure, API errors, invalid input)
- [ ] **T6.3.6** - Set up error monitoring (Sentry or similar)

**Deliverable:** App handles errors gracefully. Users see helpful messages, not crashes.

---

## PHASE 7: Testing & QA (Week 15)

### Milestone 7.1: Comprehensive Testing
**Goal:** Confidence in app stability

**Tasks:**
- [ ] **T7.1.1** - Write unit tests for critical services (auth, streaks, rollover)
- [ ] **T7.1.2** - Write integration tests for API endpoints
- [ ] **T7.1.3** - Write component tests for key UI flows (task creation, journal entry)
- [ ] **T7.1.4** - Manual testing: complete user journeys (signup → tasks → journal → streaks)
- [ ] **T7.1.5** - Test edge cases (empty states, long text, special characters)
- [ ] **T7.1.6** - Cross-browser testing (Chrome, Safari, Firefox, Edge)
- [ ] **T7.1.7** - Mobile testing (iOS Safari, Android Chrome)
- [ ] **T7.1.8** - Load testing (simulate 50-100 concurrent users)

**Deliverable:** Test coverage >70% for critical paths. All user journeys work.

---

### Milestone 7.2: User Acceptance Testing
**Goal:** Validate ADHD-friendly design with real users

**Tasks:**
- [ ] **T7.2.1** - Recruit 5-10 beta testers with ADHD
- [ ] **T7.2.2** - Create testing script (onboarding, task creation, journal, missed tasks)
- [ ] **T7.2.3** - Collect feedback (usability, emotional response, friction points)
- [ ] **T7.2.4** - Iterate on UX based on feedback (reduce cognitive load, improve celebrations)
- [ ] **T7.2.5** - Fix critical bugs found in testing

**Deliverable:** Beta testers validate ADHD-friendly design. App feels encouraging, not overwhelming.

---

## PHASE 8: Deployment & Launch Prep (Week 16)

### Milestone 8.1: Production Infrastructure
**Goal:** App running in production

**Tasks:**
- [ ] **T8.1.1** - Set up production database (managed PostgreSQL)
- [ ] **T8.1.2** - Deploy backend to production (Fly.io/Render/Railway)
- [ ] **T8.1.3** - Deploy frontend to production (Vercel/Netlify)
- [ ] **T8.1.4** - Configure production environment variables
- [ ] **T8.1.5** - Set up database backups (daily, 30-day retention)
- [ ] **T8.1.6** - Configure HTTPS/SSL certificates
- [ ] **T8.1.7** - Set up uptime monitoring (UptimeRobot or similar)
- [ ] **T8.1.8** - Test production deployment (signup, login, core flows)

**Deliverable:** App live in production. Monitoring in place.

---

### Milestone 8.2: Launch Checklist
**Goal:** Ready for public launch

**Tasks:**
- [ ] **T8.2.1** - Write privacy policy (GDPR-compliant)
- [ ] **T8.2.2** - Write terms of service
- [ ] **T8.2.3** - Create landing page (if separate from app)
- [ ] **T8.2.4** - Set up email service for password reset (Postmark/SendGrid)
- [ ] **T8.2.5** - Test email delivery (signup confirmation, password reset)
- [ ] **T8.2.6** - Create onboarding flow (first-time user experience)
- [ ] **T8.2.7** - Add analytics (privacy-respecting, no 3rd-party tracking)
- [ ] **T8.2.8** - Final security audit (check for common vulnerabilities)
- [ ] **T8.2.9** - Create support email/contact form
- [ ] **T8.2.10** - Prepare launch announcement

**Deliverable:** All legal/operational requirements met. Ready to launch.

---

## POST-MVP: Phase 2 Features (Future)

### Insights & Analytics (Phase 2.1)
- Weekly snapshot UI (completion rate, best day, mood trends)
- Productivity heatmap (best time of day)
- Pattern recognition ("You journal after completing tasks")
- Opt-out toggle for insights

### Advanced Features (Phase 2.2)
- Voice-to-text for task creation and journal entries
- Task templates (recurring tasks)
- Export data (CSV/JSON download)
- Multi-device sync (real-time updates)

### Collaboration (Phase 2.3)
- Shared task lists (family/partner)
- Accountability buddy features
- (Note: Explicitly out of MVP scope, but architecture should support)

---

## TRACKING & METRICS

### Development Metrics
- **Velocity:** Track tasks completed per week
- **Bugs:** Track bug count, time to fix
- **Test Coverage:** Maintain >70% for critical paths

### Product Metrics (Post-Launch)
- **Retention:** % of users active after 7 days, 30 days, 90 days (target: >50% at 30 days)
- **Engagement:** Average tasks created per week, journal entries per week
- **Streak Health:** Average streak length, % of users with >7-day streaks
- **App Abandonment:** % of users who delete account (target: <10% in first month)

---

## RISK MITIGATION

### Technical Risks
- **Risk:** Database performance at scale  
  **Mitigation:** Index early, monitor query times, plan for horizontal scaling if needed

- **Risk:** Notification delivery failures  
  **Mitigation:** Fallback to email, graceful degradation, user can disable

- **Risk:** Timezone handling bugs  
  **Mitigation:** Use libraries (date-fns-tz), test with multiple timezones, store user timezone

### Product Risks
- **Risk:** Users still find app overwhelming  
  **Mitigation:** Beta test early, iterate on UX, follow ADHD principles strictly

- **Risk:** Low adoption  
  **Mitigation:** Focus on word-of-mouth, ADHD communities, clear value prop

---

## NOTES

- **Prioritization:** If timeline slips, cut Phase 5 (Notifications) or Phase 4.3 (Weekly Reflection) before core features
- **Flexibility:** This roadmap is a guide. Adjust based on user feedback and technical constraints
- **Documentation:** Document API endpoints, component props, and deployment process as you build
- **Code Quality:** Maintain clean code, write comments for complex logic, keep PRs small and reviewable

---

**Last Updated:** [Date]  
**Status:** Planning Phase


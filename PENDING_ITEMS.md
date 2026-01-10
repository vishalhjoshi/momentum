# Pending Items - Momentum ADHD App

Based on the PRD (IMPLEMENTATION_ROADMAP.md) and current codebase analysis, here's a comprehensive list of pending features and tasks.

## ✅ COMPLETED (What's Already Done)

### Phase 0: Foundation & Setup
- ✅ Project scaffolding (frontend + backend)
- ✅ Core UI components (Button, Input, Card, Modal, Toast)
- ✅ Dark mode support
- ✅ Basic routing and protected routes
- ✅ Database schema with all models (User, Task, JournalEntry, etc.)

### Phase 1: Authentication & Preferences
- ✅ Backend auth endpoints (signup, login, logout, forgot-password, reset-password)
- ✅ JWT middleware for protected routes
- ✅ Frontend auth pages (Login, SignUp, ForgotPassword, ResetPassword)
- ✅ Auth context and hooks
- ✅ Protected route wrapper
- ✅ GET /user/me endpoint
- ✅ **Settings Page Strategy** (UI implemented with toggles for Dark Mode, Notifications, Sounds, Haptics)
- ✅ **User Preferences API** (PATCH /user/preferences implemented)
- ✅ Logout flow

### Phase 2: Task Management
- ✅ Basic task CRUD backend (GET, POST, PATCH, DELETE /tasks)
- ✅ Task filtering by deadline and status
- ✅ Frontend task components (TaskList, TaskItem, CreateTaskModal)
- ✅ **Task Breakdown / Subtasks** (Milestone 2.3 complete)
- ✅ **Task Rescheduling** (Milestone 2.2 complete)
- ✅ **Task Completion & Streak Updates** (Milestone 4.1 partial)
- ✅ Today/Tomorrow/Someday tabs
- ✅ Progressive disclosure (Show more button)
- ✅ Rate limiting (Global limit implemented)
- ✅ **Daily Task Rollover** (Milestone 2.4 complete - logic and job implemented)

### Phase 3: Journal
- ✅ Journal backend endpoints (GET, POST, PATCH, DELETE /journal)
- ✅ Mood and energy fields in schema
- ✅ Frontend journal components (JournalEditor, MoodSelector, TodayJournalPanel)
- ✅ **Journal Prompts** (Integrated into editor)
- ✅ **Journal History View** (Basic implementation existing via /journal route)
- ✅ Entry deletion with confirmation

### Phase 4: Motivation & Streaks
- ✅ Streak fields in User model
- ✅ Streak calculation service (Timezone aware)
- ✅ Streak updates on completion
- ✅ Home screen streak display
- ✅ **Tier 2 Celebrations** (Confetti, Sound, Haptic feedback implemented)

---

## ❌ PENDING ITEMS

### Phase 1: Authentication & Core Infrastructure (Refinement)
- ❌ **T1.1.7** - **Specific** rate limiting for auth endpoints (Currently using global 5000 req/min limit, need stricter 5/15min for auth)
- ❌ **T1.1.8** - Write integration tests for auth flows

### Phase 2: Task Management Core
- ❌ **T2.1.8** - Write API tests for all task endpoints

### Phase 3: Daily Journal (Refinement)
- ⚠ **T3.2.6** - Enhance Journal History View (Current implementation is basic, consider "Calendar" view)

### Phase 5: Notifications (Major)
- ❌ **Milestone 5.1: Web Push Setup**
  - ❌ **T5.1.1** - Generate VAPID keys
  - ❌ **T5.1.3** - Implement subscription endpoint
  - ❌ **T5.1.6** - Create notification service
- ❌ **Milestone 5.2: Notification Scheduling**
  - ❌ **T5.2.1** - Daily reminder job
  - ❌ **T5.2.2** - Evening check-in job

### Phase 6: Polish & Accessibility
- ❌ **T6.1.1** - Accessibility Audit (Lighthouse)
- ❌ **T6.2.1** - Performance Audit
- ❌ **T6.3.1** - Error Boundaries

---

## 🔴 CRITICAL MISSING FEATURES (High Priority for MVP)

1. **Notifications** - Reminders are essential for re-engaging users.
2. **Journal Calendar View** - Visualizing history is important for reflection.
3. **Comprehensive Testing** - Need to ensure auth and task flows are robust.

---

## 📊 PROGRESS SUMMARY

- **Phase 0 (Foundation)**: 100% Complete
- **Phase 1 (Auth & Prefs)**: ~95% Complete (Just needs strict rate limit & tests)
- **Phase 2 (Tasks)**: 100% Complete (Rollover logic implemented)
- **Phase 3 (Journal)**: ~90% Complete (Functional, functional history)
- **Phase 4 (Motivation)**: 100% Complete (Streaks & Celebrations working)
- **Phase 5 (Notifications)**: 0% Complete (Backend/Frontend missing)
- **Phase 6 (Polish)**: ~20% Complete

**Overall MVP Progress: ~80% Complete**

---

## 🎯 RECOMMENDED NEXT STEPS

1. **Implement Notifications (Priority #1)**
   - Add VAPID keys and subscription logic.
   - Set up scheduled reminder jobs.

2. **Enhance Journal History (Secondary)**
   - Implement a calendar view for better visualization of past entries.

3. **Rate Limiting & Security (Polish)**
   - Implement strict rate limiting for auth endpoints.

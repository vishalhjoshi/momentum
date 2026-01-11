import { prisma } from './prisma.js';
import { startOfDay, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Calculate if a streak should continue or reset based on the last completion date
 * @param lastCompletionDate - The last date the user completed a task/journal entry
 * @param userTimeZone - User's timezone (e.g., 'America/New_York')
 * @returns Object with updated streak count and whether it was reset
 */
export async function calculateTaskStreak(
  userId: string,
  userTimeZone: string
): Promise<{ streakDays: number; wasReset: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      taskStreakDays: true,
      lastTaskCompletionDate: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const userNow = toZonedTime(now, userTimeZone);
  const today = startOfDay(userNow);

  // If no previous completion, start at 1
  if (!user.lastTaskCompletionDate) {
    return { streakDays: 1, wasReset: false };
  }

  const lastCompletion = toZonedTime(user.lastTaskCompletionDate, userTimeZone);
  const lastCompletionDay = startOfDay(lastCompletion);
  const daysSinceLastCompletion = differenceInDays(today, lastCompletionDay);

  // If completed today, increment streak
  if (daysSinceLastCompletion === 0) {
    return { streakDays: user.taskStreakDays, wasReset: false };
  }

  // If completed yesterday, continue streak
  if (daysSinceLastCompletion === 1) {
    return { streakDays: user.taskStreakDays + 1, wasReset: false };
  }

  // If more than 1 day ago, reset streak
  return { streakDays: 1, wasReset: true };
}

/**
 * Calculate journal streak
 */
export async function calculateJournalStreak(
  userId: string,
  userTimeZone: string
): Promise<{ streakDays: number; wasReset: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      journalStreakDays: true,
      lastJournalDate: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const userNow = toZonedTime(now, userTimeZone);
  const today = startOfDay(userNow);

  // If no previous journal entry, start at 1
  if (!user.lastJournalDate) {
    return { streakDays: 1, wasReset: false };
  }

  const lastJournal = toZonedTime(user.lastJournalDate, userTimeZone);
  const lastJournalDay = startOfDay(lastJournal);
  const daysSinceLastJournal = differenceInDays(today, lastJournalDay);

  // If journaled today, increment streak
  if (daysSinceLastJournal === 0) {
    return { streakDays: user.journalStreakDays, wasReset: false };
  }

  // If journaled yesterday, continue streak
  if (daysSinceLastJournal === 1) {
    return { streakDays: user.journalStreakDays + 1, wasReset: false };
  }

  // If more than 1 day ago, reset streak
  return { streakDays: 1, wasReset: true };
}

/**
 * Update task streak when a task is completed
 */
export async function updateTaskStreak(userId: string): Promise<{ streakDays: number; wasReset: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      timeZone: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { streakDays, wasReset } = await calculateTaskStreak(userId, user.timeZone);
  const now = new Date();

  await prisma.user.update({
    where: { id: userId },
    data: {
      taskStreakDays: streakDays,
      lastTaskCompletionDate: now,
    },
  });

  return { streakDays, wasReset };
}

/**
 * Update journal streak when a journal entry is created
 */
export async function updateJournalStreak(userId: string): Promise<{ streakDays: number; wasReset: boolean }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      timeZone: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { streakDays, wasReset } = await calculateJournalStreak(userId, user.timeZone);
  const now = new Date();

  await prisma.user.update({
    where: { id: userId },
    data: {
      journalStreakDays: streakDays,
      lastJournalDate: now,
    },
  });

  return { streakDays, wasReset };
}


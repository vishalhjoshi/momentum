
import { prisma } from '@/lib/prisma.js';
import { startOfDay, subDays, format } from 'date-fns';

export async function getAnalyticsSummary(userId: string) {
  const today = startOfDay(new Date());
  const last7Days = subDays(today, 6); // Include today

  // 1. Calculate Streak
  // We need to check daily checks for the past X days. 
  // A "streak" is consecutive days with at least 1 completed task.
  // We'll query tasks completed in the last 30 days to be safe.

  const recentTasks = await prisma.task.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      updatedAt: { gte: subDays(today, 30) }, // Look back 30 days
      deletedAt: null,
    },
    orderBy: { updatedAt: 'desc' },
    select: { updatedAt: true },
  });

  // Group by date (YYYY-MM-DD)
  const completedRefDates = new Set(
    recentTasks.map((t: { updatedAt: Date }) => format(t.updatedAt, 'yyyy-MM-dd'))
  );

  let currentStreak = 0;
  // Check today. If no task today yet, check yesterday.
  // If task today, streak starts at 1.
  // Then check backwards.

  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');

  if (completedRefDates.has(todayStr)) {
    currentStreak++;
  } else if (completedRefDates.has(yesterdayStr)) {
    // Streak is kept alive by yesterday, but today doesn't add to it yet? 
    // Or maybe we verify "current streak validity".
    // Let's standard: Count backwards from yesterday.
  } else {
    currentStreak = 0; // Streak broken
  }

  // Now count backwards
  if (currentStreak > 0 || completedRefDates.has(yesterdayStr)) {
    // If we already counted today, checkDate is yesterday.
    // If we didn't count today but have yesterday, checkDate is yesterday.
    // Wait, logic simplify:

    // Algorithm:
    // 1. Create a loop going back 30 days.
    // 2. Count consecutive days present in Set.
    // 3. Allow "Today" to be missing without breaking streak if "Yesterday" is present.

    let streak = 0;
    // Check today
    if (completedRefDates.has(todayStr)) {
      streak++;
    }

    // Check yesterday and backwards
    let dayCursor = subDays(today, 1);
    for (let i = 0; i < 30; i++) {
      const cursorStr = format(dayCursor, 'yyyy-MM-dd');
      if (completedRefDates.has(cursorStr)) {
        streak++;
        dayCursor = subDays(dayCursor, 1);
      } else {
        // If we are at yesterday and it's missing, and today is missing -> 0
        // If we are at yesterday and it's missing, but today is present -> 1
        break;
      }
    }
    currentStreak = streak;
  }


  // 2. Completion Rate (Last 7 Days)
  const tasksLast7Days = await prisma.task.findMany({
    where: {
      userId,
      createdAt: { gte: last7Days },
      deletedAt: null,
    },
  });

  const totalTasks = tasksLast7Days.length;
  const completedTasks = tasksLast7Days.filter((t: { status: string }) => t.status === 'COMPLETED').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 3. Mood Trend (Last 7 Days)
  const journalEntries = await prisma.journalEntry.findMany({
    where: {
      userId,
      entryDate: { gte: last7Days },
    },
    orderBy: { entryDate: 'asc' },
    select: { entryDate: true, mood: true, energy: true },
  });

  // Format for frontend chart
  const moodMap: Record<string, number> = { 'ROUGH': 1, 'OKAY': 2, 'GOOD': 3, 'GREAT': 4 };

  const moodTrend = journalEntries.map((entry: { entryDate: Date; mood: string | null; energy: number | null }) => ({
    date: format(entry.entryDate, 'MM-dd'),
    moodScore: entry.mood ? moodMap[entry.mood] : 0,
    energy: entry.energy || 0,
    moodLabel: entry.mood,
  }));

  return {
    streak: currentStreak,
    completionRate,
    totalTasksLast7Days: totalTasks,
    completedTasksLast7Days: completedTasks,
    moodTrend,
  };
}

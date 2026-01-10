
import { z } from 'zod';

export const moodTrendSchema = z.object({
    date: z.string(),
    moodScore: z.number(),
    energy: z.number(),
    moodLabel: z.string().nullable(),
});

export const analyticsSummarySchema = z.object({
    streak: z.number(),
    completionRate: z.number(),
    totalTasksLast7Days: z.number(),
    completedTasksLast7Days: z.number(),
    moodTrend: z.array(moodTrendSchema),
});

export type AnalyticsSummary = z.infer<typeof analyticsSummarySchema>;

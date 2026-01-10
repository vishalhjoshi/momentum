
import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;

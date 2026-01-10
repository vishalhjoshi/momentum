
import { z } from 'zod';

export const moodSchema = z.enum(['ROUGH', 'OKAY', 'GOOD', 'GREAT']);

export const createJournalSchema = z.object({
    content: z.string().min(1, 'Content is required'),
    mood: moodSchema.optional(),
    energy: z.number().min(0).max(10).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
});

export const journalQuerySchema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    limit: z.coerce.number().min(1).max(100).optional().default(30),
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type JournalQueryInput = z.infer<typeof journalQuerySchema>;
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;

export const updateJournalSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty').optional(),
    mood: moodSchema.optional(),
    energy: z.number().min(0).max(10).optional(),
});

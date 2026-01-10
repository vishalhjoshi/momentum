
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
    limit: z.coerce.number().min(1).max(100).optional(),
});

export const journalEntrySchema = z.object({
    id: z.string(),
    userId: z.string(),
    entryDate: z.string(), // ISO string from backend
    content: z.string(),
    mood: moodSchema.nullable().optional(),
    energy: z.number().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Mood = z.infer<typeof moodSchema>;
export type CreateJournalInput = z.infer<typeof createJournalSchema>;
export type JournalQueryInput = z.infer<typeof journalQuerySchema>;
export type JournalEntry = z.infer<typeof journalEntrySchema>;

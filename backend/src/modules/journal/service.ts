
import { prisma } from '@/lib/prisma';
import { CreateJournalInput, JournalQueryInput } from './schemas';
import { AppError } from '@/lib/errors';
import { updateJournalStreak } from '@/lib/streaks';

export async function saveJournalEntry(userId: string, input: CreateJournalInput) {
    // Determine date (default to today)
    const dateStr = input.date || new Date().toISOString().split('T')[0];

    // Create Date object at midnight UTC to ensure consistency
    const entryDate = new Date(dateStr);

    // Check if entry already exists
    const existingEntry = await prisma.journalEntry.findUnique({
        where: {
            userId_entryDate: {
                userId,
                entryDate,
            },
        },
    });

    const isNewEntry = !existingEntry;

    // Use upsert to handle "one unique entry per day" logic
    // Update if exists, Create if not
    const entry = await prisma.journalEntry.upsert({
        where: {
            userId_entryDate: {
                userId,
                entryDate,
            },
        },
        update: {
            content: input.content,
            mood: input.mood,
            energy: input.energy,
        },
        create: {
            userId,
            entryDate,
            content: input.content,
            mood: input.mood,
            energy: input.energy,
        },
    });

    // Update journal streak only for new entries
    if (isNewEntry) {
        try {
            await updateJournalStreak(userId);
        } catch (error) {
            // Log error but don't fail the journal entry save
            console.error('Failed to update journal streak:', error);
        }
    }

    return entry;
}

export async function getJournalEntries(userId: string, query: JournalQueryInput) {
    const where: any = { userId };

    if (query.startDate) {
        where.entryDate = { ...where.entryDate, gte: new Date(query.startDate) };
    }

    if (query.endDate) {
        where.entryDate = { ...where.entryDate, lte: new Date(query.endDate) };
    }

    const entries = await prisma.journalEntry.findMany({
        where,
        orderBy: { entryDate: 'desc' },
        take: query.limit,
    });

    return entries;
}

export async function getJournalEntryByDate(userId: string, dateStr: string) {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    const entryDate = new Date(dateStr);

    const entry = await prisma.journalEntry.findUnique({
        where: {
            userId_entryDate: {
                userId,
                entryDate,
            },
        },
    });

    if (!entry) {
        throw new AppError('Entry not found for this date', 404);
    }

    return entry;
}

export async function updateJournalEntry(userId: string, dateStr: string, input: any) {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    const entryDate = new Date(dateStr);

    // Check if entry exists
    const existing = await prisma.journalEntry.findUnique({
        where: {
            userId_entryDate: {
                userId,
                entryDate,
            },
        },
    });

    if (!existing) {
        throw new AppError('Entry not found', 404);
    }

    const updated = await prisma.journalEntry.update({
        where: {
            userId_entryDate: {
                userId,
                entryDate,
            },
        },
        data: input,
    });

    return updated;
}

export async function deleteJournalEntry(userId: string, dateStr: string) {
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    const entryDate = new Date(dateStr);

    // Check if entry exists
    const existing = await prisma.journalEntry.findUnique({
        where: {
            userId_entryDate: {
                userId,
                entryDate,
            },
        },
    });

    if (!existing) {
        throw new AppError('Entry not found', 404);
    }

    await prisma.journalEntry.delete({
        where: {
            userId_entryDate: {
                userId,
                entryDate,
            },
        },
    });

    return { success: true };
}

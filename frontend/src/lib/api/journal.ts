
import { apiRequest } from './client';
import { CreateJournalInput, JournalEntry, JournalQueryInput } from '@/features/journal/types';

export const journalApi = {
    saveEntry: async (data: CreateJournalInput): Promise<JournalEntry> => {
        return apiRequest<JournalEntry>('/journal', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getEntries: async (query: JournalQueryInput = {}): Promise<JournalEntry[]> => {
        const params: Record<string, string> = {};
        if (query.startDate) params.startDate = query.startDate;
        if (query.endDate) params.endDate = query.endDate;
        if (query.limit !== undefined) params.limit = query.limit.toString();

        return apiRequest<JournalEntry[]>('/journal', {
            method: 'GET',
            params,
        });
    },

    getEntryByDate: async (date: string): Promise<JournalEntry> => {
        return apiRequest<JournalEntry>(`/journal/${date}`, {
            method: 'GET',
        });
    },

    deleteEntry: async (date: string): Promise<void> => {
        return apiRequest<void>(`/journal/${date}`, {
            method: 'DELETE',
        });
    },
};


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from '@/lib/api/journal';
import { CreateJournalInput } from '../types';

export const JOURNAL_KEYS = {
    all: ['journal'] as const,
    list: () => [...JOURNAL_KEYS.all, 'list'] as const,
    detail: (date: string) => [...JOURNAL_KEYS.all, 'detail', date] as const,
};

export function useJournalEntryQuery(date: string) {
    return useQuery({
        queryKey: JOURNAL_KEYS.detail(date),
        queryFn: () => journalApi.getEntryByDate(date),
        retry: false, // Don't retry if 404 (entry doesn't exist yet)
    });
}

export function useJournalEntriesQuery(startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: JOURNAL_KEYS.list(), // TODO: Add date range to key if needed for caching
        queryFn: () => journalApi.getEntries({ startDate, endDate }),
    });
}

export function useSaveJournalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateJournalInput) => journalApi.saveEntry(data),
        onSuccess: (savedEntry) => {
            // Invalidate list
            queryClient.invalidateQueries({ queryKey: JOURNAL_KEYS.list() });

            // Update specific date cache
            const date = savedEntry.entryDate.split('T')[0];
            queryClient.setQueryData(JOURNAL_KEYS.detail(date), savedEntry);
        },
    });
}

export function useDeleteJournalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (date: string) => journalApi.deleteEntry(date),
        onSuccess: (_, date) => {
            // Invalidate list
            queryClient.invalidateQueries({ queryKey: JOURNAL_KEYS.list() });

            // Remove from specific date cache
            queryClient.removeQueries({ queryKey: JOURNAL_KEYS.detail(date) });
        },
    });
}

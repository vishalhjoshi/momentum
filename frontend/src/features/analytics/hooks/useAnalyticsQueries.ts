
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';

export const ANALYTICS_KEYS = {
    all: ['analytics'] as const,
    summary: () => [...ANALYTICS_KEYS.all, 'summary'] as const,
};

export function useAnalyticsQuery() {
    return useQuery({
        queryKey: ANALYTICS_KEYS.summary(),
        queryFn: analyticsApi.getSummary,
        staleTime: 1000 * 60 * 5, // 5 minutes (analytics don't change instantly)
    });
}

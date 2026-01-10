
import { apiRequest } from '@/lib/api/client';
import { AnalyticsSummary } from '@/features/analytics/types';

export const analyticsApi = {
    getSummary: async (): Promise<AnalyticsSummary> => {
        return apiRequest<AnalyticsSummary>('/analytics/summary', {
            method: 'GET',
        });
    },
};

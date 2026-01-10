
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { LoginCredentials, SignUpCredentials } from '@/features/auth/types';

export const AUTH_KEYS = {
    all: ['auth'] as const,
    user: () => [...AUTH_KEYS.all, 'user'] as const,
};

export function useUserQuery() {
    return useQuery({
        queryKey: AUTH_KEYS.user(),
        queryFn: authApi.me,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!localStorage.getItem('token'),
    });
}

export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            const withRefresh = data as { token: string; user: unknown; refreshToken?: string };
            if (withRefresh.refreshToken) {
                localStorage.setItem('refreshToken', withRefresh.refreshToken);
            }
            queryClient.setQueryData(AUTH_KEYS.user(), data.user);
        },
    });
}

export function useSignUpMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: SignUpCredentials) => authApi.signUp(credentials),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            const withRefresh = data as { token: string; user: unknown; refreshToken?: string };
            if (withRefresh.refreshToken) {
                localStorage.setItem('refreshToken', withRefresh.refreshToken);
            }
            queryClient.setQueryData(AUTH_KEYS.user(), data.user);
        },
    });
}

export function useLogoutMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSettled: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            // CRITICAL: Clear all queries to prevent data leakage between users
            queryClient.clear();
        },
    });
}

export function useUpdatePreferencesMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (prefs: Partial<any>) => authApi.updatePreferences(prefs),
        onSuccess: (updatedUser) => {
            // Optimistically update the cache with the new user data
            // This ensures all components listening to 'auth', 'user' get the update immediately
            queryClient.setQueryData(AUTH_KEYS.user(), updatedUser);
        },
    });
}

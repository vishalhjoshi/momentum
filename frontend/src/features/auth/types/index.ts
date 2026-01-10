
import { z } from 'zod';

export interface User {
    id: string;
    email: string;
    name?: string | null;
    avatarUrl?: string;
    soundEnabled?: boolean;
    hapticEnabled?: boolean;
    notificationsEnabled?: boolean;
    darkModeEnabled?: boolean;
    insightsEnabled?: boolean;
    dailyReminderTime?: string;
    eveningCheckInTime?: string;
}

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});


export const signUpSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type SignUpCredentials = z.infer<typeof signUpSchema>;
export type ForgotPasswordCredentials = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;

export interface AuthResponse {
    user: User;
    token: string;
}

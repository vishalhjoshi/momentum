import { apiRequest } from './client'
import { LoginCredentials, SignUpCredentials, AuthResponse } from '@/features/auth/types'

export const authApi = {
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    // Backend only accepts email and password, not name
    const response = await apiRequest<{
      user: { id: string; email: string; name?: string }
      token: string
      refreshToken: string
      message: string
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      }),
    })

    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      },
      token: response.token,
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest<{
      user: { id: string; email: string; name?: string }
      token: string
      refreshToken: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    return {
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      },
      token: response.token,
    }
  },

  async logout(): Promise<void> {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    })
  },

  async forgotPassword(email: string): Promise<void> {
    await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  async me(): Promise<{
    id: string;
    email: string;
    name?: string;
    taskStreakDays?: number;
    journalStreakDays?: number;
    timeZone?: string;
    darkModeEnabled?: boolean;
    notificationsEnabled?: boolean;
    soundEnabled?: boolean;
    hapticEnabled?: boolean;
    dailyReminderTime?: string;
    eveningCheckInTime?: string;
  }> {
    const response = await apiRequest<{
      id: string;
      email: string;
      name?: string;
      taskStreakDays?: number;
      journalStreakDays?: number;
      timeZone?: string;
      darkModeEnabled?: boolean;
      notificationsEnabled?: boolean;
      soundEnabled?: boolean;
      hapticEnabled?: boolean;
      dailyReminderTime?: string;
      eveningCheckInTime?: string;
    }>('/user/me', {
      method: 'GET',
    });
    return response;
  },



  async updatePreferences(data: Partial<{
    timeZone: string;
    dailyReminderTime: string;
    eveningCheckInTime: string;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
    hapticEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    darkModeEnabled: boolean;
    insightsEnabled: boolean;
  }>): Promise<unknown> {
    const response = await apiRequest('/user/preferences', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response;
  }
}

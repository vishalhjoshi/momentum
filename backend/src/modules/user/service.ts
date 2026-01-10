
import { prisma } from '@/lib/prisma'
import { AppError } from '@/lib/errors'

export async function getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            taskStreakDays: true,
            journalStreakDays: true,
            timeZone: true,
            darkModeEnabled: true,
            notificationsEnabled: true,
            soundEnabled: true,
            hapticEnabled: true,
            // Add other preference fields as needed
        },
    })

    if (!user) {
        throw new AppError('User not found', 404)
    }

    return user
}


export interface UpdateUserPreferencesData {
    timeZone?: string
    dailyReminderTime?: string
    eveningCheckInTime?: string
    notificationsEnabled?: boolean
    soundEnabled?: boolean
    hapticEnabled?: boolean
    quietHoursStart?: string
    quietHoursEnd?: string
    darkModeEnabled?: boolean
    insightsEnabled?: boolean
}

export async function updateUserPreferences(userId: string, data: UpdateUserPreferencesData) {
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            ...data,
        },
        select: {
            id: true,
            email: true,
            name: true,
            taskStreakDays: true,
            journalStreakDays: true,
            timeZone: true,
            dailyReminderTime: true,
            eveningCheckInTime: true,
            notificationsEnabled: true,
            soundEnabled: true,
            hapticEnabled: true,
            quietHoursStart: true,
            quietHoursEnd: true,
            darkModeEnabled: true,
            insightsEnabled: true,
        }
    })

    return user
}

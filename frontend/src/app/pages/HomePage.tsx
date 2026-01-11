import { TasksPanel } from '@/features/tasks/components/TasksPanel'
import { TodayJournalPanel } from '@/features/journal/components/TodayJournalPanel'
import { GlowingCard } from '@/components/ui/glowing-card'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api/auth'
import { Logo } from '@/components/ui/Logo'

export default function HomePage() {
  const { user } = useAuth();
  
  // Fetch user data to get streak information
  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => authApi.me(),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
  
  const displayName = userData?.name || user?.name || user?.email;
  const taskStreak = userData?.taskStreakDays || 0;
  const journalStreak = userData?.journalStreakDays || 0;
  
  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 flex justify-between items-start">
          <div className="flex-1 mr-4">
            <Logo size="md" className="mb-2" />
            <div className="mt-2 text-text-secondary flex flex-col sm:flex-row sm:items-center sm:gap-2">
               <span className="text-sm">Welcome back,</span>
               <span className="font-medium text-text-primary text-lg sm:text-base break-words line-clamp-1">{displayName}</span>
            </div>
          </div>
        </header>

        {/* Streak Display */}
        {(taskStreak > 0 || journalStreak > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {taskStreak > 0 && (
              <GlowingCard
                title={`${taskStreak} ${taskStreak === 1 ? 'day' : 'days'}`}
                subtitle="Task Streak"
                icon={<span className="text-3xl">🔥</span>}
              />
            )}
            {journalStreak > 0 && (
              <GlowingCard
                title={`${journalStreak} ${journalStreak === 1 ? 'day' : 'days'}`}
                subtitle="Journal Streak"
                icon={<span className="text-3xl">📝</span>}
              />
            )}
          </div>
        )}

        <main className="space-y-6">
          <TasksPanel />

          {/* Journal section */}
          <TodayJournalPanel />
        </main>
      </div>
    </div>
  )
}

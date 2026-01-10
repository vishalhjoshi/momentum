
import { useAnalyticsQuery } from '@/features/analytics/hooks/useAnalyticsQueries';
import { StatCard } from '@/features/analytics/components/StatCard';
import { MoodChart } from '@/features/analytics/components/MoodChart';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalyticsQuery();

  if (isLoading) {
    return <div className="p-8 text-center">Loading stats...</div>;
  }

  if (isError || !data) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
           <div>
              <h1 className="text-3xl font-bold text-text-primary">Your Progress</h1>
              <p className="text-text-secondary">See how far you've come!</p>
           </div>
           <Link to="/">
             <Button variant="secondary">Back to Focus</Button>
           </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Gamification: Streak */}
           <StatCard 
             label="Current Streak" 
             value={`${data.streak} Days`} 
             icon={<span className="text-2xl">🔥</span>}
             color="bg-orange-100 dark:bg-orange-900/30"
           />
           
           {/* Completion Rate */}
           <StatCard 
             label="Completion Rate" 
             value={`${data.completionRate}%`} 
             subtext={`Last 7 days`}
             icon={<span className="text-2xl">✅</span>}
             color="bg-green-100 dark:bg-green-900/30"
           />
           
           {/* Volume */}
           <StatCard 
             label="Tasks Done" 
             value={data.completedTasksLast7Days} 
             subtext={`out of ${data.totalTasksLast7Days} scheduled`}
             icon={<span className="text-2xl">🏆</span>}
             color="bg-blue-100 dark:bg-blue-900/30"
           />

           {/* Placeholder for future */}
           <StatCard 
             label="Focus Time" 
             value="Soon" 
             icon={<span className="text-2xl">⏱️</span>}
             color="bg-purple-100 dark:bg-purple-900/30"
           />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
           <MoodChart data={data.moodTrend} />
        </div>
      </div>
    </div>
  );
}

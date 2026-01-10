
import { Card } from '@/components/ui/Card';
import { AnalyticsSummary } from '../types';

interface MoodChartProps {
  data: AnalyticsSummary['moodTrend'];
}

export function MoodChart({ data }: MoodChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="h-64 flex items-center justify-center text-text-secondary">
        <p>No mood data yet. Start journaling!</p>
      </Card>
    );
  }

  // Determine chart dimensions

  // Normalize data for chart points (Mood 1-4)
  // Max Y = 4.5 to give space
  const maxY = 4.5;

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-text-primary">Mood Trend (Last 7 Days)</h3>
      <div className="h-48 flex items-end justify-between px-2 gap-2">
        {data.map((point, index) => {
          // Height based on moodScore (1 to 4)
          // 1/4.5 * 100%
          const barHeight = (point.moodScore / maxY) * 100;
          
          let colorClass = 'bg-gray-300 dark:bg-gray-700'; // Default
          if (point.moodScore >= 3.5) colorClass = 'bg-green-400'; // Great
          else if (point.moodScore >= 2.5) colorClass = 'bg-blue-400'; // Good
          else if (point.moodScore >= 1.5) colorClass = 'bg-yellow-400'; // Okay
          else if (point.moodScore > 0) colorClass = 'bg-red-400'; // Rough

          return (
            <div key={index} className="flex flex-col items-center justify-end h-full w-full group relative">
               {/* Tooltip */}
               <div className="absolute -top-10 bg-black text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                   {point.moodLabel} (Energy: {point.energy})
               </div>

              <div 
                className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:brightness-110 ${colorClass}`}
                style={{ height: `${barHeight}%` }}
              />
              <span className="text-xs text-text-secondary mt-2">{point.date}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

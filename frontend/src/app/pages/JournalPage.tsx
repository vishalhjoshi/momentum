import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { JournalEditor } from '@/features/journal/components/JournalEditor';
import { FullScreenCalendar } from '@/components/ui/fullscreen-calendar';
import { useJournalEntryQuery, useJournalEntriesQuery } from '@/features/journal/hooks/useJournalQueries';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { startOfMonth, endOfMonth, format, parse } from 'date-fns';
import type { JournalEntry } from '@/features/journal/types';

interface CalendarData {
  day: Date;
  events: Array<{
    id: number;
    name: string;
    time: string;
    datetime: string;
  }>;
}

export default function JournalPage() {
  const navigate = useNavigate();
  // State for selected date. Default to today (local time).
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [currentMonth] = useState(format(new Date(), 'MMM-yyyy'));
  
  const { data: entry, isLoading } = useJournalEntryQuery(selectedDate);

  // Calculate date range for current month
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const monthStart = startOfMonth(firstDayCurrentMonth);
  const monthEnd = endOfMonth(firstDayCurrentMonth);

  // Fetch entries for the current month
  const { data: entries = [] } = useJournalEntriesQuery(
    format(monthStart, 'yyyy-MM-dd'),
    format(monthEnd, 'yyyy-MM-dd')
  );

  // Transform journal entries to calendar data format
  const calendarData: CalendarData[] = useMemo(() => {
    return entries.map((entry: JournalEntry) => {
      const entryDate = new Date(entry.entryDate);
      const moodEmoji = entry.mood === 'GREAT' ? '😊' : entry.mood === 'GOOD' ? '🙂' : entry.mood === 'OKAY' ? '😐' : '😔';
      
      return {
        day: entryDate,
        events: [
          {
            id: parseInt(entry.id) || Date.now(),
            name: `Journal Entry ${moodEmoji}`,
            time: format(new Date(entry.createdAt), 'h:mm a'),
            datetime: entry.entryDate,
          },
        ],
      };
    });
  }, [entries]);

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'));
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-[100dvh]">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ChevronLeft size={24} />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Journal</h1>
            <p className="text-sm text-muted-foreground">Reflect on your journey</p>
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Calendar Section */}
          <div className="flex-1 overflow-auto">
            <FullScreenCalendar 
              data={calendarData}
              selectedDate={new Date(selectedDate)}
              onDateSelect={handleDateSelect}
              showNewEventButton={false}
            />
          </div>

          {/* Editor Section */}
          <div className="w-full md:w-96 lg:w-[500px] h-[50%] md:h-auto border-t md:border-t-0 md:border-l overflow-auto pb-24">
            <div className="p-4">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    {isToday ? "Today's Entry" : `Entry for ${selectedDate}`}
                  </h2>
                  {!isToday && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
                    >
                      Back to Today
                    </Button>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded w-1/3" />
                    <div className="h-40 bg-muted rounded" />
                  </div>
                ) : (
                  <JournalEditor 
                    key={selectedDate} // Force re-mount when date changes to reset state
                    date={selectedDate}
                    initialContent={entry?.content} 
                    initialMood={entry?.mood}
                    initialEnergy={entry?.energy}
                  />
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

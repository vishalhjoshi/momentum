import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { useJournalEntryQuery } from '../hooks/useJournalQueries';
import { JournalEditor } from './JournalEditor';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function TodayJournalPanel() {
  const navigate = useNavigate();
  // Initialize with current date (Local Time)
  const [today, setToday] = useState(() => format(new Date(), 'yyyy-MM-dd'));

  // Effect to keep 'today' updated (e.g. crossing midnight)
  useEffect(() => {
    const checkDate = () => {
      const current = format(new Date(), 'yyyy-MM-dd');
      if (current !== today) {
        setToday(current);
      }
    };
    
    // Check every minute
    const timer = setInterval(checkDate, 60000);
    
    // Also check when window regains focus
    const onFocus = () => checkDate();
    window.addEventListener('focus', onFocus);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [today]);

  const { data: entry, isLoading } = useJournalEntryQuery(today);

  // If loading, show skeleton. 
  // In our hook we set retry: false.
  // We can treat 404 as "New Entry" state.
  
  if (isLoading) {
      return (
          <Card>
              <div className="h-64 animate-pulse bg-surface-hover rounded-lg" />
          </Card>
      );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Daily Journal</h2>
        <Button variant="ghost" className="text-sm px-2 py-1" onClick={() => navigate('/journal')}>
          View History
        </Button>
      </div>
      <JournalEditor 
        key={today} // Critical: Force re-mount and state reset when date changes
        date={today}
        initialContent={entry?.content} 
        initialMood={entry?.mood}
        initialEnergy={entry?.energy}
      />
    </Card>
  );
}

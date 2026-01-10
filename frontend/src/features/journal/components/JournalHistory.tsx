import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useJournalEntriesQuery } from '../hooks/useJournalQueries';

interface JournalHistoryProps {
  currentDate: string;
  onDateSelect: (date: string) => void;
}

export function JournalHistory({ currentDate, onDateSelect }: JournalHistoryProps) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fetch entries for this month
  const { data: entries = [] } = useJournalEntriesQuery(
    monthStart.toISOString(),
    monthEnd.toISOString()
  );

  const getEntryForDay = (day: Date) => {
    return entries.find(e => isSameDay(new Date(e.entryDate), day));
  };

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  return (
    <div className="bg-surface rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">
          {format(viewDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-surface-hover rounded-md">
            <ChevronLeft size={20} className="text-text-secondary" />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-surface-hover rounded-md">
            <ChevronRight size={20} className="text-text-secondary" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-secondary mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Padding for start of month */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {days.map(day => {
          const entry = getEntryForDay(day);
          const isSelected = isSameDay(day, new Date(currentDate));
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day.toISOString())}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all
                ${isSelected ? 'bg-primary-500 text-white shadow-md scale-105' : 'hover:bg-surface-hover text-text-primary'}
                ${!isSameMonth(day, viewDate) ? 'opacity-30' : ''}
                ${isToday && !isSelected ? 'border border-primary-500 text-primary-500' : ''}
              `}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {entry && (
                 <div className="absolute bottom-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                 </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Journal Entry</span>
        </div>
      </div>
    </div>
  );
}

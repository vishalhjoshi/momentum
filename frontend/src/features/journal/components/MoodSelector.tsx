

import { Mood } from '../types';

interface MoodSelectorProps {
  value?: Mood | null;
  onChange: (mood: Mood) => void;
  disabled?: boolean;
}

const MOODS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'ROUGH', label: 'Rough', emoji: '🌧️', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' },
  { value: 'OKAY', label: 'Okay', emoji: '☁️', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700' },
  { value: 'GOOD', label: 'Good', emoji: '🌤️', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  { value: 'GREAT', label: 'Great', emoji: '☀️', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
];

export function MoodSelector({ value, onChange, disabled }: MoodSelectorProps) {
  return (
    <div className="flex gap-2">
      {MOODS.map((mood) => {
        const isSelected = value === mood.value;
        return (
          <button
            key={mood.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(mood.value)}
            className={`
              flex-1 py-2 px-1 rounded-lg border transition-all text-sm font-medium flex flex-col items-center gap-1
              ${isSelected 
                ? `${mood.color} ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-background` 
                : 'bg-surface border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-lg">{mood.emoji}</span>
            <span className="hidden sm:inline">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}

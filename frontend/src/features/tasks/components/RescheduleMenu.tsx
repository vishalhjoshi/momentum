import { useState, useRef, useEffect } from 'react';
import { TaskDeadline } from '../types';

interface RescheduleMenuProps {
  currentDeadline: TaskDeadline;
  onReschedule: (deadline: TaskDeadline) => void;
  children: React.ReactNode;
}

const deadlineLabels: Record<TaskDeadline, string> = {
  TODAY: 'Today',
  TOMORROW: 'Tomorrow',
  SOMEDAY: 'Someday',
};

export function RescheduleMenu({ currentDeadline, onReschedule, children }: RescheduleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options: TaskDeadline[] = ['TODAY', 'TOMORROW', 'SOMEDAY'];
  const availableOptions = options.filter(opt => opt !== currentDeadline);

  if (availableOptions.length === 0) return null;

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-surface border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {availableOptions.map((option) => (
              <button
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  onReschedule(option);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Move to {deadlineLabels[option]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}




import { useState } from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/Button';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  emptyMessage?: string;
  showProgressiveDisclosure?: boolean;
}

const MAX_VISIBLE_TASKS = 7;

export function TaskList({ 
  tasks, 
  isLoading, 
  emptyMessage = "No tasks yet.",
  showProgressiveDisclosure = false 
}: TaskListProps) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    if (emptyMessage) {
      return (
        <div className="text-center py-8 text-text-secondary">
          {emptyMessage}
        </div>
      );
    }
    return null;
  }

  const visibleTasks = showProgressiveDisclosure && !showAll 
    ? tasks.slice(0, MAX_VISIBLE_TASKS)
    : tasks;

  const hasMore = showProgressiveDisclosure && tasks.length > MAX_VISIBLE_TASKS;

  return (
    <div className="space-y-2">
      {visibleTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
      {hasMore && !showAll && (
        <div className="pt-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowAll(true)}
            className="w-full text-text-secondary text-sm"
          >
            Show {tasks.length - MAX_VISIBLE_TASKS} more tasks
          </Button>
        </div>
      )}
      {hasMore && showAll && (
        <div className="pt-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowAll(false)}
            className="w-full text-text-secondary text-sm"
          >
            Show less
          </Button>
        </div>
      )}
    </div>
  );
}


import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTasksQuery } from '../hooks/useTaskQueries';
import { TaskList } from './TaskList';
import { CreateTaskModal } from './CreateTaskModal';

export function TodayTasksPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tasks = [], isLoading } = useTasksQuery({ deadline: 'TODAY' });

  // Client-side sort: Pending first, then Completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === 'PENDING' ? -1 : 1;
  });

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Today's Focus</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            + Add Task
          </Button>
        </div>

        <TaskList 
          tasks={sortedTasks} 
          isLoading={isLoading} 
          emptyMessage="No tasks scheduled for today. Enjoy the calm!" 
        />
      </Card>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}

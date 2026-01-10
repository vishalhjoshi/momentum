import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTasksQuery } from '../hooks/useTaskQueries';
import { TaskList } from './TaskList';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDeadline } from '../types';

export function TasksPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TaskDeadline>('TODAY');

  const { data: tasks = [], isLoading } = useTasksQuery({ deadline: activeTab });

  // Separate pending and completed tasks
  const pendingTasks = tasks.filter(task => task.status === 'PENDING');
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');

  // Get today's date for filtering completed tasks
  const today = new Date().toISOString().split('T')[0];
  const completedToday = completedTasks.filter(task => {
    if (!task.completedAt) return false;
    const completedDate = new Date(task.completedAt).toISOString().split('T')[0];
    return completedDate === today;
  });

  const tabs: { label: string; value: TaskDeadline }[] = [
    { label: 'Today', value: 'TODAY' },
    { label: 'Tomorrow', value: 'TOMORROW' },
    { label: 'Someday', value: 'SOMEDAY' },
  ];

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Tasks</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            + Add Task
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.value
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending Tasks Section */}
        {pendingTasks.length > 0 && (
          <div className="mb-6">
            <TaskList 
              tasks={pendingTasks} 
              isLoading={isLoading} 
              emptyMessage="" 
              showProgressiveDisclosure={true}
            />
          </div>
        )}

        {/* Completed Today Section (only for TODAY tab) */}
        {activeTab === 'TODAY' && completedToday.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              Completed Today ({completedToday.length})
            </h3>
            <TaskList 
              tasks={completedToday} 
              isLoading={false} 
              emptyMessage=""
              showProgressiveDisclosure={false}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && pendingTasks.length === 0 && completedToday.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            {activeTab === 'TODAY' && "No tasks scheduled for today. Enjoy the calm!"}
            {activeTab === 'TOMORROW' && "No tasks scheduled for tomorrow yet."}
            {activeTab === 'SOMEDAY' && "No tasks in your someday list."}
          </div>
        )}
      </Card>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        defaultDeadline={activeTab}
      />
    </>
  );
}


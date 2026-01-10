

import { useState } from 'react';
import { Task, TaskDeadline } from '../types';
import { useCompleteTaskMutation, useDeleteTaskMutation, useRescheduleTaskMutation } from '../hooks/useTaskQueries';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/features/auth/context/AuthContext';
import { EditTaskModal } from './EditTaskModal';
import { RescheduleMenu } from './RescheduleMenu';
import { SubtaskForm } from './SubtaskForm';
import confetti from 'canvas-confetti';

interface TaskItemProps {
  task: Task;
  isSubtask?: boolean;
}

export function TaskItem({ task, isSubtask = false }: TaskItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  
  const { mutate: completeTask } = useCompleteTaskMutation();
  const { mutate: deleteTask } = useDeleteTaskMutation();
  const { mutate: rescheduleTask } = useRescheduleTaskMutation();
  const { addToast } = useToast();
  const { user } = useAuth();

  // Only show subtasks for parent tasks (not subtasks themselves)
  const isParentTask = !isSubtask && !task.parentTaskId;
  const subtasks = task.subtasks || [];
  const hasSubtasks = subtasks.length > 0;
  const incompleteSubtasks = subtasks.filter(st => st.status !== 'COMPLETED');
  const hasIncompleteSubtasks = incompleteSubtasks.length > 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      addToast('Task deleted', 'info');
    }
  };

  const playSuccessSound = async () => {
    try {
      console.log('Attempting to play success sound...');
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
          console.error('Web Audio API not supported');
          return;
      }
      
      const audioContext = new AudioContextClass();
      
      // Resume context if suspended (browser policy)
      if (audioContext.state === 'suspended') {
        console.log('Resuming suspended AudioContext...');
        await audioContext.resume();
      }

      console.log('AudioContext state:', audioContext.state);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1); // A5
      
      // Increased volume from 0.1 to 0.3 for better audibility
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
      console.log('Sound scheduled');
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.status === 'COMPLETED') {
      addToast('Task already completed!', 'info');
      return;
    }
    
    // Celebration Effects
    // 1. Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // 2. Sound (if enabled)
    console.log('User Settings - Sound:', user?.soundEnabled, 'Haptics:', user?.hapticEnabled);
    if (user?.soundEnabled) {
      playSuccessSound();
    }

    // 3. Haptics (if enabled)
    if (user?.hapticEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }

    completeTask(task.id);
    addToast('Task completed! 🎉', 'success');
  };

  const handleReschedule = (newDeadline: TaskDeadline) => {
    rescheduleTask({ id: task.id, deadline: newDeadline });
    const deadlineLabels: Record<TaskDeadline, string> = {
      TODAY: 'today',
      TOMORROW: 'tomorrow',
      SOMEDAY: 'someday',
    };
    addToast(`Task moved to ${deadlineLabels[newDeadline]}`, 'success');
  };

  return (
    <>
      <div className={isSubtask ? 'pl-8 mt-1' : ''}>
        <div 
          className={`group flex items-center justify-between p-3 bg-surface rounded-lg border transition-colors ${
            isSubtask 
              ? 'border-gray-100 dark:border-gray-800' 
              : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
          } ${hasIncompleteSubtasks && !isSubtask ? 'border-primary-300 dark:border-primary-700' : ''}`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={handleToggle}
              className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                task.status === 'COMPLETED'
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
              }`}
              aria-label={task.status === 'COMPLETED' ? 'Mark as pending' : 'Mark as completed'}
            >
              {task.status === 'COMPLETED' && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 min-w-0 text-left"
            >
              <span className={`${task.status === 'COMPLETED' ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                {task.title}
              </span>
              {hasIncompleteSubtasks && !isSubtask && (
                <span className="ml-2 text-xs text-primary-500" title={`${incompleteSubtasks.length} incomplete step${incompleteSubtasks.length > 1 ? 's' : ''}`}>
                  ({incompleteSubtasks.length})
                </span>
              )}
            </button>
          </div>
          
          <div className={`flex items-center gap-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            {/* Reschedule Button - only for parent tasks */}
            {task.status === 'PENDING' && !isSubtask && (
              <RescheduleMenu
                currentDeadline={task.deadline}
                onReschedule={handleReschedule}
              >
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-text-secondary hover:text-primary-500 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Reschedule task"
                  title="Move to another deadline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </RescheduleMenu>
            )}

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              className="text-text-secondary hover:text-primary-500 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Edit task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button 
              onClick={handleDelete}
              className="text-text-secondary hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Delete task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Subtasks section - only for parent tasks */}
        {isParentTask && (
          <div className="mt-2">
            {/* Toggle subtasks visibility */}
            {(hasSubtasks || showSubtaskForm) && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-xs text-text-secondary hover:text-primary-500 flex items-center gap-1 px-3 py-1"
              >
                <svg 
                  className={`w-3 h-3 transition-transform ${showSubtasks ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {hasSubtasks ? `${subtasks.length} step${subtasks.length > 1 ? 's' : ''}` : 'Steps'}
              </button>
            )}

            {/* Subtasks list */}
            {showSubtasks && hasSubtasks && (
              <div className="mt-1 space-y-1">
                {subtasks.map((subtask) => (
                  <TaskItem key={subtask.id} task={subtask} isSubtask={true} />
                ))}
              </div>
            )}

            {/* Add steps button */}
            {!showSubtaskForm && (
              <button
                onClick={() => {
                  setShowSubtaskForm(true);
                  setShowSubtasks(true);
                }}
                className="text-xs text-text-secondary hover:text-primary-500 flex items-center gap-1 px-3 py-1 mt-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add steps
              </button>
            )}

            {/* Subtask creation form */}
            {showSubtaskForm && (
              <SubtaskForm
                parentTaskId={task.id}
                onSuccess={() => {
                  setShowSubtaskForm(false);
                }}
                onCancel={() => {
                  setShowSubtaskForm(false);
                  if (!hasSubtasks) {
                    setShowSubtasks(false);
                  }
                }}
              />
            )}
          </div>
        )}
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={task}
      />
    </>
  );
}

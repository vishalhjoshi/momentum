import React, { useState, useEffect } from 'react';
import { useUpdateTaskMutation } from '@/features/tasks/hooks/useTaskQueries';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { Task, UpdateTaskInput } from '../types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { mutateAsync: updateTask, isPending } = useUpdateTaskMutation();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState<UpdateTaskInput>({
    title: task?.title || '',
    description: task?.description || '',
    deadline: task?.deadline,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        deadline: task.deadline,
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      await updateTask({ id: task.id, data: formData });
      addToast('Task updated', 'success');
      onClose();
    } catch (error) {
      addToast('Failed to update task', 'error');
    }
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs to be done?"
          required
        />
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-primary">Description</label>
          <textarea
            className="w-full px-3 py-2 bg-surface text-text-primary border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add details..."
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-primary">Deadline</label>
          <select
            className="w-full px-3 py-2 bg-surface text-text-primary border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value as any })}
          >
            <option value="TODAY">Today</option>
            <option value="TOMORROW">Tomorrow</option>
            <option value="SOMEDAY">Someday</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}


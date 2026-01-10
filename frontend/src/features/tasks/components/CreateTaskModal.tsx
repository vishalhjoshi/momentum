
import React, { useState } from 'react';
import { useCreateTaskMutation } from '@/features/tasks/hooks/useTaskQueries';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { CreateTaskInput, TaskDeadline } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDeadline?: TaskDeadline;
}

export function CreateTaskModal({ isOpen, onClose, defaultDeadline = 'TODAY' }: CreateTaskModalProps) {
  const { mutateAsync: createTask, isPending } = useCreateTaskMutation();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    deadline: defaultDeadline,
    status: 'PENDING',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(formData);
      addToast('Task created', 'success');
      setFormData({
          title: '',
          description: '',
          deadline: 'TODAY',
          status: 'PENDING'
      });
      onClose();
    } catch (error) {
      addToast('Failed to create task', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="What needs to be done?"
          required
        />
        
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
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}


import { useState } from 'react';
import { useCreateTaskMutation } from '../hooks/useTaskQueries';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/ToastProvider';

interface SubtaskFormProps {
  parentTaskId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SubtaskForm({ parentTaskId, onSuccess, onCancel }: SubtaskFormProps) {
  const { mutateAsync: createTask, isPending } = useCreateTaskMutation();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title: title.trim(),
        parentTaskId,
        deadline: 'TODAY', // Subtasks inherit parent's deadline context
        status: 'PENDING',
      });
      addToast('Step added', 'success');
      setTitle('');
      onSuccess?.();
    } catch (error) {
      addToast('Failed to add step', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 pl-8">
      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a step..."
          className="flex-1 text-sm"
          autoFocus
          onBlur={() => {
            // Only cancel if input is empty and user clicked outside
            if (!title.trim() && onCancel) {
              onCancel();
            }
          }}
        />
        <Button
          type="submit"
          className="text-sm px-3 py-1.5"
          isLoading={isPending}
          disabled={!title.trim()}
        >
          Add
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="text-sm px-3 py-1.5"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}


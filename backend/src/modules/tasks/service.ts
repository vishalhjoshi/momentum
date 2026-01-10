
import { prisma } from '@/lib/prisma';
import { CreateTaskInput, TaskQueryInput, UpdateTaskInput } from './schemas';
import { AppError } from '@/lib/errors';
import { updateTaskStreak } from '@/lib/streaks';

export async function createTask(userId: string, input: CreateTaskInput) {
  const task = await prisma.task.create({
    data: {
      ...input,
      userId,
    },
  });
  return task;
}

export async function getTasks(userId: string, query: TaskQueryInput) {
  const where: Record<string, unknown> = {
    userId,
    deletedAt: null,
    parentTaskId: null, // Only fetch top-level tasks by default
  };

  if (query.status) {
    where.status = query.status;
  }

  if (query.deadline) {
    where.deadline = query.deadline;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      subtasks: {
        where: {
          deletedAt: null,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return tasks;
}

export async function getTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
      deletedAt: null,
    },
    include: {
      subtasks: {
        where: {
          deletedAt: null,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return task;
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  // Ensure task exists and belongs to user
  await getTask(userId, taskId);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: input,
  });

  return task;
}

export async function deleteTask(userId: string, taskId: string) {
  // Ensure task exists and belongs to user
  const task = await getTask(userId, taskId);

  // If this is a parent task, also soft-delete all subtasks
  if (task.subtasks && task.subtasks.length > 0) {
    await prisma.task.updateMany({
      where: {
        id: { in: task.subtasks.map((st: { id: string }) => st.id) },
        userId,
      },
      data: { deletedAt: new Date() },
    });
  }

  // Soft-delete the task itself
  await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
  });
}

/**
 * Complete a task and update user streak
 * If it's a subtask, check if all subtasks are done and auto-complete parent
 * If it's a parent task, complete all incomplete subtasks first
 */
export async function completeTask(userId: string, taskId: string) {
  // Ensure task exists and belongs to user
  const task = await getTask(userId, taskId);

  // If already completed, return it
  if (task.status === 'COMPLETED') {
    return task;
  }

  // If this is a parent task with incomplete subtasks, complete all subtasks first
  if (task.subtasks && task.subtasks.length > 0) {
    const incompleteSubtasks = task.subtasks.filter((st: { status: string }) => st.status !== 'COMPLETED');
    if (incompleteSubtasks.length > 0) {
      // Complete all incomplete subtasks
      await prisma.task.updateMany({
        where: {
          id: { in: incompleteSubtasks.map((st: { id: string }) => st.id) },
          userId,
        },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    }
  }

  // Update task to completed
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
    include: {
      subtasks: {
        where: {
          deletedAt: null,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  // If this is a subtask, check if all sibling subtasks are completed
  if (task.parentTaskId) {
    const parentTask = await prisma.task.findFirst({
      where: {
        id: task.parentTaskId,
        userId,
        deletedAt: null,
      },
      include: {
        subtasks: {
          where: {
            deletedAt: null,
          },
        },
      },
    });

    if (parentTask && parentTask.subtasks.length > 0) {
      const allSubtasksCompleted = parentTask.subtasks.every((st: { status: string }) => st.status === 'COMPLETED');
      if (allSubtasksCompleted && parentTask.status !== 'COMPLETED') {
        // Auto-complete parent task
        await prisma.task.update({
          where: { id: parentTask.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });
      }
    }
  }

  // Update user streak
  try {
    await updateTaskStreak(userId);
  } catch (error) {
    // Log error but don't fail the task completion
    console.error('Failed to update task streak:', error);
  }

  return updatedTask;
}

/**
 * Reschedule a task to a different deadline
 */
export async function rescheduleTask(
  userId: string,
  taskId: string,
  newDeadline: 'TODAY' | 'TOMORROW' | 'SOMEDAY'
) {
  // Ensure task exists and belongs to user
  await getTask(userId, taskId);

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      deadline: newDeadline,
    },
  });

  return updatedTask;
}

import { db } from './db'
import type { Task } from '@/types/models'

export async function createTask(data: Omit<Task, 'id' | 'order' | 'status' | 'completedAt' | 'createdAt' | 'updatedAt'>) {
  const count = await db.tasks.count()
  const now = Date.now()
  const task: Task = {
    ...data,
    id: crypto.randomUUID(),
    status: 'not_started',
    order: count,
    createdAt: now,
    updatedAt: now,
  }
  await db.tasks.add(task)
  return task
}

export async function updateTask(id: string, changes: Partial<Task>) {
  await db.tasks.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteTask(id: string) {
  await db.tasks.delete(id)
  await db.sessions.where('taskId').equals(id).delete()
}

export async function setTaskStatus(id: string, status: Task['status']) {
  await db.tasks.update(id, {
    status,
    completedAt: status === 'completed' ? Date.now() : undefined,
    updatedAt: Date.now(),
  })
}

export async function reorderTasks(orderedIds: string[]) {
  await db.transaction('rw', db.tasks, async () => {
    await Promise.all(orderedIds.map((id, i) => db.tasks.update(id, { order: i })))
  })
}
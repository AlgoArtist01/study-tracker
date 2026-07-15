import { db } from './db'
import type { Topic } from '@/types/models'

export async function createTopic(data: Omit<Topic, 'id' | 'order' | 'actualHours' | 'progress' | 'createdAt' | 'updatedAt'>) {
  const count = await db.topics.where('categoryId').equals(data.categoryId).count()
  const now = Date.now()
  const topic: Topic = {
    ...data,
    id: crypto.randomUUID(),
    actualHours: 0,
    progress: 0,
    order: count,
    createdAt: now,
    updatedAt: now,
  }
  await db.topics.add(topic)
  return topic
}

export async function updateTopic(id: string, changes: Partial<Topic>) {
  await db.topics.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteTopic(id: string) {
  await db.topics.delete(id)
  await db.tasks.where('topicId').equals(id).delete()
  await db.sessions.where('topicId').equals(id).delete()
}

export async function reorderTopics(orderedIds: string[]) {
  await db.transaction('rw', db.topics, async () => {
    await Promise.all(orderedIds.map((id, i) => db.topics.update(id, { order: i })))
  })
}
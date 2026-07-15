import { db } from './db'
import type { StudySession } from '@/types/models'

export async function createSession(data: Omit<StudySession, 'id' | 'createdAt'>) {
  const session: StudySession = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  await db.sessions.add(session)

  if (data.topicId) {
    const topic = await db.topics.get(data.topicId)
    if (topic) {
      await db.topics.update(data.topicId, {
        actualHours: Math.round((topic.actualHours + data.duration / 60) * 100) / 100,
        updatedAt: Date.now(),
      })
    }
  }
  return session
}

export async function deleteSession(id: string) {
  const session = await db.sessions.get(id)
  if (!session) return
  await db.sessions.delete(id)
  if (session.topicId) {
    const topic = await db.topics.get(session.topicId)
    if (topic) {
      await db.topics.update(session.topicId, {
        actualHours: Math.max(0, Math.round((topic.actualHours - session.duration / 60) * 100) / 100),
        updatedAt: Date.now(),
      })
    }
  }
}
import Dexie, { type EntityTable } from 'dexie'
import type { Category, Topic, Task, StudySession, AppSettings } from '@/types/models'

class StudyTrackerDB extends Dexie {
  categories!: EntityTable<Category, 'id'>
  topics!: EntityTable<Topic, 'id'>
  tasks!: EntityTable<Task, 'id'>
  sessions!: EntityTable<StudySession, 'id'>
  settings!: EntityTable<AppSettings, 'id'>

  constructor() {
    super('StudyTrackerDB')
    this.version(1).stores({
      categories: 'id, order, name',
      topics: 'id, categoryId, order, status, targetDate',
      tasks: 'id, categoryId, topicId, status, priority, dueDate, startDate, order',
      sessions: 'id, taskId, categoryId, topicId, startTime',
      settings: 'id',
    })
  }
}

export const db = new StudyTrackerDB()
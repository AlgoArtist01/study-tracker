export type Priority = 'low' | 'medium' | 'high'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type TopicStatus = 'not_started' | 'in_progress' | 'completed'
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped'

export interface Resource {
  label: string
  url: string
}

export interface RecurrenceRule {
  freq: 'daily' | 'weekly' | 'monthly'
  interval: number
  endDate?: number
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  description?: string
  order: number
  createdAt: number
  updatedAt: number
}

export interface Topic {
  id: string
  categoryId: string
  name: string
  notes?: string
  priority: Priority
  difficulty: Difficulty
  estimatedHours: number
  actualHours: number
  progress: number
  tags: string[]
  resources: Resource[]
  status: TopicStatus
  targetDate?: number
  order: number
  createdAt: number
  updatedAt: number
}

export interface Task {
  id: string
  categoryId: string
  topicId?: string
  title: string
  description?: string
  duration?: number
  priority: Priority
  dueDate?: number
  startDate?: number
  status: TaskStatus
  tags: string[]
  order: number
  recurrence?: RecurrenceRule
  completedAt?: number
  createdAt: number
  updatedAt: number
}

export interface StudySession {
  id: string
  taskId?: string
  categoryId?: string
  topicId?: string
  startTime: number
  endTime: number
  duration: number
  notes?: string
  source: 'timer' | 'pomodoro' | 'manual'
  createdAt: number
}

export interface AppSettings {
  id: 'settings'
  theme: 'dark' | 'light' | 'system'
  pomodoroWorkMinutes: number
  pomodoroBreakMinutes: number
  pomodoroLongBreakMinutes: number
  weekStartsOn: 0 | 1
}
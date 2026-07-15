import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns'

export function dayRange(date = new Date()) {
  return { start: startOfDay(date).getTime(), end: endOfDay(date).getTime() }
}

export function weekRange(date = new Date(), weekStartsOn: 0 | 1 = 1) {
  return { start: startOfWeek(date, { weekStartsOn }).getTime(), end: endOfWeek(date, { weekStartsOn }).getTime() }
}

export function monthRange(date = new Date()) {
  return { start: startOfMonth(date).getTime(), end: endOfMonth(date).getTime() }
}

export function calculateStreak(completedTimestamps: number[]): number {
  if (completedTimestamps.length === 0) return 0
  const daySet = new Set(completedTimestamps.map((t) => startOfDay(new Date(t)).getTime()))
  const today = startOfDay(new Date()).getTime()
  let cursor = startOfDay(daySet.has(today) ? new Date() : subDays(new Date(), 1))
  let streak = 0
  while (daySet.has(cursor.getTime())) {
    streak++
    cursor = startOfDay(subDays(cursor, 1))
  }
  return streak
}
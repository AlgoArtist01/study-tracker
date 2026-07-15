import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import {
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  subDays, subWeeks, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, format,
} from 'date-fns'

export type HoursGranularity = 'day' | 'week' | 'month'

export function useStudyHours(granularity: HoursGranularity) {
  return useLiveQuery(async () => {
    const sessions = await db.sessions.toArray()
    const now = new Date()

    if (granularity === 'day') {
      const days = eachDayOfInterval({ start: subDays(now, 13), end: now })
      return days.map((d) => {
        const start = startOfDay(d).getTime()
        const end = endOfDay(d).getTime()
        const minutes = sessions.filter((s) => s.startTime >= start && s.startTime <= end).reduce((sum, s) => sum + s.duration, 0)
        return { label: format(d, 'MMM d'), hours: Math.round((minutes / 60) * 100) / 100 }
      })
    }

    if (granularity === 'week') {
      const weeks = eachWeekOfInterval({ start: subWeeks(now, 7), end: now }, { weekStartsOn: 1 })
      return weeks.map((w) => {
        const start = startOfWeek(w, { weekStartsOn: 1 }).getTime()
        const end = endOfWeek(w, { weekStartsOn: 1 }).getTime()
        const minutes = sessions.filter((s) => s.startTime >= start && s.startTime <= end).reduce((sum, s) => sum + s.duration, 0)
        return { label: format(w, 'MMM d'), hours: Math.round((minutes / 60) * 100) / 100 }
      })
    }

    const months = eachMonthOfInterval({ start: subMonths(now, 5), end: now })
    return months.map((m) => {
      const start = startOfMonth(m).getTime()
      const end = endOfMonth(m).getTime()
      const minutes = sessions.filter((s) => s.startTime >= start && s.startTime <= end).reduce((sum, s) => sum + s.duration, 0)
      return { label: format(m, 'MMM yyyy'), hours: Math.round((minutes / 60) * 100) / 100 }
    })
  }, [granularity])
}

export function useCategoryProgress() {
  return useLiveQuery(async () => {
    const categories = await db.categories.orderBy('order').toArray()
    const tasks = await db.tasks.toArray()
    return categories.map((c) => {
      const catTasks = tasks.filter((t) => t.categoryId === c.id)
      const completed = catTasks.filter((t) => t.status === 'completed').length
      const progress = catTasks.length === 0 ? 0 : Math.round((completed / catTasks.length) * 100)
      return { name: c.name, color: c.color, progress, total: catTasks.length, completed }
    })
  }, [])
}

export function useCompletionTrend(days = 30) {
  return useLiveQuery(async () => {
    const tasks = await db.tasks.toArray()
    const range = eachDayOfInterval({ start: subDays(new Date(), days - 1), end: new Date() })
    let cumulative = 0
    return range.map((d) => {
      const start = startOfDay(d).getTime()
      const end = endOfDay(d).getTime()
      const completedThatDay = tasks.filter((t) => t.completedAt && t.completedAt >= start && t.completedAt <= end).length
      cumulative += completedThatDay
      return { label: format(d, 'MMM d'), completed: completedThatDay, cumulative }
    })
  }, [days])
}

export function useConsistencyHeatmap(weeks = 12) {
  return useLiveQuery(async () => {
    const sessions = await db.sessions.toArray()
    const days = eachDayOfInterval({ start: subDays(new Date(), weeks * 7 - 1), end: new Date() })
    return days.map((d) => {
      const start = startOfDay(d).getTime()
      const end = endOfDay(d).getTime()
      const minutes = sessions.filter((s) => s.startTime >= start && s.startTime <= end).reduce((sum, s) => sum + s.duration, 0)
      return { date: d, minutes }
    })
  }, [weeks])
}

export function useProductivityTrend(days = 14) {
  return useLiveQuery(async () => {
    const sessions = await db.sessions.toArray()
    const range = eachDayOfInterval({ start: subDays(new Date(), days - 1), end: new Date() })
    return range.map((d) => {
      const start = startOfDay(d).getTime()
      const end = endOfDay(d).getTime()
      const daySessions = sessions.filter((s) => s.startTime >= start && s.startTime <= end)
      const avgMinutes = daySessions.length === 0 ? 0 : Math.round(daySessions.reduce((sum, s) => sum + s.duration, 0) / daySessions.length)
      return { label: format(d, 'MMM d'), avgMinutes }
    })
  }, [days])
}
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { dayRange, weekRange, monthRange, calculateStreak } from './utils'

export function useDashboardStats() {
  return useLiveQuery(async () => {
    const today = dayRange()
    const week = weekRange()
    const month = monthRange()

    const allTasks = await db.tasks.toArray()
    const allSessions = await db.sessions.toArray()

    const todayTasks = allTasks.filter(
      (t) => t.status !== 'completed' && t.dueDate && t.dueDate >= today.start && t.dueDate <= today.end
    )
    const overdueTasks = allTasks.filter(
      (t) => t.status !== 'completed' && t.dueDate && t.dueDate < today.start
    )
    const upcomingTasks = allTasks
      .filter((t) => t.status !== 'completed' && t.dueDate && t.dueDate > today.end)
      .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0))
      .slice(0, 5)
    const completedToday = allTasks.filter(
      (t) => t.status === 'completed' && t.completedAt && t.completedAt >= today.start && t.completedAt <= today.end
    )

    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter((t) => t.status === 'completed').length
    const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

    const weekCompleted = allTasks.filter(
      (t) => t.status === 'completed' && t.completedAt && t.completedAt >= week.start && t.completedAt <= week.end
    ).length
    const weekTotal = allTasks.filter((t) => t.dueDate && t.dueDate >= week.start && t.dueDate <= week.end).length
    const weeklyProgress = weekTotal === 0 ? 0 : Math.round((weekCompleted / weekTotal) * 100)

    const monthCompleted = allTasks.filter(
      (t) => t.status === 'completed' && t.completedAt && t.completedAt >= month.start && t.completedAt <= month.end
    ).length
    const monthTotal = allTasks.filter((t) => t.dueDate && t.dueDate >= month.start && t.dueDate <= month.end).length
    const monthlyProgress = monthTotal === 0 ? 0 : Math.round((monthCompleted / monthTotal) * 100)

    const completedTimestamps = allTasks.filter((t) => t.completedAt).map((t) => t.completedAt as number)
    const streak = calculateStreak(completedTimestamps)

    const studyTimeToday = allSessions
      .filter((s) => s.startTime >= today.start && s.startTime <= today.end)
      .reduce((sum, s) => sum + s.duration, 0)
    const studyTimeWeek = allSessions
      .filter((s) => s.startTime >= week.start && s.startTime <= week.end)
      .reduce((sum, s) => sum + s.duration, 0)

    const recentActivity = [...allTasks]
      .filter((t) => t.completedAt)
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
      .slice(0, 8)

    return {
      todayTasks, overdueTasks, upcomingTasks, completedToday,
      overallProgress, weeklyProgress, monthlyProgress, streak,
      studyTimeToday, studyTimeWeek, recentActivity, totalTasks, completedTasks,
    }
  }, [])
}
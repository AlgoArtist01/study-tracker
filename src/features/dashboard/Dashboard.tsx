import { CheckCircle2, Clock, AlertTriangle, Calendar, Flame, TrendingUp, ListChecks, History } from 'lucide-react'
import { useDashboardStats } from './hooks'
import { StatCard } from './StatCard'
import { TaskMiniRow } from './TaskMiniRow'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatMinutes(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h === 0 ? `${m}m` : `${h}h ${m}m`
}

export function Dashboard() {
  const stats = useDashboardStats()

  if (!stats) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Today" value={stats.todayTasks.length} icon={Calendar} accent="text-blue-400" />
        <StatCard label="Overdue" value={stats.overdueTasks.length} icon={AlertTriangle} accent="text-red-400" />
        <StatCard label="Completed today" value={stats.completedToday.length} icon={CheckCircle2} accent="text-green-400" />
        <StatCard label="Current streak" value={`${stats.streak}d`} icon={Flame} accent="text-orange-400" />
        <StatCard label="Study time today" value={formatMinutes(stats.studyTimeToday)} icon={Clock} accent="text-purple-400" />
        <StatCard label="Study time this week" value={formatMinutes(stats.studyTimeWeek)} icon={Clock} accent="text-purple-400" />
        <StatCard label="Overall progress" value={`${stats.overallProgress}%`} icon={TrendingUp} accent="text-cyan-400" />
        <StatCard label="Tasks done" value={`${stats.completedTasks}/${stats.totalTasks}`} icon={ListChecks} accent="text-emerald-400" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Weekly progress</CardTitle></CardHeader>
          <CardContent>
            <Progress value={stats.weeklyProgress} />
            <p className="mt-2 text-sm text-muted-foreground">{stats.weeklyProgress}% of tasks due this week completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly progress</CardTitle></CardHeader>
          <CardContent>
            <Progress value={stats.monthlyProgress} />
            <p className="mt-2 text-sm text-muted-foreground">{stats.monthlyProgress}% of tasks due this month completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Today's tasks</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing due today.</p>
            ) : (
              stats.todayTasks.map((t) => <TaskMiniRow key={t.id} task={t} />)
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Overdue</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.overdueTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing overdue. Good.</p>
            ) : (
              stats.overdueTasks.map((t) => <TaskMiniRow key={t.id} task={t} />)
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Upcoming</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing scheduled ahead.</p>
            ) : (
              stats.upcomingTasks.map((t) => <TaskMiniRow key={t.id} task={t} />)
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" /> Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No completed tasks yet.</p>
          ) : (
            stats.recentActivity.map((t) => <TaskMiniRow key={t.id} task={t} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
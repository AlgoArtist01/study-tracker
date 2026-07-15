import { format, getDay } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useConsistencyHeatmap } from './hooks'
import { cn } from '@/lib/utils'

function intensity(minutes: number) {
  if (minutes === 0) return 'bg-muted'
  if (minutes < 30) return 'bg-emerald-900'
  if (minutes < 60) return 'bg-emerald-700'
  if (minutes < 120) return 'bg-emerald-500'
  return 'bg-emerald-400'
}

export function ConsistencyHeatmap() {
  const days = useConsistencyHeatmap(12)

  if (!days) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Consistency</CardTitle></CardHeader>
        <CardContent><div className="h-32 animate-pulse rounded-md bg-muted" /></CardContent>
      </Card>
    )
  }

  const leadingEmpty = (getDay(days[0].date) + 6) % 7
  const cells: ({ date: Date; minutes: number } | null)[] = [...Array(leadingEmpty).fill(null), ...days]

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Consistency (last 12 weeks)</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: 'fit-content' }}>
          {cells.map((cell, i) =>
            cell === null ? (
              <div key={`empty-${i}`} className="h-3 w-3" />
            ) : (
              <div
                key={cell.date.toISOString()}
                title={`${format(cell.date, 'MMM d')} — ${cell.minutes}m`}
                className={cn('h-3 w-3 rounded-sm', intensity(cell.minutes))}
              />
            )
          )}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <div className="h-3 w-3 rounded-sm bg-emerald-900" />
          <div className="h-3 w-3 rounded-sm bg-emerald-700" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500" />
          <div className="h-3 w-3 rounded-sm bg-emerald-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
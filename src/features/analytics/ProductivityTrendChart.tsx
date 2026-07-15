import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProductivityTrend } from './hooks'

export function ProductivityTrendChart() {
  const data = useProductivityTrend(14)

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Productivity trend</CardTitle></CardHeader>
      <CardContent>
        {!data ? (
          <div className="h-64 animate-pulse rounded-md bg-muted" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={1} />
              <YAxis tick={{ fontSize: 12 }} unit="m" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
              <Line type="monotone" dataKey="avgMinutes" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} name="Avg session length" />
            </LineChart>
          </ResponsiveContainer>
        )}
        <p className="mt-2 text-xs text-muted-foreground">Average session length per day — rising trend means longer focus stretches.</p>
      </CardContent>
    </Card>
  )
}
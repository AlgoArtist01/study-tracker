import { useLiveQuery } from 'dexie-react-hooks'
import { format } from 'date-fns'
import { Trash2, Clock } from 'lucide-react'
import { db } from '@/db/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { deleteSession } from '@/db/sessions'

export function SessionHistoryList() {
  const sessions = useLiveQuery(() => db.sessions.orderBy('startTime').reverse().limit(20).toArray(), [])
  const categories = useLiveQuery(() => db.categories.toArray(), [])
  const topics = useLiveQuery(() => db.topics.toArray(), [])

  function categoryName(id?: string) {
    return categories?.find((c) => c.id === id)?.name
  }
  function topicName(id?: string) {
    return topics?.find((t) => t.id === id)?.name
  }

  async function handleDelete(id: string) {
    await deleteSession(id)
    toast.success('Session deleted')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><Clock className="h-4 w-4" /> Session history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {!sessions || sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions logged yet — finish a timer above to see it here.</p>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-md border p-2.5">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="secondary">{s.duration}m</Badge>
                <span>{format(s.startTime, 'MMM d, HH:mm')}</span>
                {(categoryName(s.categoryId) || topicName(s.topicId)) && (
                  <span className="text-muted-foreground">
                    — {[categoryName(s.categoryId), topicName(s.topicId)].filter(Boolean).join(' / ')}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
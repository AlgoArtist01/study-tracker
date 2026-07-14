import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/db/db'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TaskList } from '@/features/tasks/TaskList'
import { useUIStore } from '@/store/ui-store'
import { STATUS_LABEL, PRIORITY_COLOR } from './constants'

export function TopicDetail({ topicId }: { topicId: string }) {
  const topic = useLiveQuery(() => db.topics.get(topicId), [topicId])
  const setSelectedTopicId = useUIStore((s) => s.setSelectedTopicId)

  if (!topic) return null

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => setSelectedTopicId(null)}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to topics
      </Button>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">{topic.name}</h1>
          <Badge variant="outline" className={PRIORITY_COLOR[topic.priority]}>{topic.priority}</Badge>
          <Badge variant="secondary">{STATUS_LABEL[topic.status]}</Badge>
        </div>
        {topic.notes && <p className="mt-1 text-sm text-muted-foreground">{topic.notes}</p>}
      </div>

      <TaskList categoryId={topic.categoryId} topicId={topic.id} />
    </div>
  )
}
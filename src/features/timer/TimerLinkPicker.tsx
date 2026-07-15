import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTimerStore } from '@/store/timer-store'
import type { Topic, Task } from '@/types/models'

export function TimerLinkPicker() {
  const link = useTimerStore((s) => s.link)
  const setLink = useTimerStore((s) => s.setLink)

  const categories = useLiveQuery(() => db.categories.orderBy('order').toArray(), [])
  const topics = useLiveQuery(
    () => (link.categoryId ? db.topics.where('categoryId').equals(link.categoryId).sortBy('order') : Promise.resolve<Topic[]>([])),
    [link.categoryId]
  )
  const tasks = useLiveQuery(
    () => (link.topicId ? db.tasks.where('topicId').equals(link.topicId).toArray() : Promise.resolve<Task[]>([])),
    [link.topicId]
  )

  return (
    <div className="grid grid-cols-3 gap-2">
      <Select
        value={link.categoryId ?? 'none'}
        onValueChange={(v) => setLink({ categoryId: v && v !== 'none' ? v : undefined })}
      >
        <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No category</SelectItem>
          {categories?.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select
        value={link.topicId ?? 'none'}
        onValueChange={(v) => setLink({ ...link, topicId: v && v !== 'none' ? v : undefined, taskId: undefined })}
        disabled={!link.categoryId}
      >
        <SelectTrigger><SelectValue placeholder="Topic" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No topic</SelectItem>
          {topics?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select
        value={link.taskId ?? 'none'}
        onValueChange={(v) => setLink({ ...link, taskId: v && v !== 'none' ? v : undefined })}
        disabled={!link.topicId}
      >
        <SelectTrigger><SelectValue placeholder="Task" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No task</SelectItem>
          {tasks?.map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}
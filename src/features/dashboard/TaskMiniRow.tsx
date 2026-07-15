import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { setTaskStatus } from '@/db/tasks'
import { TASK_PRIORITY_COLOR } from '@/features/tasks/constants'
import type { Task } from '@/types/models'

export function TaskMiniRow({ task }: { task: Task }) {
  const isDone = task.status === 'completed'

  async function toggle(checked: boolean) {
    await setTaskStatus(task.id, checked ? 'completed' : 'not_started')
  }

  return (
    <div className="flex items-center gap-3 rounded-md border p-2.5">
      <Checkbox checked={isDone} onCheckedChange={toggle} />
      <p className={cn('flex-1 truncate text-sm', isDone && 'text-muted-foreground line-through')}>
        {task.title}
      </p>
      <Badge variant="outline" className={cn('text-xs', TASK_PRIORITY_COLOR[task.priority])}>
        {task.priority}
      </Badge>
      {task.dueDate && (
        <span className="whitespace-nowrap text-xs text-muted-foreground">{format(task.dueDate, 'MMM d')}</span>
      )}
    </div>
  )
}
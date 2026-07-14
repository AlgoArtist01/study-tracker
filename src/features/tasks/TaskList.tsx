import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, ListChecks } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { db } from '@/db/db'
import { Button } from '@/components/ui/button'
import { TaskRow } from './TaskRow'
import { TaskFormDialog } from './TaskFormDialog'
import { reorderTasks } from '@/db/tasks'

export function TaskList({ categoryId, topicId }: { categoryId: string; topicId: string }) {
  const tasks = useLiveQuery(
    () => db.tasks.where('topicId').equals(topicId).sortBy('order'),
    [topicId]
  )

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  async function handleDragEnd(event: DragEndEvent) {
    if (!tasks) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)
    const reordered = arrayMove(tasks, oldIndex, newIndex)
    await reorderTasks(reordered.map((t) => t.id))
  }

  if (tasks === undefined) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <TaskFormDialog
          categoryId={categoryId}
          topicId={topicId}
          trigger={<Button size="sm"><Plus className="mr-1 h-4 w-4" /> New task</Button>}
        />
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <ListChecks className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No tasks yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Break this topic down into actionable tasks.</p>
          <TaskFormDialog
            categoryId={categoryId}
            topicId={topicId}
            trigger={<Button size="sm">Create your first task</Button>}
          />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((t) => <TaskRow key={t.id} task={t} />)}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, ListTree } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { db } from '@/db/db'
import { Button } from '@/components/ui/button'
import { TopicRow } from './TopicRow'
import { TopicFormDialog } from './TopicFormDialog'
import { reorderTopics } from '@/db/topics'

export function TopicList({ categoryId }: { categoryId: string }) {
  const topics = useLiveQuery(
    () => db.topics.where('categoryId').equals(categoryId).sortBy('order'),
    [categoryId]
  )

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  async function handleDragEnd(event: DragEndEvent) {
    if (!topics) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = topics.findIndex((t) => t.id === active.id)
    const newIndex = topics.findIndex((t) => t.id === over.id)
    const reordered = arrayMove(topics, oldIndex, newIndex)
    await reorderTopics(reordered.map((t) => t.id))
  }

  if (topics === undefined) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Topics</h2>
        <TopicFormDialog
          categoryId={categoryId}
          trigger={<Button size="sm"><Plus className="mr-1 h-4 w-4" /> New topic</Button>}
        />
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <ListTree className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No topics yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Break this category down into study topics.</p>
          <TopicFormDialog
            categoryId={categoryId}
            trigger={<Button size="sm">Create your first topic</Button>}
          />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={topics.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {topics.map((t) => <TopicRow key={t.id} topic={t} />)}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { PRIORITY_COLOR, STATUS_LABEL } from './constants'
import { TopicFormDialog } from './TopicFormDialog'
import { deleteTopic } from '@/db/topics'
import { useUIStore } from '@/store/ui-store'
import type { Topic } from '@/types/models'
import { useState } from 'react'

export function TopicRow({ topic }: { topic: Topic }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: topic.id })
  const setSelectedTopicId = useUIStore((s) => s.setSelectedTopicId)
  const [editOpen, setEditOpen] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    await deleteTopic(topic.id)
    toast.success(`"${topic.name}" deleted`)
    setDeleteOpen(false)
  }

  return (
    <div ref={setNodeRef} style={style} className="group flex items-center gap-3 rounded-lg border bg-card p-3">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => setSelectedTopicId(topic.id)}
      >
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{topic.name}</p>
          <Badge variant="outline" className={PRIORITY_COLOR[topic.priority]}>{topic.priority}</Badge>
          <Badge variant="secondary">{STATUS_LABEL[topic.status]}</Badge>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Progress value={topic.progress} className="h-1.5 max-w-40" />
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {topic.actualHours}h / {topic.estimatedHours}h
          </span>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="opacity-0 transition group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <TopicFormDialog
              categoryId={topic.categoryId}
              topic={topic}
              trigger={
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem className="text-red-500" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{topic.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This also deletes every task under this topic. Can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <TopicFormDialog categoryId={topic.categoryId} topic={topic} open={editOpen} onOpenChange={setEditOpen} />
      </div>
    </div>
  )
}
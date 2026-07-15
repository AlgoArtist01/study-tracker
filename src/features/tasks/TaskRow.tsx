import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical, Pencil, Trash2, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { TASK_PRIORITY_COLOR } from './constants'
import { TaskFormDialog } from './TaskFormDialog'
import { deleteTask, setTaskStatus } from '@/db/tasks'
import type { Task } from '@/types/models'
import { useState } from 'react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function TaskRow({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const [editOpen, setEditOpen] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isDone = task.status === 'completed'

  async function toggleDone(checked: boolean) {
    await setTaskStatus(task.id, checked ? 'completed' : 'not_started')
  }

  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    await deleteTask(task.id)
    toast.success(`"${task.title}" deleted`)
    setDeleteOpen(false)
  }
  return (
    <div ref={setNodeRef} style={style} className="group flex items-start gap-3 rounded-lg border bg-card p-3">
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab touch-none text-muted-foreground opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <Checkbox checked={isDone} onCheckedChange={toggleDone} className="mt-1" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={cn('truncate font-medium', isDone && 'text-muted-foreground line-through')}>
            {task.title}
          </p>
          <Badge variant="outline" className={TASK_PRIORITY_COLOR[task.priority]}>{task.priority}</Badge>
        </div>
        {task.description && (
          <p className="mt-1 truncate text-sm text-muted-foreground">{task.description}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          {task.duration && (
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.duration}m</span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(task.dueDate, 'MMM d')}</span>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="opacity-0 transition group-hover:opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <TaskFormDialog
            categoryId={task.categoryId}
            topicId={task.topicId ?? ''}
            task={task}
            trigger={
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
            }
          />
          <AlertDialog>
            <DropdownMenuItem className="text-red-500" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete "{task.title}"?</AlertDialogTitle>
                <AlertDialogDescription>Can't be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{task.title}"?</AlertDialogTitle>
            <AlertDialogDescription>Can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TaskFormDialog categoryId={task.categoryId} topicId={task.topicId ?? ''} task={task} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  )
}
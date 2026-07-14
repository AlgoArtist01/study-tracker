import { MoreVertical, Trash2, Pencil } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { CATEGORY_ICONS } from './constants'
import { CategoryFormDialog } from './CategoryFormDialog'
import { deleteCategory } from '@/db/categories'
import { useUIStore } from '@/store/ui-store'
import type { Category } from '@/types/models'
import { useState } from 'react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function CategoryCard({ category }: { category: Category }) {
  const Icon = CATEGORY_ICONS[category.icon] ?? CATEGORY_ICONS.book
  const setSelectedCategoryId = useUIStore((s) => s.setSelectedCategoryId)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    await deleteCategory(category.id)
    toast.success(`"${category.name}" deleted`)
    setDeleteOpen(false)
  }

  return (
    <Card
      onClick={() => setSelectedCategoryId(category.id)}
      className="group relative cursor-pointer overflow-hidden transition hover:shadow-md"
    >
      <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: category.color }} />
      <CardContent className="flex items-center justify-between p-4 pl-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium leading-none">{category.name}</p>
            {category.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{category.description}</p>
            )}
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
              <CategoryFormDialog
                category={category}
                trigger={
                  <DropdownMenuItem onClick={(e) => e.preventDefault()}>
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
                <AlertDialogTitle>Delete "{category.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This also deletes every topic and task inside it. Can't be undone.
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
        </div>
      </CardContent>
    </Card>
  )
}
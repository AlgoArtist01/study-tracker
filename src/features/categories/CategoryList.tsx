import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, FolderOpen } from 'lucide-react'
import { db } from '@/db/db'
import { Button } from '@/components/ui/button'
import { CategoryCard } from './CategoryCard'
import { CategoryFormDialog } from './CategoryFormDialog'

export function CategoryList() {
  const categories = useLiveQuery(() => db.categories.orderBy('order').toArray(), [])

  if (categories === undefined) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <CategoryFormDialog
          trigger={
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> New category
            </Button>
          }
        />
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <FolderOpen className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No categories yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Create one to start organizing topics and tasks.</p>
          <CategoryFormDialog trigger={<Button size="sm">Create your first category</Button>} />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      )}
    </div>
  )
}
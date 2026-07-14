import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/db/db'
import { Button } from '@/components/ui/button'
import { CATEGORY_ICONS } from './constants'
import { TopicList } from '@/features/topics/TopicList'
import { useUIStore } from '@/store/ui-store'

export function CategoryDetail({ categoryId }: { categoryId: string }) {
  const category = useLiveQuery(() => db.categories.get(categoryId), [categoryId])
  const setSelectedCategoryId = useUIStore((s) => s.setSelectedCategoryId)

  if (!category) return null

  const Icon = CATEGORY_ICONS[category.icon] ?? CATEGORY_ICONS.book

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => setSelectedCategoryId(null)}>
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to categories
      </Button>

      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${category.color}20`, color: category.color }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{category.name}</h1>
          {category.description && <p className="text-sm text-muted-foreground">{category.description}</p>}
        </div>
      </div>

      <TopicList categoryId={categoryId} />
    </div>
  )
}
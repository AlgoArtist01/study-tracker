import { Toaster } from '@/components/ui/sonner'
import { CategoryList } from '@/features/categories/CategoryList'
import { CategoryDetail } from '@/features/categories/CategoryDetail'
import { TopicDetail } from '@/features/topics/TopicDetail'
import { useUIStore } from '@/store/ui-store'

function App() {
  const selectedCategoryId = useUIStore((s) => s.selectedCategoryId)
  const selectedTopicId = useUIStore((s) => s.selectedTopicId)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {selectedTopicId ? (
          <TopicDetail topicId={selectedTopicId} />
        ) : selectedCategoryId ? (
          <CategoryDetail categoryId={selectedCategoryId} />
        ) : (
          <CategoryList />
        )}
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
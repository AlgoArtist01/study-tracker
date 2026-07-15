import { Toaster } from '@/components/ui/sonner'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutDashboard, FolderKanban, Timer, BarChart3 } from 'lucide-react'
import { CategoryList } from '@/features/categories/CategoryList'
import { CategoryDetail } from '@/features/categories/CategoryDetail'
import { TopicDetail } from '@/features/topics/TopicDetail'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { TimerPage } from '@/features/timer/TimerPage'
import { AnalyticsPage } from '@/features/analytics/AnalyticsPage'
import { useUIStore } from '@/store/ui-store'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

function App() {
  const selectedCategoryId = useUIStore((s) => s.selectedCategoryId)
  const selectedTopicId = useUIStore((s) => s.selectedTopicId)
  const activeView = useUIStore((s) => s.activeView)
  const setActiveView = useUIStore((s) => s.setActiveView)
  const setSelectedCategoryId = useUIStore((s) => s.setSelectedCategoryId)
  const setSelectedTopicId = useUIStore((s) => s.setSelectedTopicId)

  const inDrillDown = !!selectedCategoryId || !!selectedTopicId

  function handleViewChange(view: string) {
    setActiveView(view as 'dashboard' | 'categories' | 'timer' | 'analytics')
    setSelectedCategoryId(null)
    setSelectedTopicId(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {!inDrillDown && (
          <div className="mb-6 flex items-center justify-between">
            <Tabs value={activeView} onValueChange={handleViewChange}>
              <TabsList>
                <TabsTrigger value="dashboard"><LayoutDashboard className="mr-1.5 h-4 w-4" /> Dashboard</TabsTrigger>
                <TabsTrigger value="categories"><FolderKanban className="mr-1.5 h-4 w-4" /> Categories</TabsTrigger>
                <TabsTrigger value="timer"><Timer className="mr-1.5 h-4 w-4" /> Timer</TabsTrigger>
                <TabsTrigger value="analytics"><BarChart3 className="mr-1.5 h-4 w-4" /> Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
            <ThemeToggle />
          </div>
        )}

        {selectedTopicId ? (
          <TopicDetail topicId={selectedTopicId} />
        ) : selectedCategoryId ? (
          <CategoryDetail categoryId={selectedCategoryId} />
        ) : activeView === 'dashboard' ? (
          <Dashboard />
        ) : activeView === 'timer' ? (
          <TimerPage />
        ) : activeView === 'analytics' ? (
          <AnalyticsPage />
        ) : (
          <CategoryList />
        )}
      </div>
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
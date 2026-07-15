import { StudyHoursChart } from './StudyHoursChart'
import { CategoryProgressChart } from './CategoryProgressChart'
import { CompletionTrendChart } from './CompletionTrendChart'
import { ConsistencyHeatmap } from './ConsistencyHeatmap'
import { ProductivityTrendChart } from './ProductivityTrendChart'

export function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <StudyHoursChart />
      <div className="grid gap-4 md:grid-cols-2">
        <CategoryProgressChart />
        <ConsistencyHeatmap />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CompletionTrendChart />
        <ProductivityTrendChart />
      </div>
    </div>
  )
}
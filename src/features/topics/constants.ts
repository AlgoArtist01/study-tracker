export const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const
export const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'] as const
export const STATUS_OPTIONS = ['not_started', 'in_progress', 'completed'] as const

export const PRIORITY_COLOR: Record<string, string> = {
  low: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export const STATUS_LABEL: Record<string, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
}
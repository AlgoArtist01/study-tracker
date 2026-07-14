import type { LucideIcon } from 'lucide-react'
import {
  BookOpen, Code, Calculator, Globe, Beaker, Palette, Music, Dumbbell,
  Briefcase, GraduationCap, Brain, Rocket, Target, Wrench, Layers, PenTool,
} from 'lucide-react'

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  book: BookOpen, code: Code, calculator: Calculator, globe: Globe,
  beaker: Beaker, palette: Palette, music: Music, dumbbell: Dumbbell,
  briefcase: Briefcase, cap: GraduationCap, brain: Brain, rocket: Rocket,
  target: Target, wrench: Wrench, layers: Layers, pen: PenTool,
}

export const CATEGORY_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
]
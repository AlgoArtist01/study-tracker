import { create } from 'zustand'

interface Filters {
  status?: string[]
  priority?: string[]
  categoryId?: string
  topicId?: string
  tags?: string[]
}

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  filters: Filters
  setFilters: (f: Partial<Filters>) => void
  clearFilters: () => void
  focusModeTaskId: string | null
  setFocusMode: (taskId: string | null) => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  selectedCategoryId: string | null
  setSelectedCategoryId: (id: string | null) => void
  selectedTopicId: string | null
  setSelectedTopicId: (id: string | null) => void
  activeView: 'dashboard' | 'categories' | 'timer'
  setActiveView: (view: 'dashboard' | 'categories' | 'timer') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  filters: {},
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  clearFilters: () => set({ filters: {} }),
  focusModeTaskId: null,
  setFocusMode: (taskId) => set({ focusModeTaskId: taskId }),
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  selectedCategoryId: null,
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  selectedTopicId: null,
  setSelectedTopicId: (id) => set({ selectedTopicId: id }),
  activeView: 'dashboard',
  setActiveView: (view) => set({ activeView: view }),
}))

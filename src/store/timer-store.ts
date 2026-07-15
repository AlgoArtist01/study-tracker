import { create } from 'zustand'

export type TimerMode = 'stopwatch' | 'pomodoro' | 'countdown'
export type TimerPhase = 'work' | 'break' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'

interface TimerLink {
  categoryId?: string
  topicId?: string
  taskId?: string
}

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  accumulatedMs: number
  startedAt: number | null
  targetSeconds: number | null
  phase: TimerPhase
  pomodoroCount: number
  link: TimerLink
  notes: string

  setMode: (mode: TimerMode) => void
  setLink: (link: TimerLink) => void
  setNotes: (notes: string) => void
  setTargetSeconds: (s: number) => void
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  getElapsedMs: () => number
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'stopwatch',
  status: 'idle',
  accumulatedMs: 0,
  startedAt: null,
  targetSeconds: null,
  phase: 'work',
  pomodoroCount: 0,
  link: {},
  notes: '',

  setMode: (mode) => set({ mode, status: 'idle', accumulatedMs: 0, startedAt: null, phase: 'work', pomodoroCount: 0 }),
  setLink: (link) => set({ link }),
  setNotes: (notes) => set({ notes }),
  setTargetSeconds: (s) => set({ targetSeconds: s }),

  start: () => set({ status: 'running', startedAt: Date.now(), accumulatedMs: 0 }),
  pause: () => {
    const { startedAt, accumulatedMs } = get()
    const extra = startedAt ? Date.now() - startedAt : 0
    set({ status: 'paused', accumulatedMs: accumulatedMs + extra, startedAt: null })
  },
  resume: () => set({ status: 'running', startedAt: Date.now() }),
  reset: () => set({ status: 'idle', accumulatedMs: 0, startedAt: null }),

  getElapsedMs: () => {
    const { status, startedAt, accumulatedMs } = get()
    if (status === 'running' && startedAt) return accumulatedMs + (Date.now() - startedAt)
    return accumulatedMs
  },
}))
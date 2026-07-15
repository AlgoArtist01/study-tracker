import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { db } from '@/db/db'
import { useTimerStore, type TimerMode } from '@/store/timer-store'
import { createSession } from '@/db/sessions'
import { TimerLinkPicker } from './TimerLinkPicker'
import { SessionHistoryList } from './SessionHistoryList'

function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

function useTick(running: boolean) {
  const [, force] = useState(0)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => force((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [running])
}

export function TimerPage() {
  const {
    mode, status, phase, pomodoroCount, link, notes, targetSeconds,
    setMode, setNotes, setTargetSeconds,
    start, pause, resume, reset, getElapsedMs,
  } = useTimerStore()

  const settings = useLiveQuery(() => db.settings.get('settings'), [])
  const [countdownMinutes, setCountdownMinutes] = useState(25)

  useTick(status === 'running')

  const elapsedSeconds = Math.floor(getElapsedMs() / 1000)

  const workSeconds = (settings?.pomodoroWorkMinutes ?? 25) * 60
  const breakSeconds = (settings?.pomodoroBreakMinutes ?? 5) * 60
  const longBreakSeconds = (settings?.pomodoroLongBreakMinutes ?? 15) * 60

  const effectiveTarget =
    mode === 'pomodoro'
      ? phase === 'work' ? workSeconds : phase === 'longBreak' ? longBreakSeconds : breakSeconds
      : mode === 'countdown'
      ? targetSeconds ?? countdownMinutes * 60
      : null

  const remaining = effectiveTarget !== null ? Math.max(0, effectiveTarget - elapsedSeconds) : null
  const display = mode === 'stopwatch' ? formatDuration(elapsedSeconds) : formatDuration(remaining ?? 0)

  async function finishAndSave(durationSeconds: number, skipToast = false) {
    if (durationSeconds < 1) { reset(); return }
    await createSession({
      taskId: link.taskId,
      categoryId: link.categoryId,
      topicId: link.topicId,
      startTime: Date.now() - durationSeconds * 1000,
      endTime: Date.now(),
      duration: Math.round(durationSeconds / 60),
      notes: notes || undefined,
      source: mode === 'pomodoro' ? 'pomodoro' : 'timer',
    })
    if (!skipToast) toast.success(`Session saved — ${Math.round(durationSeconds / 60)}m`)
    reset()
  }

  useEffect(() => {
    if (status !== 'running' || remaining === null || remaining > 0) return

    if (mode === 'countdown') {
      void finishAndSave(elapsedSeconds)
      toast.success('Countdown complete')
    } else if (mode === 'pomodoro') {
      if (phase === 'work') {
        void finishAndSave(workSeconds, true)
        const nextCount = pomodoroCount + 1
        const goLong = nextCount % 4 === 0
        useTimerStore.setState({
          phase: goLong ? 'longBreak' : 'break', pomodoroCount: nextCount,
          status: 'idle', accumulatedMs: 0, startedAt: null,
        })
        toast.success(goLong ? 'Work session done — long break time' : 'Work session done — take a break')
      } else {
        useTimerStore.setState({ phase: 'work', status: 'idle', accumulatedMs: 0, startedAt: null })
        toast.info('Break over — back to work')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, status])

  function handleModeChange(m: string) {
    setMode(m as TimerMode)
  }

  async function handleStop() {
    await finishAndSave(elapsedSeconds)
  }

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList>
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="countdown">Countdown</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-10">
          {mode === 'pomodoro' && (
            <Badge variant={phase === 'work' ? 'default' : 'secondary'} className="text-sm">
              {phase === 'work' ? 'Focus' : phase === 'longBreak' ? 'Long break' : 'Short break'} · Round {pomodoroCount + 1}
            </Badge>
          )}

          {mode === 'countdown' && status === 'idle' && (
            <div className="flex items-center gap-2">
              <Label htmlFor="mins">Minutes</Label>
              <Input
                id="mins"
                type="number"
                min={1}
                className="w-24"
                value={countdownMinutes}
                onChange={(e) => setCountdownMinutes(Number(e.target.value))}
              />
            </div>
          )}

          <p className="font-mono text-6xl font-bold tabular-nums">{display}</p>

          <div className="flex gap-2">
            {status === 'idle' && (
              <Button onClick={() => { if (mode === 'countdown') setTargetSeconds(countdownMinutes * 60); start() }}>
                <Play className="mr-1.5 h-4 w-4" /> Start
              </Button>
            )}
            {status === 'running' && (
              <Button variant="secondary" onClick={pause}>
                <Pause className="mr-1.5 h-4 w-4" /> Pause
              </Button>
            )}
            {status === 'paused' && (
              <Button onClick={resume}>
                <Play className="mr-1.5 h-4 w-4" /> Resume
              </Button>
            )}
            {status !== 'idle' && (
              <Button variant="outline" onClick={handleStop}>
                <Square className="mr-1.5 h-4 w-4" /> Stop &amp; save
              </Button>
            )}
            {status !== 'idle' && (
              <Button variant="ghost" size="icon" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="w-full max-w-md space-y-3">
            <TimerLinkPicker />
            <Textarea
              placeholder="Session notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <SessionHistoryList />
    </div>
  )
}
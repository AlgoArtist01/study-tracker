import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import type { AppSettings } from '@/types/models'

type Theme = AppSettings['theme']

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme
  root.classList.toggle('dark', resolved === 'dark')
}

export function useTheme() {
  const settings = useLiveQuery(() => db.settings.get('settings'), [])
  const theme = settings?.theme ?? 'dark'

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyTheme('system')
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [theme])

  async function setTheme(next: Theme) {
    await db.settings.update('settings', { theme: next })
  }

  return { theme, setTheme }
}
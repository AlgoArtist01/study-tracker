import { db } from './db'

export async function ensureSettings() {
  const existing = await db.settings.get('settings')
  if (!existing) {
    await db.settings.add({
      id: 'settings',
      theme: 'dark',
      pomodoroWorkMinutes: 25,
      pomodoroBreakMinutes: 5,
      pomodoroLongBreakMinutes: 15,
      weekStartsOn: 1,
    })
  }
}
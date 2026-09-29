import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type Lang = 'fa' | 'en'
type Prefs = {
  theme: Theme; lang: Lang; haptics: boolean
  set: (p: Partial<Omit<Prefs, 'set'>>) => void
}
export const usePrefs = create<Prefs>()(
  persist((set) => ({ theme: 'system', lang: 'fa', haptics: true, set: (p) => set(p) }), { name: 'liiist-prefs' }),
)

export function applyPrefs(theme: Theme, lang: Lang) {
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  const el = document.documentElement
  el.classList.toggle('dark', dark)
  el.lang = lang
  el.dir = lang === 'fa' ? 'rtl' : 'ltr'
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#0a0a0a' : '#fafafa')
}

export const haptic = (ms = 8) => {
  if (usePrefs.getState().haptics) navigator.vibrate?.(ms)
}

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { api, type User } from './api'

export const useMe = () =>
  useQuery({ queryKey: ['me'], queryFn: () => api.get<{ user: User | null }>('/me').then((r) => r.user), staleTime: 60_000 })

type UI = { auth: boolean; compose: boolean; set: (p: Partial<Omit<UI, 'set'>>) => void }
export const useUI = create<UI>((set) => ({ auth: false, compose: false, set: (p) => set(p) }))

/** Returns a guard: runs fn when signed in, otherwise opens auth sheet. */
export const useRequireAuth = () => {
  const { data: me } = useMe()
  const set = useUI((s) => s.set)
  return <A extends unknown[]>(fn: (...a: A) => void) => (...a: A) => (me ? fn(...a) : set({ auth: true }))
}

export const useInvalidate = () => {
  const qc = useQueryClient()
  return (...keys: string[]) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
}

export async function share(url: string, title: string, copied: string, toast: (m: string) => void) {
  if (navigator.share) {
    try { await navigator.share({ url, title }); return } catch (e: any) { if (e?.name === 'AbortError') return }
  }
  await navigator.clipboard.writeText(url)
  toast(copied)
}

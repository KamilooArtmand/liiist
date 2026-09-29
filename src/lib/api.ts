export class ApiError extends Error {
  constructor(public status: number, public code: string) { super(code) }
}
async function req<T>(method: string, url: string, body?: unknown): Promise<T> {
  const r = await fetch(`/api${url}`, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const j: any = await r.json().catch(() => ({}))
  if (!r.ok) throw new ApiError(r.status, j.error ?? 'err')
  return j as T
}
export const api = {
  get: <T,>(u: string) => req<T>('GET', u),
  post: <T,>(u: string, b?: unknown) => req<T>('POST', u, b ?? {}),
  patch: <T,>(u: string, b: unknown) => req<T>('PATCH', u, b),
  del: <T,>(u: string) => req<T>('DELETE', u),
}

export type User = { handle: string; name: string; bio: string; avatar: string; hue: number; created_at: number }
export type Profile = User & { followers: number; following: number; is_following: boolean; self: boolean }
export type ListCard = {
  id: string; title: string; emoji: string; hue: number; is_public: boolean
  created_at: number; updated_at: number
  handle: string; owner_name: string; owner_avatar: string; owner_hue: number
  item_count: number; done_count: number; like_count: number; liked: boolean; preview: string[]
}
export type Item = { id: string; text: string; note: string; done: boolean; pos: number }

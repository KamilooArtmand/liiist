import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { secureHeaders } from 'hono/secure-headers'

type Env = {
  DB: D1Database
  ASSETS: Fetcher
  OPENAI_API_KEY?: string
  OPENAI_BASE_URL?: string
  AI_MODEL?: string
  /** Optional Cloudflare Workers AI binding (fallback provider). */
  AI?: { run: (model: string, input: unknown) => Promise<any> }
  WORKERS_AI_MODEL?: string
}
type User = { id: string; handle: string; name: string; bio: string; avatar: string; hue: number; created_at: number }
type Vars = { user: User | null }

const app = new Hono<{ Bindings: Env; Variables: Vars }>()
const now = () => Date.now()
const uid = (n = 12) => {
  const a = 'abcdefghijkmnopqrstuvwxyz23456789'
  const b = crypto.getRandomValues(new Uint8Array(n))
  return Array.from(b, (x) => a[x % a.length]).join('')
}
const HANDLE_RE = /^[a-z0-9_]{3,20}$/i
const RESERVED = new Set(['api', 'settings', 'explore', 'new', 'l', 'admin', 'login', 'signup', 'me', 'liiist', 'search'])
const clamp = (s: unknown, n: number) => String(s ?? '').trim().slice(0, n)

/* ---------------- crypto ---------------- */
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
async function hashPass(pass: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 100_000 },
    key,
    256,
  )
  return hex(bits)
}
const safeEq = (a: string, b: string) => {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

/* ---------------- middleware ---------------- */
app.use('/api/*', secureHeaders())
app.use('/api/*', async (c, next) => {
  c.set('user', null)
  const token = getCookie(c, 'sid')
  if (token) {
    const u = await c.env.DB.prepare(
      `SELECT u.id,u.handle,u.name,u.bio,u.avatar,u.hue,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires_at>?`,
    )
      .bind(token, now())
      .first<User>()
    c.set('user', u ?? null)
  }
  await next()
})
const need = (c: any): User => {
  const u = c.get('user')
  if (!u) throw new HttpErr(401, 'auth')
  return u
}
class HttpErr extends Error {
  constructor(public status: number, msg: string) { super(msg) }
}
app.onError((e, c) => {
  if (e instanceof HttpErr) return c.json({ error: e.message }, e.status as any)
  console.error(e)
  return c.json({ error: 'server' }, 500)
})

async function startSession(c: any, userId: string) {
  const token = uid(32)
  const exp = now() + 1000 * 60 * 60 * 24 * 60
  await c.env.DB.prepare('INSERT INTO sessions (token,user_id,expires_at) VALUES (?,?,?)').bind(token, userId, exp).run()
  setCookie(c, 'sid', token, {
    httpOnly: true, secure: true, sameSite: 'Lax', path: '/', expires: new Date(exp),
  })
}

/* ---------------- auth ---------------- */
app.post('/api/auth/signup', async (c) => {
  const { handle, password } = await c.req.json<any>()
  const h = clamp(handle, 20).toLowerCase()
  if (!HANDLE_RE.test(h) || RESERVED.has(h)) throw new HttpErr(400, 'handle')
  if (String(password ?? '').length < 6) throw new HttpErr(400, 'password')
  const exists = await c.env.DB.prepare('SELECT 1 FROM users WHERE handle=?').bind(h).first()
  if (exists) throw new HttpErr(409, 'taken')
  const id = uid(), salt = uid(16)
  const hue = Math.floor(Math.random() * 360)
  await c.env.DB.prepare('INSERT INTO users (id,handle,name,pass_hash,salt,hue,created_at) VALUES (?,?,?,?,?,?,?)')
    .bind(id, h, h, await hashPass(password, salt), salt, hue, now()).run()
  await startSession(c, id)
  return c.json({ ok: true })
})

app.post('/api/auth/login', async (c) => {
  const { handle, password } = await c.req.json<any>()
  const u = await c.env.DB.prepare('SELECT id,pass_hash,salt FROM users WHERE handle=?')
    .bind(clamp(handle, 20).replace(/^@/, '')).first<any>()
  if (!u || !safeEq(await hashPass(String(password ?? ''), u.salt), u.pass_hash)) throw new HttpErr(401, 'invalid')
  await startSession(c, u.id)
  return c.json({ ok: true })
})

app.post('/api/auth/logout', async (c) => {
  const t = getCookie(c, 'sid')
  if (t) await c.env.DB.prepare('DELETE FROM sessions WHERE token=?').bind(t).run()
  deleteCookie(c, 'sid', { path: '/' })
  return c.json({ ok: true })
})

app.get('/api/handle/:h', async (c) => {
  const h = c.req.param('h').toLowerCase()
  if (!HANDLE_RE.test(h) || RESERVED.has(h)) return c.json({ available: false })
  const e = await c.env.DB.prepare('SELECT 1 FROM users WHERE handle=?').bind(h).first()
  return c.json({ available: !e })
})

/* ---------------- me ---------------- */
app.get('/api/me', (c) => c.json({ user: c.get('user') }))

app.patch('/api/me', async (c) => {
  const u = need(c)
  const b = await c.req.json<any>()
  const next = {
    name: b.name !== undefined ? clamp(b.name, 40) : u.name,
    bio: b.bio !== undefined ? clamp(b.bio, 160) : u.bio,
    avatar: b.avatar !== undefined ? clamp(b.avatar, 8) || '✦' : u.avatar,
    hue: b.hue !== undefined ? Math.max(0, Math.min(360, Number(b.hue) | 0)) : u.hue,
    handle: u.handle,
  }
  if (b.handle !== undefined && b.handle.toLowerCase() !== u.handle) {
    const h = clamp(b.handle, 20).toLowerCase()
    if (!HANDLE_RE.test(h) || RESERVED.has(h)) throw new HttpErr(400, 'handle')
    if (await c.env.DB.prepare('SELECT 1 FROM users WHERE handle=?').bind(h).first()) throw new HttpErr(409, 'taken')
    next.handle = h
  }
  await c.env.DB.prepare('UPDATE users SET name=?,bio=?,avatar=?,hue=?,handle=? WHERE id=?')
    .bind(next.name, next.bio, next.avatar, next.hue, next.handle, u.id).run()
  return c.json({ user: { ...u, ...next } })
})

app.post('/api/me/password', async (c) => {
  const u = need(c)
  const { current, next } = await c.req.json<any>()
  const r = await c.env.DB.prepare('SELECT pass_hash,salt FROM users WHERE id=?').bind(u.id).first<any>()
  if (!safeEq(await hashPass(String(current ?? ''), r.salt), r.pass_hash)) throw new HttpErr(401, 'invalid')
  if (String(next ?? '').length < 6) throw new HttpErr(400, 'password')
  const salt = uid(16)
  await c.env.DB.prepare('UPDATE users SET pass_hash=?,salt=? WHERE id=?').bind(await hashPass(next, salt), salt, u.id).run()
  return c.json({ ok: true })
})

app.get('/api/me/export', async (c) => {
  const u = need(c)
  const { results: lists } = await c.env.DB.prepare('SELECT * FROM lists WHERE user_id=?').bind(u.id).all<any>()
  const { results: items } = await c.env.DB.prepare(
    'SELECT i.* FROM items i JOIN lists l ON l.id=i.list_id WHERE l.user_id=? ORDER BY i.pos',
  ).bind(u.id).all<any>()
  return c.json({ user: u, lists: lists.map((l) => ({ ...l, items: items.filter((i) => i.list_id === l.id) })) })
})

app.delete('/api/me', async (c) => {
  const u = need(c)
  const db = c.env.DB
  await db.batch([
    db.prepare('DELETE FROM items WHERE list_id IN (SELECT id FROM lists WHERE user_id=?)').bind(u.id),
    db.prepare('DELETE FROM likes WHERE user_id=? OR list_id IN (SELECT id FROM lists WHERE user_id=?)').bind(u.id, u.id),
    db.prepare('DELETE FROM lists WHERE user_id=?').bind(u.id),
    db.prepare('DELETE FROM follows WHERE follower_id=? OR followee_id=?').bind(u.id, u.id),
    db.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id),
    db.prepare('DELETE FROM users WHERE id=?').bind(u.id),
  ])
  deleteCookie(c, 'sid', { path: '/' })
  return c.json({ ok: true })
})

/* ---------------- lists ---------------- */
const LIST_SELECT = `
  SELECT l.id,l.title,l.emoji,l.hue,l.is_public,l.created_at,l.updated_at,
    u.handle,u.name AS owner_name,u.avatar AS owner_avatar,u.hue AS owner_hue,
    (SELECT COUNT(*) FROM items i WHERE i.list_id=l.id) AS item_count,
    (SELECT COUNT(*) FROM items i WHERE i.list_id=l.id AND i.done=1) AS done_count,
    (SELECT COUNT(*) FROM likes k WHERE k.list_id=l.id) AS like_count,
    (SELECT GROUP_CONCAT(text, '\u0001') FROM (SELECT text FROM items i WHERE i.list_id=l.id ORDER BY pos LIMIT 3)) AS preview,
    EXISTS(SELECT 1 FROM likes k WHERE k.list_id=l.id AND k.user_id=?) AS liked
  FROM lists l JOIN users u ON u.id=l.user_id`
const shape = (r: any) => ({
  ...r,
  is_public: !!r.is_public,
  liked: !!r.liked,
  preview: r.preview ? String(r.preview).split('\u0001') : [],
})

async function getList(c: any, id: string) {
  const me = c.get('user') as User | null
  const l = await c.env.DB.prepare(`${LIST_SELECT} WHERE l.id=?`).bind(me?.id ?? '', id).first()
  if (!l) throw new HttpErr(404, 'nf')
  const own = await c.env.DB.prepare('SELECT user_id FROM lists WHERE id=?').bind(id).first()
  const mine = !!me && own.user_id === me.id
  if (!l.is_public && !mine) throw new HttpErr(404, 'nf')
  return { list: shape(l), mine, ownerId: own.user_id as string }
}
async function ownList(c: any, id: string) {
  const u = need(c)
  const l = await c.env.DB.prepare('SELECT id FROM lists WHERE id=? AND user_id=?').bind(id, u.id).first()
  if (!l) throw new HttpErr(404, 'nf')
  return u
}
const touch = (c: any, id: string) => c.env.DB.prepare('UPDATE lists SET updated_at=? WHERE id=?').bind(now(), id).run()

async function insertItems(c: any, listId: string, texts: { text: string; note?: string }[]) {
  const max = await c.env.DB.prepare('SELECT COALESCE(MAX(pos),0) AS m FROM items WHERE list_id=?').bind(listId).first()
  let pos = max.m
  const rows = texts
    .map((t) => ({ text: clamp(t.text, 280), note: clamp(t.note, 500) }))
    .filter((t) => t.text)
    .slice(0, 100)
    .map((t) => ({ id: uid(), ...t, done: false, pos: (pos += 1) }))
  if (rows.length)
    await c.env.DB.batch(
      rows.map((r) => c.env.DB.prepare('INSERT INTO items (id,list_id,text,note,done,pos) VALUES (?,?,?,?,0,?)').bind(r.id, listId, r.text, r.note, r.pos)),
    )
  return rows
}

app.get('/api/feed', async (c) => {
  const me = c.get('user')
  const tab = c.req.query('tab') ?? 'new'
  const order = tab === 'top' ? 'like_count DESC, l.updated_at DESC' : 'l.updated_at DESC'
  const following = tab === 'following'
  if (following && !me) return c.json({ lists: [] })
  const where = following
    ? `WHERE l.is_public=1 AND l.user_id IN (SELECT followee_id FROM follows WHERE follower_id=?)`
    : `WHERE l.is_public=1`
  const binds = following ? [me!.id, me!.id] : [me?.id ?? '']
  const { results } = await c.env.DB.prepare(`${LIST_SELECT} ${where} ORDER BY ${order} LIMIT 60`).bind(...binds).all()
  return c.json({ lists: results.map(shape) })
})

app.get('/api/mine', async (c) => {
  const u = need(c)
  const { results } = await c.env.DB.prepare(`${LIST_SELECT} WHERE l.user_id=? ORDER BY l.updated_at DESC`).bind(u.id, u.id).all()
  return c.json({ lists: results.map(shape) })
})

app.get('/api/liked', async (c) => {
  const u = need(c)
  const { results } = await c.env.DB.prepare(
    `${LIST_SELECT} JOIN likes lk ON lk.list_id=l.id WHERE lk.user_id=? AND l.is_public=1 ORDER BY lk.created_at DESC`,
  ).bind(u.id, u.id).all()
  return c.json({ lists: results.map(shape) })
})

app.get('/api/search', async (c) => {
  const me = c.get('user')
  const q = clamp(c.req.query('q'), 60)
  if (!q) return c.json({ lists: [], users: [] })
  const like = `%${q.replace(/[%_]/g, '')}%`
  const [lists, users] = await Promise.all([
    c.env.DB.prepare(
      `${LIST_SELECT} WHERE l.is_public=1 AND (l.title LIKE ? OR EXISTS(SELECT 1 FROM items i WHERE i.list_id=l.id AND i.text LIKE ?)) ORDER BY l.updated_at DESC LIMIT 30`,
    ).bind(me?.id ?? '', like, like).all(),
    c.env.DB.prepare('SELECT handle,name,avatar,hue FROM users WHERE handle LIKE ? OR name LIKE ? LIMIT 10').bind(like, like).all(),
  ])
  return c.json({ lists: lists.results.map(shape), users: users.results })
})

app.post('/api/lists', async (c) => {
  const u = need(c)
  const b = await c.req.json<any>().catch(() => ({}))
  const id = uid(10), t = now()
  await c.env.DB.prepare('INSERT INTO lists (id,user_id,title,emoji,hue,is_public,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)')
    .bind(id, u.id, clamp(b.title, 80), clamp(b.emoji, 8) || '✦', Number(b.hue ?? Math.floor(Math.random() * 360)) | 0, b.is_public === false ? 0 : 1, t, t)
    .run()
  if (Array.isArray(b.items)) await insertItems(c, id, b.items.map((x: any) => (typeof x === 'string' ? { text: x } : x)))
  return c.json({ id })
})

app.get('/api/lists/:id', async (c) => {
  const id = c.req.param('id')
  const { list, mine } = await getList(c, id)
  const { results } = await c.env.DB.prepare('SELECT id,text,note,done,pos FROM items WHERE list_id=? ORDER BY pos').bind(id).all<any>()
  return c.json({ list, mine, items: results.map((i) => ({ ...i, done: !!i.done })) })
})

app.patch('/api/lists/:id', async (c) => {
  const id = c.req.param('id')
  await ownList(c, id)
  const b = await c.req.json<any>()
  const sets: string[] = [], vals: any[] = []
  if (b.title !== undefined) sets.push('title=?'), vals.push(clamp(b.title, 80))
  if (b.emoji !== undefined) sets.push('emoji=?'), vals.push(clamp(b.emoji, 8) || '✦')
  if (b.hue !== undefined) sets.push('hue=?'), vals.push(Number(b.hue) | 0)
  if (b.is_public !== undefined) sets.push('is_public=?'), vals.push(b.is_public ? 1 : 0)
  sets.push('updated_at=?'), vals.push(now())
  await c.env.DB.prepare(`UPDATE lists SET ${sets.join(',')} WHERE id=?`).bind(...vals, id).run()
  return c.json({ ok: true })
})

app.delete('/api/lists/:id', async (c) => {
  const id = c.req.param('id')
  await ownList(c, id)
  const db = c.env.DB
  await db.batch([
    db.prepare('DELETE FROM items WHERE list_id=?').bind(id),
    db.prepare('DELETE FROM likes WHERE list_id=?').bind(id),
    db.prepare('DELETE FROM lists WHERE id=?').bind(id),
  ])
  return c.json({ ok: true })
})

app.post('/api/lists/:id/items', async (c) => {
  const id = c.req.param('id')
  await ownList(c, id)
  const b = await c.req.json<any>()
  const src = Array.isArray(b.items) ? b.items : [b]
  const rows = await insertItems(c, id, src.map((x: any) => (typeof x === 'string' ? { text: x } : x)))
  await touch(c, id)
  return c.json({ items: rows })
})

app.post('/api/lists/:id/reorder', async (c) => {
  const id = c.req.param('id')
  await ownList(c, id)
  const { ids } = await c.req.json<{ ids: string[] }>()
  const db = c.env.DB
  if (Array.isArray(ids) && ids.length)
    await db.batch(ids.slice(0, 500).map((iid, i) => db.prepare('UPDATE items SET pos=? WHERE id=? AND list_id=?').bind(i + 1, iid, id)))
  await touch(c, id)
  return c.json({ ok: true })
})

app.patch('/api/items/:id', async (c) => {
  const u = need(c)
  const iid = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT i.list_id FROM items i JOIN lists l ON l.id=i.list_id WHERE i.id=? AND l.user_id=?').bind(iid, u.id).first<any>()
  if (!row) throw new HttpErr(404, 'nf')
  const b = await c.req.json<any>()
  const sets: string[] = [], vals: any[] = []
  if (b.text !== undefined) sets.push('text=?'), vals.push(clamp(b.text, 280))
  if (b.note !== undefined) sets.push('note=?'), vals.push(clamp(b.note, 500))
  if (b.done !== undefined) sets.push('done=?'), vals.push(b.done ? 1 : 0)
  if (sets.length) await c.env.DB.prepare(`UPDATE items SET ${sets.join(',')} WHERE id=?`).bind(...vals, iid).run()
  await touch(c, row.list_id)
  return c.json({ ok: true })
})

app.delete('/api/items/:id', async (c) => {
  const u = need(c)
  const iid = c.req.param('id')
  const row = await c.env.DB.prepare('SELECT i.list_id FROM items i JOIN lists l ON l.id=i.list_id WHERE i.id=? AND l.user_id=?').bind(iid, u.id).first<any>()
  if (!row) throw new HttpErr(404, 'nf')
  await c.env.DB.prepare('DELETE FROM items WHERE id=?').bind(iid).run()
  await touch(c, row.list_id)
  return c.json({ ok: true })
})

app.post('/api/lists/:id/like', async (c) => {
  const u = need(c)
  const id = c.req.param('id')
  await getList(c, id)
  await c.env.DB.prepare('INSERT OR IGNORE INTO likes (user_id,list_id,created_at) VALUES (?,?,?)').bind(u.id, id, now()).run()
  return c.json({ ok: true })
})
app.delete('/api/lists/:id/like', async (c) => {
  const u = need(c)
  await c.env.DB.prepare('DELETE FROM likes WHERE user_id=? AND list_id=?').bind(u.id, c.req.param('id')).run()
  return c.json({ ok: true })
})

app.post('/api/lists/:id/fork', async (c) => {
  const u = need(c)
  const id = c.req.param('id')
  const { list } = await getList(c, id)
  const { results } = await c.env.DB.prepare('SELECT text,note FROM items WHERE list_id=? ORDER BY pos').bind(id).all<any>()
  const nid = uid(10), t = now()
  await c.env.DB.prepare('INSERT INTO lists (id,user_id,title,emoji,hue,is_public,created_at,updated_at) VALUES (?,?,?,?,?,1,?,?)')
    .bind(nid, u.id, list.title, list.emoji, list.hue, t, t).run()
  await insertItems(c, nid, results)
  return c.json({ id: nid })
})

/* ---------------- users ---------------- */
app.get('/api/users/:handle', async (c) => {
  const me = c.get('user')
  const h = c.req.param('handle').replace(/^@/, '')
  const u = await c.env.DB.prepare(
    `SELECT id,handle,name,bio,avatar,hue,created_at,
      (SELECT COUNT(*) FROM follows WHERE followee_id=users.id) AS followers,
      (SELECT COUNT(*) FROM follows WHERE follower_id=users.id) AS following,
      EXISTS(SELECT 1 FROM follows WHERE follower_id=? AND followee_id=users.id) AS is_following
     FROM users WHERE handle=?`,
  ).bind(me?.id ?? '', h).first<any>()
  if (!u) throw new HttpErr(404, 'nf')
  const self = me?.id === u.id
  const { results } = await c.env.DB.prepare(
    `${LIST_SELECT} WHERE l.user_id=? ${self ? '' : 'AND l.is_public=1'} ORDER BY l.updated_at DESC`,
  ).bind(me?.id ?? '', u.id).all()
  const { id: _id, ...pub } = u
  return c.json({ user: { ...pub, is_following: !!u.is_following, self }, lists: results.map(shape) })
})

app.post('/api/users/:handle/follow', async (c) => {
  const me = need(c)
  const t = await c.env.DB.prepare('SELECT id FROM users WHERE handle=?').bind(c.req.param('handle')).first<any>()
  if (!t || t.id === me.id) throw new HttpErr(400, 'bad')
  await c.env.DB.prepare('INSERT OR IGNORE INTO follows (follower_id,followee_id,created_at) VALUES (?,?,?)').bind(me.id, t.id, now()).run()
  return c.json({ ok: true })
})
app.delete('/api/users/:handle/follow', async (c) => {
  const me = need(c)
  await c.env.DB.prepare('DELETE FROM follows WHERE follower_id=? AND followee_id=(SELECT id FROM users WHERE handle=?)')
    .bind(me.id, c.req.param('handle')).run()
  return c.json({ ok: true })
})

/* ---------------- AI ---------------- */
function parseJson(txt: unknown) {
  if (txt && typeof txt === 'object') return txt as any
  const m = String(txt ?? '').match(/\{[\s\S]*\}/)
  if (!m) return null
  try { return JSON.parse(m[0]) } catch { return null }
}

/** Provider-agnostic LLM call: OpenAI-compatible endpoint first, Workers AI as fallback. */
async function llm(env: Env, system: string, user: string) {
  if (env.OPENAI_API_KEY) {
    try {
      const base = (env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '')
      const r = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: env.AI_MODEL || 'gpt-5-mini',
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
          response_format: { type: 'json_object' },
        }),
      })
      if (r.ok) {
        const j: any = await r.json()
        const out = parseJson(j.choices?.[0]?.message?.content)
        if (out) return out
        console.error('llm: non-json', String(j.choices?.[0]?.message?.content).slice(0, 200))
      } else console.error('llm', r.status, (await r.text()).slice(0, 200))
    } catch (e) { console.error('llm', e) }
  }
  if (env.AI) {
    const r = await env.AI.run(env.WORKERS_AI_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [{ role: 'system', content: system + '\nRespond with JSON only.' }, { role: 'user', content: user }],
      max_tokens: 1200,
    })
    const out = parseJson(r?.response)
    if (out) return out
  }
  throw new HttpErr(503, 'ai')
}

const SYS_GEN = `You are liiist's list architect. Turn the user's intent into a crisp, high-quality list.
Rules: reply in the SAME language as the user's prompt. Return JSON:
{"title": short title (<=6 words), "emoji": one fitting emoji, "hue": integer 0-359 matching the mood,
 "items": [{"text": concise item (<=12 words), "note": optional very short hint or ""}]}
Produce 6-12 items unless the user asks for a specific count. No numbering, no filler.`

app.post('/api/ai/generate', async (c) => {
  const u = need(c)
  const { prompt, create = true } = await c.req.json<any>()
  const p = clamp(prompt, 500)
  if (!p) throw new HttpErr(400, 'prompt')
  const out = await llm(c.env, SYS_GEN, p)
  const items = (Array.isArray(out.items) ? out.items : []).map((x: any) => (typeof x === 'string' ? { text: x } : x))
  if (!create) return c.json(out)
  const id = uid(10), t = now()
  await c.env.DB.prepare('INSERT INTO lists (id,user_id,title,emoji,hue,is_public,created_at,updated_at) VALUES (?,?,?,?,?,1,?,?)')
    .bind(id, u.id, clamp(out.title, 80) || p.slice(0, 40), clamp(out.emoji, 8) || '✦', Number(out.hue ?? 250) | 0, t, t).run()
  await insertItems(c, id, items)
  return c.json({ id })
})

app.post('/api/lists/:id/ai/suggest', async (c) => {
  const id = c.req.param('id')
  await ownList(c, id)
  const l = await c.env.DB.prepare('SELECT title FROM lists WHERE id=?').bind(id).first<any>()
  const { results } = await c.env.DB.prepare('SELECT text FROM items WHERE list_id=? ORDER BY pos').bind(id).all<any>()
  const out = await llm(
    c.env,
    `You extend lists on liiist. Given a list title and existing items, suggest 5 NEW, non-duplicate, high-value items in the same language and style.
Return JSON {"items":[{"text":"...","note":""}]}.`,
    JSON.stringify({ title: l.title, items: results.map((r) => r.text) }),
  )
  return c.json({ items: (out.items ?? []).slice(0, 8) })
})

app.post('/api/lists/:id/ai/title', async (c) => {
  const id = c.req.param('id')
  await ownList(c, id)
  const { results } = await c.env.DB.prepare('SELECT text FROM items WHERE list_id=? ORDER BY pos LIMIT 30').bind(id).all<any>()
  const out = await llm(
    c.env,
    `Name this list. Same language as items. Return JSON {"title": <=5 words, "emoji": one emoji, "hue": 0-359}.`,
    JSON.stringify(results.map((r) => r.text)),
  )
  return c.json(out)
})

app.all('/api/*', (c) => c.json({ error: 'nf' }, 404))

/* ---------------- OG meta for shared links ---------------- */
const esc = (s: string) => s.replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]!)
async function withMeta(c: any, title: string, desc: string) {
  const res = await c.env.ASSETS.fetch(new URL('/index.html', c.req.url))
  const tags = `<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta name="twitter:card" content="summary">`
  return new HTMLRewriter()
    .on('title', { element: (e) => { e.setInnerContent(title) } })
    .on('head', { element: (e) => { e.append(tags, { html: true }) } })
    .transform(res)
}
app.get('/l/:id', async (c) => {
  const l = await c.env.DB.prepare('SELECT l.title,l.emoji,u.handle FROM lists l JOIN users u ON u.id=l.user_id WHERE l.id=? AND l.is_public=1')
    .bind(c.req.param('id')).first<any>()
  if (!l) return c.env.ASSETS.fetch(new URL('/index.html', c.req.url))
  return withMeta(c, `${l.emoji} ${l.title || 'liiist'}`, `@${l.handle} · liiist`)
})
app.get('/:at{@[A-Za-z0-9_]+}', async (c) => {
  const h = c.req.param('at').slice(1)
  const u = await c.env.DB.prepare('SELECT handle,name,bio FROM users WHERE handle=?').bind(h).first<any>()
  if (!u) return c.env.ASSETS.fetch(new URL('/index.html', c.req.url))
  return withMeta(c, `${u.name} (@${u.handle}) · liiist`, u.bio || 'liiist')
})
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app

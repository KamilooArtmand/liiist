# liiist

AI‑native personal lists — create, share, fork. Minimal, icon‑only UI; web + installable PWA.

## Stack
| Layer | Tech |
|---|---|
| UI | React 19 · React Router 8 · Tailwind CSS 4 (OKLCH theming) · Motion · Lucide · Sonner |
| Data | TanStack Query 5 (optimistic updates) · Zustand (persisted prefs) |
| Edge API | Hono on Cloudflare Workers · D1 (SQLite) · HTMLRewriter OG tags for shared links |
| AI | OpenAI‑compatible chat completions (`gpt-5-mini` default), optional Workers AI fallback |
| App | vite-plugin-pwa (offline shell, installable, standalone) |

## Features
- `@handle` sign‑up/in (PBKDF2 + httpOnly session cookie)
- Lists: emoji, hue, public/private, drag‑reorder, notes, check‑off progress, multi‑line paste
- ✨ AI: generate a whole list from a prompt, suggest more items, auto‑name title/emoji/color
- Social: like, fork, follow, feeds (mine / new / top / following), search lists + people
- Profile `/@handle` with stats & share; public list links `/l/:id` with OG meta
- Settings: avatar + color, handle/name/bio, theme (light/system/dark), FA/EN + RTL, haptics, password, JSON export, account delete
- Every button is icon‑only (`aria-label` + tooltip for accessibility)

## Develop
```bash
npm install
npm run db:migrate            # local D1
cp .dev.vars.example .dev.vars # OPENAI_API_KEY / OPENAI_BASE_URL
npm run build && npm run dev:worker   # http://localhost:8787
# or hot reload: npm run dev (Vite, proxies /api → :8787)
```

## Deploy (Cloudflare)
```bash
npx wrangler d1 create liiist        # put database_id in wrangler.jsonc
npm run db:migrate:remote
npx wrangler secret put OPENAI_API_KEY
npm run deploy
```
Optional: add `"ai": { "binding": "AI" }` to `wrangler.jsonc` to enable the Workers AI fallback.

## API
`/api/auth/{signup,login,logout}` · `/api/me` (GET/PATCH/DELETE) · `/api/me/{password,export}` ·
`/api/feed?tab=new|top|following` · `/api/mine` · `/api/liked` · `/api/search?q=` ·
`/api/lists` · `/api/lists/:id` (+ `/items`, `/reorder`, `/like`, `/fork`, `/ai/suggest`, `/ai/title`) ·
`/api/items/:id` · `/api/users/:handle` (+ `/follow`) · `/api/ai/generate`

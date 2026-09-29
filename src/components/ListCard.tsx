import { motion } from 'motion/react'
import { Link } from 'react-router'
import { Heart, Lock } from 'lucide-react'
import type { ListCard as L } from '../lib/api'
import { Avatar } from './ui'

export function ListCard({ l, showOwner = true, i = 0 }: { l: L; showOwner?: boolean; i?: number }) {
  const pct = l.item_count ? Math.round((l.done_count / l.item_count) * 100) : 0
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
      <Link
        to={`/l/${l.id}`}
        className="hue group relative block overflow-hidden rounded-[24px] border border-line bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/5"
        style={{ ['--h' as any]: l.hue }}
      >
        <div className="glow pointer-events-none absolute inset-x-0 top-0 h-24 opacity-60" />
        <div className="relative flex items-start gap-3">
          <div className="accent-soft grid size-11 shrink-0 place-items-center rounded-2xl text-xl">{l.emoji}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[15px] font-semibold">{l.title || '—'}</h3>
              {!l.is_public && <Lock size={12} className="shrink-0 text-muted" />}
            </div>
            {showOwner && (
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted" dir="ltr">
                <Avatar emoji={l.owner_avatar} hue={l.owner_hue} size={16} />
                <span className="truncate">@{l.handle}</span>
              </div>
            )}
          </div>
        </div>
        <ul className="relative mt-3 space-y-1.5">
          {l.preview.map((p, k) => (
            <li key={k} className="flex items-center gap-2 text-[13px] text-fg/70">
              <span className="accent-bg size-1.5 shrink-0 rounded-full opacity-70" />
              <span className="truncate">{p}</span>
            </li>
          ))}
          {l.item_count > 3 && <li className="ps-3.5 text-xs text-muted">+{l.item_count - 3}</li>}
        </ul>
        <div className="relative mt-4 flex items-center gap-3 text-xs text-muted">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-soft">
            <div className="accent-bg h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="tabular-nums">{l.done_count}/{l.item_count}</span>
          <span className={`flex items-center gap-1 tabular-nums ${l.liked ? 'text-rose-500' : ''}`}>
            <Heart size={13} fill={l.liked ? 'currentColor' : 'none'} />
            {l.like_count}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export function Grid({ lists, showOwner }: { lists: L[]; showOwner?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {lists.map((l, i) => <ListCard key={l.id} l={l} i={i} showOwner={showOwner} />)}
    </div>
  )
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-[24px] bg-soft" />
      ))}
    </div>
  )
}

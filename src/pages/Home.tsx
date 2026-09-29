import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Clock, Flame, Users, LayoutGrid, Sparkles, ListPlus } from 'lucide-react'
import { api, type ListCard } from '../lib/api'
import { useMe, useUI } from '../lib/hooks'
import { Grid, GridSkeleton } from '../components/ListCard'
import { Empty } from '../components/ui'
import { haptic } from '../lib/store'

const TABS = [
  { k: 'mine', icon: LayoutGrid, auth: true },
  { k: 'new', icon: Clock },
  { k: 'top', icon: Flame },
  { k: 'following', icon: Users, auth: true },
] as const

export function Home() {
  const { data: me, isLoading: meLoading } = useMe()
  const [tab, setTab] = useState<string>(() => (me ? 'mine' : 'new'))
  const active = !me && (tab === 'mine' || tab === 'following') ? 'new' : tab
  const q = useQuery({
    queryKey: [active === 'mine' ? 'mine' : 'feed', active],
    queryFn: () => api.get<{ lists: ListCard[] }>(active === 'mine' ? '/mine' : `/feed?tab=${active}`).then((r) => r.lists),
    enabled: !meLoading,
  })

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="sticky top-0 z-30 -mx-4 flex items-center justify-between bg-bg/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight md:hidden" dir="ltr">liiist</h1>
        <div className="flex gap-1 rounded-full bg-soft p-1 md:ms-0 ms-auto">
          {TABS.filter((t) => !('auth' in t) || me).map((t) => (
            <button key={t.k} aria-label={t.k} title={t.k} onClick={() => { haptic(); setTab(t.k) }}
              className={`relative grid h-9 w-11 place-items-center rounded-full transition-colors ${active === t.k ? 'text-fg' : 'text-muted'}`}>
              {active === t.k && <motion.span layoutId="hometab" className="absolute inset-0 rounded-full bg-card shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <t.icon size={17} className="relative" />
            </button>
          ))}
        </div>
      </header>

      {!me && !meLoading && <Hero />}

      {q.isLoading ? <GridSkeleton /> : q.data?.length ? (
        <Grid lists={q.data} showOwner={active !== 'mine'} />
      ) : active === 'mine' ? <MineEmpty /> : <Empty icon={LayoutGrid} />}
    </div>
  )
}

function Hero() {
  const set = useUI((s) => s.set)
  return (
    <section className="hue relative mb-8 overflow-hidden rounded-[32px] border border-line bg-card px-6 py-14 text-center sm:py-20" style={{ ['--h' as any]: 265 }}>
      <div className="glow pointer-events-none absolute inset-0" />
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative text-6xl font-bold tracking-tighter sm:text-8xl" dir="ltr">
        l<span className="accent-text">iii</span>st
      </motion.h2>
      <div className="relative mt-8 flex justify-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} aria-label="start" onClick={() => set({ auth: true })} className="grid size-14 place-items-center rounded-full bg-fg text-bg">
          <ListPlus size={22} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} aria-label="ai" onClick={() => set({ auth: true })} className="accent-bg grid size-14 place-items-center rounded-full text-white">
          <Sparkles size={22} />
        </motion.button>
      </div>
    </section>
  )
}

function MineEmpty() {
  const set = useUI((s) => s.set)
  return (
    <div className="grid place-items-center py-24">
      <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} aria-label="ai" onClick={() => set({ compose: true })}
        className="hue accent-soft accent-text grid size-24 place-items-center rounded-[32px]" style={{ ['--h' as any]: 265 }}>
        <Sparkles size={36} strokeWidth={1.5} />
      </motion.button>
    </div>
  )
}

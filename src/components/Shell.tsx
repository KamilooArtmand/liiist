import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Home, Search, Plus, Sparkles, Settings, Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { useMe, useUI, useRequireAuth } from '../lib/hooks'
import { api } from '../lib/api'
import { Avatar, IconButton } from './ui'
import { AuthSheet } from './AuthSheet'
import { ComposeSheet } from './ComposeSheet'
import { haptic } from '../lib/store'
import { toast } from 'sonner'
import { errText } from '../lib/i18n'
import { useQueryClient } from '@tanstack/react-query'

function Tab({ to, icon: Icon, label, end }: { to: string; icon: any; label: string; end?: boolean }) {
  return (
    <NavLink to={to} end={end} aria-label={label} title={label} onClick={() => haptic()}
      className={({ isActive }) => `relative grid size-12 place-items-center rounded-full transition-colors ${isActive ? 'text-fg' : 'text-muted hover:text-fg'}`}>
      {({ isActive }) => (
        <>
          {isActive && <motion.span layoutId="tab" className="absolute inset-0 rounded-full bg-soft" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
          <Icon size={22} strokeWidth={isActive ? 2.3 : 1.8} className="relative" />
        </>
      )}
    </NavLink>
  )
}

export function Shell() {
  const { data: me } = useMe()
  const set = useUI((s) => s.set)
  const guard = useRequireAuth()
  const nav = useNavigate()
  const qc = useQueryClient()
  const loc = useLocation()

  const newList = guard(async () => {
    try {
      const { id } = await api.post<{ id: string }>('/lists', {})
      qc.invalidateQueries({ queryKey: ['mine'] })
      nav(`/l/${id}?edit=1`)
    } catch (e) { toast.error(errText(e)) }
  })
  const compose = guard(() => set({ compose: true }))
  const profileTo = me ? `/@${me.handle}` : '/@'

  const ProfileTab = () =>
    me ? (
      <NavLink to={profileTo} aria-label="profile" title={`@${me.handle}`} onClick={() => haptic()}
        className={({ isActive }) => `grid size-12 place-items-center rounded-full ${isActive ? 'bg-soft' : ''}`}>
        <Avatar emoji={me.avatar} hue={me.hue} size={30} />
      </NavLink>
    ) : (
      <button aria-label="sign in" title="sign in" onClick={() => set({ auth: true })} className="grid size-12 place-items-center rounded-full">
        <span className="size-7 rounded-full border-2 border-dashed border-muted" />
      </button>
    )

  return (
    <div className="min-h-dvh md:flex">
      {/* desktop rail */}
      <aside className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col items-center gap-2 border-e border-line py-6 md:flex">
        <NavLink to="/" aria-label="liiist" className="mb-6 text-lg font-bold tracking-tight" dir="ltr">
          l<span className="opacity-50">iii</span>
        </NavLink>
        <Tab to="/" end icon={Home} label="home" />
        <Tab to="/search" icon={Search} label="search" />
        <Tab to="/liked" icon={Heart} label="liked" />
        <div className="my-2 flex flex-col gap-2">
          <IconButton icon={Plus} label="new" variant="solid" size="lg" onClick={newList} />
          <IconButton icon={Sparkles} label="ai" variant="soft" size="lg" onClick={compose} />
        </div>
        <div className="flex-1" />
        <Tab to="/settings" icon={Settings} label="settings" />
        <ProfileTab />
      </aside>

      <main key={loc.pathname.split('/')[1]} className="pt-safe min-w-0 flex-1 pb-28 md:pb-10">
        <Outlet />
      </main>

      {/* mobile bar */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 md:hidden">
        <div className="mx-auto mb-3 flex w-[min(92%,420px)] items-center justify-between rounded-full border border-line bg-card/80 px-2 py-1.5 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <Tab to="/" end icon={Home} label="home" />
          <Tab to="/search" icon={Search} label="search" />
          <motion.button whileTap={{ scale: 0.9 }} aria-label="new" title="new"
            onClick={() => { haptic(); newList() }}
            onContextMenu={(e) => { e.preventDefault(); compose() }}
            className="grid size-12 place-items-center rounded-full bg-fg text-bg">
            <Plus size={24} />
          </motion.button>
          <IconButton icon={Sparkles} label="ai" size="md" className="!size-12 text-muted" onClick={compose} />
          <ProfileTab />
        </div>
      </nav>

      <AuthSheet />
      <ComposeSheet />
    </div>
  )
}

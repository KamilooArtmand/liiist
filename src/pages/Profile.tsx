import { useNavigate } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { Share2, UserPlus, UserCheck, Settings, LayoutGrid, CalendarDays, Heart as HeartIcon } from 'lucide-react'
import { toast } from 'sonner'
import { api, type ListCard, type Profile as P } from '../lib/api'
import { share, useRequireAuth } from '../lib/hooks'
import { errText, useT } from '../lib/i18n'
import { Avatar, Empty, IconButton, Spinner } from '../components/ui'
import { Grid } from '../components/ListCard'
import { usePrefs } from '../lib/store'

export function Profile({ handle }: { handle: string }) {
  const h = handle
  const t = useT()
  const nav = useNavigate()
  const qc = useQueryClient()
  const guard = useRequireAuth()
  const lang = usePrefs((s) => s.lang)
  const key = ['user', h]
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: () => api.get<{ user: P; lists: ListCard[] }>(`/users/${encodeURIComponent(h)}`),
    enabled: !!h,
  })

  if (!h || error) return <div className="grid h-[70dvh] place-items-center text-6xl text-muted/40">404</div>
  if (isLoading || !data) return <div className="grid h-[70dvh] place-items-center text-muted"><Spinner /></div>
  const { user: u, lists } = data
  const likes = lists.reduce((a, l) => a + l.like_count, 0)

  const follow = guard(async () => {
    const f = !u.is_following
    qc.setQueryData(key, { ...data, user: { ...u, is_following: f, followers: u.followers + (f ? 1 : -1) } })
    try { f ? await api.post(`/users/${h}/follow`) : await api.del(`/users/${h}/follow`) } catch (e) { toast.error(errText(e)) }
    qc.invalidateQueries({ queryKey: ['feed'] })
  })
  const fmt = new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en', { notation: 'compact' })
  const joined = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en', { year: 'numeric', month: 'short' }).format(u.created_at)

  return (
    <div className="hue mx-auto max-w-5xl px-4 sm:px-6" style={{ ['--h' as any]: u.hue }}>
      <section className="relative overflow-hidden pt-10 pb-8">
        <div className="glow pointer-events-none absolute inset-x-0 -top-10 -z-10 h-80" />
        <div className="flex items-start gap-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Avatar emoji={u.avatar} hue={u.hue} size={88} className="ring-4 ring-bg" />
          </motion.div>
          <div className="flex-1" />
          <div className="flex gap-1.5 pt-2">
            <IconButton icon={Share2} label="share" variant="soft" onClick={() => share(`${location.origin}/@${u.handle}`, `@${u.handle}`, t('copied'), toast)} />
            {u.self ? (
              <IconButton icon={Settings} label="settings" variant="soft" onClick={() => nav('/settings')} />
            ) : (
              <IconButton icon={u.is_following ? UserCheck : UserPlus} label={u.is_following ? 'unfollow' : 'follow'}
                variant={u.is_following ? 'soft' : 'solid'} onClick={follow} />
            )}
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">{u.name || u.handle}</h1>
        <div className="text-muted" dir="ltr" style={{ textAlign: 'start' }}>@{u.handle}</div>
        {u.bio && <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-fg/80 whitespace-pre-line">{u.bio}</p>}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Stat icon={LayoutGrid} v={fmt.format(lists.length)} />
          <Stat icon={UserCheck} v={fmt.format(u.followers)} />
          <Stat icon={UserPlus} v={fmt.format(u.following)} />
          <Stat icon={HeartIcon} v={fmt.format(likes)} />
          <Stat icon={CalendarDays} v={joined} />
        </div>
      </section>

      {lists.length ? <Grid lists={lists} showOwner={false} /> : <Empty icon={LayoutGrid} />}
    </div>
  )
}

function Stat({ icon: Icon, v }: { icon: any; v: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted">
      <Icon size={15} />
      <span className="font-semibold tabular-nums text-fg">{v}</span>
    </span>
  )
}

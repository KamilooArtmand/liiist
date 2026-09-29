import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Search as SearchIcon, X } from 'lucide-react'
import { api, type ListCard, type User } from '../lib/api'
import { useT } from '../lib/i18n'
import { Grid, GridSkeleton } from '../components/ListCard'
import { Avatar, Empty } from '../components/ui'

export function Search() {
  const t = useT()
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState(sp.get('q') ?? '')
  const [dq, setDq] = useState(q)
  useEffect(() => {
    const id = setTimeout(() => { setDq(q.trim()); setSp(q.trim() ? { q: q.trim() } : {}, { replace: true }) }, 250)
    return () => clearTimeout(id)
  }, [q])
  const r = useQuery({
    queryKey: ['search', dq],
    queryFn: () => api.get<{ lists: ListCard[]; users: User[] }>(`/search?q=${encodeURIComponent(dq)}`),
    enabled: !!dq,
  })
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="sticky top-0 z-30 -mx-4 bg-bg/80 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <label className="flex h-12 items-center gap-3 rounded-full bg-soft px-4">
          <SearchIcon size={18} className="text-muted" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} className="flex-1 text-[16px] placeholder:text-muted" />
          {q && <button aria-label="clear" onClick={() => setQ('')} className="text-muted"><X size={18} /></button>}
        </label>
      </div>
      {!dq ? <Empty icon={SearchIcon} /> : r.isLoading ? <GridSkeleton /> : (
        <>
          {!!r.data?.users.length && (
            <div className="no-scrollbar -mx-4 mb-5 flex gap-4 overflow-x-auto px-4">
              {r.data.users.map((u) => (
                <Link key={u.handle} to={`/@${u.handle}`} className="flex w-16 shrink-0 flex-col items-center gap-1.5">
                  <Avatar emoji={u.avatar} hue={u.hue} size={56} />
                  <span className="w-full truncate text-center text-xs text-muted" dir="ltr">@{u.handle}</span>
                </Link>
              ))}
            </div>
          )}
          {r.data?.lists.length ? <Grid lists={r.data.lists} /> : !r.data?.users.length && <Empty icon={SearchIcon} />}
        </>
      )}
    </div>
  )
}

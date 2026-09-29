import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { api, type ListCard } from '../lib/api'
import { useMe } from '../lib/hooks'
import { Grid, GridSkeleton } from '../components/ListCard'
import { Empty } from '../components/ui'

export function Liked() {
  const { data: me } = useMe()
  const q = useQuery({ queryKey: ['liked'], queryFn: () => api.get<{ lists: ListCard[] }>('/liked').then((r) => r.lists), enabled: !!me })
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center gap-2 text-rose-500"><Heart size={22} fill="currentColor" /></div>
      {q.isLoading ? <GridSkeleton /> : q.data?.length ? <Grid lists={q.data} /> : <Empty icon={Heart} />}
    </div>
  )
}

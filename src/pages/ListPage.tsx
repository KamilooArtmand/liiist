import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, Reorder, motion, useDragControls } from 'motion/react'
import {
  ArrowLeft, Share2, Heart, Copy, Trash2, Globe, Lock, Sparkles, Plus, GripVertical, Check, X, Wand2,
  Pencil, Eye, Palette, FileDown, StickyNote, Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { api, type Item, type ListCard } from '../lib/api'
import { share, useRequireAuth } from '../lib/hooks'
import { errText, useT } from '../lib/i18n'
import { haptic } from '../lib/store'
import { Avatar, IconButton, Sheet, Spinner } from '../components/ui'

type Data = { list: ListCard; mine: boolean; items: Item[] }
const EMOJIS = ['✦', '📚', '🎬', '🎧', '✈️', '🍜', '☕', '🛒', '💡', '🎯', '🏋️', '🌱', '🎮', '💼', '🎁', '❤️', '🧳', '📍', '🧠', '🔥', '🌙', '🎨', '🍷', '⚡']

export function ListPage() {
  const { id = '' } = useParams()
  const [sp, setSp] = useSearchParams()
  const nav = useNavigate()
  const qc = useQueryClient()
  const t = useT()
  const guard = useRequireAuth()
  const key = ['list', id]
  const { data, isLoading, error } = useQuery({ queryKey: key, queryFn: () => api.get<Data>(`/lists/${id}`) })
  const [editing, setEditing] = useState(sp.get('edit') === '1')
  const [items, setItems] = useState<Item[]>([])
  const [suggest, setSuggest] = useState<{ text: string; note?: string }[] | null>(null)
  const [aiBusy, setAiBusy] = useState(false)
  const [style, setStyle] = useState(false)
  const reorderTimer = useRef<number>(0)

  useEffect(() => { if (data) setItems(data.items) }, [data])
  useEffect(() => { if (sp.get('edit')) setSp({}, { replace: true }) }, [])

  const patchCache = (fn: (d: Data) => Data) => qc.setQueryData<Data>(key, (d) => (d ? fn(d) : d))
  const refreshLists = () => ['mine', 'feed', 'user', 'liked'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }))

  if (isLoading) return <div className="grid h-[70dvh] place-items-center text-muted"><Spinner /></div>
  if (error || !data) return <div className="grid h-[70dvh] place-items-center text-6xl text-muted/40">404</div>

  const { list, mine } = data
  const canEdit = mine && editing
  const done = items.filter((i) => i.done).length
  const pct = items.length ? (done / items.length) * 100 : 0
  const url = `${location.origin}/l/${list.id}`

  const updateList = async (p: Partial<ListCard>) => {
    patchCache((d) => ({ ...d, list: { ...d.list, ...p } }))
    try { await api.patch(`/lists/${id}`, p); refreshLists() } catch (e) { toast.error(errText(e)) }
  }
  const addItems = async (arr: { text: string; note?: string }[]) => {
    try {
      const r = await api.post<{ items: Item[] }>(`/lists/${id}/items`, { items: arr })
      setItems((x) => [...x, ...r.items])
      patchCache((d) => ({ ...d, items: [...d.items, ...r.items] }))
      refreshLists()
    } catch (e) { toast.error(errText(e)) }
  }
  const updateItem = async (iid: string, p: Partial<Item>) => {
    setItems((x) => x.map((i) => (i.id === iid ? { ...i, ...p } : i)))
    patchCache((d) => ({ ...d, items: d.items.map((i) => (i.id === iid ? { ...i, ...p } : i)) }))
    try { await api.patch(`/items/${iid}`, p); refreshLists() } catch (e) { toast.error(errText(e)) }
  }
  const removeItem = async (iid: string) => {
    haptic(15)
    setItems((x) => x.filter((i) => i.id !== iid))
    patchCache((d) => ({ ...d, items: d.items.filter((i) => i.id !== iid) }))
    try { await api.del(`/items/${iid}`); refreshLists() } catch (e) { toast.error(errText(e)) }
  }
  const onReorder = (next: Item[]) => {
    setItems(next)
    clearTimeout(reorderTimer.current)
    reorderTimer.current = window.setTimeout(() => {
      api.post(`/lists/${id}/reorder`, { ids: next.map((i) => i.id) }).catch(() => {})
      patchCache((d) => ({ ...d, items: next }))
    }, 400)
  }
  const like = guard(async () => {
    haptic(12)
    const liked = !list.liked
    patchCache((d) => ({ ...d, list: { ...d.list, liked, like_count: d.list.like_count + (liked ? 1 : -1) } }))
    try { liked ? await api.post(`/lists/${id}/like`) : await api.del(`/lists/${id}/like`); refreshLists() } catch (e) { toast.error(errText(e)) }
  })
  const fork = guard(async () => {
    try { const r = await api.post<{ id: string }>(`/lists/${id}/fork`); refreshLists(); nav(`/l/${r.id}`) } catch (e) { toast.error(errText(e)) }
  })
  const remove = async () => {
    if (!confirm(t('confirm'))) return
    await api.del(`/lists/${id}`)
    refreshLists()
    nav('/', { replace: true })
  }
  const aiSuggest = async () => {
    setAiBusy(true)
    try { const r = await api.post<{ items: { text: string; note?: string }[] }>(`/lists/${id}/ai/suggest`); setSuggest(r.items) }
    catch (e) { toast.error(errText(e)) } finally { setAiBusy(false) }
  }
  const aiTitle = async () => {
    setAiBusy(true)
    try { const r = await api.post<{ title: string; emoji: string; hue: number }>(`/lists/${id}/ai/title`); await updateList(r) }
    catch (e) { toast.error(errText(e)) } finally { setAiBusy(false) }
  }
  const exportMd = () => {
    const md = `# ${list.emoji} ${list.title}\n\n${items.map((i) => `- [${i.done ? 'x' : ' '}] ${i.text}${i.note ? ` — ${i.note}` : ''}`).join('\n')}\n`
    navigator.clipboard.writeText(md)
    toast(t('copied'))
  }

  return (
    <div className="hue relative mx-auto max-w-2xl px-4 sm:px-6" style={{ ['--h' as any]: list.hue }}>
      <div className="glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-72" />

      {/* toolbar */}
      <header className="sticky top-0 z-30 -mx-4 flex items-center gap-1 bg-bg/70 px-3 py-3 backdrop-blur-xl sm:-mx-6 sm:px-5">
        <IconButton icon={ArrowLeft} label="back" className="rtl:[&_svg]:rotate-180" onClick={() => (history.length > 1 ? nav(-1) : nav('/'))} />
        <div className="flex-1" />
        {mine && (
          <IconButton icon={editing ? Eye : Pencil} label={editing ? 'view' : 'edit'} active={editing} onClick={() => setEditing((v) => !v)} />
        )}
        {mine && editing && <IconButton icon={list.is_public ? Globe : Lock} label="visibility" onClick={() => updateList({ is_public: !list.is_public })} />}
        {mine && editing && <IconButton icon={Palette} label="style" onClick={() => setStyle(true)} />}
        {!mine && <IconButton icon={Copy} label="fork" onClick={fork} />}
        <IconButton icon={FileDown} label="markdown" onClick={exportMd} />
        <IconButton icon={Heart} label="like" fill={list.liked} className={list.liked ? '!text-rose-500' : ''} onClick={like} />
        <IconButton icon={Share2} label="share" onClick={() => share(url, list.title, t('copied'), toast)} />
        {mine && editing && <IconButton icon={Trash2} label="delete" className="hover:!text-rose-500" onClick={remove} />}
      </header>

      {/* title */}
      <section className="pt-6 pb-8">
        <motion.button whileTap={{ scale: 0.9 }} disabled={!canEdit} onClick={() => setStyle(true)} aria-label="emoji"
          className="accent-soft grid size-20 place-items-center rounded-[28px] text-4xl shadow-sm">
          {list.emoji}
        </motion.button>
        <div className="mt-5 flex items-center gap-2">
          {canEdit ? (
            <input defaultValue={list.title} key={list.title} placeholder={t('title')}
              onBlur={(e) => e.target.value !== list.title && updateList({ title: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              className="min-w-0 flex-1 text-3xl font-bold tracking-tight placeholder:text-muted/50 sm:text-4xl" />
          ) : (
            <h1 className="flex-1 text-3xl font-bold tracking-tight sm:text-4xl">{list.title || '—'}</h1>
          )}
          {canEdit && <IconButton icon={aiBusy ? LoaderIcon : Wand2} label="ai title" variant="soft" className={aiBusy ? '[&_svg]:animate-spin' : ''} disabled={aiBusy || !items.length} onClick={aiTitle} />}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Link to={`/@${list.handle}`} className="flex items-center gap-2 text-sm text-muted hover:text-fg" dir="ltr">
            <Avatar emoji={list.owner_avatar} hue={list.owner_hue} size={24} />
            @{list.handle}
          </Link>
          <div className="flex-1" />
          <span className="text-xs tabular-nums text-muted">{done}/{items.length}</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-soft">
            <motion.div className="accent-bg h-full rounded-full" animate={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      {/* items */}
      <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-1.5">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <Row key={it.id} it={it} canEdit={canEdit} mine={mine}
              onToggle={() => { haptic(10); updateItem(it.id, { done: !it.done }) }}
              onText={(text) => updateItem(it.id, { text })}
              onNote={(note) => updateItem(it.id, { note })}
              onRemove={() => removeItem(it.id)} />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {canEdit && <AddRow onAdd={(texts) => addItems(texts.map((text) => ({ text })))} placeholder={t('add')} />}

      {canEdit && (
        <div className="mt-6 flex justify-center">
          <motion.button whileTap={{ scale: 0.9 }} aria-label="ai suggest" title="ai" disabled={aiBusy} onClick={aiSuggest}
            className="accent-soft accent-text grid size-14 place-items-center rounded-full disabled:opacity-50">
            {aiBusy ? <Spinner /> : <Sparkles size={22} />}
          </motion.button>
        </div>
      )}

      {/* AI suggestions */}
      <Sheet open={!!suggest} onClose={() => setSuggest(null)}>
        <div className="mb-3 flex items-center justify-between text-muted">
          <Sparkles size={18} />
          <IconButton icon={Check} label="add all" variant="solid" size="sm" onClick={() => { addItems(suggest!); setSuggest(null) }} />
        </div>
        <ul className="max-h-[60dvh] space-y-1.5 overflow-y-auto">
          {suggest?.map((s, i) => (
            <motion.li key={s.text} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-2 rounded-2xl bg-soft p-3">
              <div className="min-w-0 flex-1">
                <div className="text-[15px]">{s.text}</div>
                {s.note && <div className="text-xs text-muted">{s.note}</div>}
              </div>
              <IconButton icon={X} label="skip" size="sm" onClick={() => setSuggest((x) => x!.filter((_, k) => k !== i))} />
              <IconButton icon={Plus} label="add" size="sm" variant="solid" onClick={() => { addItems([s]); setSuggest((x) => x!.filter((_, k) => k !== i)) }} />
            </motion.li>
          ))}
        </ul>
      </Sheet>

      {/* style */}
      <Sheet open={style} onClose={() => setStyle(false)}>
        <div className="grid grid-cols-6 gap-2">
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => updateList({ emoji: e })}
              className={`grid aspect-square place-items-center rounded-2xl text-2xl transition ${list.emoji === e ? 'accent-soft ring-2 ring-fg/10' : 'hover:bg-soft'}`}>{e}</button>
          ))}
        </div>
        <HueSlider value={list.hue} onChange={(hue) => updateList({ hue })} />
      </Sheet>
    </div>
  )
}

const LoaderIcon = Loader2

export function HueSlider({ value, onChange }: { value: number; onChange: (h: number) => void }) {
  const [v, setV] = useState(value)
  useEffect(() => setV(value), [value])
  return (
    <input type="range" min={0} max={359} value={v} aria-label="hue"
      onChange={(e) => setV(+e.target.value)} onPointerUp={() => onChange(v)} onKeyUp={() => onChange(v)}
      className="mt-5 h-3 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-lg"
      style={{ background: `linear-gradient(to right, ${Array.from({ length: 13 }, (_, i) => `oklch(0.72 0.16 ${i * 30})`).join(',')})` }} />
  )
}

function Row({ it, canEdit, mine, onToggle, onText, onNote, onRemove }: {
  it: Item; canEdit: boolean; mine: boolean
  onToggle: () => void; onText: (s: string) => void; onNote: (s: string) => void; onRemove: () => void
}) {
  const controls = useDragControls()
  const t = useT()
  const [noteOpen, setNoteOpen] = useState(false)
  return (
    <Reorder.Item value={it} dragListener={false} dragControls={controls}
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      className="group relative list-none">
      <div className="flex items-start gap-2 rounded-2xl border border-transparent bg-card/60 px-2 py-2 transition hover:border-line">
        {canEdit && (
          <button aria-label="drag" onPointerDown={(e) => controls.start(e)} className="mt-1.5 cursor-grab touch-none text-muted/50 active:cursor-grabbing">
            <GripVertical size={16} />
          </button>
        )}
        <motion.button whileTap={{ scale: 0.8 }} aria-label="toggle" disabled={!mine} onClick={onToggle}
          className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${it.done ? 'accent-bg border-transparent text-white' : 'border-line'}`}>
          <AnimatePresence>{it.done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check size={14} strokeWidth={3} /></motion.span>}</AnimatePresence>
        </motion.button>
        <div className="min-w-0 flex-1 py-0.5">
          {canEdit ? (
            <input defaultValue={it.text} onBlur={(e) => e.target.value.trim() && e.target.value !== it.text && onText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
              className={`w-full text-[16px] ${it.done ? 'text-muted line-through' : ''}`} />
          ) : (
            <div className={`text-[16px] transition ${it.done ? 'text-muted line-through' : ''}`}>{it.text}</div>
          )}
          {canEdit && (noteOpen || it.note) ? (
            <input defaultValue={it.note} autoFocus={noteOpen && !it.note} placeholder={t('note')}
              onBlur={(e) => { e.target.value !== it.note && onNote(e.target.value); setNoteOpen(false) }}
              className="mt-0.5 w-full text-[13px] text-muted placeholder:text-muted/50" />
          ) : it.note ? <div className="mt-0.5 text-[13px] text-muted">{it.note}</div> : null}
        </div>
        {canEdit && (
          <div className="flex opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            {!it.note && <IconButton icon={StickyNote} label="note" size="sm" onClick={() => setNoteOpen(true)} />}
            <IconButton icon={X} label="remove" size="sm" onClick={onRemove} />
          </div>
        )}
      </div>
    </Reorder.Item>
  )
}

function AddRow({ onAdd, placeholder }: { onAdd: (s: string[]) => void; placeholder: string }) {
  const [v, setV] = useState('')
  const submit = () => {
    const lines = v.split('\n').map((s) => s.trim()).filter(Boolean)
    if (lines.length) onAdd(lines)
    setV('')
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit() }} className="mt-2 flex items-center gap-2 rounded-2xl border border-dashed border-line px-3 py-2">
      <Plus size={18} className="text-muted" />
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder}
        onPaste={(e) => {
          const txt = e.clipboardData.getData('text')
          if (txt.includes('\n')) { e.preventDefault(); onAdd(txt.split('\n').map((s) => s.replace(/^\s*(?:[-*•]|\d+[.)])?\s*(?:\[[ xX]?\])?\s*/, '').trim()).filter(Boolean)); }
        }}
        className="h-9 flex-1 text-[16px] placeholder:text-muted" />
      {v.trim() && <IconButton icon={Check} label="add" size="sm" variant="solid" type="submit" />}
    </form>
  )
}

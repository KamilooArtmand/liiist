import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArrowUp, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { useUI } from '../lib/hooks'
import { errText, useT } from '../lib/i18n'
import { usePrefs } from '../lib/store'
import { Sheet } from './ui'

const SEEDS = {
  fa: ['🎬 فیلم‌های علمی‌تخیلی', '✈️ سفر ۳ روزه به شیراز', '📚 کتاب برای شروع فلسفه', '🧳 وسایل کمپینگ'],
  en: ['🎬 Sci‑fi films', '✈️ 3 days in Tokyo', '📚 Philosophy starters', '🧳 Camping gear'],
}

export function ComposeSheet() {
  const open = useUI((s) => s.compose)
  const set = useUI((s) => s.set)
  const lang = usePrefs((s) => s.lang)
  const t = useT()
  const nav = useNavigate()
  const qc = useQueryClient()
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)

  const go = async (prompt = q) => {
    if (!prompt.trim() || busy) return
    setBusy(true)
    try {
      const { id } = await api.post<{ id: string }>('/ai/generate', { prompt })
      qc.invalidateQueries({ queryKey: ['mine'] })
      set({ compose: false })
      setQ('')
      nav(`/l/${id}`)
    } catch (e) { toast.error(errText(e)) } finally { setBusy(false) }
  }

  return (
    <Sheet open={open} onClose={() => !busy && set({ compose: false })}>
      <div className="mb-4 flex items-center gap-2 text-muted">
        <motion.span animate={busy ? { rotate: 360 } : { rotate: 0 }} transition={busy ? { repeat: Infinity, duration: 1.4, ease: 'linear' } : {}}>
          <Sparkles size={18} />
        </motion.span>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); go() }} className="relative">
        <textarea
          autoFocus rows={3} value={q} disabled={busy}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go() } }}
          placeholder={t('ask')}
          className="w-full resize-none rounded-3xl bg-soft p-4 pe-14 text-lg placeholder:text-muted"
        />
        <button type="submit" aria-label="generate" disabled={!q.trim() || busy}
          className="absolute bottom-3 end-3 grid size-10 place-items-center rounded-full bg-fg text-bg transition active:scale-90 disabled:opacity-30">
          <ArrowUp size={20} />
        </button>
      </form>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
        {SEEDS[lang].map((s) => (
          <button key={s} disabled={busy} onClick={() => { setQ(s); go(s) }}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm text-fg/80 transition hover:bg-soft disabled:opacity-40">
            {s}
          </button>
        ))}
      </div>
      {busy && (
        <div className="mt-4 space-y-2">
          {[80, 65, 72, 50].map((w, i) => (
            <motion.div key={i} className="h-3 rounded-full bg-soft" style={{ width: `${w}%` }}
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }} />
          ))}
        </div>
      )}
    </Sheet>
  )
}

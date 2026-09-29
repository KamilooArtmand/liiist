import { useEffect, useState } from 'react'
import { ArrowRight, Check, X, UserPlus, LogIn } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '../lib/api'
import { useUI } from '../lib/hooks'
import { errText, useT } from '../lib/i18n'
import { Field, IconButton, Sheet, Spinner } from './ui'

export function AuthSheet() {
  const open = useUI((s) => s.auth)
  const set = useUI((s) => s.set)
  const t = useT()
  const qc = useQueryClient()
  const [mode, setMode] = useState<'signup' | 'login'>('signup')
  const [handle, setHandle] = useState('')
  const [pass, setPass] = useState('')
  const [avail, setAvail] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (mode !== 'signup' || handle.length < 3) return setAvail(null)
    const id = setTimeout(() => api.get<{ available: boolean }>(`/handle/${encodeURIComponent(handle)}`).then((r) => setAvail(r.available)).catch(() => {}), 300)
    return () => clearTimeout(id)
  }, [handle, mode])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await api.post(`/auth/${mode}`, { handle, password: pass })
      await qc.invalidateQueries()
      set({ auth: false })
      setPass('')
    } catch (err) {
      toast.error(errText(err))
    } finally { setBusy(false) }
  }

  return (
    <Sheet open={open} onClose={() => set({ auth: false })}>
      <form onSubmit={submit} className="space-y-3">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-3xl font-bold tracking-tight" dir="ltr">liiist</div>
          <div className="flex gap-1 rounded-full bg-soft p-1">
            <IconButton type="button" icon={UserPlus} label="sign up" size="sm" active={mode === 'signup'} className={mode === 'signup' ? '!bg-card shadow' : ''} onClick={() => setMode('signup')} />
            <IconButton type="button" icon={LogIn} label="log in" size="sm" active={mode === 'login'} className={mode === 'login' ? '!bg-card shadow' : ''} onClick={() => setMode('login')} />
          </div>
        </div>
        <div dir="ltr" className="relative">
          <Field prefix="@" placeholder={t('handle')} autoFocus autoCapitalize="off" autoCorrect="off" spellCheck={false}
            value={handle} onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, '').toLowerCase().slice(0, 20))} />
          {mode === 'signup' && avail !== null && (
            <span className={`absolute end-4 top-1/2 -translate-y-1/2 ${avail ? 'text-emerald-500' : 'text-rose-500'}`}>
              {avail ? <Check size={18} /> : <X size={18} />}
            </span>
          )}
        </div>
        <div dir="ltr">
          <Field type="password" placeholder={t('password')} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" aria-label="continue" disabled={busy || handle.length < 3 || pass.length < 6 || (mode === 'signup' && avail === false)}
            className="grid size-14 place-items-center rounded-full bg-fg text-bg transition active:scale-90 disabled:opacity-30">
            {busy ? <Spinner /> : <ArrowRight size={22} className="rtl:rotate-180" />}
          </button>
        </div>
      </form>
    </Sheet>
  )
}

import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  Sun, Moon, Monitor, Languages, Vibrate, LogOut, Trash2, Download, KeyRound, AtSign, User, Text, Check, Palette, Smile,
} from 'lucide-react'
import { toast } from 'sonner'
import { api, type User as U } from '../lib/api'
import { useMe, useUI } from '../lib/hooks'
import { errText, useT } from '../lib/i18n'
import { usePrefs, type Theme } from '../lib/store'
import { Avatar, IconButton, Sheet, Toggle } from '../components/ui'
import { HueSlider } from './ListPage'

const AVATARS = ['✦', '🦊', '🐼', '🦉', '🐙', '🌵', '🍄', '🌊', '🪐', '🔮', '🎧', '🧊', '🌸', '🦋', '🐚', '⚡', '🍋', '👾']

function Group({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-card">{children}</div>
}
function Row({ icon: Icon, children }: { icon: any; children: ReactNode }) {
  return (
    <div className="flex min-h-14 items-center gap-3 px-4 py-2">
      <Icon size={19} className="shrink-0 text-muted" />
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">{children}</div>
    </div>
  )
}

export function Settings() {
  const { data: me } = useMe()
  const prefs = usePrefs()
  const setUI = useUI((s) => s.set)
  const t = useT()
  const qc = useQueryClient()
  const nav = useNavigate()
  const [form, setForm] = useState<Partial<U>>({})
  const [pw, setPw] = useState(false)
  const [avatarSheet, setAvatarSheet] = useState(false)

  useEffect(() => { if (me) setForm(me) }, [me])
  const dirty = me && (['name', 'bio', 'handle', 'avatar', 'hue'] as const).some((k) => form[k] !== me[k])

  const save = async (patch = form) => {
    try {
      const r = await api.patch<{ user: U }>('/me', patch)
      qc.setQueryData(['me'], r.user)
      qc.invalidateQueries({ queryKey: ['user'] })
      toast(t('saved'))
    } catch (e) { toast.error(errText(e)) }
  }
  const logout = async () => { await api.post('/auth/logout'); qc.clear(); nav('/') ; qc.invalidateQueries() }
  const wipe = async () => {
    if (!confirm(t('confirm')) || !confirm(t('confirm'))) return
    await api.del('/me'); qc.clear(); nav('/'); qc.invalidateQueries()
  }
  const exp = async () => {
    const data = await api.get('/me/export')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = `liiist-${me?.handle}.json`
    a.click()
  }

  const themes: { k: Theme; icon: any }[] = [{ k: 'light', icon: Sun }, { k: 'system', icon: Monitor }, { k: 'dark', icon: Moon }]

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6 sm:px-6">
      {me && (
        <>
          <div className="flex items-center gap-4 py-4">
            <button aria-label="avatar" onClick={() => setAvatarSheet(true)} className="transition active:scale-90">
              <Avatar emoji={form.avatar ?? me.avatar} hue={form.hue ?? me.hue} size={72} />
            </button>
            <div className="flex-1" />
            {dirty && <IconButton icon={Check} label="save" variant="solid" onClick={() => save()} />}
          </div>
          <Group>
            <Row icon={AtSign}>
              <input dir="ltr" value={form.handle ?? ''} onChange={(e) => setForm({ ...form, handle: e.target.value.replace(/[^a-z0-9_]/gi, '').toLowerCase().slice(0, 20) })}
                className="w-full text-end text-[15px]" aria-label={t('handle')} />
            </Row>
            <Row icon={User}>
              <input value={form.name ?? ''} placeholder={t('name')} maxLength={40} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-end text-[15px] placeholder:text-muted" />
            </Row>
            <Row icon={Text}>
              <textarea value={form.bio ?? ''} placeholder={t('bio')} maxLength={160} rows={2} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full resize-none py-2 text-end text-[15px] placeholder:text-muted" />
            </Row>
          </Group>
        </>
      )}

      <Group>
        <Row icon={Palette}>
          <div className="flex gap-1 rounded-full bg-soft p-1">
            {themes.map((x) => (
              <IconButton key={x.k} icon={x.icon} label={x.k} size="sm" active={prefs.theme === x.k}
                className={prefs.theme === x.k ? '!bg-card shadow' : ''} onClick={() => prefs.set({ theme: x.k })} />
            ))}
          </div>
        </Row>
        <Row icon={Languages}>
          <div className="flex gap-1 rounded-full bg-soft p-1 text-sm font-semibold">
            {(['fa', 'en'] as const).map((l) => (
              <button key={l} aria-label={l} onClick={() => prefs.set({ lang: l })}
                className={`grid h-8 w-10 place-items-center rounded-full transition ${prefs.lang === l ? 'bg-card shadow' : 'text-muted'}`}>
                {l === 'fa' ? 'فا' : 'EN'}
              </button>
            ))}
          </div>
        </Row>
        <Row icon={Vibrate}><Toggle on={prefs.haptics} label="haptics" onChange={(v) => prefs.set({ haptics: v })} /></Row>
      </Group>

      {me ? (
        <Group>
          <Row icon={KeyRound}><IconButton icon={KeyRound} label="password" size="sm" variant="soft" onClick={() => setPw(true)} /></Row>
          <Row icon={Download}><IconButton icon={Download} label="export" size="sm" variant="soft" onClick={exp} /></Row>
          <Row icon={LogOut}><IconButton icon={LogOut} label="log out" size="sm" variant="soft" onClick={logout} /></Row>
          <Row icon={Trash2}><IconButton icon={Trash2} label="delete account" size="sm" variant="soft" className="!text-rose-500" onClick={wipe} /></Row>
        </Group>
      ) : (
        <div className="flex justify-center pt-6">
          <IconButton icon={User} label="sign in" variant="solid" size="lg" onClick={() => setUI({ auth: true })} />
        </div>
      )}

      <div className="pt-6 text-center text-xs tracking-widest text-muted/60" dir="ltr">liiist · v1</div>

      <PasswordSheet open={pw} onClose={() => setPw(false)} />
      <Sheet open={avatarSheet} onClose={() => setAvatarSheet(false)}>
        <div className="mb-2 flex items-center text-muted"><Smile size={18} /></div>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((a) => (
            <button key={a} onClick={() => setForm({ ...form, avatar: a })}
              className={`grid aspect-square place-items-center rounded-2xl text-2xl transition ${form.avatar === a ? 'bg-soft ring-2 ring-fg/10' : 'hover:bg-soft'}`}>{a}</button>
          ))}
        </div>
        <HueSlider value={form.hue ?? 250} onChange={(hue) => setForm({ ...form, hue })} />
        <div className="mt-5 flex justify-end">
          <IconButton icon={Check} label="save" variant="solid" onClick={() => { save(); setAvatarSheet(false) }} />
        </div>
      </Sheet>
    </div>
  )
}

function PasswordSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const [cur, setCur] = useState('')
  const [nxt, setNxt] = useState('')
  const go = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await api.post('/me/password', { current: cur, next: nxt }); toast(t('saved')); setCur(''); setNxt(''); onClose() }
    catch (err) { toast.error(errText(err)) }
  }
  return (
    <Sheet open={open} onClose={onClose}>
      <form onSubmit={go} className="space-y-3" dir="ltr">
        <input type="password" autoComplete="current-password" placeholder={t('current')} value={cur} onChange={(e) => setCur(e.target.value)} className="h-12 w-full rounded-2xl bg-soft px-4 placeholder:text-muted" />
        <input type="password" autoComplete="new-password" placeholder={t('next')} value={nxt} onChange={(e) => setNxt(e.target.value)} className="h-12 w-full rounded-2xl bg-soft px-4 placeholder:text-muted" />
        <div className="flex justify-end"><IconButton icon={Check} label="save" variant="solid" type="submit" disabled={!cur || nxt.length < 6} /></div>
      </form>
    </Sheet>
  )
}

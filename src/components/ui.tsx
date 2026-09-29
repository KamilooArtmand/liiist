import { AnimatePresence, motion } from 'motion/react'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode, useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import { haptic } from '../lib/store'

type IBProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon
  label: string
  variant?: 'ghost' | 'solid' | 'soft' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  fill?: boolean
}
const sizes = { sm: 'size-8', md: 'size-10', lg: 'size-14' }
const iconSize = { sm: 16, md: 19, lg: 24 }
const variants = {
  ghost: 'text-fg/80 hover:bg-soft',
  soft: 'bg-soft text-fg hover:bg-line',
  solid: 'bg-fg text-bg hover:opacity-90',
  accent: 'accent-bg text-white hover:brightness-105',
}

/** Icon-only button. `label` is exposed only to assistive tech + native tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IBProps>(function IconButton(
  { icon: Icon, label, variant = 'ghost', size = 'md', active, fill, className = '', onClick, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      aria-label={label}
      title={label}
      onClick={(e) => { haptic(); onClick?.(e) }}
      className={`inline-grid shrink-0 place-items-center rounded-full transition-colors disabled:opacity-40 ${sizes[size]} ${variants[variant]} ${active ? '!text-fg bg-soft' : ''} ${className}`}
      {...(rest as any)}
    >
      <Icon size={iconSize[size]} strokeWidth={active ? 2.4 : 1.9} fill={fill ? 'currentColor' : 'none'} />
    </motion.button>
  )
})

export function Avatar({ emoji, hue, size = 40, className = '' }: { emoji: string; hue: number; size?: number; className?: string }) {
  return (
    <div
      className={`hue accent-soft grid shrink-0 place-items-center rounded-full ${className}`}
      style={{ ['--h' as any]: hue, width: size, height: size, fontSize: size * 0.48 }}
    >
      <span className="leading-none">{emoji}</span>
    </div>
  )
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            className="pb-safe relative w-full max-w-md rounded-t-[28px] border border-line bg-card p-5 shadow-2xl sm:rounded-[28px]"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { prefix?: string }) {
  const { prefix, className = '', ...rest } = props
  return (
    <label className={`flex h-12 items-center gap-1 rounded-2xl bg-soft px-4 text-[15px] focus-within:ring-2 focus-within:ring-fg/10 ${className}`}>
      {prefix && <span className="text-muted" dir="ltr">{prefix}</span>}
      <input className="min-w-0 flex-1 placeholder:text-muted" {...rest} />
    </label>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return <span className={`inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} />
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      title={label}
      onClick={() => { haptic(); onChange(!on) }}
      className={`relative h-7 w-12 rounded-full transition-colors ${on ? 'bg-fg' : 'bg-line'}`}
    >
      <motion.span layout transition={{ type: 'spring', stiffness: 700, damping: 35 }} className={`absolute top-1 size-5 rounded-full bg-bg shadow ${on ? 'end-1' : 'start-1'}`} />
    </button>
  )
}

export function Empty({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="grid place-items-center py-24 text-muted/60">
      <Icon size={40} strokeWidth={1.3} />
    </div>
  )
}

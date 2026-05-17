import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, MoonStar, Monitor, Check } from 'lucide-react'
import {
  THEME_OPTIONS,
  useThemeStore,
  type ThemePreference,
} from '@/stores/theme'
import { cn } from '@/lib/cn'

const ICONS: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  'dark-soft': MoonStar,
  system: Monitor,
}

/**
 * Theme selector for the TopBar. A compact icon button that opens a
 * 4-option menu (light / dark / dark-soft / system). Closes on outside
 * click or Escape. The actual theme application is handled by the store
 * (useThemeSync) — this component only writes the preference.
 */
export function ThemeToggle() {
  const preference = useThemeStore((s) => s.preference)
  const setPreference = useThemeStore((s) => s.setPreference)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const CurrentIcon = ICONS[preference]

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Changer le thème"
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid place-items-center w-9 h-9 rounded-md border border-line/70 text-ink-mute hover:text-ink hover:border-line transition-colors"
      >
        <CurrentIcon className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-44 panel p-1.5 z-50"
          >
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-ink-dim">
              Thème
            </div>
            {THEME_OPTIONS.map((opt) => {
              const Icon = ICONS[opt.value]
              const active = preference === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setPreference(opt.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors',
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'text-ink-mute hover:text-ink hover:bg-bg-elev',
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{opt.label}</span>
                  {active && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

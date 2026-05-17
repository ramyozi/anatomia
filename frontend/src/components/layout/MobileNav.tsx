import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, MoonStar, Monitor } from 'lucide-react'
import {
  THEME_OPTIONS,
  useThemeStore,
  type ThemePreference,
} from '@/stores/theme'
import { cn } from '@/lib/cn'

/**
 * Mobile navigation: a hamburger button (shown only below ``md``) that
 * opens a right-side slide-in drawer with the full nav, plus a theme
 * picker. On desktop the regular TopBar nav is used instead, so this
 * component renders nothing visible there.
 *
 * The drawer closes on: link tap, route change, backdrop tap, Escape.
 * Body scroll is locked while open and focus is trapped to the panel.
 */

interface NavItem {
  to: string
  label: string
}

const THEME_ICONS: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  'dark-soft': MoonStar,
  system: Monitor,
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const preference = useThemeStore((s) => s.preference)
  const setPreference = useThemeStore((s) => s.setPreference)

  // Close on route change.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Lock body scroll + wire Escape while the drawer is open.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        className="md:hidden grid place-items-center w-11 h-11 rounded-md border border-line/70 text-ink-mute hover:text-ink active:scale-95 transition"
      >
        <Menu className="w-5 h-5" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[60] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
                onClick={() => setOpen(false)}
              />

              {/* Drawer panel */}
              <motion.aside
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                className="absolute right-0 top-0 h-full w-[78%] max-w-[320px] bg-bg-panel border-l border-line/70 flex flex-col safe-pt safe-pb"
              >
                <div className="flex items-center justify-between px-5 h-16 border-b border-line/60">
                  <span className="font-display text-lg tracking-tight">
                    Anatomia
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Fermer le menu"
                    className="grid place-items-center w-11 h-11 -mr-2 rounded-md text-ink-mute hover:text-ink"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                  {items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center px-4 min-h-[48px] rounded-lg text-[15px] transition-colors',
                          isActive
                            ? 'bg-accent/10 text-accent border border-accent/30'
                            : 'text-ink-mute hover:text-ink hover:bg-bg-elev',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="px-5 py-4 border-t border-line/60">
                  <div className="text-[10px] uppercase tracking-wider text-ink-dim mb-2">
                    Thème
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {THEME_OPTIONS.map((opt) => {
                      const Icon = THEME_ICONS[opt.value]
                      const active = preference === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPreference(opt.value)}
                          aria-pressed={active}
                          className={cn(
                            'flex items-center gap-2 px-3 min-h-[44px] rounded-lg text-sm border transition-colors',
                            active
                              ? 'bg-accent/10 text-accent border-accent/40'
                              : 'text-ink-mute border-line/60 hover:text-ink',
                          )}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

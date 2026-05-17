import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'

/**
 * Mobile bottom sheet for tool pages (3D viewer, world map).
 *
 * On mobile the interactive content (canvas / map) owns the screen; the
 * controls + lists live in this sheet instead of being stacked above
 * the content. A persistent "peek" bar sits at the bottom edge — one tap
 * expands the sheet to a scrollable panel, tap the backdrop / handle to
 * collapse.
 *
 * The expanded content is a SINGLE scroll container with
 * ``overscroll-contain`` so there is never scroll-chaining / nested
 * scroll. Renders nothing on ``lg`` and up (desktop keeps its sidebars).
 */

interface Props {
  /** Short label shown on the collapsed peek bar. */
  title: string
  /** Optional badge text on the right of the peek bar (eg a count). */
  badge?: string
  children: ReactNode
}

export function MobileSheet({ title, badge, children }: Props) {
  const [open, setOpen] = useState(false)

  // Lock body scroll + Escape-to-close while expanded.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="lg:hidden">
      {/* Persistent peek bar — the entry point, hidden while expanded. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label={`Ouvrir : ${title}`}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2.5 h-14 px-5 pb-[env(safe-area-inset-bottom)] bg-bg-panel/95 backdrop-blur border-t border-line/70"
        >
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 h-1 w-9 rounded-full bg-line" />
          <ChevronUp className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-sm text-ink font-medium truncate">{title}</span>
          {badge && (
            <span className="ml-auto text-[11px] text-ink-dim font-mono">
              {badge}
            </span>
          )}
        </button>
      )}

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 z-40 lg:hidden bg-bg/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                className="fixed inset-x-0 bottom-0 z-50 lg:hidden h-[82dvh] flex flex-col bg-bg-panel border-t border-line/70 rounded-t-2xl shadow-panel"
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Réduire le panneau"
                  className="relative flex items-center gap-2.5 h-14 px-5 flex-shrink-0 border-b border-line/60"
                >
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-9 rounded-full bg-line" />
                  <ChevronDown className="w-4 h-4 text-ink-mute flex-shrink-0" />
                  <span className="text-sm text-ink font-medium truncate">
                    {title}
                  </span>
                  {badge && (
                    <span className="ml-auto text-[11px] text-ink-dim font-mono">
                      {badge}
                    </span>
                  )}
                </button>

                {/* Single scroll container — overscroll-contain stops any
                    scroll-chaining to the page / canvas behind. */}
                <div className="flex-1 overflow-y-auto overscroll-contain pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                  {children}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { SearchResult } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
}

export function GlobalSearch({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) onClose()
        else inputRef.current?.focus()
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
    else setQuery('')
  }, [open])

  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => api.get<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  })

  function go(r: SearchResult) {
    onClose()
    if (r.type === 'organ') navigate(`/corps/${r.slug}`)
    if (r.type === 'disease') navigate(`/maladies/${r.slug}`)
    if (r.type === 'country') navigate(`/monde/${r.slug}`)
    if (r.type === 'glossary') navigate(`/glossaire#${r.slug}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-start pt-[15vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 240 }}
            className="w-full max-w-xl panel"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-line/60">
              <Search className="w-4 h-4 text-ink-mute" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cherche un organe, une maladie, un pays..."
                className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-dim"
              />
              {isFetching && <Loader2 className="w-4 h-4 animate-spin text-ink-mute" />}
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elev border border-line/70 text-ink-dim">
                ESC
              </kbd>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-2">
              {query.trim().length < 2 && (
                <div className="px-3 py-6 text-sm text-ink-mute">
                  Tape au moins 2 caractères. Essaie « cœur », « diabète » ou
                  « France ».
                </div>
              )}
              {data?.length === 0 && (
                <div className="px-3 py-6 text-sm text-ink-mute">
                  Aucun résultat pour « {query} ».
                </div>
              )}
              {data?.map(r => (
                <button
                  key={`${r.type}-${r.slug}`}
                  onClick={() => go(r)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-elev transition-colors group"
                >
                  <span className="chip text-[10px]">{labelFor(r.type)}</span>
                  <div className="min-w-0">
                    <div className="text-sm text-ink truncate">{r.title}</div>
                    {r.subtitle && (
                      <div className="text-xs text-ink-mute truncate">{r.subtitle}</div>
                    )}
                  </div>
                  <ArrowRight className="ml-auto w-4 h-4 text-ink-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function labelFor(t: SearchResult['type']) {
  return t === 'organ'
    ? 'organe'
    : t === 'disease'
      ? 'maladie'
      : t === 'country'
        ? 'pays'
        : 'glossaire'
}

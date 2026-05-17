import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search as SearchIcon, X, Plus, Check } from 'lucide-react'
import { api } from '@/lib/api'
import type { DiseaseSummary, Severity } from '@/types'
import { SeverityBadge } from '@/components/disease/SeverityBadge'
import { useCompare } from '@/stores/compare'
import { Sparkline } from '@/components/visuals/Sparkline'
import { cn } from '@/lib/cn'

const CATEGORIES = [
  'Toutes',
  'Infectieuse',
  'Cardiovasculaire',
  'Respiratoire',
  'Neurologique',
  'Métabolique',
  'Auto-immune',
  'Cancer',
  'Génétique',
  'Mentale',
]

const SEVERITIES: { v: Severity | 'all'; label: string }[] = [
  { v: 'all', label: 'Toutes' },
  { v: 'mild', label: 'Légères' },
  { v: 'moderate', label: 'Modérées' },
  { v: 'severe', label: 'Sévères' },
  { v: 'critical', label: 'Critiques' },
]

type SortKey = 'name' | 'prevalence' | 'severity'

const PAGE_SIZE = 24

export function DiseasesPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Toutes')
  const [severity, setSeverity] = useState<Severity | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('prevalence')
  const [page, setPage] = useState(0)
  const compare = useCompare()

  const { data } = useQuery({
    queryKey: ['diseases'],
    queryFn: () => api.get<DiseaseSummary[]>('/diseases'),
  })

  const filtered = useMemo(() => {
    const base = (data ?? []).filter(d => {
      if (category !== 'Toutes' && d.category !== category) return false
      if (severity !== 'all' && d.severity !== severity) return false
      if (
        query &&
        !d.name.toLowerCase().includes(query.toLowerCase()) &&
        !d.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
        return false
      return true
    })
    const order = { critical: 0, severe: 1, moderate: 2, mild: 3 } as const
    if (sort === 'name') return base.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'severity')
      return base.sort((a, b) => order[a.severity] - order[b.severity])
    return base.sort(
      (a, b) => (b.prevalencePer100k ?? 0) - (a.prevalencePer100k ?? 0),
    )
  }, [data, query, category, severity, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page],
  )

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-coral mb-2">
            Bibliothèque
          </div>
          <h1 className="heading text-4xl md:text-5xl">Catalogue des maladies</h1>
          <p className="text-ink-mute mt-2 max-w-2xl">
            Parcours, filtre, compare. Toutes les fiches sont sourcées (OMS, CDC,
            NIH, PubMed).
          </p>
        </div>
        {compare.slugs.length > 0 && (
          <Link to="/comparer" className="btn-primary">
            Comparer ({compare.slugs.length})
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="panel p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 min-h-[40px]">
          <SearchIcon className="w-4 h-4 text-ink-mute flex-shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filtrer par nom ou mot-clé..."
            className="flex-1 min-w-0 bg-transparent outline-none text-ink placeholder:text-ink-dim text-[15px]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Effacer la recherche"
              className="grid place-items-center w-9 h-9 -mr-1.5 text-ink-dim hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {/* Category filters — horizontally scrollable on small screens. */}
        <div className="flex gap-2 mb-2 overflow-x-auto -mx-1 px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                'inline-flex items-center flex-shrink-0 px-3 min-h-[38px] rounded-md text-[13px] border transition-colors',
                category === c
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-line/60 text-ink-mute hover:text-ink hover:border-line',
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {SEVERITIES.map(s => (
            <button
              key={s.v}
              onClick={() => setSeverity(s.v)}
              className={cn(
                'inline-flex items-center flex-shrink-0 px-3 min-h-[38px] rounded-md text-[13px] border transition-colors',
                severity === s.v
                  ? 'border-coral/50 bg-coral/10 text-coral'
                  : 'border-line/60 text-ink-mute hover:text-ink hover:border-line',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="text-[13px] text-ink-dim">
          {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-ink-dim">Tri :</span>
          {(['prevalence', 'severity', 'name'] as SortKey[]).map(k => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={cn(
                'inline-flex items-center px-3 min-h-[36px] rounded-md border transition-colors',
                sort === k
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-line/60 text-ink-mute hover:text-ink hover:border-line',
              )}
            >
              {k === 'prevalence' ? 'Prévalence' : k === 'severity' ? 'Sévérité' : 'Nom'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {visible.map((d, i) => {
          const inCompare = compare.slugs.includes(d.slug)
          return (
            <motion.div
              key={d.slug}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              className="relative group"
            >
              <Link
                to={`/maladies/${d.slug}`}
                className="panel p-4 block hover:border-coral/40 transition-all hover:-translate-y-0.5 h-full"
              >
                <div className="flex items-start justify-between mb-2">
                  <SeverityBadge severity={d.severity} />
                  <span className="chip text-[10px]">{d.category}</span>
                </div>
                <h3 className="font-display text-ink text-[15px] leading-tight line-clamp-2">
                  {d.name}
                </h3>
                <p className="text-[13px] text-ink-mute mt-1.5 line-clamp-2 leading-snug">
                  {d.shortDescription}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div className="text-xs text-ink-dim truncate flex-1 min-w-0">
                    {d.organs.slice(0, 2).join(', ')}
                  </div>
                  {d.prevalencePer100k != null && (
                    <Sparkline
                      values={trendFromBase(d.prevalencePer100k)}
                      width={48}
                      height={20}
                    />
                  )}
                </div>
              </Link>
              <button
                onClick={() =>
                  inCompare ? compare.remove(d.slug) : compare.add(d.slug)
                }
                aria-label="Ajouter au comparateur"
                className={cn(
                  'absolute top-3 right-3 w-7 h-7 grid place-items-center rounded-full border opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm',
                  inCompare
                    ? 'bg-accent/20 border-accent/40 text-accent opacity-100'
                    : 'bg-bg/70 border-line/70 text-ink-mute hover:text-ink',
                )}
              >
                {inCompare ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
              </button>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && data && (
        <div className="text-center py-20 text-ink-mute">
          Aucune maladie ne correspond à ces filtres.
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center px-4 min-h-[40px] rounded-md border border-line/60 text-[13px] text-ink-mute hover:text-ink hover:border-line disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>
          <div className="text-[13px] text-ink-mute px-2">
            Page {page + 1} / {pageCount}
          </div>
          <button
            onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="inline-flex items-center px-4 min-h-[40px] rounded-md border border-line/60 text-[13px] text-ink-mute hover:text-ink hover:border-line disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}

function trendFromBase(base: number) {
  return Array.from({ length: 12 }).map(
    (_, i) => base * (0.85 + Math.sin(i * 0.7) * 0.15 + i * 0.015),
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Brain, ExternalLink } from 'lucide-react'
import { BrainViewer, BRAIN_REGIONS } from '@/components/body/BrainViewer'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { api } from '@/lib/api'
import type { Organ } from '@/types'
import { cn } from '@/lib/cn'

export function BrainExplorerPage() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const { data: organ } = useQuery({
    queryKey: ['organ', 'cerveau'],
    queryFn: () => api.get<Organ>('/organs/cerveau'),
  })

  const sub =
    organ && selected
      ? organ.subOrgans.find(s => s.slug === selected) ?? null
      : null

  return (
    <div className="grid lg:grid-cols-[320px_1fr_360px] h-[calc(100vh-4rem)] border-t border-line/60">
      {/* Left: regions list */}
      <aside className="border-r border-line/60 bg-bg-soft/50 overflow-y-auto">
        <div className="p-5">
          <Breadcrumbs
            items={[
              { to: '/corps', label: 'Corps' },
              { to: '/corps/cerveau', label: 'Cerveau' },
            ]}
          />
          <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-wider text-ink-dim">
            <Brain className="w-3.5 h-3.5" /> Neuroanatomie
          </div>
          <h2 className="heading text-2xl mt-1">Cerveau humain</h2>
          <p className="text-sm text-ink-mute mt-2">
            Survole une région pour la mettre en évidence dans le modèle 3D.
            Clique pour voir les pathologies associées.
          </p>
        </div>

        <ul className="px-2 pb-6 space-y-0.5">
          {BRAIN_REGIONS.map(r => (
            <li key={r.slug}>
              <button
                onMouseEnter={() => setHovered(r.slug)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(r.slug)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors text-sm',
                  selected === r.slug
                    ? 'bg-accent/10 border border-accent/30 text-accent'
                    : hovered === r.slug
                      ? 'bg-bg-elev'
                      : 'hover:bg-bg-elev/60 text-ink-mute',
                )}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: r.color }}
                />
                <span className="flex-1">{r.name}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Center: 3D viewer */}
      <div className="relative bg-[radial-gradient(circle_at_50%_30%,rgba(167,139,250,0.16),transparent_70%)]">
        <BrainViewer
          highlightedSlug={hovered ?? selected ?? undefined}
          onSelect={setSelected}
          onHover={setHovered}
        />
        <div className="absolute top-4 left-4 chip-accent">
          {BRAIN_REGIONS.length} régions cérébrales
        </div>
        <AnimatePresence>
          {(hovered || selected) && (
            <motion.div
              key={hovered ?? selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 panel px-4 py-2.5 flex items-center gap-3"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulseSoft"
                style={{
                  background:
                    BRAIN_REGIONS.find(r => r.slug === (hovered ?? selected))
                      ?.color,
                }}
              />
              <span className="font-display text-ink">
                {BRAIN_REGIONS.find(r => r.slug === (hovered ?? selected))?.name}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: region detail */}
      <aside className="border-l border-line/60 bg-bg-soft/50 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          {sub ? (
            <motion.div
              key={sub.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="text-xs uppercase tracking-wider text-accent mb-2">
                Région
              </div>
              <h3 className="heading text-2xl">{sub.name}</h3>
              <p className="text-sm text-ink-mute mt-3 leading-relaxed">
                {sub.description}
              </p>

              {sub.diseases.length > 0 && (
                <>
                  <div className="text-xs uppercase tracking-wider text-coral mt-6 mb-2">
                    Maladies associées ({sub.diseases.length})
                  </div>
                  <ul className="space-y-1.5">
                    {sub.diseases.map(d => (
                      <li key={d.slug}>
                        <Link
                          to={`/maladies/${d.slug}`}
                          className="panel-soft p-3 flex items-center justify-between hover:border-coral/40 transition-colors"
                        >
                          <span className="text-sm text-ink truncate">
                            {d.name}
                          </span>
                          <span className="text-[10px] text-ink-dim uppercase tracking-wider">
                            {d.severity}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  to={`/corps/cerveau/${sub.slug}`}
                  className="btn-primary text-xs"
                >
                  Fiche complète <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setSelected(null)}
                  className="btn-ghost text-xs"
                >
                  Retour
                </button>
              </div>
            </motion.div>
          ) : organ ? (
            <motion.div key="overview">
              <div className="text-xs uppercase tracking-wider text-ink-dim mb-2">
                Vue d'ensemble
              </div>
              <h3 className="heading text-xl mb-3">Le cerveau en chiffres</h3>
              <div className="space-y-3 mb-6">
                {organ.stats.metrics.map(m => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between border-b border-line/40 pb-2"
                  >
                    <span className="text-sm text-ink-mute">{m.label}</span>
                    <span className="font-mono text-sm text-ink">{m.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-ink-mute leading-relaxed">
                {organ.description}
              </p>
              {organ.sources.length > 0 && (
                <div className="mt-6 panel-soft p-4">
                  <div className="text-[10px] uppercase tracking-wider text-ink-dim mb-2">
                    Sources
                  </div>
                  <ul className="space-y-1 text-sm">
                    {organ.sources.map(s => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1 text-accent hover:underline"
                        >
                          <span className="chip text-[9px] uppercase">
                            {s.type}
                          </span>
                          {s.label} <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => navigate('/corps/cerveau')}
                className="btn-ghost mt-6"
              >
                Voir la fiche détaillée
              </button>
            </motion.div>
          ) : (
            <div className="text-sm text-ink-mute">Chargement...</div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  )
}

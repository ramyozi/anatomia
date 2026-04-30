import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ChevronRight,
  Heart,
  ChevronLeft,
  ExternalLink,
  Star,
} from 'lucide-react'
import { api } from '@/lib/api'
import type { Organ } from '@/types'
import { SeverityBadge } from '@/components/disease/SeverityBadge'
import { useFavorites } from '@/stores/favorites'
import { OrganCanvas } from '@/components/body/OrganCanvas'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { cn } from '@/lib/cn'

export function OrganDetailPage() {
  const { organSlug, subSlug } = useParams<{ organSlug: string; subSlug?: string }>()
  const navigate = useNavigate()
  const { isFavorite, toggleOrgan } = useFavorites()

  const { data: organ, isLoading } = useQuery({
    queryKey: ['organ', organSlug],
    queryFn: () => api.get<Organ>(`/organs/${organSlug}`),
    enabled: !!organSlug,
  })

  if (isLoading) return <OrganSkeleton />
  if (!organ)
    return (
      <div className="p-12 text-center text-ink-mute">
        Organe introuvable.{' '}
        <Link to="/corps" className="text-accent">
          Retour à l'atlas
        </Link>
      </div>
    )

  const sub = subSlug ? organ.subOrgans.find(s => s.slug === subSlug) : null
  const focusedDiseases = sub ? sub.diseases : organ.diseases
  const fav = isFavorite('organ', organ.slug)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <Breadcrumbs
        items={[
          { to: '/corps', label: 'Corps' },
          { to: `/corps/${organ.slug}`, label: organ.name },
          ...(sub ? [{ to: `/corps/${organ.slug}/${sub.slug}`, label: sub.name }] : []),
        ]}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-stretch"
      >
        <div className="panel p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="chip-accent">{organ.system}</span>
            {sub && <span className="chip">{sub.name}</span>}
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="heading text-5xl">
              {sub ? sub.name : organ.name}
            </h1>
            <button
              onClick={() => toggleOrgan(organ.slug)}
              className={cn(
                'btn',
                fav
                  ? 'border-gold/40 bg-gold/10 text-gold'
                  : 'border-line/60 text-ink-mute hover:text-ink',
              )}
            >
              <Star className={cn('w-4 h-4', fav && 'fill-current')} />
              {fav ? 'Favori' : 'Ajouter'}
            </button>
          </div>
          <p className="text-lg text-ink-mute mt-4 leading-relaxed">
            {sub ? sub.description : organ.description}
          </p>

          {/* Functions */}
          {!sub && (
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-wider text-ink-dim mb-2">
                Fonctions
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {organ.functions.map(f => (
                  <span key={f} className="chip">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-px bg-line/40 rounded-lg overflow-hidden">
            {organ.stats.metrics.map(m => (
              <div key={m.label} className="bg-bg-soft px-3 py-3">
                <div className="text-[10px] uppercase tracking-wider text-ink-dim mb-1">
                  {m.label}
                </div>
                <div className="font-mono text-ink">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel relative overflow-hidden h-[420px] lg:h-auto">
          <OrganCanvas slug={organ.slug} />
          <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.25em] text-ink-dim bg-bg/40 backdrop-blur px-2 py-1 rounded">
            modèle stylisé
          </div>
        </div>
      </motion.div>

      {/* Sub-organs */}
      {!sub && organ.subOrgans.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-accent">
                Niveau suivant
              </div>
              <h2 className="heading text-2xl">Sous-structures</h2>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-ink-mute hover:text-ink inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" /> Vue d'ensemble
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {organ.subOrgans.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/corps/${organ.slug}/${s.slug}`}
                  className="group panel p-5 block hover:border-accent/40 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-ink group-hover:text-accent transition-colors">
                      {s.name}
                    </h4>
                    <ChevronRight className="w-4 h-4 text-ink-dim group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-sm text-ink-mute mt-2 line-clamp-2">
                    {s.description}
                  </p>
                  {s.diseases.length > 0 && (
                    <div className="mt-3 text-xs text-ink-dim">
                      {s.diseases.length} maladie{s.diseases.length > 1 ? 's' : ''}{' '}
                      associée{s.diseases.length > 1 ? 's' : ''}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Diseases */}
      <section className="mt-12">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-coral">
              Pathologies
            </div>
            <h2 className="heading text-2xl">
              {focusedDiseases.length} maladie
              {focusedDiseases.length > 1 ? 's' : ''} liée
              {focusedDiseases.length > 1 ? 's' : ''}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {focusedDiseases.map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/maladies/${d.slug}`}
                className="group panel p-4 block hover:border-coral/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityBadge severity={d.severity} />
                      <span className="text-[10px] text-ink-dim">
                        {d.category}
                      </span>
                    </div>
                    <h4 className="font-display text-ink group-hover:text-coral transition-colors truncate">
                      {d.name}
                    </h4>
                    <p className="text-sm text-ink-mute mt-1 line-clamp-2">
                      {d.shortDescription}
                    </p>
                  </div>
                  <Heart className="w-4 h-4 text-ink-dim flex-shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sources */}
      {organ.sources.length > 0 && (
        <section className="mt-12 panel-soft p-6">
          <h3 className="text-xs uppercase tracking-wider text-ink-dim mb-3">
            Sources
          </h3>
          <ul className="space-y-1.5 text-sm">
            {organ.sources.map(s => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 text-accent hover:underline"
                >
                  <span className="chip text-[9px] uppercase">{s.type}</span>
                  {s.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function OrganSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 w-40 bg-line/40 rounded mb-6" />
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">
        <div className="panel p-8">
          <div className="h-6 w-24 bg-line/40 rounded mb-4" />
          <div className="h-12 w-1/2 bg-line/40 rounded mb-4" />
          <div className="h-3 w-full bg-line/30 rounded mb-2" />
          <div className="h-3 w-4/5 bg-line/30 rounded" />
        </div>
        <div className="panel h-[420px]" />
      </div>
    </div>
  )
}

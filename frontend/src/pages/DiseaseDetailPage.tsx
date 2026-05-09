import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Heart,
  AlertTriangle,
  Pill,
  Shield,
  ExternalLink,
  Star,
  Globe2,
  TrendingUp,
} from 'lucide-react'
import { api } from '@/lib/api'
import type { Disease } from '@/types'
import { SeverityBadge } from '@/components/disease/SeverityBadge'
import { useFavorites } from '@/stores/favorites'
import { useCompare } from '@/stores/compare'
import { TimelineChart } from '@/components/visuals/TimelineChart'
import { WorldChoropleth } from '@/components/map/WorldChoropleth'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { cn } from '@/lib/cn'

export function DiseaseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isFavorite, toggleDisease } = useFavorites()
  const compare = useCompare()

  const { data, isLoading } = useQuery({
    queryKey: ['disease', slug],
    queryFn: () => api.get<Disease>(`/diseases/${slug}`),
    enabled: !!slug,
  })

  if (isLoading || !data)
    return <div className="p-12 text-center text-ink-mute">Chargement...</div>

  const fav = isFavorite('disease', data.slug)
  const inCompare = compare.slugs.includes(data.slug)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <Breadcrumbs
        items={[
          { to: '/maladies', label: 'Maladies' },
          { to: `/maladies/${data.slug}`, label: data.name },
        ]}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 panel p-8"
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <SeverityBadge severity={data.severity} />
          <span className="chip">{data.category}</span>
          {data.organs.map(o => (
            <Link key={o} to={`/corps/${o}`} className="chip hover:border-accent/40 hover:text-accent">
              {o}
            </Link>
          ))}
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="heading text-4xl md:text-5xl text-balance flex-1">
            {data.name}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => toggleDisease(data.slug)}
              className={cn(
                'btn',
                fav
                  ? 'border-gold/40 bg-gold/10 text-gold'
                  : 'border-line/60 text-ink-mute hover:text-ink',
              )}
            >
              <Star className={cn('w-4 h-4', fav && 'fill-current')} />
              Favori
            </button>
            <button
              onClick={() =>
                inCompare ? compare.remove(data.slug) : compare.add(data.slug)
              }
              className={cn(
                'btn',
                inCompare
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-line/60 text-ink-mute hover:text-ink',
              )}
            >
              {inCompare ? '✓ Au comparateur' : '+ Comparer'}
            </button>
          </div>
        </div>
        <p className="text-lg text-ink-mute mt-4 leading-relaxed max-w-3xl">
          {data.description}
        </p>

        {(data.epidemiology as any).wikipedia_summary && (
          <div className="mt-5 panel-soft p-4 max-w-3xl text-sm text-ink-mute leading-relaxed">
            <div className="text-[10px] uppercase tracking-wider text-ink-dim mb-1.5 flex items-center gap-2">
              <span className="chip text-[9px]">wikipedia</span>
              Résumé encyclopédique
            </div>
            {(data.epidemiology as any).wikipedia_summary}
            {(data.epidemiology as any).wikipedia_url && (
              <a
                href={(data.epidemiology as any).wikipedia_url}
                target="_blank"
                rel="noopener"
                className="block mt-2 text-accent hover:underline text-xs"
              >
                Lire l'article complet →
              </a>
            )}
          </div>
        )}

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-line/40 rounded-lg overflow-hidden">
          <Stat
            label="Cas mondiaux"
            value={data.epidemiology.globalCases.toLocaleString('fr')}
          />
          {data.epidemiology.yearlyDeaths != null && (
            <Stat
              label="Décès / an"
              value={data.epidemiology.yearlyDeaths.toLocaleString('fr')}
            />
          )}
          {data.prevalencePer100k != null && (
            <Stat
              label="Prévalence"
              value={`${data.prevalencePer100k.toLocaleString('fr')} / 100k`}
            />
          )}
          {data.epidemiology.mostAffectedAgeGroup && (
            <Stat
              label="Âge le plus touché"
              value={data.epidemiology.mostAffectedAgeGroup}
            />
          )}
        </div>
      </motion.header>

      {/* Body grid */}
      <div className="mt-8 grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          <Section
            icon={<AlertTriangle className="w-4 h-4" />}
            title="Symptômes"
            color="coral"
          >
            <ul className="grid sm:grid-cols-2 gap-2">
              {data.symptoms.map(s => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-sm text-ink-mute"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </Section>

          <Section
            icon={<Heart className="w-4 h-4" />}
            title="Causes"
            color="accent"
          >
            <ul className="space-y-1.5">
              {data.causes.map(c => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-sm text-ink-mute"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          <Section
            icon={<TrendingUp className="w-4 h-4" />}
            title="Facteurs de risque"
            color="gold"
          >
            <div className="flex flex-wrap gap-1.5">
              {data.riskFactors.map(r => (
                <span key={r} className="chip">
                  {r}
                </span>
              ))}
            </div>
          </Section>

          <Section
            icon={<Pill className="w-4 h-4" />}
            title="Traitements"
            color="accent"
          >
            <ul className="space-y-1.5">
              {data.treatments.map(t => (
                <li
                  key={t}
                  className="flex items-start gap-2 text-sm text-ink-mute"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </Section>

          <Section
            icon={<Shield className="w-4 h-4" />}
            title="Prévention"
            color="accent"
          >
            <ul className="space-y-1.5">
              {data.prevention.map(p => (
                <li
                  key={p}
                  className="flex items-start gap-2 text-sm text-ink-mute"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </Section>

          {data.timeline && data.timeline.length > 0 && (
            <Section
              icon={<TrendingUp className="w-4 h-4" />}
              title="Évolution dans le temps"
              color="accent"
            >
              <TimelineChart data={data.timeline} />
            </Section>
          )}

          {data.history && data.history.length > 0 && (
            <Section
              icon={<TrendingUp className="w-4 h-4" />}
              title="Repères historiques"
              color="gold"
            >
              <ol className="space-y-3 relative pl-6 border-l border-line/60">
                {data.history.map(h => (
                  <li key={h.year} className="relative">
                    <span className="absolute -left-[1.6rem] top-1.5 w-2.5 h-2.5 rounded-full bg-gold" />
                    <span className="font-mono text-gold mr-3">{h.year}</span>
                    <span className="text-sm text-ink-mute">{h.event}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          {/* Worldwide */}
          <div className="panel p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe2 className="w-4 h-4 text-accent" />
              <h3 className="font-display text-ink">Répartition mondiale</h3>
            </div>
            <div className="h-[220px]">
              <WorldChoropleth
                data={data.worldDistribution}
                onSelect={() => {}}
                compact
              />
            </div>
            <Link to="/monde" className="text-xs text-accent hover:underline mt-3 inline-flex">
              Voir l'atlas mondial →
            </Link>
          </div>

          {/* Sources */}
          <div className="panel p-5">
            <h3 className="font-display text-ink mb-3">Sources</h3>
            <ul className="space-y-2">
              {data.sources.map(s => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener"
                    className="flex items-start gap-2 text-sm text-ink-mute hover:text-ink"
                  >
                    <span className="chip text-[9px] uppercase mt-0.5 flex-shrink-0">
                      {s.type}
                    </span>
                    <span className="flex-1">{s.label}</span>
                    <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Related */}
          {data.relatedDiseases.length > 0 && (
            <div className="panel p-5">
              <h3 className="font-display text-ink mb-3">Maladies liées</h3>
              <div className="flex flex-col gap-1">
                {data.relatedDiseases.map(r => (
                  <Link
                    key={r}
                    to={`/maladies/${r}`}
                    className="text-sm text-ink-mute hover:text-accent flex items-center justify-between py-1"
                  >
                    <span>{r}</span>
                    <span className="text-ink-dim">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bg-soft px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-ink-dim mb-1">
        {label}
      </div>
      <div className="font-display text-ink text-lg">{value}</div>
    </div>
  )
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode
  title: string
  color: 'accent' | 'coral' | 'gold'
  children: React.ReactNode
}) {
  const tone =
    color === 'accent'
      ? 'text-accent'
      : color === 'coral'
        ? 'text-coral'
        : 'text-gold'
  return (
    <section className="panel p-6">
      <div className={cn('flex items-center gap-2 mb-4', tone)}>
        {icon}
        <h3 className="font-display text-ink text-lg">{title}</h3>
      </div>
      {children}
    </section>
  )
}

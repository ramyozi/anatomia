import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DiseaseSummary } from '@/types'
import { Sparkline } from '@/components/visuals/Sparkline'
import { SeverityBadge } from '@/components/disease/SeverityBadge'

export function LiveDataPreview() {
  const { data } = useQuery({
    queryKey: ['diseases', 'highlights'],
    queryFn: () => api.get<DiseaseSummary[]>('/diseases?limit=6&sort=prevalence'),
  })

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-accent mb-2">
            En vedette
          </div>
          <h2 className="heading text-3xl md:text-4xl text-balance">
            Maladies à surveiller cette semaine
          </h2>
          <p className="text-ink-mute mt-2 max-w-2xl">
            Sélection automatique pondérée par prévalence mondiale, sévérité et
            actualité épidémiologique.
          </p>
        </div>
        <Link to="/maladies" className="btn-ghost">
          Tout voir <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data ?? Array.from({ length: 6 }).map(() => null)).map((d, i) => (
          <motion.div
            key={d?.slug ?? i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            {d ? <DiseaseCard d={d} /> : <DiseaseCardSkeleton />}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function DiseaseCard({ d }: { d: DiseaseSummary }) {
  return (
    <Link to={`/maladies/${d.slug}`} className="group panel p-5 block hover:border-accent/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SeverityBadge severity={d.severity} />
            <span className="chip text-[10px]">{d.category}</span>
          </div>
          <h3 className="font-display text-lg text-ink group-hover:text-accent transition-colors truncate">
            {d.name}
          </h3>
          <p className="text-sm text-ink-mute mt-1 line-clamp-2">
            {d.shortDescription}
          </p>
        </div>
        <Sparkline
          values={d.prevalencePer100k ? mockTrend(d.prevalencePer100k) : [0, 0]}
          width={60}
          height={28}
          color="#7ee0d2"
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-ink-dim border-t border-line/50 pt-3">
        <span>
          {d.organs.slice(0, 2).join(', ')}
          {d.organs.length > 2 && ` + ${d.organs.length - 2}`}
        </span>
        {d.prevalencePer100k != null && (
          <span className="font-mono text-accent">
            {d.prevalencePer100k.toLocaleString('fr')} / 100k
          </span>
        )}
      </div>
    </Link>
  )
}

function DiseaseCardSkeleton() {
  return (
    <div className="panel p-5 animate-pulse">
      <div className="h-4 w-1/3 bg-line/40 rounded mb-3" />
      <div className="h-5 w-2/3 bg-line/40 rounded mb-2" />
      <div className="h-3 w-full bg-line/30 rounded mb-1" />
      <div className="h-3 w-4/5 bg-line/30 rounded" />
    </div>
  )
}

function mockTrend(base: number) {
  return Array.from({ length: 12 }).map(
    (_, i) => base * (0.8 + Math.sin(i * 0.6) * 0.2 + i * 0.02),
  )
}

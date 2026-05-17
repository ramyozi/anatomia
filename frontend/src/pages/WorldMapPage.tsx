import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Globe2, Filter } from 'lucide-react'
import { api } from '@/lib/api'
import type { CountrySummary, DiseaseSummary } from '@/types'
import { WorldChoropleth } from '@/components/map/WorldChoropleth'
import { cn } from '@/lib/cn'

export function WorldMapPage() {
  const navigate = useNavigate()
  const [diseaseSlug, setDiseaseSlug] = useState<string | null>(null)
  const [continent, setContinent] = useState<string>('Tous')

  const { data: diseases } = useQuery({
    queryKey: ['diseases'],
    queryFn: () => api.get<DiseaseSummary[]>('/diseases'),
  })
  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.get<CountrySummary[]>('/countries'),
  })
  const { data: distribution } = useQuery({
    queryKey: ['distribution', diseaseSlug ?? 'all'],
    queryFn: () =>
      api.get<{ countryCode: string; per100k: number }[]>(
        diseaseSlug
          ? `/world/disease/${diseaseSlug}`
          : '/world/burden',
      ),
  })

  const continents = ['Tous', 'Afrique', 'Amériques', 'Asie', 'Europe', 'Océanie']
  const visibleCountries = (countries ?? []).filter(
    c => continent === 'Tous' || c.continent === continent,
  )

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr_320px] lg:h-[calc(100vh-4rem)] border-t border-line/60">
      {/* Left controls */}
      <aside className="border-b lg:border-b-0 lg:border-r border-line/60 bg-bg-soft/50 lg:overflow-y-auto p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-dim mb-2">
          <Globe2 className="w-3.5 h-3.5" /> Atlas
        </div>
        <h2 className="heading text-2xl">Maladies dans le monde</h2>
        <p className="text-sm text-ink-mute mt-1">
          Choisis une maladie ou explore le fardeau global. Clique un pays pour
          ouvrir sa fiche.
        </p>

        <div className="mt-6">
          <div className="flex items-center gap-1.5 text-xs text-ink-dim mb-2">
            <Filter className="w-3 h-3" /> Maladie affichée
          </div>
          <select
            value={diseaseSlug ?? ''}
            onChange={e => setDiseaseSlug(e.target.value || null)}
            className="w-full bg-bg-elev border border-line/70 rounded-md px-3 py-2 text-sm text-ink"
          >
            <option value="">Fardeau global (toutes confondues)</option>
            {diseases?.map(d => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-1.5 text-xs text-ink-dim mb-2">
            Continent
          </div>
          <div className="flex flex-wrap gap-1.5">
            {continents.map(c => (
              <button
                key={c}
                onClick={() => setContinent(c)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs border transition-colors',
                  continent === c
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-line/60 text-ink-mute hover:text-ink hover:border-line',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-wider text-ink-dim mb-2">
            Pays référencés ({visibleCountries.length})
          </div>
          <ul className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
            {visibleCountries.map(c => (
              <li key={c.code}>
                <button
                  onClick={() => navigate(`/monde/${c.code}`)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-bg-elev text-sm text-left"
                >
                  <span className="text-ink truncate">{c.name}</span>
                  <span className="text-[11px] text-ink-dim font-mono">
                    {(c.population / 1e6).toFixed(1)}M
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Map */}
      <div className="relative h-[56vh] min-h-[300px] lg:h-auto bg-[radial-gradient(circle_at_50%_30%,rgba(126,224,210,0.08),transparent_70%)]">
        {distribution && (
          <motion.div
            key={diseaseSlug ?? 'all'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <WorldChoropleth
              data={distribution}
              onSelect={code => code && navigate(`/monde/${code}`)}
            />
          </motion.div>
        )}
        <div className="absolute top-4 left-4 chip-accent">
          {diseaseSlug
            ? diseases?.find(d => d.slug === diseaseSlug)?.name
            : 'Fardeau global'}
        </div>
      </div>

      {/* Right insights */}
      <aside className="border-t lg:border-t-0 lg:border-l border-line/60 bg-bg-soft/50 lg:overflow-y-auto p-5 safe-pb">
        <h3 className="font-display text-ink mb-3">Top 5 pays</h3>
        <ol className="space-y-2">
          {(distribution ?? [])
            .slice()
            .sort((a, b) => b.per100k - a.per100k)
            .slice(0, 5)
            .map((d, i) => {
              const c = countries?.find(x => x.code === d.countryCode)
              return (
                <li
                  key={d.countryCode}
                  className="panel-soft p-3 flex items-center gap-3"
                >
                  <span className="font-display text-2xl text-ink-dim w-6">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink truncate">
                      {c?.name ?? d.countryCode}
                    </div>
                    <div className="text-[11px] text-ink-dim">
                      {c?.region}
                    </div>
                  </div>
                  <div className="font-mono text-sm text-accent">
                    {d.per100k.toLocaleString('fr')}
                  </div>
                </li>
              )
            })}
        </ol>

        <div className="mt-6 panel-soft p-4 text-sm text-ink-mute">
          <strong className="text-ink">À propos des données.</strong> Les valeurs
          sont des estimations consolidées issues de WHO/GHO et OWID, exprimées
          en cas pour 100 000 habitants.
        </div>
      </aside>
    </div>
  )
}

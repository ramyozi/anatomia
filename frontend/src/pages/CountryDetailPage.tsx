import { useParams, Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { api } from '@/lib/api'
import type { CountryDetail } from '@/types'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { BarChart } from '@/components/visuals/BarChart'
import { toIso3, isValidIso3 } from '@/lib/iso3'

export function CountryDetailPage() {
  const { countryCode } = useParams<{ countryCode: string }>()
  // Accept either a canonical alpha-3 already or a numeric/lowercase
  // legacy value (eg an old bookmark with /monde/012). Normalise once
  // here so the API call always uses the canonical key.
  const iso3 = toIso3(countryCode)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['country', iso3],
    queryFn: () => api.get<CountryDetail>(`/countries/${iso3}`),
    enabled: !!iso3,
    retry: 0,
  })

  // Param shape is wrong (eg "012", "fr", garbage): bounce to the atlas
  // rather than spin forever.
  if (!iso3 || !isValidIso3(iso3))
    return <Navigate to="/monde" replace />

  // Backend doesn't know this country (eg a small territory present on
  // the map but absent from our 48-country dataset): bounce too.
  if (isError) return <Navigate to="/monde" replace />

  // Legacy URL hit with a numeric code: rewrite to the canonical alpha-3
  // so the user's location bar stays clean and refreshes work.
  if (countryCode !== iso3)
    return <Navigate to={`/monde/${iso3}`} replace />

  if (isLoading || !data)
    return <div className="p-12 text-center text-ink-mute">Chargement...</div>

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <Breadcrumbs
        items={[
          { to: '/monde', label: 'Monde' },
          { to: `/monde/${data.code}`, label: data.name },
        ]}
      />

      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 panel p-8"
      >
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="chip">{data.continent}</span>
          <span className="chip">{data.region}</span>
        </div>
        <h1 className="heading text-5xl text-balance">{data.name}</h1>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-line/40 rounded-lg overflow-hidden">
          <Stat label="Population" value={`${(data.population / 1e6).toFixed(1)} M`} />
          <Stat label="Espérance de vie" value={`${data.lifeExpectancy.toFixed(1)} ans`} />
          {data.healthcareIndex != null && (
            <Stat label="Indice santé" value={data.healthcareIndex.toFixed(1)} />
          )}
          {data.hospitalsPerCapita != null && (
            <Stat
              label="Hôpitaux / 100k"
              value={data.hospitalsPerCapita.toFixed(1)}
            />
          )}
        </div>

        {data.climate && (
          <p className="mt-5 text-ink-mute text-sm">
            <strong className="text-ink">Climat :</strong> {data.climate}
          </p>
        )}
        {data.notes && (
          <p className="mt-3 text-ink-mute text-sm">{data.notes}</p>
        )}
      </motion.header>

      <div className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <section className="panel p-6">
          <h2 className="font-display text-xl mb-4">
            Maladies prédominantes
          </h2>
          <BarChart
            data={data.diseasePrevalence
              .slice()
              .sort((a, b) => b.per100k - a.per100k)
              .slice(0, 10)
              .map(d => ({ label: d.diseaseSlug, value: d.per100k }))}
          />
        </section>

        <section className="panel p-6">
          <h2 className="font-display text-xl mb-4">Top maladies</h2>
          <ol className="space-y-2">
            {data.topDiseases.map((slug, i) => (
              <li key={slug}>
                <Link
                  to={`/maladies/${slug}`}
                  className="panel-soft p-3 flex items-center gap-3 hover:border-coral/40 transition-colors"
                >
                  <span className="font-display text-2xl text-ink-dim w-6">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-ink">{slug}</span>
                  <span className="text-ink-dim text-xs">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {data.sources.length > 0 && (
        <section className="mt-8 panel-soft p-6">
          <h3 className="text-xs uppercase tracking-wider text-ink-dim mb-3">
            Sources
          </h3>
          <ul className="space-y-1.5 text-sm">
            {data.sources.map(s => (
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

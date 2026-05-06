import { Link } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { X, Plus } from 'lucide-react'
import { useCompare } from '@/stores/compare'
import { api } from '@/lib/api'
import type { Disease } from '@/types'
import { SeverityBadge } from '@/components/disease/SeverityBadge'

export function CompareDiseasesPage() {
  const compare = useCompare()
  const queries = useQueries({
    queries: compare.slugs.map(slug => ({
      queryKey: ['disease', slug],
      queryFn: () => api.get<Disease>(`/diseases/${slug}`),
    })),
  })

  const diseases = queries.map(q => q.data).filter(Boolean) as Disease[]

  if (compare.slugs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Plus className="w-12 h-12 mx-auto text-ink-dim mb-4" />
        <h1 className="heading text-3xl mb-2">Comparateur vide</h1>
        <p className="text-ink-mute mb-6">
          Ajoute jusqu'à 4 maladies depuis le catalogue pour les comparer côte à
          côte.
        </p>
        <Link to="/maladies" className="btn-primary">
          Ouvrir le catalogue
        </Link>
      </div>
    )
  }

  const rows: { label: string; value: (d: Disease) => React.ReactNode }[] = [
    { label: 'Catégorie', value: d => d.category },
    {
      label: 'Sévérité',
      value: d => <SeverityBadge severity={d.severity} />,
    },
    {
      label: 'Prévalence / 100k',
      value: d =>
        d.prevalencePer100k != null
          ? d.prevalencePer100k.toLocaleString('fr')
          : '—',
    },
    {
      label: 'Cas mondiaux',
      value: d => d.epidemiology.globalCases.toLocaleString('fr'),
    },
    {
      label: 'Décès / an',
      value: d => d.epidemiology.yearlyDeaths?.toLocaleString('fr') ?? '—',
    },
    { label: 'Organes touchés', value: d => d.organs.join(', ') },
    { label: 'Symptômes clés', value: d => d.symptoms.slice(0, 3).join(' · ') },
    { label: 'Traitements', value: d => d.treatments.slice(0, 2).join(' · ') },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <h1 className="heading text-4xl">Comparateur ({diseases.length})</h1>
        <button onClick={compare.clear} className="btn-ghost">
          Vider
        </button>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-3 text-xs uppercase tracking-wider text-ink-dim w-44">
                Critère
              </th>
              {diseases.map(d => (
                <th key={d.slug} className="p-3 text-left">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/maladies/${d.slug}`}
                      className="font-display text-ink hover:text-accent text-base"
                    >
                      {d.name}
                    </Link>
                    <button
                      onClick={() => compare.remove(d.slug)}
                      className="text-ink-dim hover:text-coral"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label} className="border-t border-line/40">
                <td className="p-3 text-xs text-ink-dim align-top">
                  {r.label}
                </td>
                {diseases.map(d => (
                  <td
                    key={d.slug}
                    className="p-3 text-sm text-ink align-top"
                  >
                    {r.value(d)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Activity, Globe2, Stethoscope, TrendingUp } from 'lucide-react'
import { api } from '@/lib/api'
import { TimelineChart } from '@/components/visuals/TimelineChart'
import { BarChart } from '@/components/visuals/BarChart'
import { CountUp } from '@/components/visuals/CountUp'
import { WorldChoropleth } from '@/components/map/WorldChoropleth'

interface GlobalStats {
  totalDiseasesTracked: number
  totalCountries: number
  totalDeathsAnnual: number
  averageLifeExpectancy: number
  diseaseByCategory: { label: string; value: number }[]
  burdenTimeline: { year: number; cases: number }[]
  topKillers: { label: string; value: number }[]
  vaccinationCoverage: { year: number; cases: number }[]
  topPrevalence?: { label: string; value: number; category: string }[]
  systemBreakdown?: { system: string; organs: number; diseases: number }[]
  countryBurden?: { countryCode: string; per100k: number }[]
  severityBreakdown?: { label: string; value: number }[]
}

const SYSTEM_LABEL: Record<string, string> = {
  nervous: 'Nerveux',
  cardiovascular: 'Cardiovasculaire',
  respiratory: 'Respiratoire',
  digestive: 'Digestif',
  urinary: 'Urinaire',
  endocrine: 'Endocrinien',
  sensory: 'Sensoriel',
  lymphatic: 'Lymphatique',
  skeletal: 'Squelettique',
  muscular: 'Musculaire',
  integumentary: 'Tégumentaire',
}

const SEVERITY_LABEL: Record<string, string> = {
  mild: 'Légère',
  moderate: 'Modérée',
  severe: 'Sévère',
  critical: 'Critique',
}

export function StatsPage() {
  const { data } = useQuery({
    queryKey: ['stats', 'global'],
    queryFn: () => api.get<GlobalStats>('/stats/global'),
  })

  if (!data)
    return (
      <div className="p-12 text-center text-ink-mute">
        Calcul des indicateurs mondiaux...
      </div>
    )

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="text-xs uppercase tracking-[0.25em] text-accent mb-2">
        Tableau de bord
      </div>
      <h1 className="heading text-4xl md:text-5xl mb-2">
        Indicateurs santé mondiale
      </h1>
      <p className="text-ink-mute max-w-2xl">
        Vue agrégée à partir des fiches maladies, pays et données OWID.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={<Stethoscope className="w-4 h-4" />}
          label="Maladies suivies"
          value={data.totalDiseasesTracked}
          tone="accent"
        />
        <KpiCard
          icon={<Globe2 className="w-4 h-4" />}
          label="Pays référencés"
          value={data.totalCountries}
          tone="accent"
        />
        <KpiCard
          icon={<Activity className="w-4 h-4" />}
          label="Décès / an (estim.)"
          value={data.totalDeathsAnnual}
          tone="coral"
        />
        <KpiCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Espérance de vie moyenne"
          value={data.averageLifeExpectancy}
          decimals={1}
          tone="gold"
          suffix=" ans"
        />
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <Section title="Évolution du fardeau global" subtitle="Cas mondiaux estimés (toutes pathologies)">
          <TimelineChart data={data.burdenTimeline} />
        </Section>
        <Section title="Couverture vaccinale globale" subtitle="% population couverte (OWID)">
          <TimelineChart data={data.vaccinationCoverage} color="#9af2e4" />
        </Section>

        <Section title="Maladies par catégorie" subtitle="Nombre de fiches dans le catalogue">
          <BarChart data={data.diseaseByCategory} />
        </Section>
        <Section title="Causes de mortalité" subtitle="Décès annuels estimés">
          <BarChart data={data.topKillers} color="#ff6b6b" />
        </Section>

        {data.topPrevalence && data.topPrevalence.length > 0 && (
          <Section
            title="Top maladies par prévalence"
            subtitle="Cas pour 100 000 habitants (estimations)"
          >
            <BarChart
              data={data.topPrevalence.map(p => ({ label: p.label, value: p.value }))}
              color="#9af2e4"
            />
          </Section>
        )}

        {data.systemBreakdown && data.systemBreakdown.length > 0 && (
          <Section
            title="Charge par système anatomique"
            subtitle="Maladies répertoriées qui touchent au moins un organe du système"
          >
            <BarChart
              data={data.systemBreakdown.map(s => ({
                label: SYSTEM_LABEL[s.system] ?? s.system,
                value: s.diseases,
              }))}
              color="#c4a4ff"
            />
          </Section>
        )}

        {data.severityBreakdown && data.severityBreakdown.length > 0 && (
          <Section
            title="Distribution par sévérité"
            subtitle="Répartition du catalogue par niveau de gravité clinique"
          >
            <BarChart
              data={data.severityBreakdown.map(s => ({
                label: SEVERITY_LABEL[s.label] ?? s.label,
                value: s.value,
              }))}
              color="#e9c46a"
            />
          </Section>
        )}

        {data.countryBurden && data.countryBurden.length > 0 && (
          <Section
            title="Fardeau cumulé par pays"
            subtitle="Somme des prévalences (toutes maladies confondues)"
          >
            <div className="h-[300px] -mx-2">
              <WorldChoropleth data={data.countryBurden} />
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function KpiCard({
  icon,
  label,
  value,
  decimals = 0,
  suffix = '',
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  decimals?: number
  suffix?: string
  tone: 'accent' | 'coral' | 'gold'
}) {
  const t =
    tone === 'accent' ? 'text-accent' : tone === 'coral' ? 'text-coral' : 'text-gold'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel p-5"
    >
      <div className={`w-9 h-9 grid place-items-center rounded-lg bg-bg-elev border border-line/70 mb-3 ${t}`}>
        {icon}
      </div>
      <div className="text-[11px] uppercase tracking-wider text-ink-dim mb-1">
        {label}
      </div>
      <div className="font-display text-2xl text-ink">
        <CountUp end={value} decimals={decimals} />
        {suffix}
      </div>
    </motion.div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="panel p-6">
      <h2 className="font-display text-lg mb-1">{title}</h2>
      {subtitle && <p className="text-xs text-ink-dim mb-4">{subtitle}</p>}
      {children}
    </section>
  )
}

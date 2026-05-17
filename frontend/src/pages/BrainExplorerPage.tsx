import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Brain, ExternalLink } from 'lucide-react'
import { CompositeModel, getCompositeRegions } from '@/components/anatomy/CompositeModel'
import { SceneDebug } from '@/components/anatomy/SceneDebug'
import { ANATOMICAL_GL_SETTINGS, Stage } from '@/components/body/Stage'
import { PostFX } from '@/components/body/PostFX'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { api } from '@/lib/api'
import type { Organ } from '@/types'
import { cn } from '@/lib/cn'
import { Suspense } from 'react'

/**
 * Region slug → French label and FMA-derived sub-organ slug used by the
 * organ catalogue. The 9 region slugs are the ones produced by the
 * conversion pipeline composite for "cerveau".
 */
const REGION_LABELS: Record<string, { name: string; subOrganSlug?: string; description: string }> = {
  cervelet: {
    name: 'Cervelet',
    subOrganSlug: 'cervelet',
    description: 'Coordination motrice fine, équilibre, apprentissage moteur. Compte plus de neurones que tout le reste du SNC.',
  },
  midbrain: {
    name: 'Mésencéphale',
    subOrganSlug: 'mesencephale',
    description: 'Étage supérieur du tronc cérébral, contient la substance noire et les noyaux oculomoteurs.',
  },
  'thalamus-d': {
    name: 'Thalamus droit',
    subOrganSlug: 'thalamus',
    description: 'Relais sensoriel principal vers le cortex (sauf olfaction). Le thalamus droit projette vers l\'hémisphère droit.',
  },
  'thalamus-g': {
    name: 'Thalamus gauche',
    subOrganSlug: 'thalamus',
    description: 'Relais sensoriel projetant vers l\'hémisphère gauche.',
  },
  'hippocampe-d': {
    name: 'Hippocampe droit',
    subOrganSlug: 'hippocampe',
    description: 'Mémoire déclarative et navigation spatiale. Atteint précocement dans la maladie d\'Alzheimer.',
  },
  'hippocampe-g': {
    name: 'Hippocampe gauche',
    subOrganSlug: 'hippocampe',
    description: 'Spécialisé dans la mémoire verbale et autobiographique.',
  },
  hypothalamus: {
    name: 'Hypothalamus',
    subOrganSlug: 'hypothalamus',
    description: 'Homéostasie, thermorégulation, rythmes circadiens. Pilote l\'hypophyse.',
  },
  fornix: {
    name: 'Commissure du fornix',
    description: 'Faisceau de fibres reliant les deux hippocampes via la commissure du fornix.',
  },
  peduncle: {
    name: 'Pédoncule du mésencéphale',
    description: 'Faisceau de fibres descendantes (faisceau corticospinal) traversant le mésencéphale.',
  },
}

export function BrainExplorerPage() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const regions = getCompositeRegions('cerveau')

  const { data: organ } = useQuery({
    queryKey: ['organ', 'cerveau'],
    queryFn: () => api.get<Organ>('/organs/cerveau'),
  })

  const focusedRegion = hovered ?? selected
  const focusedDesc = focusedRegion ? REGION_LABELS[focusedRegion] : null
  const sub =
    organ && focusedDesc?.subOrganSlug
      ? organ.subOrgans.find(s => s.slug === focusedDesc.subOrganSlug)
      : null

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr_360px] lg:h-[calc(100vh-4rem)] border-t border-line/60">
      {/* Left: regions list */}
      <aside className="border-b lg:border-b-0 lg:border-r border-line/60 bg-bg-soft/50 lg:overflow-y-auto">
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
            Modèle 3D réel issu de BodyParts3D. Survole une région du modèle
            pour la mettre en évidence et lire sa description.
          </p>
        </div>

        <ul className="px-2 pb-6 space-y-0.5 max-h-[38vh] overflow-y-auto lg:max-h-none lg:overflow-visible">
          {regions.map(r => {
            const label = REGION_LABELS[r.regionSlug]?.name ?? r.regionSlug
            return (
              <li key={r.regionSlug}>
                <button
                  onMouseEnter={() => setHovered(r.regionSlug)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(r.regionSlug)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors text-sm',
                    selected === r.regionSlug
                      ? 'bg-accent/10 border border-accent/30 text-accent'
                      : hovered === r.regionSlug
                        ? 'bg-bg-elev'
                        : 'hover:bg-bg-elev/60 text-ink-mute',
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: r.color }}
                  />
                  <span className="flex-1">{label}</span>
                  <span className="text-[10px] font-mono text-ink-dim">
                    {r.fmaId.replace('FMA', '')}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </li>
            )
          })}
        </ul>

        <div className="px-5 pb-5 text-[10px] text-ink-dim">
          Données : BodyParts3D / Anatomography (CC BY-SA 2.1 JP).
        </div>
      </aside>

      {/* Center: 3D viewer */}
      <div className="relative h-[56vh] min-h-[320px] lg:h-auto bg-[radial-gradient(circle_at_50%_30%,rgba(167,139,250,0.18),transparent_70%)]">
        <Canvas
          camera={{ position: [0, 0.05, 3.0], fov: 38, near: 0.1, far: 50 }}
          gl={ANATOMICAL_GL_SETTINGS}
          dpr={[1, 2]}
        >
          <Stage preset="studio" envIntensity={1.0} />
          <Suspense fallback={null}>
            <CompositeModel
              slug="cerveau"
              highlightedRegion={focusedRegion}
              onRegionHover={setHovered}
              onRegionClick={setSelected}
              roughness={0.42}
              emissiveIntensity={0.16}
            />
          </Suspense>
          <SceneDebug id="brain" />
          <OrbitControls
            enablePan={false}
            minDistance={1.6}
            maxDistance={5}
            enableDamping
            dampingFactor={0.08}
          />
          <PostFX bloom={0.55} />
        </Canvas>

        <div className="absolute top-4 left-4 chip-accent text-[10px]">
          {regions.length} régions cérébrales · BodyParts3D
        </div>

        <AnimatePresence>
          {focusedRegion && (
            <motion.div
              key={focusedRegion}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 panel px-4 py-2.5 flex items-center gap-3"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulseSoft"
                style={{
                  background: regions.find(r => r.regionSlug === focusedRegion)?.color,
                }}
              />
              <span className="font-display text-ink">
                {REGION_LABELS[focusedRegion]?.name ?? focusedRegion}
              </span>
              {focusedDesc?.subOrganSlug && (
                <button
                  onClick={() => navigate(`/corps/cerveau/${focusedDesc.subOrganSlug}`)}
                  className="text-xs text-accent hover:underline ml-2"
                >
                  Voir la fiche →
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: region detail */}
      <aside className="border-t lg:border-t-0 lg:border-l border-line/60 bg-bg-soft/50 lg:overflow-y-auto p-5 safe-pb">
        <AnimatePresence mode="wait">
          {focusedDesc ? (
            <motion.div
              key={focusedRegion}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="text-xs uppercase tracking-wider text-accent mb-2">
                Région cérébrale
              </div>
              <h3 className="heading text-2xl">{focusedDesc.name}</h3>
              <p className="text-sm text-ink-mute mt-3 leading-relaxed">
                {focusedDesc.description}
              </p>

              {sub && sub.diseases.length > 0 && (
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
                          <span className="text-sm text-ink truncate">{d.name}</span>
                          <span className="text-[10px] text-ink-dim uppercase tracking-wider">
                            {d.severity}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
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
                          <span className="chip text-[9px] uppercase">{s.type}</span>
                          {s.label} <ExternalLink className="w-3 h-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-sm text-ink-mute">Chargement...</div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  )
}

import { useParams, Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ANATOMICAL_GL_SETTINGS, Stage } from '@/components/body/Stage'
import { PostFX } from '@/components/body/PostFX'
import { HumanBody } from '@/components/anatomy/HumanBody'
import { CameraRig } from '@/components/anatomy/CameraRig'
import { CameraControlsOverlay } from '@/components/anatomy/CameraControlsOverlay'
import { SceneDebug } from '@/components/anatomy/SceneDebug'
import { type SystemKey } from '@/components/anatomy/systems'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { api } from '@/lib/api'
import type { OrganSummary } from '@/types'

interface SystemDef {
  slug: string
  label: string
  intro: string
  showSkeleton: boolean
  showOrgans: boolean
  highlights: string[]
  facts: { label: string; value: string }[]
}

const SYSTEMS: Record<string, SystemDef> = {
  squelettique: {
    slug: 'squelettique',
    label: 'Système squelettique',
    intro:
      'Le squelette humain compte 206 os à l\'âge adulte. Il assure le soutien, la protection des organes vitaux, le mouvement (avec les muscles) et la production des cellules sanguines dans la moelle.',
    showSkeleton: true,
    showOrgans: false,
    highlights: ['skeletal'],
    facts: [
      { label: 'Os', value: '206' },
      { label: 'Articulations', value: '≈ 360' },
      { label: 'Os le plus long', value: 'Fémur' },
      { label: 'Os le plus petit', value: 'Étrier (oreille moyenne)' },
      { label: 'Renouvellement osseux', value: '7-10 % par an' },
      { label: 'Production GR / s', value: '≈ 2 millions' },
    ],
  },
  musculaire: {
    slug: 'musculaire',
    label: 'Système musculaire',
    intro:
      'Le système musculaire compte environ 640 muscles striés squelettiques, plus le muscle cardiaque et les muscles lisses des viscères. Les muscles convertissent l\'ATP en force mécanique avec un rendement d\'environ 25 %.',
    showSkeleton: true,
    showOrgans: false,
    highlights: ['muscular'],
    facts: [
      { label: 'Muscles squelettiques', value: '≈ 640' },
      { label: 'Plus volumineux', value: 'Grand fessier' },
      { label: 'Plus puissant', value: 'Masséter (mâchoire)' },
      { label: 'Le plus rapide', value: 'Orbiculaire de l\'œil' },
      { label: 'Force max grand fessier', value: '≈ 200 kg' },
      { label: '% de la masse corporelle', value: '40 %' },
    ],
  },
  nerveux: {
    slug: 'nerveux',
    label: 'Système nerveux',
    intro:
      'Le système nerveux comprend le système nerveux central (cerveau et moelle épinière) et le système nerveux périphérique (31 paires de nerfs spinaux et 12 paires de nerfs crâniens). Il assure la perception, l\'intégration et la commande motrice.',
    showSkeleton: true,
    showOrgans: true,
    highlights: ['nervous'],
    facts: [
      { label: 'Neurones', value: '86 milliards (cerveau)' },
      { label: 'Synapses', value: '100 000 milliards' },
      { label: 'Vitesse de conduction max', value: '120 m/s' },
      { label: 'Nerfs crâniens', value: '12 paires' },
      { label: 'Nerfs spinaux', value: '31 paires' },
      { label: 'Liquide céphalo-rachidien', value: '≈ 150 mL' },
    ],
  },
  cardiovasculaire: {
    slug: 'cardiovasculaire',
    label: 'Système cardiovasculaire',
    intro:
      'Le système cardiovasculaire comprend le cœur, les artères, les veines et les capillaires. Il assure le transport de l\'oxygène, des nutriments et l\'élimination du CO₂. Le réseau vasculaire total mesure environ 100 000 km.',
    showSkeleton: false,
    showOrgans: true,
    highlights: ['cardiovascular'],
    facts: [
      { label: 'Battements / jour', value: '≈ 100 000' },
      { label: 'Volume sanguin', value: '5 L' },
      { label: 'Vaisseaux sanguins', value: '≈ 100 000 km' },
      { label: 'Pression artérielle', value: '120/80 mmHg' },
      { label: 'Débit cardiaque', value: '5 L/min' },
      { label: 'Globules rouges', value: '25 000 milliards' },
    ],
  },
  respiratoire: {
    slug: 'respiratoire',
    label: 'Système respiratoire',
    intro:
      'Le système respiratoire assure les échanges gazeux entre l\'air et le sang via une surface alvéolaire colossale (≈ 70 m²). Il comprend les voies aériennes supérieures, la trachée, les bronches et les poumons.',
    showSkeleton: false,
    showOrgans: true,
    highlights: ['respiratory'],
    facts: [
      { label: 'Cycles respiratoires / jour', value: '≈ 22 000' },
      { label: 'Surface alvéolaire', value: '70 m²' },
      { label: 'Alvéoles', value: '300 millions' },
      { label: 'Capacité pulmonaire totale', value: '6 L' },
      { label: 'Volume courant', value: '500 mL' },
    ],
  },
  digestif: {
    slug: 'digestif',
    label: 'Système digestif',
    intro:
      'Le système digestif est un tube de 9 mètres de la bouche à l\'anus, jalonné de glandes annexes (glandes salivaires, foie, pancréas). Il décompose les aliments et absorbe les nutriments grâce à un microbiote de 100 000 milliards de bactéries.',
    showSkeleton: false,
    showOrgans: true,
    highlights: ['digestive'],
    facts: [
      { label: 'Longueur totale', value: '≈ 9 m' },
      { label: 'Microbes intestinaux', value: '100 000 milliards' },
      { label: 'Suc gastrique / jour', value: '2-3 L' },
      { label: 'Bile / jour', value: '≈ 1 L' },
      { label: 'Surface absorption', value: '250 m²' },
    ],
  },
}

export function SystemsPage() {
  const { system: slug } = useParams<{ system: string }>()
  const def = SYSTEMS[slug ?? '']

  const { data: organs } = useQuery({
    queryKey: ['organs'],
    queryFn: () => api.get<OrganSummary[]>('/organs'),
  })

  if (!def) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="heading text-3xl mb-3">Système inconnu</h1>
        <p className="text-ink-mute mb-6">
          Choisis parmi les systèmes anatomiques ci-dessous.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.values(SYSTEMS).map(s => (
            <Link key={s.slug} to={`/corps/systemes/${s.slug}`} className="btn-ghost">
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // map French slug to backend system column value
  const SYSTEM_TO_BACKEND_KEY: Record<string, string> = {
    squelettique: 'skeletal',
    musculaire: 'muscular',
    nerveux: 'nervous',
    cardiovasculaire: 'cardiovascular',
    respiratoire: 'respiratory',
    digestif: 'digestive',
  }
  // and to the SystemKey used by the 3D viewer (HumanBody / systems.ts).
  const SYSTEM_KEY_FROM_SLUG: Record<string, SystemKey> = {
    squelettique: 'skeletal',
    musculaire: 'skeletal', // no muscular meshes in BodyParts3D — fall back to skeleton
    nerveux: 'nervous',
    cardiovasculaire: 'cardiovascular',
    respiratoire: 'respiratory',
    digestif: 'digestive',
  }
  const backendKey = SYSTEM_TO_BACKEND_KEY[def.slug]
  const linkedOrgans = (organs ?? []).filter(o => o.system === backendKey)
  const viewerSystem: SystemKey = SYSTEM_KEY_FROM_SLUG[def.slug] ?? 'all'

  return (
    <div className="flex flex-col-reverse lg:grid lg:grid-cols-[360px_1fr] lg:h-[calc(100vh-4rem)] border-t border-line/60">
      <aside className="border-t lg:border-t-0 lg:border-r border-line/60 bg-bg-soft/50 lg:overflow-y-auto p-6 safe-pb">
        <Breadcrumbs
          items={[
            { to: '/corps', label: 'Corps' },
            { to: `/corps/systemes/${def.slug}`, label: def.label },
          ]}
        />
        <div className="mt-5 text-xs uppercase tracking-wider text-accent">
          Système anatomique
        </div>
        <h1 className="heading text-3xl mt-1">{def.label}</h1>
        <p className="text-sm text-ink-mute mt-3 leading-relaxed">{def.intro}</p>

        <div className="mt-6 grid grid-cols-2 gap-px bg-line/40 rounded-lg overflow-hidden border border-line/40">
          {def.facts.map(f => (
            <div key={f.label} className="bg-bg-soft px-3 py-3">
              <div className="text-[10px] uppercase tracking-wider text-ink-dim mb-1">
                {f.label}
              </div>
              <div className="font-mono text-sm text-ink">{f.value}</div>
            </div>
          ))}
        </div>

        {linkedOrgans.length > 0 && (
          <div className="mt-8">
            <div className="text-xs uppercase tracking-wider text-ink-dim mb-3">
              Organes du système ({linkedOrgans.length})
            </div>
            <ul className="space-y-1.5">
              {linkedOrgans.map(o => (
                <li key={o.slug}>
                  <Link
                    to={`/corps/${o.slug}`}
                    className="panel-soft p-3 flex items-center justify-between hover:border-accent/40 transition-colors"
                  >
                    <div>
                      <div className="text-sm text-ink">{o.name}</div>
                      <div className="text-[11px] text-ink-dim line-clamp-1">
                        {o.shortDescription}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-accent">
                      {o.diseaseCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          {Object.values(SYSTEMS)
            .filter(s => s.slug !== def.slug)
            .map(s => (
              <Link
                key={s.slug}
                to={`/corps/systemes/${s.slug}`}
                className="chip hover:border-accent/40 hover:text-accent"
              >
                {s.label}
              </Link>
            ))}
        </div>
      </aside>

      <motion.div
        key={def.slug}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative viewer-backdrop h-[58vh] min-h-[320px] lg:h-auto"
      >
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 38, near: 0.05, far: 50 }}
          gl={ANATOMICAL_GL_SETTINGS}
          dpr={[1, 2]}
        >
          <Stage preset="apartment" />
          <Suspense fallback={null}>
            <HumanBody
              system={viewerSystem}
              fadeRest={false}
              tweenCamera={false}
            />
            {/* Auto-focus the camera on this system's meshes. */}
            <CameraRig system={viewerSystem} />
          </Suspense>
          <SceneDebug id={`system-${def.slug}`} />
          <OrbitControls
            makeDefault
            enablePan
            screenSpacePanning
            zoomToCursor
            minDistance={0.1}
            maxDistance={14}
            enableDamping
            dampingFactor={0.09}
            rotateSpeed={0.9}
            zoomSpeed={0.9}
          />
        </Canvas>

        <CameraControlsOverlay />
      </motion.div>
    </div>
  )
}

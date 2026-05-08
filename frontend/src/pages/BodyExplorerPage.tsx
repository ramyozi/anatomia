import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Layers3, Filter, Bone, Heart, Activity } from 'lucide-react'
import * as THREE from 'three'
import { AnatomicalBody } from '@/components/body/AnatomicalBody'
import { ORGAN_3D_POSITIONS } from '@/data/organPositions'
import { api } from '@/lib/api'
import type { OrganSummary } from '@/types'
import { cn } from '@/lib/cn'

const SYSTEMS = [
  { slug: 'all', label: 'Tous' },
  { slug: 'nervous', label: 'Nerveux' },
  { slug: 'cardiovascular', label: 'Cardiovasculaire' },
  { slug: 'respiratory', label: 'Respiratoire' },
  { slug: 'digestive', label: 'Digestif' },
  { slug: 'urinary', label: 'Urinaire' },
  { slug: 'endocrine', label: 'Endocrinien' },
  { slug: 'sensory', label: 'Sensoriel' },
]

export function BodyExplorerPage() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [system, setSystem] = useState('all')
  const [showSkin, setShowSkin] = useState(true)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [showMuscles, setShowMuscles] = useState(false)
  const navigate = useNavigate()

  const { data: organs } = useQuery({
    queryKey: ['organs', system],
    queryFn: () =>
      api.get<OrganSummary[]>(
        `/organs${system !== 'all' ? `?system=${system}` : ''}`,
      ),
  })

  return (
    <div className="grid lg:grid-cols-[320px_1fr_360px] gap-0 h-[calc(100vh-4rem)] border-t border-line/60">
      {/* Left rail */}
      <aside className="border-r border-line/60 bg-bg-soft/50 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 text-ink-dim text-xs uppercase tracking-wider">
            <Layers3 className="w-3.5 h-3.5" /> Anatomie
          </div>
          <h2 className="heading text-2xl">Atlas du corps</h2>
          <p className="text-sm text-ink-mute mt-1">
            Survole le modèle pour identifier un organe, clique pour zoomer.
          </p>
        </div>
        <div className="px-5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-ink-dim mb-2">
            <Filter className="w-3 h-3" /> Système
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SYSTEMS.map(s => (
              <button
                key={s.slug}
                onClick={() => setSystem(s.slug)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs border transition-colors',
                  system === s.slug
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-line/60 text-ink-mute hover:text-ink hover:border-line',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="px-2 pb-6">
          {(organs ?? []).map(o => (
            <li key={o.slug}>
              <button
                onMouseEnter={() => setHovered(o.slug)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/corps/${o.slug}`)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group transition-colors',
                  hovered === o.slug
                    ? 'bg-bg-elev'
                    : 'hover:bg-bg-elev/60',
                )}
              >
                <div className="min-w-0">
                  <div className="text-sm text-ink truncate">{o.name}</div>
                  <div className="text-[11px] text-ink-dim truncate">
                    {o.shortDescription}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-ink-dim text-xs">
                  <span className="font-mono">{o.diseaseCount}</span>
                  <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* 3D viewport */}
      <div className="relative bg-[radial-gradient(circle_at_50%_30%,rgba(126,224,210,0.14),transparent_70%)]">
        <Canvas
          camera={{ position: [0, 0.5, 4.6], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.32} />
          <directionalLight position={[3, 5, 5]} intensity={1.3} color="#9af2e4" />
          <directionalLight position={[-4, -2, 3]} intensity={0.45} color="#ff6b6b" />
          <pointLight position={[0, 0.5, 2.5]} intensity={1.4} color="#7ee0d2" distance={6} />
          <pointLight position={[-2, -1, 1.5]} intensity={0.6} color="#a78bfa" distance={5} />
          <Environment preset="studio" background={false} />
          <AnatomicalBody
            interactive
            highlightedSlug={hovered ?? undefined}
            onHover={setHovered}
            showSkin={showSkin}
            showSkeleton={showSkeleton}
            showMuscles={showMuscles}
          />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={7}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>

        <div className="absolute top-4 left-4 chip">
          {ORGAN_3D_POSITIONS.length} repères anatomiques
        </div>

        {/* Layer toggles */}
        <div className="absolute top-4 right-4 panel-soft p-1.5 flex gap-1">
          <LayerToggle
            active={showSkin}
            onClick={() => setShowSkin(s => !s)}
            icon={<Activity className="w-3.5 h-3.5" />}
            label="Peau"
          />
          <LayerToggle
            active={showMuscles}
            onClick={() => setShowMuscles(s => !s)}
            icon={<Heart className="w-3.5 h-3.5" />}
            label="Muscles"
          />
          <LayerToggle
            active={showSkeleton}
            onClick={() => setShowSkeleton(s => !s)}
            icon={<Bone className="w-3.5 h-3.5" />}
            label="Squelette"
          />
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 panel px-4 py-2.5 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulseSoft" />
              <span className="font-display text-ink">
                {ORGAN_3D_POSITIONS.find(o => o.slug === hovered)?.name}
              </span>
              <button
                onClick={() => navigate(`/corps/${hovered}`)}
                className="text-xs text-accent hover:underline ml-2"
              >
                Voir les détails →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right info panel */}
      <aside className="border-l border-line/60 bg-bg-soft/50 p-5 overflow-y-auto">
        <div className="text-xs uppercase tracking-wider text-ink-dim mb-2">
          Vue d'ensemble
        </div>
        <h3 className="heading text-xl mb-4">Le corps humain en chiffres</h3>
        <div className="space-y-3">
          <Fact label="Cellules" value="≈ 37 200 milliards" />
          <Fact label="Os" value="206" />
          <Fact label="Muscles" value="≈ 640" />
          <Fact label="Vaisseaux sanguins" value="≈ 100 000 km" />
          <Fact label="Battements / jour" value="≈ 100 000" />
          <Fact label="Respirations / jour" value="≈ 22 000" />
          <Fact label="Neurones (cerveau)" value="86 milliards" />
        </div>
        <div className="mt-6 panel-soft p-4 text-sm text-ink-mute">
          <strong className="text-ink">Astuce :</strong> tu peux faire pivoter
          le modèle, zoomer avec la molette, et cliquer sur n'importe quel
          repère lumineux pour ouvrir la fiche détaillée.
        </div>
      </aside>
    </div>
  )
}

function LayerToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider transition-colors',
        active
          ? 'bg-accent/15 text-accent border border-accent/40'
          : 'text-ink-mute hover:text-ink border border-transparent',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line/40 pb-2">
      <span className="text-sm text-ink-mute">{label}</span>
      <span className="font-mono text-sm text-ink">{value}</span>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Layers3,
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react'
import { ANATOMICAL_GL_SETTINGS, Stage } from '@/components/body/Stage'
import { HumanBody, KNOWN_REGIONS } from '@/components/anatomy/HumanBody'
import { SceneDebug } from '@/components/anatomy/SceneDebug'
import {
  type SystemKey,
  listSystems,
  regionLabel,
  regionMatchesSystem,
} from '@/components/anatomy/systems'
import { cn } from '@/lib/cn'

/**
 * Atlas page. Loads one ``human-body.glb`` and uses it as the single
 * source of truth — system filters change which regions are visible
 * (or fade them), the camera tweens to the system's framing, and the
 * sidebar lists the regions actually shown for the current filter.
 */
export function BodyExplorerPage() {
  const [system, setSystem] = useState<SystemKey>('all')
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [fadeRest, setFadeRest] = useState(false)

  const systems = listSystems()

  // Regions to list in the sidebar — those matching the current system.
  const visibleRegions = useMemo(
    () =>
      KNOWN_REGIONS.filter(r =>
        system === 'all' ? true : regionMatchesSystem(r, system),
      ),
    [system],
  )

  const focused = hovered ?? selected
  const sysDef = systems.find(s => s.key === system)!

  return (
    <div className="grid lg:grid-cols-[300px_1fr_340px] h-[calc(100vh-4rem)] border-t border-line/60">
      {/* Left rail — system selector + visible regions */}
      <aside className="border-r border-line/60 bg-bg-soft/50 overflow-y-auto">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 text-ink-dim text-xs uppercase tracking-wider">
            <Layers3 className="w-3.5 h-3.5" /> Atlas anatomique
          </div>
          <h2 className="heading text-2xl">Corps humain</h2>
          <p className="text-sm text-ink-mute mt-1">
            Modèle BodyParts3D, un seul jeu de coordonnées partagé entre
            tous les systèmes.
          </p>
        </div>

        <div className="px-5 mb-3">
          <div className="text-xs text-ink-dim mb-2">Système</div>
          <div className="flex flex-wrap gap-1.5">
            {systems.map(s => (
              <button
                key={s.key}
                onClick={() => {
                  setSystem(s.key)
                  setSelected(null)
                }}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs border transition-colors',
                  system === s.key
                    ? 'border-accent/50 bg-accent/10 text-accent'
                    : 'border-line/60 text-ink-mute hover:text-ink hover:border-line',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 mb-4 flex items-center gap-2">
          <button
            onClick={() => setFadeRest(f => !f)}
            className={cn(
              'flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border transition-colors',
              fadeRest
                ? 'border-accent/50 bg-accent/10 text-accent'
                : 'border-line/60 text-ink-mute hover:text-ink hover:border-line',
            )}
          >
            {fadeRest ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {fadeRest ? 'Estompé' : 'Filtré'}
          </button>
          <span className="text-[10px] text-ink-dim">
            {fadeRest
              ? 'Les autres systèmes restent visibles à 6 % d\'opacité'
              : 'Les autres systèmes sont masqués'}
          </span>
        </div>

        <div className="px-5 text-xs text-ink-dim mb-1">
          {visibleRegions.length} régions
        </div>
        <ul className="px-2 pb-6">
          {visibleRegions.map(r => (
            <li key={r}>
              <button
                onMouseEnter={() => setHovered(r)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(r)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left text-sm transition-colors',
                  selected === r
                    ? 'bg-accent/10 border border-accent/30 text-accent'
                    : hovered === r
                      ? 'bg-bg-elev'
                      : 'hover:bg-bg-elev/60 text-ink-mute',
                )}
              >
                <span className="flex-1 truncate">{regionLabel(r)}</span>
                <ChevronRight className="w-3 h-3 opacity-60 flex-shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* 3D viewport — theme-aware neutral backdrop (.viewer-backdrop):
          a light medical grey in light mode, a muted neutral in the dark
          themes, while the model stays lit by the Stage rig. */}
      <div className="relative viewer-backdrop">
        <Canvas
          camera={{ position: [0, 0, 3.6], fov: 38, near: 0.05, far: 50 }}
          gl={ANATOMICAL_GL_SETTINGS}
          dpr={[1, 2]}
        >
          <Stage preset="apartment" envIntensity={0.7} />
          <HumanBody
            system={system}
            highlighted={focused}
            onRegionHover={setHovered}
            onRegionClick={setSelected}
            fadeRest={fadeRest}
            tweenCamera={false}
          />
          <SceneDebug id="body" />
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={1.2}
            maxDistance={6}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>

        <div className="absolute top-4 left-4 chip-accent text-[10px]">
          {sysDef.label} · {visibleRegions.length} régions
        </div>

        <AnimatePresence>
          {focused && (
            <motion.div
              key={focused}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 panel px-4 py-2.5 flex items-center gap-3"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: sysDef.accentColor }}
              />
              <span className="font-display text-ink">{regionLabel(focused)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right info */}
      <aside className="border-l border-line/60 bg-bg-soft/50 overflow-y-auto p-5">
        <div className="text-xs uppercase tracking-wider text-ink-dim mb-2">
          Système
        </div>
        <h3 className="heading text-xl mb-2">{sysDef.label}</h3>
        <p className="text-sm text-ink-mute leading-relaxed">
          {sysDef.description}
        </p>

        <div className="mt-6 panel-soft p-4">
          <div className="text-[10px] uppercase tracking-wider text-ink-dim mb-2">
            Source des modèles
          </div>
          <p className="text-xs text-ink-mute leading-relaxed">
            BodyParts3D / Anatomography, DBCLS, Japon. Licence
            CC BY-SA 2.1 JP. Modèles téléchargés depuis le miroir
            Kevin-Mattheus-Moerman puis convertis en GLB indexés via FMA.
          </p>
        </div>

        {focused && (
          <div className="mt-6">
            <div className="text-[10px] uppercase tracking-wider text-accent mb-2">
              Région sélectionnée
            </div>
            <h4 className="font-display text-ink mb-1">{regionLabel(focused)}</h4>
            <div className="text-[11px] font-mono text-ink-dim">{focused}</div>
            <Link
              to={`/corps/cerveau/explorer`}
              className={cn(
                'btn-ghost mt-3 text-xs',
                !focused.startsWith('brain.') && 'hidden',
              )}
            >
              Ouvrir l'atlas cérébral →
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}

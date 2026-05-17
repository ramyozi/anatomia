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
import { CameraRig } from '@/components/anatomy/CameraRig'
import { CameraControlsOverlay } from '@/components/anatomy/CameraControlsOverlay'
import { SceneDebug } from '@/components/anatomy/SceneDebug'
import { MobileSheet } from '@/components/layout/MobileSheet'
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
 * (or fade them), the camera auto-focuses, and a side panel lists the
 * regions for the current filter.
 *
 * Layout:
 *  - Desktop (lg+): classic 3-column grid (controls | viewer | info).
 *  - Mobile: the 3D viewer owns the screen; controls + region list +
 *    system info move into a collapsible bottom sheet so the user lands
 *    straight on the interactive content, not on a long list.
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

  // Controls + region list — rendered in the desktop left rail AND in
  // the mobile bottom sheet (same JSX, same handlers, no duplication).
  const controlsPanel = (
    <>
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
                'px-3 min-h-[36px] rounded-md text-xs border transition-colors',
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
            'flex items-center gap-1.5 text-[11px] px-2.5 min-h-[32px] rounded-md border transition-colors',
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
                'w-full flex items-center gap-2 px-3 min-h-[40px] rounded-md text-left text-sm transition-colors',
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
    </>
  )

  // System description + selected-region detail.
  const infoPanel = (
    <div className="p-5">
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
    </div>
  )

  return (
    <div className="lg:grid lg:grid-cols-[300px_1fr_340px] lg:h-[calc(100vh-4rem)] border-t border-line/60">
      {/* Desktop left rail */}
      <aside className="hidden lg:block lg:overflow-y-auto border-r border-line/60 bg-bg-soft/50">
        {controlsPanel}
      </aside>

      {/* 3D viewport — owns the full screen on mobile, a grid cell on
          desktop. Theme-aware neutral backdrop (.viewer-backdrop). */}
      <div className="relative viewer-backdrop h-[calc(100dvh-4rem)] lg:h-auto">
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
          {/* Intelligent auto-focus: re-frames the camera onto the real
              bounding box of the selected system's meshes. */}
          <CameraRig system={system} />
          <SceneDebug id="body" />
          <OrbitControls
            makeDefault
            enablePan
            screenSpacePanning
            zoomToCursor
            // CameraRig narrows these per system; keep a wide fallback.
            minDistance={0.1}
            maxDistance={14}
            enableDamping
            dampingFactor={0.09}
            rotateSpeed={0.9}
            zoomSpeed={0.9}
          />
        </Canvas>

        <div className="absolute top-4 left-4 chip-accent text-[10px]">
          {sysDef.label} · {visibleRegions.length} régions
        </div>

        {/* Camera controls — lifted above the mobile sheet peek bar. */}
        <CameraControlsOverlay className="right-3 bottom-[4.75rem] lg:bottom-3" />

        <AnimatePresence>
          {focused && (
            <motion.div
              key={focused}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-[4.75rem] lg:bottom-6 left-1/2 -translate-x-1/2 panel px-4 py-2.5 flex items-center gap-3"
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

      {/* Desktop right info */}
      <aside className="hidden lg:block lg:overflow-y-auto border-l border-line/60 bg-bg-soft/50">
        {infoPanel}
      </aside>

      {/* Mobile: controls + list + info in a collapsible bottom sheet. */}
      <MobileSheet
        title="Systèmes & régions"
        badge={`${visibleRegions.length} régions`}
      >
        {controlsPanel}
        <div className="border-t border-line/60">{infoPanel}</div>
      </MobileSheet>
    </div>
  )
}

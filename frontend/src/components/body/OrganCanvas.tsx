import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useEffect } from 'react'
import { AnatomyModel, getAnatomyModel } from '@/components/anatomy/AnatomyModel'
import { CompositeModel, getModel } from '@/components/anatomy/CompositeModel'
import { SceneDebug } from '@/components/anatomy/SceneDebug'
import { ANATOMICAL_GL_SETTINGS, Stage } from './Stage'
import { PostFX } from './PostFX'

/**
 * Map a domain slug (used by the disease / organ catalogue) to the
 * BodyParts3D model slug that should be shown.
 *
 * Some catalogue slugs don't exist as a single primitive in BodyParts3D;
 * we fall back to the closest available mesh (e.g. ``oreille`` shows the
 * eyeball cluster's neighbour ``oeil`` because there's no inner-ear STL
 * by FMA in the dataset we sliced).
 */
const SLUG_ALIASES: Record<string, string> = {
  'reins-d': 'reins',
  'reins-g': 'reins',
  yeux: 'oeil',
}

/**
 * Renders a BodyParts3D model for the given organ slug. Picks a composite
 * GLB if available (cerveau → 9 brain regions), falls back to a solo
 * model, then to a procedural icosahedron when nothing matches.
 *
 * No mock placeholders are shown when a real model exists — only when
 * the catalogue has no corresponding STL.
 */
export function OrganCanvas({ slug }: { slug: string }) {
  const target = SLUG_ALIASES[slug] ?? slug
  const compositeEntry = (() => {
    const m = getModel(target)
    return m && (m as { kind?: string }).kind === 'composite' ? m : null
  })()
  const soloEntry = compositeEntry ? null : getAnatomyModel(target)
  const fmaTag = compositeEntry ? 'composite' : soloEntry?.fmaId

  // Force window resizes shortly after mount: r3f's Canvas measures its
  // container on first paint, and when we land on the page from a route
  // transition the parent grid cell is sometimes 0×0 for a frame. Queueing
  // a few resizes guarantees the canvas catches the final layout, no
  // matter when Suspense and Framer transitions resolve.
  useEffect(() => {
    const timers = [16, 64, 200, 600].map(d =>
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), d),
    )
    return () => timers.forEach(t => clearTimeout(t))
  }, [])

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.05, 2.8], fov: 40, near: 0.1, far: 50 }}
        gl={ANATOMICAL_GL_SETTINGS}
        dpr={[1, 2]}
      >
        <Stage preset="studio" envIntensity={0.95} />
        <Suspense fallback={null}>
          {compositeEntry ? (
            <CompositeModel
              slug={target}
              roughness={0.45}
              emissiveIntensity={0.16}
            />
          ) : soloEntry ? (
            <AnatomyModel
              slug={target}
              autoRotate
              roughness={0.5}
              emissiveIntensity={0.2}
            />
          ) : (
            <FallbackOrgan />
          )}
        </Suspense>
        <SceneDebug id={`organ-${slug}`} />
        <OrbitControls
          enablePan={false}
          autoRotate={!compositeEntry}
          autoRotateSpeed={0.6}
          maxDistance={5}
          minDistance={1.4}
          enableDamping
          dampingFactor={0.08}
        />
        <PostFX bloom={0.6} />
      </Canvas>

      {fmaTag && (
        <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.25em] text-ink-dim bg-bg/40 backdrop-blur px-2 py-1 rounded">
          BodyParts3D · {fmaTag}
        </div>
      )}
    </div>
  )
}

function FallbackOrgan() {
  return (
    <mesh>
      <icosahedronGeometry args={[0.7, 2]} />
      <meshPhysicalMaterial
        color="#7ee0d2"
        emissive="#2a8a7c"
        emissiveIntensity={0.3}
        roughness={0.4}
        clearcoat={0.4}
      />
    </mesh>
  )
}

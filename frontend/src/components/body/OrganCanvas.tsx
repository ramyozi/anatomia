import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { AnatomyModel, getAnatomyModel } from '@/components/anatomy/AnatomyModel'
import { ANATOMICAL_GL_SETTINGS, Stage } from './Stage'

/** Map a domain slug to the anatomical model slug used by BodyParts3D. */
const SLUG_ALIASES: Record<string, string> = {
  'reins-d': 'reins',
}

/**
 * Renders a real BodyParts3D model for the given organ slug, with
 * studio lighting. Falls back to a placeholder sphere when no model is
 * registered yet — easier to spot during data work than crashing.
 */
export function OrganCanvas({ slug }: { slug: string }) {
  const target = SLUG_ALIASES[slug] ?? slug
  const entry = getAnatomyModel(target)

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.05, 2.6], fov: 40 }}
        gl={ANATOMICAL_GL_SETTINGS}
        dpr={[1, 2]}
      >
        <Stage preset="studio" envIntensity={0.85} />
        <Suspense fallback={null}>
          {entry ? (
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
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          maxDistance={5}
          minDistance={1.4}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {entry && (
        <div className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.25em] text-ink-dim bg-bg/40 backdrop-blur px-2 py-1 rounded">
          BodyParts3D · {entry.fmaId}
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

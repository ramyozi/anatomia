import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { AnatomyModel } from '@/components/anatomy/AnatomyModel'
import { ANATOMICAL_GL_SETTINGS, Stage } from '@/components/body/Stage'
import { PostFX } from '@/components/body/PostFX'

/**
 * Hero scene: a real BodyParts3D cerebellum mesh, lit with a studio
 * HDRI environment. We use real anatomy here — no more procedural
 * spheres or stylised placeholders.
 */
export function HeroBody() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(126,224,210,0.18),transparent_60%)]" />
      <Canvas
        camera={{ position: [0, 0.1, 2.4], fov: 38 }}
        gl={ANATOMICAL_GL_SETTINGS}
        dpr={[1, 2]}
      >
        <Stage preset="studio" envIntensity={0.95} />
        <Suspense fallback={null}>
          <Float floatIntensity={0.5} rotationIntensity={0.18} speed={1.05}>
            <AnatomyModel
              slug="cerveau"
              autoRotate
              roughness={0.45}
              emissiveIntensity={0.22}
            />
          </Float>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.4}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.6}
        />
        <PostFX bloom={0.85} />
      </Canvas>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-ink-dim">
        bodyparts3d · cerebellum (FMA67944)
      </div>
    </div>
  )
}

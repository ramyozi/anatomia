import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { CompositeModel } from '@/components/anatomy/CompositeModel'
import { SceneDebug } from '@/components/anatomy/SceneDebug'
import { ANATOMICAL_GL_SETTINGS, Stage } from '@/components/body/Stage'
import { PostFX } from '@/components/body/PostFX'

/**
 * Hero scene: a real BodyParts3D brain assembly (cerebellum + midbrain
 * + thalami + hippocampi + hypothalamus + fornix). Merged in the
 * BodyParts3D world frame, then rescaled as a unit so the whole
 * structure fits the camera.
 */
export function HeroBody() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(126,224,210,0.18),transparent_60%)]" />
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 38, near: 0.1, far: 50 }}
        gl={ANATOMICAL_GL_SETTINGS}
        dpr={[1, 2]}
      >
        <Stage preset="studio" envIntensity={1.0} />
        <Suspense fallback={null}>
          <Float floatIntensity={0.4} rotationIntensity={0.18} speed={1.05}>
            <CompositeModel slug="cerveau" emissiveIntensity={0.18} roughness={0.45} />
          </Float>
        </Suspense>
        <SceneDebug id="hero" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.6}
        />
        <PostFX bloom={0.7} />
      </Canvas>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-ink-dim">
        BodyParts3D · brain assembly · 9 régions
      </div>
    </div>
  )
}

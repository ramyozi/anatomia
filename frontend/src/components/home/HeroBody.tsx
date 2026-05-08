import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { AnatomicalBody } from '@/components/body/AnatomicalBody'
import { ANATOMICAL_GL_SETTINGS, Stage } from '@/components/body/Stage'

function Pulse() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const s = 1 + Math.sin(t * 1.4) * 0.04
    ref.current.scale.setScalar(s)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.18 + Math.sin(t * 1.4) * 0.07
  })
  return (
    <mesh ref={ref} position={[0, 0.2, 0]}>
      <sphereGeometry args={[1.6, 48, 48]} />
      <meshBasicMaterial
        color="#7ee0d2"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  )
}

export function HeroBody() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(126,224,210,0.18),transparent_60%)]" />
      <Canvas
        camera={{ position: [0, 0.3, 4.6], fov: 38 }}
        gl={ANATOMICAL_GL_SETTINGS}
        dpr={[1, 2]}
      >
        <Stage preset="studio" />

        <Float floatIntensity={0.7} rotationIntensity={0.22} speed={1.1}>
          <AnatomicalBody interactive={false} />
        </Float>

        <Pulse />
        <Sparkles
          count={120}
          scale={[3.8, 5.5, 3.8]}
          size={2}
          speed={0.28}
          color="#9af2e4"
          opacity={0.45}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.6}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.6}
        />
      </Canvas>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.25em] text-ink-dim">
        survol pour explorer
      </div>
    </div>
  )
}

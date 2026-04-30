import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/**
 * Stylised 3D representation of an organ using procedural geometry.
 * No external GLTF needed — looks abstract-medical, ships under 10kb.
 */
export function OrganCanvas({ slug }: { slug: string }) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={1.4} color="#9af2e4" />
        <pointLight position={[-3, -2, 1]} intensity={0.6} color="#ff6b6b" />
        <ProceduralOrgan slug={slug} />
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxDistance={6}
          minDistance={2.5}
        />
      </Canvas>
    </div>
  )
}

function ProceduralOrgan({ slug }: { slug: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const config = useMemo(() => configFor(slug), [slug])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    if (mat) {
      mat.emissiveIntensity = 0.4 + Math.sin(t * config.pulseSpeed) * 0.2
    }
    ref.current.rotation.y = t * 0.15
  })

  return (
    <group>
      <mesh ref={ref}>
        {config.geometry}
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.4}
          roughness={0.4}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>
      {/* wireframe overlay */}
      <mesh scale={1.001}>
        {config.geometry}
        <meshBasicMaterial color={config.color} wireframe transparent opacity={0.18} />
      </mesh>
      {/* halo */}
      <mesh>
        <sphereGeometry args={[1.7, 24, 24]} />
        <meshBasicMaterial color={config.color} transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </group>
  )
}

function configFor(slug: string): {
  color: string
  pulseSpeed: number
  geometry: React.ReactNode
} {
  switch (slug) {
    case 'coeur':
      return {
        color: '#ff6b6b',
        pulseSpeed: 3.4,
        geometry: <icosahedronGeometry args={[1, 1]} />,
      }
    case 'poumons':
      return {
        color: '#9af2e4',
        pulseSpeed: 1.6,
        geometry: <torusKnotGeometry args={[0.8, 0.28, 80, 12]} />,
      }
    case 'cerveau':
      return {
        color: '#a78bfa',
        pulseSpeed: 1.2,
        geometry: <sphereGeometry args={[1.05, 24, 24]} />,
      }
    case 'foie':
      return {
        color: '#e9c46a',
        pulseSpeed: 1.0,
        geometry: <dodecahedronGeometry args={[1.05, 0]} />,
      }
    case 'reins':
    case 'reins-d':
      return {
        color: '#7ee0d2',
        pulseSpeed: 1.4,
        geometry: <capsuleGeometry args={[0.6, 0.6, 12, 32]} />,
      }
    case 'estomac':
      return {
        color: '#fbbf77',
        pulseSpeed: 1.0,
        geometry: <capsuleGeometry args={[0.7, 0.5, 12, 24]} />,
      }
    case 'intestin':
      return {
        color: '#fbbf77',
        pulseSpeed: 0.9,
        geometry: <torusGeometry args={[0.85, 0.32, 16, 80]} />,
      }
    case 'oeil':
      return {
        color: '#7ee0d2',
        pulseSpeed: 2.4,
        geometry: <sphereGeometry args={[1, 32, 32]} />,
      }
    default:
      return {
        color: '#7ee0d2',
        pulseSpeed: 1.5,
        geometry: <octahedronGeometry args={[1, 1]} />,
      }
  }
}

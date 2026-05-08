import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ANATOMICAL_GL_SETTINGS, Stage } from './Stage'
import { TISSUE_PRESETS } from './materials'

export interface BrainRegion {
  slug: string
  name: string
  position: [number, number, number]
  color: string
  radius: number
}

const REGIONS: BrainRegion[] = [
  { slug: 'lobe-frontal', name: 'Lobe frontal', position: [0, 0.55, 0.55], color: '#7ee0d2', radius: 0.18 },
  { slug: 'cortex-prefrontal', name: 'Cortex préfrontal', position: [-0.18, 0.55, 0.7], color: '#9af2e4', radius: 0.1 },
  { slug: 'aire-broca', name: 'Broca', position: [-0.45, 0.25, 0.45], color: '#ff8b8b', radius: 0.06 },
  { slug: 'cortex-moteur', name: 'Cortex moteur', position: [0, 0.7, 0.05], color: '#ffb27a', radius: 0.1 },
  { slug: 'lobe-parietal', name: 'Lobe pariétal', position: [0, 0.6, -0.1], color: '#a78bfa', radius: 0.16 },
  { slug: 'cortex-somatosensoriel', name: 'Cortex somatosensoriel', position: [0, 0.7, -0.18], color: '#c4a4ff', radius: 0.1 },
  { slug: 'lobe-temporal', name: 'Lobe temporal', position: [-0.7, 0.05, 0.15], color: '#ffb27a', radius: 0.16 },
  { slug: 'aire-wernicke', name: 'Wernicke', position: [-0.7, 0.05, -0.15], color: '#ff8b8b', radius: 0.07 },
  { slug: 'amygdale', name: 'Amygdale', position: [-0.4, -0.2, 0.2], color: '#e9c46a', radius: 0.06 },
  { slug: 'hippocampe', name: 'Hippocampe', position: [-0.45, -0.18, 0], color: '#ffd2b3', radius: 0.07 },
  { slug: 'lobe-occipital', name: 'Lobe occipital', position: [0, 0.35, -0.7], color: '#7ee0d2', radius: 0.16 },
  { slug: 'cortex-visuel-v1', name: 'Cortex V1', position: [0, 0.3, -0.85], color: '#9af2e4', radius: 0.08 },
  { slug: 'cervelet', name: 'Cervelet', position: [0, -0.4, -0.55], color: '#caa3c7', radius: 0.18 },
  { slug: 'thalamus', name: 'Thalamus', position: [0, 0.1, 0], color: '#ff6b6b', radius: 0.08 },
  { slug: 'hypothalamus', name: 'Hypothalamus', position: [0, -0.05, 0.05], color: '#e9c46a', radius: 0.06 },
  { slug: 'hypophyse', name: 'Hypophyse', position: [0, -0.18, 0.05], color: '#fbbf77', radius: 0.04 },
  { slug: 'substance-noire', name: 'Substance noire', position: [0, -0.15, -0.05], color: '#5b6473', radius: 0.05 },
  { slug: 'ganglions-base', name: 'Ganglions base', position: [0.3, 0.1, 0], color: '#a78bfa', radius: 0.07 },
  { slug: 'tronc-cerebral', name: 'Tronc cérébral', position: [0, -0.55, -0.1], color: '#caa3c7', radius: 0.1 },
]

interface Props {
  highlightedSlug?: string
  onSelect?: (slug: string) => void
  onHover?: (slug: string | null) => void
}

export function BrainViewer({ highlightedSlug, onSelect, onHover }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 3.2], fov: 38 }}
      gl={ANATOMICAL_GL_SETTINGS}
      dpr={[1, 2]}
    >
      <Stage preset="studio" envIntensity={0.9} />
      <BrainBody />
      {REGIONS.map(r => (
        <RegionMarker
          key={r.slug}
          region={r}
          highlighted={highlightedSlug === r.slug}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      <OrbitControls
        enablePan={false}
        minDistance={2.4}
        maxDistance={5.5}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  )
}

function BrainBody() {
  const mat = useMemo(() => TISSUE_PRESETS.brain(), [])
  const matInner = useMemo(() => {
    const m = TISSUE_PRESETS.brain() as THREE.MeshPhysicalMaterial
    m.opacity = 0.55
    m.transparent = true
    return m
  }, [])
  return (
    <group position={[0, 0, 0]}>
      {/* Outer hemispheres */}
      {[-1, 1].map(side => (
        <mesh key={side} material={matInner.clone()} position={[0.18 * side, 0.2, 0]}>
          <sphereGeometry args={[0.95, 64, 64, 0, Math.PI * 1.95]} />
        </mesh>
      ))}
      {/* Sulci texture */}
      {Array.from({ length: 70 }).map((_, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / 70)
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        const r = 0.95
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.cos(phi) + 0.2
        const z = r * Math.sin(phi) * Math.sin(theta)
        return (
          <mesh key={i} position={[x, y, z]} material={mat.clone()}>
            <icosahedronGeometry args={[0.05, 0]} />
          </mesh>
        )
      })}
      {/* Cerebellum */}
      <mesh material={mat.clone()} position={[0, -0.4, -0.55]}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>
      {/* Brainstem */}
      <mesh material={mat.clone()} position={[0, -0.7, -0.1]}>
        <cylinderGeometry args={[0.13, 0.16, 0.45, 24]} />
      </mesh>
    </group>
  )
}

function RegionMarker({
  region,
  highlighted,
  onSelect,
  onHover,
}: {
  region: BrainRegion
  highlighted: boolean
  onSelect?: (slug: string) => void
  onHover?: (slug: string | null) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: region.color,
        emissive: region.color,
        emissiveIntensity: 0.65,
        roughness: 0.3,
        metalness: 0.04,
        clearcoat: 0.4,
      }),
    [region.color],
  )
  const haloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: region.color,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [region.color],
  )

  useFrame(({ clock }) => {
    if (!meshRef.current || !haloRef.current) return
    const t = clock.getElapsedTime()
    const focus = highlighted || hovered ? 1.5 : 1
    const pulse = 1 + Math.sin(t * 2 + region.position[0] * 7) * 0.06
    meshRef.current.scale.setScalar(pulse * focus)
    haloRef.current.scale.setScalar(pulse * focus * 1.8)
    mat.emissiveIntensity =
      0.55 + (highlighted || hovered ? 0.7 : 0) + Math.sin(t * 3) * 0.08
    haloMat.opacity = 0.1 + (highlighted || hovered ? 0.35 : 0)
  })

  return (
    <group position={region.position}>
      <mesh
        ref={meshRef}
        material={mat}
        onPointerOver={e => {
          e.stopPropagation()
          setHovered(true)
          onHover?.(region.slug)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          onHover?.(null)
          document.body.style.cursor = ''
        }}
        onClick={e => {
          e.stopPropagation()
          onSelect?.(region.slug)
        }}
      >
        <icosahedronGeometry args={[region.radius, 1]} />
      </mesh>
      <mesh ref={haloRef} material={haloMat}>
        <sphereGeometry args={[region.radius, 24, 24]} />
      </mesh>
      {(hovered || highlighted) && (
        <Html distanceFactor={5} center>
          <div className="pointer-events-none px-2 py-1 rounded-md bg-bg-panel/90 border border-line/70 text-[11px] text-ink whitespace-nowrap backdrop-blur shadow-lg">
            {region.name}
          </div>
        </Html>
      )}
    </group>
  )
}

export const BRAIN_REGIONS = REGIONS

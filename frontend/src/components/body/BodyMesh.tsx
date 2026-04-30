import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { ORGAN_3D_POSITIONS } from '@/data/organPositions'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'

interface Props {
  interactive?: boolean
  highlightedSlug?: string
  onHover?: (slug: string | null) => void
}

/**
 * Composite body mesh: stylised human silhouette built from primitives,
 * with named "organ markers" floating inside that can be hovered/clicked.
 */
export function BodyMesh({
  interactive = true,
  highlightedSlug,
  onHover,
}: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current || interactive) return
    groupRef.current.rotation.y =
      Math.sin(clock.getElapsedTime() * 0.25) * 0.15
  })

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <BodySilhouette />
      {ORGAN_3D_POSITIONS.map(o => (
        <OrganMarker
          key={o.slug}
          slug={o.slug}
          name={o.name}
          position={o.position}
          color={o.color}
          radius={o.radius}
          highlighted={highlightedSlug === o.slug}
          interactive={interactive}
          onHover={onHover}
        />
      ))}
    </group>
  )
}

function BodySilhouette() {
  const matBody = (
    <meshStandardMaterial
      color="#10151f"
      transparent
      opacity={0.55}
      roughness={0.5}
      metalness={0.1}
      emissive="#7ee0d2"
      emissiveIntensity={0.04}
    />
  )
  return (
    <group>
      {/* head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        {matBody}
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.18, 24]} />
        {matBody}
      </mesh>
      {/* torso */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.42, 0.85, 8, 24]} />
        {matBody}
      </mesh>
      {/* hips */}
      <mesh position={[0, -0.18, 0]}>
        <capsuleGeometry args={[0.36, 0.18, 8, 24]} />
        {matBody}
      </mesh>
      {/* arms */}
      <mesh position={[-0.55, 0.55, 0]} rotation={[0, 0, 0.18]}>
        <capsuleGeometry args={[0.09, 0.95, 6, 16]} />
        {matBody}
      </mesh>
      <mesh position={[0.55, 0.55, 0]} rotation={[0, 0, -0.18]}>
        <capsuleGeometry args={[0.09, 0.95, 6, 16]} />
        {matBody}
      </mesh>
      {/* legs */}
      <mesh position={[-0.18, -0.85, 0]}>
        <capsuleGeometry args={[0.13, 0.95, 6, 16]} />
        {matBody}
      </mesh>
      <mesh position={[0.18, -0.85, 0]}>
        <capsuleGeometry args={[0.13, 0.95, 6, 16]} />
        {matBody}
      </mesh>

      {/* outline glow */}
      <mesh scale={1.02}>
        <boxGeometry args={[0.001, 0.001, 0.001]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

function OrganMarker({
  slug,
  name,
  position,
  color,
  radius,
  highlighted,
  interactive,
  onHover,
}: {
  slug: string
  name: string
  position: [number, number, number]
  color: string
  radius: number
  highlighted: boolean
  interactive: boolean
  onHover?: (slug: string | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const navigate = useNavigate()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const baseScale = highlighted || hovered ? 1.35 : 1
    meshRef.current.scale.setScalar(baseScale + Math.sin(t * 2 + position[0]) * 0.04)
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity =
      0.6 + (highlighted || hovered ? 0.6 : 0) + Math.sin(t * 3) * 0.1
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={
          interactive
            ? e => {
                e.stopPropagation()
                setHovered(true)
                onHover?.(slug)
                document.body.style.cursor = 'pointer'
              }
            : undefined
        }
        onPointerOut={
          interactive
            ? () => {
                setHovered(false)
                onHover?.(null)
                document.body.style.cursor = ''
              }
            : undefined
        }
        onClick={
          interactive
            ? e => {
                e.stopPropagation()
                navigate(`/corps/${slug}`)
              }
            : undefined
        }
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.8, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={highlighted || hovered ? 0.18 : 0.08}
          depthWrite={false}
        />
      </mesh>
      {(hovered || highlighted) && interactive && (
        <Html distanceFactor={5} center>
          <div className="pointer-events-none px-2 py-1 rounded-md bg-bg-panel/90 border border-line/70 text-[11px] text-ink whitespace-nowrap backdrop-blur shadow-lg">
            {name}
          </div>
        </Html>
      )}
    </group>
  )
}

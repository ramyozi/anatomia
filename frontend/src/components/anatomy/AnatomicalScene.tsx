import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AnatomyModel, listAnatomyModels } from './AnatomyModel'

/**
 * Composite anatomical scene assembled from real BodyParts3D primitives.
 * Each organ keeps its native BodyParts3D world frame, so the parts line
 * up coherently inside a single torso.
 */
interface Props {
  /** Highlight a specific organ slug (rim glow + scale). */
  focused?: string | null
  showSkeleton?: boolean
  showOrgans?: boolean
  showSkin?: boolean
}

const ORGAN_SLUGS = [
  'cerveau',
  'coeur',
  'poumons',
  'foie',
  'estomac',
  'rate',
  'reins',
  'vessie',
  'pancreas',
  'vesicule',
  'trachee',
  'oesophage',
  'diaphragme',
  'thyroide',
]

const SKELETON_SLUGS = [
  'mandibule',
  'sternum',
  'sacrum',
  'femur-d',
  'femur-g',
  'tibia-d',
  'tibia-g',
  'humerus-d',
  'humerus-g',
  'scapula-d',
  'scapula-g',
  'vertebres',
]

export function AnatomicalScene({
  focused,
  showSkeleton = false,
  showOrgans = true,
}: Props) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += dt * 0.05
  })

  const knownSlugs = useMemo(
    () => new Set(listAnatomyModels().map(m => m.slug)),
    [],
  )

  return (
    <group ref={groupRef}>
      {showOrgans &&
        ORGAN_SLUGS.filter(s => knownSlugs.has(s)).map(slug => (
          <PlacedOrgan key={slug} slug={slug} focused={focused === slug} />
        ))}
      {showSkeleton &&
        SKELETON_SLUGS.filter(s => knownSlugs.has(s)).map(slug => (
          <PlacedOrgan key={slug} slug={slug} focused={focused === slug} bone />
        ))}
    </group>
  )
}

function PlacedOrgan({
  slug,
  focused,
  bone = false,
}: {
  slug: string
  focused: boolean
  bone?: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    const target = focused ? 1.18 : 1
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08)
  })
  return (
    <group ref={ref}>
      <AnatomyModel
        slug={slug}
        emissiveIntensity={focused ? 0.55 : bone ? 0.05 : 0.18}
        roughness={bone ? 0.7 : 0.45}
      />
    </group>
  )
}

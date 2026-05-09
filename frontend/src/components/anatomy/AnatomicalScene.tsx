import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CompositeModel } from './CompositeModel'

/**
 * Whole-body view assembled from BodyParts3D composite GLBs.
 *
 * Each composite (thorax, abdomen, squelette) was already centered &
 * rescaled to [-1, 1] during conversion. To stack them inside a single
 * torso silhouette we offset them on Y and scale the visceral blocks
 * down so they fit between the shoulders and the hips of the skeleton.
 */
interface Props {
  showOrgans?: boolean
  showSkeleton?: boolean
  focused?: string | null
  onRegionHover?: (region: string | null) => void
  onRegionClick?: (region: string) => void
}

export function AnatomicalScene({
  showOrgans = true,
  showSkeleton = true,
  focused,
  onRegionHover,
  onRegionClick,
}: Props) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.04
  })

  return (
    <group ref={groupRef}>
      {showSkeleton && (
        <group position={[0, 0, 0]}>
          <CompositeModel
            slug="squelette"
            highlightedRegion={focused}
            onRegionHover={onRegionHover}
            onRegionClick={onRegionClick}
            roughness={0.7}
            emissiveIntensity={0.06}
          />
        </group>
      )}
      {showOrgans && (
        <>
          <group position={[0, 0.5, 0]} scale={[0.55, 0.55, 0.55]}>
            <CompositeModel
              slug="thorax"
              highlightedRegion={focused}
              onRegionHover={onRegionHover}
              onRegionClick={onRegionClick}
              roughness={0.45}
              emissiveIntensity={0.18}
            />
          </group>
          <group position={[0, -0.32, 0]} scale={[0.5, 0.5, 0.5]}>
            <CompositeModel
              slug="abdomen"
              highlightedRegion={focused}
              onRegionHover={onRegionHover}
              onRegionClick={onRegionClick}
              roughness={0.45}
              emissiveIntensity={0.18}
            />
          </group>
        </>
      )}
    </group>
  )
}

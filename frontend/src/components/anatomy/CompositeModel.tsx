import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import models from '@/data/anatomy-models.json'

interface RegionEntry {
  regionSlug: string
  fmaId: string
  color: string
  facesAfter: number
  facesBefore: number
}
interface CompositeEntry {
  slug: string
  kind: 'composite'
  label: string
  byteSize: number
  path: string
  regions: RegionEntry[]
}
interface SoloEntry {
  slug: string
  kind?: 'solo'
  fmaId: string
  label: string
  color: string
  facesAfter: number
  facesBefore: number
  byteSize: number
  path: string
  parts: string[]
  license: string
}

type Entry = CompositeEntry | SoloEntry

const REGISTRY = models as { models: Entry[] }
const BY_SLUG = new Map<string, Entry>(REGISTRY.models.map(m => [m.slug, m]))

export function getModel(slug: string) {
  return BY_SLUG.get(slug)
}

export function getCompositeRegions(slug: string): RegionEntry[] {
  const m = BY_SLUG.get(slug)
  if (m && m.kind === 'composite') return m.regions
  return []
}

interface CompositeProps {
  slug: string
  highlightedRegion?: string | null
  onRegionHover?: (region: string | null) => void
  onRegionClick?: (region: string) => void
  /** Roughness override for all regions. */
  roughness?: number
  /** Boost emissive of all regions (the highlighted one gets +0.5). */
  emissiveIntensity?: number
}

/**
 * Renders a composite GLB (one node per anatomical region) with a single
 * shared PBR material per region color. Hovering or selecting a region
 * boosts its emissive so the user can see which one they targeted.
 */
export function CompositeModel({
  slug,
  highlightedRegion,
  onRegionHover,
  onRegionClick,
  roughness = 0.5,
  emissiveIntensity = 0.18,
}: CompositeProps) {
  const entry = BY_SLUG.get(slug)
  if (!entry || entry.kind !== 'composite') return null
  return (
    <Suspense fallback={null}>
      <Inner
        entry={entry}
        highlightedRegion={highlightedRegion ?? null}
        onRegionHover={onRegionHover}
        onRegionClick={onRegionClick}
        roughness={roughness}
        emissiveIntensity={emissiveIntensity}
      />
    </Suspense>
  )
}

function Inner({
  entry,
  highlightedRegion,
  onRegionHover,
  onRegionClick,
  roughness,
  emissiveIntensity,
}: {
  entry: CompositeEntry
  highlightedRegion: string | null
  onRegionHover?: (region: string | null) => void
  onRegionClick?: (region: string) => void
  roughness: number
  emissiveIntensity: number
}) {
  const gltf = useGLTF(entry.path) as unknown as { scene: THREE.Group }
  const scene = gltf.scene
  const groupRef = useRef<THREE.Group>(null)

  // Annotate the gltf scene once: replace materials, remember region slugs
  // on userData so the click bubble can identify the picked region.
  const regionRefs = useMemo(() => {
    const colorByRegion = new Map(entry.regions.map(r => [r.regionSlug, r.color]))
    const out: { regionSlug: string; mesh: THREE.Mesh; mat: THREE.MeshPhysicalMaterial }[] = []
    scene.traverse(obj => {
      if (!(obj as THREE.Mesh).isMesh) return
      const mesh = obj as THREE.Mesh
      const region = mesh.name || obj.parent?.name || 'unknown'
      const color = colorByRegion.get(region) ?? '#7ee0d2'
      // Tissue-like PBR with a subtle clearcoat for that "wet anatomical"
      // sheen and a low emissive so the lighting still does most of the
      // shape readout. The unlit side stays slightly lit so structure is
      // never lost in pitch black.
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        emissive: new THREE.Color(color).multiplyScalar(0.3),
        emissiveIntensity: emissiveIntensity * 0.25,
        roughness,
        metalness: 0.0,
        clearcoat: 0.4,
        clearcoatRoughness: 0.35,
        sheen: 0.7,
        sheenColor: new THREE.Color(color),
        sheenRoughness: 0.4,
        flatShading: false,
      })
      mesh.material = mat
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData.regionSlug = region
      out.push({ regionSlug: region, mesh, mat })
    })
    return out
  }, [scene, entry, roughness, emissiveIntensity])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.06
    for (const { regionSlug, mat, mesh } of regionRefs) {
      const isFocus = regionSlug === highlightedRegion
      const target = isFocus ? emissiveIntensity + 0.55 : emissiveIntensity
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * 0.12
      const targetScale = isFocus ? 1.04 : 1
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12)
    }
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e: any) => {
        if (!onRegionHover) return
        e.stopPropagation()
        const slug = e.object?.userData?.regionSlug
        if (slug) {
          onRegionHover(slug)
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        if (!onRegionHover) return
        onRegionHover(null)
        document.body.style.cursor = ''
      }}
      onClick={(e: any) => {
        if (!onRegionClick) return
        const slug = e.object?.userData?.regionSlug
        if (slug) {
          e.stopPropagation()
          onRegionClick(slug)
        }
      }}
    >
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/anatomy/cerveau.glb')
useGLTF.preload('/models/anatomy/thorax.glb')
useGLTF.preload('/models/anatomy/abdomen.glb')
useGLTF.preload('/models/anatomy/squelette.glb')

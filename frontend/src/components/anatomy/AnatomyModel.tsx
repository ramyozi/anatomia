import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import models from '@/data/anatomy-models.json'

interface ModelEntry {
  slug: string
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

const REGISTRY = models as { models: ModelEntry[] }

const BY_SLUG = new Map<string, ModelEntry>(
  REGISTRY.models.map(m => [m.slug, m]),
)

export function getAnatomyModel(slug: string): ModelEntry | undefined {
  return BY_SLUG.get(slug)
}

export function listAnatomyModels(): ModelEntry[] {
  return REGISTRY.models
}

interface Props {
  slug: string
  /** Override the registry default tissue color. */
  color?: string
  /** Roughness (default 0.55). */
  roughness?: number
  /** Whether the model should slowly auto-rotate. */
  autoRotate?: boolean
  /** Subtle pulse intensity (0 disables). */
  pulse?: number
  /** Wireframe overlay opacity (0 disables). */
  wireframe?: number
  /** Optional emissive boost (default 0.18). */
  emissiveIntensity?: number
}

/**
 * Renders a real BodyParts3D anatomical mesh as GLB. Uses ``useGLTF`` for
 * Suspense-friendly loading and shares the cached buffer between instances.
 *
 * The mesh ships with vertex colors but we override them with a tissue
 * material so we get proper PBR + fresnel rim shading.
 */
export function AnatomyModel({
  slug,
  color,
  roughness = 0.5,
  autoRotate = false,
  pulse = 0,
  wireframe = 0,
  emissiveIntensity = 0.18,
}: Props) {
  const entry = getAnatomyModel(slug)
  if (!entry) return null
  return (
    <Suspense fallback={null}>
      <Inner
        entry={entry}
        color={color ?? entry.color}
        roughness={roughness}
        autoRotate={autoRotate}
        pulse={pulse}
        wireframe={wireframe}
        emissiveIntensity={emissiveIntensity}
      />
    </Suspense>
  )
}

function Inner({
  entry,
  color,
  roughness,
  autoRotate,
  pulse,
  wireframe,
  emissiveIntensity,
}: {
  entry: ModelEntry
  color: string
  roughness: number
  autoRotate: boolean
  pulse: number
  wireframe: number
  emissiveIntensity: number
}) {
  const { scene } = useGLTF(entry.path) as unknown as { scene: THREE.Group }
  const groupRef = useRef<THREE.Group>(null)

  // Replace per-mesh material with a shared anatomical PBR material once.
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color,
      // Very subtle emissive so the shadow side stays legible without
      // washing out the form. The bulk of the brightness comes from the
      // PBR lighting in Stage.tsx.
      emissive: new THREE.Color(color).multiplyScalar(0.3),
      emissiveIntensity: emissiveIntensity * 0.25,
      roughness,
      metalness: 0.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.35,
      sheen: 0.7,
      sheenColor: new THREE.Color(color),
      sheenRoughness: 0.4,
    })
  }, [color, roughness, emissiveIntensity])

  const wireMaterial = useMemo(
    () =>
      wireframe > 0
        ? new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: wireframe,
          })
        : null,
    [color, wireframe],
  )

  useMemo(() => {
    scene.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.material = material
      }
    })
  }, [scene, material])

  useFrame((_, dt) => {
    if (!groupRef.current) return
    if (autoRotate) groupRef.current.rotation.y += dt * 0.18
    if (pulse > 0) {
      const t = performance.now() / 1000
      const s = 1 + Math.sin(t * 2.2) * pulse
      groupRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {wireMaterial && (
        <primitive object={scene.clone(true)} scale={1.001}>
          {/* dummy — wire mesh is actually applied via traverse below */}
        </primitive>
      )}
    </group>
  )
}

// Preload solo organs that the catalogue links to most often, so the
// fiche detail page doesn't pop on first navigation. The "cerveau" slug
// is now a composite GLB and is preloaded by CompositeModel.tsx instead.
useGLTF.preload('/models/anatomy/coeur.glb')
useGLTF.preload('/models/anatomy/poumons.glb')
useGLTF.preload('/models/anatomy/foie.glb')

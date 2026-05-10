import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import {
  type SystemKey,
  cameraTarget,
  getSystem,
  regionLabel,
  regionMatchesSystem,
} from './systems'

const MODEL_PATH = '/models/anatomy/human-body.glb'

interface Region {
  name: string
  mesh: THREE.Mesh
  material: THREE.MeshStandardMaterial
  baseOpacity: number
}

interface Props {
  /** Currently active system filter. ``all`` shows everything at full opacity. */
  system: SystemKey
  /** Optional region (dotted name) hovered/selected — gets a brighter rim. */
  highlighted?: string | null
  /** Hover/click hooks (the picked region's dotted name is passed in). */
  onRegionHover?: (region: string | null) => void
  onRegionClick?: (region: string) => void
  /** When true, regions outside the system fade to 8% opacity instead of being hidden. */
  fadeRest?: boolean
  /** When true, the model auto-rotates around Y. */
  autoRotate?: boolean
  /** When true, smoothly tweens the camera to the system's framing on each system change. */
  tweenCamera?: boolean
}

/**
 * The single anatomical viewer used by every page.
 *
 * - Loads ``human-body.glb`` once (cached by ``useGLTF``).
 * - Applies a per-region anatomical PBR material (mat finish, very low
 *   emissive, vertex-color from the GLB used as base diffuse).
 * - Filters visibility of regions according to the active system
 *   (``visible=false`` outside, full opacity inside; ``fadeRest`` keeps
 *   them visible at low opacity instead).
 * - Smoothly tweens the camera to the system's framing.
 */
export function HumanBody(props: Props) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  )
}

function Inner({
  system,
  highlighted,
  onRegionHover,
  onRegionClick,
  fadeRest = false,
  autoRotate = false,
  tweenCamera = true,
}: Props) {
  const { scene: gltfScene } = useGLTF(MODEL_PATH) as unknown as {
    scene: THREE.Group
  }
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  // Walk the gltf scene once, swap materials, register region metadata.
  const regions = useMemo(() => {
    const out: Region[] = []
    gltfScene.traverse(obj => {
      if (!(obj as THREE.Mesh).isMesh) return
      const mesh = obj as THREE.Mesh
      const name = mesh.name || mesh.parent?.name || 'unknown'
      const baseColor = new THREE.Color(colorForRegion(name))
      // Strip vertex colours from the geometry — trimesh writes them per
      // vertex but they shadow our per-region tint when the GLTFLoader
      // auto-enables ``vertexColors`` on the material. We also recompute
      // smooth normals so the lighting actually responds.
      const geom = mesh.geometry as THREE.BufferGeometry
      if (geom.getAttribute('color')) geom.deleteAttribute('color')
      if (!geom.getAttribute('normal')) geom.computeVertexNormals()
      const material = new THREE.MeshStandardMaterial({
        color: baseColor,
        vertexColors: false,
        metalness: 0,
        roughness: 0.85,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide,
      })
      mesh.material = material
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData.regionName = name
      out.push({ name, mesh, material, baseOpacity: 1 })
    })
    return out
  }, [gltfScene])

  // Tween-target storage for the camera. We deliberately re-target the
  // camera ONLY when the system actually changes (not on the first mount
  // or when the user hovered a region) — that keeps the user's manual
  // zoom / rotation intact while still pulling the view towards the
  // right anatomical area when they pick a different system.
  const camTarget = useRef({ position: new THREE.Vector3(), lookAt: new THREE.Vector3() })
  const isFirstMount = useRef(true)
  const tweenActive = useRef(false)
  const tweenStarted = useRef(0)
  useEffect(() => {
    const t = cameraTarget(system)
    camTarget.current.position.copy(t.position)
    camTarget.current.lookAt.copy(t.lookAt)
    if (isFirstMount.current) {
      // On first mount, snap directly so the model isn't off-screen
      // for the first second.
      camera.position.copy(t.position)
      camera.lookAt(t.lookAt)
      isFirstMount.current = false
      return
    }
    tweenActive.current = true
    tweenStarted.current = performance.now()
  }, [system, camera])

  useFrame((_, dt) => {
    if (!groupRef.current) return
    if (autoRotate) groupRef.current.rotation.y += dt * 0.18

    // Apply system filter (visibility / opacity). Re-run every frame is
    // dirt cheap (~45 meshes, just boolean / number assignments). The
    // highlighted region gets a brighter color tint so the user sees
    // which one is targeted without us touching the lighting setup.
    for (const r of regions) {
      const inSystem = regionMatchesSystem(r.name, system)
      const isHighlighted = r.name === highlighted
      if (system === 'all' || inSystem) {
        r.mesh.visible = true
        r.material.transparent = false
        r.material.depthWrite = true
        r.material.opacity = 1
        r.material.emissive = isHighlighted
          ? new THREE.Color(r.material.color).multiplyScalar(0.5)
          : new THREE.Color(0, 0, 0)
        r.material.emissiveIntensity = isHighlighted ? 1 : 0
      } else if (fadeRest) {
        r.mesh.visible = true
        r.material.transparent = true
        r.material.depthWrite = false
        r.material.opacity = 0.05
        r.material.emissiveIntensity = 0
      } else {
        r.mesh.visible = false
      }
    }

    // Only pull the camera while the tween is "live" (i.e. just after a
    // system change) and stop after the user starts dragging — we don't
    // want OrbitControls and our lerp fighting forever. We also bail
    // out as soon as we're close enough to the target.
    if (tweenCamera && tweenActive.current) {
      camera.position.lerp(camTarget.current.position, dt * 2.2)
      const dist = camera.position.distanceTo(camTarget.current.position)
      const elapsedMs = performance.now() - tweenStarted.current
      if (dist < 0.02 || elapsedMs > 1200) tweenActive.current = false
    }
  })

  return (
    // BodyParts3D uses Z-up; rotate -90° around X so the body stands
    // upright in three.js' Y-up world. The mirrored Y maps anterior to
    // +Z so the camera looking down -Z sees the front of the body.
    <group
      ref={groupRef}
      rotation={[-Math.PI / 2, 0, Math.PI]}
      onPointerOver={(e: any) => {
        if (!onRegionHover) return
        const obj = e.object as THREE.Mesh
        const name = (obj.userData?.regionName as string | undefined) ?? null
        if (!name) return
        e.stopPropagation()
        if (regionMatchesSystem(name, system) || system === 'all') {
          onRegionHover(name)
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
        const obj = e.object as THREE.Mesh
        const name = obj.userData?.regionName as string | undefined
        if (!name) return
        if (regionMatchesSystem(name, system) || system === 'all') {
          e.stopPropagation()
          onRegionClick(name)
        }
      }}
    >
      <primitive object={gltfScene} />
    </group>
  )
}

/**
 * Anatomical palette — neutral, slightly desaturated tones picked to
 * mimic medical viewers (NIH 3D, Visible Body) rather than a "rainbow"
 * organ chart.
 */
function colorForRegion(name: string): string {
  if (name.startsWith('skeletal__')) return '#efe7d4'
  if (name.startsWith('cardio__')) return '#c44747'
  if (name.startsWith('respi__diaphragm')) return '#bf5757'
  if (name.startsWith('respi__lung')) return '#c98793'
  if (name.startsWith('respi__trachea')) return '#a4c0c5'
  if (name.startsWith('respi__')) return '#c98793'
  if (name.startsWith('digestive__liver')) return '#9a4a36'
  if (name.startsWith('digestive__stomach')) return '#cf8e5d'
  if (name.startsWith('digestive__gallbladder')) return '#6a9356'
  if (name.startsWith('digestive__pancreas')) return '#dab17e'
  if (name.startsWith('digestive__spleen')) return '#7a4252'
  if (name.startsWith('digestive__esophagus')) return '#cf9a7e'
  if (name.startsWith('digestive__')) return '#cf9a7e'
  if (name.startsWith('urinary__bladder')) return '#cfb78c'
  if (name.startsWith('urinary__')) return '#8a4848'
  if (name.startsWith('endocrine__')) return '#e0bf8a'
  if (name.startsWith('sensory__')) return '#a3bfbf'
  if (name === 'brain__cerebellum') return '#caa9a3'
  if (name === 'brain__midbrain') return '#bd9994'
  if (name.startsWith('brain__thalamus')) return '#d9b8ad'
  if (name.startsWith('brain__hippocampus')) return '#b1897a'
  if (name === 'brain__hypothalamus') return '#d3a896'
  if (name === 'brain__fornix') return '#c5a89a'
  if (name === 'brain__peduncle') return '#bd968b'
  if (name.startsWith('nervous__')) return '#c4a4ff'
  return '#cfb89e'
}

useGLTF.preload(MODEL_PATH)

/** All region names (dotted) currently exposed by the GLB, in load order. */
export const KNOWN_REGIONS = [
  'brain__cerebellum',
  'brain__midbrain',
  'brain__thalamus-r',
  'brain__thalamus-l',
  'brain__hippocampus-r',
  'brain__hippocampus-l',
  'brain__hypothalamus',
  'brain__fornix',
  'brain__peduncle',
  'nervous__spinal-canal',
  'cardio__heart',
  'respi__trachea',
  'respi__lung-up-r',
  'respi__lung-mid-r',
  'respi__lung-low-r',
  'respi__lung-up-l',
  'respi__lung-low-l',
  'respi__diaphragm',
  'digestive__esophagus',
  'digestive__stomach',
  'digestive__liver',
  'digestive__gallbladder',
  'digestive__pancreas',
  'digestive__spleen',
  'urinary__kidney-r',
  'urinary__kidney-l',
  'urinary__bladder',
  'endocrine__thyroid-cart',
  'sensory__eye',
  'skeletal__scapula-r',
  'skeletal__scapula-l',
  'skeletal__humerus-r',
  'skeletal__humerus-l',
  'skeletal__femur-r',
  'skeletal__femur-l',
  'skeletal__tibia-r',
  'skeletal__tibia-l',
  'skeletal__sacrum',
  'skeletal__mandible',
  'skeletal__sternum',
  'skeletal__vertebra-l1',
  'skeletal__vertebra-l2',
  'skeletal__vertebra-l3',
  'skeletal__vertebra-l4',
  'skeletal__vertebra-l5',
] as const

export { regionLabel, getSystem }

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { MODEL_PATH } from './HumanBody'
import { type SystemKey, regionMatchesSystem } from './systems'
import {
  frameBox,
  zoomBounds,
  clampedZoom,
  type Framing,
} from '@/lib/cameraFraming'
import { useViewer3D, type CameraActions } from '@/stores/viewer3d'

/**
 * In-Canvas camera rig: intelligent auto-focus + smooth tweens.
 *
 * When the active system changes it computes the *real* world-space
 * bounding box of the meshes that belong to that system and re-frames
 * the camera so they fill the viewport — no more tiny, off-centre brain
 * when switching to the nervous system. It also feeds the DOM control
 * overlay (zoom / fit / reset) via the viewer3d store.
 *
 * Render this inside <Canvas>, as a sibling of <HumanBody> and
 * <OrbitControls makeDefault>.
 */

type OrbitLike = {
  target: THREE.Vector3
  update: () => void
  minDistance: number
  maxDistance: number
  addEventListener: (type: string, fn: () => void) => void
  removeEventListener: (type: string, fn: () => void) => void
}

interface Props {
  system: SystemKey
  /** Comfort padding around the framed box (1 = tight). */
  margin?: number
}

const FRONT = new THREE.Vector3(0, 0, 1)

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export function CameraRig({ system, margin = 1.4 }: Props) {
  const { scene } = useGLTF(MODEL_PATH) as unknown as { scene: THREE.Group }
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const controls = useThree((s) => s.controls) as OrbitLike | null
  const size = useThree((s) => s.size)
  const registerActions = useViewer3D((s) => s.registerActions)

  const tween = useRef({
    active: false,
    t: 0,
    dur: 0.85,
    fromPos: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    fromTarget: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
  })
  // System awaiting a re-frame; the work happens in useFrame so the GLB
  // is guaranteed parented + matrices fresh. Seeded so the first paint
  // snaps straight to a good framing.
  const pending = useRef<SystemKey | null>(system)
  const didInitial = useRef(false)

  /** World-space bounding box of the meshes belonging to ``sys``. */
  function computeBox(sys: SystemKey): THREE.Box3 {
    const box = new THREE.Box3()
    const tmp = new THREE.Box3()
    scene.updateWorldMatrix(true, true)
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      if (sys !== 'all' && !regionMatchesSystem(mesh.name, sys)) return
      tmp.setFromObject(mesh)
      if (!tmp.isEmpty()) box.union(tmp)
    })
    return box
  }

  /** Build the framing for a system, or null if it has no geometry yet. */
  function buildFraming(
    sys: SystemKey,
    keepAngle: boolean,
  ): { framing: Framing; box: THREE.Box3 } | null {
    const box = computeBox(sys)
    if (box.isEmpty()) return null
    let viewDir = FRONT.clone()
    if (keepAngle && controls) {
      const d = camera.position.clone().sub(controls.target)
      if (d.lengthSq() > 1e-6) viewDir = d.normalize()
    }
    const framing = frameBox(box, {
      fovDeg: camera.fov,
      aspect: size.width / Math.max(size.height, 1),
      viewDir,
      margin,
    })
    return { framing, box }
  }

  function applyBounds(box: THREE.Box3) {
    if (!controls) return
    const b = zoomBounds(box)
    controls.minDistance = b.min
    controls.maxDistance = b.max
  }

  function startTween(framing: Framing, dur: number) {
    const t = tween.current
    t.fromPos.copy(camera.position)
    t.toPos.copy(framing.position)
    t.fromTarget.copy(controls ? controls.target : framing.target)
    t.toTarget.copy(framing.target)
    t.t = 0
    t.dur = dur
    t.active = true
  }

  // Re-frame whenever the active system changes.
  useEffect(() => {
    pending.current = system
  }, [system])

  // A user grabbing the camera cancels any running auto-tween.
  useEffect(() => {
    if (!controls) return
    const stop = () => {
      tween.current.active = false
    }
    controls.addEventListener('start', stop)
    return () => controls.removeEventListener('start', stop)
  }, [controls])

  // Publish the imperative actions consumed by the DOM control overlay.
  useEffect(() => {
    const actions: CameraActions = {
      zoomBy: (factor) => {
        if (!controls) return
        const dir = camera.position.clone().sub(controls.target)
        const dist = dir.length()
        if (dist < 1e-6) return
        const next = clampedZoom(
          dist,
          factor,
          controls.minDistance,
          controls.maxDistance,
        )
        startTween(
          {
            target: controls.target.clone(),
            position: controls.target
              .clone()
              .add(dir.normalize().multiplyScalar(next)),
            distance: next,
          },
          0.32,
        )
      },
      fit: () => {
        const built = buildFraming(system, true)
        if (built) {
          applyBounds(built.box)
          startTween(built.framing, 0.65)
        }
      },
      reset: () => {
        const built = buildFraming(system, false)
        if (built) {
          applyBounds(built.box)
          startTween(built.framing, 0.8)
        }
      },
    }
    registerActions(actions)
    return () => registerActions(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, camera, system, size.width, size.height])

  useFrame((_, dt) => {
    // Handle a queued re-frame once the GLB geometry is available.
    if (pending.current !== null) {
      const built = buildFraming(pending.current, false)
      if (built) {
        applyBounds(built.box)
        if (!didInitial.current) {
          // First paint: snap, don't tween (avoids a load-time swoop).
          camera.position.copy(built.framing.position)
          if (controls) {
            controls.target.copy(built.framing.target)
            controls.update()
          }
          didInitial.current = true
        } else {
          startTween(built.framing, 0.85)
        }
        pending.current = null
      }
    }

    // Drive the active tween.
    const t = tween.current
    if (!t.active || !controls) return
    t.t = Math.min(1, t.t + dt / t.dur)
    const e = easeInOutCubic(t.t)
    camera.position.lerpVectors(t.fromPos, t.toPos, e)
    controls.target.lerpVectors(t.fromTarget, t.toTarget, e)
    controls.update()
    if (t.t >= 1) t.active = false
  })

  return null
}

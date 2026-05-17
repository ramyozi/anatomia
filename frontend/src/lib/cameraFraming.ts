import * as THREE from 'three'

/**
 * Camera-framing maths for the 3D anatomy viewer.
 *
 * Pure, side-effect-free helpers so they can be unit-tested without a
 * WebGL context. The viewer (CameraRig) feeds in a bounding box of the
 * meshes that should be visible and gets back where to place the camera
 * and what to look at.
 */

export interface Framing {
  /** Point the camera should look at (centre of the box). */
  target: THREE.Vector3
  /** Where the camera should sit. */
  position: THREE.Vector3
  /** Distance between position and target. */
  distance: number
}

export interface FrameOptions {
  /** Vertical field of view, in degrees (matches the R3F camera). */
  fovDeg: number
  /** Viewport aspect ratio (width / height). */
  aspect: number
  /** Normalised direction from target towards the camera. Default: front (+Z). */
  viewDir?: THREE.Vector3
  /** Padding factor around the box. 1 = tight, ~1.35 = comfortable. */
  margin?: number
  /** Never frame closer than this. */
  minDistance?: number
}

/**
 * Compute the camera distance + position that fits ``box`` fully in
 * view for the given fov / aspect. Accounts for both the vertical and
 * horizontal extents (whichever needs the camera further back wins) and
 * pushes back by half the box depth so the near face never clips.
 */
export function frameBox(box: THREE.Box3, opts: FrameOptions): Framing {
  const { fovDeg, aspect, margin = 1.35, minDistance = 0.1 } = opts

  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())

  const fov = THREE.MathUtils.degToRad(fovDeg)
  const halfV = size.y / 2
  const halfH = size.x / 2

  // Distance so the vertical extent fits the vertical fov.
  const distV = halfV / Math.tan(fov / 2)
  // Horizontal fov derived from the vertical fov + aspect.
  const hFov = 2 * Math.atan(Math.tan(fov / 2) * aspect)
  const distH = halfH / Math.tan(hFov / 2)

  // Whichever axis needs the camera further back wins; add half the
  // depth so the box's near face stays inside the frustum, then pad.
  let distance = Math.max(distV, distH) * margin + size.z / 2
  if (!Number.isFinite(distance) || distance <= 0) distance = minDistance
  distance = Math.max(distance, minDistance)

  const dir = (opts.viewDir ?? new THREE.Vector3(0, 0, 1))
    .clone()
    .normalize()
  const position = center.clone().add(dir.multiplyScalar(distance))

  return { target: center, position, distance }
}

/**
 * Sensible orbit zoom bounds for a framed box: a touch closer than the
 * tightest single-axis fit, and a few box-sizes out.
 */
export function zoomBounds(
  box: THREE.Box3,
): { min: number; max: number } {
  const size = box.getSize(new THREE.Vector3())
  const maxDim = Math.max(size.x, size.y, size.z, 0.01)
  return {
    min: Math.max(maxDim * 0.25, 0.08),
    max: maxDim * 6,
  }
}

/**
 * Move ``distance`` towards / away from a target by a multiplicative
 * factor, clamped to [min, max]. factor < 1 zooms in, > 1 zooms out.
 */
export function clampedZoom(
  distance: number,
  factor: number,
  min: number,
  max: number,
): number {
  return THREE.MathUtils.clamp(distance * factor, min, max)
}

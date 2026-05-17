import { create } from 'zustand'

/**
 * Bridge between the in-Canvas camera rig and the DOM control overlay.
 *
 * The overlay buttons (zoom / fit / reset) live in the regular DOM tree
 * while the camera + OrbitControls live inside the R3F <Canvas>. R3F
 * does not share React context across that boundary, so the in-Canvas
 * ``CameraRig`` registers its imperative actions into this module-level
 * store and the overlay calls them. ``actions`` is null until the rig
 * has mounted.
 */

export interface CameraActions {
  /** factor < 1 zooms in, > 1 zooms out (clamped to the orbit bounds). */
  zoomBy: (factor: number) => void
  /** Re-frame the current system, keeping the current view angle. */
  fit: () => void
  /** Re-frame the current system from the default front-facing angle. */
  reset: () => void
}

interface Viewer3DState {
  actions: CameraActions | null
  registerActions: (actions: CameraActions | null) => void
}

export const useViewer3D = create<Viewer3DState>((set) => ({
  actions: null,
  registerActions: (actions) => set({ actions }),
}))

import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

/**
 * Mounts a tiny global so we can validate scenes from outside React via
 * `window.__anatomia_debug.<id>()`. Returns a snapshot useful for
 * verifying that a model was actually rendered: meshes, world bbox,
 * camera position, and a flag telling us whether the bbox intersects
 * the camera frustum.
 *
 * This is a *debug-only* hook — production builds tree-shake it out
 * because it's never imported elsewhere.
 */
export function SceneDebug({ id }: { id: string }) {
  const { scene, camera } = useThree()
  useEffect(() => {
    type DebugApi = Record<string, () => unknown>
    const win = window as unknown as { __anatomia_debug?: DebugApi }
    if (!win.__anatomia_debug) win.__anatomia_debug = {}
    win.__anatomia_debug[id] = () => {
      const meshes: { name: string; faces: number; vis: boolean; color?: string; opacity?: number }[] = []
      let totalBox = new THREE.Box3()
      let any = false
      scene.traverse(obj => {
        if (!(obj as THREE.Mesh).isMesh) return
        const m = obj as THREE.Mesh
        const geom = m.geometry as THREE.BufferGeometry
        const idx = geom.getIndex()
        const faces = idx ? idx.count / 3 : (geom.getAttribute('position')?.count ?? 0) / 3
        const mat = m.material as THREE.MeshPhysicalMaterial
        meshes.push({
          name: m.name || obj.parent?.name || 'mesh',
          faces,
          vis: m.visible,
          color: mat?.color?.getHexString?.(),
          opacity: mat?.opacity,
        })
        const box = new THREE.Box3().setFromObject(m)
        if (any) totalBox.union(box)
        else {
          totalBox = box
          any = true
        }
      })
      const cam = camera as THREE.PerspectiveCamera
      cam.updateMatrixWorld()
      const frustum = new THREE.Frustum().setFromProjectionMatrix(
        new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse),
      )
      const bboxInFrustum = any && frustum.intersectsBox(totalBox)
      return {
        id,
        meshCount: meshes.length,
        visibleCount: meshes.filter(m => m.vis).length,
        meshes: meshes.slice(0, 64),
        worldBox: any
          ? {
              min: totalBox.min.toArray().map(n => +n.toFixed(3)),
              max: totalBox.max.toArray().map(n => +n.toFixed(3)),
              size: totalBox.getSize(new THREE.Vector3()).toArray().map(n => +n.toFixed(3)),
              center: totalBox.getCenter(new THREE.Vector3()).toArray().map(n => +n.toFixed(3)),
            }
          : null,
        camera: {
          position: cam.position.toArray().map(n => +n.toFixed(3)),
          near: cam.near,
          far: cam.far,
          fov: cam.fov,
        },
        bboxInFrustum,
      }
    }
    return () => {
      delete win.__anatomia_debug?.[id]
    }
  }, [scene, camera, id])
  return null
}

import { Environment } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  ambient?: number
  envIntensity?: number
  preset?:
    | 'studio'
    | 'city'
    | 'apartment'
    | 'sunset'
    | 'dawn'
    | 'night'
    | 'park'
    | 'lobby'
  /** When true, adds a soft cool-toned rim and a single warm key (medical viewer look). */
  medical?: boolean
}

/**
 * Reusable scene staging tuned for an anatomical-viewer feel.
 *
 * Default mode = "medical": one warm key from the upper front, one cool
 * fill from behind / above, very low ambient with HDRI doing the gentle
 * environment fill. No saturated accent lights — bias is towards a
 * neutral, lit-from-the-front clinical look.
 */
export function Stage({
  ambient = 0.85,
  envIntensity = 0.9,
  preset = 'apartment',
  medical = true,
}: Props) {
  return (
    <>
      <Environment preset={preset} background={false} environmentIntensity={envIntensity} />
      <ambientLight intensity={ambient} color="#f5f8fc" />
      <hemisphereLight args={['#f8fafd', '#cfd6df', 1.1]} />
      <directionalLight
        position={[2.5, 4, 4]}
        intensity={medical ? 1.6 : 1.8}
        color={medical ? '#fff7e8' : '#ffffff'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />
      <directionalLight
        position={[-3, 2, 3]}
        intensity={medical ? 0.85 : 0.6}
        color="#dfeaf6"
      />
      <directionalLight
        position={[0, -2, -2]}
        intensity={0.35}
        color="#eef2fa"
      />
    </>
  )
}

/**
 * Renderer settings shared across all canvases. We use a clear color
 * that matches the "medical" UI panel so the canvas blends seamlessly
 * instead of showing a black box.
 */
export const ANATOMICAL_GL_SETTINGS = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance' as const,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.15,
  outputColorSpace: THREE.SRGBColorSpace,
}

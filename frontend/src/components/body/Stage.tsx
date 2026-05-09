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
  /** Soft accent glows around the subject. */
  accents?: boolean
}

/**
 * Reusable scene staging tuned for an anatomical-viewer feel:
 *
 * - HDRI for soft fill light and reflections.
 * - One bright key light from upper-front for the silhouette read.
 * - One cool fill from the opposite side to keep the shadow side legible
 *   (matches medical imaging conventions where deep shadows hide structure).
 * - Three subtle coloured point lights act as rim accents and give the
 *   "scientific render" look without making the anatomy cartoonish.
 */
export function Stage({
  ambient = 0.18,
  envIntensity = 0.55,
  preset = 'studio',
  accents = true,
}: Props) {
  return (
    <>
      <Environment preset={preset} background={false} environmentIntensity={envIntensity} />
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[2, 4, 4]}
        intensity={1.85}
        color="#fff5e8"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-3, 1, 3]} intensity={0.55} color="#9ec8ff" />
      <directionalLight position={[0, -4, -2]} intensity={0.18} color="#c4a4ff" />
      {accents && (
        <>
          <pointLight position={[0.2, 0.6, 2.4]} intensity={1.0} color="#7ee0d2" distance={5} decay={1.4} />
          <pointLight position={[-2.2, -0.8, 1.2]} intensity={0.55} color="#a78bfa" distance={5} decay={1.6} />
          <pointLight position={[2.2, -0.8, 0.8]} intensity={0.4} color="#ff8b8b" distance={5} decay={1.6} />
        </>
      )}
    </>
  )
}

/**
 * Renderer settings shared across all canvases — ACES tone mapping for
 * filmic highlights, anti-aliasing on, alpha on for transparent compositing
 * over the page background.
 */
export const ANATOMICAL_GL_SETTINGS = {
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance' as const,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.05,
  outputColorSpace: THREE.SRGBColorSpace,
}

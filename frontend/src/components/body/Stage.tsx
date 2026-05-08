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
 * Reusable scene staging — three-light setup with HDRI environment, plus
 * accent point lights in cyan / coral / violet to give the anatomy its
 * "scientific render" rim glow.
 */
export function Stage({
  ambient = 0.32,
  envIntensity = 0.7,
  preset = 'studio',
  accents = true,
}: Props) {
  return (
    <>
      <Environment preset={preset} background={false} environmentIntensity={envIntensity} />
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.4}
        color="#9af2e4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, -2, 3]} intensity={0.45} color="#ff9a9a" />
      <directionalLight position={[0, -3, -3]} intensity={0.25} color="#c4a4ff" />
      {accents && (
        <>
          <pointLight position={[0, 0.5, 2.5]} intensity={1.6} color="#7ee0d2" distance={6} />
          <pointLight position={[-2, -1, 1.5]} intensity={0.7} color="#a78bfa" distance={5} />
          <pointLight position={[2, -1, 1]} intensity={0.5} color="#ff8b8b" distance={5} />
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

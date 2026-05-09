import { EffectComposer, Bloom, Vignette, BrightnessContrast, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'

/**
 * Reusable post-processing chain for the anatomical canvases. Stays
 * subtle — bloom on emissive highlights, gentle vignette, tone-mapped
 * tonal range. We avoid SSAO because the meshes already ship with
 * baked vertex colors and SSAO over a solid background looks muddy.
 */
export function PostFX({ bloom = 0.6 }: { bloom?: number }) {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={bloom}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.85}
      />
      <BrightnessContrast brightness={0.02} contrast={0.05} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette
        eskil={false}
        offset={0.18}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}

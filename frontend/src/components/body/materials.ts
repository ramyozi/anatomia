import * as THREE from 'three'

/**
 * Anatomical materials based on physically-based rendering with custom
 * fresnel rim lighting injected via onBeforeCompile. We don't pull
 * additional shader libraries — everything is stock three.js.
 */

export interface AnatomicalMaterialOpts {
  color: string
  rimColor?: string
  rimPower?: number
  rimIntensity?: number
  emissive?: string
  emissiveIntensity?: number
  roughness?: number
  metalness?: number
  transmission?: number
  thickness?: number
  ior?: number
  opacity?: number
  transparent?: boolean
  subsurface?: boolean
}

export function makeAnatomicalMaterial(o: AnatomicalMaterialOpts): THREE.Material {
  const {
    color,
    rimColor = '#9af2e4',
    rimPower = 2.4,
    rimIntensity = 1.4,
    emissive = color,
    emissiveIntensity = 0.18,
    roughness = 0.55,
    metalness = 0.05,
    transmission = 0,
    thickness = 0.4,
    ior = 1.4,
    opacity = 1,
    transparent = false,
    subsurface = false,
  } = o

  const mat = new THREE.MeshPhysicalMaterial({
    color,
    emissive,
    emissiveIntensity,
    roughness,
    metalness,
    transmission,
    thickness,
    ior,
    opacity,
    transparent: transparent || opacity < 1,
    clearcoat: 0.2,
    clearcoatRoughness: 0.7,
    sheen: subsurface ? 0.6 : 0,
    sheenColor: new THREE.Color(rimColor),
    sheenRoughness: 0.4,
    side: THREE.FrontSide,
  })

  mat.userData.rim = { color: new THREE.Color(rimColor), power: rimPower, intensity: rimIntensity }

  mat.onBeforeCompile = shader => {
    shader.uniforms.uRimColor = { value: mat.userData.rim.color }
    shader.uniforms.uRimPower = { value: mat.userData.rim.power }
    shader.uniforms.uRimIntensity = { value: mat.userData.rim.intensity }

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform vec3 uRimColor;
         uniform float uRimPower;
         uniform float uRimIntensity;`,
      )
      .replace(
        '#include <output_fragment>',
        `
        // Fresnel-based rim term — drives the silhouette glow that gives
        // the anatomy its "scientific render" feel.
        vec3 viewDir = normalize(vViewPosition);
        vec3 normal = normalize(normal_);
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uRimPower);
        outgoingLight += uRimColor * fresnel * uRimIntensity;
        #include <output_fragment>
      `,
      )
      .replace('void main() {', 'varying vec3 normal_;\nvoid main() {')

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         varying vec3 normal_;`,
      )
      .replace(
        '#include <fog_vertex>',
        `#include <fog_vertex>
         normal_ = normalMatrix * normal;`,
      )
  }

  return mat
}

export const TISSUE_PRESETS = {
  skin: () =>
    makeAnatomicalMaterial({
      color: '#1a212d',
      rimColor: '#7ee0d2',
      rimPower: 2.2,
      rimIntensity: 1.6,
      emissive: '#0e1620',
      emissiveIntensity: 0.05,
      roughness: 0.7,
      metalness: 0.02,
      opacity: 0.34,
      transparent: true,
      subsurface: true,
    }),
  muscle: () =>
    makeAnatomicalMaterial({
      color: '#a83c3c',
      rimColor: '#ffb3b3',
      rimPower: 2.0,
      rimIntensity: 0.9,
      emissive: '#7a1f1f',
      emissiveIntensity: 0.16,
      roughness: 0.5,
      metalness: 0.03,
    }),
  bone: () =>
    makeAnatomicalMaterial({
      color: '#e9e2cf',
      rimColor: '#fff7df',
      rimPower: 3.0,
      rimIntensity: 0.8,
      emissive: '#8a7e5a',
      emissiveIntensity: 0.05,
      roughness: 0.7,
      metalness: 0.04,
    }),
  brain: () =>
    makeAnatomicalMaterial({
      color: '#caa3c7',
      rimColor: '#e8c1ff',
      rimPower: 2.4,
      rimIntensity: 1.2,
      emissive: '#7a4d7c',
      emissiveIntensity: 0.18,
      roughness: 0.45,
      metalness: 0.04,
      subsurface: true,
    }),
  heart: () =>
    makeAnatomicalMaterial({
      color: '#c84545',
      rimColor: '#ff8b8b',
      rimPower: 2.0,
      rimIntensity: 1.5,
      emissive: '#7e1f1f',
      emissiveIntensity: 0.32,
      roughness: 0.4,
      metalness: 0.05,
    }),
  lung: () =>
    makeAnatomicalMaterial({
      color: '#b76a78',
      rimColor: '#ffc4cc',
      rimPower: 2.2,
      rimIntensity: 1.1,
      emissive: '#5e2a35',
      emissiveIntensity: 0.16,
      roughness: 0.65,
      metalness: 0.02,
      transmission: 0.12,
      thickness: 0.6,
      subsurface: true,
    }),
  liver: () =>
    makeAnatomicalMaterial({
      color: '#7a3a2a',
      rimColor: '#e9b58a',
      rimPower: 2.3,
      rimIntensity: 1.0,
      emissive: '#411810',
      emissiveIntensity: 0.18,
      roughness: 0.5,
      metalness: 0.03,
    }),
  kidney: () =>
    makeAnatomicalMaterial({
      color: '#8a3636',
      rimColor: '#ff9494',
      rimPower: 2.2,
      rimIntensity: 1.2,
      emissive: '#4a1818',
      emissiveIntensity: 0.18,
      roughness: 0.5,
      metalness: 0.03,
    }),
  glow: () =>
    new THREE.MeshBasicMaterial({
      color: '#7ee0d2',
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
} as const

export type TissuePreset = keyof typeof TISSUE_PRESETS

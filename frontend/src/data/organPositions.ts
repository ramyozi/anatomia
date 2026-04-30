export interface OrganMarker3D {
  slug: string
  name: string
  position: [number, number, number]
  color: string
  radius: number
}

/**
 * 3D positions of major organs inside the stylised body silhouette.
 * Coordinates are calibrated against the BodyMesh primitives:
 * head ≈ y 1.55, torso ≈ y 0.2–0.85, hips ≈ y -0.18.
 */
export const ORGAN_3D_POSITIONS: OrganMarker3D[] = [
  { slug: 'cerveau',  name: 'Cerveau',     position: [0,     1.58, 0.03], color: '#9af2e4', radius: 0.13 },
  { slug: 'oeil',     name: 'Yeux',        position: [-0.12, 1.62, 0.28], color: '#7ee0d2', radius: 0.04 },
  { slug: 'thyroide', name: 'Thyroïde',    position: [0,     1.18, 0.10], color: '#e9c46a', radius: 0.05 },
  { slug: 'poumons',  name: 'Poumons',     position: [-0.18, 0.78, 0.05], color: '#ff6b6b', radius: 0.10 },
  { slug: 'coeur',    name: 'Cœur',        position: [0.05,  0.72, 0.10], color: '#ff6b6b', radius: 0.09 },
  { slug: 'foie',     name: 'Foie',        position: [-0.12, 0.40, 0.08], color: '#e9c46a', radius: 0.10 },
  { slug: 'estomac',  name: 'Estomac',     position: [0.10,  0.32, 0.10], color: '#7ee0d2', radius: 0.07 },
  { slug: 'rate',     name: 'Rate',        position: [0.20,  0.42, 0.05], color: '#a78bfa', radius: 0.05 },
  { slug: 'pancreas', name: 'Pancréas',    position: [0.05,  0.20, 0.06], color: '#fbbf77', radius: 0.05 },
  { slug: 'reins',    name: 'Reins',       position: [-0.20, 0.05, -0.05], color: '#7ee0d2', radius: 0.05 },
  { slug: 'reins-d',  name: 'Rein droit',  position: [0.20,  0.05, -0.05], color: '#7ee0d2', radius: 0.05 },
  { slug: 'intestin', name: 'Intestins',   position: [0,    -0.05, 0.10], color: '#fbbf77', radius: 0.10 },
  { slug: 'vessie',   name: 'Vessie',      position: [0,    -0.30, 0.10], color: '#9af2e4', radius: 0.06 },
  { slug: 'peau',     name: 'Peau',        position: [0.55,  0.60, 0.20], color: '#e8edf5', radius: 0.04 },
]

/**
 * Single source of truth for anatomical systems.
 *
 * The whole-body GLB ships with one node per primitive, named with a
 * dotted ``system.region`` convention. This registry tells the frontend
 * which prefixes belong to which system, plus how the camera should
 * frame the system and which colour palette to apply.
 *
 * Adding a new system is a one-liner here — no per-page logic.
 */

import * as THREE from 'three'

export type SystemKey =
  | 'all'
  | 'skeletal'
  | 'nervous'
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'urinary'
  | 'endocrine'
  | 'sensory'

export interface SystemDef {
  key: SystemKey
  label: string
  /** Regions belong to this system if their dotted name starts with one of these. */
  regionPrefixes: string[]
  /** Tone for the system's accent (sidebar chip, focused outline, etc.). */
  accentColor: string
  /** Camera frame for the focused view. */
  camera: {
    position: [number, number, number]
    lookAt: [number, number, number]
  }
  /** When true, the rest of the body is faded (50% opacity, no rim) instead of hidden. */
  fadeRest?: boolean
  /** Short user-facing description. */
  description: string
}

// After the -90°-X rotation in HumanBody, the body stands with its head
// at +Y and front at +Z. The camera frames the body face-on, slightly
// tilted up because the head sits above origin.
export const ALL_SYSTEM: SystemDef = {
  key: 'all',
  label: 'Vue complète',
  regionPrefixes: [
    'brain__', 'nervous__', 'cardio__', 'respi__', 'digestive__',
    'urinary__', 'endocrine__', 'sensory__', 'skeletal__',
  ],
  accentColor: '#9af2e4',
  camera: { position: [0, 0, 3.4], lookAt: [0, 0, 0] },
  description:
    'Tous les systèmes anatomiques disponibles dans BodyParts3D, alignés dans le même référentiel.',
}

export const SYSTEMS: Record<Exclude<SystemKey, 'all'>, SystemDef> = {
  // Camera framings below assume the rotated frame (head up = +Y).
  // ``y`` matches a fraction of body height: 0.7 ~ neck, 0.3 ~ thorax,
  // -0.2 ~ abdomen, -0.7 ~ legs, +0.85 ~ head.
  skeletal: {
    key: 'skeletal',
    label: 'Squelettique',
    regionPrefixes: ['skeletal__'],
    accentColor: '#efe7d4',
    camera: { position: [0, 0, 3.4], lookAt: [0, 0, 0] },
    description:
      'Charpente osseuse — colonne, cage thoracique, ceintures, membres. Fournit soutien, protection et hématopoïèse.',
  },
  nervous: {
    key: 'nervous',
    label: 'Nerveux',
    regionPrefixes: ['brain__', 'nervous__'],
    accentColor: '#c4a4ff',
    camera: { position: [0, 0.6, 1.5], lookAt: [0, 0.6, 0] },
    description:
      'Système nerveux central et structures cérébrales : cervelet, mésencéphale, thalamus, hippocampes, hypothalamus, moelle épinière.',
  },
  cardiovascular: {
    key: 'cardiovascular',
    label: 'Cardiovasculaire',
    regionPrefixes: ['cardio__'],
    accentColor: '#ff8b8b',
    camera: { position: [0, 0.32, 1.3], lookAt: [0, 0.32, 0] },
    description:
      'Cœur et grandes structures cardiaques. Le réseau vasculaire complet n\'est pas inclus dans BodyParts3D — seul le cœur est représenté.',
  },
  respiratory: {
    key: 'respiratory',
    label: 'Respiratoire',
    regionPrefixes: ['respi__'],
    accentColor: '#7eb3b7',
    camera: { position: [0, 0.3, 1.6], lookAt: [0, 0.3, 0] },
    description:
      'Voies aériennes et poumons. Trachée, bronches souches, lobes pulmonaires gauche et droit, et diaphragme.',
  },
  digestive: {
    key: 'digestive',
    label: 'Digestif',
    regionPrefixes: ['digestive__'],
    accentColor: '#d6a878',
    camera: { position: [0, 0, 1.6], lookAt: [0, 0, 0] },
    description:
      'Tube digestif et glandes annexes : œsophage, estomac, foie, vésicule biliaire, pancréas, rate.',
  },
  urinary: {
    key: 'urinary',
    label: 'Urinaire',
    regionPrefixes: ['urinary__'],
    accentColor: '#9aa3b2',
    camera: { position: [0, -0.15, 1.4], lookAt: [0, -0.15, 0] },
    description:
      'Reins (filtration), uretères et vessie. Production et évacuation de l\'urine.',
  },
  endocrine: {
    key: 'endocrine',
    label: 'Endocrinien',
    regionPrefixes: ['endocrine__'],
    accentColor: '#e9c46a',
    camera: { position: [0, 0.55, 1.0], lookAt: [0, 0.55, 0] },
    description:
      'Glandes endocrines visibles dans BodyParts3D — ici limité au cartilage thyroïde de référence.',
  },
  sensory: {
    key: 'sensory',
    label: 'Sensoriel',
    regionPrefixes: ['sensory__'],
    accentColor: '#7ee0d2',
    camera: { position: [0, 0.85, 0.9], lookAt: [0, 0.85, 0] },
    description:
      'Organes sensoriels disponibles — œil et structures associées.',
  },
}

export function getSystem(key: SystemKey): SystemDef {
  return key === 'all' ? ALL_SYSTEM : SYSTEMS[key]
}

export function listSystems(): SystemDef[] {
  return [ALL_SYSTEM, ...Object.values(SYSTEMS)]
}

/** True when the region (dotted node name) belongs to the given system. */
export function regionMatchesSystem(regionName: string, key: SystemKey): boolean {
  const sys = getSystem(key)
  return sys.regionPrefixes.some(p => regionName.startsWith(p))
}

/**
 * Map a region name to a "friendly" label. Falls back to the suffix
 * after the system prefix.
 */
const PRETTY_LABELS: Record<string, string> = {
  'brain__cerebellum': 'Cervelet',
  'brain__midbrain': 'Mésencéphale',
  'brain__thalamus-r': 'Thalamus droit',
  'brain__thalamus-l': 'Thalamus gauche',
  'brain__hippocampus-r': 'Hippocampe droit',
  'brain__hippocampus-l': 'Hippocampe gauche',
  'brain__hypothalamus': 'Hypothalamus',
  'brain__fornix': 'Commissure du fornix',
  'brain__peduncle': 'Pédoncule mésencéphalique',
  'nervous__spinal-canal': 'Canal central spinal',
  'cardio__heart': 'Cœur (paroi)',
  'respi__trachea': 'Trachée',
  'respi__lung-up-r': 'Lobe pulmonaire supérieur D',
  'respi__lung-mid-r': 'Lobe pulmonaire moyen D',
  'respi__lung-low-r': 'Lobe pulmonaire inférieur D',
  'respi__lung-up-l': 'Lobe pulmonaire supérieur G',
  'respi__lung-low-l': 'Lobe pulmonaire inférieur G',
  'respi__diaphragm': 'Diaphragme',
  'digestive__esophagus': 'Œsophage',
  'digestive__stomach': 'Estomac',
  'digestive__liver': 'Foie',
  'digestive__gallbladder': 'Vésicule biliaire',
  'digestive__pancreas': 'Pancréas',
  'digestive__spleen': 'Rate',
  'urinary__kidney-r': 'Rein droit',
  'urinary__kidney-l': 'Rein gauche',
  'urinary__bladder': 'Vessie',
  'endocrine__thyroid-cart': 'Cartilage thyroïde',
  'sensory__eye': 'Œil',
  'skeletal__scapula-r': 'Scapula droite',
  'skeletal__scapula-l': 'Scapula gauche',
  'skeletal__humerus-r': 'Humérus droit',
  'skeletal__humerus-l': 'Humérus gauche',
  'skeletal__femur-r': 'Fémur droit',
  'skeletal__femur-l': 'Fémur gauche',
  'skeletal__tibia-r': 'Tibia droit',
  'skeletal__tibia-l': 'Tibia gauche',
  'skeletal__sacrum': 'Sacrum',
  'skeletal__mandible': 'Mandibule',
  'skeletal__sternum': 'Sternum (corps)',
  'skeletal__vertebra-l1': 'Vertèbre L1',
  'skeletal__vertebra-l2': 'Vertèbre L2',
  'skeletal__vertebra-l3': 'Vertèbre L3',
  'skeletal__vertebra-l4': 'Vertèbre L4',
  'skeletal__vertebra-l5': 'Vertèbre L5',
}

export function regionLabel(name: string): string {
  return PRETTY_LABELS[name] ?? name
}

/**
 * Build a tween-friendly target camera state for the given system.
 * The frontend smoothly interpolates between systems instead of cutting.
 */
export function cameraTarget(key: SystemKey): {
  position: THREE.Vector3
  lookAt: THREE.Vector3
} {
  const def = getSystem(key)
  return {
    position: new THREE.Vector3(...def.camera.position),
    lookAt: new THREE.Vector3(...def.camera.lookAt),
  }
}

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { TISSUE_PRESETS } from './materials'
import { ANATOMICAL_GL_SETTINGS, Stage } from './Stage'

/**
 * High-fidelity stylised organs. Each slug maps to a custom procedural
 * geometry — built from lathes, bezier curves, or composite primitives —
 * with a tissue-appropriate material and fresnel rim shader.
 */
export function OrganCanvas({ slug }: { slug: string }) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={ANATOMICAL_GL_SETTINGS}
        dpr={[1, 2]}
      >
        <Stage preset="studio" envIntensity={0.85} />
        <RotatingOrgan slug={slug} />
        <Sparkles
          count={40}
          scale={[3.5, 3.5, 3.5]}
          size={1.5}
          speed={0.2}
          color="#9af2e4"
          opacity={0.35}
        />
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxDistance={6}
          minDistance={2.4}
          enableDamping
        />
      </Canvas>
    </div>
  )
}

function RotatingOrgan({ slug }: { slug: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.12
    ref.current.position.y = Math.sin(t * 0.5) * 0.05
  })
  return (
    <group ref={ref}>
      <ProceduralOrgan slug={slug} />
    </group>
  )
}

function ProceduralOrgan({ slug }: { slug: string }) {
  switch (slug) {
    case 'coeur':
      return <Heart3D />
    case 'cerveau':
      return <Brain3D />
    case 'poumons':
      return <Lungs3D />
    case 'foie':
      return <Liver3D />
    case 'reins':
    case 'reins-d':
      return <Kidney3D />
    case 'estomac':
      return <Stomach3D />
    case 'intestin':
      return <Intestine3D />
    case 'oeil':
      return <Eye3D />
    case 'thyroide':
      return <Thyroid3D />
    case 'pancreas':
      return <Pancreas3D />
    case 'rate':
      return <Spleen3D />
    case 'vessie':
      return <Bladder3D />
    case 'peau':
      return <SkinSample3D />
    default:
      return <Generic3D />
  }
}

/* ------------------------------ Heart ----------------------------------- */

function Heart3D() {
  const mat = useMemo(() => TISSUE_PRESETS.heart(), [])
  return (
    <group>
      {/* Apex blob */}
      <mesh material={mat} position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.95, 64, 64]} />
      </mesh>
      {/* Atria bulges */}
      <mesh material={mat.clone()} position={[-0.35, 0.6, 0]}>
        <sphereGeometry args={[0.42, 48, 48]} />
      </mesh>
      <mesh material={mat.clone()} position={[0.4, 0.65, 0]}>
        <sphereGeometry args={[0.38, 48, 48]} />
      </mesh>
      {/* Aorta */}
      <mesh material={mat.clone()} position={[0.05, 0.95, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 32]} />
      </mesh>
      {/* Pulmonary artery */}
      <mesh material={mat.clone()} position={[-0.3, 0.95, 0.05]}>
        <cylinderGeometry args={[0.14, 0.16, 0.4, 32]} />
      </mesh>
      {/* Coronary ribbons */}
      <CoronaryRibbon
        path={[
          [0.6, 0.4, 0.4],
          [0.3, 0.0, 0.5],
          [-0.2, -0.3, 0.55],
          [-0.55, 0.0, 0.4],
        ]}
      />
      <CoronaryRibbon
        path={[
          [-0.5, 0.45, 0.4],
          [-0.3, 0.05, 0.55],
          [0.2, -0.3, 0.5],
          [0.55, 0.05, 0.4],
        ]}
      />
    </group>
  )
}

function CoronaryRibbon({ path }: { path: [number, number, number][] }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(path.map(p => new THREE.Vector3(...p))),
    [path],
  )
  return (
    <mesh>
      <tubeGeometry args={[curve, 80, 0.025, 8, false]} />
      <meshStandardMaterial
        color="#ffd2d2"
        emissive="#ff6b6b"
        emissiveIntensity={0.5}
        roughness={0.4}
      />
    </mesh>
  )
}

/* ------------------------------ Brain ----------------------------------- */

function Brain3D() {
  const mat = useMemo(() => TISSUE_PRESETS.brain(), [])
  // Two hemispheres + cerebellum + brainstem
  return (
    <group>
      {[-1, 1].map(side => (
        <mesh key={side} material={mat.clone()} position={[0.18 * side, 0.1, 0]}>
          <sphereGeometry args={[0.85, 64, 64, 0, Math.PI * 1.95]} />
        </mesh>
      ))}
      {/* Sulci — small bumps using icosahedrons placed around the surface */}
      {Array.from({ length: 36 }).map((_, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / 36)
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        const r = 0.85
        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.cos(phi) + 0.1
        const z = r * Math.sin(phi) * Math.sin(theta)
        return (
          <mesh key={i} position={[x, y, z]} material={mat.clone()}>
            <icosahedronGeometry args={[0.08, 0]} />
          </mesh>
        )
      })}
      {/* Cerebellum */}
      <mesh material={mat.clone()} position={[0, -0.55, -0.1]}>
        <sphereGeometry args={[0.4, 32, 32]} />
      </mesh>
      {/* Brainstem */}
      <mesh material={mat.clone()} position={[0, -0.85, -0.05]}>
        <cylinderGeometry args={[0.13, 0.14, 0.35, 24]} />
      </mesh>
    </group>
  )
}

/* ------------------------------ Lungs ----------------------------------- */

function Lungs3D() {
  const mat = useMemo(() => TISSUE_PRESETS.lung(), [])
  // Two lobed lungs with a trachea/bronchi structure between them.
  return (
    <group>
      {[-1, 1].map(side => (
        <group key={side} position={[0.7 * side, 0, 0]}>
          {/* Upper lobe */}
          <mesh material={mat.clone()} position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.4, 32, 32]} />
          </mesh>
          {/* Middle (right only) / merged */}
          <mesh
            material={mat.clone()}
            position={[0, 0, side === 1 ? 0.05 : 0]}
            scale={[1, 1.1, 1]}
          >
            <sphereGeometry args={[0.42, 32, 32]} />
          </mesh>
          {/* Lower lobe */}
          <mesh material={mat.clone()} position={[0, -0.5, 0]}>
            <sphereGeometry args={[0.45, 32, 32]} />
          </mesh>
        </group>
      ))}
      {/* Trachea */}
      <mesh material={mat.clone()} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.4, 24]} />
      </mesh>
      {/* Bronchi */}
      {[-1, 1].map(side => (
        <mesh
          key={side}
          material={mat.clone()}
          position={[0.18 * side, 0.5, 0]}
          rotation={[0, 0, side * 0.5]}
        >
          <cylinderGeometry args={[0.045, 0.055, 0.32, 16]} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------ Liver ----------------------------------- */

function Liver3D() {
  const mat = useMemo(() => TISSUE_PRESETS.liver(), [])
  return (
    <group>
      {/* Right lobe (large) */}
      <mesh material={mat} position={[-0.25, 0, 0]} scale={[1.4, 1.0, 0.9]}>
        <sphereGeometry args={[0.6, 32, 32]} />
      </mesh>
      {/* Left lobe (smaller) */}
      <mesh material={mat.clone()} position={[0.55, 0.05, 0]} scale={[1.1, 0.9, 0.85]}>
        <sphereGeometry args={[0.4, 32, 32]} />
      </mesh>
      {/* Gallbladder */}
      <mesh
        material={
          new THREE.MeshStandardMaterial({
            color: '#2c8d4e',
            emissive: '#1a5b32',
            emissiveIntensity: 0.3,
            roughness: 0.5,
          })
        }
        position={[-0.05, -0.4, 0.4]}
        scale={[0.4, 0.7, 0.4]}
      >
        <sphereGeometry args={[0.18, 24, 24]} />
      </mesh>
    </group>
  )
}

/* ------------------------------ Kidney ---------------------------------- */

function Kidney3D() {
  const mat = useMemo(() => TISSUE_PRESETS.kidney(), [])
  // Bean shape: two spheres + a notch
  return (
    <group rotation={[0, 0, 0.2]}>
      <mesh material={mat} position={[0, 0.35, 0]} scale={[0.8, 1, 0.8]}>
        <sphereGeometry args={[0.45, 32, 32]} />
      </mesh>
      <mesh material={mat.clone()} position={[0, -0.35, 0]} scale={[0.8, 1, 0.8]}>
        <sphereGeometry args={[0.45, 32, 32]} />
      </mesh>
      <mesh material={mat.clone()} position={[0, 0, 0]} scale={[1, 1.4, 1]}>
        <capsuleGeometry args={[0.4, 0.4, 12, 24]} />
      </mesh>
      {/* Renal artery */}
      <mesh
        position={[0.5, 0, 0]}
        material={
          new THREE.MeshBasicMaterial({
            color: '#ff8b8b',
            transparent: true,
            opacity: 0.6,
          })
        }
      >
        <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
      </mesh>
    </group>
  )
}

/* ------------------------------ Stomach --------------------------------- */

function Stomach3D() {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#c47a4a',
        emissive: '#7a3a1a',
        emissiveIntensity: 0.18,
        roughness: 0.5,
        metalness: 0.05,
        clearcoat: 0.3,
      }),
    [],
  )
  // Lathe-shaped J for the stomach
  const profile = useMemo(() => {
    const pts: THREE.Vector2[] = []
    for (let i = 0; i <= 30; i++) {
      const t = i / 30
      const y = THREE.MathUtils.lerp(-0.55, 0.55, t)
      const x = 0.4 - 0.3 * Math.pow(t - 0.5, 2)
      pts.push(new THREE.Vector2(x, y))
    }
    return pts
  }, [])
  return (
    <group rotation={[0, 0, 0.3]}>
      <mesh material={mat}>
        <latheGeometry args={[profile, 48]} />
      </mesh>
    </group>
  )
}

/* ----------------------------- Intestine -------------------------------- */

function Intestine3D() {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d99268',
        emissive: '#7a3f24',
        emissiveIntensity: 0.18,
        roughness: 0.5,
      }),
    [],
  )
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 4
      const x = Math.cos(t) * 0.5 + Math.sin(t * 0.5) * 0.2
      const y = (i / 40 - 0.5) * 1.0
      const z = Math.sin(t) * 0.5
      pts.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [])
  return (
    <mesh material={mat}>
      <tubeGeometry args={[curve, 200, 0.13, 16, false]} />
    </mesh>
  )
}

/* ------------------------------ Eye ------------------------------------- */

function Eye3D() {
  const sclera = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f3f3f3',
        roughness: 0.2,
        metalness: 0.05,
        clearcoat: 0.6,
      }),
    [],
  )
  const iris = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#5a8e9b',
        emissive: '#3a7080',
        emissiveIntensity: 0.4,
        roughness: 0.4,
      }),
    [],
  )
  const pupil = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#000',
      }),
    [],
  )
  const cornea = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.18,
        transmission: 0.95,
        thickness: 0.4,
        roughness: 0.05,
        clearcoat: 1,
        ior: 1.4,
      }),
    [],
  )
  return (
    <group>
      <mesh material={sclera}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <mesh material={iris} position={[0, 0, 0.85]}>
        <circleGeometry args={[0.35, 48]} />
      </mesh>
      <mesh material={pupil} position={[0, 0, 0.86]}>
        <circleGeometry args={[0.13, 32]} />
      </mesh>
      <mesh material={cornea} position={[0, 0, 0.7]}>
        <sphereGeometry args={[0.45, 48, 48, 0, Math.PI]} />
      </mesh>
      {/* Optic nerve */}
      <mesh
        material={
          new THREE.MeshStandardMaterial({
            color: '#e0c8e8',
            emissive: '#a78bfa',
            emissiveIntensity: 0.3,
          })
        }
        position={[0, 0, -1.2]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.08, 0.1, 0.6, 24]} />
      </mesh>
    </group>
  )
}

/* ------------------------------ Thyroid --------------------------------- */

function Thyroid3D() {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#e2a04d',
        emissive: '#7c4f1c',
        emissiveIntensity: 0.3,
        roughness: 0.4,
        clearcoat: 0.4,
      }),
    [],
  )
  return (
    <group>
      {[-1, 1].map(side => (
        <mesh key={side} material={mat.clone()} position={[0.45 * side, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
        </mesh>
      ))}
      {/* Isthmus */}
      <mesh material={mat.clone()} position={[0, 0, 0]}>
        <boxGeometry args={[0.55, 0.18, 0.18]} />
      </mesh>
    </group>
  )
}

/* ------------------------------ Pancreas -------------------------------- */

function Pancreas3D() {
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e9b87b',
        emissive: '#a06a3c',
        emissiveIntensity: 0.18,
        roughness: 0.5,
      }),
    [],
  )
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.0, 0.1, 0),
        new THREE.Vector3(-0.4, 0.0, 0.05),
        new THREE.Vector3(0.2, -0.1, 0.0),
        new THREE.Vector3(0.85, -0.2, -0.05),
      ]),
    [],
  )
  return (
    <mesh material={mat}>
      <tubeGeometry args={[curve, 80, 0.18, 16, false]} />
    </mesh>
  )
}

/* ------------------------------ Spleen ---------------------------------- */

function Spleen3D() {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#7a3447',
        emissive: '#3a1623',
        emissiveIntensity: 0.2,
        roughness: 0.5,
        clearcoat: 0.3,
      }),
    [],
  )
  return (
    <mesh material={mat} scale={[0.9, 1.4, 0.7]}>
      <sphereGeometry args={[0.7, 48, 48]} />
    </mesh>
  )
}

/* ------------------------------ Bladder --------------------------------- */

function Bladder3D() {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#e9d6a8',
        emissive: '#aa9468',
        emissiveIntensity: 0.12,
        roughness: 0.55,
        transmission: 0.2,
        thickness: 0.3,
      }),
    [],
  )
  return (
    <mesh material={mat} scale={[1, 0.85, 1]}>
      <sphereGeometry args={[0.75, 48, 48]} />
    </mesh>
  )
}

/* --------------------------- Skin sample -------------------------------- */

function SkinSample3D() {
  const mat = useMemo(() => TISSUE_PRESETS.skin(), [])
  return (
    <group>
      <mesh material={mat} position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.05, 1.2]} />
      </mesh>
      {/* Hair / villi */}
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 1.4
        const z = (Math.random() - 0.5) * 1.0
        return (
          <mesh
            key={i}
            position={[x, 0.05, z]}
            rotation={[0, 0, (Math.random() - 0.5) * 0.3]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.1, 6]} />
            <meshBasicMaterial color="#0e1620" />
          </mesh>
        )
      })}
    </group>
  )
}

/* ------------------------------ Generic --------------------------------- */

function Generic3D() {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#7ee0d2',
        emissive: '#2a8a7c',
        emissiveIntensity: 0.3,
        roughness: 0.4,
        clearcoat: 0.5,
      }),
    [],
  )
  return (
    <mesh material={mat}>
      <icosahedronGeometry args={[1, 2]} />
    </mesh>
  )
}

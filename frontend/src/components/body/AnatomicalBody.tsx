import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { ORGAN_3D_POSITIONS } from '@/data/organPositions'
import { TISSUE_PRESETS } from './materials'

/**
 * High-fidelity stylised body. The skin is a translucent shell that lets
 * the inner organs show through with rim lighting and additive blending.
 * It looks much closer to a "scientific render" than primitive capsules.
 */
export function AnatomicalBody({
  interactive = true,
  highlightedSlug,
  onHover,
  showSkin = true,
  showSkeleton = false,
  showMuscles = false,
}: {
  interactive?: boolean
  highlightedSlug?: string
  onHover?: (slug: string | null) => void
  showSkin?: boolean
  showSkeleton?: boolean
  showMuscles?: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current || interactive) return
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.18) * 0.18
  })

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {showSkeleton && <Skeleton />}
      {showMuscles && <MuscleLayer />}
      <CardiovascularRibbons />
      <NervousNetwork />
      {showSkin && <SkinShell />}
      {ORGAN_3D_POSITIONS.map(o => (
        <OrganBeacon
          key={o.slug}
          slug={o.slug}
          name={o.name}
          position={o.position}
          color={o.color}
          radius={o.radius}
          highlighted={highlightedSlug === o.slug}
          interactive={interactive}
          onHover={onHover}
        />
      ))}
    </group>
  )
}

/* ------------------------------- Skin shell ------------------------------- */

function SkinShell() {
  const skinMat = useMemo(() => TISSUE_PRESETS.skin(), [])
  return (
    <group>
      {/* head */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.34, 64, 64]} />
        <primitive object={skinMat} attach="material" />
      </mesh>
      {/* jaw */}
      <mesh position={[0, 1.32, 0.07]}>
        <boxGeometry args={[0.36, 0.12, 0.28]} />
        <primitive object={skinMat.clone()} attach="material" />
      </mesh>
      {/* neck */}
      <mesh position={[0, 1.16, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.18, 32]} />
        <primitive object={skinMat.clone()} attach="material" />
      </mesh>
      {/* torso (lathe-shaped) */}
      <mesh position={[0, 0.45, 0]}>
        <latheGeometry args={[buildTorsoProfile(), 64]} />
        <primitive object={skinMat.clone()} attach="material" />
      </mesh>
      {/* arms */}
      {[-1, 1].map(side => (
        <group key={side} position={[0.55 * side, 0.55, 0]} rotation={[0, 0, side * 0.18]}>
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.085, 0.55, 12, 24]} />
            <primitive object={skinMat.clone()} attach="material" />
          </mesh>
          <mesh position={[0.05 * side, -0.55, 0]} rotation={[0, 0, side * 0.05]}>
            <capsuleGeometry args={[0.075, 0.45, 12, 24]} />
            <primitive object={skinMat.clone()} attach="material" />
          </mesh>
        </group>
      ))}
      {/* legs */}
      {[-1, 1].map(side => (
        <group key={side} position={[0.18 * side, -0.65, 0]}>
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.13, 0.55, 12, 24]} />
            <primitive object={skinMat.clone()} attach="material" />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <capsuleGeometry args={[0.11, 0.5, 12, 24]} />
            <primitive object={skinMat.clone()} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function buildTorsoProfile() {
  // Lathe curve from the shoulders to the waist gives a more anatomical silhouette
  // than a single capsule.
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    const y = THREE.MathUtils.lerp(0.6, -0.55, t)
    const x =
      0.42 -
      0.07 * Math.sin(t * Math.PI) -
      0.18 * Math.pow(t, 1.6) +
      0.05 * Math.cos(t * Math.PI * 1.6)
    pts.push(new THREE.Vector2(Math.max(0.18, x), y))
  }
  return pts
}

/* ------------------------------- Skeleton -------------------------------- */

function Skeleton() {
  const boneMat = useMemo(() => TISSUE_PRESETS.bone(), [])
  const verts: [number, number, number][] = []
  for (let i = 0; i < 22; i++) {
    verts.push([0, 0.9 - i * 0.08, -0.05])
  }
  return (
    <group>
      {/* skull */}
      <mesh position={[0, 1.55, 0]}>
        <icosahedronGeometry args={[0.3, 1]} />
        <primitive object={boneMat} attach="material" />
      </mesh>
      {/* spine */}
      {verts.map((p, i) => (
        <mesh key={i} position={p}>
          <torusGeometry args={[0.05, 0.018, 12, 24]} />
          <primitive object={boneMat.clone()} attach="material" />
        </mesh>
      ))}
      {/* ribs */}
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 0.78 - i * 0.09
        const w = 0.32 + i * 0.012
        return (
          <mesh key={i} position={[0, y, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[w, 0.015, 8, 32, Math.PI * 1.05]} />
            <primitive object={boneMat.clone()} attach="material" />
          </mesh>
        )
      })}
      {/* pelvis */}
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.04, 12, 32, Math.PI]} />
        <primitive object={boneMat.clone()} attach="material" />
      </mesh>
      {/* femurs */}
      {[-1, 1].map(side => (
        <mesh key={side} position={[0.18 * side, -0.7, 0]}>
          <cylinderGeometry args={[0.045, 0.06, 0.95, 16]} />
          <primitive object={boneMat.clone()} attach="material" />
        </mesh>
      ))}
      {/* humeri */}
      {[-1, 1].map(side => (
        <mesh
          key={side}
          position={[0.55 * side, 0.55, 0]}
          rotation={[0, 0, side * 0.18]}
        >
          <cylinderGeometry args={[0.04, 0.05, 0.95, 16]} />
          <primitive object={boneMat.clone()} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------- Muscles --------------------------------- */

function MuscleLayer() {
  const muscleMat = useMemo(() => TISSUE_PRESETS.muscle(), [])
  return (
    <group>
      {/* pectorals */}
      {[-1, 1].map(side => (
        <mesh
          key={`pec-${side}`}
          position={[0.16 * side, 0.7, 0.05]}
          rotation={[0, 0, side * 0.12]}
        >
          <sphereGeometry args={[0.18, 32, 16, 0, Math.PI]} />
          <primitive object={muscleMat.clone()} attach="material" />
        </mesh>
      ))}
      {/* abdominal block */}
      <mesh position={[0, 0.18, 0.18]}>
        <boxGeometry args={[0.32, 0.4, 0.05]} />
        <primitive object={muscleMat.clone()} attach="material" />
      </mesh>
      {/* deltoid */}
      {[-1, 1].map(side => (
        <mesh
          key={`delt-${side}`}
          position={[0.45 * side, 0.85, 0]}
        >
          <sphereGeometry args={[0.14, 24, 16]} />
          <primitive object={muscleMat.clone()} attach="material" />
        </mesh>
      ))}
      {/* quadriceps */}
      {[-1, 1].map(side => (
        <mesh
          key={`quad-${side}`}
          position={[0.18 * side, -0.55, 0.07]}
        >
          <capsuleGeometry args={[0.09, 0.4, 8, 16]} />
          <primitive object={muscleMat.clone()} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

/* -------------------- Cardiovascular ribbons (subtle) -------------------- */

function CardiovascularRibbons() {
  const tubeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff6b6b',
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  const venousMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#7ee0d2',
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  const arteries = useMemo(() => {
    const aorta = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.85, 0),
      new THREE.Vector3(0.05, 0.55, 0),
      new THREE.Vector3(-0.06, 0.3, 0),
      new THREE.Vector3(-0.05, 0.0, 0),
      new THREE.Vector3(-0.04, -0.18, 0),
    ])
    const carotidL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.07, 0.85, 0),
      new THREE.Vector3(-0.09, 1.05, 0),
      new THREE.Vector3(-0.12, 1.4, 0),
    ])
    const carotidR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.07, 0.85, 0),
      new THREE.Vector3(0.09, 1.05, 0),
      new THREE.Vector3(0.12, 1.4, 0),
    ])
    const femoralL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.04, -0.18, 0),
      new THREE.Vector3(-0.18, -0.4, 0),
      new THREE.Vector3(-0.18, -0.95, 0),
      new THREE.Vector3(-0.18, -1.3, 0),
    ])
    const femoralR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.04, -0.18, 0),
      new THREE.Vector3(0.18, -0.4, 0),
      new THREE.Vector3(0.18, -0.95, 0),
      new THREE.Vector3(0.18, -1.3, 0),
    ])
    return [aorta, carotidL, carotidR, femoralL, femoralR]
  }, [])

  const veins = useMemo(() => {
    return [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.55, 0.85, 0),
        new THREE.Vector3(0.55, 0.55, 0.05),
        new THREE.Vector3(0.5, 0.2, 0.05),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.55, 0.85, 0),
        new THREE.Vector3(-0.55, 0.55, 0.05),
        new THREE.Vector3(-0.5, 0.2, 0.05),
      ]),
    ]
  }, [])

  return (
    <group>
      {arteries.map((c, i) => (
        <mesh key={`art-${i}`}>
          <tubeGeometry args={[c, 80, 0.012, 8, false]} />
          <primitive object={tubeMat.clone()} attach="material" />
        </mesh>
      ))}
      {veins.map((c, i) => (
        <mesh key={`ven-${i}`}>
          <tubeGeometry args={[c, 60, 0.01, 8, false]} />
          <primitive object={venousMat.clone()} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

/* ----------------------- Nervous network (procedural) -------------------- */

function NervousNetwork() {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#c4a4ff',
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  const cord = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.18, -0.08),
        new THREE.Vector3(0, 0.9, -0.08),
        new THREE.Vector3(0, 0.5, -0.06),
        new THREE.Vector3(0, 0.1, -0.04),
        new THREE.Vector3(0, -0.18, -0.04),
      ]),
    [],
  )
  return (
    <group>
      <mesh>
        <tubeGeometry args={[cord, 80, 0.012, 8, false]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {/* nerve roots */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 0.95 - i * 0.13
        return [-1, 1].map(side => (
          <mesh
            key={`${i}-${side}`}
            position={[0.18 * side, y, -0.04]}
            rotation={[0, 0, side * 0.4]}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.4, 6]} />
            <primitive object={mat.clone()} attach="material" />
          </mesh>
        ))
      })}
    </group>
  )
}

/* ----------------------------- Organ beacons ----------------------------- */

function OrganBeacon({
  slug,
  name,
  position,
  color,
  radius,
  highlighted,
  interactive,
  onHover,
}: {
  slug: string
  name: string
  position: [number, number, number]
  color: string
  radius: number
  highlighted: boolean
  interactive: boolean
  onHover?: (slug: string | null) => void
}) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && interactive)

  const meshRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)

  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.65,
        roughness: 0.32,
        metalness: 0.05,
        clearcoat: 0.4,
        sheen: 0.4,
        sheenColor: new THREE.Color(color),
        transmission: 0.04,
        thickness: 0.3,
      }),
    [color],
  )
  const haloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color],
  )

  useFrame(({ clock }) => {
    if (!meshRef.current || !haloRef.current) return
    const t = clock.getElapsedTime()
    const pulse = 1 + Math.sin(t * 2 + position[0] * 5) * 0.04
    const focus = highlighted || hovered ? 1.4 : 1
    meshRef.current.scale.setScalar(pulse * focus)
    haloRef.current.scale.setScalar(pulse * focus * 1.7)
    mat.emissiveIntensity =
      0.55 + (highlighted || hovered ? 0.7 : 0) + Math.sin(t * 3) * 0.08
    haloMat.opacity = 0.1 + (highlighted || hovered ? 0.3 : 0)
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        material={mat}
        onPointerOver={
          interactive
            ? e => {
                e.stopPropagation()
                setHovered(true)
                onHover?.(slug)
              }
            : undefined
        }
        onPointerOut={
          interactive
            ? () => {
                setHovered(false)
                onHover?.(null)
              }
            : undefined
        }
        onClick={
          interactive
            ? e => {
                e.stopPropagation()
                navigate(`/corps/${slug}`)
              }
            : undefined
        }
      >
        <icosahedronGeometry args={[radius, 2]} />
      </mesh>
      <mesh ref={haloRef} material={haloMat}>
        <sphereGeometry args={[radius, 24, 24]} />
      </mesh>
      {(hovered || highlighted) && interactive && (
        <Html distanceFactor={5} center>
          <div className="pointer-events-none px-2 py-1 rounded-md bg-bg-panel/90 border border-line/70 text-[11px] text-ink whitespace-nowrap backdrop-blur shadow-lg">
            {name}
          </div>
        </Html>
      )}
    </group>
  )
}

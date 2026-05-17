import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { frameBox, zoomBounds, clampedZoom } from './cameraFraming'

const box = (min: [number, number, number], max: [number, number, number]) =>
  new THREE.Box3(new THREE.Vector3(...min), new THREE.Vector3(...max))

describe('frameBox', () => {
  it('targets the centre of the box', () => {
    const f = frameBox(box([-1, -1, -1], [3, 1, 1]), {
      fovDeg: 40,
      aspect: 1,
    })
    expect(f.target.x).toBeCloseTo(1)
    expect(f.target.y).toBeCloseTo(0)
    expect(f.target.z).toBeCloseTo(0)
  })

  it('places the camera in front (+Z) by default at the framed distance', () => {
    const f = frameBox(box([-1, -1, -1], [1, 1, 1]), {
      fovDeg: 40,
      aspect: 1,
    })
    // default viewDir is +Z, so the camera sits at z = distance.
    expect(f.position.x).toBeCloseTo(0)
    expect(f.position.y).toBeCloseTo(0)
    expect(f.position.z).toBeCloseTo(f.distance)
    expect(f.distance).toBeGreaterThan(1)
  })

  it('frames a bigger box further away', () => {
    const small = frameBox(box([-1, -1, -1], [1, 1, 1]), {
      fovDeg: 40,
      aspect: 1,
    })
    const big = frameBox(box([-4, -4, -4], [4, 4, 4]), {
      fovDeg: 40,
      aspect: 1,
    })
    expect(big.distance).toBeGreaterThan(small.distance)
  })

  it('respects a custom view direction', () => {
    const f = frameBox(box([-1, -1, -1], [1, 1, 1]), {
      fovDeg: 40,
      aspect: 1,
      viewDir: new THREE.Vector3(1, 0, 0),
    })
    expect(f.position.x).toBeCloseTo(f.distance)
    expect(f.position.z).toBeCloseTo(0)
  })

  it('never frames closer than minDistance', () => {
    const f = frameBox(box([0, 0, 0], [0, 0, 0]), {
      fovDeg: 40,
      aspect: 1,
      minDistance: 0.5,
    })
    expect(f.distance).toBeGreaterThanOrEqual(0.5)
  })
})

describe('zoomBounds', () => {
  it('derives min/max from the largest box dimension', () => {
    const b = zoomBounds(box([0, 0, 0], [2, 6, 2]))
    expect(b.min).toBeLessThan(b.max)
    expect(b.max).toBeCloseTo(6 * 6)
  })
})

describe('clampedZoom', () => {
  it('zooms in with a factor below 1', () => {
    expect(clampedZoom(10, 0.5, 1, 20)).toBe(5)
  })
  it('zooms out with a factor above 1', () => {
    expect(clampedZoom(10, 1.5, 1, 20)).toBe(15)
  })
  it('clamps to the min bound', () => {
    expect(clampedZoom(2, 0.1, 1, 20)).toBe(1)
  })
  it('clamps to the max bound', () => {
    expect(clampedZoom(15, 4, 1, 20)).toBe(20)
  })
})

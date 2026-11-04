import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

const STRAND_COUNT = 200
const TUBULAR_SEGMENTS = 28
const RADIAL_SEGMENTS = 4
const STRAND_RADIUS = 0.014
const SPARKS_PER_TIP = 2

const createRandom = (initialSeed) => {
  let seed = initialSeed >>> 0
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

const random = createRandom(0x5a17c9e3)
const STRANDS = Array.from({ length: STRAND_COUNT }, (_, index) => ({
  index,
  lane: index / (STRAND_COUNT - 1) * 2 - 1,
  theta: index / STRAND_COUNT * Math.PI * 2,
  phase: random() * Math.PI * 2,
  bend: random() * 2 - 1,
  depth: random() * 2 - 1,
  length: random() * 2 - 1,
  jitter: random() * 2 - 1,
}))

const curveFrom = (points) => new THREE.CatmullRomCurve3(
  points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  'catmullrom',
  0.56,
)

const createStageCurve = (stage, strand) => {
  const { bend, depth, index, jitter, lane, length, phase, theta } = strand

  if (stage === 0) {
    return curveFrom([
      [lane * 0.72 + jitter * 0.08, 5.15, depth * 0.18],
      [lane * 0.86 + Math.sin(phase) * 0.12, 4.05, depth * 0.24],
      [lane * 1.08 + bend * 0.18, 2.7, depth * 0.34],
      [lane * 1.34 - bend * 0.2, 1.15, depth * 0.46],
      [lane * 1.62 + Math.sin(phase * 1.4) * 0.2, -0.35, depth * 0.56],
      [lane * 1.9 + jitter * 0.18, -2.35 + length * 0.32, depth * 0.66],
    ])
  }

  if (stage === 1) {
    const arcAngle = index / (STRAND_COUNT - 1) * Math.PI
    const tipX = Math.cos(arcAngle) * 3.75
    const tipY = -0.48 + Math.sin(arcAngle) * 3.5
    const tipZ = depth * 0.3

    return curveFrom([
      [-4.35 + lane * 0.28, -3.15 + lane * 0.22, depth * 0.38],
      [-3.15 + lane * 0.36, -2.42 + lane * 0.2, depth * 0.34],
      [-1.95 + lane * 0.28, -1.62 + lane * 0.16, depth * 0.28],
      [-0.82 + tipX * 0.24, -0.88 + tipY * 0.18, depth * 0.22],
      [tipX * 0.72, -0.42 + tipY * 0.7, tipZ * 0.72],
      [tipX, tipY, tipZ],
    ])
  }

  if (stage === 2) {
    const centerX = 0.2
    const radii = [3.62, 3.15, 2.75, 2.3, 1.88, 1.46]
    return curveFrom(radii.map((radius, pointIndex) => {
      const u = pointIndex / (radii.length - 1)
      const angle = theta + (1 - u) * (0.48 + bend * 0.065) + Math.sin(u * Math.PI) * bend * 0.045
      return [
        centerX + Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.sin(theta * 3 + u * Math.PI) * 0.075 + depth * 0.035,
      ]
    }))
  }

  const tipX = 1.18 + lane * 0.72 + jitter * 0.08
  const tipY = -0.28 + Math.sin(phase) * 0.22 + lane * 0.12
  const tipZ = depth * 0.48
  return curveFrom([
    [-5.25 + lane * 0.5, 4.7 + lane * 0.42, depth * 0.22],
    [-4.15 + lane * 0.64, 3.65 + lane * 0.34, depth * 0.26],
    [-2.95 + lane * 0.72, 2.65 + lane * 0.28, depth * 0.3],
    [-1.5 + lane * 0.74 + bend * 0.08, 1.5 + lane * 0.22, depth * 0.36],
    [-0.05 + lane * 0.72, 0.42 + lane * 0.16, depth * 0.42],
    [tipX, tipY, tipZ],
  ])
}

const createFiberData = () => {
  const sample = new THREE.TubeGeometry(
    createStageCurve(0, STRANDS[0]),
    TUBULAR_SEGMENTS,
    STRAND_RADIUS,
    RADIAL_SEGMENTS,
    false,
  )
  const verticesPerStrand = sample.attributes.position.count
  const indicesPerStrand = sample.index.count
  const totalVertices = verticesPerStrand * STRAND_COUNT
  const stagePositions = Array.from({ length: 4 }, () => new Float32Array(totalVertices * 3))
  const stageNormals = Array.from({ length: 4 }, () => new Float32Array(totalVertices * 3))
  const stageTips = Array.from({ length: 4 }, () => new Float32Array(STRAND_COUNT * 3))
  const indices = new Uint16Array(indicesPerStrand * STRAND_COUNT)
  sample.dispose()

  STRANDS.forEach((strand) => {
    const vertexOffset = strand.index * verticesPerStrand
    const floatOffset = vertexOffset * 3
    const indexOffset = strand.index * indicesPerStrand

    for (let stage = 0; stage < 4; stage += 1) {
      const curve = createStageCurve(stage, strand)
      const tube = new THREE.TubeGeometry(
        curve,
        TUBULAR_SEGMENTS,
        STRAND_RADIUS,
        RADIAL_SEGMENTS,
        false,
      )
      stagePositions[stage].set(tube.attributes.position.array, floatOffset)
      stageNormals[stage].set(tube.attributes.normal.array, floatOffset)
      curve.getPoint(1).toArray(stageTips[stage], strand.index * 3)

      if (stage === 0) {
        for (let item = 0; item < indicesPerStrand; item += 1) {
          indices[indexOffset + item] = tube.index.array[item] + vertexOffset
        }
      }
      tube.dispose()
    }
  })

  const positions = new Float32Array(stagePositions[0])
  const normals = new Float32Array(stageNormals[0])
  const positionAttribute = new THREE.BufferAttribute(positions, 3)
  const normalAttribute = new THREE.BufferAttribute(normals, 3)
  positionAttribute.setUsage(THREE.DynamicDrawUsage)
  normalAttribute.setUsage(THREE.DynamicDrawUsage)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', positionAttribute)
  geometry.setAttribute('normal', normalAttribute)
  geometry.setIndex(new THREE.BufferAttribute(indices, 1))

  return { geometry, stagePositions, stageNormals, stageTips }
}

const createIrisGuideGeometry = () => {
  const vertices = []
  const centerX = 0.2
  const circleSegments = 96
  const outerRadius = 3.78

  for (let index = 0; index < circleSegments; index += 1) {
    const angleA = index / circleSegments * Math.PI * 2
    const angleB = (index + 1) / circleSegments * Math.PI * 2
    vertices.push(
      centerX + Math.cos(angleA) * outerRadius,
      Math.sin(angleA) * outerRadius,
      0.04,
      centerX + Math.cos(angleB) * outerRadius,
      Math.sin(angleB) * outerRadius,
      0.04,
    )
  }

  for (let index = 0; index < 72; index += 1) {
    const angle = index / 72 * Math.PI * 2
    const tickLength = index % 6 === 0 ? 0.34 : 0.18
    const innerRadius = outerRadius - tickLength
    vertices.push(
      centerX + Math.cos(angle) * innerRadius,
      Math.sin(angle) * innerRadius,
      0.04,
      centerX + Math.cos(angle) * outerRadius,
      Math.sin(angle) * outerRadius,
      0.04,
    )
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  return geometry
}

const resolveStageBlend = (progress) => {
  if (progress < 0.25) {
    return { from: 0, to: 1, mix: THREE.MathUtils.smoothstep(progress, 0.19, 0.25) }
  }
  if (progress < 0.55) {
    return { from: 1, to: 2, mix: THREE.MathUtils.smoothstep(progress, 0.47, 0.55) }
  }
  if (progress < 0.8) {
    return { from: 2, to: 3, mix: THREE.MathUtils.smoothstep(progress, 0.72, 0.8) }
  }
  return { from: 3, to: 3, mix: 0 }
}

function FiberBundle({ animate, progressRef }) {
  const bundleRef = useRef(null)
  const strandMaterialRef = useRef(null)
  const coreTipsRef = useRef(null)
  const glowTipsRef = useRef(null)
  const amberLightRef = useRef(null)
  const goldLightRef = useRef(null)
  const guideMaterialRef = useRef(null)
  const shadowMaterialRef = useRef(null)
  const fiberData = useMemo(createFiberData, [])
  const tipGeometry = useMemo(() => new THREE.SphereGeometry(1, 10, 10), [])
  const guideGeometry = useMemo(createIrisGuideGeometry, [])
  const sparkGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(STRAND_COUNT * SPARKS_PER_TIP * 3)
    const attribute = new THREE.BufferAttribute(positions, 3)
    attribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('position', attribute)
    return geometry
  }, [])
  const transform = useMemo(() => new THREE.Object3D(), [])
  const currentTips = useMemo(() => new Float32Array(STRAND_COUNT * 3), [])

  useEffect(() => {
    coreTipsRef.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    glowTipsRef.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    return () => {
      fiberData.geometry.dispose()
      tipGeometry.dispose()
      guideGeometry.dispose()
      sparkGeometry.dispose()
    }
  }, [fiberData, guideGeometry, sparkGeometry, tipGeometry])

  useFrame(({ clock }) => {
    const progress = progressRef.current
    const { from, to, mix } = resolveStageBlend(progress)
    const positions = fiberData.geometry.attributes.position.array
    const normals = fiberData.geometry.attributes.normal.array
    const fromPositions = fiberData.stagePositions[from]
    const toPositions = fiberData.stagePositions[to]
    const fromNormals = fiberData.stageNormals[from]
    const toNormals = fiberData.stageNormals[to]
    const fromTips = fiberData.stageTips[from]
    const toTips = fiberData.stageTips[to]
    const time = clock.getElapsedTime()

    for (let offset = 0; offset < positions.length; offset += 3) {
      positions[offset] = THREE.MathUtils.lerp(fromPositions[offset], toPositions[offset], mix)
      positions[offset + 1] = THREE.MathUtils.lerp(fromPositions[offset + 1], toPositions[offset + 1], mix)
      positions[offset + 2] = THREE.MathUtils.lerp(fromPositions[offset + 2], toPositions[offset + 2], mix)

      const nx = THREE.MathUtils.lerp(fromNormals[offset], toNormals[offset], mix)
      const ny = THREE.MathUtils.lerp(fromNormals[offset + 1], toNormals[offset + 1], mix)
      const nz = THREE.MathUtils.lerp(fromNormals[offset + 2], toNormals[offset + 2], mix)
      const normalLength = Math.hypot(nx, ny, nz) || 1
      normals[offset] = nx / normalLength
      normals[offset + 1] = ny / normalLength
      normals[offset + 2] = nz / normalLength
    }

    const closeUp = THREE.MathUtils.smoothstep(progress, 0.8, 1)
    const hangWeight = 1 - THREE.MathUtils.smoothstep(progress, 0.18, 0.28)
    if (bundleRef.current) {
      bundleRef.current.rotation.z = animate ? Math.sin(time * 0.34) * 0.014 * hangWeight : 0
      bundleRef.current.rotation.y = animate ? Math.sin(time * 0.27) * 0.018 * hangWeight : 0
      bundleRef.current.scale.setScalar(1 + closeUp * 0.16)
      bundleRef.current.position.set(closeUp * 0.08, closeUp * 0.12, 0)
    }

    const tipScale = THREE.MathUtils.lerp(0.05, 0.075, closeUp)
    const glowScale = THREE.MathUtils.lerp(0.15, 0.21, closeUp)
    const sparkPositions = sparkGeometry.attributes.position.array

    for (let index = 0; index < STRAND_COUNT; index += 1) {
      const tipOffset = index * 3
      const tipX = THREE.MathUtils.lerp(fromTips[tipOffset], toTips[tipOffset], mix)
      const tipY = THREE.MathUtils.lerp(fromTips[tipOffset + 1], toTips[tipOffset + 1], mix)
      const tipZ = THREE.MathUtils.lerp(fromTips[tipOffset + 2], toTips[tipOffset + 2], mix)
      currentTips[tipOffset] = tipX
      currentTips[tipOffset + 1] = tipY
      currentTips[tipOffset + 2] = tipZ

      transform.position.set(tipX, tipY, tipZ)
      transform.scale.setScalar(tipScale)
      transform.updateMatrix()
      coreTipsRef.current?.setMatrixAt(index, transform.matrix)

      transform.scale.setScalar(glowScale)
      transform.updateMatrix()
      glowTipsRef.current?.setMatrixAt(index, transform.matrix)

      for (let spark = 0; spark < SPARKS_PER_TIP; spark += 1) {
        const sparkIndex = index * SPARKS_PER_TIP + spark
        const sparkOffset = sparkIndex * 3
        const seed = sparkIndex * 12.9898 + 2.417
        const angle = time * (0.32 + spark * 0.12) + seed
        const radius = 0.045 + (Math.sin(seed * 1.73) * 0.5 + 0.5) * 0.13
        sparkPositions[sparkOffset] = tipX + Math.cos(angle) * radius
        sparkPositions[sparkOffset + 1] = tipY + Math.sin(time * 0.72 + seed) * radius + 0.04
        sparkPositions[sparkOffset + 2] = tipZ + Math.sin(angle) * radius
      }
    }

    fiberData.geometry.attributes.position.needsUpdate = true
    fiberData.geometry.attributes.normal.needsUpdate = true
    sparkGeometry.attributes.position.needsUpdate = true
    if (coreTipsRef.current) coreTipsRef.current.instanceMatrix.needsUpdate = true
    if (glowTipsRef.current) glowTipsRef.current.instanceMatrix.needsUpdate = true

    const irisVisibility = (
      THREE.MathUtils.smoothstep(progress, 0.51, 0.59)
      * (1 - THREE.MathUtils.smoothstep(progress, 0.74, 0.82))
    )
    if (guideMaterialRef.current) guideMaterialRef.current.opacity = irisVisibility * 0.54
    if (shadowMaterialRef.current) shadowMaterialRef.current.opacity = irisVisibility * 0.075

    const warmHighlight = THREE.MathUtils.smoothstep(progress, 0.22, 0.58)
    if (amberLightRef.current) amberLightRef.current.intensity = 12 + warmHighlight * 42
    if (goldLightRef.current) goldLightRef.current.intensity = 8 + warmHighlight * 32
    if (strandMaterialRef.current) strandMaterialRef.current.emissiveIntensity = 0.025 + warmHighlight * 0.075
  })

  return (
    <group ref={bundleRef}>
      <mesh geometry={fiberData.geometry} frustumCulled={false}>
        <meshPhysicalMaterial
          ref={strandMaterialRef}
          color="#211B17"
          emissive="#D97706"
          emissiveIntensity={0.025}
          metalness={0.88}
          roughness={0.3}
          clearcoat={0.3}
          clearcoatRoughness={0.24}
        />
      </mesh>

      <mesh position={[0.38, -0.18, -0.42]} renderOrder={-1}>
        <ringGeometry args={[1.22, 3.88, 96]} />
        <meshBasicMaterial
          ref={shadowMaterialRef}
          color="#120D09"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <lineSegments geometry={guideGeometry} frustumCulled={false}>
        <lineBasicMaterial
          ref={guideMaterialRef}
          color="#D97706"
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <points geometry={sparkGeometry} frustumCulled={false}>
        <pointsMaterial
          color="#FFD447"
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.82}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <instancedMesh ref={glowTipsRef} args={[tipGeometry, undefined, STRAND_COUNT]} frustumCulled={false}>
        <meshBasicMaterial
          color="#FFD447"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh ref={coreTipsRef} args={[tipGeometry, undefined, STRAND_COUNT]} frustumCulled={false}>
        <meshStandardMaterial
          color="#FFD447"
          emissive="#FFAA00"
          emissiveIntensity={3.5}
          roughness={0.2}
          toneMapped={false}
        />
      </instancedMesh>

      <pointLight ref={amberLightRef} position={[2.8, 1.4, 3.5]} color="#F59E0B" intensity={12} distance={12} />
      <pointLight ref={goldLightRef} position={[-2.6, -1.2, 3]} color="#D97706" intensity={8} distance={11} />
    </group>
  )
}

export default function NeuralField() {
  const reduceMotion = useReducedMotion()
  const progressRef = useRef(reduceMotion ? 1 : 0)

  useLayoutEffect(() => {
    if (reduceMotion) {
      progressRef.current = 1
      return undefined
    }

    const scrollState = { progress: 0 }
    const context = gsap.context(() => {
      gsap.to(scrollState, {
        progress: 1,
        ease: 'none',
        onUpdate: () => {
          progressRef.current = scrollState.progress
        },
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, document.documentElement)

    return () => context.revert()
  }, [reduceMotion])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="neural-field" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.1, 11.7], fov: 43, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor('#ffffff', 0)}
      >
        <ambientLight intensity={0.72} />
        <hemisphereLight args={['#fff8e8', '#17110d', 1.15]} />
        <directionalLight position={[3, 5, 7]} color="#FFE2A8" intensity={2.6} />
        <FiberBundle animate={!reduceMotion} progressRef={progressRef} />
      </Canvas>
    </div>,
    document.body,
  )
}

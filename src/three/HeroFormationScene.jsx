import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import RestrainedBloom from './RestrainedBloom'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS } from './sceneTheme'

const TAU = Math.PI * 2

const PARTICLE_VERTEX_SHADER = /* glsl */`
  uniform float uFormation;
  uniform float uMotion;
  uniform float uPixelRatio;
  uniform float uPointScale;
  uniform float uScroll;
  uniform float uTime;

  attribute vec3 aExit;
  attribute float aEnergy;
  attribute float aFlow;
  attribute float aSeed;
  attribute float aSize;
  attribute vec3 aTarget;

  varying float vAlpha;
  varying float vEnergy;
  varying float vFlow;
  varying float vSeed;

  float easeInOut(float value) {
    value = clamp(value, 0.0, 1.0);
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    float gathered = easeInOut(uFormation * 1.24 - aSeed * 0.24);
    float released = easeInOut((uScroll - aSeed * 0.12) / 0.88);
    vec3 positionInScene = mix(position, aTarget, gathered);
    positionInScene = mix(positionInScene, aExit, released);

    float arrivalTurbulence = (1.0 - gathered) * 0.16;
    float ambientTurbulence = (0.025 + arrivalTurbulence) * uMotion;
    positionInScene.x += sin(uTime * 0.31 + aSeed * 37.0) * ambientTurbulence;
    positionInScene.y += cos(uTime * 0.27 + aSeed * 29.0) * ambientTurbulence;
    positionInScene.z += sin(uTime * 0.22 + aSeed * 43.0) * ambientTurbulence * 1.6;

    vec4 viewPosition = modelViewMatrix * vec4(positionInScene, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = min(
      8.5,
      uPixelRatio * aSize * uPointScale / max(3.5, -viewPosition.z)
    );

    vAlpha = (0.16 + gathered * 0.76) * (1.0 - released * 0.24);
    vEnergy = aEnergy;
    vFlow = aFlow;
    vSeed = aSeed;
  }
`

const PARTICLE_FRAGMENT_SHADER = /* glsl */`
  uniform vec3 uBlue;
  uniform vec3 uOrange;
  uniform vec3 uTeal;
  uniform float uTime;

  varying float vAlpha;
  varying float vEnergy;
  varying float vFlow;
  varying float vSeed;

  void main() {
    float radius = length(gl_PointCoord - vec2(0.5));
    float core = 1.0 - smoothstep(0.08, 0.48, radius);
    float halo = 1.0 - smoothstep(0.12, 0.5, radius);
    float dataWave = pow(max(0.0, sin(vFlow * 34.0 - uTime * 2.1)), 12.0);
    float orangeMix = vEnergy * (0.28 + dataWave * 0.72);
    vec3 dataColor = mix(uBlue, uTeal, 0.28 + vSeed * 0.58);
    vec3 color = mix(dataColor, uOrange, orangeMix);
    float alpha = (core * 0.88 + halo * 0.28) * vAlpha;
    if (alpha < 0.015) discard;
    gl_FragColor = vec4(color, alpha);
  }
`

const FILAMENT_VERTEX_SHADER = /* glsl */`
  uniform float uFormation;
  uniform float uMotion;
  uniform float uScroll;
  uniform float uTime;

  attribute vec3 aExit;
  attribute float aEnergy;
  attribute float aFlow;
  attribute float aSeed;
  attribute vec3 aTarget;

  varying float vAlpha;
  varying float vEnergy;
  varying float vFlow;

  float easeInOut(float value) {
    value = clamp(value, 0.0, 1.0);
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    float gathered = easeInOut(uFormation * 1.2 - aSeed * 0.2);
    float released = easeInOut((uScroll - aSeed * 0.08) / 0.92);
    vec3 positionInScene = mix(position, aTarget, gathered);
    positionInScene = mix(positionInScene, aExit, released);
    positionInScene.z += sin(aFlow * 12.0 + uTime * 0.42 + aSeed * 8.0)
      * 0.035 * uMotion * (1.0 - released);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(positionInScene, 1.0);
    vAlpha = (0.035 + gathered * 0.31) * (1.0 - released * 0.42);
    vEnergy = aEnergy;
    vFlow = aFlow;
  }
`

const FILAMENT_FRAGMENT_SHADER = /* glsl */`
  uniform vec3 uBlue;
  uniform vec3 uOrange;
  uniform vec3 uTeal;
  uniform float uTime;

  varying float vAlpha;
  varying float vEnergy;
  varying float vFlow;

  void main() {
    float pulse = pow(max(0.0, sin(vFlow * 24.0 - uTime * 1.9)), 16.0);
    vec3 dataColor = mix(uBlue, uTeal, 0.62);
    vec3 color = mix(dataColor, uOrange, vEnergy * (0.24 + pulse * 0.76));
    gl_FragColor = vec4(color, vAlpha + pulse * 0.17);
  }
`

const clamp01 = (value) => Math.min(Math.max(value, 0), 1)

const smoother = (value) => {
  const progress = clamp01(value)
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10)
}

const seeded = (seed) => {
  const value = Math.sin(seed * 91.733 + 17.137) * 43758.5453
  return value - Math.floor(value)
}

const getLayout = (aspect) => {
  if (aspect < 0.68) return { x: 0.1, y: -1.42, scale: 0.76 }
  if (aspect < 1.05) return { x: 0.74, y: -0.58, scale: 0.86 }
  return { x: 1.72, y: 0.02, scale: 1 }
}

function getNetworkTarget(index, seed) {
  const mode = index % 10
  const thickness = (seeded(index + 107) - 0.5) * 0.16
  const depth = (seeded(index + 211) - 0.5) * 0.68

  if (mode < 3) {
    const angle = Math.PI * (0.12 + seed * 0.76)
    return [
      Math.cos(angle) * (2.5 + thickness),
      Math.sin(angle) * (1.4 + thickness) + 0.18,
      depth + Math.sin(angle * 2) * 0.1,
    ]
  }

  if (mode < 6) {
    const angle = Math.PI * (1.12 + seed * 0.76)
    return [
      Math.cos(angle) * (2.34 + thickness),
      Math.sin(angle) * (1.28 + thickness) - 0.18,
      depth - Math.sin(angle * 2) * 0.1,
    ]
  }

  const vertices = [
    [-1.18, -0.62],
    [0, 1.22],
    [1.18, -0.62],
  ]
  const edge = index % 3
  const start = vertices[edge]
  const end = vertices[(edge + 1) % 3]
  const along = seeded(index + 313)
  const inner = mode === 9 ? 0.58 : 1
  return [
    (start[0] + (end[0] - start[0]) * along) * inner + thickness,
    (start[1] + (end[1] - start[1]) * along) * inner + thickness,
    depth * 0.72,
  ]
}

function getRelayExit(index, seed) {
  const lane = index % 4
  const depth = (seeded(index + 401) - 0.5) * 0.3

  if (lane < 2) {
    const angle = Math.PI * (0.08 + seed * 1.84)
    const radius = lane === 0 ? 1.38 : 2.08
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.42 - 1.2,
      depth + lane * 0.12,
    ]
  }

  return [
    -3.1 + seed * 6.2,
    lane === 2 ? -1.54 : -0.96,
    depth + (lane - 2) * 0.18,
  ]
}

function makeParticleGeometry(count) {
  const origins = new Float32Array(count * 3)
  const targets = new Float32Array(count * 3)
  const exits = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const sizes = new Float32Array(count)
  const energies = new Float32Array(count)
  const flows = new Float32Array(count)

  for (let index = 0; index < count; index += 1) {
    const seed = seeded(index + 1)
    const secondary = seeded(index + 53)
    const target = getNetworkTarget(index, seed)
    const exit = getRelayExit(index, secondary)
    const entryAngle = secondary * TAU
    const entryRadius = 3.5 + seeded(index + 71) * 5.2

    origins[index * 3] = target[0] + Math.cos(entryAngle) * entryRadius
    origins[index * 3 + 1] = target[1] + Math.sin(entryAngle) * entryRadius * 0.66
    origins[index * 3 + 2] = -13.5 + seeded(index + 89) * 8.4
    targets[index * 3] = target[0]
    targets[index * 3 + 1] = target[1]
    targets[index * 3 + 2] = target[2]
    exits[index * 3] = exit[0]
    exits[index * 3 + 1] = exit[1]
    exits[index * 3 + 2] = exit[2]
    seeds[index] = seed
    sizes[index] = 0.72 + seeded(index + 131) * 2.3
    energies[index] = seeded(index + 173) > 0.925 ? 1 : 0
    flows[index] = seeded(index + 197)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(origins, 3))
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3))
  geometry.setAttribute('aExit', new THREE.BufferAttribute(exits, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('aEnergy', new THREE.BufferAttribute(energies, 1))
  geometry.setAttribute('aFlow', new THREE.BufferAttribute(flows, 1))
  geometry.computeBoundingSphere()
  return geometry
}

function makeShaderMaterial(vertexShader, fragmentShader, uniforms) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader,
    fragmentShader,
  })
}

function ParticleField({ timeline }) {
  const runtime = useSceneRuntime()
  const { size } = useThree()
  const isNarrow = size.width / Math.max(size.height, 1) < 0.72
  const count = runtime.quality === 'high' ? (isNarrow ? 2600 : 5200) : 1700
  const geometry = useMemo(() => makeParticleGeometry(count), [count])
  const material = useMemo(() => makeShaderMaterial(
    PARTICLE_VERTEX_SHADER,
    PARTICLE_FRAGMENT_SHADER,
    {
      uBlue: { value: new THREE.Color(SCENE_COLORS.blue) },
      uFormation: { value: 0 },
      uMotion: { value: 1 },
      uOrange: { value: new THREE.Color(SCENE_COLORS.orange) },
      uPixelRatio: { value: 1 },
      uPointScale: { value: 44 },
      uScroll: { value: 0 },
      uTeal: { value: new THREE.Color(SCENE_COLORS.teal) },
      uTime: { value: 0 },
    },
  ), [])

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  useFrame(() => {
    const state = timeline.current
    material.uniforms.uFormation.value = state.formation
    material.uniforms.uMotion.value = state.motion ? 1 : 0
    material.uniforms.uPixelRatio.value = runtime.dpr
    material.uniforms.uPointScale.value = isNarrow ? 37 : 44
    material.uniforms.uScroll.value = state.scroll
    material.uniforms.uTime.value = state.elapsed
  })

  return <points frustumCulled={false} geometry={geometry} material={material} />
}

function filamentTarget(strand, progress) {
  const angle = Math.PI * (0.08 + seeded(strand + 31) * 1.84)
  const start = new THREE.Vector3(
    Math.cos(angle) * (2.5 + seeded(strand + 11) * 0.75),
    Math.sin(angle) * (1.42 + seeded(strand + 7) * 0.34),
    (seeded(strand + 19) - 0.5) * 0.8,
  )
  const endMode = strand % 3
  const end = endMode === 0
    ? new THREE.Vector3(-0.82, -0.42, 0.08)
    : endMode === 1
      ? new THREE.Vector3(0, 0.92, -0.06)
      : new THREE.Vector3(0.82, -0.42, 0.12)
  const controlA = start.clone().multiplyScalar(0.72)
  controlA.z -= 0.72 + seeded(strand + 43) * 0.72
  const controlB = end.clone().multiplyScalar(0.72)
  controlB.x += (seeded(strand + 61) - 0.5) * 0.92
  controlB.z += 0.35 + seeded(strand + 67) * 0.45
  const curve = new THREE.CatmullRomCurve3([start, controlA, controlB, end])
  return curve.getPoint(progress)
}

function filamentExit(strand, progress) {
  const lane = strand % 4
  if (lane < 2) {
    const angle = Math.PI * (0.08 + progress * 1.84)
    const radius = lane === 0 ? 1.38 : 2.08
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.42 - 1.2,
      lane * 0.12,
    )
  }
  return new THREE.Vector3(
    -3.1 + progress * 6.2,
    lane === 2 ? -1.54 : -0.96,
    (lane - 2) * 0.18,
  )
}

function makeFilamentGeometry(strandCount, segments) {
  const vertexCount = strandCount * segments * 2
  const origins = new Float32Array(vertexCount * 3)
  const targets = new Float32Array(vertexCount * 3)
  const exits = new Float32Array(vertexCount * 3)
  const seeds = new Float32Array(vertexCount)
  const energies = new Float32Array(vertexCount)
  const flows = new Float32Array(vertexCount)
  let vertex = 0

  const writeVertex = (strand, progress) => {
    const seed = seeded(strand + 101)
    const target = filamentTarget(strand, progress)
    const exit = filamentExit(strand, progress)
    const entryDirection = new THREE.Vector3(
      Math.cos(seed * TAU) * (3.2 + seed * 2),
      Math.sin(seed * TAU) * (2.2 + seed),
      -8.5 - seed * 3.5,
    )
    const origin = target.clone().addScaledVector(entryDirection, 0.56 + progress * 0.44)
    origins[vertex * 3] = origin.x
    origins[vertex * 3 + 1] = origin.y
    origins[vertex * 3 + 2] = origin.z
    targets[vertex * 3] = target.x
    targets[vertex * 3 + 1] = target.y
    targets[vertex * 3 + 2] = target.z
    exits[vertex * 3] = exit.x
    exits[vertex * 3 + 1] = exit.y
    exits[vertex * 3 + 2] = exit.z
    seeds[vertex] = seed * 0.72 + progress * 0.28
    energies[vertex] = strand % 7 === 0 ? 1 : 0
    flows[vertex] = progress + strand * 0.071
    vertex += 1
  }

  for (let strand = 0; strand < strandCount; strand += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      writeVertex(strand, segment / segments)
      writeVertex(strand, (segment + 1) / segments)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(origins, 3))
  geometry.setAttribute('aTarget', new THREE.BufferAttribute(targets, 3))
  geometry.setAttribute('aExit', new THREE.BufferAttribute(exits, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  geometry.setAttribute('aEnergy', new THREE.BufferAttribute(energies, 1))
  geometry.setAttribute('aFlow', new THREE.BufferAttribute(flows, 1))
  geometry.computeBoundingSphere()
  return geometry
}

function FilamentField({ timeline }) {
  const runtime = useSceneRuntime()
  const { size } = useThree()
  const isNarrow = size.width / Math.max(size.height, 1) < 0.72
  const strandCount = runtime.quality === 'high' ? (isNarrow ? 12 : 22) : 10
  const segments = runtime.quality === 'high' ? 42 : 28
  const geometry = useMemo(
    () => makeFilamentGeometry(strandCount, segments),
    [segments, strandCount],
  )
  const material = useMemo(() => makeShaderMaterial(
    FILAMENT_VERTEX_SHADER,
    FILAMENT_FRAGMENT_SHADER,
    {
      uBlue: { value: new THREE.Color(SCENE_COLORS.blue) },
      uFormation: { value: 0 },
      uMotion: { value: 1 },
      uOrange: { value: new THREE.Color(SCENE_COLORS.orange) },
      uScroll: { value: 0 },
      uTeal: { value: new THREE.Color(SCENE_COLORS.teal) },
      uTime: { value: 0 },
    },
  ), [])

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  useFrame(() => {
    const state = timeline.current
    material.uniforms.uFormation.value = state.formation
    material.uniforms.uMotion.value = state.motion ? 1 : 0
    material.uniforms.uScroll.value = state.scroll
    material.uniforms.uTime.value = state.elapsed
  })

  return <lineSegments frustumCulled={false} geometry={geometry} material={material} />
}

function makeEllipseCurve(start, end, radiusX, radiusY, yOffset = 0, zOffset = 0) {
  const points = Array.from({ length: 48 }, (_, index) => {
    const angle = start + (end - start) * (index / 47)
    return new THREE.Vector3(
      Math.cos(angle) * radiusX,
      Math.sin(angle) * radiusY + yOffset,
      Math.sin(angle * 2) * 0.1 + zOffset,
    )
  })
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.24)
}

function NetworkShell({ timeline }) {
  const groupRef = useRef(null)
  const shell = useMemo(() => {
    const upper = makeEllipseCurve(Math.PI * 0.12, Math.PI * 0.88, 2.5, 1.4, 0.18)
    const lower = makeEllipseCurve(Math.PI * 1.12, Math.PI * 1.88, 2.34, 1.28, -0.18)
    const triangle = [
      new THREE.Vector3(-1.18, -0.62, 0),
      new THREE.Vector3(0, 1.22, 0.04),
      new THREE.Vector3(1.18, -0.62, 0),
    ]
    const curves = [
      upper,
      lower,
      new THREE.LineCurve3(triangle[0], triangle[1]),
      new THREE.LineCurve3(triangle[1], triangle[2]),
      new THREE.LineCurve3(triangle[2], triangle[0]),
    ]
    const geometries = curves.map((curve, index) => new THREE.TubeGeometry(
      curve,
      index < 2 ? 96 : 32,
      index === 4 ? 0.024 : 0.018,
      6,
      false,
    ))
    const material = new THREE.MeshPhysicalMaterial({
      color: SCENE_COLORS.deepNavy,
      emissive: SCENE_COLORS.teal,
      emissiveIntensity: 0.9,
      metalness: 0.66,
      roughness: 0.22,
      clearcoat: 0.74,
      clearcoatRoughness: 0.2,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const accentMaterial = material.clone()
    accentMaterial.emissive = new THREE.Color(SCENE_COLORS.orange)
    accentMaterial.color = new THREE.Color('#32170d')
    return { accentMaterial, curves, geometries, material }
  }, [])

  useEffect(() => () => {
    shell.geometries.forEach((geometry) => geometry.dispose())
    shell.material.dispose()
    shell.accentMaterial.dispose()
  }, [shell])

  useFrame(() => {
    const state = timeline.current
    const visible = smoother((state.formation - 0.28) / 0.72)
    shell.material.opacity = visible * (0.48 - state.scroll * 0.32)
    shell.accentMaterial.opacity = visible * (0.58 - state.scroll * 0.4)
    shell.material.emissiveIntensity = 0.72 + Math.sin(state.elapsed * 0.34) * 0.12
    shell.accentMaterial.emissiveIntensity = 0.8 + Math.sin(state.elapsed * 0.42) * 0.15
    if (!groupRef.current) return
    groupRef.current.scale.setScalar(0.9 + visible * 0.1)
    groupRef.current.rotation.z = Math.sin(state.elapsed * 0.12) * 0.018 * (1 - state.scroll)
  })

  return (
    <group ref={groupRef}>
      {shell.geometries.map((geometry, index) => (
        <mesh
          key={index}
          geometry={geometry}
          material={index === 4 ? shell.accentMaterial : shell.material}
        />
      ))}
      <PulseField curves={shell.curves} timeline={timeline} />
    </group>
  )
}

function PulseField({ curves, timeline }) {
  const meshRef = useRef(null)
  const materialRef = useRef(null)
  const helper = useMemo(() => new THREE.Object3D(), [])
  const colors = useMemo(() => [
    SCENE_COLORS.teal,
    SCENE_COLORS.cyan,
    SCENE_COLORS.orange,
    SCENE_COLORS.teal,
    SCENE_COLORS.orange,
    SCENE_COLORS.cyan,
  ].map((color) => new THREE.Color(color)), [])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    colors.forEach((color, index) => mesh.setColorAt(index, color))
    mesh.instanceColor.needsUpdate = true
  }, [colors])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const state = timeline.current
    const visible = smoother((state.formation - 0.34) / 0.66)
    for (let index = 0; index < colors.length; index += 1) {
      const curve = curves[index % curves.length]
      const rate = state.motion ? 0.035 + index * 0.002 : 0
      const progress = (state.elapsed * rate + index * 0.173) % 1
      const point = curve.getPointAt(progress)
      const exitPoint = filamentExit(index, progress)
      point.lerp(exitPoint, state.scroll)
      helper.position.copy(point)
      const pulse = 0.034 + (index % 3) * 0.008
      helper.scale.setScalar(pulse * visible)
      helper.updateMatrix()
      mesh.setMatrixAt(index, helper.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (materialRef.current) materialRef.current.opacity = visible * (1 - state.scroll * 0.28)
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, colors.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial
        ref={materialRef}
        transparent
        opacity={0}
        toneMapped={false}
        vertexColors
      />
    </instancedMesh>
  )
}

function RelayNodes({ timeline }) {
  const count = 44
  const meshRef = useRef(null)
  const materialRef = useRef(null)
  const helper = useMemo(() => new THREE.Object3D(), [])
  const targets = useMemo(() => Array.from({ length: count }, (_, index) => {
    const seed = seeded(index + 809)
    return {
      energy: index % 11 === 0,
      exit: new THREE.Vector3(...getRelayExit(index, seed)),
      target: new THREE.Vector3(...getNetworkTarget(index, seed)),
    }
  }), [])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    targets.forEach((node, index) => {
      mesh.setColorAt(index, new THREE.Color(node.energy ? SCENE_COLORS.orange : SCENE_COLORS.cyan))
    })
    mesh.instanceColor.needsUpdate = true
  }, [targets])

  useFrame(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const state = timeline.current
    const visible = smoother((state.formation - 0.18) / 0.82)
    targets.forEach((node, index) => {
      helper.position.copy(node.target).lerp(node.exit, state.scroll)
      const breathing = state.motion ? 1 + Math.sin(state.elapsed * 0.7 + index) * 0.08 : 1
      helper.scale.setScalar((node.energy ? 0.065 : 0.038) * visible * breathing)
      helper.updateMatrix()
      mesh.setMatrixAt(index, helper.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (materialRef.current) materialRef.current.opacity = 0.52 + visible * 0.42
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial
        ref={materialRef}
        color={SCENE_COLORS.warmWhite}
        emissive={SCENE_COLORS.teal}
        emissiveIntensity={1.2}
        metalness={0.2}
        opacity={0}
        roughness={0.28}
        transparent
        vertexColors
      />
    </instancedMesh>
  )
}

function CinematicCamera({ timeline }) {
  const { camera, pointer, size } = useThree()
  const initializedRef = useRef(false)
  const desired = useMemo(() => new THREE.Vector3(), [])
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const state = timeline.current
    const aspect = size.width / Math.max(size.height, 1)
    const layout = getLayout(aspect)
    const mobile = aspect < 0.68
    const start = mobile
      ? [3.4, 2.1, 13.8]
      : [5.3, 2.25, 13.4]
    const end = mobile
      ? [0.05, 0.35, 10.7]
      : [0.45, 0.34, 9.25]
    const cameraProgress = state.camera
    desired.set(
      THREE.MathUtils.lerp(start[0], end[0], cameraProgress),
      THREE.MathUtils.lerp(start[1], end[1], cameraProgress),
      THREE.MathUtils.lerp(start[2], end[2], cameraProgress),
    )
    desired.x += Math.sin(cameraProgress * Math.PI) * (mobile ? 0.16 : 0.55)
    desired.y += state.scroll * (mobile ? 0.35 : 0.82)
    desired.z -= state.scroll * (mobile ? 0.45 : 0.9)

    if (state.motion && state.settled > 0) {
      desired.x += Math.sin(state.elapsed * 0.13) * 0.07 * state.settled
      desired.y += Math.cos(state.elapsed * 0.11) * 0.045 * state.settled
      desired.x += pointer.x * 0.08
      desired.y += pointer.y * 0.045
    }

    if (!initializedRef.current) {
      camera.position.copy(desired)
      initializedRef.current = true
    } else {
      camera.position.lerp(desired, 1 - Math.exp(-delta * 3.7))
    }

    const targetX = aspect > 1.05
      ? 0.48
      : aspect > 0.68
        ? layout.x * 0.58
        : layout.x
    target.set(targetX, layout.y - state.scroll * 0.72, 0)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
  })

  return null
}

function CinematicLighting({ timeline }) {
  const spotRef = useRef(null)
  const targetRef = useRef(null)
  const orangeRef = useRef(null)
  const { size } = useThree()

  useEffect(() => {
    if (spotRef.current && targetRef.current) spotRef.current.target = targetRef.current
  }, [])

  useFrame(() => {
    const state = timeline.current
    const aspect = size.width / Math.max(size.height, 1)
    const layout = getLayout(aspect)
    const sweep = smoother((state.elapsed - 3.72) / 1.45)
    const sweepEnvelope = Math.sin(sweep * Math.PI)
    if (targetRef.current) targetRef.current.position.set(layout.x, layout.y, 0)
    if (spotRef.current) {
      spotRef.current.position.set(
        layout.x - 4.8 + sweep * 9.2,
        layout.y + 4.4,
        5.2,
      )
      spotRef.current.intensity = 18 + sweepEnvelope * 88
    }
    if (orangeRef.current) {
      orangeRef.current.intensity = 5 + smoother((state.formation - 0.48) / 0.52) * 15
    }
  })

  return (
    <>
      <ambientLight color={SCENE_COLORS.warmWhite} intensity={0.18} />
      <hemisphereLight args={['#85dfe9', '#02070b', 0.45]} />
      <object3D ref={targetRef} />
      <spotLight
        ref={spotRef}
        angle={0.38}
        color={SCENE_COLORS.cyan}
        decay={2}
        distance={24}
        intensity={18}
        penumbra={0.86}
      />
      <pointLight
        ref={orangeRef}
        color={SCENE_COLORS.orange}
        decay={2}
        distance={8}
        intensity={5}
        position={[3.8, -1.6, 2.8]}
      />
      <directionalLight color={SCENE_COLORS.warmWhite} intensity={1.1} position={[-2, 4, 6]} />
    </>
  )
}

export default function HeroFormationScene({ introStartedAt, onReveal, scrollProgress }) {
  const runtime = useSceneRuntime()
  const { size } = useThree()
  const formationRef = useRef(null)
  const revealSentRef = useRef(false)
  const onRevealRef = useRef(onReveal)
  const timeline = useRef({
    camera: runtime.reducedMotion ? 1 : 0,
    elapsed: runtime.reducedMotion ? 8 : 0,
    formation: runtime.reducedMotion ? 1 : 0,
    motion: !runtime.reducedMotion,
    scroll: 0,
    settled: runtime.reducedMotion ? 1 : 0,
  })

  useEffect(() => {
    onRevealRef.current = onReveal
  }, [onReveal])

  useFrame(({ clock }) => {
    const now = typeof performance === 'undefined' ? clock.elapsedTime * 1000 : performance.now()
    const elapsed = runtime.reducedMotion
      ? 8
      : Math.max(0, (now - introStartedAt) / 1000)
    const scroll = runtime.reducedMotion ? 0 : clamp01(scrollProgress?.current ?? 0)
    const formation = Math.max(
      smoother((elapsed - 0.34) / 3.25),
      smoother(scroll * 2.2),
    )
    timeline.current = {
      camera: runtime.reducedMotion ? 1 : smoother((elapsed - 0.42) / 4.15),
      elapsed,
      formation,
      motion: runtime.running && !runtime.reducedMotion,
      scroll,
      settled: runtime.reducedMotion ? 1 : smoother((elapsed - 5.25) / 1.05),
    }

    if (!revealSentRef.current && (runtime.reducedMotion || elapsed >= 4.12)) {
      revealSentRef.current = true
      onRevealRef.current?.()
    }

    const group = formationRef.current
    if (!group) return
    const aspect = size.width / Math.max(size.height, 1)
    const layout = getLayout(aspect)
    group.position.set(
      layout.x * (1 - scroll * 0.18),
      layout.y - scroll * 0.68,
      -scroll * 0.32,
    )
    const formedScale = 0.86 + formation * 0.14
    group.scale.setScalar(layout.scale * formedScale * (1 - scroll * 0.06))
    group.rotation.x = scroll * 0.18
    group.rotation.y = THREE.MathUtils.lerp(-0.3, 0.03, formation)
      + Math.sin(elapsed * 0.12) * 0.018 * timeline.current.settled * (1 - scroll)
    group.rotation.z = -scroll * 0.04
  })

  return (
    <>
      <color attach="background" args={[SCENE_COLORS.background]} />
      <fog attach="fog" args={[SCENE_COLORS.background, 8.5, 24]} />
      <CinematicCamera timeline={timeline} />
      <CinematicLighting timeline={timeline} />

      <group ref={formationRef}>
        <ParticleField timeline={timeline} />
        <FilamentField timeline={timeline} />
        <NetworkShell timeline={timeline} />
        <RelayNodes timeline={timeline} />
      </group>

      {runtime.quality === 'high' && (
        <Environment resolution={64}>
          <Lightformer
            color={SCENE_COLORS.cyan}
            intensity={1.1}
            position={[-5, 3, -4]}
            rotation-y={Math.PI / 2}
            scale={[4, 1.5, 1]}
          />
          <Lightformer
            color={SCENE_COLORS.warmWhite}
            intensity={0.8}
            position={[1, 5, -6]}
            rotation-x={Math.PI / 2}
            scale={[7, 2, 1]}
          />
        </Environment>
      )}
      {runtime.quality === 'high' && (
        <RestrainedBloom radius={0.32} strength={0.31} threshold={0.82} />
      )}
    </>
  )
}

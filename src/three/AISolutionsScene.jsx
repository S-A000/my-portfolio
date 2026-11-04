import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS, SCENE_MATERIALS } from './sceneTheme'
import { SCENE_PHASES, easeInCubic, easeOutCubic } from './useSceneTransition'

const MODULES = Object.freeze([
  {
    assembled: [-2.72, 0.82, 0.48],
    exploded: [-5.2, 2.9, 3.5],
    start: 0,
    end: 0.95,
    type: 'documents',
  },
  {
    assembled: [-2.92, -0.42, -0.14],
    exploded: [-5.35, -2.5, -2.7],
    start: 0.28,
    end: 1.2,
    type: 'data',
  },
  {
    assembled: [-2.28, -1.16, 0.94],
    exploded: [-3.4, -3.7, 4.2],
    start: 0.56,
    end: 1.52,
    type: 'prompt',
  },
  {
    assembled: [-0.28, 0.02, 0],
    exploded: [0.15, 3.8, -4.5],
    start: 0.18,
    end: 1.48,
    type: 'core',
  },
  {
    assembled: [2.2, 0.4, 0.18],
    exploded: [5.3, 2.8, -3.7],
    start: 5.85,
    end: 7.05,
    type: 'insight',
  },
  {
    assembled: [2.42, -1.14, 0.7],
    exploded: [5.15, -3.35, 3.8],
    start: 7.5,
    end: 8.55,
    type: 'review',
  },
])

const CORE_POSITION = new THREE.Vector3(-0.28, 0.84, 0)
const OUTPUT_POSITION = new THREE.Vector3(1.48, 0.52, 0.22)
const REVIEW_POSITION = new THREE.Vector3(2.06, -0.76, 0.66)

const DOCUMENT_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.72, 1.03, 0.52),
  new THREE.Vector3(-2.06, 1.08, 0.34),
  new THREE.Vector3(-1.24, 0.76, 0.12),
  CORE_POSITION,
])

const DATA_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.92, -0.12, -0.12),
  new THREE.Vector3(-2.2, -0.22, -0.08),
  new THREE.Vector3(-1.32, 0.02, -0.04),
  CORE_POSITION,
])

const PROMPT_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.28, -0.91, 0.96),
  new THREE.Vector3(-1.76, -0.58, 0.72),
  new THREE.Vector3(-1.12, -0.15, 0.38),
  CORE_POSITION,
])

const INSIGHT_CURVE = new THREE.CatmullRomCurve3([
  CORE_POSITION,
  new THREE.Vector3(0.38, 0.82, 0.08),
  new THREE.Vector3(0.92, 0.72, 0.16),
  OUTPUT_POSITION,
])

const REVIEW_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(2.12, 0.1, 0.28),
  new THREE.Vector3(2.52, -0.12, 0.44),
  new THREE.Vector3(2.5, -0.46, 0.62),
  REVIEW_POSITION,
])

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const smoothstep = (start, end, value) => {
  const normalized = clamp01((value - start) / Math.max(end - start, 0.0001))
  return normalized * normalized * (3 - 2 * normalized)
}
const damp = (current, target, speed, delta) => THREE.MathUtils.damp(current, target, speed, delta)

function lifecycleTime(lifecycle, reducedMotion) {
  if (reducedMotion) return 12
  if (lifecycle.phase === SCENE_PHASES.INTRO) return lifecycle.progress * 0.86
  if (lifecycle.phase === SCENE_PHASES.ACTIVE) return 0.86 + lifecycle.progress * 0.28
  if (lifecycle.phase === SCENE_PHASES.IDLE) return 1.14 + lifecycle.idleTime
  return 12
}

function UiLine({ color = SCENE_COLORS.warmWhite, opacity = 0.45, position, size }) {
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

function ModulePlatform({ accent, args = [1.26, 0.16, 0.96], children }) {
  return (
    <group>
      <RoundedBox args={args} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.28} />
        <Edges color={accent} transparent opacity={0.4} />
      </RoundedBox>
      <mesh position={[0, args[1] * 0.62, args[2] * 0.4]}>
        <boxGeometry args={[args[0] * 0.64, 0.018, 0.02]} />
        <meshBasicMaterial color={accent} transparent opacity={0.72} toneMapped={false} />
      </mesh>
      {children}
    </group>
  )
}

function DocumentSource({ sheetRefs }) {
  return (
    <ModulePlatform accent={SCENE_COLORS.warmWhite} args={[1.34, 0.16, 1.02]}>
      <group position={[0, 0.42, 0]} rotation={[-0.06, -0.16, 0]}>
        {[0, 1, 2].map((index) => (
          <group
            key={index}
            ref={(node) => { sheetRefs.current[index] = node }}
            position={[(index - 1) * 0.12, index * 0.075, -index * 0.055]}
            rotation={[0, 0, (index - 1) * 0.055]}
          >
            <RoundedBox args={[0.7, 0.82, 0.035]} radius={0.035} smoothness={3} castShadow>
              <meshPhysicalMaterial
                color={index === 2 ? '#d9e9e6' : '#8da8ac'}
                metalness={0.14}
                roughness={0.45}
                transparent
                opacity={index === 2 ? 0.94 : 0.66}
              />
            </RoundedBox>
            <UiLine color={SCENE_COLORS.orange} position={[-0.2, 0.27, 0.022]} size={[0.16, 0.035]} opacity={0.9} />
            {[0.12, -0.03, -0.18].map((y, lineIndex) => (
              <UiLine
                key={y}
                color="#173846"
                position={[-0.04, y, 0.022]}
                size={[lineIndex === 2 ? 0.42 : 0.5, 0.026]}
                opacity={0.54}
              />
            ))}
          </group>
        ))}
      </group>
    </ModulePlatform>
  )
}

function DataSource({ cellRefs }) {
  return (
    <ModulePlatform accent={SCENE_COLORS.blue} args={[1.42, 0.16, 1.02]}>
      <group position={[0, 0.35, 0]}>
        <RoundedBox args={[0.98, 0.6, 0.12]} radius={0.055} smoothness={3} castShadow>
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
          <Edges color={SCENE_COLORS.blue} transparent opacity={0.44} />
        </RoundedBox>
        {[-0.3, -0.1, 0.1, 0.3].map((x, column) => (
          [-0.15, 0.05, 0.21].map((y, row) => (
            <mesh key={`${x}-${y}`} position={[x, y, 0.075]}>
              <boxGeometry args={[0.12, 0.09, 0.025]} />
              <meshBasicMaterial
                ref={(node) => { cellRefs.current[column * 3 + row] = node }}
                color={column === 3 && row === 1 ? SCENE_COLORS.orange : SCENE_COLORS.teal}
                transparent
                opacity={0.32}
                toneMapped={false}
              />
            </mesh>
          ))
        ))}
      </group>
    </ModulePlatform>
  )
}

function PromptSource({ cursorMaterialRef }) {
  return (
    <ModulePlatform accent={SCENE_COLORS.orange} args={[1.46, 0.16, 0.92]}>
      <group position={[0, 0.32, 0.01]} rotation={[-0.04, 0.08, 0]}>
        <RoundedBox args={[1.12, 0.5, 0.1]} radius={0.08} smoothness={4} castShadow>
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} roughness={0.25} />
          <Edges color={SCENE_COLORS.orange} transparent opacity={0.48} />
        </RoundedBox>
        <mesh position={[-0.4, 0, 0.065]}>
          <circleGeometry args={[0.105, 20]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </mesh>
        <UiLine color={SCENE_COLORS.warmWhite} position={[0.12, 0.08, 0.065]} size={[0.62, 0.035]} opacity={0.62} />
        <UiLine color={SCENE_COLORS.teal} position={[0.02, -0.08, 0.065]} size={[0.42, 0.03]} opacity={0.52} />
        <mesh position={[0.38, -0.08, 0.067]}>
          <planeGeometry args={[0.035, 0.11]} />
          <meshBasicMaterial ref={cursorMaterialRef} color={SCENE_COLORS.orange} transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>
    </ModulePlatform>
  )
}

function ReasoningCore({ cageRefs, coreMaterialRef, nodeRefs, plateRefs }) {
  return (
    <ModulePlatform accent={SCENE_COLORS.teal} args={[1.9, 0.2, 1.7]}>
      <group position={[0, 0.82, 0]}>
        {[-0.46, 0, 0.46].map((y, index) => (
          <mesh key={y} ref={(node) => { plateRefs.current[index] = node }} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[0.75 - index * 0.06, 0.75 - index * 0.06, 0.07, 8]} />
            <meshPhysicalMaterial
              color={index === 1 ? '#124c5c' : SCENE_COLORS.deepNavy}
              emissive={index === 1 ? SCENE_COLORS.teal : SCENE_COLORS.blue}
              emissiveIntensity={0.12}
              metalness={0.66}
              roughness={0.2}
              transparent
              opacity={0.82}
            />
          </mesh>
        ))}

        {[
          [-0.77, 0, 0],
          [0.77, 0, 0],
          [0, 0, -0.77],
          [0, 0, 0.77],
        ].map((position, index) => (
          <group
            key={position.join('-')}
            ref={(node) => { cageRefs.current[index] = node }}
            position={position}
            rotation={[0, index > 1 ? Math.PI / 2 : 0, 0]}
          >
            <RoundedBox args={[0.12, 1.32, 0.14]} radius={0.045} smoothness={3} castShadow>
              <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
              <Edges color={index % 2 ? SCENE_COLORS.orange : SCENE_COLORS.teal} transparent opacity={0.5} />
            </RoundedBox>
          </group>
        ))}

        <mesh castShadow rotation={[0.2, 0.35, 0.12]}>
          <octahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            ref={coreMaterialRef}
            color={SCENE_COLORS.teal}
            emissive={SCENE_COLORS.teal}
            emissiveIntensity={0.35}
            metalness={0.46}
            roughness={0.12}
          />
        </mesh>
        <mesh rotation={[0.8, 0.18, 0.5]}>
          <torusGeometry args={[0.58, 0.018, 10, 72]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} transparent opacity={0.66} toneMapped={false} />
        </mesh>
        <mesh rotation={[0.12, 1.08, 0.3]}>
          <torusGeometry args={[0.48, 0.014, 8, 64]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} transparent opacity={0.56} toneMapped={false} />
        </mesh>

        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = index * Math.PI / 3
          return (
            <mesh
              key={index}
              ref={(node) => { nodeRefs.current[index] = node }}
              position={[Math.cos(angle) * 0.88, (index % 2 ? 0.24 : -0.2), Math.sin(angle) * 0.88]}
            >
              <sphereGeometry args={[0.07, 14, 14]} />
              <meshBasicMaterial color={index === 1 || index === 4 ? SCENE_COLORS.orange : SCENE_COLORS.cyan} toneMapped={false} />
            </mesh>
          )
        })}
      </group>
    </ModulePlatform>
  )
}

function InsightPanel({ evidenceRefs, fillRef, panelMaterialRef, partRefs }) {
  return (
    <ModulePlatform accent={SCENE_COLORS.orange} args={[2.22, 0.17, 1.36]}>
      <group position={[0, 0.76, 0]} rotation={[0, -0.12, 0]}>
        <RoundedBox args={[2.02, 1.28, 0.1]} radius={0.1} smoothness={4} castShadow>
          <meshPhysicalMaterial
            ref={panelMaterialRef}
            color="#092733"
            emissive={SCENE_COLORS.teal}
            emissiveIntensity={0.05}
            metalness={0.32}
            roughness={0.3}
            clearcoat={0.48}
          />
          <Edges color={SCENE_COLORS.orange} transparent opacity={0.48} />
        </RoundedBox>

        <group ref={(node) => { partRefs.current[0] = node }} position={[0, 0.43, 0.065]}>
          <mesh position={[-0.78, 0, 0]}>
            <circleGeometry args={[0.07, 16]} />
            <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
          </mesh>
          <UiLine color={SCENE_COLORS.warmWhite} position={[-0.3, 0.04, 0]} size={[0.68, 0.055]} opacity={0.78} />
          <UiLine color={SCENE_COLORS.teal} position={[-0.44, -0.08, 0]} size={[0.4, 0.03]} opacity={0.58} />
          <UiLine color={SCENE_COLORS.blue} position={[0.7, 0, 0]} size={[0.32, 0.12]} opacity={0.38} />
        </group>

        <group ref={(node) => { partRefs.current[1] = node }} position={[-0.45, -0.06, 0.066]}>
          {[-0.22, 0.02, 0.26].map((y, index) => (
            <group key={y} position={[0, y, 0]}>
              <mesh position={[-0.38, 0, 0]}>
                <circleGeometry args={[0.055, 14]} />
                <meshBasicMaterial color={index === 1 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
              </mesh>
              <UiLine position={[0.04, 0.035, 0]} size={[0.64, 0.035]} opacity={0.46} />
              <UiLine color={SCENE_COLORS.blue} position={[-0.04, -0.055, 0]} size={[0.48, 0.025]} opacity={0.28} />
            </group>
          ))}
        </group>

        <group ref={(node) => { partRefs.current[2] = node }} position={[0.57, -0.07, 0.066]}>
          <RoundedBox args={[0.66, 0.64, 0.035]} radius={0.055} smoothness={3}>
            <meshPhysicalMaterial color="#0b3442" metalness={0.25} roughness={0.35} />
            <Edges color={SCENE_COLORS.teal} transparent opacity={0.36} />
          </RoundedBox>
          {[0, 1, 2, 3].map((index) => (
            <mesh
              key={index}
              ref={(node) => { evidenceRefs.current[index] = node }}
              position={[-0.22 + index * 0.15, -0.12 + index * 0.04, 0.03]}
            >
              <boxGeometry args={[0.09, 0.3, 0.022]} />
              <meshBasicMaterial color={index === 3 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, -0.26, 0.032]}>
            <planeGeometry args={[0.5, 0.035]} />
            <meshBasicMaterial color="#153b46" />
          </mesh>
          <mesh ref={fillRef} position={[-0.24, -0.26, 0.035]}>
            <planeGeometry args={[0.48, 0.035]} />
            <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </ModulePlatform>
  )
}

function HumanReview({ approvalMaterialRef, checkRef, haloRef }) {
  return (
    <ModulePlatform accent={SCENE_COLORS.teal} args={[1.72, 0.17, 1.04]}>
      <group position={[-0.42, 0.45, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshPhysicalMaterial {...SCENE_MATERIALS.ceramic} />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.32, 0.42, 20]} />
          <meshPhysicalMaterial color={SCENE_COLORS.panel} metalness={0.36} roughness={0.3} />
        </mesh>
        <mesh ref={haloRef} position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.014, 8, 48]} />
          <meshBasicMaterial color={SCENE_COLORS.teal} transparent opacity={0.52} toneMapped={false} />
        </mesh>
      </group>
      <group position={[0.42, 0.43, 0]}>
        <RoundedBox args={[0.66, 0.72, 0.08]} radius={0.08} smoothness={4} castShadow>
          <meshPhysicalMaterial
            ref={approvalMaterialRef}
            color="#0a2d39"
            emissive={SCENE_COLORS.teal}
            emissiveIntensity={0.05}
            metalness={0.42}
            roughness={0.28}
          />
          <Edges color={SCENE_COLORS.orange} transparent opacity={0.48} />
        </RoundedBox>
        <group ref={checkRef} position={[0, 0.03, 0.06]} scale={0.001}>
          <mesh position={[-0.11, -0.06, 0]} rotation={[0, 0, -0.72]}>
            <boxGeometry args={[0.28, 0.09, 0.035]} />
            <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
          </mesh>
          <mesh position={[0.09, 0.05, 0]} rotation={[0, 0, 0.68]}>
            <boxGeometry args={[0.48, 0.09, 0.035]} />
            <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
          </mesh>
        </group>
        <UiLine color={SCENE_COLORS.teal} position={[0, -0.25, 0.055]} size={[0.34, 0.03]} opacity={0.58} />
      </group>
    </ModulePlatform>
  )
}

function Route({ color, curve, opacity = 0.78, radius = 0.014 }) {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.042, 8, false]} />
        <meshStandardMaterial color="#092631" metalness={0.58} roughness={0.32} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 72, radius, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  )
}

function AISolutionsCamera({ lifecycleRef }) {
  const { camera, size } = useThree()
  const runtime = useSceneRuntime()
  const targetRef = useRef(new THREE.Vector3(-0.05, -0.05, 0.1))
  const desiredPosition = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const positions = useMemo(() => ({
    wide: new THREE.Vector3(5.1, 3.1, 8.65),
    inputs: new THREE.Vector3(-3.65, 1.65, 5.95),
    core: new THREE.Vector3(1.45, 1.62, 4.7),
    output: new THREE.Vector3(4.7, 1.18, 5.2),
    compactWide: new THREE.Vector3(3, 4.2, 11.9),
    compactInputs: new THREE.Vector3(-3.9, 3.05, 9.15),
    compactCore: new THREE.Vector3(1.7, 2.8, 7.65),
    compactOutput: new THREE.Vector3(4.9, 2.8, 8.35),
    inputTarget: new THREE.Vector3(-2.05, -0.04, 0.35),
    coreTarget: new THREE.Vector3(-0.25, 0.36, 0),
    outputTarget: new THREE.Vector3(1.65, -0.12, 0.38),
  }), [])

  useFrame((_, delta) => {
    const lifecycle = lifecycleRef.current
    if (lifecycle.currentKey !== 'ai-solutions') return
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const compact = size.width < 560 || size.width / Math.max(size.height, 1) < 0.82
    const wide = compact ? positions.compactWide : positions.wide
    const inputView = compact ? positions.compactInputs : positions.inputs
    const coreView = compact ? positions.compactCore : positions.core
    const outputView = compact ? positions.compactOutput : positions.output
    const inputWeight = runtime.reducedMotion ? 0 : smoothstep(2, 2.75, time) * (1 - smoothstep(3.75, 4.45, time))
    const coreWeight = runtime.reducedMotion ? 0 : smoothstep(4, 4.75, time) * (1 - smoothstep(6.15, 6.85, time))
    const outputWeight = runtime.reducedMotion ? 0 : smoothstep(6.5, 7.15, time) * (1 - smoothstep(9.45, 10.35, time))
    const exitPullback = lifecycle.phase === SCENE_PHASES.EXIT ? easeInCubic(lifecycle.progress) : 0

    desiredPosition.current.copy(wide).lerp(inputView, inputWeight).lerp(coreView, coreWeight).lerp(outputView, outputWeight)
    desiredPosition.current.z += exitPullback * 2.3
    desiredTarget.current
      .set(-0.04, -0.08, 0.12)
      .lerp(positions.inputTarget, inputWeight)
      .lerp(positions.coreTarget, coreWeight)
      .lerp(positions.outputTarget, outputWeight)

    const speed = runtime.reducedMotion ? 20 : 3.15
    camera.position.x = damp(camera.position.x, desiredPosition.current.x, speed, delta)
    camera.position.y = damp(camera.position.y, desiredPosition.current.y, speed, delta)
    camera.position.z = damp(camera.position.z, desiredPosition.current.z, speed, delta)
    targetRef.current.x = damp(targetRef.current.x, desiredTarget.current.x, speed, delta)
    targetRef.current.y = damp(targetRef.current.y, desiredTarget.current.y, speed, delta)
    targetRef.current.z = damp(targetRef.current.z, desiredTarget.current.z, speed, delta)
    camera.lookAt(targetRef.current)
  })

  return null
}

export default function AISolutionsScene({ lifecycleRef }) {
  const runtime = useSceneRuntime()
  const rootRef = useRef(null)
  const moduleRefs = useRef([])
  const sheetRefs = useRef([])
  const dataCellRefs = useRef([])
  const cursorMaterialRef = useRef(null)
  const cageRefs = useRef([])
  const coreMaterialRef = useRef(null)
  const coreNodeRefs = useRef([])
  const plateRefs = useRef([])
  const inputRoutesRef = useRef(null)
  const outputRouteRef = useRef(null)
  const reviewRouteRef = useRef(null)
  const documentPacketsRef = useRef(null)
  const dataPacketsRef = useRef(null)
  const promptPacketsRef = useRef(null)
  const insightPacketsRef = useRef(null)
  const coreParticlesRef = useRef(null)
  const evidenceRefs = useRef([])
  const insightFillRef = useRef(null)
  const insightMaterialRef = useRef(null)
  const insightPartRefs = useRef([])
  const approvalMaterialRef = useRef(null)
  const checkRef = useRef(null)
  const reviewHaloRef = useRef(null)
  const resultArtifactRef = useRef(null)
  const resultArtifactMaterialRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const point = useMemo(() => new THREE.Vector3(), [])
  const teal = useMemo(() => new THREE.Color(SCENE_COLORS.teal), [])
  const orange = useMemo(() => new THREE.Color(SCENE_COLORS.orange), [])

  useFrame(({ clock }, delta) => {
    const lifecycle = lifecycleRef.current
    const isAI = lifecycle.currentKey === 'ai-solutions'
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const elapsed = clock.getElapsedTime()
    const exitFactor = lifecycle.phase === SCENE_PHASES.EXIT && isAI
      ? 1 - easeInCubic(lifecycle.progress)
      : 1
    const visible = isAI ? exitFactor : 0

    if (rootRef.current) {
      rootRef.current.scale.setScalar(damp(rootRef.current.scale.x, Math.max(0.001, visible), 7.5, delta))
      rootRef.current.position.y = damp(
        rootRef.current.position.y,
        isAI && runtime.running && !runtime.reducedMotion && time > 10.4 ? Math.sin(elapsed * 0.34) * 0.024 : 0,
        4,
        delta,
      )
    }

    MODULES.forEach((module, index) => {
      const node = moduleRefs.current[index]
      if (!node) return
      let assembly = easeOutCubic(smoothstep(module.start, module.end, time)) * exitFactor
      if (!isAI) assembly = 0
      node.position.set(
        THREE.MathUtils.lerp(module.exploded[0], module.assembled[0], assembly),
        THREE.MathUtils.lerp(module.exploded[1], module.assembled[1], assembly),
        THREE.MathUtils.lerp(module.exploded[2], module.assembled[2], assembly),
      )
      node.rotation.set(
        (1 - assembly) * (index % 2 ? -0.5 : 0.45),
        (1 - assembly) * (index % 2 ? 0.88 : -0.82),
        (1 - assembly) * (index - 2.5) * 0.1,
      )
      node.scale.setScalar(Math.max(0.001, assembly))
    })

    const inputReveal = isAI ? smoothstep(1.25, 2.05, time) * exitFactor : 0
    const outputReveal = isAI ? smoothstep(5.7, 6.65, time) * exitFactor : 0
    const reviewReveal = isAI ? smoothstep(7.7, 8.55, time) * exitFactor : 0
    if (inputRoutesRef.current) inputRoutesRef.current.scale.setScalar(damp(inputRoutesRef.current.scale.x, Math.max(0.001, inputReveal), 7, delta))
    if (outputRouteRef.current) outputRouteRef.current.scale.setScalar(damp(outputRouteRef.current.scale.x, Math.max(0.001, outputReveal), 7, delta))
    if (reviewRouteRef.current) reviewRouteRef.current.scale.setScalar(damp(reviewRouteRef.current.scale.x, Math.max(0.001, reviewReveal), 7, delta))

    sheetRefs.current.forEach((sheet, index) => {
      if (sheet) sheet.position.y += runtime.running && isAI ? Math.sin(elapsed * 0.8 + index) * 0.0007 : 0
    })
    dataCellRefs.current.forEach((material, index) => {
      if (material) material.opacity = 0.24 + inputReveal * (0.32 + Math.sin(elapsed * 2 + index * 0.6) * 0.1)
    })
    if (cursorMaterialRef.current) cursorMaterialRef.current.opacity = runtime.running && isAI
      ? 0.35 + (Math.sin(elapsed * 4) + 1) * 0.3
      : 0.9

    const coreActivation = smoothstep(3.6, 4.65, time)
    const transformation = smoothstep(4.8, 5.72, time)
    plateRefs.current.forEach((plate, index) => {
      if (!plate) return
      plate.rotation.y = runtime.running && isAI ? elapsed * (index === 1 ? -0.42 : 0.32 + index * 0.08) : index * 0.22
      plate.position.y = [-0.46, 0, 0.46][index] * (1 - transformation * 0.26)
    })
    cageRefs.current.forEach((brace, index) => {
      if (!brace) return
      const close = smoothstep(3.75 + index * 0.08, 4.6 + index * 0.08, time)
      const axis = index < 2 ? 'x' : 'z'
      const sign = index % 2 ? 1 : -1
      brace.position[axis] = sign * THREE.MathUtils.lerp(1.15, 0.77, close)
    })
    coreNodeRefs.current.forEach((node, index) => {
      if (!node) return
      const pulse = coreActivation * (0.76 + Math.sin(elapsed * 3.1 + index) * 0.22)
      node.scale.setScalar(0.6 + pulse * 0.72)
    })
    if (coreMaterialRef.current) {
      coreMaterialRef.current.color.copy(teal).lerp(orange, transformation)
      coreMaterialRef.current.emissive.copy(teal).lerp(orange, transformation)
      coreMaterialRef.current.emissiveIntensity = 0.35 + coreActivation * 0.72 + transformation * 0.38
    }

    if (coreParticlesRef.current) {
      for (let index = 0; index < 42; index += 1) {
        const angle = index * 2.399 + (runtime.running && isAI ? elapsed * (0.34 + coreActivation * 0.58) : 0.6)
        const layer = (index % 7) - 3
        const spread = THREE.MathUtils.lerp(1.02, 0.5, transformation)
        const radius = spread * (0.68 + (index % 5) * 0.065)
        dummy.position.set(
          CORE_POSITION.x + Math.cos(angle) * radius,
          0.84 + layer * 0.15 * (1 - transformation * 0.38),
          CORE_POSITION.z + Math.sin(angle) * radius,
        )
        const particleReady = isAI ? smoothstep(1.2 + (index % 6) * 0.035, 2.3, time) * exitFactor : 0
        dummy.scale.setScalar(Math.max(0.001, particleReady * (index % 6 === 0 ? 0.95 : 0.55)))
        dummy.rotation.set(angle, angle * 0.7, 0)
        dummy.updateMatrix()
        coreParticlesRef.current.setMatrixAt(index, dummy.matrix)
      }
      coreParticlesRef.current.instanceMatrix.needsUpdate = true
    }

    const updatePackets = (mesh, curve, count, start, speed, scale, rotation = false) => {
      if (!mesh) return
      for (let index = 0; index < count; index += 1) {
        const progress = runtime.reducedMotion
          ? (index + 1) / (count + 1)
          : ((Math.max(0, time - start) * speed + index / count) % 1)
        curve.getPointAt(progress, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(isAI ? inputReveal * scale : 0.001)
        if (rotation) dummy.rotation.set(progress * 3, progress * 4, progress * 2)
        else dummy.rotation.set(0, 0, 0)
        dummy.updateMatrix()
        mesh.setMatrixAt(index, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }

    updatePackets(documentPacketsRef.current, DOCUMENT_CURVE, 5, 2.05, time < 4.5 ? 0.25 : 0.065, 0.78)
    updatePackets(dataPacketsRef.current, DATA_CURVE, 7, 2.16, time < 4.5 ? 0.3 : 0.07, 0.68, true)
    updatePackets(promptPacketsRef.current, PROMPT_CURVE, 4, 2.28, time < 4.5 ? 0.22 : 0.055, 0.82, true)

    if (insightPacketsRef.current) {
      for (let index = 0; index < 8; index += 1) {
        const progress = runtime.reducedMotion
          ? (index + 1) / 9
          : ((Math.max(0, time - 5.7) * (time < 8 ? 0.3 : 0.07) + index / 8) % 1)
        INSIGHT_CURVE.getPointAt(progress, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(isAI ? outputReveal * 0.7 : 0.001)
        dummy.rotation.set(progress * 4, progress * 2, 0)
        dummy.updateMatrix()
        insightPacketsRef.current.setMatrixAt(index, dummy.matrix)
      }
      insightPacketsRef.current.instanceMatrix.needsUpdate = true
    }

    const insightReady = smoothstep(6.55, 7.55, time)
    insightPartRefs.current.forEach((part, index) => {
      if (!part) return
      const ready = easeOutCubic(smoothstep(6.1 + index * 0.18, 6.95 + index * 0.2, time))
      part.position.x = [0, -0.45, 0.57][index] + (1 - ready) * (index === 1 ? -0.72 : 0.65)
      part.position.z = 0.065 + (1 - ready) * (0.55 + index * 0.14)
      part.scale.setScalar(Math.max(0.001, ready))
    })
    evidenceRefs.current.forEach((bar, index) => {
      if (!bar) return
      const ready = smoothstep(index * 0.1, 0.62 + index * 0.09, insightReady)
      bar.scale.y = damp(bar.scale.y, Math.max(0.05, [0.46, 0.7, 0.58, 0.92][index] * ready), 7, delta)
      bar.position.y = -0.25 + bar.scale.y * 0.14
    })
    if (insightFillRef.current) {
      insightFillRef.current.scale.x = damp(insightFillRef.current.scale.x, Math.max(0.02, insightReady * 0.88), 6, delta)
      insightFillRef.current.position.x = -0.24 + insightFillRef.current.scale.x * 0.24
    }
    if (insightMaterialRef.current) insightMaterialRef.current.emissiveIntensity = 0.05 + insightReady * 0.32

    const reviewProgress = smoothstep(8.35, 9.18, time)
    if (resultArtifactRef.current) {
      const position = time < 8.35
        ? new THREE.Vector3(2.12, 0.1, 0.28)
        : REVIEW_CURVE.getPointAt(reviewProgress, point)
      resultArtifactRef.current.position.copy(position)
      resultArtifactRef.current.rotation.x = runtime.running && isAI ? elapsed * 0.6 : 0.35
      resultArtifactRef.current.rotation.y = runtime.running && isAI ? elapsed * 0.78 : 0.6
      resultArtifactRef.current.scale.setScalar(Math.max(0.001, reviewReveal * (0.72 + reviewProgress * 0.25)))
    }
    if (resultArtifactMaterialRef.current) {
      resultArtifactMaterialRef.current.color.copy(orange).lerp(teal, reviewProgress)
      resultArtifactMaterialRef.current.emissive.copy(orange).lerp(teal, reviewProgress)
    }
    if (checkRef.current) checkRef.current.scale.setScalar(Math.max(0.001, easeOutCubic(reviewProgress)))
    if (approvalMaterialRef.current) approvalMaterialRef.current.emissiveIntensity = 0.05 + reviewProgress * 0.72
    if (reviewHaloRef.current) {
      reviewHaloRef.current.rotation.z = runtime.running && isAI ? elapsed * (0.18 + reviewProgress * 0.58) : 0.4
      reviewHaloRef.current.scale.setScalar(0.82 + reviewProgress * 0.24)
    }
  })

  return (
    <>
      <AISolutionsCamera lifecycleRef={lifecycleRef} />
      <group ref={rootRef} scale={0.001}>
        <group ref={(node) => { moduleRefs.current[0] = node }}><DocumentSource sheetRefs={sheetRefs} /></group>
        <group ref={(node) => { moduleRefs.current[1] = node }}><DataSource cellRefs={dataCellRefs} /></group>
        <group ref={(node) => { moduleRefs.current[2] = node }}><PromptSource cursorMaterialRef={cursorMaterialRef} /></group>
        <group ref={(node) => { moduleRefs.current[3] = node }}>
          <ReasoningCore
            cageRefs={cageRefs}
            coreMaterialRef={coreMaterialRef}
            nodeRefs={coreNodeRefs}
            plateRefs={plateRefs}
          />
        </group>
        <group ref={(node) => { moduleRefs.current[4] = node }}>
          <InsightPanel
            evidenceRefs={evidenceRefs}
            fillRef={insightFillRef}
            panelMaterialRef={insightMaterialRef}
            partRefs={insightPartRefs}
          />
        </group>
        <group ref={(node) => { moduleRefs.current[5] = node }}>
          <HumanReview
            approvalMaterialRef={approvalMaterialRef}
            checkRef={checkRef}
            haloRef={reviewHaloRef}
          />
        </group>

        <group ref={inputRoutesRef} scale={0.001}>
          <Route curve={DOCUMENT_CURVE} color={SCENE_COLORS.warmWhite} radius={0.012} opacity={0.62} />
          <Route curve={DATA_CURVE} color={SCENE_COLORS.blue} />
          <Route curve={PROMPT_CURVE} color={SCENE_COLORS.orange} radius={0.015} opacity={0.84} />
        </group>
        <group ref={outputRouteRef} scale={0.001}>
          <Route curve={INSIGHT_CURVE} color={SCENE_COLORS.teal} radius={0.017} opacity={0.9} />
        </group>
        <group ref={reviewRouteRef} scale={0.001}>
          <Route curve={REVIEW_CURVE} color={SCENE_COLORS.orange} radius={0.014} opacity={0.84} />
        </group>

        <instancedMesh ref={documentPacketsRef} args={[null, null, 5]} frustumCulled={false}>
          <boxGeometry args={[0.12, 0.16, 0.025]} />
          <meshBasicMaterial color={SCENE_COLORS.warmWhite} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={dataPacketsRef} args={[null, null, 7]} frustumCulled={false}>
          <boxGeometry args={[0.075, 0.075, 0.075]} />
          <meshBasicMaterial color={SCENE_COLORS.blue} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={promptPacketsRef} args={[null, null, 4]} frustumCulled={false}>
          <octahedronGeometry args={[0.075, 0]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={insightPacketsRef} args={[null, null, 8]} frustumCulled={false}>
          <tetrahedronGeometry args={[0.065, 0]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={coreParticlesRef} args={[null, null, 42]} frustumCulled={false}>
          <octahedronGeometry args={[0.045, 0]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} transparent opacity={0.82} toneMapped={false} />
        </instancedMesh>

        <group ref={resultArtifactRef} scale={0.001}>
          <mesh castShadow>
            <dodecahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              ref={resultArtifactMaterialRef}
              color={SCENE_COLORS.orange}
              emissive={SCENE_COLORS.orange}
              emissiveIntensity={1.25}
              metalness={0.42}
              roughness={0.14}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[1.1, 0.2, 0.4]}>
            <torusGeometry args={[0.27, 0.012, 8, 48]} />
            <meshBasicMaterial color={SCENE_COLORS.cyan} transparent opacity={0.72} toneMapped={false} />
          </mesh>
        </group>

        <mesh position={[-0.1, -1.76, -0.28]} receiveShadow>
          <boxGeometry args={[6.8, 0.07, 3.6]} />
          <meshStandardMaterial color="#05131b" metalness={0.5} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        <Sparkles
          count={runtime.quality === 'high' ? 34 : 14}
          color={SCENE_COLORS.blue}
          opacity={0.2}
          scale={[7.3, 4.7, 4.5]}
          size={runtime.quality === 'high' ? 1.05 : 0.75}
          speed={runtime.running && !runtime.reducedMotion ? 0.09 : 0}
          noise={0.62}
        />
      </group>
    </>
  )
}

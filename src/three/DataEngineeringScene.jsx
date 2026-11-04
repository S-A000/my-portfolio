import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS, SCENE_MATERIALS } from './sceneTheme'
import { SCENE_PHASES, easeInCubic, easeOutCubic } from './useSceneTransition'

const STAGES = Object.freeze([
  { assembled: [-2.72, -0.72, 1.02], exploded: [-5.2, 1.45, 3.6], start: 0, end: 0.88 },
  { assembled: [-1.52, -0.42, 0.52], exploded: [-3.8, 2.35, 2.25], start: 0.28, end: 1.28 },
  { assembled: [-0.28, -0.24, 0.08], exploded: [-0.7, 3.2, -2.6], start: 0.68, end: 1.72 },
  { assembled: [1.14, -0.52, -0.68], exploded: [3.15, 2.4, -3.35], start: 1.02, end: 2.06 },
  { assembled: [2.58, -0.24, -0.72], exploded: [5.15, 1.65, -2.25], start: 1.34, end: 2.38 },
])

const SOURCE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-2.35, -0.32, 0.95),
  new THREE.Vector3(-2.05, -0.12, 0.8),
  new THREE.Vector3(-1.56, -0.07, 0.54),
  new THREE.Vector3(-0.92, 0.04, 0.3),
  new THREE.Vector3(-0.46, 0.02, 0.12),
])

const STORAGE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.06, -0.02, 0.02),
  new THREE.Vector3(0.38, -0.04, -0.1),
  new THREE.Vector3(0.78, -0.2, -0.42),
  new THREE.Vector3(1.12, -0.16, -0.67),
])

const DASHBOARD_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.2, -0.14, -0.67),
  new THREE.Vector3(1.63, 0.02, -0.83),
  new THREE.Vector3(2.08, 0.16, -0.79),
  new THREE.Vector3(2.48, 0.18, -0.68),
])

const HUB_STARTS = Object.freeze([
  [-0.38, 0.32, -0.28], [-0.02, 0.22, -0.36], [0.3, 0.08, -0.24],
  [0.36, -0.24, -0.04], [0.18, -0.34, 0.28], [-0.2, -0.28, 0.36],
  [-0.4, -0.04, 0.2], [-0.3, 0.28, 0.08], [0.02, 0.38, 0.22],
  [0.34, 0.22, 0.12], [0.08, -0.02, -0.08], [-0.12, 0.06, 0.32],
])

const HUB_GRID = Object.freeze(Array.from({ length: 12 }, (_, index) => [
  (index % 4 - 1.5) * 0.19,
  (Math.floor(index / 4) - 1) * 0.19,
  0.18,
]))

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const smoothstep = (start, end, value) => {
  const normalized = clamp01((value - start) / Math.max(end - start, 0.0001))
  return normalized * normalized * (3 - 2 * normalized)
}
const damp = (current, target, speed, delta) => THREE.MathUtils.damp(current, target, speed, delta)

function lifecycleTime(lifecycle, reducedMotion) {
  if (reducedMotion) return 10
  if (lifecycle.phase === SCENE_PHASES.INTRO) return lifecycle.progress * 0.9
  if (lifecycle.phase === SCENE_PHASES.ACTIVE) return 0.9 + lifecycle.progress * 0.25
  if (lifecycle.phase === SCENE_PHASES.IDLE) return 1.15 + lifecycle.idleTime
  return 10
}

function Platform({ args, children }) {
  return (
    <group>
      <RoundedBox args={args} radius={0.11} smoothness={4} receiveShadow castShadow>
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.3} />
        <Edges color={SCENE_COLORS.blue} transparent opacity={0.24} />
      </RoundedBox>
      <mesh position={[0, -args[1] * 0.64, 0]} receiveShadow>
        <boxGeometry args={[args[0] * 0.86, args[1] * 0.28, args[2] * 0.84]} />
        <meshStandardMaterial color={SCENE_COLORS.navy} metalness={0.68} roughness={0.36} />
      </mesh>
      {children}
    </group>
  )
}

function SourceDevices() {
  return (
    <Platform args={[1.62, 0.18, 1.28]}>
      <group position={[-0.35, 0.38, 0.04]} rotation={[0, 0.28, 0]}>
        <RoundedBox args={[0.78, 0.52, 0.08]} radius={0.045} smoothness={3} castShadow>
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
          <Edges color={SCENE_COLORS.cyan} transparent opacity={0.42} />
        </RoundedBox>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.62, 0.36]} />
          <meshBasicMaterial color="#0b5365" />
        </mesh>
        <mesh position={[0.12, 0.02, 0.052]}>
          <planeGeometry args={[0.3, 0.018]} />
          <meshBasicMaterial color={SCENE_COLORS.teal} toneMapped={false} />
        </mesh>
        <mesh position={[0.04, -0.08, 0.053]}>
          <planeGeometry args={[0.46, 0.012]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.31, 0.17]} rotation={[-0.68, 0, 0]} castShadow>
          <boxGeometry args={[0.88, 0.08, 0.46]} />
          <meshStandardMaterial color="#123746" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0.5, 0.31, 0.26]} rotation={[0.04, -0.2, -0.04]}>
        <RoundedBox args={[0.3, 0.62, 0.07]} radius={0.065} smoothness={4} castShadow>
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
          <Edges color={SCENE_COLORS.orange} transparent opacity={0.44} />
        </RoundedBox>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.22, 0.45]} />
          <meshBasicMaterial color="#0b4253" />
        </mesh>
        {[0.12, 0.02, -0.08].map((y, index) => (
          <mesh key={y} position={[0.015, y, 0.045]}>
            <planeGeometry args={[0.14 + index * 0.025, 0.012]} />
            <meshBasicMaterial color={index === 1 ? SCENE_COLORS.orange : SCENE_COLORS.cyan} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <group position={[0.47, 0.24, -0.34]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.21, 0.38, 20]} />
          <meshStandardMaterial color="#0d3444" metalness={0.78} roughness={0.24} />
        </mesh>
        <mesh position={[0, 0.23, 0]}>
          <sphereGeometry args={[0.07, 18, 18]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.37, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 10]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} />
        </mesh>
      </group>
    </Platform>
  )
}

function IngestionNodes({ nodeRefs }) {
  return (
    <Platform args={[1.04, 0.16, 0.94]}>
      <group position={[0, 0.2, 0]}>
        {[-0.3, 0, 0.3].map((x, index) => (
          <group key={x} ref={(node) => { nodeRefs.current[index] = node }} position={[x, index === 1 ? 0.16 : 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.15, 0.22, 0.34, 8]} />
              <meshPhysicalMaterial
                color={index === 1 ? SCENE_COLORS.panel : SCENE_COLORS.deepNavy}
                metalness={0.68}
                roughness={0.26}
                clearcoat={0.7}
              />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <torusGeometry args={[0.12, 0.018, 8, 28]} />
              <meshBasicMaterial color={index === 1 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </Platform>
  )
}

function TransformationHub({ ringRefs }) {
  return (
    <Platform args={[1.3, 0.18, 1.2]}>
      <group position={[0, 0.59, 0]}>
        <RoundedBox args={[0.98, 1.02, 0.92]} radius={0.12} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#164e5d"
            metalness={0.18}
            roughness={0.12}
            transmission={0.28}
            thickness={0.85}
            transparent
            opacity={0.66}
          />
          <Edges color={SCENE_COLORS.cyan} transparent opacity={0.82} />
        </RoundedBox>
        <mesh ref={(node) => { ringRefs.current[0] = node }} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.025, 10, 64]} />
          <meshBasicMaterial color={SCENE_COLORS.teal} toneMapped={false} />
        </mesh>
        <mesh ref={(node) => { ringRefs.current[1] = node }} rotation={[0.2, Math.PI / 2, 0.3]}>
          <torusGeometry args={[0.26, 0.019, 10, 56]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </mesh>
      </group>
    </Platform>
  )
}

function StorageModules({ glowRefs }) {
  return (
    <Platform args={[1.42, 0.18, 1.18]}>
      <group position={[0, 0.18, 0]}>
        {[-0.38, 0, 0.38].map((x, index) => (
          <group key={x} position={[x, index === 1 ? 0.13 : 0, index === 1 ? -0.12 : 0.08]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.52, 28]} />
              <meshPhysicalMaterial {...SCENE_MATERIALS.panel} roughness={0.2} />
            </mesh>
            {[-0.16, 0, 0.16].map((y) => (
              <mesh key={y} position={[0, y, 0]}>
                <torusGeometry args={[0.255, 0.018, 8, 36]} />
                <meshBasicMaterial
                  ref={(node) => { if (y === 0) glowRefs.current[index] = node }}
                  color={index === 1 ? SCENE_COLORS.orange : SCENE_COLORS.teal}
                  transparent
                  opacity={0.28}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Platform>
  )
}

function AnalyticsDashboard({ barRefs, screenMaterialRef }) {
  return (
    <Platform args={[1.55, 0.18, 1.06]}>
      <group position={[0, 0.58, 0]} rotation={[0, -0.17, 0]}>
        <RoundedBox args={[1.18, 0.78, 0.09]} radius={0.07} smoothness={4} castShadow>
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
          <Edges color={SCENE_COLORS.cyan} transparent opacity={0.48} />
        </RoundedBox>
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[1.02, 0.62]} />
          <meshStandardMaterial
            ref={screenMaterialRef}
            color="#071d28"
            emissive={SCENE_COLORS.teal}
            emissiveIntensity={0.04}
          />
        </mesh>
        {[-0.34, -0.12, 0.1, 0.32].map((x, index) => (
          <mesh
            key={x}
            ref={(node) => { barRefs.current[index] = node }}
            position={[x, -0.15, 0.062]}
          >
            <boxGeometry args={[0.11, 0.42, 0.018]} />
            <meshBasicMaterial color={index === 3 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, 0.2, 0.063]}>
          <planeGeometry args={[0.78, 0.014]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} transparent opacity={0.58} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.52, -0.04]}>
          <cylinderGeometry args={[0.06, 0.06, 0.38, 16]} />
          <meshStandardMaterial color={SCENE_COLORS.panel} metalness={0.82} roughness={0.24} />
        </mesh>
      </group>
    </Platform>
  )
}

function Route({ curve, color, opacity = 0.72 }) {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.038, 8, false]} />
        <meshStandardMaterial color="#092733" metalness={0.56} roughness={0.3} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.012, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  )
}

function DataCameraRig({ lifecycleRef }) {
  const { camera, size } = useThree()
  const runtime = useSceneRuntime()
  const targetRef = useRef(new THREE.Vector3(0, -0.18, 0))
  const desiredPosition = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const lifecycle = lifecycleRef.current
    const aspect = size.width / Math.max(size.height, 1)
    const isData = lifecycle.currentKey === 'data-engineering'
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const closeIn = smoothstep(2.55, 3.55, time)
    const returnToWide = smoothstep(4.75, 6.15, time)
    const closeAmount = runtime.reducedMotion ? 0 : closeIn * (1 - returnToWide)
    const exitPullback = lifecycle.phase === SCENE_PHASES.EXIT && isData
      ? easeInCubic(lifecycle.progress)
      : 0

    const portrait = aspect < 0.82
    const genericPosition = portrait
      ? new THREE.Vector3(0.28, 0.72, 10.8)
      : new THREE.Vector3(0.62, 0.46, 8.35)
    const widePosition = portrait
      ? new THREE.Vector3(4.45, 4.2, 10.7)
      : new THREE.Vector3(4.7, 3.35, 7.8)
    const closePosition = portrait
      ? new THREE.Vector3(1.25, 1.75, 6.4)
      : new THREE.Vector3(1.1, 1.18, 3.85)
    const wideTarget = portrait
      ? new THREE.Vector3(0, -0.28, 0.02)
      : new THREE.Vector3(0.02, -0.34, 0.02)
    const closeTarget = new THREE.Vector3(-0.28, 0.12, 0.08)

    if (isData) {
      desiredPosition.current.copy(widePosition).lerp(closePosition, closeAmount)
      desiredPosition.current.z += exitPullback * 2.2
      desiredTarget.current.copy(wideTarget).lerp(closeTarget, closeAmount)
    } else {
      desiredPosition.current.copy(genericPosition)
      desiredTarget.current.set(0, -0.08, 0)
    }

    const speed = runtime.reducedMotion ? 20 : 3.4
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

export default function DataEngineeringScene({ lifecycleRef }) {
  const runtime = useSceneRuntime()
  const rootRef = useRef(null)
  const stageRefs = useRef([])
  const ingestionNodeRefs = useRef([])
  const hubRingRefs = useRef([])
  const storageGlowRefs = useRef([])
  const dashboardBarRefs = useRef([])
  const dashboardScreenRef = useRef(null)
  const routeGroupRef = useRef(null)
  const sourcePacketsRef = useRef(null)
  const storagePacketsRef = useRef(null)
  const dashboardPacketsRef = useRef(null)
  const hubPacketsRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const processedColor = useMemo(() => new THREE.Color(SCENE_COLORS.orange), [])
  const packetPoint = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }, delta) => {
    const lifecycle = lifecycleRef.current
    const isData = lifecycle.currentKey === 'data-engineering'
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const exitFactor = lifecycle.phase === SCENE_PHASES.EXIT && isData
      ? 1 - easeInCubic(lifecycle.progress)
      : 1
    const rootTarget = isData ? exitFactor : 0
    const elapsed = clock.getElapsedTime()

    if (rootRef.current) {
      const currentScale = rootRef.current.scale.x
      const targetScale = Math.max(0.001, rootTarget)
      rootRef.current.scale.setScalar(damp(currentScale, targetScale, 7.5, delta))
      rootRef.current.position.y = damp(
        rootRef.current.position.y,
        isData && runtime.running && !runtime.reducedMotion ? Math.sin(elapsed * 0.38) * 0.025 : 0,
        4,
        delta,
      )
    }

    STAGES.forEach((stage, index) => {
      const node = stageRefs.current[index]
      if (!node) return
      let assembly = easeOutCubic(smoothstep(stage.start, stage.end, time)) * exitFactor
      if (!isData) assembly = 0
      node.position.set(
        THREE.MathUtils.lerp(stage.exploded[0], stage.assembled[0], assembly),
        THREE.MathUtils.lerp(stage.exploded[1], stage.assembled[1], assembly),
        THREE.MathUtils.lerp(stage.exploded[2], stage.assembled[2], assembly),
      )
      node.rotation.set(
        (1 - assembly) * (0.38 - index * 0.1),
        (1 - assembly) * (index % 2 ? -0.78 : 0.78),
        (1 - assembly) * (index - 2) * 0.11,
      )
    })

    ingestionNodeRefs.current.forEach((node, index) => {
      if (node) node.rotation.y = runtime.running && isData ? elapsed * (index === 1 ? -0.65 : 0.48) : 0
    })
    if (hubRingRefs.current[0]) hubRingRefs.current[0].rotation.z = runtime.running && isData ? elapsed * 0.72 : 0.4
    if (hubRingRefs.current[1]) hubRingRefs.current[1].rotation.x = runtime.running && isData ? elapsed * -0.58 : -0.3

    const flowReady = smoothstep(1.75, 2.45, time) * exitFactor
    const transformation = smoothstep(3.05, 4.35, time)
    const storageReady = smoothstep(4.0, 5.0, time) * exitFactor
    const dashboardReady = smoothstep(5.05, 6.05, time) * exitFactor
    const activeFlow = isData && flowReady > 0.01
    const ambientFlow = time < 7.2 ? Math.max(0, time - 1.8) : 5.4 + (time - 7.2) * 0.28

    if (routeGroupRef.current) {
      const routeReveal = isData ? smoothstep(1.18, 2.3, time) * exitFactor : 0
      routeGroupRef.current.scale.setScalar(damp(routeGroupRef.current.scale.x, Math.max(0.001, routeReveal), 7, delta))
    }

    const updatePackets = (mesh, curve, count, speed, readiness, scale, offset = 0) => {
      if (!mesh) return
      for (let index = 0; index < count; index += 1) {
        const progress = runtime.reducedMotion
          ? (index + 1) / (count + 1)
          : ((ambientFlow * speed + index / count + offset) % 1)
        curve.getPointAt(progress, packetPoint)
        dummy.position.copy(packetPoint)
        dummy.scale.setScalar(activeFlow ? scale * readiness : 0.001)
        dummy.rotation.set(progress * 4, progress * 5, 0)
        dummy.updateMatrix()
        mesh.setMatrixAt(index, dummy.matrix)
      }
      mesh.instanceMatrix.needsUpdate = true
    }

    updatePackets(sourcePacketsRef.current, SOURCE_CURVE, 8, 0.24, flowReady, 1)
    updatePackets(storagePacketsRef.current, STORAGE_CURVE, 6, 0.2, storageReady, 0.9, 0.2)
    updatePackets(dashboardPacketsRef.current, DASHBOARD_CURVE, 5, 0.17, dashboardReady, 0.82, 0.46)

    if (hubPacketsRef.current) {
      HUB_STARTS.forEach((start, index) => {
        const target = HUB_GRID[index]
        const localTransform = smoothstep(index * 0.025, 0.72 + index * 0.018, transformation)
        dummy.position.set(
          THREE.MathUtils.lerp(start[0], target[0], localTransform) - 0.28,
          THREE.MathUtils.lerp(start[1], target[1], localTransform) + 0.36,
          THREE.MathUtils.lerp(start[2], target[2], localTransform) + 0.08,
        )
        dummy.rotation.set(
          (1 - localTransform) * elapsed * 0.7,
          (1 - localTransform) * elapsed * 0.5,
          localTransform * Math.PI * 0.5,
        )
        dummy.scale.setScalar(isData ? 0.72 + localTransform * 0.28 : 0.001)
        dummy.updateMatrix()
        hubPacketsRef.current.setMatrixAt(index, dummy.matrix)
        color.set(SCENE_COLORS.teal).lerp(processedColor, localTransform)
        hubPacketsRef.current.setColorAt(index, color)
      })
      hubPacketsRef.current.instanceMatrix.needsUpdate = true
      if (hubPacketsRef.current.instanceColor) hubPacketsRef.current.instanceColor.needsUpdate = true
    }

    storageGlowRefs.current.forEach((material, index) => {
      if (!material) return
      material.opacity = 0.24 + storageReady * (0.52 + Math.sin(elapsed * 1.6 + index) * 0.08)
    })

    dashboardBarRefs.current.forEach((bar, index) => {
      if (!bar) return
      const barReady = smoothstep(index * 0.1, 0.62 + index * 0.08, dashboardReady)
      const targetHeight = [0.48, 0.72, 0.58, 0.94][index] * Math.max(0.04, barReady)
      bar.scale.y = damp(bar.scale.y, targetHeight, 6, delta)
      bar.position.y = -0.34 + 0.21 * bar.scale.y
    })
    if (dashboardScreenRef.current) {
      dashboardScreenRef.current.emissiveIntensity = 0.04 + dashboardReady * 0.38
    }
  })

  return (
    <>
      <DataCameraRig lifecycleRef={lifecycleRef} />
      <group ref={rootRef} scale={0.001}>
        <group ref={(node) => { stageRefs.current[0] = node }}>
          <SourceDevices />
        </group>
        <group ref={(node) => { stageRefs.current[1] = node }}>
          <IngestionNodes nodeRefs={ingestionNodeRefs} />
        </group>
        <group ref={(node) => { stageRefs.current[2] = node }}>
          <TransformationHub ringRefs={hubRingRefs} />
        </group>
        <group ref={(node) => { stageRefs.current[3] = node }}>
          <StorageModules glowRefs={storageGlowRefs} />
        </group>
        <group ref={(node) => { stageRefs.current[4] = node }}>
          <AnalyticsDashboard barRefs={dashboardBarRefs} screenMaterialRef={dashboardScreenRef} />
        </group>

        <group ref={routeGroupRef} position={[0, 0.02, 0]} scale={0.001}>
          <Route curve={SOURCE_CURVE} color={SCENE_COLORS.teal} opacity={0.78} />
          <Route curve={STORAGE_CURVE} color={SCENE_COLORS.orange} opacity={0.82} />
          <Route curve={DASHBOARD_CURVE} color={SCENE_COLORS.teal} opacity={0.72} />
        </group>

        <instancedMesh ref={sourcePacketsRef} args={[null, null, 8]} frustumCulled={false}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color={SCENE_COLORS.teal} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={storagePacketsRef} args={[null, null, 6]} frustumCulled={false}>
          <boxGeometry args={[0.09, 0.09, 0.09]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={dashboardPacketsRef} args={[null, null, 5]} frustumCulled={false}>
          <boxGeometry args={[0.075, 0.075, 0.075]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={hubPacketsRef} args={[null, null, 12]} frustumCulled={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial vertexColors metalness={0.28} roughness={0.18} emissive="#0a3037" emissiveIntensity={0.6} />
        </instancedMesh>

        <Sparkles
          count={runtime.quality === 'high' ? 34 : 14}
          color={SCENE_COLORS.cyan}
          opacity={0.24}
          scale={[7.2, 4, 4.6]}
          size={runtime.quality === 'high' ? 1.1 : 0.8}
          speed={runtime.running && !runtime.reducedMotion ? 0.12 : 0}
          noise={0.62}
        />
      </group>
    </>
  )
}

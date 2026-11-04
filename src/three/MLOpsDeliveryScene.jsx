import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS, SCENE_MATERIALS } from './sceneTheme'
import { SCENE_PHASES, easeInCubic, easeOutCubic } from './useSceneTransition'

const STAGES = Object.freeze([
  { assembled: [-2.72, -0.72, 0.72], exploded: [-5.1, 1.35, 3.35], start: 0, end: 0.8 },
  { assembled: [-1.48, -0.43, 0.12], exploded: [-3.45, 2.8, -1.8], start: 0.26, end: 1.2 },
  { assembled: [-0.04, -0.14, -0.34], exploded: [-0.6, 3.5, -3.2], start: 0.58, end: 1.58 },
  { assembled: [1.42, -0.38, -0.06], exploded: [3.65, 2.65, -2.3], start: 0.9, end: 1.94 },
  { assembled: [2.7, -0.66, 0.64], exploded: [5.2, 1.25, 3.15], start: 1.22, end: 2.3 },
])

const MODEL_POINTS = Object.freeze({
  features: new THREE.Vector3(-2.72, -0.06, 0.72),
  training: new THREE.Vector3(-1.48, 0.28, 0.12),
  evaluation: new THREE.Vector3(-0.04, 0.5, -0.34),
  deployment: new THREE.Vector3(1.42, 0.3, -0.06),
  monitoring: new THREE.Vector3(2.7, 0.02, 0.64),
})

const FEATURE_TRAINING = new THREE.CatmullRomCurve3([
  MODEL_POINTS.features,
  new THREE.Vector3(-2.35, 0.05, 0.52),
  new THREE.Vector3(-1.92, 0.18, 0.26),
  MODEL_POINTS.training,
])
const TRAINING_EVALUATION = new THREE.CatmullRomCurve3([
  MODEL_POINTS.training,
  new THREE.Vector3(-1.05, 0.42, -0.06),
  new THREE.Vector3(-0.52, 0.55, -0.27),
  MODEL_POINTS.evaluation,
])
const EVALUATION_DEPLOYMENT = new THREE.CatmullRomCurve3([
  MODEL_POINTS.evaluation,
  new THREE.Vector3(0.42, 0.52, -0.34),
  new THREE.Vector3(0.98, 0.38, -0.18),
  MODEL_POINTS.deployment,
])
const DEPLOYMENT_MONITORING = new THREE.CatmullRomCurve3([
  MODEL_POINTS.deployment,
  new THREE.Vector3(1.83, 0.22, 0.1),
  new THREE.Vector3(2.28, 0.08, 0.38),
  MODEL_POINTS.monitoring,
])
const DELIVERY_CURVE = new THREE.CatmullRomCurve3([
  MODEL_POINTS.features,
  MODEL_POINTS.training,
  MODEL_POINTS.evaluation,
  MODEL_POINTS.deployment,
  MODEL_POINTS.monitoring,
])
const FEEDBACK_CURVE = new THREE.CatmullRomCurve3([
  MODEL_POINTS.monitoring,
  new THREE.Vector3(2.25, 1.3, 0.9),
  new THREE.Vector3(1.12, 1.76, 0.62),
  new THREE.Vector3(-0.25, 1.68, 0.2),
  new THREE.Vector3(-1.18, 0.8, 0.06),
  MODEL_POINTS.training,
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

function ModulePlatform({ args = [1.2, 0.16, 1], children, accent = SCENE_COLORS.blue }) {
  return (
    <group>
      <RoundedBox args={args} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.28} />
        <Edges color={accent} transparent opacity={0.34} />
      </RoundedBox>
      <mesh position={[0, -args[1] * 0.68, 0]} receiveShadow>
        <boxGeometry args={[args[0] * 0.84, args[1] * 0.28, args[2] * 0.84]} />
        <meshStandardMaterial color={SCENE_COLORS.navy} metalness={0.72} roughness={0.35} />
      </mesh>
      <mesh position={[0, args[1] * 0.56, args[2] * 0.38]}>
        <boxGeometry args={[args[0] * 0.66, 0.018, 0.018]} />
        <meshBasicMaterial color={accent} transparent opacity={0.58} toneMapped={false} />
      </mesh>
      {children}
    </group>
  )
}

function FeatureBank({ waferRefs }) {
  return (
    <ModulePlatform args={[1.28, 0.17, 1.08]} accent={SCENE_COLORS.teal}>
      <group position={[0, 0.22, 0]}>
        {[-0.32, 0, 0.32].map((x, column) => (
          <group key={x} position={[x, column === 1 ? 0.12 : 0, 0]}>
            {[0, 0.12, 0.24].map((y, layer) => (
              <mesh
                key={y}
                ref={(node) => { if (layer === 2) waferRefs.current[column] = node }}
                position={[0, y, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.2, 0.2, 0.065, 6]} />
                <meshPhysicalMaterial
                  color={column === 1 ? '#155267' : SCENE_COLORS.panel}
                  metalness={0.66}
                  roughness={0.24}
                  clearcoat={0.55}
                />
              </mesh>
            ))}
            <mesh position={[0, 0.29, 0]}>
              <circleGeometry args={[0.105, 6]} />
              <meshBasicMaterial color={column === 1 ? SCENE_COLORS.orange : SCENE_COLORS.cyan} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </ModulePlatform>
  )
}

function TrainingForge({ ringRefs, lightRefs }) {
  return (
    <ModulePlatform args={[1.36, 0.18, 1.18]} accent={SCENE_COLORS.blue}>
      <group position={[0, 0.54, 0]}>
        {[-0.43, 0.43].map((x, index) => (
          <group key={x} position={[x, 0, 0]}>
            <RoundedBox args={[0.28, 0.88, 0.42]} radius={0.055} smoothness={3} castShadow>
              <meshPhysicalMaterial {...SCENE_MATERIALS.panel} roughness={0.22} />
              <Edges color={SCENE_COLORS.blue} transparent opacity={0.42} />
            </RoundedBox>
            {[-0.27, 0, 0.27].map((y, lightIndex) => (
              <mesh key={y} position={[0, y, 0.222]}>
                <circleGeometry args={[0.034, 14]} />
                <meshBasicMaterial
                  ref={(node) => { lightRefs.current[index * 3 + lightIndex] = node }}
                  color={lightIndex === 1 ? SCENE_COLORS.orange : SCENE_COLORS.teal}
                  transparent
                  opacity={0.28}
                  toneMapped={false}
                />
              </mesh>
            ))}
          </group>
        ))}
        <mesh ref={(node) => { ringRefs.current[0] = node }} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.29, 0.026, 10, 64]} />
          <meshBasicMaterial color={SCENE_COLORS.teal} toneMapped={false} />
        </mesh>
        <mesh ref={(node) => { ringRefs.current[1] = node }} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.21, 0.018, 10, 54]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </mesh>
      </group>
    </ModulePlatform>
  )
}

function EvaluationRegistry({ scannerRef, registryRefs }) {
  return (
    <ModulePlatform args={[1.48, 0.18, 1.16]} accent={SCENE_COLORS.orange}>
      <group position={[-0.23, 0.57, 0]}>
        <mesh position={[-0.38, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.98, 0.22]} />
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
        </mesh>
        <mesh position={[0.38, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.98, 0.22]} />
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
        </mesh>
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[0.82, 0.1, 0.22]} />
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
        </mesh>
        <mesh ref={scannerRef} position={[0, 0, 0.14]}>
          <planeGeometry args={[0.68, 0.045]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} transparent opacity={0.46} toneMapped={false} />
        </mesh>
      </group>
      <group position={[0.47, 0.42, -0.14]}>
        <RoundedBox args={[0.34, 0.72, 0.52]} radius={0.055} smoothness={3} castShadow>
          <meshPhysicalMaterial {...SCENE_MATERIALS.shell} />
          <Edges color={SCENE_COLORS.cyan} transparent opacity={0.38} />
        </RoundedBox>
        {[-0.2, 0, 0.2].map((y, index) => (
          <mesh key={y} position={[0, y, 0.272]}>
            <boxGeometry args={[0.22, 0.055, 0.018]} />
            <meshBasicMaterial
              ref={(node) => { registryRefs.current[index] = node }}
              color={index === 2 ? SCENE_COLORS.orange : SCENE_COLORS.teal}
              transparent
              opacity={0.22}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </ModulePlatform>
  )
}

function InferenceGateway({ gateRefs, endpointMaterialRef, outputRefs }) {
  return (
    <ModulePlatform args={[1.38, 0.18, 1.08]} accent={SCENE_COLORS.teal}>
      <group position={[0, 0.48, 0]}>
        {[-0.35, 0.35].map((x, index) => (
          <group key={x} ref={(node) => { gateRefs.current[index] = node }} position={[x, 0, 0]}>
            <RoundedBox args={[0.2, 0.82, 0.34]} radius={0.05} smoothness={3} castShadow>
              <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
              <Edges color={index ? SCENE_COLORS.orange : SCENE_COLORS.teal} transparent opacity={0.48} />
            </RoundedBox>
          </group>
        ))}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.22, 0.34, 16]} />
          <meshStandardMaterial
            ref={endpointMaterialRef}
            color={SCENE_COLORS.deepNavy}
            emissive={SCENE_COLORS.teal}
            emissiveIntensity={0.08}
            metalness={0.58}
            roughness={0.2}
          />
        </mesh>
        {[[-0.26, 0.02, 0.38], [0, 0.22, 0.42], [0.26, -0.02, 0.38]].map((position, index) => (
          <mesh key={position.join('-')} ref={(node) => { outputRefs.current[index] = node }} position={position}>
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshBasicMaterial color={index === 1 ? SCENE_COLORS.orange : SCENE_COLORS.cyan} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </ModulePlatform>
  )
}

function MonitoringStation({ radarRef, screenMaterialRef, barRefs }) {
  return (
    <ModulePlatform args={[1.34, 0.17, 1.12]} accent={SCENE_COLORS.orange}>
      <group position={[0, 0.46, -0.04]} rotation={[0, -0.32, 0]}>
        <RoundedBox args={[0.9, 0.58, 0.08]} radius={0.065} smoothness={4} castShadow>
          <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
          <Edges color={SCENE_COLORS.orange} transparent opacity={0.52} />
        </RoundedBox>
        <mesh position={[0, 0, 0.046]}>
          <planeGeometry args={[0.76, 0.44]} />
          <meshStandardMaterial
            ref={screenMaterialRef}
            color="#071d27"
            emissive={SCENE_COLORS.orange}
            emissiveIntensity={0.04}
          />
        </mesh>
        {[-0.26, -0.08, 0.1, 0.28].map((x, index) => (
          <mesh key={x} ref={(node) => { barRefs.current[index] = node }} position={[x, -0.12, 0.054]}>
            <boxGeometry args={[0.09, 0.28, 0.018]} />
            <meshBasicMaterial color={index === 3 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh ref={radarRef} position={[0.36, 0.68, -0.28]} rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[0.25, 0.018, 10, 64]} />
        <meshBasicMaterial color={SCENE_COLORS.teal} transparent opacity={0.7} toneMapped={false} />
      </mesh>
    </ModulePlatform>
  )
}

function Route({ curve, color, radius = 0.012, opacity = 0.72 }) {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 76, 0.038, 8, false]} />
        <meshStandardMaterial color="#092733" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 76, radius, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  )
}

function ModelArtifact({ artifactRef, coreMaterialRef, ringMaterialRef, ringRef, satelliteRefs }) {
  return (
    <group ref={artifactRef}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.2, 1]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color={SCENE_COLORS.teal}
          emissive={SCENE_COLORS.teal}
          emissiveIntensity={1.2}
          metalness={0.46}
          roughness={0.16}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[1.1, 0.2, 0.35]}>
        <torusGeometry args={[0.31, 0.014, 8, 48]} />
        <meshBasicMaterial
          ref={ringMaterialRef}
          color={SCENE_COLORS.cyan}
          transparent
          opacity={0.24}
          toneMapped={false}
        />
      </mesh>
      {[[0.33, 0, 0], [-0.16, 0.27, 0], [-0.16, -0.27, 0]].map((position, index) => (
        <mesh key={position.join('-')} ref={(node) => { satelliteRefs.current[index] = node }} position={position}>
          <sphereGeometry args={[0.038, 12, 12]} />
          <meshBasicMaterial color={index === 0 ? SCENE_COLORS.orange : SCENE_COLORS.cyan} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function MLOpsCameraRig({ lifecycleRef }) {
  const { camera, size } = useThree()
  const runtime = useSceneRuntime()
  const targetRef = useRef(new THREE.Vector3(0, -0.18, 0.06))
  const desiredPosition = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const positions = useMemo(() => ({
    wide: new THREE.Vector3(4.8, 3.25, 8.05),
    training: new THREE.Vector3(-0.12, 1.38, 4.15),
    delivery: new THREE.Vector3(3.75, 1.35, 4.55),
    portraitWide: new THREE.Vector3(4.4, 4.2, 10.9),
    portraitTraining: new THREE.Vector3(0.3, 2.05, 6.5),
    portraitDelivery: new THREE.Vector3(3.7, 2.05, 6.7),
    trainingTarget: new THREE.Vector3(-0.78, 0.14, -0.04),
    deliveryTarget: new THREE.Vector3(1.55, 0.08, 0.12),
  }), [])

  useFrame((_, delta) => {
    const lifecycle = lifecycleRef.current
    if (lifecycle.currentKey !== 'mlops') return
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const compact = size.width < 560 || size.width / Math.max(size.height, 1) < 0.82
    const wide = compact ? positions.portraitWide : positions.wide
    const training = compact ? positions.portraitTraining : positions.training
    const delivery = compact ? positions.portraitDelivery : positions.delivery
    const trainingWeight = runtime.reducedMotion
      ? 0
      : smoothstep(2.7, 3.65, time) * (1 - smoothstep(5.85, 6.75, time))
    const deliveryWeight = runtime.reducedMotion
      ? 0
      : smoothstep(6.1, 7.0, time) * (1 - smoothstep(9.1, 10.65, time))
    const exitPullback = lifecycle.phase === SCENE_PHASES.EXIT ? easeInCubic(lifecycle.progress) : 0

    desiredPosition.current.copy(wide).lerp(training, trainingWeight).lerp(delivery, deliveryWeight)
    desiredPosition.current.z += exitPullback * 2.1
    desiredTarget.current
      .set(0, -0.2, 0.06)
      .lerp(positions.trainingTarget, trainingWeight)
      .lerp(positions.deliveryTarget, deliveryWeight)

    const speed = runtime.reducedMotion ? 20 : 3.25
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

export default function MLOpsDeliveryScene({ lifecycleRef }) {
  const runtime = useSceneRuntime()
  const rootRef = useRef(null)
  const stageRefs = useRef([])
  const routeRef = useRef(null)
  const feedbackRef = useRef(null)
  const waferRefs = useRef([])
  const trainingRingRefs = useRef([])
  const trainingLightRefs = useRef([])
  const scannerRef = useRef(null)
  const registryRefs = useRef([])
  const gateRefs = useRef([])
  const endpointMaterialRef = useRef(null)
  const outputRefs = useRef([])
  const radarRef = useRef(null)
  const monitorScreenRef = useRef(null)
  const monitorBarRefs = useRef([])
  const artifactRef = useRef(null)
  const artifactCoreRef = useRef(null)
  const artifactRingMaterialRef = useRef(null)
  const artifactRingRef = useRef(null)
  const artifactSatelliteRefs = useRef([])
  const deliveryPacketsRef = useRef(null)
  const feedbackPacketsRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const point = useMemo(() => new THREE.Vector3(), [])
  const teal = useMemo(() => new THREE.Color(SCENE_COLORS.teal), [])
  const orange = useMemo(() => new THREE.Color(SCENE_COLORS.orange), [])

  useFrame(({ clock }, delta) => {
    const lifecycle = lifecycleRef.current
    const isMLOps = lifecycle.currentKey === 'mlops'
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const elapsed = clock.getElapsedTime()
    const exitFactor = lifecycle.phase === SCENE_PHASES.EXIT && isMLOps
      ? 1 - easeInCubic(lifecycle.progress)
      : 1
    const visible = isMLOps ? exitFactor : 0

    if (rootRef.current) {
      rootRef.current.scale.setScalar(damp(rootRef.current.scale.x, Math.max(0.001, visible), 7.5, delta))
      rootRef.current.position.y = damp(
        rootRef.current.position.y,
        isMLOps && runtime.running && !runtime.reducedMotion ? Math.sin(elapsed * 0.34) * 0.022 : 0,
        4,
        delta,
      )
    }

    STAGES.forEach((stage, index) => {
      const node = stageRefs.current[index]
      if (!node) return
      let assembly = easeOutCubic(smoothstep(stage.start, stage.end, time)) * exitFactor
      if (!isMLOps) assembly = 0
      node.position.set(
        THREE.MathUtils.lerp(stage.exploded[0], stage.assembled[0], assembly),
        THREE.MathUtils.lerp(stage.exploded[1], stage.assembled[1], assembly),
        THREE.MathUtils.lerp(stage.exploded[2], stage.assembled[2], assembly),
      )
      node.rotation.set(
        (1 - assembly) * (0.42 - index * 0.12),
        (1 - assembly) * (index % 2 ? -0.86 : 0.86),
        (1 - assembly) * (2 - index) * 0.12,
      )
    })

    const routeReveal = isMLOps ? smoothstep(1.12, 2.15, time) * exitFactor : 0
    if (routeRef.current) routeRef.current.scale.setScalar(damp(routeRef.current.scale.x, Math.max(0.001, routeReveal), 7, delta))

    const trainingCharge = smoothstep(3.25, 4.15, time) * (1 - smoothstep(4.65, 5.2, time))
    const evaluationState = smoothstep(5.45, 6.35, time)
    const deploymentState = smoothstep(7.05, 7.8, time)
    const monitoringState = smoothstep(8.05, 8.9, time)
    const feedbackState = smoothstep(8.8, 9.7, time) * exitFactor

    waferRefs.current.forEach((wafer, index) => {
      if (wafer) wafer.rotation.y = runtime.running && isMLOps ? elapsed * (0.28 + index * 0.08) : 0
    })
    if (trainingRingRefs.current[0]) trainingRingRefs.current[0].rotation.z = runtime.running && isMLOps ? elapsed * (0.7 + trainingCharge) : 0.35
    if (trainingRingRefs.current[1]) trainingRingRefs.current[1].rotation.x = runtime.running && isMLOps ? -elapsed * (0.52 + trainingCharge) : -0.3
    trainingLightRefs.current.forEach((material, index) => {
      if (material) material.opacity = 0.25 + trainingCharge * (0.55 + Math.sin(elapsed * 4 + index) * 0.12)
    })

    if (scannerRef.current) {
      scannerRef.current.position.y = evaluationState < 1
        ? THREE.MathUtils.lerp(-0.38, 0.38, (Math.sin(elapsed * 2.8) + 1) * 0.5)
        : 0.2
      scannerRef.current.scale.x = 0.72 + evaluationState * 0.28
    }
    registryRefs.current.forEach((material, index) => {
      if (material) material.opacity = 0.2 + evaluationState * (0.5 + index * 0.08)
    })

    gateRefs.current.forEach((gate, index) => {
      if (!gate) return
      gate.rotation.y = (index ? 1 : -1) * deploymentState * 0.42
      gate.position.x = (index ? 0.35 : -0.35) + (index ? 1 : -1) * deploymentState * 0.12
    })
    if (endpointMaterialRef.current) endpointMaterialRef.current.emissiveIntensity = 0.08 + deploymentState * 1.45
    outputRefs.current.forEach((node, index) => {
      if (!node) return
      const pulse = deploymentState * (0.68 + Math.sin(elapsed * 3.2 + index * 1.8) * 0.24)
      node.scale.setScalar(0.55 + pulse * 0.7)
      node.position.z = 0.38 + pulse * 0.28
    })

    if (radarRef.current) radarRef.current.rotation.z = runtime.running && isMLOps ? elapsed * (0.45 + monitoringState * 0.65) : 0.35
    if (monitorScreenRef.current) monitorScreenRef.current.emissiveIntensity = 0.04 + monitoringState * 0.5
    monitorBarRefs.current.forEach((bar, index) => {
      if (!bar) return
      const barReady = smoothstep(index * 0.08, 0.62 + index * 0.07, monitoringState)
      bar.scale.y = damp(bar.scale.y, [0.52, 0.82, 0.62, 0.96][index] * Math.max(0.05, barReady), 6, delta)
      bar.position.y = -0.24 + bar.scale.y * 0.13
    })

    if (feedbackRef.current) {
      feedbackRef.current.scale.setScalar(damp(feedbackRef.current.scale.x, Math.max(0.001, feedbackState), 6.5, delta))
    }

    let artifactPosition = MODEL_POINTS.features
    if (time >= 2.35 && time < 3.4) artifactPosition = FEATURE_TRAINING.getPointAt(smoothstep(2.35, 3.4, time), point)
    else if (time >= 3.4 && time < 4.55) artifactPosition = MODEL_POINTS.training
    else if (time >= 4.55 && time < 5.45) artifactPosition = TRAINING_EVALUATION.getPointAt(smoothstep(4.55, 5.45, time), point)
    else if (time >= 5.45 && time < 6.45) artifactPosition = MODEL_POINTS.evaluation
    else if (time >= 6.45 && time < 7.45) artifactPosition = EVALUATION_DEPLOYMENT.getPointAt(smoothstep(6.45, 7.45, time), point)
    else if (time >= 7.45 && time < 8.45) artifactPosition = DEPLOYMENT_MONITORING.getPointAt(smoothstep(7.45, 8.45, time), point)
    else if (time >= 8.45) artifactPosition = MODEL_POINTS.monitoring

    if (artifactRef.current) {
      artifactRef.current.position.copy(artifactPosition)
      artifactRef.current.rotation.x = runtime.running && isMLOps ? elapsed * (0.42 + trainingCharge * 0.9) : 0.42
      artifactRef.current.rotation.y = runtime.running && isMLOps ? elapsed * (0.58 + trainingCharge * 1.1) : 0.58
      const artifactVisible = isMLOps ? smoothstep(1.45, 2.05, time) * exitFactor : 0
      artifactRef.current.scale.setScalar(Math.max(0.001, artifactVisible * (0.82 + evaluationState * 0.32)))
    }
    if (artifactCoreRef.current) {
      artifactCoreRef.current.color.copy(teal).lerp(orange, evaluationState)
      artifactCoreRef.current.emissive.copy(teal).lerp(orange, evaluationState)
      artifactCoreRef.current.emissiveIntensity = 1.1 + trainingCharge * 1.8 + evaluationState * 0.55
    }
    if (artifactRingMaterialRef.current) artifactRingMaterialRef.current.opacity = 0.22 + evaluationState * 0.68
    if (artifactRingRef.current) artifactRingRef.current.scale.setScalar(0.86 + evaluationState * 0.26)
    artifactSatelliteRefs.current.forEach((satellite, index) => {
      if (!satellite) return
      satellite.visible = evaluationState > 0.08
      const angle = elapsed * 1.2 + index * (Math.PI * 2 / 3)
      satellite.position.set(Math.cos(angle) * 0.33, Math.sin(angle) * 0.24, Math.sin(angle * 0.7) * 0.1)
    })

    const deliveryReady = smoothstep(2.05, 2.7, time) * exitFactor
    if (deliveryPacketsRef.current) {
      for (let index = 0; index < 12; index += 1) {
        const progress = runtime.reducedMotion
          ? (index + 1) / 13
          : ((Math.max(0, time - 2) * (time < 10.5 ? 0.12 : 0.045) + index / 12) % 1)
        DELIVERY_CURVE.getPointAt(progress, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(isMLOps ? deliveryReady * 0.72 : 0.001)
        dummy.updateMatrix()
        deliveryPacketsRef.current.setMatrixAt(index, dummy.matrix)
      }
      deliveryPacketsRef.current.instanceMatrix.needsUpdate = true
    }

    if (feedbackPacketsRef.current) {
      for (let index = 0; index < 7; index += 1) {
        const progress = runtime.reducedMotion
          ? (index + 1) / 8
          : ((Math.max(0, time - 8.8) * (time < 11 ? 0.23 : 0.07) + index / 7) % 1)
        FEEDBACK_CURVE.getPointAt(progress, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(isMLOps ? feedbackState * 0.84 : 0.001)
        dummy.rotation.set(progress * 4, progress * 3, 0)
        dummy.updateMatrix()
        feedbackPacketsRef.current.setMatrixAt(index, dummy.matrix)
      }
      feedbackPacketsRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <MLOpsCameraRig lifecycleRef={lifecycleRef} />
      <group ref={rootRef} scale={0.001}>
        <group ref={(node) => { stageRefs.current[0] = node }}><FeatureBank waferRefs={waferRefs} /></group>
        <group ref={(node) => { stageRefs.current[1] = node }}><TrainingForge ringRefs={trainingRingRefs} lightRefs={trainingLightRefs} /></group>
        <group ref={(node) => { stageRefs.current[2] = node }}><EvaluationRegistry scannerRef={scannerRef} registryRefs={registryRefs} /></group>
        <group ref={(node) => { stageRefs.current[3] = node }}>
          <InferenceGateway gateRefs={gateRefs} endpointMaterialRef={endpointMaterialRef} outputRefs={outputRefs} />
        </group>
        <group ref={(node) => { stageRefs.current[4] = node }}>
          <MonitoringStation radarRef={radarRef} screenMaterialRef={monitorScreenRef} barRefs={monitorBarRefs} />
        </group>

        <group ref={routeRef} scale={0.001}>
          <Route curve={FEATURE_TRAINING} color={SCENE_COLORS.teal} />
          <Route curve={TRAINING_EVALUATION} color={SCENE_COLORS.blue} />
          <Route curve={EVALUATION_DEPLOYMENT} color={SCENE_COLORS.orange} opacity={0.82} />
          <Route curve={DEPLOYMENT_MONITORING} color={SCENE_COLORS.teal} />
        </group>
        <group ref={feedbackRef} scale={0.001}>
          <Route curve={FEEDBACK_CURVE} color={SCENE_COLORS.orange} radius={0.015} opacity={0.86} />
        </group>

        <ModelArtifact
          artifactRef={artifactRef}
          coreMaterialRef={artifactCoreRef}
          ringMaterialRef={artifactRingMaterialRef}
          ringRef={artifactRingRef}
          satelliteRefs={artifactSatelliteRefs}
        />
        <instancedMesh ref={deliveryPacketsRef} args={[null, null, 12]} frustumCulled={false}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={feedbackPacketsRef} args={[null, null, 7]} frustumCulled={false}>
          <boxGeometry args={[0.075, 0.075, 0.075]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </instancedMesh>

        <Sparkles
          count={runtime.quality === 'high' ? 30 : 12}
          color={SCENE_COLORS.blue}
          opacity={0.22}
          scale={[7.2, 4.4, 4.4]}
          size={runtime.quality === 'high' ? 1.05 : 0.78}
          speed={runtime.running && !runtime.reducedMotion ? 0.1 : 0}
          noise={0.62}
        />
      </group>
    </>
  )
}

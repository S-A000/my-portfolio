import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import DataEngineeringScene from './DataEngineeringScene'
import MLOpsDeliveryScene from './MLOpsDeliveryScene'
import WebProductScene from './WebProductScene'
import AISolutionsScene from './AISolutionsScene'
import SceneEnvironment from './SceneEnvironment'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS, SCENE_MATERIALS } from './sceneTheme'
import {
  SCENE_PHASES,
  easeInCubic,
  easeOutCubic,
  useSceneTransition,
} from './useSceneTransition'

const SERVICE_POSES = Object.freeze({
  'data-engineering': {
    accent: SCENE_COLORS.teal,
    secondary: SCENE_COLORS.orange,
    rotation: [-0.08, -0.42, 0.025],
  },
  mlops: {
    accent: SCENE_COLORS.blue,
    secondary: SCENE_COLORS.teal,
    rotation: [0.09, 0.2, -0.035],
  },
  'web-software': {
    accent: SCENE_COLORS.orange,
    secondary: SCENE_COLORS.teal,
    rotation: [-0.05, 0.64, 0.018],
  },
  'ai-solutions': {
    accent: SCENE_COLORS.cyan,
    secondary: SCENE_COLORS.orange,
    rotation: [0.14, -0.72, -0.04],
  },
})

const PANELS = Object.freeze([
  {
    assembled: [-1.7, -0.48, 0.18],
    exploded: [-4.1, 1.65, 2.5],
    rotation: [-0.08, 0.22, -0.03],
    size: [1.42, 0.78, 0.2],
  },
  {
    assembled: [1.7, -0.48, 0.18],
    exploded: [4.2, -0.2, 2.8],
    rotation: [-0.08, -0.22, 0.03],
    size: [1.42, 0.78, 0.2],
  },
  {
    assembled: [0, 0.78, -0.56],
    exploded: [-0.6, 3.2, -3.1],
    rotation: [0.18, 0, 0],
    size: [1.7, 0.68, 0.18],
  },
])

const clamp01 = (value) => Math.min(1, Math.max(0, value))
const damp = (current, target, speed, delta) => THREE.MathUtils.damp(current, target, speed, delta)

function RelayPanel({ index, panel, panelRefs, accentMaterialRefs }) {
  return (
    <group
      ref={(node) => { panelRefs.current[index] = node }}
      position={panel.exploded}
    >
      <RoundedBox args={panel.size} radius={0.1} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          {...SCENE_MATERIALS.panel}
          emissive={SCENE_COLORS.teal}
          emissiveIntensity={0.08}
        />
        <Edges color={SCENE_COLORS.cyan} transparent opacity={0.38} />
      </RoundedBox>
      <mesh position={[0, 0.16, panel.size[2] * 0.55]}>
        <planeGeometry args={[panel.size[0] * 0.62, 0.035]} />
        <meshBasicMaterial
          ref={(node) => { accentMaterialRefs.current[index] = node }}
          color={SCENE_COLORS.teal}
          toneMapped={false}
        />
      </mesh>
      {[-0.3, 0, 0.3].map((x, dotIndex) => (
        <mesh key={x} position={[x, -0.15, panel.size[2] * 0.57]}>
          <circleGeometry args={[dotIndex === 1 ? 0.052 : 0.035, 16]} />
          <meshBasicMaterial
            color={dotIndex === 1 ? SCENE_COLORS.orange : SCENE_COLORS.warmWhite}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function FoundationDemoScene({ onPhaseChange, sceneKey }) {
  const runtime = useSceneRuntime()
  const transition = useSceneTransition({
    sceneKey,
    running: runtime.running,
    reducedMotion: runtime.reducedMotion,
    onPhaseChange,
  })
  const rootRef = useRef(null)
  const coreRef = useRef(null)
  const crystalRef = useRef(null)
  const ringOneRef = useRef(null)
  const ringTwoRef = useRef(null)
  const panelRefs = useRef([])
  const accentMaterialRefs = useRef([])
  const coreMaterialRef = useRef(null)
  const ringMaterialRef = useRef(null)
  const accentColor = useMemo(() => new THREE.Color(SCENE_COLORS.teal), [])
  const secondaryColor = useMemo(() => new THREE.Color(SCENE_COLORS.orange), [])

  useFrame(({ clock }, delta) => {
    const lifecycle = transition.step(delta)
    const pose = SERVICE_POSES[lifecycle.currentKey] || SERVICE_POSES['data-engineering']
    const customSceneActive = lifecycle.currentKey === 'data-engineering'
      || lifecycle.currentKey === 'mlops'
      || lifecycle.currentKey === 'web-software'
      || lifecycle.currentKey === 'ai-solutions'
    const time = clock.getElapsedTime()

    let assembly = 1
    if (lifecycle.phase === SCENE_PHASES.INTRO) assembly = easeOutCubic(lifecycle.progress)
    if (lifecycle.phase === SCENE_PHASES.EXIT) assembly = 1 - easeInCubic(lifecycle.progress)

    const idleMotion = lifecycle.phase === SCENE_PHASES.IDLE && runtime.running
    const settle = lifecycle.phase === SCENE_PHASES.ACTIVE
      ? Math.sin(lifecycle.progress * Math.PI) * (1 - lifecycle.progress)
      : 0
    const floatY = idleMotion ? Math.sin(time * 0.62) * 0.055 : 0
    const driftY = idleMotion ? Math.sin(time * 0.23) * 0.035 : 0
    const targetScale = customSceneActive ? 0.001 : 0.74 + assembly * 0.26 + settle * 0.035

    if (rootRef.current) {
      rootRef.current.scale.setScalar(damp(rootRef.current.scale.x, targetScale, 6.5, delta))
      rootRef.current.position.y = damp(rootRef.current.position.y, customSceneActive ? 0 : floatY, 4.2, delta)
      rootRef.current.rotation.x = damp(
        rootRef.current.rotation.x,
        pose.rotation[0] + (idleMotion ? Math.sin(time * 0.31) * 0.018 : 0),
        4.6,
        delta,
      )
      rootRef.current.rotation.y = damp(
        rootRef.current.rotation.y,
        pose.rotation[1] + (idleMotion ? Math.sin(time * 0.22) * 0.045 : 0),
        4.6,
        delta,
      )
      rootRef.current.rotation.z = damp(rootRef.current.rotation.z, pose.rotation[2], 4.6, delta)
    }

    if (coreRef.current) coreRef.current.position.y = -0.16 + driftY
    if (crystalRef.current) {
      crystalRef.current.rotation.x = runtime.running ? time * 0.38 : 0.48
      crystalRef.current.rotation.y = runtime.running ? time * 0.54 : 0.66
    }
    if (ringOneRef.current) ringOneRef.current.rotation.z = runtime.running ? time * 0.18 : 0.2
    if (ringTwoRef.current) ringTwoRef.current.rotation.z = runtime.running ? -time * 0.13 : -0.24

    PANELS.forEach((panel, index) => {
      const node = panelRefs.current[index]
      if (!node) return
      const stagger = index * 0.08
      const localAssembly = clamp01((assembly - stagger) / (1 - stagger))
      const eased = easeOutCubic(localAssembly)
      node.position.set(
        THREE.MathUtils.lerp(panel.exploded[0], panel.assembled[0], eased),
        THREE.MathUtils.lerp(panel.exploded[1], panel.assembled[1], eased),
        THREE.MathUtils.lerp(panel.exploded[2], panel.assembled[2], eased),
      )
      node.rotation.set(
        panel.rotation[0] + (1 - eased) * (0.55 - index * 0.16),
        panel.rotation[1] + (1 - eased) * (index % 2 ? -0.9 : 0.9),
        panel.rotation[2] + (1 - eased) * (index - 1) * 0.28,
      )
      node.scale.setScalar(0.72 + eased * 0.28)
    })

    accentColor.set(pose.accent)
    secondaryColor.set(pose.secondary)
    const colorDamping = 1 - Math.exp(-delta * 7)
    accentMaterialRefs.current.forEach((material) => material?.color.lerp(accentColor, colorDamping))
    if (coreMaterialRef.current) {
      coreMaterialRef.current.color.lerp(accentColor, colorDamping)
      coreMaterialRef.current.emissive.lerp(accentColor, colorDamping)
      coreMaterialRef.current.emissiveIntensity = 1.2 + settle * 1.6
    }
    if (ringMaterialRef.current) ringMaterialRef.current.color.lerp(secondaryColor, colorDamping)
  })

  return (
    <>
      <SceneEnvironment sceneRadius={3.7} />
      <DataEngineeringScene lifecycleRef={transition.stateRef} />
      <MLOpsDeliveryScene lifecycleRef={transition.stateRef} />
      <WebProductScene lifecycleRef={transition.stateRef} />
      <AISolutionsScene lifecycleRef={transition.stateRef} />
      <group
        ref={rootRef}
        position={[0, 0, 0]}
        scale={sceneKey === 'data-engineering' || sceneKey === 'mlops' || sceneKey === 'web-software' || sceneKey === 'ai-solutions' ? 0.001 : 1}
      >
        <RoundedBox
          args={[4.8, 0.24, 2.84]}
          radius={0.16}
          smoothness={4}
          position={[0, -1.35, 0]}
          receiveShadow
        >
          <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.34} />
          <Edges color={SCENE_COLORS.blue} transparent opacity={0.24} />
        </RoundedBox>

        <group position={[0, -1.16, 0.05]}>
          <mesh position={[-0.92, 0, 0]}>
            <boxGeometry args={[1.2, 0.035, 0.08]} />
            <meshBasicMaterial color={SCENE_COLORS.teal} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.92, 0, 0]}>
            <boxGeometry args={[1.2, 0.035, 0.08]} />
            <meshBasicMaterial color={SCENE_COLORS.orange} transparent opacity={0.58} />
          </mesh>
          {[-1.52, -0.52, 0.52, 1.52].map((x, index) => (
            <mesh key={x} position={[x, 0.045, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshBasicMaterial
                color={index === 2 ? SCENE_COLORS.orange : SCENE_COLORS.cyan}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        <group ref={coreRef} position={[0, -0.16, 0]}>
          <RoundedBox args={[1.3, 1.3, 1.3]} radius={0.2} smoothness={5} castShadow receiveShadow>
            <meshPhysicalMaterial
              {...SCENE_MATERIALS.shell}
              emissive={SCENE_COLORS.teal}
              emissiveIntensity={0.12}
            />
            <Edges color={SCENE_COLORS.cyan} transparent opacity={0.58} />
          </RoundedBox>
          <mesh ref={crystalRef} position={[0, 0.02, 0.76]} castShadow>
            <octahedronGeometry args={[0.34, 1]} />
            <meshStandardMaterial
              ref={coreMaterialRef}
              color={SCENE_COLORS.teal}
              emissive={SCENE_COLORS.teal}
              emissiveIntensity={1.2}
              metalness={0.35}
              roughness={0.18}
              toneMapped={false}
            />
          </mesh>
          <mesh ref={ringOneRef} rotation={[1.05, 0.18, 0.12]}>
            <torusGeometry args={[0.86, 0.022, 10, 96]} />
            <meshBasicMaterial color={SCENE_COLORS.cyan} transparent opacity={0.72} toneMapped={false} />
          </mesh>
          <mesh ref={ringTwoRef} rotation={[0.25, 1.04, 0.72]}>
            <torusGeometry args={[1.08, 0.015, 10, 96]} />
            <meshBasicMaterial
              ref={ringMaterialRef}
              color={SCENE_COLORS.orange}
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>
        </group>

        {PANELS.map((panel, index) => (
          <RelayPanel
            key={panel.assembled.join('-')}
            index={index}
            panel={panel}
            panelRefs={panelRefs}
            accentMaterialRefs={accentMaterialRefs}
          />
        ))}

        <Sparkles
          count={runtime.quality === 'high' ? 44 : 18}
          color={SCENE_COLORS.cyan}
          opacity={0.32}
          scale={[6.5, 4, 3.4]}
          size={runtime.quality === 'high' ? 1.3 : 0.9}
          speed={runtime.running ? 0.18 : 0}
          noise={0.7}
        />
        <Sparkles
          count={runtime.quality === 'high' ? 12 : 6}
          color={SCENE_COLORS.orange}
          opacity={0.4}
          scale={[5.2, 3.4, 2.8]}
          size={1.7}
          speed={runtime.running ? 0.12 : 0}
          noise={0.5}
        />
      </group>
    </>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Edges, RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS, SCENE_MATERIALS } from './sceneTheme'
import { SCENE_PHASES, easeInCubic, easeOutCubic } from './useSceneTransition'

const LAYERS = Object.freeze([
  {
    assembled: [-0.68, 0.16, -0.34],
    exploded: [-4.4, 2.75, 2.8],
    accent: SCENE_COLORS.orange,
    start: 1.2,
    end: 2.2,
    type: 'frontend',
  },
  {
    assembled: [-0.82, 0.22, -0.72],
    exploded: [4.2, 2.3, -3.8],
    accent: SCENE_COLORS.teal,
    start: 0.8,
    end: 1.8,
    type: 'api',
  },
  {
    assembled: [-0.96, 0.28, -1.1],
    exploded: [-4.2, -2.2, -4.6],
    accent: SCENE_COLORS.blue,
    start: 0.4,
    end: 1.45,
    type: 'data',
  },
  {
    assembled: [-1.1, 0.34, -1.48],
    exploded: [3.8, -2.65, -5.2],
    accent: SCENE_COLORS.cyan,
    start: 0,
    end: 1.08,
    type: 'deployment',
  },
])

const UI_PARTS = Object.freeze([
  { assembled: [0, 1.22, 0.2], exploded: [-1.2, 2.6, 1.9], start: 2.2, end: 3 },
  { assembled: [-1.18, 0.18, 0.23], exploded: [-4.1, 0.2, 2.4], start: 2.48, end: 3.42 },
  { assembled: [1.14, 0.22, 0.27], exploded: [3.9, 1.55, 2.8], start: 2.78, end: 3.78 },
  { assembled: [0, -0.94, 0.24], exploded: [0, -3.3, 2.25], start: 3.04, end: 4.08 },
])

const PIPELINE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.54, 1.04, -0.18),
  new THREE.Vector3(2.14, 0.9, -0.42),
  new THREE.Vector3(2.36, 0.58, -0.74),
  new THREE.Vector3(2.28, 0.2, -1.08),
  new THREE.Vector3(1.84, -0.05, -1.42),
])

const DESKTOP_TABLET_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(1.42, -0.12, 0.44),
  new THREE.Vector3(1.9, -0.12, 0.82),
  new THREE.Vector3(2.34, -0.24, 1.08),
  new THREE.Vector3(2.58, -0.34, 1.2),
])

const TABLET_PHONE_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(2.54, -0.68, 1.3),
  new THREE.Vector3(2.28, -1.02, 1.58),
  new THREE.Vector3(1.86, -1.14, 1.72),
  new THREE.Vector3(1.48, -1.08, 1.82),
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

function UiBlock({ color = SCENE_COLORS.warmWhite, opacity = 0.82, position, size }) {
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  )
}

function ProductGlyph({ compact = false, ringRef }) {
  const scale = compact ? 0.62 : 1
  return (
    <group scale={scale}>
      <mesh rotation={[0.86, 0.22, 0.18]} castShadow>
        <icosahedronGeometry args={[0.33, 1]} />
        <meshPhysicalMaterial
          color={SCENE_COLORS.deepNavy}
          emissive={SCENE_COLORS.teal}
          emissiveIntensity={0.55}
          metalness={0.58}
          roughness={0.14}
          clearcoat={0.72}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[1.08, 0.18, 0.42]}>
        <torusGeometry args={[0.52, 0.026, 10, 72]} />
        <meshBasicMaterial color={SCENE_COLORS.orange} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh rotation={[0.26, 1.12, 0.2]}>
        <torusGeometry args={[0.43, 0.014, 8, 64]} />
        <meshBasicMaterial color={SCENE_COLORS.cyan} transparent opacity={0.66} toneMapped={false} />
      </mesh>
    </group>
  )
}

function DesktopInterface({ partRefs, ringRef }) {
  return (
    <>
      <group ref={(node) => { partRefs.current[0] = node }}>
        <UiBlock color={SCENE_COLORS.orange} position={[-1.88, 0, 0]} size={[0.14, 0.14]} opacity={1} />
        <UiBlock color={SCENE_COLORS.teal} position={[-1.72, 0, 0]} size={[0.08, 0.14]} opacity={0.9} />
        {[-0.55, -0.16, 0.23, 0.62].map((x, index) => (
          <UiBlock key={x} position={[x, 0, 0]} size={[index === 0 ? 0.3 : 0.22, 0.035]} opacity={0.32} />
        ))}
        <UiBlock color={SCENE_COLORS.orange} position={[1.76, 0, 0]} size={[0.5, 0.17]} opacity={0.92} />
      </group>

      <group ref={(node) => { partRefs.current[1] = node }}>
        <UiBlock color={SCENE_COLORS.teal} position={[-0.72, 0.57, 0]} size={[0.52, 0.035]} opacity={0.82} />
        <UiBlock position={[-0.57, 0.3, 0.01]} size={[1.28, 0.12]} opacity={0.92} />
        <UiBlock position={[-0.72, 0.1, 0.01]} size={[0.98, 0.12]} opacity={0.82} />
        <UiBlock color={SCENE_COLORS.warmWhite} position={[-0.77, -0.12, 0]} size={[0.88, 0.045]} opacity={0.32} />
        <UiBlock color={SCENE_COLORS.warmWhite} position={[-0.83, -0.23, 0]} size={[0.76, 0.045]} opacity={0.22} />
        <RoundedBox args={[0.68, 0.25, 0.025]} radius={0.05} smoothness={3} position={[-0.94, -0.49, 0]}>
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </RoundedBox>
        <UiBlock color={SCENE_COLORS.warmWhite} position={[-0.94, -0.49, 0.01]} size={[0.31, 0.035]} opacity={0.9} />
        <mesh position={[-0.18, -0.49, 0]}>
          <planeGeometry args={[0.56, 0.24]} />
          <meshBasicMaterial color={SCENE_COLORS.panel} transparent opacity={0.86} />
        </mesh>
        <UiBlock color={SCENE_COLORS.cyan} position={[-0.18, -0.49, 0.01]} size={[0.24, 0.028]} opacity={0.62} />
      </group>

      <group ref={(node) => { partRefs.current[2] = node }}>
        <RoundedBox args={[1.72, 1.3, 0.06]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial color="#092432" metalness={0.28} roughness={0.34} clearcoat={0.54} />
          <Edges color={SCENE_COLORS.teal} transparent opacity={0.42} />
        </RoundedBox>
        <group position={[0.06, 0.02, 0.12]}>
          <ProductGlyph ringRef={ringRef} />
        </group>
        <group position={[-0.62, 0.42, 0.1]}>
          <RoundedBox args={[0.48, 0.28, 0.06]} radius={0.035} smoothness={3}>
            <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
          </RoundedBox>
          <UiBlock color={SCENE_COLORS.orange} position={[-0.1, 0.04, 0.035]} size={[0.13, 0.06]} opacity={0.92} />
          <UiBlock position={[0.08, 0.04, 0.035]} size={[0.12, 0.025]} opacity={0.56} />
          <UiBlock position={[0, -0.06, 0.035]} size={[0.29, 0.025]} opacity={0.22} />
        </group>
        <group position={[0.62, -0.42, 0.14]}>
          <RoundedBox args={[0.54, 0.32, 0.06]} radius={0.035} smoothness={3}>
            <meshPhysicalMaterial {...SCENE_MATERIALS.panel} />
          </RoundedBox>
          {[0, 1, 2].map((index) => (
            <UiBlock
              key={index}
              color={index === 1 ? SCENE_COLORS.orange : SCENE_COLORS.teal}
              position={[-0.16 + index * 0.16, -0.02 + index * 0.025, 0.035]}
              size={[0.055, 0.1 + index * 0.045]}
              opacity={0.82}
            />
          ))}
        </group>
      </group>

      <group ref={(node) => { partRefs.current[3] = node }}>
        {[-1.45, -0.49, 0.49, 1.45].map((x, index) => (
          <group key={x} position={[x, 0, 0]}>
            <RoundedBox args={[0.78, 0.44, 0.04]} radius={0.045} smoothness={3}>
              <meshPhysicalMaterial color="#09202c" metalness={0.24} roughness={0.38} />
              <Edges color={index === 0 ? SCENE_COLORS.orange : SCENE_COLORS.blue} transparent opacity={0.28} />
            </RoundedBox>
            <mesh position={[-0.25, 0.07, 0.035]}>
              <circleGeometry args={[0.06, 16]} />
              <meshBasicMaterial color={index === 0 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
            </mesh>
            <UiBlock position={[0.06, 0.09, 0.035]} size={[0.4, 0.035]} opacity={0.48} />
            <UiBlock position={[0, -0.05, 0.035]} size={[0.52, 0.025]} opacity={0.2} />
            <UiBlock color={SCENE_COLORS.cyan} position={[-0.12, -0.13, 0.035]} size={[0.28, 0.025]} opacity={0.34} />
          </group>
        ))}
      </group>
    </>
  )
}

function BrowserDevice({ deviceRef, partRefs, ringRef }) {
  return (
    <group ref={deviceRef}>
      <RoundedBox args={[5.05, 3.18, 0.2]} radius={0.14} smoothness={5} castShadow receiveShadow>
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.2} />
        <Edges color={SCENE_COLORS.warmWhite} transparent opacity={0.22} />
      </RoundedBox>
      <mesh position={[0, -0.08, 0.112]}>
        <planeGeometry args={[4.76, 2.78]} />
        <meshStandardMaterial color="#041019" emissive="#061a24" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 1.38, 0.126]}>
        <planeGeometry args={[4.75, 0.22]} />
        <meshStandardMaterial color="#0c2b38" metalness={0.38} roughness={0.36} />
      </mesh>
      {[-2.15, -2.02, -1.89].map((x, index) => (
        <mesh key={x} position={[x, 1.38, 0.14]}>
          <circleGeometry args={[0.038, 14]} />
          <meshBasicMaterial
            color={index === 0 ? SCENE_COLORS.orange : index === 1 ? SCENE_COLORS.teal : SCENE_COLORS.blue}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh position={[0, -1.72, -0.04]} castShadow>
        <boxGeometry args={[1.02, 0.28, 0.18]} />
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} />
      </mesh>
      <RoundedBox args={[2.15, 0.18, 0.74]} radius={0.09} smoothness={4} position={[0, -1.95, 0.08]} castShadow receiveShadow>
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.31} />
      </RoundedBox>
      <DesktopInterface partRefs={partRefs} ringRef={ringRef} />
    </group>
  )
}

function TabletInterface({ ringRef }) {
  return (
    <group position={[0, -0.02, 0.12]}>
      <group position={[0, 0.8, 0]}>
        <UiBlock color={SCENE_COLORS.orange} position={[-0.43, 0, 0]} size={[0.11, 0.11]} opacity={1} />
        <UiBlock color={SCENE_COLORS.teal} position={[-0.31, 0, 0]} size={[0.06, 0.11]} opacity={0.88} />
        <UiBlock position={[0.27, 0, 0]} size={[0.34, 0.03]} opacity={0.32} />
      </group>
      <UiBlock color={SCENE_COLORS.teal} position={[-0.25, 0.5, 0]} size={[0.42, 0.03]} opacity={0.7} />
      <UiBlock position={[0, 0.33, 0]} size={[0.94, 0.09]} opacity={0.88} />
      <UiBlock position={[-0.12, 0.17, 0]} size={[0.7, 0.075]} opacity={0.62} />
      <mesh position={[-0.29, -0.08, 0]}>
        <planeGeometry args={[0.55, 0.2]} />
        <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
      </mesh>
      <group position={[0, -0.62, 0.05]}>
        <RoundedBox args={[1.05, 0.74, 0.045]} radius={0.06} smoothness={3}>
          <meshPhysicalMaterial color="#092432" metalness={0.25} roughness={0.36} />
          <Edges color={SCENE_COLORS.teal} transparent opacity={0.38} />
        </RoundedBox>
        <ProductGlyph compact ringRef={ringRef} />
      </group>
    </group>
  )
}

function TabletDevice({ deviceRef, ringRef }) {
  return (
    <group ref={deviceRef}>
      <RoundedBox args={[1.48, 2.46, 0.16]} radius={0.14} smoothness={5} castShadow>
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.22} />
        <Edges color={SCENE_COLORS.teal} transparent opacity={0.34} />
      </RoundedBox>
      <mesh position={[0, 0, 0.092]}>
        <planeGeometry args={[1.26, 2.18]} />
        <meshStandardMaterial color="#041019" emissive="#061b25" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 1.13, 0.1]}>
        <circleGeometry args={[0.025, 14]} />
        <meshBasicMaterial color={SCENE_COLORS.cyan} toneMapped={false} />
      </mesh>
      <TabletInterface ringRef={ringRef} />
    </group>
  )
}

function PhoneInterface() {
  return (
    <group position={[0, -0.02, 0.1]}>
      <group position={[0, 0.62, 0]}>
        <UiBlock color={SCENE_COLORS.orange} position={[-0.22, 0, 0]} size={[0.08, 0.08]} opacity={1} />
        <UiBlock color={SCENE_COLORS.teal} position={[-0.13, 0, 0]} size={[0.045, 0.08]} opacity={0.9} />
        <UiBlock position={[0.18, 0, 0]} size={[0.17, 0.022]} opacity={0.34} />
      </group>
      <UiBlock color={SCENE_COLORS.teal} position={[-0.11, 0.41, 0]} size={[0.24, 0.022]} opacity={0.72} />
      <UiBlock position={[0, 0.27, 0]} size={[0.48, 0.06]} opacity={0.9} />
      <UiBlock position={[-0.07, 0.15, 0]} size={[0.34, 0.045]} opacity={0.56} />
      <mesh position={[0, -0.07, 0]}>
        <planeGeometry args={[0.48, 0.18]} />
        <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
      </mesh>
      <group position={[0, -0.42, 0]}>
        {[-0.18, 0, 0.18].map((x, index) => (
          <group key={x} position={[0, x, 0]}>
            <mesh>
              <planeGeometry args={[0.5, 0.13]} />
              <meshBasicMaterial color="#0a2835" />
            </mesh>
            <mesh position={[-0.18, 0, 0.01]}>
              <circleGeometry args={[0.035, 12]} />
              <meshBasicMaterial color={index === 0 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
            </mesh>
            <UiBlock position={[0.07, 0.02, 0.01]} size={[0.24, 0.022]} opacity={0.42} />
            <UiBlock position={[0.03, -0.03, 0.01]} size={[0.16, 0.018]} opacity={0.2} />
          </group>
        ))}
      </group>
    </group>
  )
}

function PhoneDevice({ deviceRef }) {
  return (
    <group ref={deviceRef}>
      <RoundedBox args={[0.76, 1.72, 0.14]} radius={0.16} smoothness={5} castShadow>
        <meshPhysicalMaterial {...SCENE_MATERIALS.shell} roughness={0.2} />
        <Edges color={SCENE_COLORS.orange} transparent opacity={0.4} />
      </RoundedBox>
      <mesh position={[0, -0.02, 0.081]}>
        <planeGeometry args={[0.62, 1.5]} />
        <meshStandardMaterial color="#041019" emissive="#071b24" emissiveIntensity={0.2} />
      </mesh>
      <RoundedBox args={[0.24, 0.045, 0.025]} radius={0.02} smoothness={3} position={[0, 0.75, 0.095]}>
        <meshBasicMaterial color="#102d39" />
      </RoundedBox>
      <PhoneInterface />
    </group>
  )
}

function SystemLayer({ layer, materialRefs, index }) {
  return (
    <group>
      <RoundedBox args={[4.42, 2.66, 0.065]} radius={0.12} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={(node) => { materialRefs.current[index] = node }}
          color={SCENE_COLORS.deepNavy}
          emissive={layer.accent}
          emissiveIntensity={0.08}
          metalness={0.44}
          roughness={0.34}
          transparent
          opacity={0.48}
        />
        <Edges color={layer.accent} transparent opacity={0.48} />
      </RoundedBox>
      <mesh position={[-1.82, 1.04, 0.05]}>
        <circleGeometry args={[0.1, 18]} />
        <meshBasicMaterial color={layer.accent} toneMapped={false} />
      </mesh>
      <UiBlock color={layer.accent} position={[-1.36, 1.04, 0.05]} size={[0.58, 0.045]} opacity={0.62} />
      {layer.type === 'frontend' && (
        <group position={[0, -0.05, 0.06]}>
          {[-1.35, -0.45, 0.45, 1.35].map((x, itemIndex) => (
            <RoundedBox key={x} args={[0.7, 1.34 - itemIndex * 0.1, 0.04]} radius={0.05} smoothness={3} position={[x, -0.08, 0]}>
              <meshPhysicalMaterial color="#0c3342" transparent opacity={0.68} />
              <Edges color={itemIndex === 0 ? SCENE_COLORS.orange : SCENE_COLORS.teal} transparent opacity={0.28} />
            </RoundedBox>
          ))}
        </group>
      )}
      {layer.type === 'api' && (
        <group position={[0, -0.08, 0.07]}>
          {[[-1.3, 0.42], [-0.42, -0.42], [0.48, 0.4], [1.34, -0.36]].map(([x, y], itemIndex) => (
            <group key={x} position={[x, y, 0]}>
              <mesh>
                <cylinderGeometry args={[0.23, 0.23, 0.1, 6]} />
                <meshPhysicalMaterial color="#0d3a49" metalness={0.48} roughness={0.28} />
              </mesh>
              <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.13, 6]} />
                <meshBasicMaterial color={itemIndex === 2 ? SCENE_COLORS.orange : SCENE_COLORS.teal} toneMapped={false} />
              </mesh>
            </group>
          ))}
          <UiBlock color={SCENE_COLORS.teal} position={[0, 0, -0.02]} size={[3.1, 0.035]} opacity={0.48} />
        </group>
      )}
      {layer.type === 'data' && (
        <group position={[0, -0.2, 0.08]}>
          {[-1.15, 0, 1.15].map((x, itemIndex) => (
            <group key={x} position={[x, 0, 0]}>
              {[0, 0.16, 0.32].map((y) => (
                <mesh key={y} position={[0, y, 0]}>
                  <cylinderGeometry args={[0.42, 0.42, 0.1, 32]} />
                  <meshPhysicalMaterial color="#0c3545" metalness={0.6} roughness={0.25} />
                </mesh>
              ))}
              <mesh position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.22, 24]} />
                <meshBasicMaterial color={itemIndex === 1 ? SCENE_COLORS.orange : SCENE_COLORS.blue} transparent opacity={0.82} toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>
      )}
      {layer.type === 'deployment' && (
        <group position={[0, -0.12, 0.08]}>
          {[[-1.35, 0.36], [-0.46, -0.3], [0.46, 0.36], [1.35, -0.3]].map(([x, y], itemIndex) => (
            <group key={x} position={[x, y, 0]}>
              <RoundedBox args={[0.56, 0.48, 0.08]} radius={0.06} smoothness={3}>
                <meshPhysicalMaterial color="#0a2d3b" metalness={0.54} roughness={0.28} />
                <Edges color={itemIndex === 3 ? SCENE_COLORS.orange : SCENE_COLORS.cyan} transparent opacity={0.52} />
              </RoundedBox>
              {[-0.13, 0, 0.13].map((nodeX) => (
                <mesh key={nodeX} position={[nodeX, 0, 0.05]}>
                  <circleGeometry args={[0.03, 12]} />
                  <meshBasicMaterial color={SCENE_COLORS.teal} toneMapped={false} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}
    </group>
  )
}

function Route({ curve, color, opacity = 0.8, radius = 0.018 }) {
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.045, 8, false]} />
        <meshStandardMaterial color="#082631" metalness={0.58} roughness={0.3} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 72, radius, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </mesh>
    </group>
  )
}

function WebProductCamera({ lifecycleRef }) {
  const { camera, size } = useThree()
  const runtime = useSceneRuntime()
  const targetRef = useRef(new THREE.Vector3(0, -0.05, -0.2))
  const desiredPosition = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const positions = useMemo(() => ({
    wide: new THREE.Vector3(5.35, 2.9, 8.8),
    close: new THREE.Vector3(2.4, 1.2, 6.2),
    orbit: new THREE.Vector3(-4.25, 2.35, 7.35),
    responsive: new THREE.Vector3(4.55, 1.65, 7.05),
    compactWide: new THREE.Vector3(5.1, 4.25, 11.75),
    compactClose: new THREE.Vector3(3.05, 2.6, 9.2),
    compactOrbit: new THREE.Vector3(-4.55, 3.8, 10.2),
    compactResponsive: new THREE.Vector3(4.8, 3.1, 9.5),
    closeTarget: new THREE.Vector3(-0.55, 0.08, 0.12),
    orbitTarget: new THREE.Vector3(-0.55, 0.1, -0.76),
    responsiveTarget: new THREE.Vector3(0.82, -0.22, 0.66),
  }), [])

  useFrame((_, delta) => {
    const lifecycle = lifecycleRef.current
    if (lifecycle.currentKey !== 'web-software') return
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const compact = size.width < 560 || size.width / Math.max(size.height, 1) < 0.82
    const wide = compact ? positions.compactWide : positions.wide
    const close = compact ? positions.compactClose : positions.close
    const orbit = compact ? positions.compactOrbit : positions.orbit
    const responsive = compact ? positions.compactResponsive : positions.responsive
    const closeWeight = runtime.reducedMotion ? 0 : smoothstep(2.6, 3.7, time) * (1 - smoothstep(4.45, 5.15, time))
    const orbitWeight = runtime.reducedMotion ? 0 : smoothstep(4.55, 5.35, time) * (1 - smoothstep(6.55, 7.15, time))
    const responsiveWeight = runtime.reducedMotion ? 0 : smoothstep(6.65, 7.3, time) * (1 - smoothstep(9.45, 10.35, time))
    const exitPullback = lifecycle.phase === SCENE_PHASES.EXIT ? easeInCubic(lifecycle.progress) : 0

    desiredPosition.current.copy(wide).lerp(close, closeWeight).lerp(orbit, orbitWeight).lerp(responsive, responsiveWeight)
    desiredPosition.current.z += exitPullback * 2.4
    desiredTarget.current
      .set(-0.05, -0.12, -0.12)
      .lerp(positions.closeTarget, closeWeight)
      .lerp(positions.orbitTarget, orbitWeight)
      .lerp(positions.responsiveTarget, responsiveWeight)

    const speed = runtime.reducedMotion ? 20 : 3.1
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

export default function WebProductScene({ lifecycleRef }) {
  const runtime = useSceneRuntime()
  const rootRef = useRef(null)
  const layerRefs = useRef([])
  const layerMaterialRefs = useRef([])
  const desktopRef = useRef(null)
  const tabletRef = useRef(null)
  const phoneRef = useRef(null)
  const uiPartRefs = useRef([])
  const desktopRingRef = useRef(null)
  const tabletRingRef = useRef(null)
  const pipelineRef = useRef(null)
  const responsiveRoutesRef = useRef(null)
  const systemPacketsRef = useRef(null)
  const responsivePacketsRef = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const point = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock }, delta) => {
    const lifecycle = lifecycleRef.current
    const isWeb = lifecycle.currentKey === 'web-software'
    const time = lifecycleTime(lifecycle, runtime.reducedMotion)
    const elapsed = clock.getElapsedTime()
    const exitFactor = lifecycle.phase === SCENE_PHASES.EXIT && isWeb
      ? 1 - easeInCubic(lifecycle.progress)
      : 1
    const visible = isWeb ? exitFactor : 0

    if (rootRef.current) {
      rootRef.current.scale.setScalar(damp(rootRef.current.scale.x, Math.max(0.001, visible), 7.5, delta))
      rootRef.current.position.y = damp(
        rootRef.current.position.y,
        isWeb && runtime.running && !runtime.reducedMotion && time > 10.4 ? Math.sin(elapsed * 0.38) * 0.026 : 0,
        4,
        delta,
      )
    }

    LAYERS.forEach((layer, index) => {
      const node = layerRefs.current[index]
      if (!node) return
      let assembly = easeOutCubic(smoothstep(layer.start, layer.end, time)) * exitFactor
      if (!isWeb) assembly = 0
      node.position.set(
        THREE.MathUtils.lerp(layer.exploded[0], layer.assembled[0], assembly),
        THREE.MathUtils.lerp(layer.exploded[1], layer.assembled[1], assembly),
        THREE.MathUtils.lerp(layer.exploded[2], layer.assembled[2], assembly),
      )
      node.rotation.set(
        (1 - assembly) * (index % 2 ? -0.52 : 0.46),
        (1 - assembly) * (index % 2 ? 0.84 : -0.82),
        (1 - assembly) * (index - 1.5) * 0.18,
      )
      const material = layerMaterialRefs.current[index]
      if (material) material.emissiveIntensity = 0.06 + assembly * (0.1 + Math.sin(elapsed * 1.5 + index) * 0.025)
    })

    const desktopAssembly = isWeb ? easeOutCubic(smoothstep(1.45, 2.65, time)) * exitFactor : 0
    if (desktopRef.current) {
      desktopRef.current.position.set(
        THREE.MathUtils.lerp(-3.8, -0.42, desktopAssembly),
        THREE.MathUtils.lerp(-2.5, 0.02, desktopAssembly),
        THREE.MathUtils.lerp(4.1, 0.24, desktopAssembly),
      )
      desktopRef.current.rotation.set(
        (1 - desktopAssembly) * -0.34,
        THREE.MathUtils.lerp(-0.88, -0.025, desktopAssembly),
        (1 - desktopAssembly) * 0.16,
      )
    }

    UI_PARTS.forEach((part, index) => {
      const node = uiPartRefs.current[index]
      if (!node) return
      const assembly = isWeb ? easeOutCubic(smoothstep(part.start, part.end, time)) * exitFactor : 0
      node.position.set(
        THREE.MathUtils.lerp(part.exploded[0], part.assembled[0], assembly),
        THREE.MathUtils.lerp(part.exploded[1], part.assembled[1], assembly),
        THREE.MathUtils.lerp(part.exploded[2], part.assembled[2], assembly),
      )
      node.rotation.z = (1 - assembly) * (index % 2 ? -0.2 : 0.18)
      node.scale.setScalar(Math.max(0.001, assembly))
    })

    const tabletAssembly = isWeb ? easeOutCubic(smoothstep(6.35, 7.55, time)) * exitFactor : 0
    if (tabletRef.current) {
      tabletRef.current.position.set(
        THREE.MathUtils.lerp(5.2, 2.48, tabletAssembly),
        THREE.MathUtils.lerp(2.3, -0.2, tabletAssembly),
        THREE.MathUtils.lerp(4.5, 1.18, tabletAssembly),
      )
      tabletRef.current.rotation.set(
        THREE.MathUtils.lerp(-0.5, -0.035, tabletAssembly),
        THREE.MathUtils.lerp(0.92, -0.24, tabletAssembly),
        THREE.MathUtils.lerp(-0.25, 0.018, tabletAssembly),
      )
      tabletRef.current.scale.setScalar(Math.max(0.001, tabletAssembly))
    }

    const phoneAssembly = isWeb ? easeOutCubic(smoothstep(6.92, 8.08, time)) * exitFactor : 0
    if (phoneRef.current) {
      phoneRef.current.position.set(
        THREE.MathUtils.lerp(3.8, 1.42, phoneAssembly),
        THREE.MathUtils.lerp(-3.4, -1.08, phoneAssembly),
        THREE.MathUtils.lerp(4.8, 1.86, phoneAssembly),
      )
      phoneRef.current.rotation.set(
        THREE.MathUtils.lerp(0.48, -0.02, phoneAssembly),
        THREE.MathUtils.lerp(-0.78, -0.16, phoneAssembly),
        THREE.MathUtils.lerp(0.32, -0.02, phoneAssembly),
      )
      phoneRef.current.scale.setScalar(Math.max(0.001, phoneAssembly))
    }

    if (desktopRingRef.current) desktopRingRef.current.rotation.z = runtime.running && isWeb ? elapsed * 0.42 : 0.35
    if (tabletRingRef.current) tabletRingRef.current.rotation.z = runtime.running && isWeb ? -elapsed * 0.36 : -0.2

    const pipelineReveal = isWeb ? smoothstep(1.7, 2.8, time) * exitFactor : 0
    if (pipelineRef.current) pipelineRef.current.scale.setScalar(damp(pipelineRef.current.scale.x, Math.max(0.001, pipelineReveal), 6.8, delta))
    const responsiveReveal = isWeb ? smoothstep(7.15, 8.05, time) * exitFactor : 0
    if (responsiveRoutesRef.current) responsiveRoutesRef.current.scale.setScalar(damp(responsiveRoutesRef.current.scale.x, Math.max(0.001, responsiveReveal), 6.5, delta))

    if (systemPacketsRef.current) {
      for (let index = 0; index < 9; index += 1) {
        const progress = runtime.reducedMotion
          ? (index + 1) / 10
          : ((Math.max(0, time - 1.8) * (time < 10.4 ? 0.16 : 0.055) + index / 9) % 1)
        PIPELINE_CURVE.getPointAt(progress, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(isWeb ? pipelineReveal * (index % 3 === 0 ? 0.95 : 0.68) : 0.001)
        dummy.rotation.set(progress * 3, progress * 4, 0)
        dummy.updateMatrix()
        systemPacketsRef.current.setMatrixAt(index, dummy.matrix)
      }
      systemPacketsRef.current.instanceMatrix.needsUpdate = true
    }

    if (responsivePacketsRef.current) {
      for (let index = 0; index < 6; index += 1) {
        const local = runtime.reducedMotion
          ? (index + 1) / 7
          : ((Math.max(0, time - 7.2) * (time < 10.2 ? 0.3 : 0.08) + index / 6) % 1)
        const curve = index < 3 ? DESKTOP_TABLET_CURVE : TABLET_PHONE_CURVE
        curve.getPointAt(local, point)
        dummy.position.copy(point)
        dummy.scale.setScalar(isWeb ? responsiveReveal * 0.82 : 0.001)
        dummy.rotation.set(0, 0, local * 4)
        dummy.updateMatrix()
        responsivePacketsRef.current.setMatrixAt(index, dummy.matrix)
      }
      responsivePacketsRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <WebProductCamera lifecycleRef={lifecycleRef} />
      <group ref={rootRef} scale={0.001}>
        {LAYERS.map((layer, index) => (
          <group key={layer.type} ref={(node) => { layerRefs.current[index] = node }}>
            <SystemLayer layer={layer} materialRefs={layerMaterialRefs} index={index} />
          </group>
        ))}

        <BrowserDevice deviceRef={desktopRef} partRefs={uiPartRefs} ringRef={desktopRingRef} />
        <TabletDevice deviceRef={tabletRef} ringRef={tabletRingRef} />
        <PhoneDevice deviceRef={phoneRef} />

        <group ref={pipelineRef} scale={0.001}>
          <Route curve={PIPELINE_CURVE} color={SCENE_COLORS.teal} radius={0.016} opacity={0.86} />
        </group>
        <group ref={responsiveRoutesRef} scale={0.001}>
          <Route curve={DESKTOP_TABLET_CURVE} color={SCENE_COLORS.orange} radius={0.014} opacity={0.9} />
          <Route curve={TABLET_PHONE_CURVE} color={SCENE_COLORS.teal} radius={0.013} opacity={0.84} />
        </group>

        <instancedMesh ref={systemPacketsRef} args={[null, null, 9]} frustumCulled={false}>
          <boxGeometry args={[0.075, 0.075, 0.075]} />
          <meshBasicMaterial color={SCENE_COLORS.cyan} toneMapped={false} />
        </instancedMesh>
        <instancedMesh ref={responsivePacketsRef} args={[null, null, 6]} frustumCulled={false}>
          <octahedronGeometry args={[0.065, 0]} />
          <meshBasicMaterial color={SCENE_COLORS.orange} toneMapped={false} />
        </instancedMesh>

        <mesh position={[-0.3, -2.09, -0.4]} receiveShadow>
          <boxGeometry args={[6.5, 0.08, 3.7]} />
          <meshStandardMaterial color="#05131c" metalness={0.5} roughness={0.38} transparent opacity={0.72} />
        </mesh>
        <Sparkles
          count={runtime.quality === 'high' ? 26 : 10}
          color={SCENE_COLORS.blue}
          opacity={0.2}
          scale={[7.2, 4.8, 4.8]}
          size={runtime.quality === 'high' ? 1 : 0.72}
          speed={runtime.running && !runtime.reducedMotion ? 0.08 : 0}
          noise={0.6}
        />
      </group>
    </>
  )
}

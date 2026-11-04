import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges, Float, Line, RoundedBox, Sparkles } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

const COLORS = {
  navy: '#06131f',
  deep: '#082232',
  panel: '#0b3042',
  teal: '#22d3d8',
  cyan: '#8cf3f4',
  blue: '#3d8fc9',
  orange: '#ff762b',
  amber: '#ffb067',
  white: '#dffbfc',
}

const DATA_STREAMS = [
  [[-3.5, 1.25, 0], [-2.65, 1.15, 0.25], [-1.82, 0.62, 0.08], [-0.95, 0.42, 0]],
  [[-3.5, 0.15, 0.12], [-2.7, 0.18, -0.15], [-1.92, 0.18, 0.16], [-0.95, 0.38, 0]],
  [[-3.5, -0.95, 0], [-2.72, -0.78, 0.2], [-1.86, -0.18, -0.04], [-0.95, 0.34, 0]],
]

const DATA_OUTPUT_STREAM = [[-0.55, 0.42, 0], [0.1, 0.55, 0.1], [0.65, 0.26, 0], [1.2, 0.15, 0]]
const DATA_DASHBOARD_STREAM = [[1.75, 0.15, 0], [2.2, 0.23, 0.08], [2.55, 0.48, 0], [2.85, 0.52, 0]]
const AI_INPUT_STREAM = [[-3.25, 0.22, 0], [-2.35, 0.28, 0.16], [-1.55, 0.1, 0], [-0.82, 0, 0]]
const AI_REVIEW_STREAM = [[0.75, 0, 0], [1.3, 0.22, 0.12], [1.75, 0.25, 0]]
const AI_OUTPUT_STREAM = [[2.36, 0.25, 0], [2.72, 0.15, 0.08], [3.12, 0.08, 0]]

const MLOPS_ORBIT_POINTS = Array.from({ length: 81 }, (_, index) => {
  const angle = index / 80 * Math.PI * 2
  return [Math.cos(angle) * 3.15, Math.sin(angle) * 1.82, Math.sin(angle * 2) * 0.18]
})

const NEURAL_NODES = [
  [-0.58, 0.38, 0.18], [0, 0.72, -0.08], [0.56, 0.38, 0.22],
  [-0.7, -0.18, -0.12], [0, 0.05, 0.55], [0.7, -0.16, -0.04],
  [-0.42, -0.62, 0.18], [0.2, -0.7, -0.16], [0.38, -0.15, -0.5],
]

const NEURAL_EDGES = [
  [0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [2, 4], [2, 5],
  [3, 4], [4, 5], [3, 6], [4, 6], [4, 7], [5, 7], [4, 8], [5, 8],
]

const LABELS = {
  'data-engineering': 'Animated data-engineering pipeline with sources, transformation, storage, and reporting',
  mlops: 'Animated MLOps lifecycle with a central model, orbital delivery stages, and monitoring',
  'web-software': 'Animated custom-software system assembling responsive devices and interface layers',
  'ai-solutions': 'Animated AI workflow connecting source documents, a neural core, human review, and output',
}

function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    camera.position.z = aspect < 0.9 ? 13.4 : aspect < 1.25 ? 11.6 : 10.1
    camera.updateProjectionMatrix()
  }, [camera, size.height, size.width])

  return null
}

function AssemblyGroup({ active, children, delay = 0, from = [0, 0, 1.8], spin = [0.35, -0.45, 0.16] }) {
  const groupRef = useRef(null)
  const progressRef = useRef(active ? -delay : 1)

  useEffect(() => {
    progressRef.current = active ? -delay : 1
  }, [active, delay])

  useFrame(({ clock }, delta) => {
    const group = groupRef.current
    if (!group) return

    progressRef.current = active ? Math.min(1, progressRef.current + delta * 0.92) : 1
    const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1)
    const eased = 1 - ((1 - progress) ** 3)
    const idle = active && progress > 0.98 ? Math.sin(clock.elapsedTime * 0.72 + delay * 5) * 0.025 : 0

    group.position.set(
      from[0] * (1 - eased),
      from[1] * (1 - eased) + idle,
      from[2] * (1 - eased),
    )
    group.rotation.set(
      spin[0] * (1 - eased),
      spin[1] * (1 - eased),
      spin[2] * (1 - eased),
    )
    group.scale.setScalar(0.58 + eased * 0.42)
  })

  return <group ref={groupRef}>{children}</group>
}

function MotionRig({ active, children }) {
  const groupRef = useRef(null)

  useFrame(({ clock, pointer }, delta) => {
    const group = groupRef.current
    if (!group) return

    const targetX = active ? pointer.y * 0.065 : 0
    const targetY = active ? pointer.x * 0.11 : 0
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 3.2, delta)
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 3.2, delta)
    group.rotation.z = active ? Math.sin(clock.elapsedTime * 0.21) * 0.008 : 0
    group.position.y = active ? Math.sin(clock.elapsedTime * 0.38) * 0.035 : 0
  })

  return <group ref={groupRef}>{children}</group>
}

function SceneAtmosphere({ active }) {
  const ringsRef = useRef(null)

  useFrame(({ clock }) => {
    if (!ringsRef.current) return
    ringsRef.current.rotation.z = active ? clock.elapsedTime * 0.018 : 0
    ringsRef.current.rotation.x = active ? Math.sin(clock.elapsedTime * 0.18) * 0.035 : 0
  })

  return (
    <group>
      <group ref={ringsRef} position={[0, 0, -1.45]} rotation={[1.02, 0.15, 0]}>
        {[2.65, 3.65, 4.65].map((radius, index) => (
          <mesh key={radius}>
            <torusGeometry args={[radius, index === 1 ? 0.012 : 0.007, 5, 128]} />
            <meshBasicMaterial
              color={index === 1 ? COLORS.orange : COLORS.teal}
              transparent
              opacity={index === 1 ? 0.14 : 0.1}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <gridHelper
        args={[12, 30, COLORS.teal, COLORS.blue]}
        position={[0, -2.5, -1.9]}
        rotation={[0.08, 0, 0]}
        material-transparent
        material-opacity={0.055}
      />
      <Sparkles
        count={58}
        color={COLORS.cyan}
        opacity={0.34}
        scale={[9.5, 5.3, 4]}
        size={1.25}
        speed={active ? 0.22 : 0}
        noise={0.7}
      />
      <Sparkles
        count={12}
        color={COLORS.orange}
        opacity={0.42}
        scale={[8, 4.5, 3]}
        size={1.8}
        speed={active ? 0.16 : 0}
        noise={0.45}
      />
    </group>
  )
}

function PacketStream({ active, color = COLORS.teal, count = 4, points, width = 1.2 }) {
  const packetsRef = useRef(null)
  const lineRef = useRef(null)
  const transform = useMemo(() => new THREE.Object3D(), [])
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))),
    [points],
  )

  useEffect(() => {
    packetsRef.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  }, [])

  useFrame(({ clock }, delta) => {
    if (active && lineRef.current?.material) lineRef.current.material.dashOffset -= delta * 0.48
    if (!packetsRef.current) return

    const time = active ? clock.elapsedTime * 0.12 : 0.62
    for (let index = 0; index < count; index += 1) {
      const position = curve.getPoint((time + index / count) % 1)
      transform.position.copy(position)
      transform.scale.setScalar(index % 3 === 0 ? 1.22 : 0.88)
      transform.updateMatrix()
      packetsRef.current.setMatrixAt(index, transform.matrix)
    }
    packetsRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color={color}
        lineWidth={width}
        transparent
        opacity={0.46}
        dashed
        dashScale={2}
        dashSize={0.16}
        gapSize={0.1}
      />
      <instancedMesh ref={packetsRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[0.046, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

function GlassModule({ accent = COLORS.teal, position, scale = [0.72, 0.46, 0.28] }) {
  return (
    <group position={position}>
      <RoundedBox args={scale} radius={0.08} smoothness={3}>
        <meshPhysicalMaterial
          color={COLORS.panel}
          emissive={accent}
          emissiveIntensity={0.09}
          metalness={0.48}
          roughness={0.3}
          transparent
          opacity={0.94}
          clearcoat={0.75}
        />
        <Edges color={accent} opacity={0.62} transparent />
      </RoundedBox>
      <mesh position={[-scale[0] * 0.31, 0, scale[2] * 0.53]}>
        <circleGeometry args={[0.035, 10]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <mesh position={[scale[0] * 0.06, 0, scale[2] * 0.53]}>
        <planeGeometry args={[scale[0] * 0.45, 0.018]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.52} />
      </mesh>
    </group>
  )
}

function Dashboard({ position = [0, 0, 0], scale = 1 }) {
  const bars = [0.32, 0.62, 0.43, 0.8, 0.58]

  return (
    <group position={position} scale={scale}>
      <RoundedBox args={[1.55, 1.18, 0.16]} radius={0.08} smoothness={3}>
        <meshPhysicalMaterial color={COLORS.deep} metalness={0.32} roughness={0.3} clearcoat={0.6} />
        <Edges color={COLORS.teal} transparent opacity={0.62} />
      </RoundedBox>
      <mesh position={[-0.45, 0.31, 0.095]}>
        <planeGeometry args={[0.46, 0.025]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.74} />
      </mesh>
      <mesh position={[0.37, 0.31, 0.095]}>
        <planeGeometry args={[0.58, 0.025]} />
        <meshBasicMaterial color={COLORS.blue} transparent opacity={0.4} />
      </mesh>
      {bars.map((height, index) => (
        <RoundedBox
          key={`${height}-${index}`}
          args={[0.12, height, 0.035]}
          radius={0.025}
          position={[-0.47 + index * 0.22, -0.39 + height / 2, 0.105]}
        >
          <meshBasicMaterial color={index === 3 ? COLORS.orange : COLORS.teal} toneMapped={false} />
        </RoundedBox>
      ))}
      <Line
        points={[[0.22, -0.15, 0.115], [0.4, 0.02, 0.115], [0.56, -0.05, 0.115], [0.7, 0.18, 0.115]]}
        color={COLORS.orange}
        lineWidth={1.6}
      />
    </group>
  )
}

function DataEngineeringScene({ active }) {
  return (
    <MotionRig active={active}>
      <AssemblyGroup active={active} from={[-1.2, 0, 1.4]} spin={[0.1, -0.65, 0.08]}>
        <GlassModule position={[-3.5, 1.25, 0]} />
        <GlassModule position={[-3.5, 0.15, 0.12]} accent={COLORS.blue} />
        <GlassModule position={[-3.5, -0.95, 0]} accent={COLORS.orange} />
      </AssemblyGroup>

      {DATA_STREAMS.map((points, index) => (
        <PacketStream
          key={points[0][1]}
          active={active}
          points={points}
          color={index === 2 ? COLORS.orange : COLORS.teal}
          count={3}
        />
      ))}

      <AssemblyGroup active={active} delay={0.14} from={[0, -1.2, 1.8]}>
        <group position={[-0.72, 0.38, 0]}>
          <RoundedBox args={[1.05, 1.05, 0.58]} radius={0.14} smoothness={4}>
            <meshPhysicalMaterial
              color={COLORS.panel}
              emissive={COLORS.teal}
              emissiveIntensity={0.13}
              metalness={0.6}
              roughness={0.22}
              clearcoat={0.8}
            />
            <Edges color={COLORS.cyan} opacity={0.74} transparent />
          </RoundedBox>
          {[-0.26, 0, 0.26].map((y, index) => (
            <mesh key={y} position={[0, y, 0.31]}>
              <planeGeometry args={[0.6 - index * 0.08, 0.035]} />
              <meshBasicMaterial color={index === 1 ? COLORS.orange : COLORS.teal} />
            </mesh>
          ))}
          <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, -0.4]}>
            <torusGeometry args={[0.7, 0.022, 8, 48]} />
            <meshBasicMaterial color={COLORS.teal} transparent opacity={0.28} />
          </mesh>
        </group>
      </AssemblyGroup>

      <PacketStream active={active} points={DATA_OUTPUT_STREAM} color={COLORS.cyan} count={4} />

      <AssemblyGroup active={active} delay={0.3} from={[0.8, 1.4, 1.2]} spin={[0.5, 0.3, -0.2]}>
        <group position={[1.46, 0.15, 0]}>
          {[-0.33, 0, 0.33].map((y, index) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.46, 0.46, 0.2, 40]} />
              <meshPhysicalMaterial
                color={index === 1 ? '#0d4054' : COLORS.deep}
                emissive={index === 2 ? COLORS.orange : COLORS.teal}
                emissiveIntensity={0.1}
                metalness={0.56}
                roughness={0.28}
              />
            </mesh>
          ))}
          <mesh position={[0, 0.47, 0]}>
            <torusGeometry args={[0.34, 0.025, 8, 48]} />
            <meshBasicMaterial color={COLORS.orange} toneMapped={false} />
          </mesh>
        </group>
      </AssemblyGroup>

      <PacketStream active={active} points={DATA_DASHBOARD_STREAM} color={COLORS.orange} count={3} />

      <AssemblyGroup active={active} delay={0.46} from={[1.2, -0.8, 2]} spin={[-0.3, 0.5, 0.12]}>
        <Dashboard position={[3.45, 0.52, 0]} scale={0.88} />
      </AssemblyGroup>
    </MotionRig>
  )
}

function StageNode({ accent, position, variant = 0 }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.72, 0.5, 0.3]} radius={0.09} smoothness={3}>
        <meshPhysicalMaterial
          color={COLORS.deep}
          emissive={accent}
          emissiveIntensity={0.11}
          metalness={0.55}
          roughness={0.27}
          clearcoat={0.7}
        />
        <Edges color={accent} transparent opacity={0.62} />
      </RoundedBox>
      {variant % 2 === 0 ? (
        [-0.13, 0, 0.13].map((x, index) => (
          <mesh key={x} position={[x, -0.04 + index * 0.035, 0.17]}>
            <boxGeometry args={[0.07, 0.18 + index * 0.055, 0.025]} />
            <meshBasicMaterial color={index === 2 ? COLORS.orange : accent} />
          </mesh>
        ))
      ) : (
        <group position={[0, 0, 0.17]}>
          <mesh><ringGeometry args={[0.08, 0.12, 20]} /><meshBasicMaterial color={accent} /></mesh>
          <mesh position={[0.2, 0, 0]}><circleGeometry args={[0.035, 12]} /><meshBasicMaterial color={COLORS.orange} /></mesh>
          <Line points={[[0.1, 0, 0.01], [0.16, 0, 0.01]]} color={COLORS.cyan} lineWidth={1} />
        </group>
      )}
    </group>
  )
}

function MLOpsOrbit({ active }) {
  const orbitRef = useRef(null)
  const nodePositions = useMemo(() => (
    Array.from({ length: 6 }, (_, index) => {
      const angle = index / 6 * Math.PI * 2
      return [Math.cos(angle) * 3.15, Math.sin(angle) * 1.82, Math.sin(angle * 2) * 0.18]
    })
  ), [])

  useFrame(({ clock }) => {
    if (!orbitRef.current) return
    orbitRef.current.rotation.z = active ? Math.sin(clock.elapsedTime * 0.2) * 0.025 : 0
    orbitRef.current.rotation.y = active ? clock.elapsedTime * 0.035 : 0
  })

  return (
    <group ref={orbitRef}>
      <Line points={MLOPS_ORBIT_POINTS} color={COLORS.teal} lineWidth={1.15} transparent opacity={0.42} />
      <Line points={MLOPS_ORBIT_POINTS.map(([x, y, z]) => [x * 0.76, y * 0.76, z - 0.04])} color={COLORS.orange} lineWidth={0.65} transparent opacity={0.24} />
      {nodePositions.map((position, index) => (
        <AssemblyGroup
          key={position.join('-')}
          active={active}
          delay={0.08 + index * 0.075}
          from={[position[0] * 0.42, position[1] * 0.42, 1.35]}
          spin={[0.25, -0.45, index % 2 ? 0.3 : -0.3]}
        >
          <StageNode
            position={position}
            accent={index === 4 ? COLORS.orange : COLORS.teal}
            variant={index}
          />
        </AssemblyGroup>
      ))}
    </group>
  )
}

function ModelCore({ active }) {
  const crystalRef = useRef(null)
  const ringsRef = useRef(null)

  useFrame(({ clock }) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.x = active ? clock.elapsedTime * 0.28 : 0.42
      crystalRef.current.rotation.y = active ? clock.elapsedTime * 0.42 : 0.68
    }
    if (ringsRef.current) ringsRef.current.rotation.z = active ? -clock.elapsedTime * 0.24 : 0.2
  })

  return (
    <group>
      <RoundedBox args={[1.62, 1.32, 0.58]} radius={0.2} smoothness={4}>
        <meshPhysicalMaterial
          color={COLORS.deep}
          emissive={COLORS.teal}
          emissiveIntensity={0.12}
          metalness={0.72}
          roughness={0.2}
          clearcoat={0.86}
          transparent
          opacity={0.95}
        />
        <Edges color={COLORS.cyan} transparent opacity={0.72} />
      </RoundedBox>
      <mesh ref={crystalRef} position={[0, 0, 0.44]}>
        <octahedronGeometry args={[0.39, 1]} />
        <meshPhysicalMaterial
          color={COLORS.orange}
          emissive={COLORS.orange}
          emissiveIntensity={1.15}
          metalness={0.38}
          roughness={0.16}
          clearcoat={1}
          toneMapped={false}
        />
      </mesh>
      <group ref={ringsRef} rotation={[0.9, 0.2, 0.2]}>
        <mesh><torusGeometry args={[0.72, 0.018, 8, 64]} /><meshBasicMaterial color={COLORS.cyan} /></mesh>
        <mesh rotation={[0.55, 0.25, 0.75]}><torusGeometry args={[0.9, 0.012, 8, 64]} /><meshBasicMaterial color={COLORS.orange} transparent opacity={0.7} /></mesh>
      </group>
    </group>
  )
}

function MonitorPanel({ active }) {
  const signalRef = useRef(null)

  useFrame(({ clock }) => {
    if (!signalRef.current) return
    signalRef.current.position.x = active ? Math.sin(clock.elapsedTime * 1.15) * 0.08 : 0
  })

  return (
    <group position={[2.35, -1.55, 0.28]} rotation={[-0.05, -0.14, 0]}>
      <RoundedBox args={[1.6, 0.68, 0.14]} radius={0.08}>
        <meshPhysicalMaterial color={COLORS.deep} metalness={0.42} roughness={0.3} clearcoat={0.65} />
        <Edges color={COLORS.orange} transparent opacity={0.58} />
      </RoundedBox>
      <group ref={signalRef} position={[0, 0, 0.085]}>
        <Line
          points={[[-0.62, 0], [-0.44, 0.02], [-0.3, 0.17], [-0.16, -0.12], [0.02, 0.1], [0.2, 0.04], [0.38, 0.2], [0.63, 0.08]]}
          color={COLORS.orange}
          lineWidth={1.65}
        />
      </group>
      <mesh position={[-0.55, -0.22, 0.09]}><circleGeometry args={[0.035, 10]} /><meshBasicMaterial color={COLORS.teal} /></mesh>
      <mesh position={[0.55, -0.22, 0.09]}><planeGeometry args={[0.48, 0.025]} /><meshBasicMaterial color={COLORS.cyan} transparent opacity={0.48} /></mesh>
    </group>
  )
}

function MLOpsScene({ active }) {
  return (
    <MotionRig active={active}>
      <MLOpsOrbit active={active} />
      <AssemblyGroup active={active} delay={0.03} from={[0, 0, 2.6]} spin={[0.75, -0.8, 0.3]}>
        <Float speed={active ? 1.1 : 0} floatIntensity={active ? 0.18 : 0} rotationIntensity={active ? 0.08 : 0}>
          <ModelCore active={active} />
        </Float>
      </AssemblyGroup>
      <AssemblyGroup active={active} delay={0.55} from={[0.8, -0.8, 1.6]} spin={[-0.2, 0.45, -0.18]}>
        <MonitorPanel active={active} />
      </AssemblyGroup>
      <PacketStream
        active={active}
        points={MLOPS_ORBIT_POINTS}
        color={COLORS.orange}
        count={7}
        width={0.5}
      />
    </MotionRig>
  )
}

function InterfaceLayer({ accent = COLORS.teal, position, size = [1.55, 0.92] }) {
  return (
    <group position={position}>
      <RoundedBox args={[size[0], size[1], 0.075]} radius={0.06} smoothness={3}>
        <meshPhysicalMaterial
          color={COLORS.panel}
          emissive={accent}
          emissiveIntensity={0.09}
          transparent
          opacity={0.7}
          roughness={0.24}
          metalness={0.35}
          clearcoat={0.8}
          depthWrite={false}
        />
        <Edges color={accent} transparent opacity={0.56} />
      </RoundedBox>
      <mesh position={[-size[0] * 0.26, size[1] * 0.24, 0.05]}>
        <planeGeometry args={[size[0] * 0.3, 0.025]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.72} />
      </mesh>
      {[-0.16, 0.03, 0.22].map((y, index) => (
        <RoundedBox
          key={y}
          args={[size[0] * (index === 1 ? 0.58 : 0.72), 0.075, 0.018]}
          radius={0.015}
          position={[index === 1 ? 0.06 : 0, y, 0.052]}
        >
          <meshBasicMaterial color={index === 2 ? accent : COLORS.blue} transparent opacity={0.54} />
        </RoundedBox>
      ))}
    </group>
  )
}

function DesktopDevice({ active }) {
  const layersRef = useRef(null)

  useFrame(({ clock }) => {
    if (!layersRef.current) return
    layersRef.current.position.z = active ? Math.sin(clock.elapsedTime * 0.6) * 0.05 : 0
  })

  return (
    <group>
      <RoundedBox args={[3.15, 2.08, 0.2]} radius={0.13} smoothness={4}>
        <meshPhysicalMaterial color="#071d2a" metalness={0.62} roughness={0.24} clearcoat={0.86} />
        <Edges color={COLORS.teal} transparent opacity={0.68} />
      </RoundedBox>
      <RoundedBox args={[2.78, 1.7, 0.04]} radius={0.06} position={[0, 0.04, 0.12]}>
        <meshBasicMaterial color="#0a2c3d" />
      </RoundedBox>
      <group ref={layersRef}>
        <InterfaceLayer position={[-0.42, 0.18, 0.22]} size={[1.65, 1.02]} />
        <InterfaceLayer position={[0.42, -0.05, 0.38]} size={[1.6, 0.92]} accent={COLORS.orange} />
        <InterfaceLayer position={[0.08, -0.26, 0.54]} size={[1.35, 0.7]} accent={COLORS.cyan} />
      </group>
      <mesh position={[0, -1.32, -0.05]}>
        <boxGeometry args={[0.18, 0.55, 0.18]} />
        <meshStandardMaterial color="#102f3d" metalness={0.65} roughness={0.3} />
      </mesh>
      <RoundedBox args={[1.18, 0.12, 0.58]} radius={0.055} position={[0, -1.62, 0.04]}>
        <meshStandardMaterial color="#0b2533" metalness={0.62} roughness={0.28} />
      </RoundedBox>
    </group>
  )
}

function MobileDevice({ accent = COLORS.orange, position, rotation = [0, 0, 0], size = [0.82, 1.62] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[size[0], size[1], 0.18]} radius={0.14} smoothness={4}>
        <meshPhysicalMaterial color="#071d2a" metalness={0.58} roughness={0.22} clearcoat={0.9} />
        <Edges color={accent} transparent opacity={0.72} />
      </RoundedBox>
      <RoundedBox args={[size[0] * 0.78, size[1] * 0.76, 0.025]} radius={0.06} position={[0, 0, 0.105]}>
        <meshBasicMaterial color={COLORS.panel} />
      </RoundedBox>
      <mesh position={[0, size[1] * 0.31, 0.125]}>
        <planeGeometry args={[size[0] * 0.46, 0.03]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {[0.14, -0.06, -0.26].map((y, index) => (
        <RoundedBox key={y} args={[size[0] * (0.58 + index * 0.08), 0.11, 0.022]} radius={0.025} position={[0, y, 0.126]}>
          <meshBasicMaterial color={index === 2 ? accent : COLORS.blue} transparent opacity={0.7} />
        </RoundedBox>
      ))}
    </group>
  )
}

function WebSoftwareScene({ active }) {
  return (
    <MotionRig active={active}>
      <AssemblyGroup active={active} delay={0.08} from={[0, 1.6, 2.7]} spin={[0.55, -0.7, 0.22]}>
        <Float speed={active ? 0.9 : 0} floatIntensity={active ? 0.12 : 0} rotationIntensity={active ? 0.035 : 0}>
          <DesktopDevice active={active} />
        </Float>
      </AssemblyGroup>
      <AssemblyGroup active={active} delay={0.33} from={[-1.6, -0.8, 2]} spin={[-0.25, 0.65, -0.32]}>
        <MobileDevice position={[-2.42, -0.42, 0.78]} rotation={[0.04, 0.28, 0.05]} accent={COLORS.teal} size={[0.86, 1.68]} />
      </AssemblyGroup>
      <AssemblyGroup active={active} delay={0.46} from={[1.6, -0.9, 2.2]} spin={[0.28, -0.62, 0.28]}>
        <MobileDevice position={[2.48, -0.48, 0.72]} rotation={[0.02, -0.28, -0.05]} size={[1.24, 1.7]} />
      </AssemblyGroup>
      <AssemblyGroup active={active} delay={0.6} from={[0, -1.1, 1.5]} spin={[-0.3, 0.2, 0.15]}>
        <group position={[0, -2.02, -0.1]}>
          {[-1.25, -0.72, -0.18, 0.38, 0.94].map((x, index) => (
            <group key={x} position={[x, Math.sin(index) * 0.08, 0]}>
              <mesh>
                <boxGeometry args={[0.24, 0.24, 0.24]} />
                <meshPhysicalMaterial
                  color={COLORS.deep}
                  emissive={index === 3 ? COLORS.orange : COLORS.teal}
                  emissiveIntensity={0.18}
                  metalness={0.5}
                  roughness={0.3}
                />
              </mesh>
              {index < 4 && <Line points={[[0.14, 0, 0], [0.42, 0.06, 0]]} color={index === 2 ? COLORS.orange : COLORS.teal} lineWidth={1} />}
            </group>
          ))}
        </group>
      </AssemblyGroup>
    </MotionRig>
  )
}

function DocumentCard({ accent = COLORS.teal, position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.92, 1.18, 0.09]} radius={0.055} smoothness={3}>
        <meshPhysicalMaterial
          color={COLORS.deep}
          emissive={accent}
          emissiveIntensity={0.07}
          metalness={0.3}
          roughness={0.32}
          clearcoat={0.72}
        />
        <Edges color={accent} transparent opacity={0.56} />
      </RoundedBox>
      {[0.3, 0.08, -0.14, -0.36].map((y, index) => (
        <mesh key={y} position={[-0.05 - (index % 2) * 0.08, y, 0.052]}>
          <planeGeometry args={[index === 0 ? 0.54 : 0.65, index === 0 ? 0.045 : 0.025]} />
          <meshBasicMaterial color={index === 0 ? accent : COLORS.cyan} transparent opacity={index === 0 ? 0.85 : 0.44} />
        </mesh>
      ))}
    </group>
  )
}

function NeuralCore({ active }) {
  const coreRef = useRef(null)
  const networkRef = useRef(null)

  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = active ? clock.elapsedTime * 0.2 : 0.25
      coreRef.current.rotation.y = active ? clock.elapsedTime * 0.3 : 0.48
    }
    if (networkRef.current) networkRef.current.rotation.z = active ? -clock.elapsedTime * 0.1 : 0
  })

  return (
    <group ref={networkRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.56, 2]} />
        <meshPhysicalMaterial
          color={COLORS.orange}
          emissive={COLORS.orange}
          emissiveIntensity={1.2}
          metalness={0.45}
          roughness={0.16}
          clearcoat={1}
          wireframe
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color={COLORS.amber} toneMapped={false} />
      </mesh>
      {NEURAL_EDGES.map(([fromIndex, toIndex]) => (
        <Line
          key={`${fromIndex}-${toIndex}`}
          points={[NEURAL_NODES[fromIndex], NEURAL_NODES[toIndex]]}
          color={fromIndex % 3 === 0 ? COLORS.orange : COLORS.teal}
          lineWidth={0.8}
          transparent
          opacity={0.55}
        />
      ))}
      {NEURAL_NODES.map((position, index) => (
        <mesh key={position.join('-')} position={position}>
          <sphereGeometry args={[index % 4 === 0 ? 0.075 : 0.05, 10, 10]} />
          <meshBasicMaterial color={index % 4 === 0 ? COLORS.orange : COLORS.cyan} toneMapped={false} />
        </mesh>
      ))}
      <mesh rotation={[0.82, 0.2, 0.1]}>
        <torusGeometry args={[1.02, 0.014, 8, 80]} />
        <meshBasicMaterial color={COLORS.teal} transparent opacity={0.62} />
      </mesh>
    </group>
  )
}

function ReviewPanel() {
  return (
    <group position={[2.05, 0.25, 0]}>
      <RoundedBox args={[1.08, 1.24, 0.12]} radius={0.09} smoothness={3}>
        <meshPhysicalMaterial color={COLORS.deep} metalness={0.4} roughness={0.28} clearcoat={0.7} />
        <Edges color={COLORS.orange} transparent opacity={0.76} />
      </RoundedBox>
      <mesh position={[0, 0.32, 0.07]}>
        <ringGeometry args={[0.18, 0.23, 28]} />
        <meshBasicMaterial color={COLORS.orange} />
      </mesh>
      <Line
        points={[[-0.1, 0.31, 0.085], [-0.02, 0.21, 0.085], [0.16, 0.43, 0.085]]}
        color={COLORS.cyan}
        lineWidth={2}
      />
      {[0.02, -0.2, -0.4].map((y, index) => (
        <mesh key={y} position={[0, y, 0.07]}>
          <planeGeometry args={[0.66 - index * 0.08, 0.025]} />
          <meshBasicMaterial color={index === 2 ? COLORS.orange : COLORS.teal} transparent opacity={0.58} />
        </mesh>
      ))}
    </group>
  )
}

function OutputPanel() {
  return (
    <group position={[3.45, 0.08, 0]} rotation={[0, -0.12, 0]}>
      <RoundedBox args={[0.9, 1.5, 0.13]} radius={0.08} smoothness={3}>
        <meshPhysicalMaterial color={COLORS.panel} metalness={0.35} roughness={0.3} clearcoat={0.7} />
        <Edges color={COLORS.teal} transparent opacity={0.66} />
      </RoundedBox>
      {[0.42, 0.15, -0.12, -0.39].map((y, index) => (
        <group key={y} position={[0, y, 0.08]}>
          <mesh position={[-0.25, 0, 0]}><circleGeometry args={[0.045, 10]} /><meshBasicMaterial color={index === 1 ? COLORS.orange : COLORS.teal} /></mesh>
          <mesh position={[0.1, 0, 0]}><planeGeometry args={[0.45 - index * 0.04, 0.035]} /><meshBasicMaterial color={COLORS.cyan} transparent opacity={0.48} /></mesh>
        </group>
      ))}
      <RoundedBox args={[0.58, 0.12, 0.025]} radius={0.025} position={[0, -0.62, 0.08]}>
        <meshBasicMaterial color={COLORS.orange} />
      </RoundedBox>
    </group>
  )
}

function AISolutionsScene({ active }) {
  return (
    <MotionRig active={active}>
      <AssemblyGroup active={active} from={[-1.3, 0.7, 1.6]} spin={[0.2, -0.6, 0.2]}>
        <DocumentCard position={[-3.45, 0.72, 0]} rotation={[0.05, 0.22, -0.06]} />
        <DocumentCard position={[-2.95, -0.52, 0.18]} rotation={[-0.03, 0.12, 0.08]} accent={COLORS.blue} />
      </AssemblyGroup>
      <PacketStream active={active} points={AI_INPUT_STREAM} color={COLORS.teal} count={5} />
      <AssemblyGroup active={active} delay={0.16} from={[0, 0, 2.5]} spin={[0.7, -0.8, 0.35]}>
        <Float speed={active ? 1.2 : 0} floatIntensity={active ? 0.24 : 0} rotationIntensity={active ? 0.12 : 0}>
          <NeuralCore active={active} />
        </Float>
      </AssemblyGroup>
      <PacketStream active={active} points={AI_REVIEW_STREAM} color={COLORS.orange} count={3} />
      <AssemblyGroup active={active} delay={0.38} from={[0.9, 1.2, 1.6]} spin={[0.32, 0.5, -0.2]}>
        <ReviewPanel />
      </AssemblyGroup>
      <PacketStream active={active} points={AI_OUTPUT_STREAM} color={COLORS.cyan} count={3} />
      <AssemblyGroup active={active} delay={0.56} from={[1.2, -1.1, 1.8]} spin={[-0.35, 0.55, 0.2]}>
        <OutputPanel />
      </AssemblyGroup>
    </MotionRig>
  )
}

function ServiceScene({ active, serviceId }) {
  if (serviceId === 'mlops') return <MLOpsScene active={active} />
  if (serviceId === 'web-software') return <WebSoftwareScene active={active} />
  if (serviceId === 'ai-solutions') return <AISolutionsScene active={active} />
  return <DataEngineeringScene active={active} />
}

export default function ServiceScene3D({ serviceId = 'data-engineering', animated = true, className = '' }) {
  const reduceMotion = useReducedMotion()
  const active = Boolean(animated) && !reduceMotion
  const classes = ['service-scene-3d', `service-scene-3d--${serviceId}`, className].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      role="img"
      aria-label={LABELS[serviceId] || LABELS['data-engineering']}
      style={{ height: '100%', minHeight: '280px', position: 'relative', width: '100%' }}
    >
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0.15, 10.1], fov: 42, near: 0.1, far: 40 }}
        dpr={[1, 1.5]}
        fallback={<div aria-hidden="true" />}
        frameloop={active ? 'always' : 'demand'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(COLORS.navy, 0)
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.08
        }}
      >
        <ResponsiveCamera />
        <fog attach="fog" args={[COLORS.navy, 8.5, 17]} />
        <ambientLight intensity={0.72} />
        <hemisphereLight args={[COLORS.cyan, COLORS.navy, 0.84]} />
        <spotLight position={[-4.5, 5.5, 6]} color={COLORS.teal} intensity={24} angle={0.48} penumbra={0.82} distance={18} />
        <spotLight position={[5, 2.8, 5]} color={COLORS.orange} intensity={18} angle={0.42} penumbra={0.9} distance={16} />
        <pointLight position={[0, -2.5, 4]} color={COLORS.blue} intensity={8} distance={12} />
        <Suspense fallback={null}>
          <SceneAtmosphere active={active} />
          <ServiceScene active={active} serviceId={serviceId} />
        </Suspense>
      </Canvas>
    </div>
  )
}

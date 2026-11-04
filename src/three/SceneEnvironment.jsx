import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import RestrainedBloom from './RestrainedBloom'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS } from './sceneTheme'

const DEFAULT_TARGET = [0, -0.08, 0]

function ResponsiveCamera({ sceneRadius = 3.25, target = DEFAULT_TARGET }) {
  const { camera, invalidate, size } = useThree()

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    const verticalFov = THREE.MathUtils.degToRad(camera.fov)
    const widthConstraint = Math.min(Math.max(aspect, 0.58), 1.15)
    const distance = sceneRadius / Math.tan(verticalFov / 2) / widthConstraint

    camera.position.set(
      aspect < 0.82 ? 0.28 : 0.62,
      aspect < 0.82 ? 0.72 : 0.46,
      distance * 1.02,
    )
    camera.lookAt(target[0], target[1], target[2])
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, invalidate, sceneRadius, size.height, size.width, target])

  return null
}

export default function SceneEnvironment({ sceneRadius, target = DEFAULT_TARGET }) {
  const runtime = useSceneRuntime()
  const highQuality = runtime.quality === 'high'

  return (
    <>
      <color attach="background" args={[SCENE_COLORS.background]} />
      <fog attach="fog" args={[SCENE_COLORS.background, 8.5, 18]} />
      <ResponsiveCamera sceneRadius={sceneRadius} target={target} />

      <ambientLight intensity={0.34} color={SCENE_COLORS.warmWhite} />
      <hemisphereLight args={['#bceff3', '#02070b', 0.72]} />
      <spotLight
        castShadow
        color={SCENE_COLORS.warmWhite}
        position={[4.5, 6.5, 5.8]}
        intensity={48}
        distance={18}
        angle={0.46}
        penumbra={0.72}
        decay={2}
        shadow-bias={-0.00018}
        shadow-mapSize-width={highQuality ? 1024 : 512}
        shadow-mapSize-height={highQuality ? 1024 : 512}
      />
      <spotLight
        color={SCENE_COLORS.teal}
        position={[-5.2, 2.4, 3.5]}
        intensity={32}
        distance={15}
        angle={0.5}
        penumbra={0.82}
        decay={2}
      />
      <pointLight
        color={SCENE_COLORS.orange}
        position={[3.4, -0.4, 3.2]}
        intensity={18}
        distance={10}
        decay={2}
      />

      <Environment resolution={highQuality ? 128 : 64}>
        <Lightformer
          color={SCENE_COLORS.warmWhite}
          intensity={1.2}
          position={[0, 5, -7]}
          rotation-x={Math.PI / 2}
          scale={[8, 3, 1]}
        />
        <Lightformer
          color={SCENE_COLORS.teal}
          intensity={1.6}
          position={[-5, 1, 2]}
          rotation-y={Math.PI / 2}
          scale={[4, 2, 1]}
        />
        <Lightformer
          color={SCENE_COLORS.orange}
          intensity={0.9}
          position={[5, -1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[2, 2, 1]}
        />
      </Environment>

      <ContactShadows
        position={[0, -1.56, 0]}
        opacity={0.46}
        scale={7.5}
        blur={2.7}
        far={5.2}
        color={SCENE_COLORS.shadow}
        frames={runtime.running && highQuality ? Infinity : 1}
        resolution={highQuality ? 512 : 256}
      />

      {highQuality && <RestrainedBloom />}
    </>
  )
}

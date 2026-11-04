import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import * as THREE from 'three'
import { useSceneRuntime } from './sceneRuntime'

export default function RestrainedBloom({
  radius = 0.28,
  strength = 0.24,
  threshold = 0.86,
}) {
  const runtime = useSceneRuntime()
  const { camera, gl, scene, size } = useThree()
  const passes = useMemo(() => {
    const composer = new EffectComposer(gl)
    const renderPass = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(1, 1),
      strength,
      radius,
      threshold,
    )
    composer.addPass(renderPass)
    composer.addPass(bloomPass)
    return { bloomPass, composer, renderPass }
  }, [camera, gl, radius, scene, strength, threshold])

  useEffect(() => {
    passes.composer.setPixelRatio(Math.min(runtime.dpr, 1.5))
    passes.composer.setSize(size.width, size.height)
  }, [passes, runtime.dpr, size.height, size.width])

  useEffect(() => () => {
    passes.renderPass.dispose?.()
    passes.bloomPass.dispose()
    passes.composer.dispose()
  }, [passes])

  useFrame((_, delta) => passes.composer.render(delta), 1)
  return null
}

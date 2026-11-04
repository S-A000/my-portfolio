import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { canUseWebGL, SceneRuntimeContext, useSceneRuntime } from './sceneRuntime'

class CanvasErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function RendererRuntime({ sceneKey }) {
  const runtime = useSceneRuntime()
  const { gl, invalidate } = useThree()

  useEffect(() => {
    gl.shadowMap.enabled = true
    gl.shadowMap.type = runtime.quality === 'high'
      ? THREE.PCFShadowMap
      : THREE.BasicShadowMap
    invalidate()
  }, [gl, invalidate, runtime.quality, runtime.running, runtime.reducedMotion, sceneKey])

  return null
}

const getPreferredDpr = () => {
  if (typeof window === 'undefined') return 1
  return Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.5)
}

export default function SceneCanvas({ ariaLabel, children, fallback, sceneKey }) {
  const hostRef = useRef(null)
  const contextCleanupRef = useRef(null)
  const prefersReducedMotion = Boolean(useReducedMotion())
  const forceReducedMotion = useMemo(() => (
    typeof window !== 'undefined'
      && new URLSearchParams(window.location.search).get('motion') === 'reduce'
  ), [])
  const reduceMotion = prefersReducedMotion || forceReducedMotion
  const [webglAvailable] = useState(canUseWebGL)
  const [contextLost, setContextLost] = useState(false)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || !document.hidden,
  )
  const [quality, setQuality] = useState('high')
  const highDpr = useMemo(getPreferredDpr, [])
  const dpr = quality === 'high' ? highDpr : 1
  const running = webglAvailable && !contextLost && inView && documentVisible && !reduceMotion

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const onVisibilityChange = () => setDocumentVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibilityChange)

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return () => document.removeEventListener('visibilitychange', onVisibilityChange)
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '160px 0px', threshold: 0.01 },
    )
    observer.observe(host)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  useEffect(() => () => contextCleanupRef.current?.(), [])

  const runtime = useMemo(() => ({
    dpr,
    quality,
    reducedMotion: reduceMotion,
    running,
  }), [dpr, quality, reduceMotion, running])

  const rendererUnavailable = !webglAvailable || contextLost

  return (
    <div
      className="scene-canvas-host"
      data-renderer={rendererUnavailable ? 'fallback' : 'webgl'}
      ref={hostRef}
      role="img"
      aria-label={ariaLabel}
    >
      {rendererUnavailable ? fallback : (
        <CanvasErrorBoundary fallback={fallback}>
          <Canvas
            camera={{ position: [0.5, 0.4, 8.5], fov: 42, near: 0.1, far: 40 }}
            dpr={dpr}
            frameloop={running ? 'always' : 'demand'}
            gl={{
              alpha: true,
              antialias: quality === 'high',
              depth: true,
              powerPreference: 'high-performance',
              stencil: false,
            }}
            shadows={THREE.PCFShadowMap}
            onCreated={({ gl }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 0.98
              gl.setClearColor('#030b12', 1)

              const handleContextLost = (event) => {
                event.preventDefault()
                setContextLost(true)
              }
              const handleContextRestored = () => setContextLost(false)
              gl.domElement.addEventListener('webglcontextlost', handleContextLost, false)
              gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false)
              contextCleanupRef.current = () => {
                gl.domElement.removeEventListener('webglcontextlost', handleContextLost, false)
                gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored, false)
              }
            }}
          >
            <SceneRuntimeContext.Provider value={runtime}>
              <PerformanceMonitor
                flipflops={3}
                onDecline={() => setQuality('low')}
                onFallback={() => setQuality('low')}
                onIncline={() => setQuality('high')}
              />
              <AdaptiveDpr />
              <RendererRuntime sceneKey={sceneKey} />
              <Suspense fallback={null}>{children}</Suspense>
            </SceneRuntimeContext.Provider>
          </Canvas>
        </CanvasErrorBoundary>
      )}
    </div>
  )
}

import { createContext, useContext } from 'react'

export const SceneRuntimeContext = createContext({
  quality: 'high',
  running: true,
  reducedMotion: false,
  dpr: 1,
})

export const useSceneRuntime = () => useContext(SceneRuntimeContext)

export function canUseWebGL() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  if (!('WebGLRenderingContext' in window) && !('WebGL2RenderingContext' in window)) return false

  try {
    const probe = document.createElement('canvas')
    const context = probe.getContext('webgl2') || probe.getContext('webgl')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    probe.remove()
    return true
  } catch {
    return false
  }
}


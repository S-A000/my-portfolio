import { useEffect, useRef } from 'react'

export const SCENE_PHASES = Object.freeze({
  INTRO: 'intro',
  ACTIVE: 'active',
  EXIT: 'exit',
  IDLE: 'idle',
})

const PHASE_DURATION = Object.freeze({
  [SCENE_PHASES.INTRO]: 0.82,
  [SCENE_PHASES.ACTIVE]: 0.26,
  [SCENE_PHASES.EXIT]: 0.48,
})

const clamp01 = (value) => Math.min(1, Math.max(0, value))

export const easeOutCubic = (value) => 1 - ((1 - clamp01(value)) ** 3)
export const easeInCubic = (value) => clamp01(value) ** 3

/**
 * Shared scene lifecycle. The current scene remains mounted while a requested
 * key is queued, exits, adopts the newest key, and enters again.
 */
export function useSceneTransition({ sceneKey, running, reducedMotion, onPhaseChange }) {
  const callbackRef = useRef(onPhaseChange)
  const stateRef = useRef({
    currentKey: sceneKey,
    requestedKey: sceneKey,
    phase: reducedMotion ? SCENE_PHASES.IDLE : SCENE_PHASES.INTRO,
    progress: reducedMotion ? 1 : 0,
    idleTime: 0,
  })

  useEffect(() => {
    callbackRef.current = onPhaseChange
  }, [onPhaseChange])

  useEffect(() => {
    const state = stateRef.current
    state.requestedKey = sceneKey

    if (reducedMotion) {
      state.currentKey = sceneKey
      state.phase = SCENE_PHASES.IDLE
      state.progress = 1
      callbackRef.current?.(SCENE_PHASES.IDLE)
      return
    }

    if (state.currentKey !== sceneKey && state.phase !== SCENE_PHASES.EXIT) {
      state.phase = SCENE_PHASES.EXIT
      state.progress = 0
      callbackRef.current?.(SCENE_PHASES.EXIT)
    }
  }, [reducedMotion, sceneKey])

  const step = (delta) => {
    const state = stateRef.current
    if (!running || reducedMotion) return state

    if (state.requestedKey !== state.currentKey && state.phase !== SCENE_PHASES.EXIT) {
      state.phase = SCENE_PHASES.EXIT
      state.progress = 0
      callbackRef.current?.(SCENE_PHASES.EXIT)
    }

    if (state.phase === SCENE_PHASES.IDLE) {
      state.idleTime += delta
      return state
    }

    state.progress = clamp01(state.progress + delta / PHASE_DURATION[state.phase])
    if (state.progress < 1) return state

    if (state.phase === SCENE_PHASES.EXIT) {
      state.currentKey = state.requestedKey
      state.phase = SCENE_PHASES.INTRO
      state.progress = 0
    } else if (state.phase === SCENE_PHASES.INTRO) {
      state.phase = SCENE_PHASES.ACTIVE
      state.progress = 0
    } else {
      state.phase = SCENE_PHASES.IDLE
      state.progress = 0
    }

    callbackRef.current?.(state.phase)
    return state
  }

  return { stateRef, step }
}


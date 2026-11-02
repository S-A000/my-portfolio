import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// The canvas version uses one cubic curve per strand, so strand count is its
// equivalent of tube/radial segment complexity.
const STRAND_COUNT = 96
const TAU = Math.PI * 2
const WAVE_STAGE = 0.5

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const mix = (from, to, amount) => from + (to - from) * amount
const smoothstep = (value) => {
  const amount = clamp(value)
  return amount * amount * (3 - 2 * amount)
}

const createRandom = (initialSeed) => {
  let seed = initialSeed >>> 0
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}

const random = createRandom(0x5a17c9e3)
const STRANDS = Array.from({ length: STRAND_COUNT }, (_, index) => ({
  index,
  lane: index / (STRAND_COUNT - 1) * 2 - 1,
  angle: index / STRAND_COUNT * TAU + (random() - 0.5) * 0.045,
  phase: random() * TAU,
  bend: random() * 2 - 1,
  length: 0.72 + random() * 0.28,
  width: 0.45 + random() * 1.05,
  tipSize: 0.9 + random() * 1.55,
  orbit: 3 + random() * 7,
  particlePhase: random() * TAU,
}))

const pathKeys = ['x0', 'y0', 'c1x', 'c1y', 'c2x', 'c2y', 'x1', 'y1']

const interpolatePath = (from, to, amount) => {
  const path = {}
  pathKeys.forEach((key) => { path[key] = mix(from[key], to[key], amount) })
  return path
}

const bundlePath = (strand, width, height, time) => {
  const compact = width < 720
  const centerX = width * (compact ? 0.56 : 0.66)
  const lane = strand.lane
  const sway = Math.sin(time * 0.52 + strand.phase)
  const crossSway = Math.sin(time * 0.31 + strand.phase * 1.7)
  const drop = 0.58 + (0.5 + 0.5 * Math.sin(strand.phase * 1.9)) * 0.26

  return {
    x0: centerX + lane * width * 0.105 + sway * width * 0.008,
    y0: -height * (0.08 + (1 - strand.length) * 0.3),
    c1x: centerX + strand.bend * width * 0.075 + lane * width * 0.035 + sway * width * 0.018,
    c1y: height * (0.14 + strand.length * 0.06),
    c2x: centerX + lane * width * 0.16 - strand.bend * width * 0.04 + crossSway * width * 0.024,
    c2y: height * (0.39 + strand.length * 0.12),
    x1: centerX + lane * width * (compact ? 0.31 : 0.255) + sway * width * 0.026,
    y1: height * drop + crossSway * height * 0.018,
  }
}

const wavePath = (strand, width, height, time) => {
  const lane = strand.lane
  const ripple = Math.sin(strand.phase + time * 0.62)
  const laneWave = Math.sin((lane + 1) * Math.PI * 1.35 + time * 0.28)

  return {
    x0: width * (0.12 + (lane + 1) * 0.045),
    y0: height * (0.78 - lane * 0.19 + ripple * 0.018),
    c1x: width * (0.35 + strand.bend * 0.04),
    c1y: height * (0.72 - lane * 0.25 + laneWave * 0.07),
    c2x: width * (0.64 + strand.bend * 0.055),
    c2y: height * (0.36 + lane * 0.24 - laneWave * 0.06),
    x1: width * (0.88 + lane * 0.075),
    y1: height * (0.26 + lane * 0.29 + ripple * 0.025),
  }
}

const irisGeometry = (width, height) => {
  const compact = width < 720
  const centerX = width * (compact ? 0.53 : 0.64)
  const centerY = height * 0.49
  const size = Math.min(width, height)
  return {
    centerX,
    centerY,
    innerRadius: size * (compact ? 0.155 : 0.18),
    outerRadius: size * (compact ? 0.35 : 0.39),
  }
}

const irisPath = (strand, width, height, time) => {
  const { centerX, centerY, innerRadius, outerRadius } = irisGeometry(width, height)
  const angle = strand.angle + Math.sin(time * 0.24 + strand.phase) * 0.012
  const tangentX = -Math.sin(angle)
  const tangentY = Math.cos(angle)
  const radialX = Math.cos(angle)
  const radialY = Math.sin(angle)
  const outer = outerRadius * (0.93 + strand.length * 0.09)
  const inner = innerRadius * (0.96 + strand.bend * 0.035)
  const curl = strand.bend * outerRadius * 0.16

  return {
    x0: centerX + radialX * outer + tangentX * curl,
    y0: centerY + radialY * outer + tangentY * curl,
    c1x: centerX + radialX * outerRadius * 0.79 + tangentX * (curl + outerRadius * 0.08),
    c1y: centerY + radialY * outerRadius * 0.79 + tangentY * (curl + outerRadius * 0.08),
    c2x: centerX + radialX * innerRadius * 1.42 + tangentX * outerRadius * 0.035,
    c2y: centerY + radialY * innerRadius * 1.42 + tangentY * outerRadius * 0.035,
    x1: centerX + radialX * inner,
    y1: centerY + radialY * inner,
  }
}

const resolvePath = (strand, width, height, time, progress) => {
  const bundle = bundlePath(strand, width, height, time)
  const wave = wavePath(strand, width, height, time)
  if (progress <= WAVE_STAGE) {
    return interpolatePath(bundle, wave, smoothstep(progress / WAVE_STAGE))
  }

  const iris = irisPath(strand, width, height, time)
  return interpolatePath(wave, iris, smoothstep((progress - WAVE_STAGE) / (1 - WAVE_STAGE)))
}

export default function NeuralField() {
  const fieldRef = useRef(null)
  const canvasRef = useRef(null)
  const scrollProgressRef = useRef({ progress: 0 })

  useEffect(() => {
    const field = fieldRef.current
    const canvas = canvasRef.current
    if (!field || !canvas) return undefined

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return undefined

    const createRadialSprite = (colorStops) => {
      const sprite = document.createElement('canvas')
      const spriteSize = 128
      sprite.width = spriteSize
      sprite.height = spriteSize
      const spriteContext = sprite.getContext('2d')
      if (!spriteContext) return sprite

      const center = spriteSize / 2
      const gradient = spriteContext.createRadialGradient(center, center, 0, center, center, center)
      colorStops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
      spriteContext.fillStyle = gradient
      spriteContext.fillRect(0, 0, spriteSize, spriteSize)
      return sprite
    }

    const glowSprite = createRadialSprite([
      [0, 'rgba(255, 236, 176, 1)'],
      [0.16, 'rgba(255, 157, 48, 0.92)'],
      [0.48, 'rgba(255, 118, 20, 0.3)'],
      [1, 'rgba(255, 118, 20, 0)'],
    ])
    const shadowSprite = createRadialSprite([
      [0, 'rgba(70, 43, 23, 0.24)'],
      [0.45, 'rgba(108, 68, 31, 0.1)'],
      [1, 'rgba(108, 68, 31, 0)'],
    ])

    gsap.registerPlugin(ScrollTrigger)

    const motionQuery = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false, addListener: () => {}, removeListener: () => {} }
    let reducedMotion = motionQuery.matches
    let width = 0
    let height = 0
    let pixelRatio = 1
    let displayProgress = 0
    let animationFrame = 0
    let reducedFrame = 0
    let previousTime = performance.now()
    let pageScrollTrigger = null
    let pageScrollTween = null

    const drawContactShadow = (progress) => {
      const irisAmount = smoothstep((progress - WAVE_STAGE) / (1 - WAVE_STAGE))
      if (irisAmount <= 0) return
      const centerX = mix(width * 0.66, irisGeometry(width, height).centerX, irisAmount)
      const centerY = mix(height * 0.87, height * 0.82, irisAmount)
      const radius = Math.min(width * 0.27, height * 0.3)
      context.save()
      context.globalAlpha = irisAmount
      context.drawImage(
        shadowSprite,
        centerX - radius,
        centerY - radius * 0.19,
        radius * 2,
        radius * 0.38,
      )
      context.restore()
    }

    const draw = (now) => {
      if (!width || !height) return
      const time = reducedMotion ? 0 : now / 1000
      context.clearRect(0, 0, width, height)
      drawContactShadow(displayProgress)

      const paths = STRANDS.map((strand) => resolvePath(strand, width, height, time, displayProgress))

      context.save()
      context.lineCap = 'round'
      context.lineJoin = 'round'
      STRANDS.forEach((strand, index) => {
        const path = paths[index]
        context.beginPath()
        context.moveTo(path.x0, path.y0)
        context.bezierCurveTo(path.c1x, path.c1y, path.c2x, path.c2y, path.x1, path.y1)
        context.lineWidth = strand.width
        context.strokeStyle = index % 9 === 0
          ? 'rgba(105, 62, 29, 0.56)'
          : 'rgba(35, 31, 29, 0.4)'
        context.stroke()
      })
      context.restore()

      context.save()
      context.globalCompositeOperation = 'lighter'
      STRANDS.forEach((strand, index) => {
        const tip = paths[index]
        const pulse = reducedMotion ? 1 : 0.82 + Math.sin(time * 1.35 + strand.phase) * 0.18
        const radius = strand.tipSize * pulse
        const glowSize = Math.max(9, radius * 9)

        context.drawImage(
          glowSprite,
          tip.x1 - glowSize / 2,
          tip.y1 - glowSize / 2,
          glowSize,
          glowSize,
        )

        context.fillStyle = 'rgba(255, 151, 43, 0.86)'
        context.beginPath()
        context.arc(tip.x1, tip.y1, radius, 0, TAU)
        context.fill()

        context.fillStyle = 'rgba(255, 225, 151, 0.82)'
        context.beginPath()
        context.arc(tip.x1, tip.y1, Math.max(0.45, radius * 0.38), 0, TAU)
        context.fill()

        const orbitAngle = strand.particlePhase + time * 0.44
        const particleX = tip.x1 + Math.cos(orbitAngle) * strand.orbit
        const particleY = tip.y1 + Math.sin(orbitAngle) * strand.orbit * 0.68
        context.globalAlpha = 0.42
        context.beginPath()
        context.arc(particleX, particleY, 0.65, 0, TAU)
        context.fill()
        context.globalAlpha = 1
      })
      context.restore()

    }

    const resize = () => {
      width = Math.max(1, Math.round(window.innerWidth))
      height = Math.max(1, Math.round(window.innerHeight))
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      draw(performance.now())
    }

    const drawReducedFrame = () => {
      reducedFrame = 0
      draw(performance.now())
    }

    const requestReducedDraw = () => {
      if (!reducedMotion || reducedFrame) return
      reducedFrame = window.requestAnimationFrame(drawReducedFrame)
    }

    const animate = (now) => {
      const elapsed = Math.min(64, now - previousTime)
      previousTime = now
      const smoothing = 1 - Math.pow(0.001, elapsed / 1000)
      const targetProgress = clamp(scrollProgressRef.current.progress)
      displayProgress += (targetProgress - displayProgress) * smoothing
      if (Math.abs(targetProgress - displayProgress) < 0.0001) displayProgress = targetProgress
      draw(now)
      animationFrame = window.requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
      previousTime = performance.now()
      if (reducedMotion) {
        displayProgress = clamp(scrollProgressRef.current.progress)
        draw(previousTime)
      } else {
        animationFrame = window.requestAnimationFrame(animate)
      }
    }

    const onMotionPreferenceChange = (event) => {
      reducedMotion = event.matches
      scrollProgressRef.current.progress = clamp(
        pageScrollTrigger?.progress ?? scrollProgressRef.current.progress,
      )
      startAnimation()
    }

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(resize)

    resizeObserver?.observe(field)
    window.addEventListener('resize', resize, { passive: true })
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionPreferenceChange)
    else motionQuery.addListener(onMotionPreferenceChange)

    resize()
    scrollProgressRef.current.progress = 0
    pageScrollTween = gsap.to(scrollProgressRef.current, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (reducedMotion) {
            scrollProgressRef.current.progress = clamp(self.progress)
            displayProgress = scrollProgressRef.current.progress
          }
          requestReducedDraw()
        },
        onRefresh: (self) => {
          if (reducedMotion) {
            scrollProgressRef.current.progress = clamp(self.progress)
            displayProgress = scrollProgressRef.current.progress
          }
          requestReducedDraw()
        },
      },
    })
    pageScrollTrigger = pageScrollTween.scrollTrigger
    ScrollTrigger.refresh()
    scrollProgressRef.current.progress = clamp(pageScrollTrigger.progress)
    displayProgress = scrollProgressRef.current.progress
    startAnimation()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.cancelAnimationFrame(reducedFrame)
      pageScrollTrigger?.kill()
      pageScrollTween?.kill()
      resizeObserver?.disconnect()
      window.removeEventListener('resize', resize)
      if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', onMotionPreferenceChange)
      else motionQuery.removeListener(onMotionPreferenceChange)
    }
  }, [])

  return (
    <div
      ref={fieldRef}
      className="neural-field"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  )
}

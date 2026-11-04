import HeroFormationScene from '../three/HeroFormationScene'
import SceneCanvas from '../three/SceneCanvas'

export default function IntelligenceCanvas({ introStartedAt, onReveal, scrollProgress }) {
  const fallback = (
    <div className="intelligence-canvas__fallback">
      <span />
      <span />
      <span />
    </div>
  )

  return (
    <div className="intelligence-canvas">
      <SceneCanvas
        ariaLabel="An abstract SAM intelligence network forms from particles and data filaments"
        fallback={fallback}
        sceneKey="hero-formation"
      >
        <HeroFormationScene
          introStartedAt={introStartedAt}
          onReveal={onReveal}
          scrollProgress={scrollProgress}
        />
      </SceneCanvas>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Pause, RotateCcw } from 'lucide-react'
import CaseStudyScene from '../three/CaseStudyScene'

export default function CaseStudyWalkthrough({study}) {
  const [stage,setStage]=useState(0),[playing,setPlaying]=useState(false),[visible,setVisible]=useState(false),[tabVisible,setTabVisible]=useState(!document.hidden)
  const host=useRef(null), steps=useRef([]), buttons=useRef([])
  const reduced=useReducedMotion()||new URLSearchParams(window.location.search).get('motion')==='reduce'
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.05})
    observer.observe(host.current)
    const visibility=()=>setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange',visibility)
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility)}
  },[])
  useEffect(()=>{
    if(!playing||!visible||!tabVisible||reduced)return undefined
    const timer=window.setInterval(()=>setStage(current=>{if(current===4){setPlaying(false);return current}return current+1}),4200)
    return()=>window.clearInterval(timer)
  },[playing,visible,tabVisible,reduced])
  useEffect(()=>{
    let frame=0
    const update=()=>{
      frame=0
      if(playing)return
      const center=window.innerHeight*.55
      const distances=steps.current.map(el=>Math.abs(el.getBoundingClientRect().top+el.offsetHeight/2-center))
      const closest=distances.indexOf(Math.min(...distances))
      setStage(closest)
    }
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)}
    window.addEventListener('scroll',scroll,{passive:true})
    const stop=()=>setPlaying(false)
    window.addEventListener('wheel',stop,{passive:true});window.addEventListener('touchstart',stop,{passive:true})
    return()=>{window.removeEventListener('scroll',scroll);window.removeEventListener('wheel',stop);window.removeEventListener('touchstart',stop);cancelAnimationFrame(frame)}
  },[playing])
  const select=(i,focus=false)=>{setPlaying(false);setStage(i);if(focus)buttons.current[i]?.focus()}
  return <section className="case-walkthrough shell" id="system-walkthrough" ref={host} aria-labelledby="walkthrough-title">
    <header className="section-intro"><p className="eyebrow"><span/> Follow the system</p><h2 id="walkthrough-title">From inputs to everyday use.</h2><p>Scroll through the five stages, choose a step, or replay the complete story.</p></header>
    <div className="case-walkthrough__grid"><div className="case-walkthrough__sticky">
      <div className="case-walkthrough__frame"><div className="case-walkthrough__topline"><span>{study.id==='lobatse-pharmacy'?'COMMERCE / OPERATIONS':'DATA / MODEL LIFECYCLE'}</span><span>{String(stage+1).padStart(2,'0')} / 05</span></div><CaseStudyScene study={study} stage={stage}/><div className="case-walkthrough__caption" role="status" aria-live="polite">{study.stages[stage].title}</div></div>
      <div className="case-stage-tabs" role="tablist" aria-label="System walkthrough stages">{study.stages.map((step,i)=><button type="button" key={step.label} id={`stage-tab-${i}`} ref={el=>{buttons.current[i]=el}} role="tab" aria-selected={stage===i} aria-controls="stage-description" tabIndex={stage===i?0:-1} onClick={()=>select(i)} onKeyDown={event=>{let next;if(event.key==='ArrowRight')next=(stage+1)%5;if(event.key==='ArrowLeft')next=(stage+4)%5;if(event.key==='Home')next=0;if(event.key==='End')next=4;if(next!==undefined){event.preventDefault();select(next,true)}}}><span>{String(i+1).padStart(2,'0')}</span>{step.label}</button>)}</div>
      <div id="stage-description" className="case-stage-description" role="tabpanel" aria-labelledby={`stage-tab-${stage}`}><p>{study.stages[stage].detail}</p></div>
      <div className="case-playback"><button type="button" onClick={()=>select(Math.max(0,stage-1))} disabled={stage===0} aria-label="Previous stage"><ArrowLeft aria-hidden="true"/></button><button type="button" onClick={()=>{if(playing)setPlaying(false);else{setStage(0);setPlaying(!reduced)}}}>{playing?<Pause aria-hidden="true"/>:<RotateCcw aria-hidden="true"/>}{playing?'Pause story':reduced?'Return to first stage':'Replay story'}</button><button type="button" onClick={()=>select(Math.min(4,stage+1))} disabled={stage===4} aria-label="Next stage"><ArrowRight aria-hidden="true"/></button></div>
    </div><ol className="case-walkthrough__steps">{study.stages.map((step,i)=><li key={step.label} ref={el=>{steps.current[i]=el}} className={stage===i?'is-active':''}><span className="case-step-number">{String(i+1).padStart(2,'0')} / {step.label}</span><h3>{step.title}</h3><p>{step.detail}</p><ul>{step.items.map(item=><li key={item}>{item}</li>)}</ul></li>)}</ol></div>
  </section>
}

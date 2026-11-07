import { useEffect, useId, useRef, useState } from 'react'

// A small vector system: no canvas, render loop, external images, or customer data.
export default function IndustryFlow({industry,hero=false}) {
  const ref=useRef(null)
  const [visible,setVisible]=useState(false)
  const [tabVisible,setTabVisible]=useState(()=>!document.hidden)
  const uid=useId().replaceAll(':','')
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.08})
    observer.observe(ref.current)
    const update=()=>setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange',update)
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update)}
  },[])
  const kind=industry?.id||'overview'
  const labels=industry?.workflow||['Current process','People & data','System design','Useful decisions']
  return <figure className={`industry-flow industry-flow--${kind}${hero?' industry-flow--hero':''}`} ref={ref} data-active={visible&&tabVisible}>
    <svg viewBox="0 0 600 255" fill="none" aria-hidden="true">
      <defs><linearGradient id={`flow-${uid}`} x1="50" y1="80" x2="540" y2="220" gradientUnits="userSpaceOnUse"><stop stopColor="#27d2e4"/><stop offset="1" stopColor="#ff8a46"/></linearGradient></defs>
      
      <ellipse cx="310" cy="216" rx="220" ry="16" fill="#102b38" opacity=".6"/>
      <g className="industry-flow__connections" stroke={`url(#flow-${uid})`} strokeWidth="1.7"><path d="M112 130H178L218 90H284M316 90H360L400 130H477"/><path d="M295 112V181H469" opacity=".6"/></g>
      <g className="industry-flow__signal" stroke="#8cf3f4" strokeWidth="3"><path d="M112 130H178L218 90H284M316 90H360L400 130H477"/><path d="M295 112V181H469"/></g>
      <g transform="translate(46 80)"><rect width="92" height="94" rx="5" fill="#0d2e3e" stroke="#376577"/><rect x="9" y="10" width="74" height="9" rx="2" fill="#25a4b4"/>{[0,1,2,3].map(i=><g key={i}><rect x="12" y={33+i*13} width="8" height="5" fill={i===2?'#ff8a46':'#7ca8b8'}/><path d={`M29 ${36+i*13}h45`} stroke="#608391" strokeWidth="2"/></g>)}</g>
      <g transform="translate(256 49)"><path d="m44 0 44 25v50l-44 25L0 75V25Z" fill="#0b3544" stroke="#29aab8"/><path d="m44 15 30 17v34L44 83 14 66V32Z" stroke="#67d3d9" strokeOpacity=".5"/><path d="m28 48 12 12 23-25" stroke="#f4efe7" strokeWidth="3"/></g>
      {kind==='manufacturing-industrial'?<g transform="translate(427 58)"><rect width="126" height="139" rx="6" fill="#f1ece1" stroke="#b0c3bc"/>{[0,1,2,3].map(i=><g key={i}><rect x="15" y={15+i*29} width="96" height="23" rx="2" stroke="#6c9293"/><path d={`M25 ${22+i*29}h55m-55 8h40`} stroke="#1e5961"/></g>)}<path d="m91 109 5 5 11-13" stroke="#dc6a26" strokeWidth="2"/></g>:kind==='pharmacies-healthcare-retail'?<g transform="translate(424 65)"><rect width="130" height="119" rx="5" fill="#f2eee4" stroke="#7badae"/><rect width="130" height="20" fill="#17505b"/><path d="M12 31h104" stroke="#9db9b3"/>{[0,1,2].map(i=><g key={i}><rect x={12+i*38} y="45" width="30" height="55" rx="3" fill="#dce6dc"/><rect x={20+i*38} y="56" width="14" height="29" rx="3" fill="#fefbf0"/><path d={`M${21+i*38} 65h12`} stroke={i===1?'#ed8b4b':'#1a9391'} strokeWidth="6"/></g>)}</g>:<g transform="translate(424 65)"><rect width="130" height="119" rx="5" fill="#0e2b3a" stroke="#3a6879"/><path d="M0 22h130" stroke="#3a6879"/><circle cx="12" cy="11" r="2" fill="#ff8a46"/><circle cx="22" cy="11" r="2" fill="#38c4c8"/>{[0,1,2,3].map(i=><rect key={i} x={14+i*26} y={84-i*12} width="16" height={20+i*12} rx="2" fill={i===3?'#ef8950':'#238da5'}/>)}<path d="m14 64 28-10 24 5 42-25" stroke="#93e7e5" strokeWidth="1.4"/></g>}
      <g fill="#78bcc5"><circle cx="171" cy="130" r="3"/><circle cx="365" cy="94" r="3"/><circle cx="295" cy="181" r="3"/></g>
      <text x="48" y="210" fill="#90afbc" fontSize="10" fontFamily="Arial">INPUTS</text><text x="268" y="176" fill="#70d6db" fontSize="10" fontFamily="Arial">BUSINESS RULES</text><text x="427" y="213" fill="#ffae77" fontSize="10" fontFamily="Arial">WORKING INTERFACE</text>
    </svg>
    <figcaption>{labels.map(label=><span key={label}>{label}</span>)}</figcaption>
  </figure>
}

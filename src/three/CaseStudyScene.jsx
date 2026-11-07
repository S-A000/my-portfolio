import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Line, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import SceneCanvas from './SceneCanvas'
import { useSceneRuntime } from './sceneRuntime'
import { SCENE_COLORS as C, SCENE_MATERIALS as M } from './sceneTheme'

// All screen artwork is drawn locally; no remote fonts, patient data, or UI captures.
function artwork(kind, title, accent) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = kind === 'phone' ? 1450 : 640
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height
  const box = (x,y,bw,bh,color,r=10) => { ctx.fillStyle=color; ctx.beginPath();ctx.roundRect(x,y,bw,bh,r);ctx.fill() }
  const text = (s,x,y,size=25,color='#eaece7') => { ctx.fillStyle=color;ctx.font=`600 ${size}px Arial`;ctx.fillText(s,x,y) }
  ctx.fillStyle='#091c2a';ctx.fillRect(0,0,w,h)
  if (['desktop','tablet','phone','detail','basket'].includes(kind)) {
    ctx.fillStyle='#f5f0e8';ctx.fillRect(0,0,w,h)
    box(0,0,w,65,'#103c45',0); text('LOBATSE  /  PHARMACY',30,42,25)
    text(kind==='phone' ? 'Menu    Search    Basket' : 'Shop       Wellness       Personal care       Account       Basket',30,110,20,'#234651')
    box(28,137,w-56,58,'#e6e6df');text('Search products and categories',50,174,23,'#476269')
    if (kind==='basket') {
      text('Your basket',36,260,43,'#123840');text('Review items before checkout',36,309,25,'#536a6e')
      for(let i=0;i<2;i++){box(36,345+i*70,75,55,'#d4e1da');text(['Wellness essentials','Personal care'][i],135,382+i*70,25,'#244d53')}
      box(40,520,940,76,'#126e68');text('Continue to cash-on-delivery checkout',72,568,31)
    } else if (kind==='detail') {
      box(30,226,410,370,'#e2e9de');box(165,305,135,205,'#faf8f0');box(180,280,105,40,accent);box(165,390,135,65,accent)
      text('Everyday wellness',480,280,39,'#173d43');text('Product information',480,340,26,'#53676c');text('Stock-aware availability',480,390,24,'#53676c');box(480,460,480,70,'#126e68');text('Add to basket',520,505,28)
    } else {
      text('Care for your everyday.',32,255,kind==='phone'?54:39,'#123d43')
      const cols=kind==='phone'?1:kind==='tablet'?2:3
      for(let i=0;i<(kind==='phone'?3:cols*2);i++) {
        const cw=(w-64)/cols, x=32+(i%cols)*cw, y=285+Math.floor(i/cols)*(kind==='phone'?355:163)
        box(x,y,cw-16,kind==='phone'?320:148,'#e5ebe3')
        box(x+22,y+18,kind==='phone'?160:60,kind==='phone'?170:77,'#fffdf4');box(x+28,y+12,kind==='phone'?148:48,14, i%2?accent:'#4a9c94')
        box(x+22,y+52,kind==='phone'?160:60,25,i%2?accent:'#4a9c94')
        text(['Wellness','Personal care','Daily essentials'][i%3],x+(kind==='phone'?215:100),y+52,kind==='phone'?35:22,'#24474c')
        text('View product',x+(kind==='phone'?215:100),y+93,kind==='phone'?26:18,'#3b6d69')
        box(x+(kind==='phone'?215:100),y+110,kind==='phone'?600:cw-128,26,'#146f68')
      }
    }
  } else {
    box(0,0,w,8,accent,0);text('SAM  /  SYSTEM VIEW',45,65,21,accent)
    text(title,45,145,title.length>24?34:46)
    if (kind==='dashboard') {
      text('Three-city forecast dashboard',45,202,25,'#9db7bf')
      for(let i=0;i<3;i++){box(45+i*320,250,290,150,'#103744');text(['24h','48h','72h'][i],75+i*320,317,46,accent);text('Direct horizon',75+i*320,365,22)}
      ctx.strokeStyle=accent;ctx.lineWidth=5;ctx.beginPath()
      for(let i=0;i<50;i++){const x=55+i*18,y=500-Math.sin(i*.19)*35-i*.5;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()
      text('Illustrative horizon interface · no live readings',45,602,21,'#8da5ae')
    } else {
      for(let i=0;i<5;i++){box(45,220+i*65,934,40,'#103846');box(45,220+i*65,200+i*130,40,i%2?accent:'#3388a8')}
      text(kind==='private'?'Authorized access only':'Application / data flow',45,600,25,'#a0b6bc')
    }
  }
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=2
  return texture
}

function Screen({kind='node',title='',accent=C.teal,position=[0,0,0],width=2.1,height=1.32,rotation=[0,0,0]}) {
  const map=useMemo(()=>artwork(kind,title,accent),[kind,title,accent])
  useEffect(()=>()=>map.dispose(),[map])
  return <group position={position} rotation={rotation}>
    <RoundedBox args={[width+.12,height+.12,.14]} radius={.055} smoothness={2}><meshPhysicalMaterial {...M.shell}/></RoundedBox>
    <mesh position={[0,0,.078]}><planeGeometry args={[width,height]}/><meshBasicMaterial map={map} toneMapped={false}/></mesh>
    <mesh position={[0,height/2+.08,0]}><boxGeometry args={[width*.7,.016,.03]}/><meshBasicMaterial color={accent}/></mesh>
  </group>
}

function Product({position,index=0,active=true}) {
  const ref=useRef(),elapsed=useRef(0),runtime=useSceneRuntime()
  useEffect(()=>{elapsed.current=0},[active])
  useFrame((_,dt)=>{
    if(!active||!ref.current)return
    if(runtime.running)elapsed.current+=Math.min(dt,.05)
    const progress=runtime.reducedMotion?1:THREE.MathUtils.smoothstep(elapsed.current-index*.035,0,1.8)
    ref.current.position.set(position[0]+(1-progress)*(index%2?3:-3),position[1]+(1-progress)*(index%3-1)*3,position[2]+(1-progress)*3)
    ref.current.rotation.y=(index%2?.12:-.12)+(1-progress)*1.6
  })
  return <group ref={ref} position={position} rotation={[0,index%2?.12:-.12,0]}>
    <RoundedBox args={[.64,.88,.12]} radius={.05} smoothness={2}><meshPhysicalMaterial {...M.ceramic}/></RoundedBox>
    <mesh position={[0,.04,.14]}><cylinderGeometry args={[.12,.12,.4,12]}/><meshStandardMaterial color="#faf5df"/></mesh>
    <mesh position={[0,.28,.14]}><cylinderGeometry args={[.1,.1,.09,12]}/><meshStandardMaterial color={index%3?C.teal:C.orange}/></mesh>
    <mesh position={[0,.04,.15]}><cylinderGeometry args={[.125,.125,.12,12]}/><meshStandardMaterial color={index%3?C.teal:C.orange}/></mesh>
    <mesh position={[0,-.32,.075]}><boxGeometry args={[.4,.025,.01]}/><meshBasicMaterial color={C.blue}/></mesh>
  </group>
}

function Stream({from,to,color=C.teal,count=5,bend=.5}) {
  const dots=useRef([]), runtime=useSceneRuntime(), time=useRef(0)
  const curve=useMemo(()=>new THREE.QuadraticBezierCurve3(new THREE.Vector3(...from),new THREE.Vector3((from[0]+to[0])/2,(from[1]+to[1])/2+bend,Math.max(from[2],to[2])+.35),new THREE.Vector3(...to)),[from,to,bend])
  const points=useMemo(()=>curve.getPoints(30),[curve])
  useFrame((_,delta)=>{if(runtime.running)time.current+=Math.min(delta,.05);dots.current.forEach((dot,i)=>{if(dot)dot.position.copy(curve.getPoint((time.current*.18+i/count)%1))})})
  return <group><Line points={points} color={color} lineWidth={1} transparent opacity={.42}/>{Array.from({length:count},(_,i)=><mesh key={i} ref={el=>{dots.current[i]=el}}><sphereGeometry args={[.038,6,6]}/><meshBasicMaterial color={color}/></mesh>)}</group>
}

function Database({position=[0,0,0],color=C.blue}) {
  return <group position={position}>{[0,.22,.44].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.56,.56,.18,32]}/><meshPhysicalMaterial {...M.panel} color={color} metalness={.5}/></mesh>)}<mesh position={[0,.56,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.4,.46,32]}/><meshBasicMaterial color={C.cyan}/></mesh></group>
}

function Commerce({stage,active}) {
  if(stage===0) return <><group rotation={[.08,-.28,-.04]}>{Array.from({length:18},(_,i)=><Product key={i} index={i} active={active} position={[(i%6-2.5)*.82,(Math.floor(i/6)-1)*1.08,Math.sin(i)*.18]}/>)}</group><Screen title="Catalog / data layer" position={[0,-2,-.3]} width={3.4} height={.7}/><Stream from={[-1,-1.4,0]} to={[0,-1.8,0]}/><Stream from={[1,-1.4,0]} to={[0,-1.8,0]} color={C.orange}/></>
  if(stage===1) return <><Screen kind="desktop" width={4.7} height={2.9} position={[-.35,.25,-.3]} rotation={[0,-.14,0]}/><Screen kind="detail" width={2.55} height={1.65} position={[1.45,-.35,.65]} rotation={[0,-.27,0]}/><Screen kind="basket" width={2.1} height={1.35} position={[-1.65,-1.3,.8]} rotation={[0,.2,0]}/><Stream from={[-1,1.7,0]} to={[1.6,-.1,1]} color={C.orange}/></>
  if(stage===2) return <><Screen kind="desktop" width={3.8} height={2.4} position={[-.85,.45,-.65]} rotation={[0,.16,0]}/><Screen kind="tablet" width={2.35} height={1.85} position={[.95,-.25,.4]} rotation={[0,-.2,0]}/><Screen kind="phone" width={.95} height={1.7} position={[2.15,-.8,1.1]} rotation={[0,-.28,0]}/><Stream from={[-1,-.8,0]} to={[1.8,-.8,.7]} color={C.orange}/></>
  if(stage===3) return <>{['Basket','COD checkout','Order management'].map((t,i)=><Screen key={t} title={t} position={[-2.15+i*2.15,1.15,0]} width={1.8} height={1.1} accent={C.orange}/>)}{['Prescription upload','Private file handling','Pharmacist review','Decision'].map((t,i)=><Screen key={t} kind="private" title={t} position={[-2.55+i*1.7,-1.1,.3]} width={1.45} height={1.05}/>)}{[0,1].map(i=><Stream key={i} from={[-1.3+i*2.15,1.15,0]} to={[-.9+i*2.15,1.15,0]} color={C.orange}/>)}{[0,1,2].map(i=><Stream key={i} from={[-1.8+i*1.7,-1.1,.3]} to={[-1.65+i*1.7,-1.1,.3]}/>)}<Line points={[[-3.2,0,0],[3.2,0,0]]} color={C.blue} transparent opacity={.4}/></>
  return <><Screen kind="desktop" title="Customer devices" width={2.1} height={1.3} position={[-2.3,1.1,0]}/><Screen title="ASP.NET Core / EC2" position={[0,.1,.7]} width={2.1} height={1.4} accent={C.orange}/><Database position={[2.25,1,-.25]}/><Screen title="PostgreSQL / RDS" position={[2.25,1.6,0]} width={1.7} height={.65}/><Screen title="S3 / media + private" position={[2.15,-1.3,0]} width={1.9} height={1.1}/><Screen title="Admin / pharmacist" position={[-2.2,-1.3,.3]} width={2} height={1.2}/><Stream from={[-1.3,1,0]} to={[-.8,.3,.7]} color={C.orange}/><Stream from={[.9,.5,.7]} to={[2,1,0]}/><Stream from={[.9,-.2,.7]} to={[2,-1,0]}/><Stream from={[-1.5,-1,.3]} to={[-.8,-.3,.7]}/></>
}

const cities=[[-2.2,.9,0],[0,1.7,-.6],[2.2,.7,.2]]
function CityNodes(){return <>{cities.map((p,i)=><group key={i} position={p}><mesh><cylinderGeometry args={[.55,.65,.2,32]}/><meshPhysicalMaterial {...M.shell}/></mesh><mesh position={[0,.35,0]}><icosahedronGeometry args={[.22,1]}/><meshStandardMaterial color={C.teal} emissive={C.teal} emissiveIntensity={.5}/></mesh><Screen title={['Karachi','Lahore','Islamabad'][i]} position={[0,-.5,.25]} width={1.55} height={.7}/><Stream from={[-.2,1.2,0]} to={[0,.25,0]} count={4}/></group>)}</>}

function Forecast({stage}) {
  if(stage===0)return <><CityNodes/>{cities.map((p,i)=><Stream key={i} from={p} to={[0,-1.3,.6]} count={7} color={i===1?C.orange:C.teal}/>)}<mesh position={[0,-1.4,.6]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.7,.035,8,60]}/><meshBasicMaterial color={C.teal}/></mesh></>
  if(stage===1)return <><group scale={.65} position={[0,1.2,-.8]}><CityNodes/></group><Screen title="Ingestion" position={[-2,-.55,.4]} width={1.7}/><Screen title="Validation" position={[0,-.55,.4]} width={1.7} accent={C.orange}/><Database position={[2,-.65,.4]}/><Screen title="BigQuery hourly storage" position={[2,-1.5,.5]} width={2} height={.6}/><Stream from={[-1.1,-.5,.4]} to={[-.9,-.5,.4]} color={C.orange}/><Stream from={[.9,-.5,.4]} to={[1.6,-.3,.4]}/>{cities.map((p,i)=><Stream key={i} from={[p[0]*.65,p[1]*.65+1.2,-.7]} to={[-2,.1,.4]} count={5}/>)}</>
  if(stage===2)return <><group position={[-1.7,.5,0]} rotation={[.25,.5,.1]}>{Array.from({length:36},(_,i)=><mesh key={i} position={[(i%6)*.27-.65,Math.floor(i/6)*.27-.65,(i%3)*.16]}><boxGeometry args={[.15,.15,.15]}/><meshStandardMaterial color={i%5?C.teal:C.orange} emissive={i%5?C.teal:C.orange} emissiveIntensity={.18}/></mesh>)}</group><Screen title="606 ordered features" position={[-1.6,-.8,.3]} width={2.2} height={.7}/>{['Train','Validation','Test'].map((t,i)=><group key={t}><Screen title={t} position={[.5+i*.85,.8-i*.75,.1+i*.4]} width={1.3} height={.85} accent={[C.teal,C.blue,C.orange][i]}/></group>)}<Stream from={[-.6,.5,0]} to={[.4,.5,.2]}/><Line points={[[.2,-1.5,0],[2.9,-1.5,0]]} color={C.orange}/><Stream from={[.4,-1.35,0]} to={[2.8,-1.35,0]} color={C.orange}/></>
  if(stage===3)return <>{['Ridge','Random Forest','Hist. Gradient Boost'].map((t,i)=><Screen key={t} title={t} position={[-2.1,1.25-i*1.2,-.3]} width={1.8} height={.85} accent={i===0?C.orange:C.blue}/>)}<mesh position={[0,.25,.3]} rotation={[.4,.4,.7]}><octahedronGeometry args={[.65,0]}/><meshPhysicalMaterial {...M.panel} color={C.teal} wireframe/></mesh><Screen title="MLflow / evaluation" position={[.1,-1,.6]} width={1.9} height={.85}/><Screen title="Registered artifact" position={[2,0,.6]} width={1.9} height={1.35} accent={C.orange}/>{[0,1,2].map(i=><Stream key={i} from={[-1.2,1.25-i*1.2,-.3]} to={[-.5,.25,.3]}/>)}<Stream from={[.5,.25,.3]} to={[1.1,0,.6]} color={C.orange} count={3}/></>
  return <><Screen title="Model bundles" position={[-2.15,.8,-.5]} width={1.75} height={.9}/><Screen title="FastAPI" position={[-2.1,-.6,.1]} width={1.75} height={1.1} accent={C.orange}/><Screen kind="dashboard" title="Streamlit / AQI" position={[.75,0,.2]} width={3.6} height={2.1} rotation={[0,-.12,0]}/>{['24h','48h','72h'].map((t,i)=><Screen key={t} title={t} position={[-.7+i*1.35,-1.55,.8]} width={1.15} height={.75} accent={i===2?C.orange:C.teal}/>)}<Stream from={[-2.1,.35,-.4]} to={[-2.1,-.05,.1]}/><Stream from={[-1.2,-.6,.1]} to={[-.6,0,.3]} color={C.orange}/>{['3 cities','BigQuery','Features','MLflow'].map((t,i)=><Screen key={t} title={t} position={[-2.5+i*1.65,1.95,-.5]} width={1.35} height={.65}/>)}{[0,1,2].map(i=><Stream key={i} from={[-1.8+i*1.65,1.95,-.5]} to={[-1.55+i*1.65,1.95,-.5]}/>)}<Stream from={[2.4,1.65,-.5]} to={[-2.1,1.3,-.5]} bend={.15}/></>
}

function AnimatedStage({active,children,index,variant}) {
  const ref=useRef(),runtime=useSceneRuntime(),time=useRef(0)
  useFrame((_,dt)=>{const obj=ref.current;if(!obj)return
    if(runtime.running)time.current+=Math.min(dt,.05)
    const target=active?1:.001, blend=runtime.reducedMotion?1:1-Math.exp(-Math.min(dt,.05)*7)
    obj.scale.lerp(new THREE.Vector3(target,target,target),blend)
    obj.visible=obj.scale.x>.005
    obj.position.x=THREE.MathUtils.lerp(obj.position.x,active?0:(variant==='aqi-forecasting'?-3:3),blend)
    obj.rotation.y=runtime.reducedMotion?0:Math.sin(time.current*.24+index)*.045
    obj.position.y=runtime.reducedMotion?0:Math.sin(time.current*.55)*.045
  })
  return <group ref={ref} scale={active?1:.001} position={[active?0:3,0,0]}>{children}</group>
}

function World({variant,stage,onReady}) {
  const {camera,size,invalidate}=useThree(),runtime=useSceneRuntime(),sweep=useRef(),time=useRef(0),reported=useRef(false)
  useEffect(()=>{invalidate()},[stage,invalidate])
  useFrame((_,dt)=>{
    if(!reported.current){reported.current=true;onReady()}
    const aspect=size.width/Math.max(1,size.height), distance=(variant==='aqi-forecasting'?8.8:8.7)*[1.02,.94,1.02,1.13,1.16][stage]/Math.min(aspect,1.3)
    const aim=new THREE.Vector3(variant==='aqi-forecasting'?[-.6,.6,-.4,.7,0][stage]:[.6,-.5,.55,0,.7][stage],variant==='aqi-forecasting'?.8:.35,distance)
    camera.position.lerp(aim,runtime.reducedMotion?1:1-Math.exp(-Math.min(dt,.05)*3));camera.lookAt(0,0,0)
    if(runtime.running)time.current+=Math.min(dt,.05)
    if(sweep.current)sweep.current.position.x=Math.sin(time.current*.45)*4
  })
  return <>
    <color attach="background" args={[C.background]}/><ambientLight intensity={1.5}/><hemisphereLight args={['#c5f7f0','#082334',2]}/>
    <directionalLight position={[3,5,5]} intensity={3} color={C.warmWhite}/><pointLight ref={sweep} position={[-3,2,4]} intensity={12} color={C.teal}/><pointLight position={[3,-1,3]} intensity={10} color={C.orange}/>
    {[0,1,2,3,4].map(i=><AnimatedStage key={i} active={stage===i} index={i} variant={variant}>{variant==='lobatse-pharmacy'?<Commerce stage={i} active={stage===i}/>:<Forecast stage={i}/>}</AnimatedStage>)}
    <gridHelper args={[18,24,'#123d49','#09212d']} position={[0,-2.3,-1]}/>
  </>
}

export function SystemFallback({study,stage=0}) {
  return <div className="system-fallback" data-fallback="true"><img src={`/case-studies/${study.id}.svg`} alt={study.id==='lobatse-pharmacy'?'Illustrated pharmacy storefront connected to catalog, orders, and private prescription review':'Three city streams connected to data, features, models, and forecast horizons'}/><p>{study.stages[stage].label} <span>— {study.stages[stage].title}</span></p><small>System illustration · full stage explanation follows</small></div>
}

export default function CaseStudyScene({study,stage=0}) {
  const [ready,setReady]=useState(false)
  const onReady=useCallback(()=>setReady(true),[])
  const forced=typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('renderer')==='fallback'
  const fallback=<SystemFallback study={study} stage={stage}/>
  return <div className="case-scene" data-scene={study.id} data-stage={stage+1}>{forced?fallback:<><SceneCanvas visibilityMargin="0px" sceneKey={`${study.id}-${stage}`} ariaLabel={`${study.name}: ${study.stages[stage].title}`} fallback={fallback}><World variant={study.id} stage={stage} onReady={onReady}/></SceneCanvas>{!ready&&<div className="case-scene__loading" aria-hidden="true">{fallback}</div>}</>}</div>
}

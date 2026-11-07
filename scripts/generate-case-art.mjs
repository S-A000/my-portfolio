import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { URL } from 'node:url'
const out = new URL('../public/case-studies/', import.meta.url)
mkdirSync(out, { recursive: true })
const label=(x,y,t,size=14,color='#a7c7d0')=>`<text x="${x}" y="${y}" font-family="Arial,sans-serif" font-size="${size}" fill="${color}">${t}</text>`
const rect=(x,y,w,h,fill='#0b2939',stroke='#255263',r=10)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`
const defs=`<defs><radialGradient id="bg"><stop stop-color="#124553"/><stop offset="1" stop-color="#030b12"/></radialGradient><linearGradient id="beam"><stop stop-color="#27d2e4" stop-opacity=".1"/><stop offset=".5" stop-color="#27d2e4"/><stop offset="1" stop-color="#ff762b"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#6cb1c4" stroke-opacity=".08"/></pattern><filter id="glow"><feGaussianBlur stdDeviation="4"/></filter></defs>`
const base=(body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="650" viewBox="0 0 1000 650">${defs}<rect width="1000" height="650" fill="url(#bg)"/>${body}</svg>`
const product=(x,y,i,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${rect(0,0,83,108,'#f2efe3','#b9d9cb',5)}${rect(26,23,32,54,'#fffdf4','#d4d8cc',4)}${rect(30,16,24,12,i%2?'#16887f':'#ee8b48','none',2)}${rect(27,43,30,17,i%2?'#16887f':'#ee8b48','none',0)}${label(10,96,['WELLNESS','CARE','ESSENTIAL'][i%3],8,'#22535a')}</g>`
let pharmacy=`<path d="M118 226C200 200 184 340 290 310M165 420C220 420 225 380 280 385M723 362C810 385 760 480 830 490" fill="none" stroke="url(#beam)" stroke-width="2"/>`
pharmacy+=`<g transform="translate(80 160) rotate(-10)">${product(0,0,0,.8)}${product(10,126,1,.8)}${product(20,252,2,.8)}</g>`
pharmacy+=`<g transform="translate(240 120) rotate(-4 270 175)">${rect(0,0,525,350,'#102b39','#508897',14)}${rect(12,12,501,326,'#f5f0e8','none',5)}${rect(12,12,501,40,'#164b50','none',3)}${label(30,38,'LOBATSE / PHARMACY',14,'#f5f0e8')}${label(30,80,'Shop    Wellness    Personal care    Account',10,'#35646a')}${rect(30,96,465,33,'#e3e6de','none',4)}${label(43,117,'Find your everyday essentials',12,'#456d71')}${label(30,162,'Care for your everyday.',26,'#164b50')}${product(32,184,0,1.15)}${product(151,184,1,1.15)}${product(270,184,2,1.15)}${product(389,184,3,1.15)}</g>`
pharmacy+=`<g transform="translate(682 278) rotate(8)">${rect(0,0,145,265,'#061a25','#629ca4',18)}${rect(8,16,129,230,'#f5f0e8','none',8)}${rect(8,16,129,31,'#164b50','none',2)}${label(17,37,'LOBATSE',12,'#fff')}${label(18,71,'Shop · Search · Basket',9,'#35646a')}${product(18,87,1,.57)}${label(72,111,'Wellness',10,'#35646a')}${product(18,159,2,.57)}${label(72,182,'Daily care',10,'#35646a')}</g>`
pharmacy+=`${rect(280,515,230,60,'#103b40','#277e7b')}${label(299,541,'COMMERCE',10,'#ff9b56')}${label(299,560,'Basket → COD → Orders',14,'#f5f0e8')}${rect(535,515,230,60,'#0f2b39','#277e7b')}${label(554,541,'PRESCRIPTION REVIEW',10,'#27d2e4')}${label(554,560,'Upload → Review → Decision',14,'#f5f0e8')}${label(52,613,'ORIGINAL SYSTEM ILLUSTRATION / 11,204 SOURCE ROWS PROCESSED',11,'#82a5b4')}`
writeFileSync(new URL('lobatse-pharmacy.svg',out),base(pharmacy))
let aqi=`<g fill="none" stroke="url(#beam)" stroke-width="2"><path d="M170 165C170 300 280 250 325 330S500 350 570 315S750 290 815 330"/><path d="M465 130C465 240 340 240 325 330"/><path d="M785 170C785 260 360 220 325 330"/></g>`
for(const [i,[x,y,name]] of [[170,165,'KARACHI'],[465,130,'LAHORE'],[785,170,'ISLAMABAD']].entries()) {
 aqi+=`<ellipse cx="${x}" cy="${y}" rx="56" ry="18" fill="#0b3345" stroke="#378494"/><circle cx="${x}" cy="${y-25}" r="15" fill="${i===1?'#ff762b':'#27d2e4'}"/>${label(x-43,y+50,name,12,'#bdd4d9')}`
 for(let p=0;p<12;p++)aqi+=`<circle cx="${x-32+((p*23)%67)}" cy="${y-60-p*4}" r="${1+p%3}" fill="#8cf3f4" opacity="${.3+p*.04}"/>`
}
aqi+=`<g transform="translate(250 294)">${rect(0,0,150,105)}${label(22,32,'BIGQUERY',13,'#8db8fc')}<ellipse cx="75" cy="54" rx="36" ry="10" fill="#194d75" stroke="#4285f4"/><path d="M39 54v22c0 13 72 13 72 0V54" fill="#194d75" stroke="#4285f4"/></g>`
aqi+=`<g transform="translate(450 252) rotate(12 60 60)">`
for(let i=0;i<25;i++)aqi+=rect((i%5)*23,Math.floor(i/5)*23,13,13,i%6?'#228b99':'#ff762b','none',2)
aqi+=`</g>${label(438,418,'606 ORDERED FEATURES',12,'#9ad9de')}`
aqi+=`${rect(675,287,210,122)}${label(695,318,'MODEL LIFECYCLE',11,'#ff9b56')}${label(695,349,'Evaluate · Track',19,'#f5f0e8')}${label(695,380,'Register · Serve',19,'#f5f0e8')}`
aqi+=`<path d="M330 414C330 470 400 488 455 488M780 424C780 480 600 488 550 488" fill="none" stroke="url(#beam)" stroke-width="2"/>`
for(let i=0;i<3;i++)aqi+=`${rect(262+i*172,480,151,82,'#0e3542',i===2?'#d27842':'#328390')}${label(284+i*172,521,[ '24h','48h','72h'][i],29,i===2?'#ff9b56':'#7ee7e7')}${label(284+i*172,545,'DIRECT HORIZON',9)}`
aqi+=label(52,613,'ORIGINAL SYSTEM ILLUSTRATION / THREE CITIES · DIRECT FORECASTS',11,'#82a5b4')
writeFileSync(new URL('aqi-forecasting.svg',out),base(aqi))
const logo=readFileSync(new URL('../public/sam-logo-full.png',import.meta.url)).toString('base64')
for(const [id,title,subtitle] of [['index','Engineering, made visible.','Case studies / Software · Data · MLOps'],['lobatse-pharmacy','Lobatse Pharmacy','11,204 source rows processed / Custom commerce platform'],['aqi-forecasting','Three-City AQI Forecasting','105,054 hourly rows / 606 ordered features']]){
 writeFileSync(new URL(`social-${id}.svg`,out),`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#061521"/><circle cx="1100" cy="20" r="420" fill="#103d48"/><path d="M0 530H1200" stroke="#235160"/><image href="data:image/png;base64,${logo}" x="60" y="50" width="160" height="112"/>${label(65,250,'SAM INTELLIGENCE GROUP / CASE STUDIES',19,'#27d2e4')}${label(60,350,title,54,'#f5f0e8')}${label(65,425,subtitle,24,'#ff9b56')}${label(65,580,'ENGINEERING DATA, INTELLIGENT SYSTEMS, AND CUSTOM SOFTWARE.',17,'#b1c7cd')}</svg>`)
}

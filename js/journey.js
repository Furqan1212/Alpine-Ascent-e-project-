/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/journey.js - HOME page only - the "Climb Everest by scrolling" section
   WHAT IT DOES:
     Reads how far you have scrolled through <section class="journey"> and updates: altitude, oxygen, temperature, zone, sky colour
     (--sky-top / --sky-bot), the orange route #jRoute, the climber dot #jDot, the camp markers .jmark and the active camp card .jstage.
     Without html.motion (reduced motion) the six camp cards just read as a normal list. CSS: §26.
   HTML IT USES: .journey #hAlt #hO2 #hO2bar #hTemp #hZone #jRoute #jDot .jmark .jstage
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Home page "Climb Everest by scrolling". Styles: css/style.css §26. Only runs when html.motion is set;
   otherwise the six camp cards simply read as a normal list (accessible, no sticky stage). */
(function(){
  'use strict';
  const sec=document.querySelector('.journey');
  if(!sec||!document.documentElement.classList.contains('motion'))return;
  const $=s=>sec.querySelector(s), cards=[...sec.querySelectorAll('.jstage')];
  const ALT=cards.map(c=>+c.dataset.alt), TEMP=cards.map(c=>+c.dataset.temp), N=cards.length;
  const route=$('#jRoute'),dot=$('#jDot'),marks=[...sec.querySelectorAll('.jmark')],len=route.getTotalLength();
  const lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t*t*(3-2*t), clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const o2=h=>Math.pow(1-2.25577e-5*h,5.25588)*100;           /* % of sea-level air pressure (standard atmosphere) */
  const SKY=[[[20,57,95],[61,120,173]],[[2,4,10],[11,18,32]]]; /* [top,bottom] at base -> summit */
  const mix=(a,b,t)=>'rgb('+a.map((v,i)=>Math.round(lerp(v,b[i],t))).join(',')+')';
  marks.forEach((m,i)=>{const p=route.getPointAtLength(len*i/(N-1));m.setAttribute('transform','translate('+p.x+','+p.y+')')});
  route.style.strokeDasharray=len;
  let ticking=false;
  function update(){
    ticking=false;
    const r=sec.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight),0,1),t=p*(N-1),i=Math.min(Math.floor(t),N-2),f=ease(t-i);
    const alt=lerp(ALT[i],ALT[i+1],f), temp=lerp(TEMP[i],TEMP[i+1],f), ox=o2(alt);
    $('#hAlt').textContent=Math.round(alt).toLocaleString('en-US');
    $('#hO2').textContent=ox.toFixed(0)+'%';$('#hO2bar').style.width=ox+'%';
    $('#hTemp').textContent=Math.round(temp)+'°C';
    const z=alt>=8000?'Death zone':alt>=7000?'Very high altitude':'High altitude';
    const zl=$('#hZone');zl.textContent=z;zl.classList.toggle('hot',alt>=8000);
    const act=Math.round(t);cards.forEach((c,k)=>c.classList.toggle('on',k===act));
    marks.forEach((m,k)=>m.classList.toggle('reached',t>=k-.02));
    route.style.strokeDashoffset=len*(1-p);
    const pt=route.getPointAtLength(len*p);dot.setAttribute('transform','translate('+pt.x+','+pt.y+')');
    sec.style.setProperty('--sky-top',mix(SKY[0][0],SKY[1][0],p));sec.style.setProperty('--sky-bot',mix(SKY[0][1],SKY[1][1],p));
    sec.querySelector('.journey__hint').style.opacity=p>.03?0:1;
    $('#mtnBack').style.transform='translateY('+(p*5)+'%)';
  }
  addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('resize',update);update();
})();

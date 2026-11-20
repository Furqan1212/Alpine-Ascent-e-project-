/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/motion.js - loaded on every page after main.js; runs ONLY when <html class="motion"> is set (an inline script in each <head> adds it, unless the visitor prefers reduced motion)
   WHAT IT DOES:
     1. Headline reveal   - splits h1 / h2 into words (.w) that rise into view (CSS §24).
     2. Page wipe         - a ridge-shaped overlay (.wipe) sweeps across when you click an internal link.
     3. Snow              - <canvas class="snow"> falling snow on the HOME hero only.
     4. Mouse parallax    - the home hero photo shifts with the cursor (CSS variables --mx / --my).
     5. Cards + buttons   - cursor spotlight on .card and a magnetic pull on .btn (mouse devices only).
   HTML IT USES: h1 h2 .hero .hero__bg .card .btn .wipe canvas.snow
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* ALPINE ASCENTS — motion layer (vanilla JS). Styles: css/style.css §24.
   Everything here is skipped when the visitor prefers reduced motion (html.motion is never added). */
(function(){
  'use strict';
  const root=document.documentElement;
  if(!root.classList.contains('motion'))return;
  const $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* 1. Headline word-mask reveal: wraps every word in a masked span that rises into view */
  function split(node,state){
    [...node.childNodes].forEach(ch=>{
      if(ch.nodeType===3){
        const f=document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(t=>{
          if(!t.trim()){f.appendChild(document.createTextNode(t));return}
          const w=document.createElement('span'),i=document.createElement('span');
          w.className='w';i.textContent=t;i.style.setProperty('--i',state.n++);w.appendChild(i);f.appendChild(w);
        });
        ch.replaceWith(f);
      }else if(ch.nodeType===1)split(ch,state);
    });
  }
  const heads=$$('.hero h1,.page-hero h1,.section h2,.cta h2');
  heads.forEach(h=>{h.classList.remove('reveal');h.setAttribute('aria-label',h.textContent.trim());split(h,{n:0});h.classList.add('split-ready')});
  const hio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('split-in');hio.unobserve(e.target)}}),{threshold:.3});
  heads.forEach(h=>h.matches('.hero h1,.page-hero h1')?requestAnimationFrame(()=>setTimeout(()=>h.classList.add('split-in'),250)):hio.observe(h));

  /* 2. Page transition: a ridge-line wipe between pages (falls back to a plain navigation if anything fails) */
  const wipe=document.createElement('div');wipe.className='wipe';wipe.setAttribute('aria-hidden','true');document.body.appendChild(wipe);
  let flag=false;try{flag=sessionStorage.getItem('aa_wipe')==='1';sessionStorage.removeItem('aa_wipe')}catch(e){}
  if(flag){wipe.classList.add('cover');requestAnimationFrame(()=>requestAnimationFrame(()=>wipe.classList.remove('cover')))}
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||a.target||a.hasAttribute('download'))return;
    const u=new URL(a.href,location.href);
    if(u.protocol!==location.protocol||u.host!==location.host||!/\.html?$|\/$/.test(u.pathname)||(u.pathname===location.pathname&&u.hash))return;
    e.preventDefault();try{sessionStorage.setItem('aa_wipe','1')}catch(x){}
    wipe.classList.add('go');setTimeout(()=>{location.href=a.href},520);
  });
  addEventListener('pageshow',e=>{if(e.persisted)wipe.classList.remove('go')});

  /* 3. Falling snow on the home hero (canvas, paused when off-screen or tab hidden) */
  const hero=document.querySelector('.hero');
  if(hero){
    const c=document.createElement('canvas');c.className='snow';c.setAttribute('aria-hidden','true');hero.insertBefore(c,hero.querySelector('.wrap'));
    const x=c.getContext('2d'),N=fine?90:36;let W,H,fl=[],run=true,vis=true;
    const size=()=>{const d=Math.min(devicePixelRatio||1,2);W=c.width=hero.clientWidth*d;H=c.height=hero.clientHeight*d;x.setTransform(1,0,0,1,0,0)};
    size();addEventListener('resize',size);
    for(let i=0;i<N;i++)fl.push({x:Math.random(),y:Math.random(),r:Math.random()*2.2+.6,s:Math.random()*.0006+.0003,p:Math.random()*6,a:Math.random()*.5+.25});
    new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(hero);
    document.addEventListener('visibilitychange',()=>{run=!document.hidden});
    (function frame(t){
      if(run&&vis){x.clearRect(0,0,W,H);
        fl.forEach(f=>{f.y+=f.s*16;f.x+=Math.sin(t/1800+f.p)*.0004;if(f.y>1){f.y=-.02;f.x=Math.random()}
          x.beginPath();x.fillStyle='rgba(238,246,251,'+f.a+')';x.arc(f.x*W,f.y*H,f.r*(W/1400+.6),0,6.283);x.fill()})}
      requestAnimationFrame(frame)})(0);
    /* mouse parallax on the hero photo (desktop only) */
    const bg=hero.querySelector('.hero__bg');let pend=false;
    if(fine&&bg)hero.addEventListener('mousemove',e=>{if(pend)return;pend=true;requestAnimationFrame(()=>{
      const r=hero.getBoundingClientRect();bg.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5)*-26+'px');bg.style.setProperty('--my',((e.clientY-r.top)/r.height-.5)*-16+'px');pend=false})});
  }

  /* 4. Card spotlight + magnetic buttons (desktop pointers only) */
  if(fine){
    $$('.card').forEach(c=>c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}));
    $$('.btn').forEach(b=>{
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.setProperty('--tx',(e.clientX-r.left-r.width/2)*.18+'px');b.style.setProperty('--ty',(e.clientY-r.top-r.height/2)*.28+'px')});
      b.addEventListener('mouseleave',()=>{b.style.setProperty('--tx','0px');b.style.setProperty('--ty','0px')});
    });
  }
})();

/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/main.js - loaded on EVERY page
   WHAT IT DOES:
     1. Image safety net  - a photo that fails to load becomes images/fallback.svg. Add ?imgcheck=1 to any page address to list broken photos.
     2. Navbar            - goes solid on scroll (.nav.scrolled, CSS §4), fills the progress bar (.progress, §2), parallax on the hero photo.
     3. Mobile menu       - the .burger button toggles .links.open (CSS §4, screens under 1100px).
     4. Active page       - marks the current page in .links (and "Learn" when you are on a chapter page).
     5. Learn dropdown    - click / Esc / outside-click for .dd (hovering is pure CSS, §4b).
     6. Reveal on scroll  - adds .in to each .reveal element when it scrolls into view (CSS §14), plus a safety timer.
     7. Count-up numbers  - any element with data-count="N" counts from 0 up to N (CSS §6 .stat).
     8. Visitor counter   - #visitCount rolling digits + hover card #visTip (CSS §4c). Starts at 0; counts a new visit or a refresh, not page changes; ?resetcounter=1 resets it.
     9. Location + ticker - window.AA_getPosition remembers permission (6 h); [data-tick] spans in the bottom ticker show date, time, place (CSS §13).
   HTML IT USES: .nav .progress .burger .links .dd .reveal [data-count] #visitCount #visTip [data-tick]
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* ALPINE ASCENTS — main behaviour (vanilla JS) */
(function(){
  'use strict';
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];


  /* Image safety net: a photo that fails to load becomes a local mountain illustration (never a blank or broken box).
     Add ?imgcheck=1 to any page address to list the broken photo links. */
  const FB=new URL(document.querySelector('script[src*="main.js"]').getAttribute('src').replace('js/main.js','images/fallback.svg'),location.href).href;
  window.AA_FB=FB;const badImgs=[];
  function fixImg(i){if(i.dataset.fb)return;i.dataset.fb='1';badImgs.push(i.currentSrc||i.src);i.removeAttribute('srcset');i.src=FB}
  $$('img').forEach(i=>{if(i.complete&&i.naturalWidth===0&&i.getAttribute('src'))fixImg(i)});
  document.addEventListener('error',e=>{if(e.target.tagName==='IMG')fixImg(e.target)},true);
  $$('[style*="background-image"]').forEach(el=>{
    const u=(el.getAttribute('style').match(/url\(['"]?([^'")]+)/)||[])[1];if(!u||u===FB)return;
    const t=new Image();t.onerror=()=>{badImgs.push(u);el.style.backgroundImage="url('"+FB+"')"};t.src=u;
  });
  if(/imgcheck/.test(location.search))addEventListener('load',()=>setTimeout(()=>{
    const d=document.createElement('div');d.style.cssText='position:fixed;left:12px;bottom:52px;z-index:900;max-width:min(560px,92vw);max-height:60vh;overflow:auto;background:#fff;color:#111;padding:14px 16px;border-radius:8px;font:13px/1.5 monospace;box-shadow:0 10px 40px rgba(0,0,0,.5)';
    const uniq=[...new Set(badImgs.map(u=>u.split('?')[0]))];d.innerHTML='<b>Image check</b><br>'+(uniq.length?uniq.length+' broken photo(s):<br>'+uniq.map(u=>'• '+u.replace(/[<>]/g,'')).join('<br>'):'All photos loaded.');document.body.appendChild(d);
  },2500));

  /* Nav scrolled state, progress bar, hero parallax */
  const nav=$('.nav'), bar=$('.progress'), bg=$('.hero__bg');
  function onScroll(){
    const y=window.scrollY, h=document.documentElement.scrollHeight-innerHeight;
    nav.classList.toggle('scrolled',y>40);
    bar.style.width=(h>0?y/h*100:0)+'%';
    if(bg&&y<innerHeight)bg.style.setProperty('--py',y*0.25+'px');
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* Mobile menu */
  const burger=$('.burger'), links=$('.links');
  function toggleMenu(open){
    burger.setAttribute('aria-expanded',open);links.classList.toggle('open',open);
    document.body.style.overflow=open?'hidden':'';
  }
  burger.addEventListener('click',()=>toggleMenu(burger.getAttribute('aria-expanded')!=='true'));
  $$('.links a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});

  /* Active nav link = the page you are on (matches filename) */
  const here=location.pathname.split('/').pop()||'index.html';
  $$('.links a').forEach(a=>{
    const on=a.pathname.split('/').pop()===here;
    a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','page');
  });

  /* Learn dropdown: click/keyboard toggle (hover handled in CSS); parent highlights when a child page is open */
  const dd=$('.dd'), ddb=$('.dd__btn');
  if(dd){
    if($('.dd__menu a.active'))ddb.classList.add('active');
    const setDD=o=>{dd.classList.toggle('open',o);ddb.setAttribute('aria-expanded',o)};
    ddb.addEventListener('click',e=>{e.stopPropagation();setDD(!dd.classList.contains('open'))});
    document.addEventListener('click',e=>{if(!dd.contains(e.target))setDD(false)});
    addEventListener('keydown',e=>{if(e.key==='Escape')setDD(false)});
  }

  /* Reveal on scroll */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>io.observe(el));

  /* Reveal safety net: if scroll detection ever misses an element that is on screen, show it anyway */
  setInterval(()=>{$$('.reveal:not(.in)').forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight*.95&&r.bottom>0)el.classList.add('in')})},800);

  /* Count-up stats */
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;cio.unobserve(e.target);
    const el=e.target,end=+el.dataset.count,t0=performance.now();
    (function step(t){const p=Math.min((t-t0)/1600,1);
      el.textContent=Math.round(end*(1-Math.pow(1-p,3))).toLocaleString();
      if(p<1)requestAnimationFrame(step)})(t0);
  }),{threshold:.6});
  $$('[data-count]').forEach(el=>cio.observe(el));

  /* Visitor counter: rolling odometer digits, a live dot, and a hover card ("Climber #N", your own visits).
     Stored in this browser only (localStorage), because the project has no server. */
  let n=0,mine=0,first=new Date();
  try{
    /* The counter starts at 0. A one-time version marker wipes any older saved numbers, and adding ?resetcounter=1 to any page address resets it to 0 again. */
    const reset=/[?&]resetcounter/.test(location.search);
    if(reset||localStorage.getItem('aa_counter_v')!=='2'){['aa_visits','aa_mine','aa_first'].forEach(k=>localStorage.removeItem(k));localStorage.setItem('aa_counter_v','2')}
    /* Count a new VISIT (first page opened in this tab/session) or a REFRESH. Moving between pages, or Back/Forward, does not count. */
    const navType=((performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{}).type;
    const newVisit=!sessionStorage.getItem('aa_session'),refresh=navType==='reload';
    sessionStorage.setItem('aa_session','1');
    n=+localStorage.getItem('aa_visits')||0;mine=+localStorage.getItem('aa_mine')||0;
    if(!reset&&(newVisit||refresh)){n++;mine++;localStorage.setItem('aa_visits',n);localStorage.setItem('aa_mine',mine)}
    const f=localStorage.getItem('aa_first');if(f)first=new Date(f);else localStorage.setItem('aa_first',first.toISOString());
  }catch(e){}
  const vc=$('#visitCount'),vtxt=n.toLocaleString('en-US');
  vc.setAttribute('aria-label',vtxt+' visitors');vc.textContent='';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){vc.textContent=vtxt}
  else[...vtxt].forEach((ch,i)=>{
    const o=document.createElement('span');o.setAttribute('aria-hidden','true');
    if(/\d/.test(ch)){
      o.className='odo';const col=document.createElement('span');col.className='odo__col';col.style.transitionDelay=(i*90)+'ms';
      for(let k=0;k<10;k++){const d=document.createElement('span');d.textContent=k;col.appendChild(d)}
      o.appendChild(col);requestAnimationFrame(()=>requestAnimationFrame(()=>col.style.setProperty('--d',ch)));
    }else o.textContent=ch;
    vc.appendChild(o);
  });
  $('#visTipTitle').textContent='Climber #'+vtxt;
  $('#visTipSub').textContent='Your visits: '+mine+' · first seen '+first.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});

  /* Ticker: date, time, location (HTML5 Geolocation) */
  let place='Location permission not granted';
  const tickEls=$$('[data-tick]');
  function tick(){
    const d=new Date();
    const txt=d.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
      +'  ·  '+d.toLocaleTimeString('en-GB')+'  ·  '+place;
    tickEls.forEach(el=>el.textContent=txt);
  }
  /* Location: browsers do not remember "Allow" for pages opened from a local file (file://), so the site remembers it itself.
     A granted position is kept for 6 hours (localStorage); a refusal is remembered for the session so it is not asked on every page.
     window.AA_getPosition is also used by the Clubs page. */
  const GEO_KEY='aa_geo',GEO_TTL=6*3600*1000;
  const fmtPos=(la,lo)=>Math.abs(la).toFixed(3)+'° '+(la>=0?'N':'S')+', '+Math.abs(lo).toFixed(3)+'° '+(lo>=0?'E':'W');
  window.AA_getPosition=function(ok,fail,o){
    o=o||{};let s=null,denied=false;
    try{s=JSON.parse(localStorage.getItem(GEO_KEY))}catch(e){}
    try{denied=sessionStorage.getItem('aa_geo_denied')==='1'}catch(e){}
    if(s&&Date.now()-s.t<GEO_TTL){ok({coords:{latitude:s.la,longitude:s.lo}});return}
    if(denied&&!o.retry){fail({code:1});return}
    if(!('geolocation' in navigator)){fail({code:0});return}
    navigator.geolocation.getCurrentPosition(p=>{
      try{localStorage.setItem(GEO_KEY,JSON.stringify({la:p.coords.latitude,lo:p.coords.longitude,t:Date.now()}));sessionStorage.removeItem('aa_geo_denied')}catch(e){}
      ok(p)},e=>{try{sessionStorage.setItem('aa_geo_denied','1')}catch(x){}fail(e)},{timeout:10000,maximumAge:600000});
  };
  place='Locating you…';
  AA_getPosition(p=>{place='Your position: '+fmtPos(p.coords.latitude,p.coords.longitude)},e=>{place=e&&e.code===0?'Geolocation not supported':'Location permission not granted'});
  tick();setInterval(tick,1000);
})();

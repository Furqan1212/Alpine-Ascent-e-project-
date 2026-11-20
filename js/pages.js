/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/pages.js - loaded on every inner page; each block does nothing if its element is not on the page
   WHAT IT DOES:
     1. Flip cards        - .flip buttons toggle aria-pressed (myth <-> fact). Pages: most chapter pages. CSS §28.
     2. Filter chips      - any [data-filter] block hides/shows items by data-era. Page: history. CSS §16.
     3. Tabs              - [data-tabs] with [role=tab] / [role=tabpanel] (arrow keys work). Pages: information, techniques, guidelines, gallery.
     4. Symptom checker   - #symForm ticks -> advice in #symBox / #symOut. Page: hazards.
     5. Snow-cave diagram - #cave hotspots .hs -> text in #caveT / #caveD. Page: sheltering.
     6. Timeline photo    - .tl__photo follows the .tl you are reading. Pages: history, records, developments, contact. CSS §31.
   HTML IT USES: .flip [data-filter] [data-tabs] #symForm #cave .hs .tl__photo .tl
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Interactive page pieces: myth/fact flip cards, tabs, altitude-symptom checker, snow-cave diagram.
   Styles: css/style.css §28. Every block is a no-op on pages that do not have the element. */
(function(){
  'use strict';
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

  /* Myth/fact flip cards */
  $$('.flip').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')));

  /* Filter chips for any [data-filter] block: items carry data-era */
  $$('[data-filter]').forEach(w=>{
    const items=$$('[data-era]',w);
    $$('.chip',w).forEach(c=>c.addEventListener('click',()=>{
      $$('.chip',w).forEach(x=>{x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c)});
      items.forEach(i=>i.classList.toggle('hide',c.dataset.f!=='all'&&i.dataset.era!==c.dataset.f));
    }));
  });

  /* Tabs (arrow keys supported) */
  $$('[data-tabs]').forEach(w=>{
    const tabs=$$('[role=tab]',w),panels=$$('[role=tabpanel]',w);
    const sel=i=>{tabs.forEach((t,k)=>{t.setAttribute('aria-selected',k===i);t.tabIndex=k===i?0:-1});panels.forEach((p,k)=>p.hidden=k!==i)};
    tabs.forEach((t,i)=>{
      t.addEventListener('click',()=>sel(i));
      t.addEventListener('keydown',e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){const n=(i+d+tabs.length)%tabs.length;sel(n);tabs[n].focus()}});
    });sel(0);
  });

  /* Altitude symptom checker (educational, not medical advice) */
  const sf=$('#symForm');
  if(sf){
    const out=$('#symOut'),box=$('#symBox');
    const R={
      3:['lvl2','Emergency signs','These can mean high-altitude pulmonary or cerebral oedema (HAPE or HACE). Descend now, even at night. Give oxygen if available, keep the person warm, never leave them alone, and call for rescue.'],
      2:['lvl1','Possible acute mountain sickness','Stop going higher. Rest, drink water, and avoid alcohol and sleeping pills. Descend if symptoms worsen or have not improved after a day.'],
      1:['lvl0','Mild symptoms','Rest at this altitude and tell your team. Do not climb higher until the symptoms have cleared.'],
      0:['lvl0','No symptoms selected','Keep a steady pace, drink plenty, and check again each day as you climb.']};
    function check(){
      const c=g=>$$('input[data-g="'+g+'"]:checked',sf).length;
      const ams=c('ams'),bad=c('hace')+c('hape'),head=!!$('input[name=headache]:checked',sf);
      const lvl=bad?3:(head&&ams>=2)?2:ams?1:0,r=R[lvl];
      box.className='panel sym__res '+r[0];$('h3',box).textContent=r[1];out.textContent=r[2];
    }
    sf.addEventListener('change',check);check();
  }

  /* Snow-cave diagram hotspots */
  const cave=$('#cave');
  if(cave){
    const T={
      entrance:['Entrance below the sleeping shelf','Cold air is heavy and sinks, so it drains out of the sleeping area. This is why the entrance sits lower than the platform.'],
      platform:['Raised sleeping platform','Warm air rises and collects on the high shelf. Insulate yourself from the snow with a mat or pack.'],
      vent:['Ventilation hole','Poke a hole through the roof and keep it open. Check it often during snowfall, so fresh air always reaches you.'],
      roof:['Domed roof, about 30 cm thick','A dome sheds drips instead of letting them fall on you, and it is much stronger than a flat ceiling.']};
    const show=k=>{$('#caveT').textContent=T[k][0];$('#caveD').textContent=T[k][1];$$('.hs',cave).forEach(h=>h.classList.toggle('on',h.dataset.k===k))};
    $$('.hs',cave).forEach(h=>{
      h.addEventListener('click',()=>show(h.dataset.k));h.addEventListener('mouseenter',()=>show(h.dataset.k));
      h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(h.dataset.k)}});
    });show('entrance');
  }

  /* History: the sticky photo changes with the milestone you are reading */
  const tlp=$('.tl__photo');
  if(tlp){
    const imgs=$$('img',tlp),cap=$('#tlCap'),items=$$('.tl');
    const setPh=el=>{const k=el.dataset.ph||el.dataset.era;imgs.forEach(i=>i.classList.toggle('on',i.dataset.ph===k));cap.textContent=$('time',el).textContent+' · '+$('h3',el).textContent};
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting&&!en.target.classList.contains('hide'))setPh(en.target)}),{rootMargin:'-40% 0px -50% 0px'});
    items.forEach(i=>io.observe(i));
    const fw=tlp.closest('[data-filter]');
    if(fw)$$('.chip',fw).forEach(c=>c.addEventListener('click',()=>setTimeout(()=>{const v=items.find(i=>!i.classList.contains('hide'));if(v)setPh(v)},60)));
    setPh(items[0]);
  }
})();

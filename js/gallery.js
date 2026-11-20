/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/gallery.js - GALLERY page only (pages/gallery.html)
   WHAT IT DOES:
     1. Filter chips      - show tiles by data-cat (summits / climbing / camp / video). CSS §16.
     2. Lightbox          - clicking a .tile opens #lb (full-screen). Arrow keys move, Esc closes, focus returns to the tile. CSS §19.
     3. Films             - tiles with data-yt show the YouTube thumbnail + play button. On http(s) pages it swaps in the player;
                            on pages opened from a local file YouTube blocks embeds, so it opens YouTube in a new tab instead.
   HTML IT USES: .tile .chip #lb .lb__stage .lb__cap .lb__prev .lb__next .lb__close
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Gallery: filter chips + lightbox (photos and video). Styles: css/style.css §16, §19 */
(function(){
  'use strict';
  const tiles=[...document.querySelectorAll('.tile')], lb=document.getElementById('lb');
  const stage=lb.querySelector('.lb__stage'), cap=lb.querySelector('.lb__cap');
  let cur=0, opener=null;
  const vis=()=>tiles.filter(t=>!t.classList.contains('hide'));
  /* */
  /* thumbnails that fail are replaced by the illustration in js/main.js, so every tile stays in the grid */
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(x=>{x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c)});
    tiles.forEach(t=>t.classList.toggle('hide',c.dataset.f!=='all'&&t.dataset.cat!==c.dataset.f));
  }));
  function show(i){
    const list=vis();cur=(i+list.length)%list.length;const t=list[cur];stage.textContent='';
    if(t.dataset.yt){
      /* YouTube film: show the thumbnail with a play button. On http(s) pages the button swaps in the embedded player;
         on pages opened from a local file YouTube refuses embeds (Error 153), so the button opens YouTube in a new tab instead. */
      const id=t.dataset.yt,url='https://www.youtube.com/watch?v='+id,canEmbed=/^https?:$/.test(location.protocol);
      const w=document.createElement('div');w.className='lb__video';
      const box=document.createElement('div');box.className='lb__poster';
      const img=new Image(),srcs=['https://i.ytimg.com/vi/'+id+'/hqdefault.jpg',(t.querySelector('img')||{}).src,window.AA_FB].filter(Boolean);let k=0;
      img.dataset.fb='1';img.alt=t.dataset.cap;img.onerror=()=>{if(++k<srcs.length)img.src=srcs[k]};img.src=srcs[0];
      const play=document.createElement('button');play.type='button';play.className='lb__play';play.setAttribute('aria-label','Play '+t.dataset.cap);play.textContent='▶';
      play.addEventListener('click',()=>{
        if(!canEmbed){window.open(url,'_blank','noopener');return}
        const f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1';
        f.title=t.dataset.cap;f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
        box.textContent='';box.appendChild(f);
      });
      box.appendChild(img);box.appendChild(play);
      const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className='btn btn--ghost';a.textContent='Watch on YouTube ↗';
      w.appendChild(box);w.appendChild(a);stage.appendChild(w);
    }else if(t.dataset.type==='video'){
      const v=document.createElement('video');v.controls=true;v.autoplay=true;v.poster=t.dataset.poster||'';v.src=t.dataset.src;
      v.addEventListener('error',()=>{stage.textContent='';const p=document.createElement('p');p.style.color='var(--mist)';p.textContent='This video is not available right now.';stage.appendChild(p)});
      stage.appendChild(v);
    }else{const im=new Image();im.onerror=()=>{im.onerror=null;im.src=window.AA_FB};im.src=t.dataset.src;im.alt=t.dataset.cap;stage.appendChild(im)}
    cap.textContent=t.dataset.cap+'  ·  '+(cur+1)+' / '+list.length;
  }
  function open(t){opener=t;lb.classList.add('open');document.body.style.overflow='hidden';show(vis().indexOf(t));lb.querySelector('.lb__close').focus()}
  function close(){lb.classList.remove('open');stage.textContent='';document.body.style.overflow='';if(opener)opener.focus()}
  tiles.forEach(t=>t.addEventListener('click',()=>open(t)));
  lb.querySelector('.lb__close').addEventListener('click',close);
  lb.querySelector('.lb__prev').addEventListener('click',()=>show(cur-1));
  lb.querySelector('.lb__next').addEventListener('click',()=>show(cur+1));
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
})();

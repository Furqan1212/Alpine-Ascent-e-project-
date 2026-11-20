/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/records.js - RECORDS page only (pages/records.html)
   WHAT IT DOES:
     1. Table filter      - chips (data-f = all / pk / np) hide rows of #peaks and update #peakCount. CSS §16.
     2. Compare two peaks - #vs with selects #vsA / #vsB builds bars, facts and the sentence #vsDiff from the same table rows. CSS §29.
   HTML IT USES: #peaks .chip #peakCount #vs #vsA #vsB #vsDiff
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Records table filter (Pakistan / Nepal / all). Styles: css/style.css §16 */
(function(){
  'use strict';
  const rows=[...document.querySelectorAll('#peaks tbody tr')], out=document.getElementById('peakCount');
  document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(x=>{x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c)});
    let n=0;rows.forEach(r=>{const show=c.dataset.f==='all'||r.dataset.c.includes(c.dataset.f);r.classList.toggle('hide',!show);if(show)n++});
    out.textContent='Showing '+n+' of '+rows.length+' peaks';
  }));

  /* Compare two peaks: builds from the table rows so the data lives in one place */
  const peaks=[...document.querySelectorAll('#peaks tbody tr')].map((tr,i)=>{const t=[...tr.children].map(c=>c.textContent);return {rank:+t[0],name:t[1],h:parseInt(t[2].replace(/[^0-9]/g,''),10),c:t[3],y:+t[4]}});
  const vs=document.getElementById('vs');
  if(vs&&peaks.length){
    ['A','B'].forEach((s,k)=>{const sel=vs.querySelector('[data-s='+s+'] select');peaks.forEach((p,i)=>sel.add(new Option(p.name,i)));sel.value=k===0?0:1;sel.addEventListener('change',draw)});
    function fill(s,p){
      const col=vs.querySelector('[data-s='+s+']'),bar=col.querySelector('.vs__bar');
      bar.style.setProperty('--h',Math.max(8,(p.h-8000)/(8849-8000)*100)+'%');col.querySelector('b').textContent=p.h.toLocaleString('en-US')+' m';
      col.querySelector('.vs__facts').innerHTML='<li><span>Rank</span>#'+p.rank+' of 14</li><li><span>Country</span>'+p.c+'</li><li><span>First climbed</span>'+p.y+'</li>';
    }
    function draw(){
      const a=peaks[vs.querySelector('[data-s=A] select').value],b=peaks[vs.querySelector('[data-s=B] select').value];
      fill('A',a);fill('B',b);
      const d=Math.abs(a.h-b.h),y=Math.abs(a.y-b.y),hi=a.h>=b.h?a:b,ea=a.y<=b.y?a:b;
      document.getElementById('vsDiff').textContent=a===b?'Same mountain. Pick two different peaks.':hi.name+' is '+d.toLocaleString('en-US')+' m higher'+(y?(hi===ea?', and it was also climbed '+y+' year'+(y>1?'s':'')+' earlier.':', but '+ea.name+' was climbed '+y+' year'+(y>1?'s':'')+' earlier.'):'. Both were first climbed in '+a.y+'.');
    }
    draw();
  }
})();

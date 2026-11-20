/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/checklist.js - GUIDELINES page only (pages/guidelines.html)
   WHAT IT DOES:
     The "Are you ready?" checklist: .check inputs (c1..c16) -> progress bar .meter__bar, text #checkOut, Reset #checkReset.
     Ticks are saved in localStorage "aa_checklist". CSS: §20.
   HTML IT USES: .check input .meter__bar #checkOut #checkReset
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Expedition checklist with saved progress. Styles: css/style.css §20 */
(function(){
  'use strict';
  const boxes=[...document.querySelectorAll('.check input')], bar=document.querySelector('.meter__bar'), out=document.getElementById('checkOut');
  let saved={};try{saved=JSON.parse(localStorage.getItem('aa_checklist'))||{}}catch(e){}
  function update(){
    const n=boxes.filter(b=>b.checked).length, p=Math.round(n/boxes.length*100);
    bar.style.width=p+'%';
    out.textContent=n===boxes.length?'You are fully prepared. Climb safe.':n+' of '+boxes.length+' ready ('+p+'%)';
    const s={};boxes.forEach(b=>{if(b.checked)s[b.id]=1});
    try{localStorage.setItem('aa_checklist',JSON.stringify(s))}catch(e){}
  }
  boxes.forEach(b=>{b.checked=!!saved[b.id];b.addEventListener('change',update)});
  document.getElementById('checkReset').addEventListener('click',()=>{boxes.forEach(b=>b.checked=false);update()});
  update();
})();

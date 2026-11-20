/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/quiz.js - QUIZ page only (pages/quiz.html)
   WHAT IT DOES:
     Data at the top (STYLES, Q.style, Q.safety) - edit questions there. One small engine renders both quizzes into #quizHost.
     Style quiz = weighted points -> Alpine / Ice / Expedition. Safety quiz = right/wrong with explanation, score ring, review list.
     Best safety score is kept in localStorage "aa_quiz_best". Buttons: .qtab (switch quiz), .qopt (answers). CSS: §27.
   HTML IT USES: #quizHost .qtab .qopt .qres .qbars
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Quizzes: one small engine, two quizzes (data first). Styles: css/style.css §27 */
(function(){
  'use strict';
  const host=document.getElementById('quizHost');
  const STYLES={
    alpine:{name:'Alpine climber',peak:'montblanc',peakName:'Mont Blanc',text:'You like to move light and fast on mixed ground, with the rope and the weather as your partners. Classic alpine routes reward efficiency, judgement and a love of long days.'},
    ice:{name:'Ice climber',peak:'denali',peakName:'Denali',text:'You enjoy the puzzle of steep, frozen terrain, with axes, crampons and precise movement. Ice climbing suits people who love technique and short, intense challenges.'},
    exp:{name:'Expedition climber',peak:'everest',peakName:'Mount Everest',text:'You are drawn to the great ranges and the patience they demand: weeks of acclimatisation, teamwork and one carefully chosen summit window.'}};
  const Q={
    style:{mode:'style',title:'Which climbing style suits you?',qs:[
      {q:'How do you like adventures paced?',a:[['Fast and light, one big push',{alpine:2}],['Short, technical and intense',{ice:2}],['Slow and steady, over weeks',{exp:2}]]},
      {q:'Which terrain makes your heart beat faster?',a:[['Mixed rock, snow and sharp ridges',{alpine:2}],['Frozen waterfalls and steep ice',{ice:2}],['The biggest mountains on Earth',{exp:2}]]},
      {q:'How much time can you take off?',a:[['A long weekend to a week',{ice:1,alpine:1}],['Two to three weeks',{alpine:2}],['Six weeks or more',{exp:2}]]},
      {q:'How do you feel about deep cold?',a:[['I like crisp, varied days',{alpine:1,ice:1}],['I love the cold and the technical gear',{ice:2}],['I can endure long, freezing camps',{exp:2}]]},
      {q:'What motivates you most?',a:[['Moving efficiently in beautiful places',{alpine:2}],['Solving a tricky pitch',{ice:2}],['Standing on a great summit',{exp:2}]]}]},
    safety:{mode:'safety',title:'Mountain safety quiz',qs:[
      {q:'A climber at 4,500 m has a worsening headache and nausea. What is the safest response?',a:['Keep climbing slowly','Stop going higher, rest, and descend if it worsens','Take a sleeping pill and sleep it off','Drink alcohol to relax'],c:1,why:'Symptoms of altitude illness mean you must not go higher. If they worsen, descending is the only reliable treatment.'},
      {q:'How should a team travel on a glacier?',a:['Unroped, to move faster','Roped together, with spacing between climbers','In a tight bunch to stay warm','One at a time, far apart'],c:1,why:'Crevasses are often hidden under snow. A roped, spaced team lets partners hold a fall.'},
      {q:'You begin to slide on a steep snow slope. What do you do?',a:['Roll onto your ice axe and dig the pick in (self-arrest)','Stand up and run','Grab your pack','Wait to slow down'],c:0,why:'Self-arrest uses your body weight and the axe pick to stop the slide. Practise it on safe slopes.'},
      {q:'What is a turn-around time?',a:['The time dinner is served','A fixed time to turn back, even if the summit is close','The time the sun rises','The delay between two camps'],c:1,why:'Most accidents happen late in the day or on the descent. A firm turn-around time protects you from summit fever.'},
      {q:'When is avalanche danger usually highest?',a:['After heavy new snow or fast warming, on slopes of roughly 30 to 45 degrees','On flat ground in summer','Only at night','Never on sunny days'],c:0,why:'Most avalanches release on slopes between about 30 and 45 degrees, especially after loading by snow or wind or rapid warming.'},
      {q:'Which habit helps your body acclimatise?',a:['Climb high, sleep low','Sprint to the top','Skip rest days','Avoid drinking water'],c:0,why:'Reaching a higher point in the day and sleeping lower helps your body adapt safely.'},
      {q:'Roughly where does the "death zone" begin?',a:['3,000 m','5,000 m','8,000 m','9,500 m'],c:2,why:'Above about 8,000 m the air is too thin for the body to acclimatise, so time there must be short.'},
      {q:'What is good practice for rubbish at camp?',a:['Bury it in the snow','Burn everything','Carry it all down, following local rules for waste','Leave it for the next team'],c:2,why:'High camps are fragile. Carry out everything you carry in, and follow local waste rules.'}]}};
  let cur='style',step=0,score={},ans=[],locked=false;
  const $=s=>document.querySelector(s), L=['A','B','C','D'];
  function h(html){host.innerHTML='<div class="qstep">'+html+'</div>'}
  function start(k){cur=k;step=0;score={alpine:0,ice:0,exp:0};ans=[];locked=false;
    document.querySelectorAll('.qtab').forEach(t=>t.setAttribute('aria-selected',t.dataset.q===k));render()}
  function render(){
    const q=Q[cur],item=q.qs[step],n=q.qs.length;
    const opts=item.a.map((a,i)=>'<button type="button" class="qopt" data-i="'+i+'"><i>'+L[i]+'</i><span>'+(Array.isArray(a)?a[0]:a)+'</span></button>').join('');
    h('<div class="qmeta"><span>Question '+(step+1)+' of '+n+'</span><span>'+q.title+'</span></div><div class="meter" style="margin:12px 0 0"><div class="meter__bar" style="width:'+(step/n*100)+'%"></div></div><h3 class="qq" tabindex="-1">'+item.q+'</h3><div class="qopts">'+opts+'</div><div id="qfb" aria-live="polite"></div>');
    requestAnimationFrame(()=>{const m=host.querySelector('.meter__bar');m.style.width=((step+1)/n*100)+'%'});
    host.querySelector('.qq').focus({preventScroll:true});
    host.querySelectorAll('.qopt').forEach(b=>b.addEventListener('click',()=>pick(+b.dataset.i)));
  }
  function pick(i){
    if(locked)return;const q=Q[cur],item=q.qs[step];
    if(q.mode==='style'){const w=item.a[i][1];Object.keys(w).forEach(k=>score[k]+=w[k]);next();return}
    locked=true;const ok=i===item.c;ans.push({ok,item,i});
    host.querySelectorAll('.qopt').forEach((b,k)=>{b.disabled=true;if(k===item.c)b.classList.add('correct');else if(k===i)b.classList.add('wrong')});
    const last=step===q.qs.length-1;
    $('#qfb').innerHTML='<div class="qexp"><b>'+(ok?'Correct. ':'Not quite. ')+'</b>'+item.why+'</div><div class="hero__cta" style="margin-top:22px"><button type="button" class="btn btn--primary" id="qnext">'+(last?'See my score →':'Next question →')+'</button></div>';
    $('#qnext').addEventListener('click',next);$('#qnext').focus();
  }
  function next(){locked=false;step++;step<Q[cur].qs.length?render():result()}
  function result(){
    if(cur==='style'){
      const tot=Object.values(score).reduce((a,b)=>a+b,0)||1,top=Object.keys(score).sort((a,b)=>score[b]-score[a])[0],S=STYLES[top];
      const bars=Object.keys(STYLES).map(k=>'<li><span>'+STYLES[k].name+'</span><i><em data-w="'+Math.round(score[k]/tot*100)+'"></em></i><b>'+Math.round(score[k]/tot*100)+'%</b></li>').join('');
      h('<div class="qres"><p class="eyebrow" style="justify-content:center">Your result</p><h3>'+S.name+'</h3><p>'+S.text+'</p><ul class="qbars">'+bars+'</ul><p>A good first mountain for you: <b style="color:var(--ice)">'+S.peakName+'</b>.</p><div class="hero__cta" style="justify-content:center;margin-top:20px"><a class="btn btn--primary" href="simulator.html#peak='+S.peak+'">Simulate '+S.peakName+' →</a><a class="btn btn--ghost" href="types-styles.html">Read about styles</a><button class="btn btn--ghost" type="button" id="again">Retake</button></div></div>');
      requestAnimationFrame(()=>requestAnimationFrame(()=>host.querySelectorAll('.qbars em').forEach(e=>e.style.width=e.dataset.w+'%')));
    }else{
      const n=ans.length,s=ans.filter(a=>a.ok).length,pct=s/n;let best=0;
      try{best=Math.max(+localStorage.getItem('aa_quiz_best')||0,s);localStorage.setItem('aa_quiz_best',best)}catch(e){best=s}
      const tier=s===n?['Summit-ready','Perfect score. You know the fundamentals of staying safe in the mountains.']:s>=n-2?['Strong foundations','Well done. Review the questions you missed, then read the Hazards page.']:s>=n/2?['Getting there','A decent start. Study the Hazards and Techniques pages, then try again.']:['Time to study','Safety knowledge saves lives. Read the Hazards, Techniques and Guidelines pages, then retake the quiz.'];
      const miss=ans.filter(a=>!a.ok).map(a=>'<li><b>'+a.item.q+'</b>Answer: '+a.item.a[a.item.c]+'</li>').join('');
      h('<div class="qres"><div class="gauge"><svg viewBox="0 0 120 80" role="img" aria-label="Score '+s+' out of '+n+'"><circle class="trk" cx="60" cy="42" r="30"/><circle class="arc ring" id="qring" cx="60" cy="42" r="30" transform="rotate(-90 60 42)" style="stroke-dasharray:188.5;stroke-dashoffset:188.5"/><text x="60" y="50">'+s+'/'+n+'</text></svg></div><h3>'+tier[0]+'</h3><p>'+tier[1]+'</p><p style="font-size:.85rem">Your best score on this device: '+best+'/'+n+'</p>'+(miss?'<ul class="qmiss"><li style="border:0;padding:0;color:var(--ember);font-size:.74rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600">Review</li>'+miss+'</ul>':'')+'<div class="hero__cta" style="justify-content:center;margin-top:26px"><a class="btn btn--primary" href="hazards.html">Read about hazards →</a><button class="btn btn--ghost" type="button" id="again">Retake</button></div></div>');
      requestAnimationFrame(()=>requestAnimationFrame(()=>{$('#qring').style.strokeDashoffset=188.5*(1-pct)}));
    }
    $('#again').addEventListener('click',()=>start(cur));
    host.querySelector('.qres').scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  document.querySelectorAll('.qtab').forEach(t=>t.addEventListener('click',()=>start(t.dataset.q)));
  window.__quiz={Q,STYLES};start('style');
})();

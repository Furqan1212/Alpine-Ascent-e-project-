/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/simulator.js - SIMULATOR page only (pages/simulator.html); needs data/sim-peaks.js (loaded first)
   WHAT IT DOES:
     compute(state)  - the cost / difficulty / success model (pure function, easy to test). Costs are rough estimates.
     UI              - peak buttons #peakChips + map #simMap, form #simForm, results #rTotal #rBars #dialArc #ringArc #rSeason #rRisks #rAdvice,
                       Save as Trip A/B (#saveA #saveB) -> compare table #cmp (saved in localStorage "aa_trips").
     Deep link       - simulator.html#peak=denali preselects a peak (used by the quiz result buttons). CSS: §25.
   HTML IT USES: #simForm #peakChips #simMap #rTotal #rBars #saveA #saveB #cmp
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Expedition Simulator: pure estimate model + UI. Styles: css/style.css §25. Data: data/sim-peaks.js.
   The model is illustrative, NOT statistics. */
(function(){
  'use strict';
  const P=SIM_PEAKS, $=s=>document.querySelector(s), MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const SUP=['budget','guided','premium'], EXP=['No experience','Hill walker','Some alpine climbing','High-altitude veteran'];
  const money=n=>'$'+Math.round(n).toLocaleString('en-US');
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  /* ---- the model ---- */
  function compute(s){
    const p=P.find(x=>x.id===s.peak), si=SUP.indexOf(s.support);
    const season=p.best.includes(s.month)?'best':p.shoulder.includes(s.month)?'shoulder':'out';
    const sf={best:1,shoulder:.8,out:.45}[season];
    const grp=s.group===1?1.25:s.group===2?1.1:s.group<=6?1:.95;
    const o2=p.o2&&s.oxygen;
    const items=[
      ['Government permit',p.permit],
      ['Guide and logistics',p.op[si]*grp],
      ['Flights and transfers',p.flights],
      ['Gear',p.gear*[1,.9,.6,.25][s.exp]],
      ['Insurance and rescue cover',p.ins],
      ['Bottled oxygen',o2?12000:0]
    ];
    const sub=items.reduce((a,i)=>a+i[1],0);items.push(['Contingency (10%)',sub*.1]);
    const total=sub*1.1;
    let diff=p.diff+(5-s.fit)*.25-s.exp*.5+(season==='out'?1.5:season==='shoulder'?.4:0)+(si===0?.5:si===2?-.5:0)+(p.o2&&!s.oxygen?1:0);
    diff=clamp(diff,1,10);
    let prob=p.base*(.6+.08*s.fit)*(.8+.12*s.exp)*sf*[.85,1,1.1][si]*(p.o2&&!s.oxygen?.6:1);
    prob=clamp(prob,.03,.95);
    const advice=[];
    if(season==='out')advice.push('This month is outside the usual climbing season. Weather risk rises sharply.');
    else if(season==='shoulder')advice.push('This is a shoulder month. Conditions are workable but less reliable.');
    if(s.fit<6)advice.push('Build your fitness with three to six months of loaded uphill training.');
    if(s.exp<2&&p.h>6000)advice.push('Gain experience on a smaller peak first. Many operators require it.');
    if(p.o2&&!s.oxygen)advice.push('Climbing above 8,000 m without bottled oxygen is only for elite climbers.');
    if(s.group===1)advice.push('A solo booking costs more. Joining a team lowers your price.');
    if(!advice.length)advice.push('Your plan looks well matched to this mountain. Keep training and watch the weather.');
    return {p,items,total,diff,prob,days:p.days,season,advice};
  }
  window.__simCompute=compute;
  if(typeof document==='undefined'||!document.getElementById('simForm'))return;

  /* ---- UI ---- */
  const st={peak:'everest',fit:6,exp:1,group:4,support:'guided',oxygen:true,month:5};
  const chips=$('#peakChips'),f=$('#simForm');
  P.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.id=p.id;b.innerHTML=p.name+' <small>'+p.range+'</small>';b.addEventListener('click',()=>choose(p.id,true));chips.appendChild(b)});
  const fillMonths=f.month;MONTHS.forEach((m,i)=>fillMonths.add(new Option(m,i+1)));fillMonths.value=st.month;
  EXP.forEach((m,i)=>f.exp.add(new Option(m,i)));f.exp.value=st.exp;

  let map,markers={};
  if(typeof L!=='undefined'){
    map=L.map('simMap',{scrollWheelZoom:false,dragging:!L.Browser.mobile,zoomControl:true}).setView([25,40],2);
    const topo=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{maxZoom:17,attribution:'Tiles © Esri, USGS, NOAA'}).addTo(map);
    const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:17,attribution:'Tiles © Esri'});
    let fails=0;topo.on('tileerror',()=>{if(++fails===6){map.removeLayer(topo);sat.addTo(map)}});
    P.forEach(p=>{markers[p.id]=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'pin pin--peak',iconSize:[18,18]}),title:p.name}).addTo(map)
      .bindTooltip(p.name+' · '+p.h.toLocaleString()+' m').on('click',()=>choose(p.id,false))});
  }else{const m=$('#simMap');m.style.display='grid';m.style.placeItems='center';m.textContent='Map unavailable offline. Use the mountain buttons instead.'}

  function choose(id,fly){
    st.peak=id;const p=P.find(x=>x.id===id);
    chips.querySelectorAll('.chip').forEach(c=>{const on=c.dataset.id===id;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});
    if(map&&fly)map.flyTo([p.lat,p.lng],5,{duration:1.4});
    if(map)Object.keys(markers).forEach(k=>markers[k].getElement()&&markers[k].getElement().classList.toggle('pin--sel',k===id));
    f.oxygen.disabled=!p.o2;f.oxygen.checked=p.o2?st.oxygen:false;
    $('#o2note').textContent=p.o2?'Bottled oxygen is used by most climbers above 8,000 m.':'Not needed on this mountain.';
    $('#peakName').textContent=p.name;$('#peakInfo').textContent=p.h.toLocaleString()+' m · '+p.range+' · '+p.country;
    run();
  }
  const DIAL=157.08,RING=276.46;let shown=0;
  function countTo(el,to){
    const from=shown;shown=to;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=money(to);return}
    const t0=performance.now();(function step(t){const k=Math.min((t-t0)/700,1),e=1-Math.pow(1-k,3);el.textContent=money(from+(to-from)*e);if(k<1)requestAnimationFrame(step)})(t0);
  }
  function run(){
    st.fit=+f.fit.value;st.exp=+f.exp.value;st.group=+f.group.value;st.month=+f.month.value;
    st.support=f.support.value;if(!f.oxygen.disabled)st.oxygen=f.oxygen.checked;
    $('#fitOut').textContent=st.fit+' / 10';$('#grpOut').textContent=st.group+(st.group===1?' person':' people');
    const r=compute(st);last=r;
    countTo($('#rTotal'),r.total);$('#rPer').textContent='about '+money(r.total/r.days)+' per day over '+r.days+' days';
    $('#rBars').innerHTML=r.items.filter(i=>i[1]>0).map(i=>{const pc=i[1]/r.total*100;return '<li><span>'+i[0]+'</span><b>'+money(i[1])+'</b><i style="--w:'+pc.toFixed(1)+'%"></i></li>'}).join('');
    requestAnimationFrame(()=>document.querySelectorAll('#rBars i').forEach(i=>i.classList.add('on')));
    $('#dialArc').style.strokeDashoffset=DIAL*(1-r.diff/10);$('#dialNum').textContent=r.diff.toFixed(1);
    $('#dialLbl').textContent=r.diff<4?'Moderate':r.diff<6.5?'Challenging':r.diff<8.5?'Severe':'Extreme';
    $('#ringArc').style.strokeDashoffset=RING*(1-r.prob);$('#ringNum').textContent=Math.round(r.prob*100)+'%';
    const sb=$('#rSeason');sb.className='badge badge--'+r.season;sb.textContent={best:'Best season',shoulder:'Shoulder season',out:'Out of season'}[r.season]+' · '+MONTHS[st.month-1];
    $('#rRisks').innerHTML=r.p.risks.map(x=>'<li>'+x+'</li>').join('');
    $('#rAdvice').innerHTML=r.advice.map(x=>'<li>'+x+'</li>').join('');
  }
  f.addEventListener('input',run);f.addEventListener('change',run);
  let last,trips={};try{trips=JSON.parse(localStorage.getItem('aa_trips'))||{}}catch(e){}
  function save(slot){
    trips[slot]={name:last.p.name,total:last.total,diff:last.diff,days:last.days,prob:last.prob,month:MONTHS[st.month-1]};
    try{localStorage.setItem('aa_trips',JSON.stringify(trips))}catch(e){}
    renderCmp();
  }
  function renderCmp(){
    const A=trips.A,B=trips.B,box=$('#cmp');
    if(!A&&!B){box.innerHTML='<p class="geo">Save two trips to compare them side by side.</p>';return}
    const row=(l,fn,better)=>{const a=A?fn(A):'—',b=B?fn(B):'—';let ca='',cb='';
      if(A&&B&&better){const x=better(A),y=better(B);if(x!==y){ca=x<y?'win':'';cb=y<x?'win':''}}
      return '<tr><td>'+l+'</td><td class="'+ca+'">'+a+'</td><td class="'+cb+'">'+b+'</td></tr>'};
    box.innerHTML='<div class="tbl"><table><thead><tr><th></th><th>Trip A</th><th>Trip B</th></tr></thead><tbody>'+
      row('Mountain',t=>t.name)+row('Month',t=>t.month)+row('Total cost',t=>money(t.total),t=>t.total)+row('Difficulty',t=>t.diff.toFixed(1)+' / 10',t=>t.diff)+
      row('Duration',t=>t.days+' days',t=>t.days)+row('Success chance',t=>Math.round(t.prob*100)+'%',t=>-t.prob)+'</tbody></table></div>';
  }
  $('#saveA').addEventListener('click',()=>save('A'));$('#saveB').addEventListener('click',()=>save('B'));
  $('#clearCmp').addEventListener('click',()=>{trips={};try{localStorage.removeItem('aa_trips')}catch(e){}renderCmp()});
  renderCmp();const hp=(location.hash.match(/peak=([a-z]+)/)||[])[1];choose(P.some(x=>x.id===hp)?hp:'everest',false);
})();
